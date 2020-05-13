module.exports = function (endpoint, tableName, dbClient, referencingTables) {
    var db = null;
    var table = null;
    var refs = null;

    const list = async function (limits) {
        var res = await db.prepareListResponse(limits, table);

        var results = await db.query({
            table,
            sql: `SELECT id, name FROM ??`,
            values: [table],
            limits
        });
        res.items = results.map(r => {
            return {
                id: r.id,
                name: r.name
            };
        });


        return res;
    }

    const get = async function (params) {
        var id = parseInt(params.id);
        var results = await db.query({
            table,
            sql: 'SELECT id, name FROM ?? WHERE id = ?',
            values: [table, id]
        });
        var r = results[0];
        return {
            item: {
                id: r.id,
                name: r.name
            }
        }
    }

    // validate trait - check if abbrev is unique
    const validate = async function (item) {
        if (!item.name || item.name == 0) {
            return 'Name cannot be empty';
        }

        return true;
    }

    const prepareForSql = function (item) {}

    const create = async function (body, auth) {
        return await db.createEntity({
            body,
            table,
            auth,
            prepareForSql,
            validate
        });
    }

    const update = async function (params, body, auth) {
        return await db.updateEntity({
            params,
            body,
            table,
            auth,
            prepareForSql,
            validate
        });
    }

    const remove = async function (params, auth) {
        return await db.deleteEntity({
            params,
            auth,
            refs
        });
    }

    db = dbClient;
    table = tableName;
    refs = referencingTables;
    db.addSynonyms(endpoint, table, []);
    return {
        list,
        get,
        create,
        update,
        remove,
    }
}