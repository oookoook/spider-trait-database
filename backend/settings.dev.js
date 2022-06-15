module.exports = {
    port: 3000,
    frontend:  {
        path: '../frontend/dist'
    },
    https: {
        enable: false
    },
    oidc: {
        disable: true,
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
        password: 'app',
        database: 'spider_traits_db'
    },
    files: {
        tmpDir: './test/tmp',
        sourceDir: './test/source',
        import: {
            sizeLimitMB: 100
        }
    },
    mail: {
        disabled: true
    },
    wsc: {
        key: 'TODO'
    },
    api: {
        secret: 'a'
    },
    dataCite: {
        url: 'https://api.test.datacite.org',
        editUrl: 'https://doi.test.datacite.org',
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
    baseUrl: 'http://localhost:8080'
}