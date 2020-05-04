const shortid = require('shortid');

var jobs = {};

const gjs = function(id, j) {
    if(!j) {
        return {
            id,
            state: {
                aborted: true,
                progress: 1,
                total: 1,
                errors: ['Job not found - job was already deleted or server was restarted']
            }
        }
    }
    return {
        id: id,
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
    return jobId;
}

const getJob = function(id) {
    var j = jobs[id];
    if(j && (j.state == 'completed' || j.state == 'aborted')) {
        removeJob(id);
    }
    return gjs(id, j);
    
}

/*
const getJobForUser = function(owner) {
    return gjs(jobs.find((j) => j.owner == owner));
}
*/

const listJobs = function(owner) {
    return Object.keys(jobs).map(id => gjs(id, jobs[id])).filter(j => owner == null || j.owner == owner);
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