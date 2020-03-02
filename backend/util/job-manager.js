const { v4: uuidv4 } = require('uuid');

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
    var jobId = uuidv4();
    var state = { total, progress: 0, errors: [], completed: false, aborted: false }
    // passes the state to the function
    params.state = state;
    jobs[jobId] = { owner, state, promise: func(params), start: new Date().valueOf() };
}

const getJob = function(id) {
    return gjs(jobs[id]);
    
}


const listJobs = function() {
    return Object.keys(jobs).map(id => gjs(jobs[id]));
}

const removeJob = function(id) {
    delete(jobs[id]);
}



module.exports = {
    createJob,
    getJob,
    listJobs,
    removeJob,
}