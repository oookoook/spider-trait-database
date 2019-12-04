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
        secret: 'TIDO',
        url: 'https://spidertraits.sci.muni.cz',
        session: {
            name: 'TODO',
            secret: 'TODO'
        }
    },
    db: {
        connections: 10,
        host: 'localhost',
        user: 'app',
        password: 'TODO',
        database: 'spider_traits_db'
    },
    export: {
        tmpDir: '/var/tmp'
    }
}