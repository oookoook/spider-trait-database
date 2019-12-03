const resourcesAuth = function (req, res, next) {
    req.resourcesAuth = {
        isAdmin: true,
        isEditor: true,
        isContributor: true
    }
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

module.exports = {
    resourcesAuth,
    isAdmin,
    isEditor,
    isContributor
}