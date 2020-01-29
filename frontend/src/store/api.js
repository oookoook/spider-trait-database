import Vue from 'vue';

const baseUrl = 'http://localhost:3000/backend/';

const getUrl = function(payload) {
    return `${baseUrl}${payload.endpoint}${payload.id ? '/' + payload.id : ''}`;
}

const getListParams = function(payload) {
    console.dir(payload);
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
    var count = payload.count;
    var sortField = (payload.options.sortBy && payload.options.sortBy[0]) ? payload.options.sortBy[0] : null;
    var sortDirection = (payload.options.sortDesc && payload.options.sortDesc[0]) ? 'desc' : 'asc';

    var params = {};
    // 0 for offset is a valid value
    if(offset != null && limit) {
        params.offset = offset;
        params.limit = limit;
    }
    if(searchValue) {
        params.searchField = searchField;
        params.searchValue = searchValue;
        params.searchLike = true;
    }
    if(count) {
        params.count = true;
    }
    if(sortField) {
        params.sortField = sortField;
        params.sortDirection = sortDirection;
    }

    return params;
}

const authenticate = function(payload) {
    if(payload.auth) {
        /* TODO */
        return Promise.resolve(true);
    } else {
        return Promise.resolve(true);
    }
}

export default {
    state: {
        lastCall: 0,
    },
    actions: {

        get: async function(context, payload) {
            var url = getUrl(payload);
            if(!await authenticate(payload)) {
                context.dispatch('notify', { error: true, text: 'You are not authorized for this action.'});
                return false;
            }
            try {
            var params = getListParams(payload);
            var result = await Vue.http.get(url, { params });
            return result.body;
            } catch (err) {
                console.error(err);
                context.dispatch('notify', { error: true, text: 'Unable to connect to the backend.'});
            }
        }
    }
}