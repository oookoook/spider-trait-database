var claims;

const resourcesAuth = function (req, res, next) {
    req.resourcesAuth = {
        sub: req.oidc && req.oidc.user && req.oidc.user.sub ? req.oidc.user.sub : null, 
        name: req.oidc && req.oidc.user && req.oidc.user.sub ? req.oidc.user.sub : null, 
        isAdmin: true,
        isEditor: true,
        isContributor: true
    }
    console.dir(claims);
    console.dir(req.oidc? req.oidc.user : 'no oidc present');
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