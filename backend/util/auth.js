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
    req.resourcesAuth = checkRights(req.oidc?.user, req.appSession, req.header('authorization'));
    //console.dir(req.resourcesAuth);
    next();
}

const checkRights = function(user, session, header) {
    let groups = session?.claims?.[claims.name] ?? [];
    let sub = user?.sub;
    return {
        sub, 
        name: user?.name ?? sub, 
        isAdmin: groups.includes(claims.administration),
        isEditor: groups.includes(claims.dataValidation),
        isContributor: groups.includes(claims.dataEntry),
        validApiKey: verifyKey(header)
    }
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
    req.oidc = { user: {
        sub: mockupLogin,
        name: mockupLogin,
    }};
    req.oidc.isAuthenticated = () => mockupLogin ? true : false
    if(mockupLogin) {
        // old req.oidc.user[claims.name] = [claims.administration, claims.dataEntry, claims.dataValidation].join(',');
        req.appSession = { claims: { [claims.name]: [claims.administration, claims.dataEntry, claims.dataValidation].join(',') }};
    }
    res.oidc = {
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
    checkRights,
    isAdmin,
    isEditor,
    isContributor,
    setClaims,
    mockupAuth,
    setApiHashSecret,
    generateApiKey
}