const express = require('express')
const fs = require('fs')
const https = require('https')
const http = require('http')
const compression = require('compression')

const settings = require('./settings')
const history = require('connect-history-api-fallback');
const { auth, requiresAuth } = require('express-openid-connect');
//const session = require('cookie-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const api = require('./api/api');
const cauth = require('./util/auth');

const app = express();

app.use(compression())

// userd for testing. Other CORS requests should be blocked
app.use(cors({
  origin: 'http://localhost:8080',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// this should handle the history mode of Vuex router - redirects requests to text/html to ./index.html which is served by express.static
// rewrites - ignore backend calls
app.use(history({
    rewrites: [
      {
        from: /^\/backend\/.*$/,
        to: function(context) {
          // just get the same url that was on input
          return context.parsedUrl.href;
        }
      },
      {
        from: /^\/user\/.*$/,
        to: function(context) {
          // just get the same url that was on input
          return context.parsedUrl.href;
        }
      },
      {
        from: /^\/callback.*$/,
        to: function(context) {
          // just get the same url that was on input
          return context.parsedUrl.href;
        }
      },
      // ugly LSID parsing hack
      // bypassing the dot rule of the history middleware
      // the lsid contains dot which prevents the path to be handled automatically by the history module
      {
        from: /^\/taxonomy\/lsid\/.*$/,
        to: function(context) {
          // just get the same url that was on input
          return 'index.html';
        }
      }
    ],
    //verbose: true
  }));

// serving the frontend
app.use(express.static(settings.frontend.path));


cauth.setClaims(settings.oidc.claims);
// setting up the OIDC

if(!settings.oidc.disable) {
  /*
  app.use(session({
    name: settings.oidc.session.name,
    secret: settings.oidc.session.secret
  }));
  */
  app.use(auth({
    authRequired: false,
    issuerBaseURL: settings.oidc.issuer,
    baseURL: settings.oidc.url,
    clientID: settings.oidc.client,
    //appSessionSecret: settings.oidc.session.secret,
    /* will be required in a new version */
    secret: settings.oidc.session.secret,
    clientSecret: settings.oidc.secret,
    routes: {
      //login: '/user/login',
      //logout: '/user/logout',
      //callback: '/login',
      //postLogoutRedirect: '/logout'
    },
    authorizationParams: {
        response_type: "code",
        response_mode: "query",
        scope: "openid profile eduperson_entitlement"
    }
  }));
  
} else {
  // everything is authorized
  app.use(cauth.mockupAuth('http://localhost:8080/login', 'http://localhost:8080/logout'));
}
// route used to show the SSO login screen
// 
app.get('/user/login', (req, res) => res.oidc.login({ returnTo: `/login` }));

app.get('/user/logout', (req, res) => res.oidc.logout({ returnTo: `/logout` }));


// additional user claims are usually not obtained at this moment yet
app.get('/user/info', requiresAuth(), /*cauth.resourcesAuth,*/ async function (req, res) {
    //console.dir(req.openid.user);
    // get the additional subs!
    console.log('user info endpoint called', new Date().toISOString());
    console.log('current req.appSession', req.appSession);
    console.log('current req.oidc', req.oidc);
    console.log('idTokenClaims', req.oidc.idTokenClaims);
    console.log('user', req.oidc.user);
    
    if(!req.appSession.claims) {
      const additionalUserClaims = await req.oidc.fetchUserInfo();
      console.log('obtained additional claims', additionalUserClaims);
      //req.oidc.idTokenClaims[settings.oidc.claims.name]=additionalUserClaims[settings.oidc.claims.name];
      
      //req.oidc.user[settings.oidc.claims.name]=additionalUserClaims[settings.oidc.claims.name];
      req.appSession.claims = { [settings.oidc.claims.name]:  additionalUserClaims[settings.oidc.claims.name]}
    }
    let rights = cauth.checkRights(req.oidc.user, req.appSession);
    console.log('final rights', rights);
    res.json(rights);
  });

app.get('/user/key', requiresAuth(), cauth.resourcesAuth, function(req, res) {
  res.json({ key: cauth.generateApiKey(req.resourcesAuth) });
});

// sets up the data hnadling routes
app.use('/backend', api);


if(settings.https.enable) {
    https.createServer({
        key: fs.readFileSync(settings.https.key),
        cert: fs.readFileSync(settings.https.crt),
        passphrase: settings.https.passphrase
      }, app)
      .listen(settings.port, function () {
        console.log(`Server is listening on port ${settings.port}. Go to https://localhost:${settings.port}/ or ${settings.baseUrl}`)
      });
    
    // http server that redirects the requests
    http.createServer(function (req, res) {
      res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
      res.end();
    }).listen(80);
} else {
    app.listen(settings.port, () => console.log(`${new Date().toISOString()}: Server is listening on port ${settings.port}. Go to http://localhost:${settings.port}/`))
}

