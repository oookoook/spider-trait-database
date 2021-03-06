const mysql = require('mysql');
const settings = require('../settings');
const shortid = require('shortid');

var releaseWatcher = {};

var pool = mysql.createPool({
    connectionLimit: settings.db.connections,
    host: settings.db.host,
    user: settings.db.user,
    password: settings.db.password,
    database: settings.db.database
});

pool.on('release', function (connection) {
    //console.log(`Conn ${connection.threadId} released`);
    if(releaseWatcher[connection.threadId])
    {
        console.log(`Conn ${connection.threadId} has callback`);
        var f = releaseWatcher[connection.threadId];
        delete(releaseWatcher[connection.threadId]);
        f();
    }
    //console.log('Connection %d released', connection.threadId);
});



var synonyms = {
    endpoints: {}
};

const addLimits = function (values, limits, table, hasWhere, aggregate, customWhereClause) {
    if(!limits) {
        return ';';
    }
    var op = '=';
    var wildcardS = '';
    var wildcardE = '';
    if (limits.search && limits.search.like) {
        op = 'LIKE';
        wildcardS = limits.search.fromStart ? '%' : '';
        wildcardE = '%';
    }
    var searchStart = 'WHERE';
    if (hasWhere) {
        searchStart = 'AND';
    }

    var whereClause = '';
    if(customWhereClause){
        whereClause = ` ${searchStart} ${customWhereClause}`;
    } else {
        whereClause = ` ${searchStart} 1=1`;
    }
    if(limits.search) {
        //whereClause = ` ${searchStart} ${mysql.escapeId(table+'.'+limits.search.field)} ${op} '${mysql.escape(limits.search.value)}${wildcard}'`;
        //console.log(`has search: `);
        //console.dir(limits.search);
        whereClause += ` AND ?? ${op} ?`;
        
        //console.log(`${table} ${limits.search.field} ${getSynonym(table, limits.search.field)}`);
        values.push(getSynonym(table, limits.search.field));
        values.push(`${wildcardS}${limits.search.value}${wildcardE}`);
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
        values.push(getSynonym(table, limits.sort.field));
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

const getQueryParams = function(opt) {
    //console.dir(opt);
    if(!opt.values) {
        opt.values = [];
    }
    return {
        nestTables: opt.nestTables,
        sql: opt.sql + addLimits(opt.values, opt.limits, opt.table, opt.hasWhere, opt.aggregate, opt.customWhereClause),
        values: opt.values
    };
}

const query = function (opt) {
    return new Promise(function (resolve, reject) {
        //console.log(opt);
        pool.query(getQueryParams(opt), function (error, results, fields) {
            if (error) {
                reject(error);
            }
            resolve(results, fields);
        });
    });
}

const cquery = function (c, opt) {
    return new Promise(function (resolve, reject) {
        c.query(getQueryParams(opt), function (error, results, fields) {
            if (error) {
                reject(error);
            }
            resolve(results, fields);
        });
    });
}

const squery = function (c, opt) {
    return c.query(getQueryParams(opt));
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

const releaseConnection = function (c, callback) {
    if(callback) {
        //console.log('Conn release watcher added');
        releaseWatcher[c.threadId] = callback;
    }
    c.release();
}

const endPool = function() {
    return new Promise(function (resolve, reject) {
        pool.end(function (err) {
            resolve();
        });
    });
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
        var v = req.query.searchValue;
        if(v === 'true') {
            v = 1;
        }
        if(v === 'false') {
            v = 0;
        }
        req.recordLimit.search = {
            field: req.query.searchField,
            value: v,
            like: req.query.searchLike && req.query.searchLike == 'true',
            fromStart: req.query.searchFromStart && req.query.searchFromStart == 'true'
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

const prepareListResponse = async function (limits, table, customWhereClause, customWhereValues, join, distinctCols) {
    var res = {
        items: null,
        limit: limits.limit,
        offset: limits.offset,
        count: null
    };
    if (limits.count && !distinctCols) {
        // count is limited when using filter
        var r = await query({table, sql: `SELECT COUNT(${table}.id) as count FROM ${join ? join : table}`, limits, aggregate: true, customWhereClause, values: customWhereValues});
        var count = r[0].count;
        res.count = count;
    } else if (limits.count && distinctCols) {
        //console.log(`Preparing distinct response ${distinctCols} ${join ? join : table}`);
        //var r = await query({table, sql: `SELECT COUNT(*) as count FROM ( SELECT DISTINCT ${distinctSql} FROM ${join ? join : table}) ${table}`, limits, aggregate: true, customWhereClause, values: customWhereValues});
        //console.log(`SELECT COUNT(DISTINCT ${distinctCols.map(c => `COALESCE(${c}, '')`).join(',')}) as COUNT FROM ${join ? join : table}`);
        var r = await query({table, sql: `SELECT COUNT(DISTINCT ${distinctCols.map(c => `COALESCE(${c}, '')`).join(',')}) as count FROM ${join ? join : table}`, limits, aggregate: true, customWhereClause, values: customWhereValues});
        var count = r[0].count;
        res.count = count;
    }
    
    return res;
}

const getAutocomplete = async function(endpoint, valueField, textField, search, count, searchByValue, searchFromStart) {
    
    var qt = getSynonym(endpoint); 
    var vf = getSynonym(endpoint, valueField);
    var vfparts = vf.split('.');
    if(vfparts.length > 1) {
        qt = vfparts[0];
    }
    
    //console.log(`endpoint ${endpoint} table ${qt} valueField ${valueField} textField ${textField} search ${search} count ${count}`)
    //console.dir(vfparts);
    var values = [];
    var sql = '';
    var textSql = null;
    var countSql = '';
    var st = '%';
    if(searchByValue && search) {
        st = search;
    } else if(search && searchFromStart) {
        st = `${search}%`;
    } else if(search) {
        st = `%${search}%`;
    }

    values.push(vf);

    if(textField && Array.isArray(textField)) {        
        textSql = 'TRIM(CONCAT(' + textField.map(f =>`COALESCE(??,'')`).join(`,' - ',`) + '))';
        var syn = textField.map(f => getSynonym(endpoint,f));
        values = values.concat(syn); // ?? AS TEXT
        values.push(qt); // FROM ??
        if(!searchByValue) {
            values = values.concat(syn); // WHERE ??    
        } else {
            values.push(vf); // WHERE ??
        }
        values.push(st); // LIKE ? or = ?
        values = values.concat(syn); // ORDER BY ?? 
    } else if(textField && typeof textField == 'string') {
        textSql = '??';
        var syn = getSynonym(endpoint, textField);
        values.push(syn); // ?? as text
        values.push(qt); // FROM ??
        if(!searchByValue) {
            values.push(syn); // WHERE ??
        } else {
            values.push(vf);
        }
        values.push(st); // LIKE ?
        values.push(syn); // ORDER BY ??
    } else {
        textSql = '??';
        var syn = getSynonym(endpoint, valueField);
        values.push(syn); // ?? as text
        values.push(qt); // FROM ??
        values.push(syn); // WHERE ??
        values.push(st); // LIKE ?
        values.push(syn); // ORDER BY
    }
    
    if(count) {
        var countSql = 'LIMIT 0,?';
        values.push(count);
    }
    if(textSql && searchByValue) {
        sql = `SELECT DISTINCT ?? as value, ${textSql} as text FROM ?? WHERE ?? = ? ORDER BY ${textSql} ${countSql}`;
    } else if(textSql) {
        sql = `SELECT DISTINCT ?? as value, ${textSql} as text FROM ?? WHERE ${textSql} LIKE ? ORDER BY ${textSql} ${countSql}`;
    } else if(searchByValue) {
        sql = `SELECT DISTINCT ?? as value FROM ?? WHERE ?? = ? ORDER BY ?? ${countSql}`;
    } else {
        sql = `SELECT DISTINCT ?? as value FROM ?? WHERE ?? LIKE ? ORDER BY ?? ${countSql}`;
    }
    //console.log(typeof textField);
    //console.dir(textField);
    //console.log(textSql);
    //console.log(sql);
    //console.dir(values);
    var r = await query({sql, values});
    //console.log(`${r.text} ${typeof r.text}`)
    r.forEach(i => {
    if(i.text && typeof i.text != 'string') {
        //console.log('casting text');
        i.text = i.text.toString();
    }
    });
    return r;
}

const createEntity = async function (opts) {
    var {body, table, auth, prepareForSql, validate} = opts;
    var obj = body;
    await prepareForSql(obj, auth);
    if (typeof validate == 'function') {
        var vr = await validate(obj);
        if (vr !== true) {
            return { 
                error: 'validation',
                validation: vr
            }
        }
    }
    delete(obj.id);
    //console.dir(obj);
    var r = await query({table, sql: `INSERT INTO ${table} SET ?`, values: [obj] });
    obj.id = r.insertId; 
    return {
        id: r.insertId,
        entity: obj
    }
}

const getAuthWhere = function(auth) {
    var aw = "";

    if(auth && auth.isEditor) {
        return aw;
    }
    
    if(auth) {
        // if auth is set, we have to check the sub attribute and add the clause
        aw = `AND sub = ${mysql.escape(auth.sub)}`;
    }
    return aw;
}

const deleteEntity = async function (opts) {
    var {params, table, auth, refs, validate} = opts;
    var id = parseInt(params.id);

    if(!refs) {
        refs = ['import', 'data'];
    }

    var conn = await getConnection();
    var canDelete = true;
    var err = '';
    for(var i = 0; i < refs.length; i++) {
        var reftbl = typeof refs[i] === 'string' ? refs[i] : refs[i].table;
        var reffld = typeof refs[i] === 'string' ? `${table}_id` : refs[i].field;
        var cntres = await cquery(conn, {table: reftbl, sql: `SELECT COUNT(id) as cnt FROM ?? WHERE ?? = ?`, values: [ reftbl, reffld, id]});
        var cnt = parseInt(cntres[0].cnt);
        if (cnt > 0) {
            err += `The entity is referenced in the table ${refs[i]} ${cnt} times.`
            canDelete = false;
        }        
    }

    if(!canDelete) {
        releaseConnection(conn);
        return { 
            error: 'validation',
            validation: err
        }
    }

    if(typeof(validate) == 'function') {
        var vr = await validate(id);
        if (vr !== true) {
            console.log('Delete validation failed');
            return { 
                error: 'validation',
                validation: vr
            }
        }
    }

    var r = await cquery(conn, {table, sql: `DELETE FROM ${table} WHERE id=? ${getAuthWhere(auth)}`, values: [id] });
    releaseConnection(conn);
    if(r.affectedRows > 0) {
        return {
            id
        }
    } else {
        throw 'No record was deleted';
    }
    
}

const updateEntity = async function (opts) {
    var { params, body, table, auth, prepareForSql, validate } = opts;
    var id = parseInt(params.id);
    var obj = body;
    prepareForSql(obj, auth);
    if (obj.id && id != obj.id) {
        console.log(`IDs in params and body does not match for entity in table ${table} : ${id} ${obj.id}`);
        console.dir(obj);
        throw 'IDs in params and body does not match'
    }
    if (typeof validate == 'function') {
        var vr = await validate(obj);
        //console.dir(vr);
        if (vr !== true) {
            return { 
                error: 'validation',
                validation: vr
            }
        }
    }
    
    // we don't want to update the id
    delete(obj.id);
    //console.dir(obj);
    var r = await query({table, sql: `UPDATE \`${table}\` SET ? WHERE id = ? ${getAuthWhere(auth)}`, values: [obj, id] });
    obj.id = id;
    return {
        id,
        entity: obj
    }
}

const unique = function(val) {
    if(val && val.length > 0) {
        return `${val}-${shortid.generate()}`;
    } else {
        return shortid.generate();
    }
    
}

const addSynonyms = function(endpoint, mainTable, tableSynonyms) {
    synonyms[mainTable] = tableSynonyms;
    synonyms.endpoints[endpoint] = mainTable;
}

const getSynonym = function(table, field) {
    //console.dir(synonyms);
    //console.log(table);
    //console.log(field);
    
    if(!field) {
        return synonyms.endpoints[table] || table;
    }
    
    if(!synonyms[table] && !synonyms.endpoints[table]) {
        //console.log('Not found');
        return field;
    }

    if(synonyms[table] && synonyms[table][field]) {
        //console.log(`match: ${table} ${field}`);
        return synonyms[table][field];
    }


    if(synonyms[table] && !synonyms[table][field] && field.indexOf('.') == -1) {
        // this is just a field name
        return `${table}.${field}`;
    }

    if(synonyms[table] && !synonyms[table][field] && field.indexOf('.') > 0) {
        // this is a fully qualified name
        return field;
    }

    var t = getSynonym(table);

    if(t) {
        //console.log(`table match: ${table} ${t} ${field}`);
        //return `${t}.${field}`;
        return getSynonym(t, field);
    }
    //console.log(`no match: ${table} ${field}`);
    return field;
    
}

module.exports = {
    query,
    cquery,
    squery,
    getConnection,
    releaseConnection,
    endPool,
    limits,
    prepareListResponse,
    createEntity,
    updateEntity,
    deleteEntity,
    getAutocomplete,
    addSynonyms,
    escape: mysql.escape,
    escapeId: mysql.escapeId,
    unique
}