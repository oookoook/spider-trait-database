const axios = require('axios');
const settings = require('../settings');


const convertDataset = (dataset, year, event) => {
    let title = dataset.name;
    let records = dataset.records;
    authors = dataset.authors.split(',').map(a => {
        let affiliation = null;
        let nameIdentifiers = [];
        let name = a.trim();
        let givenName = null;
        let familyName = null;
        // affiliation
        if(/\(.+\)/.test(name)) {
            let match = name.match(/\((.+)\)/);
            affiliation = { name: match[1].trim() };
            name = name.replace(match[0], '').trim();
        }
        // orcid
        if(/\[.+\]/.test(name)) {
          let match = name.match(/\[(.+)\]/);
          nameIdentifiers.push({
            "schemeUri": "https://orcid.org",
            "nameIdentifier": `https://orcid.org/${match[1].trim()}`,
            "nameIdentifierScheme": "ORCID"
          });
          name = name.replace(match[0], '').trim();
        }
        let names = name.split(' ');
        if(names.length > 1) {
         givenName = names.slice(1).join(' '); 
        }
        familyName = names[0];
        let author = {
            name,
            givenName,
            familyName,
            affiliation,
            nameIdentifiers
        };
        return author;
    });
    let url = `${settings.baseUrl}/datasets/${dataset.id}`;
    if(!year) {
      year = new Date(dataset.date).getFullYear();
    }

    return {
        title,
        authors,
        url,
        year,
        event,
        records
    }
}

const getEditUrl = (doi) => {
  return `${settings.dataCite.editUrl}/dois/${encodeURIComponent(doi)}/edit`;
}

const createDoi = async ({title, authors, url, year, records, event}) => {
/*
https://api.test.datacite.org/dois
{
  "data": {
    "type": "dois",
    "attributes": {
      "prefix": "10.82248",
      "creators": [{
        "name": "Adam Kučera"
      }],
      "titles": [{
        "title": "Testovací Doi 1"
      }],
      "publisher": "Masaryk University",
      "publicationYear": 2022,
      "types": {
        "resourceTypeGeneral": "Dataset"
      },
      "url": "https://spidertraits.sci.muni.cz/datasets/1"
    }
  }
}
*/
    let data = {
        "data": {
          "type": "dois",
          "attributes": {
            "prefix": settings.dataCite.prefix,
            "creators": authors,
            "titles": [{
              "title": title
            }],
            "publisher": settings.dataCite.publisher,
            "publicationYear": year,
            "types": {
              "resourceTypeGeneral": "Dataset"
            },
            "sizes": [ `${records} records` ],
            "url": url
          }
        }
      }
    
    if(settings.dataCite.commonAttributes) {
      Object.assign(data.data.attributes, settings.dataCite.commonAttributes);
    }
      
    if(event) {
      data.data.attributes.event = event;
    }
    let res = await axios.post('/dois', data, {
        baseURL: settings.dataCite.url,
        auth: {
            username: settings.dataCite.user,
            password: settings.dataCite.password,
            headers: {
                'Content-Type': 'application/vnd.api+json'
            }
        } 
    });
    if(res.status == 201) {
        return {
          id: res.data.data.id,
          url: getEditUrl(res.data.data.id) 
        }
    } else {
        throw `Creating DOI failed: [${res.data.errors.map(e => e.title).join(',')}]`;
    }
}

const getDoi = async (id) => {
    let res = await axios.get(`/dois/${id}`, {
        baseURL: settings.dataCite.url,
        auth: {
            username: settings.dataCite.user,
            password: settings.dataCite.password,
            headers: {
                'Content-Type': 'application/vnd.api+json'
            }
        } 
    });
    if(res.status == 200) {
      let doir = res.data.data;
      doir.editUrl = getEditUrl(id);
      doir.spidertraits = { 
        name: doir.attributes.titles[0].title,
        authors: doir.attributes.creators.map(a => { 
            let o = a.name;
            if(a.nameIdentifiers[0]) {
              o = `${o} [${a.nameIdentifiers[0].nameIdentifier.replace(a.nameIdentifiers[0].schemeUri + '/', '')}]` 
            }
            if(a.affiliation[0]) {
                o = `${o} (${a.affiliation[0]})`
            }
            
            return o; 
        }).join(', ')
      }; 
      return doir;
    } else {
        console.error(`Getting DOI failed: [${res.data.errors.map(e => e.title).join(',')}]`);
        return false;
    }
}

const isPublished = async (id) => {
    let doi = await getDoi(id);
    return doi.attributes.state != 'draft';
}

module.exports = {
    convertDataset,
    createDoi,
    getDoi,
    isPublished,
    getEditUrl
}