const jm = require('../util/job-manager');

const hasRights = function(job, auth) {
    return auth.isEditor || job.owner == auth.sub || job.owner == null;
}

const list = async function(auth) {
    if(auth.isAEditor) {
        return { jobs: jm.listJobs() };
    } else {
        return {
            jobs: jm.listJobs(auth.sub)
        };
    }
    
}

const get = async function(params, auth) {
    var job = jm.getJob(params.id)
    var r = hasRights(job, auth);
    if(r) {
        return { job };
    }
}

const remove = async function(params, auth) {
    var id = params.id;
    var job = jm.getJob(id);
    var r = hasRights(job, auth);
    if(r) {
        jm.removeJob(id)
    }
    return { id };
}

module.exports = {
    get,
    remove,
    list
}