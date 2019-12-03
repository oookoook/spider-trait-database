var mysql = require('mysql');
var settings = require('./settings');
var pool = mysql.createPool({
    connectionLimit: settings.db.connections,
    host: settings.db.host,
    user: settings.db.user,
    password: settings.db.password,
    database: settings.db.database
});

const addLimits = function (values, limits, table, hasWhere, aggregate, customWhereClause) {
    if(!limits) {
        return ';';
    }
    var op = '=';
    var wildcard = '';
    if (limits.search && limits.search.like) {
        op = 'LIKE';
        wildcard = '%'
    }
    var searchStart = 'WHERE';
    if (hasWhere) {
        searchStart = 'AND';
    }

    var whereClause = '';
    if(customWhereClause){
        whereClause = ` ${searchStart} ${customWhereClause}`;
    } else if(limits.search) {
        //whereClause = ` ${searchStart} ${mysql.escapeId(table+'.'+limits.search.field)} ${op} '${mysql.escape(limits.search.value)}${wildcard}'`;
        whereClause = ` ${searchStart} ?? ${op} ?`;
        values.push(table+'.'+limits.search.field);
        values.push(`${limits.search.value}${wildcard}`);
    }

    //console.log(`${whereClause} ${orderClause} LIMIT ${limits.offset},${limits.limit};`);
    if(aggregate){
        return `${whereClause};`
    }
    var orderClause = '';
    var direction = "ASC";
    if(limits.sort) {
        if(limits.sort.direction && limits.sort.direction.toLowerCase()=="desc") {
            direction = "DESC";
        }
        orderClause = `ORDER BY ?? ${direction}`;
        values.push(table+'.'+limits.sort.field);
    }
    return `${whereClause} ${orderClause} LIMIT ${limits.offset},${limits.limit};`
}
/*
{
table, 
limits, 
sql, 
values, 
nestTables,
hasWhere    
}
*/


const query = function (opt) {
    return new Promise(function (resolve, reject) {
        //console.log(opt);
        if(!opt.values) {
            opt.values = [];
        }
        pool.query({
            nestTables: opt.nestTables,
            sql: opt.sql + addLimits(opt.values, opt.limits, opt.table, opt.hasWhere, opt.aggregate, opt.customWhereClause),
            values: opt.values
        }, function (error, results, fields) {
            if (error) {
                reject(error);
            }
            resolve(results, fields);
        });
    });
}

const getConnection = function () {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (error, connection) {
            if (error) {
                reject(error);
            }
            resolve(connection);

        })
    });
}

const cquery = function (c, opt) {
    return new Promise(function (resolve, reject) {
        c.query({
            nestTables: opt.nestTables,
            sql: opt.sql + addLimits(opt.values, opt.limits, opt.table, opt.hasWhere, opt.aggregate, opt.customWhereClause),
            values: opt.values
        }, function (error, results, fields) {
            if (error) {
                reject(error);
            }
            resolve(results, fields);
        });
    });
}

const releaseConnection = function (c) {
    c.release();
}

const limits = function (req, res, next) {
    var offset = 0;
    var limit = 10;
    var count = true;
    if (req.query.limit && req.query.offset) {
        limit = parseInt(req.query.limit);
        offset = parseInt(req.query.offset);
        count = (req.query.count && req.query.count == 'true');
    }
    req.recordLimit = {
        offset,
        limit,
        count
    }

    if (req.query.searchField && req.query.searchValue) {
        req.recordLimit.search = {
            field: req.query.searchField,
            value: req.query.searchValue,
            like: req.query.searchLike && req.query.searchLike == 'true'
        };
    }

    if (req.query.sortField) {
        req.recordLimit.sort = {
            field: req.query.sortField,
            direction: req.query.sortDirection ? req.query.sortDirection : 'asc'
        };
    }

    next();
}

const prepareListResponse = async function (limits, table, customWhereClause, customWhereValues, join) {
    var res = {
        items: null,
        limit: limits.limit,
        offset: limits.offset,
        count: null
    };
    if (limits.count) {
        // count is limited when using filter
        var r = await query({table, sql: `SELECT COUNT(${table}.id) as count FROM ${join ? join : table}`, limits, aggregate: true, customWhereClause, values: customWhereValues});
        var count = r[0].count;
        //console.dir(count);
        res.count = count;
    }
    return res;
}

const createEntity = async function (body, table, prepareForSql, validate) {
    var obj = body;
    if (typeof validate == 'function') {
        var vr = validate(obj);
        if (!vr) {
            throw 'Object validation failed';
        }
    }
    prepareForSql(obj);
    var r = await d.query({table, sql: `INSERT INTO ${table} SET ?`, values: [obj] });
    return {
        id: r.insertId
    }
}

const deleteEntity = async function (params, table) {
    var id = parseInt(params.id);
    var r = await d.query({table, sql: `DELETE FROM \`${table}\` WHERE id=?`, values: [id] });
    return {
        id
    }
}

const updateEntity = async function (params, body, table, prepareForSql, validate) {
    var id = parseInt(params.id);
    var obj = body;
    if (obj.id && id != obj.id) {
        console.log(`IDs in params and body does not match for entity in table ${table} : ${id} ${obj.id}`);
        console.dir(obj);
        throw 'IDs in params and body does not match'
    }
    if (typeof validate == 'function') {
        var vr = validate(obj);
        if (!vr) {
            throw 'Object validation failed';
        }
    }
    prepareForSql(obj);
    var r = await d.query({table, sql: `UPDATE \`${table}\` SET ? WHERE id = ?`, values: [obj, id] });
    return {
        id
    }
}

module.exports = {
    query,
    cquery,
    getConnection,
    releaseConnection,
    limits,
    prepareListResponse,
    createEntity,
    updateEntity,
    deleteEntity
}