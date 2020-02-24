var claims;

const resourcesAuth = function (req, res, next) {
    req.resourcesAuth = {
        sub: req.openid && req.openid.user && req.openid.user.sub ? req.openid.user.sub : null, 
        name: req.openid && req.openid.user && req.openid.user.sub ? req.openid.user.sub : null, 
        isAdmin: true,
        isEditor: true,
        isContributor: true
    }
    console.dir(claims);
    //console.dir(req.openid ? req.openid : 'no oidc present');
    console.dir((req.openid && req.openid.identity) ? req.openid.identity : 'no openid identity');
    console.dir((req.identity) ? req.identity : 'no req identity');
    console.dir((req.identity && req.identity.claims) ? req.identity.claims : 'no req identity');
    console.dir(req.resourcesAuth);
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

module.exports = {
    resourcesAuth,
    isAdmin,
    isEditor,
    isContributor,
    setClaims
}