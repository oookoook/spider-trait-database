const getJobUpdate = function (ojs, njs) {
  return {
    id: njs.id,
    progress: Math.floor(njs.state.progress / njs.state.total * 100),
    completed: njs.state.completed,
    aborted: njs.state.aborted,
    title: ojs.title,
    start: ojs.start,
    errors: njs.state.errors
  };
}

export default {
  namespaced: false,
  state: {
    job: null,
    allJobs: null
  },
  mutations: {
    job(state, payload) {
      state.job = payload.value;
    },
    allJobs(state, payload) {
      state.allJobs = payload.value;
    }
  },
  getters: {
    job: (state) => state.job,
    allJobs: (state) => state.allJobs
  },
  actions: {
    refreshJob: async function (context, payload) {
      var j = context.getters.job;
      if (j.completed) {
        context.commit('job', {
          value: null
        });
        return;
      }
      if (j.aborted) {
        console.dir(j.state.errors);
        context.dispatch('notify', {
          error: true,
          text: 'The job was aborted.'
        });
        context.commit('job', {
          value: null
        });
      }
      var p = {};
      p.endpoint = `jobs`;
      p.params = j.id;
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
      if (payload.job) {
        context.commit('job', {
          value: payload.job
        });
      } else if (payload.title) {
        var j = {
          id: null,
          progress: 0,
          title: payload.title,
          start: Date.now(),
          completed: false,
          aborted: false
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
