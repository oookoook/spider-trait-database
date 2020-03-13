const shortid = require('shortid');

var jobs = {};

const gjs = function(j) {
    return {
        id: j.id,
        state: j.state,
        start: j.start,
        owner: j.owner
    }
}

const createJob = function(owner, total, func, params) {
    var jobId = shortid.generate();
    var state = { total, progress: 0, errors: [], completed: false, aborted: false }
    // passes the state to the function
    params.state = state;
    jobs[jobId] = { owner, state, promise: func(params), start: new Date().valueOf() };
}

const getJob = function(id) {
    return gjs(jobs[id]);
    
}

/*
const getJobForUser = function(owner) {
    return gjs(jobs.find((j) => j.owner == owner));
}
*/

const listJobs = function(owner) {
    return Object.keys(jobs).map(id => gjs(jobs[id])).filter(j => owner == null || j.owner == owner);
}

const removeJob = function(id) {
    delete(jobs[id]);
}



module.exports = {
    createJob,
    getJob,
    listJobs,
    removeJob
}