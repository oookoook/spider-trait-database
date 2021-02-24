const crypto = require('crypto');

var claims;

var apiSecret;

/* This is not bulletproof, but sufficient for now */

const generateApiKey = function(auth) {
    const hash = crypto.createHash('sha256');
    hash.update(`${auth.sub}${apiSecret}`);
    return hash.digest('base64');
}

const verifyKey = function(header) {
    if(!header) {
        return false;
    }
    // remove 'Basic '
    var token = header.substr(6);
    try {
        var decoded = Buffer.from(token, 'base64').toString().split(':', 2);
        const hash = crypto.createHash('sha256');
        hash.update(`${decoded[0]}${apiSecret}`);
        return hash.digest('base64') == decoded[1];
    } catch(e) {
        console.error(e);
        return false;
    }
}

const resourcesAuth = function (req, res, next) {
    
    //console.dir(claims);
    //console.dir(req.openid ? req.openid : 'no oidc present');
    //console.dir((req.openid && req.openid.user) ? req.openid.user : 'no openid user');
    var groups = req.openid.user && req.openid.user[claims.name] ? req.openid.user[claims.name] : [];
    var sub = req.openid && req.openid.user && req.openid.user.sub ? req.openid.user.sub : null;
    req.resourcesAuth = {
        sub, 
        name: req.openid && req.openid.user && req.openid.user.name ? req.openid.user.name : sub, 
        isAdmin: groups.includes(claims.administration),
        isEditor: groups.includes(claims.dataValidation),
        isContributor: groups.includes(claims.dataEntry),
        validApiKey: verifyKey(req.header('authorization'))
    }
    //console.dir(req.resourcesAuth);
    next();
}

const isAdmin = function (req, res, next) {
    if(req.resourcesAuth.isAdmin) {
        next();
    } else {
        res.sendStatus(403);
    }
  };

const isEditor = function (req, res, next) {
    if(req.resourcesAuth.isEditor) {
        next();
    } else {
        res.sendStatus(403);
    }
}

const isContributor = function (req, res, next) {
    if(req.resourcesAuth.isContributor) {
        next();
    } else {
        res.sendStatus(403);
    }
}

const setClaims = function(c) {
    claims = c;
}

const setApiHashSecret = function(s) {
    apiSecret = s;
}

var mockupLogin;

const mockupAuth = function(returnPath, returnPathLogout) {
    return function (req, res, next) {    
    req.openid = { user: {
        sub: mockupLogin,
        name: mockupLogin,
    }};
    if(mockupLogin) {
        req.openid.user[claims.name] = [claims.administration, claims.dataEntry, claims.dataValidation].join(',');
    }
    res.openid = {
        login: (opts) => {
            mockupLogin = 'DEBUG';
            res.redirect(returnPath);
        },
        logout: (opts) => {
            mockupLogin = null;
            res.redirect(returnPathLogout);
        }
    };
    
    next();
}
}

module.exports = {
    resourcesAuth,
    isAdmin,
    isEditor,
    isContributor,
    setClaims,
    mockupAuth,
    setApiHashSecret,
    generateApiKey
}