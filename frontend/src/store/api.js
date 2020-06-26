import Vue from 'vue';

const baseUrl = `${process.env.VUE_APP_BACKEND}backend/` //Vue.config.devtools ? 'http://localhost:3000/backend/' : '/backend/';

const getUrl = function(payload) {
    return `${baseUrl}${payload.endpoint}${payload.params ? '/' + payload.params : ''}`;
}

const getListParams = function(payload) {
    //console.debug('listParams:');
    //console.dir(payload);
    /*
    if(!payload.list) {
        return {};
    }
    */
    /*
    limit=10 +
    offset=10 +
    sortField=abbrev + 
    sortDirection=desc +
    searchField=abbrev +
    searchValue=Tro + 
    searchLike=true +
    count=true +
    */
    var offset = (payload.options.page == -1) ? 0 : (payload.options.page - 1) * payload.options.itemsPerPage;
    var limit = (payload.options.itemsPerPage == -1) ? payload.currCount : payload.options.itemsPerPage;
    var searchField = payload.searchField;
    var searchValue = payload.search;
    var searchLike = payload.searchLike ? true : false;
    var searchFromStart = payload.searchFromStart ? true : false;
    var count = payload.count;
    var sortField = (payload.options.sortBy && payload.options.sortBy[0]) ? payload.options.sortBy[0] : null;
    var sortDirection = (payload.options.sortDesc && payload.options.sortDesc[0]) ? 'desc' : 'asc';

    //sortField = adjustSortField(sortField);

    var params = {};
    // 0 for offset is a valid value
    if(offset != null && limit) {
        params.offset = offset;
        params.limit = limit;
    }
    if(searchValue != null) {
        params.searchField = searchField;
        params.searchValue = searchValue;
        params.searchLike = searchLike;
        params.searchFromStart = searchFromStart;
    }
    if(count) {
        params.count = true;
    }
    if(sortField) {
        params.sortField = sortField;
        params.sortDirection = sortDirection;
    }
    //console.dir(params);
    return params;
}


const authenticate = function(context, payload) {
    var authRequired = payload.auth;
    
    if(authRequired) {
        /*
        console.log(lastAction);
        console.log(sessionTimeout);
        console.log(lastAction + sessionTimeout);
        console.log(Date.now());
        console.log((lastAction + sessionTimeout) > Date.now());
        */ 
        if(context.dispatch('verifySession', { required: true })) {
            context.commit('lastAction', {value: Date.now()});
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    } else {
        return Promise.resolve(true);
    }
}

export default {
    state: {
        lastCall: 0,
        baseUrl
    },
    getters: {
        baseUrl(state) {
            return state.baseUrl;
        }
    },
    actions: {

        list: async function(context, payload) {
            var url = getUrl(payload);
            if(!await authenticate(context, payload)) {
                return false;
            }
            try {
                var params = getListParams(payload);
                var result = await Vue.http.get(url, { params });
                return result.body;
            } catch (err) {
                console.error(err);
                context.dispatch('notify', { error: true, text: `Unable to get records.`});
                return false;
            }
        },

        get: async function(context, payload) {
            var url = getUrl(payload);
            if(!await authenticate(context, payload)) {
                return false;
            }
            try {
                var result = await Vue.http.get(url, { params: payload.query });
            return result.body;
            } catch (err) {
                console.error(err);
                context.dispatch('notify', { error: true, text: `Unable to get record.`});
                return false;
            }
        },

        post: async function(context, payload) {
            var url = getUrl(payload);
            if(!await authenticate(context, payload)) {
                return false;
            }
            try {
                var result = await Vue.http.post(url, payload.body, { params: payload.query });
                if(result.body.error) {
                    if(result.body.error == 'validation') {
                        context.dispatch('notify', { error: true, text: result.body.validation});
                    }
                }
                return result.body;
            } catch (err) {
                console.error(err);
                context.dispatch('notify', { error: true, text: `Unable to create record.`});
                return false;
            }
        },

        put: async function(context, payload) {
            var url = getUrl(payload);
            if(!await authenticate(context, payload)) {
                return false;
            }
            try {
                var result = await Vue.http.put(url, payload.body, { params: payload.query });
                if(result.body.error) {
                    if(result.body.error == 'validation') {
                        context.dispatch('notify', { error: true, text: result.body.validation});
                    }
                }
                return result.body;
            } catch (err) {
                console.error(err);
                context.dispatch('notify', { error: true, text: `Unable to update record.`});
                return false;
            }
        },
        delete: async function(context, payload) {
            var url = getUrl(payload);
            if(!await authenticate(context, payload)) {
                return false;
            }
            try {
                var result = await Vue.http.delete(url, { params: payload.query });
                if(result.body.error) {
                    if(result.body.error == 'validation') {
                        context.dispatch('notify', { error: true, text: result.body.validation});
                    }
                }
                return result.body;
            } catch (err) {
                console.error(err);
                context.dispatch('notify', { error: true, text: `Unable to delete record.`});
                return false;
            }
        }
    }
}