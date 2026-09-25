const {test, mock} = require('node:test');
const assert = require('node:assert/strict');
const mysql = require('mysql');

const calls = [];
let acquired = 0;
let released = 0;
let failQuery = false;
const connection = {
    query(options, callback) {
        calls.push(options.sql);
        if (failQuery) return callback(new Error('query failed'));
        callback(options.sql.startsWith('SELECT COUNT') ? null : null,
            options.sql.startsWith('SELECT COUNT') ? [{cnt: 0}] : {affectedRows: 1});
    },
    release() { released++; }
};
const pool = {
    on() {},
    getConnection(callback) { acquired++; callback(null, connection); },
    query(options, callback) { calls.push(options.sql); callback(null, {affectedRows: 1}); }
};
mock.method(mysql, 'createPool', () => pool);
const db = require('../util/db-client');

test('deleteEntity owns only connections it acquires', async () => {
    const opts = {params: {id: '1'}, table: 'reference', refs: [], connection};
    assert.deepEqual(await db.deleteEntity(opts), {id: 1});
    assert.equal(acquired, 0);
    assert.equal(released, 0);

    assert.deepEqual(await db.deleteEntity({...opts, connection: undefined}), {id: 1});
    assert.equal(acquired, 1);
    assert.equal(released, 1);

    assert.deepEqual(await db.deleteEntity({...opts, connection: undefined, validate: () => 'blocked'}),
        {error: 'validation', validation: 'blocked'});
    assert.equal(released, 2);

    failQuery = true;
    await assert.rejects(db.deleteEntity({...opts, connection: undefined}), /query failed/);
    assert.equal(released, 3);
    await assert.rejects(db.deleteEntity(opts), /query failed/);
    assert.equal(released, 3);
    failQuery = false;
});

test('updateEntity runs SQL on the supplied connection or the pool', async () => {
    calls.length = 0;
    const opts = {params: {id: '1'}, body: {abbrev: 'A'}, table: 'reference', prepareForSql() {}, connection};
    assert.equal((await db.updateEntity(opts)).id, 1);
    assert.equal(acquired, 3);
    assert.equal(released, 3);
    assert.equal(calls.length, 1);

    assert.equal((await db.updateEntity({...opts, body: {abbrev: 'B'}, connection: undefined})).id, 1);
    assert.equal(calls.length, 2);
    assert.equal(acquired, 3);
    assert.equal(released, 3);

    assert.deepEqual(await db.updateEntity({...opts, body: {abbrev: 'C'}, validate: () => 'blocked'}),
        {error: 'validation', validation: 'blocked'});
    assert.equal(calls.length, 2);
});