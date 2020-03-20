module.exports = {
    port: 8089,
    frontend:  {
        path: '/.../frontend/dist'
    },
    https: {
        enable: true,
        key: '/../server.key',
        crt: '/../server.crt',
        passphrase: 'TODO'
    },
    oidc: {
        client: 'TODO',
        issuer: 'https://oidc.muni.cz/oidc',
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
        import: {
            sizeLimitMB: 100
        }
    },
    mail: {
        sender: 'spidertraits@group.muni.cz',
        admins: 'spidertraits@group.muni.cz',
        host: 'rs.cesnet.cz',
        port: 25,
        secure: false,
        user: null,
        pass: null
    },
    baseUrl: 'https://spidertraits.sci.muni.cz'
}