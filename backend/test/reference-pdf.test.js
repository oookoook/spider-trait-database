const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const referencePdf = require('../api/reference-pdf');
const references = require('../api/references');

const limit = 20 * 1024 * 1024;
const response = () => ({
    status: null, headers: {}, body: null,
    set(name, value) { Object.assign(this.headers, typeof name === 'string' ? {[name]: value} : name); return this; },
    sendStatus(status) { this.status = status; return this; },
    json(body) { this.status = 200; this.body = body; return this; },
    send(body) { this.status = 200; this.body = body; return this; }
});
const fixture = () => {
    let attachment = null;
    const db = {
        async query({sql, values}) {
            if (sql.startsWith('SELECT id FROM reference')) return Number(values[0]) === 1 ? [{id: 1}] : [];
            if (sql.startsWith('INSERT INTO reference_pdf')) {
                attachment = {id: 9, filename: values[1], size_bytes: values[2], uploaded_at: new Date(), content: values[3]};
                return {affectedRows: 1};
            }
            if (sql.startsWith('DELETE FROM reference_pdf')) { attachment = null; return {affectedRows: 1}; }
            if (sql.startsWith('SELECT filename, content')) return attachment ? [attachment] : [];
            if (sql.startsWith('SELECT id, filename')) return attachment ? [attachment] : [];
            throw Error(`Unexpected query: ${sql}`);
        }
    };
    return {handlers: referencePdf(db, {files: {referencePdf: {sizeLimitMB: 20}}}), attachment: () => attachment};
};
const request = file => ({params: {id: '1'}, files: file ? {pdf: file} : null, body: {}});

test('reference list exposes PDF availability without attachment contents', async () => {
    const db = {
        addSynonyms() {},
        async prepareListResponse() { return {count: 2}; },
        async query({sql}) {
            assert.match(sql, /LEFT JOIN reference_pdf ON reference_pdf.reference_id = reference.id/);
            assert.doesNotMatch(sql, /reference_pdf.content/);
            return [
                {id: 1, abbrev: 'First', full_citation: 'First citation', doi: null, has_pdf: 1},
                {id: 2, abbrev: 'Second', full_citation: 'Second citation', doi: null, has_pdf: 0}
            ];
        }
    };
    const result = await references(db).list({});
    assert.equal(result.count, 2);
    assert.deepEqual(result.items.map(item => item.hasPdf), [true, false]);
});

test('PDF upload, metadata, download and idempotent deletion', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-test-'));
    try {
        const filename = path.join(directory, 'test.pdf');
        const bytes = Buffer.from('%PDF-1.4\nvalid test content');
        await fs.writeFile(filename, bytes);
        const {handlers, attachment} = fixture();
        const upload = response();
        await handlers.upload(request({name: '..\\unsafe\nname.pdf', mimetype: 'application/octet-stream', size: bytes.length, tempFilePath: filename}), upload);
        assert.equal(upload.status, 200);
        assert.equal(upload.body.item.filename, 'unsafename.pdf');
        assert.equal(crypto.createHash('sha256').update(attachment().content).digest('hex'), crypto.createHash('sha256').update(bytes).digest('hex'));
        const meta = response();
        await handlers.getMetadata(request(), meta);
        assert.equal(meta.body.item.sizeBytes, bytes.length);
        assert.equal(meta.headers['Cache-Control'], 'private, no-store');
        const download = response();
        await handlers.download(request(), download);
        assert.deepEqual(download.body, bytes);
        assert.equal(download.headers['Content-Type'], 'application/pdf');
        assert.equal(download.headers['X-Content-Type-Options'], 'nosniff');
        await handlers.remove(request(), response());
        const empty = response();
        await handlers.getMetadata(request(), empty);
        assert.deepEqual(empty.body, {item: null});
        const repeat = response();
        await handlers.remove(request(), repeat);
        assert.equal(repeat.status, 204);
    } finally { await fs.rm(directory, {recursive: true, force: true}); }
});

