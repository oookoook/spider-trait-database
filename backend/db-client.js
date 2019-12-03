var mysql = require('mysql');
var settings = require('./settings');
var pool  = mysql.createPool({
  connectionLimit: settings.db.connections,
  host: settings.db.host,
  user: settings.db.user,
  password: settings.db.password,
  database: settings.db.database
});

const query = function(sql, values, nestTables) {
    return new Promise(function(resolve, reject) {
    pool.query({ nestTables, sql, values }, function (error, results, fields) {
        if (error) { 
            reject(error);
        }
        resolve(results, fields);
      });
    });
}

const getConnection = function() {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(error, connection) {
            if (error) { 
                reject(error);
            }
            resolve(connection);
        
        })
    });
}

const cquery = function(c, sql, values, nestTables) {
    return new Promise(function(resolve, reject) {
        c.query({ nestTables, sql, values }, function (error, results, fields) {
            if (error) { 
                reject(error);
            }
            resolve(results, fields);
          });
        });
}

const releaseConnection = function(c) {
    c.release();
}

const limits = function(req, res, next) {
    if(req.query.limit && req.query.offset) {
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        req.recordLimit = { limit, offset, count: (req.query.count && req.query.count=='true') }
    } 
    else {
        req.recordLimit = { offset: 0, limit: 10, count: true }
    }
    next();
}

const prepareListResponse = async function(limits, table) {
    var res = {items: null, limit: limits.limit, offset: limits.offset, count: null };
    if(limits.count) {
        var r = await query(`SELECT COUNT(id) as count FROM ${table}`);
        var count = r[0].count;
        console.dir(count);
        res.count = count;
    }
    return res;
}

const createEntity = function(body, table, prepareForSql) {
    var obj = body;
    prepareForSql(obj);
    var r = await d.query(`INSERT INTO ${table} SET ?`, obj);
    obj.id = r.insertId;
    return {
        item: obj
    }
}

const deleteEntity = function(params) {
    var id = parseInt(params.id);
    var r = await d.query(`DELETE FROM \`${table}\` WHERE id=?`, id);
    return {
        id
    }
}

const updateEntity = function(params, body, table, prepareForSql) {
    var id = parseInt(params.id);
    var obj = body;
    if(obj.id && id != obj.id) {
        console.log(`IDs in params and body does not match for entity in table ${table} : ${id} ${obj.id}`);
        console.dir(obj);
        throw 'IDs in params and body does not match'
    }
    prepareForSql(obj);
    var r = await d.query(`UPDATE \`${table}\` SET ? WHERE id = ?`, obj, [id]);
    obj.id = r.insertId;
    return {
        item: obj
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

