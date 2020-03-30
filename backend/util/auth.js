var claims;

const resourcesAuth = function (req, res, next) {
    
    //console.dir(claims);
    //console.dir(req.openid ? req.openid : 'no oidc present');
    console.dir((req.openid && req.openid.user) ? req.openid.user : 'no openid user');
    var groups = req.openid.user[claims.name];
    req.resourcesAuth = {
        sub: req.openid && req.openid.user && req.openid.user.sub ? req.openid.user.sub : null, 
        name: req.openid && req.openid.user && req.openid.user.sub ? req.openid.user.sub : null, 
        isAdmin: groups.includes(claims.administration),
        isEditor: groups.includes(claims.dataValidation),
        isContributor: groups.includes(claims.dataEntry)
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

const mockupAuth = function(returnPath) {
    return function (req, res, next) {    
    req.openid = { user: {
        sub: 'DEBUG',
        name: 'DEBUG',
    }};
    res.openid = {
        login: (opts) => {
        res.redirect(returnPath);
        }
    };
    req.openid.user[claims.name] = [claims.administration, claims.dataEntry, claims.dataValidation].join(',');
    next();
}
}

module.exports = {
    resourcesAuth,
    isAdmin,
    isEditor,
    isContributor,
    setClaims,
    mockupAuth
}