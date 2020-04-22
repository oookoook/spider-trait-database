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
    baseUrl: 'http://localhost:8080'
}