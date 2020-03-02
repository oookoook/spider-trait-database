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
        client: 'TODO',
        issuer: 'https://oidc.muni.cz/oidc',
        secret: 'TODO',
        url: 'http://localhost:3000',
        session: {
            secret: '?~gVQ}hp]Y0IKPzx)nZ9_[t+S9&J0c'
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
        tmpDir: './test',
        import: {
            sizeLimitMB: 100
        }
    }
}