test('PDF size, signature and malformed input reject without replacing existing bytes', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-test-'));
    try {
        const filename = path.join(directory, 'test.pdf');
        const {handlers, attachment} = fixture();
        const exact = Buffer.alloc(limit);
        exact.write('%PDF-1.4');
        await fs.writeFile(filename, exact);
        const file = {name: 'test.pdf', mimetype: 'application/pdf', size: limit, tempFilePath: filename};
        const accepted = response();
        await handlers.upload(request(file), accepted);
        assert.equal(accepted.status, 200);
        for (const [changes, expected] of [
            [{size: limit + 1}, 413], [{truncated: true}, 413], [{size: 0}, 400],
            [{name: 'not-pdf.txt'}, 415], [{mimetype: 'image/png'}, 415]
        ]) {
            const rejected = response();
            await handlers.upload(request({...file, ...changes}), rejected);
            assert.equal(rejected.status, expected);
            assert.equal(attachment().content.length, limit);
        }
        const missing = response();
        await handlers.upload(request(), missing);
        assert.equal(missing.status, 400);
        const multiple = response();
        await handlers.upload({...request([file, file])}, multiple);
        assert.equal(multiple.status, 400);
        const invalid = response();
        await handlers.download({params: {id: '1abc'}}, invalid);
        assert.equal(invalid.status, 400);
        const noReference = response();
        await handlers.getMetadata({params: {id: '2'}}, noReference);
        assert.equal(noReference.status, 404);
    } finally { await fs.rm(directory, {recursive: true, force: true}); }
});

test('replacement preserves target PDF or transfers source PDF across all attachment states', async () => {
    for (const sourceHasPdf of [false, true]) for (const targetHasPdf of [false, true]) {
        const statements = [];
        const linkUpdates = [];
        const attachments = new Map();
        if (sourceHasPdf) attachments.set(1, {id: 11, content: 'source'});
        if (targetHasPdf) attachments.set(2, {id: 22, content: 'target'});
        let released = 0;
        const connection = {};
        const db = {
            addSynonyms() {},
            async getConnection() { return connection; },
            releaseConnection(value) { assert.equal(value, connection); released++; },
            async cquery(value, {sql, values}) {
                assert.equal(value, connection);
                statements.push(sql);
                if (sql.startsWith('SELECT id FROM reference')) return [{id: 1}, {id: 2}];
                if (/^UPDATE (import|data|trait|method) /.test(sql)) linkUpdates.push({sql, values});
                if (sql.startsWith('UPDATE reference_pdf') && attachments.has(1) && !attachments.has(2)) {
                    attachments.set(2, attachments.get(1));
                    attachments.delete(1);
                }
                return {affectedRows: 1};
            },
            async deleteEntity({connection: supplied}) {
                assert.equal(supplied, connection);
                attachments.delete(1);
                return {id: 1};
            }
        };
        const result = await references(db).replace({id: '1', replacement: '2'}, null);
        assert.deepEqual(result, {id: 1});
        assert.equal(released, 1);
        assert.equal(attachments.has(1), false);
        assert.equal(attachments.get(2)?.content, targetHasPdf ? 'target' : sourceHasPdf ? 'source' : undefined);
        for (const table of ['import', 'data', 'trait', 'method']) {
            assert.ok(statements.includes(`UPDATE ${table} SET reference_id = ? WHERE reference_id = ?`));
            assert.deepEqual(linkUpdates.find(update => update.sql.startsWith(`UPDATE ${table} `)).values, [2, 1]);
        }
    }
});

test('replacement reassigns links and releases connection on late failure', async () => {
    let released = 0;
    const updates = [];
    const connection = {};
    const db = {
        addSynonyms() {},
        async getConnection() { return connection; },
        releaseConnection(value) { assert.equal(value, connection); released++; },
        async cquery(value, {sql}) {
            assert.equal(value, connection);
            if (sql.startsWith('SELECT id FROM reference')) return [{id: 1}, {id: 2}];
            if (sql.startsWith('UPDATE')) updates.push(sql);
            return {affectedRows: 1};
        },
        async deleteEntity() { throw Error('late deletion failure'); }
    };
    const replace = references(db).replace;
    assert.equal((await replace({id: '01', replacement: '1'})).error, 'validation');
    assert.equal(released, 0);
    await assert.rejects(replace({id: '1', replacement: '2'}), /late deletion failure/);
    assert.ok(updates.some(sql => sql.startsWith('UPDATE trait')));
    assert.ok(updates.some(sql => sql.startsWith('UPDATE method')));
    assert.equal(released, 1);
});