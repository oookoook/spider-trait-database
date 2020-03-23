const getJobUpdate = function (ojs, njs) {
  return {
    id: njs.id,
    title: ojs.title,
    start: ojs.start,
    state: {
      progress: Math.min(100, Math.floor(njs.state.progress / njs.state.total * 100)),
      completed: njs.state.completed,
      aborted: njs.state.aborted,
      errors: njs.state.errors
    }
  };
}

export default {
  namespaced: false,
  state: {
    job: null,
    allJobs: null,
    errors: null,
  },
  mutations: {
    job(state, payload) {
      state.job = payload.value;
    },
    allJobs(state, payload) {
      state.allJobs = payload.value;
    },
    errors(state, payload) {
      state.errors = payload.value;
    }
  },
  getters: {
    job: (state) => state.job,
    allJobs: (state) => state.allJobs,
    errors: (state) => state.errors
  },
  actions: {
    refreshJob: async function (context, payload) {
      var j = context.getters.job;
      context.commit('errors', {
        value: j.state.errors.map((e,i) => {return {text: e, id: i}})
      });
      if (j.state.completed) {
        context.commit('job', {
          value: null
        });
        return;
      }
      if (j.state.aborted) {
        console.dir(j.state.errors);
        context.dispatch('notify', {
          error: true,
          text: 'The job was aborted.'
        });
        context.commit('job', {
          value: null
        });
        return;
      }
      var p = {};
      p.endpoint = `jobs`;
      p.params = j.id;
      if(!j.id || j.id=='local') {
        // if there is no ID, it's local job, there is nothing to update from the backend
        return;
      }
      var data = await context.dispatch('get', p, {
        root: true
      });
      if (data) {
        context.commit('job', {
          value: getJobUpdate(j, data.job)
        });
      }
    },

    updateJob: async function (context, payload) {
      if (payload.job) {
        context.commit('job', {
          value: getJobUpdate(context.getters.job, payload.job)
        });
      } else {
        context.commit('job', {
          value: null
        });
      }
    },

    createJob: async function (context, payload) {
      // reset the errors
      context.commit('errors', {
        value: null
      });
      if (payload.job) {
        context.commit('job', {
          value: payload.job
        });
      } else if (payload.title) {
        var j = {
          id: null,
          
          title: payload.title,
          start: Date.now(),
          state: 
          { progress: 0,
            completed: false,
            aborted: false,
            errors: []
          }
        }
        context.commit('job', {
          value: j
        });
      }
    },

    getJobs: async function (context, payload) {
      var p = {};
      p.auth = true;
      p.endpoint = 'jobs';

      var data = await context.dispatch('get', p, {
        root: true
      });
      if (data) {
        context.commit('allJobs', {
          value: data.jobs
        });
        var user = context.rootGetters.user;
        var currJob = data.jobs.find(j => j.owner == user.sub);
        if (currJob) {
          context.commit('job', {
            value: currJob
          });
        }
      }
    },
  },
}
