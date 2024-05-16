module.exports = {
    port: 8089,
    frontend:  {
        path: '/.../frontend/dist'
    },
    https: {
        enable: true,
        key: '/etc/letsencrypt/live/spidertraits.sci.muni.cz/privkey.pem',
        crt: '/etc/letsencrypt/live/spidertraits.sci.muni.cz/fullchain.pem',
        passphrase: null
    },
    oidc: {
        client: 'TODO',
        issuer: 'https://id.muni.cz/oidc',
        secret: 'TODO',
        url: 'https://spidertraits.sci.muni.cz',
        session: {
            secret: 'TODO'
        },
        claims: {
            name: 'eduperson_entitlement',
            administration: 'urn:geant:muni.cz:res:spider-trait-db-administration#idm.ics.muni.cz',
            dataValidation: 'urn:geant:muni.cz:res:spider-trait-db-data-validation#idm.ics.muni.cz',
            dataEntry: 'urn:geant:muni.cz:res:spider-trait-db-data-entry#idm.ics.muni.cz'
        }
    },
    db: {
        connections: 10,
        host: 'localhost',
        user: 'app',
        password: 'TODO',
        database: 'spider_traits_db'
    },
    files: {
        tmpDir: '/var/tmp',
        sourceDir: '/opt/spidertraits/sourceData',
        import: {
            sizeLimitMB: 100
        }
    },
    mail: {
        sender: 'spidertraits@sci.muni.cz',
        admins: 'spidertraits@sci.muni.cz',
        host: 'rs.cesnet.cz',
        port: 25,
        secure: false,
        user: null,
        pass: null
    },
    wsc: {
        key: 'TODO'
    },
    api: {
        secret: 'TODO'
    },
    dataCite: {
        url: 'https://api.datacite.org',
        editUrl: 'https://doi.datacite.org',
        prefix: '10.82248',
        user: 'TODO',
        password: 'TODO',
        publisher: 'Masaryk University',
        commonAttributes: {
            "subjects":[
                {
                "subject": "FOS: Biological sciences",
                "valueUri": "http://www.oecd.org/science/inno/38235147.pdf",
                "schemeUri": "http://www.oecd.org/science/inno",
                "subjectScheme": "Fields of Science and Technology (FOS)"
                }
            ],
            "formats":[
                "CSV"
            ],
            "relatedIdentifiers":[
                {
                "schemeUri": null,
                "schemeType": null,
                "relationType": "IsCitedBy",
                "relatedIdentifier": "https://doi.org/10.1093/database/baab064",
                "resourceTypeGeneral": "Collection",
                "relatedIdentifierType": "URL",
                "relatedMetadataScheme": null
                }
            ],
            "rightsList":[
                {
                "rights": "Creative Commons Attribution 4.0 International",
                "rightsUri": "https://creativecommons.org/licenses/by/4.0/legalcode",
                "schemeUri": "https://spdx.org/licenses/",
                "rightsIdentifier": "cc-by-4.0",
                "rightsIdentifierScheme": "SPDX"
                }
            ],
        }
    },
    baseUrl: 'https://spidertraits.sci.muni.cz'
}