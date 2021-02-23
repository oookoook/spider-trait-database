var claims;

const resourcesAuth = async function (req, res, next) {
    
    //console.dir(claims);
    //console.dir(req.openid ? req.openid : 'no oidc present');
    //console.dir((req.openid && req.openid.user) ? req.openid.user : 'no openid user');
    console.log(`accessToken in resourcesAuth: ${JSON.stringify(req.oidc.accessToken)}`);
    console.log(`claims: ${JSON.stringify(req.oidc.user)}`);
    //trying to fix this for the v2 of oidc client
    if(req.oidc.user || Object.keys(req.oidc.user).length == 0) {
        console.log(`Getting user info...`);
        const additionalUserClaims = await req.oidc.fetchUserInfo();
        Object.assign(req.oidc.user, additionalUserClaims);
    }
    var groups = req.oidc.user && req.oidc.user[claims.name] ? req.oidc.user[claims.name] : [];
    var sub = req.oidc && req.oidc.user && req.oidc.user.sub ? req.oidc.user.sub : null;
    req.resourcesAuth = {
        sub, 
        name: req.oidc && req.oidc.user && req.oidc.user.name ? req.oidc.user.name : sub, 
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

const mockupAuth = function(returnPath, returnPathLogout) {
    return function (req, res, next) {    
    req.oidc = { user: {
        sub: 'DEBUG',
        name: 'DEBUG',
    }};
    res.oidc = {
        login: (opts) => {
        res.redirect(returnPath);
        },
        logout: (opts) => {
            res.redirect(returnPathLogout);
        }
    };
    req.oidc.user[claims.name] = [claims.administration, claims.dataEntry, claims.dataValidation].join(',');
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