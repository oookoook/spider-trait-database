const fs = require('fs/promises');
const {mkdirSync, mkdtempSync} = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

module.exports = (db, settings) => {
    const maxSize = settings.files.referencePdf.sizeLimitMB * 1024 * 1024;
    const parseUpload = (req, res, next) => {
        if (!req.is('multipart/form-data')) return res.sendStatus(400);
        let directory;
        try {
            mkdirSync(settings.files.tmpDir, {recursive: true});
            directory = mkdtempSync(path.join(settings.files.tmpDir, 'reference-pdf-'));
        } catch (error) {
            console.error('PDF temporary directory failed:', error.code);
            return res.sendStatus(500);
        }
        const cleanup = () => fs.rm(directory, {recursive: true, force: true}).catch(error => console.error('PDF temporary cleanup failed:', error.code));
        res.once('close', cleanup);
        req.once('aborted', cleanup);
        try {
            fileUpload({useTempFiles: true, tempFileDir: directory, abortOnLimit: true,
                limits: {fileSize: maxSize, files: 2, fields: 1, parts: 3}})(req, res, next);
        } catch (error) {
            res.sendStatus(400);
        }
    };
    const uploadError = (error, req, res, next) => {
        if (!res.headersSent) res.sendStatus(error.status || 400);
    };
    const validId = id => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
    const metadata = row => ({id: row.id, filename: row.filename, sizeBytes: row.size_bytes, uploadedAt: row.uploaded_at});
    const findReference = async id => {
        const rows = await db.query({sql: 'SELECT id FROM reference WHERE id = ?', values: [id]});
        return rows.length > 0;
    };
    const failure = (res, error) => {
        console.error('Reference PDF operation failed:', error.code || 'unknown error');
        res.sendStatus(500);
    };
    const checkId = (req, res) => {
        if (validId(req.params.id)) return true;
        res.sendStatus(400);
        return false;
    };
    const cache = res => res.set('Cache-Control', 'private, no-store');

    const getMetadata = async (req, res) => {
        if (!checkId(req, res)) return;
        cache(res);
        try {
            if (!await findReference(req.params.id)) return res.sendStatus(404);
            const rows = await db.query({sql: 'SELECT id, filename, size_bytes, uploaded_at FROM reference_pdf WHERE reference_id = ?', values: [req.params.id]});
            res.json({item: rows.length ? metadata(rows[0]) : null});
        } catch (error) { failure(res, error); }
    };
    const download = async (req, res) => {
        if (!checkId(req, res)) return;
        cache(res);
        try {
            const rows = await db.query({sql: 'SELECT filename, content FROM reference_pdf WHERE reference_id = ?', values: [req.params.id]});
            if (!rows.length) return res.sendStatus(404);
            const filename = rows[0].filename;
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="download.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}`,
                'X-Content-Type-Options': 'nosniff'
            });
            res.send(rows[0].content);
        } catch (error) { failure(res, error); }
    };
    const upload = async (req, res) => {
        if (!checkId(req, res)) return;
        try {
            if (!await findReference(req.params.id)) return res.sendStatus(404);
            const files = req.files ? Object.keys(req.files) : [];
            const file = req.files && req.files.pdf;
            if (files.length !== 1 || !file || Array.isArray(file) || Object.keys(req.body || {}).length) return res.sendStatus(400);
            if (file.truncated || file.size > maxSize) return res.sendStatus(413);
            if (!file.size || !file.tempFilePath) return res.sendStatus(400);
            const filename = path.basename(file.name.replace(/\\/g, '/')).replace(/[\x00-\x1f\x7f]/g, '');
            if (!filename || Buffer.byteLength(filename, 'utf8') > 255) return res.sendStatus(400);
            const content = await fs.readFile(file.tempFilePath);
            if (content.length > maxSize || content.length !== file.size) return res.sendStatus(413);
            if (!filename.toLowerCase().endsWith('.pdf') || !['application/pdf', 'application/octet-stream', ''].includes(file.mimetype || '') || content.subarray(0, 5).toString() !== '%PDF-') return res.sendStatus(415);
            await db.query({sql: 'INSERT INTO reference_pdf (reference_id, filename, size_bytes, uploaded_at, content) VALUES (?, ?, ?, NOW(), ?) ON DUPLICATE KEY UPDATE filename = VALUES(filename), size_bytes = VALUES(size_bytes), uploaded_at = VALUES(uploaded_at), content = VALUES(content)', values: [req.params.id, filename, content.length, content]});
            const rows = await db.query({sql: 'SELECT id, filename, size_bytes, uploaded_at FROM reference_pdf WHERE reference_id = ?', values: [req.params.id]});
            res.json({item: metadata(rows[0])});
        } catch (error) { failure(res, error); }
    };
    const remove = async (req, res) => {
        if (!checkId(req, res)) return;
        try {
            if (!await findReference(req.params.id)) return res.sendStatus(404);
            await db.query({sql: 'DELETE FROM reference_pdf WHERE reference_id = ?', values: [req.params.id]});
            res.sendStatus(204);
        } catch (error) { failure(res, error); }
    };
    return {getMetadata, download, parseUpload, uploadError, upload, remove};
};