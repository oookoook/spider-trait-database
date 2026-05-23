// Orders enum endpoint — mirrors the enums.js helper pattern but uses
// VARCHAR primary keys (id === name, e.g. 'Araneae') instead of INT auto-increment.
// The generic createEntity / updateEntity / deleteEntity helpers from db-client
// all call parseInt(params.id) and rely on insertId, so they cannot be used here.

module.exports = function (dbClient) {
    const db = dbClient;
    const table = 'order';
    const endpoint = 'orders';

    const list = async function (limits) {
        const res = await db.prepareListResponse(limits, table);
        const results = await db.query({
            table,
            sql: 'SELECT id, name FROM ??',
            values: [table],
            limits
        });
        res.items = results.map(r => ({ id: r.id, name: r.name }));
        return res;
    };

    const get = async function (params) {
        // id is VARCHAR (e.g. 'Araneae') — do NOT parseInt
        const id = params.id;
        const results = await db.query({
            table,
            sql: 'SELECT id, name FROM ?? WHERE id = ?',
            values: [table, id]
        });
        const r = results[0];
        return { item: { id: r.id, name: r.name } };
    };

    const validate = async function (item) {
        if (!item.name || item.name.length === 0) {
            return 'Name cannot be empty';
        }
        return true;
    };

    const create = async function (body, auth) {
        const vr = await validate(body);
        if (vr !== true) {
            return { error: 'validation', validation: vr };
        }
        // id and name hold the same value — the scientific order name
        const name = body.name.trim();
        await db.query({
            table,
            sql: 'INSERT INTO `order` (`id`, `name`) VALUES (?, ?)',
            values: [name, name]
        });
        return { id: name, entity: { id: name, name } };
    };

    const update = async function (params, body, auth) {
        const vr = await validate(body);
        if (vr !== true) {
            return { error: 'validation', validation: vr };
        }
        // id (PK) is immutable; only the display name can be updated
        const id = params.id;
        await db.query({
            table,
            sql: 'UPDATE `order` SET `name` = ? WHERE `id` = ?',
            values: [body.name, id]
        });
        return { id, entity: { id, name: body.name } };
    };

    const remove = async function (params, auth) {
        const id = params.id;
        // Check all tables that hold a FK to order.id before allowing deletion.
        // Column names differ from the generic '{table}_id' convention used by
        // deleteEntity in db-client, so we handle this explicitly.
        const refChecks = [
            { table: 'taxonomy',     field: 'order'    },
            { table: 'reference',    field: 'order_id' },
            { table: 'location',     field: 'order_id' },
            { table: 'dataset',      field: 'order_id' },
            { table: 'trait_order',  field: 'order_id' },
            { table: 'method_order', field: 'order_id' },
        ];
        for (const ref of refChecks) {
            const cntres = await db.query({
                table: ref.table,
                sql: 'SELECT COUNT(*) AS cnt FROM ?? WHERE ?? = ?',
                values: [ref.table, ref.field, id]
            });
            if (parseInt(cntres[0].cnt) > 0) {
                return {
                    error: 'validation',
                    validation: `The order is referenced in table ${ref.table} ${cntres[0].cnt} times.`
                };
            }
        }
        await db.query({
            table,
            sql: 'DELETE FROM `order` WHERE `id` = ?',
            values: [id]
        });
        return { id };
    };

    db.addSynonyms(endpoint, table, []);
    return { list, get, create, update, remove };
};
