export default {
    namespaced: true,
    state: {
    },
    getters: {
      
    },
    mutations: {
      
    },
    actions: {
        async create(context, payload) {
            return await context.dispatch('post', {endpoint: `datasets/${payload.id}/doi` }, { root: true });
        },
        async get(context, payload) {
            let doi = await context.dispatch('get', {endpoint: `datasets/${payload.id}/doi` }, { root: true });
            
            return doi.spidertraits;
            /*
            {
                "id": "10.82248/g57g-rz52",
                "type": "dois",
                "attributes":{
                "doi": "10.82248/g57g-rz52",
                "prefix": "10.82248",
                "suffix": "g57g-rz52",
                "identifiers":[],
                "alternateIdentifiers":[],
                "creators":[
                    {"name": "Adam Kučera", "nameType": null, "givenName": null, "familyName": null,…},
                    {
                        "name": "Pekar, Stano",
                        "nameType": "Personal",
                        "givenName": "Stano",
                        "familyName": "Pekar",
                        "affiliation":[],
                        "nameIdentifiers":[
                            {
                                "schemeUri": "https://orcid.org",
                                "nameIdentifier": "https://orcid.org/0000-0002-0197-5040",
                                "nameIdentifierScheme": "ORCID"
                            }
                        ]
                    }
                ],
                "titles":[
                {"title": "Testovací Doi 1"}
                ],
                ...
                }
            */
        }
    }
  }
  