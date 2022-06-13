export default {
    methods: {
        parseAuthors(authors) {
            if(!authors) {
                return [];
            }
            return authors.split(',').map(a => {
                let name = a.trim();
                let affiliation = null;
                let orcid = null;
                // affiliation
                if(/\(.+\)/.test(name)) {
                    let match = name.match(/\((.+)\)/);
                    affiliation = match[1].trim();
                    name = name.replace(match[0], '').trim();
                }
                // orcid
                if(/\[.+\]/.test(name)) {
                    let match = name.match(/\[(.+)\]/);
                    orcid = match[1].trim();
                    name = name.replace(match[0], '').trim();
                }
                return {
                    name,
                    affiliation,
                    orcid
                }
            });
        }
    }
}