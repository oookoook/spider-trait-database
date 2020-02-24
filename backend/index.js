var express = require('express')
var fs = require('fs')
var https = require('https')
var settings = require('./settings')
var history = require('connect-history-api-fallback');
const { auth, requiresAuth } = require('express-openid-connect');
//const session = require('cookie-session');
var bodyParser = require('body-parser');
var cors = require('cors');

var api = require('./api');
var cauth = require('./auth');

var app = express();

// userd for testing. Other CORS requests should be blocked
app.use(cors({
  origin: 'http://localhost:8080',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// this should handle the history mode of Vuex router - redirects reequests to text/html to ./index.html which is server by express.static
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
      }
    ]
  }));

// serving the frontend
app.use(express.static(settings.frontend.path));

// setting up the OIDC

if(!settings.oidc.disable) {
  /*
  app.use(session({
    name: settings.oidc.session.name,
    secret: settings.oidc.session.secret
  }));
  */
  app.use(auth({
    required: false,
    issuerBaseURL: settings.oidc.issuer,
    baseURL: settings.oidc.url,
    clientID: settings.oidc.client,
    appSessionSecret: settings.oidc.session.secret,
    clientSecret: settings.oidc.secret,
    routes: false,
    authorizationParams: {
        response_type: "token",
        response_mode: "query",
        scope: "openid eduperson_entitlement"
    },
    handleCallback: async function (req, res, next) {
      console.dir(req.openidTokens);
      console.dir(req.openidTokens.claims());
      next();
    }
  }));
  cauth.setClaims(settings.oidc.claims);
}
// route used to show the SSO login screen
// 
app.get('/user/login', (req, res) => res.openid.login({ returnTo: `/login` }));



app.get('/user/info', requiresAuth(), cauth.resourcesAuth, function (req, res) {
    console.dir(req.openid.user);
    /*
    var user = {
        username: req.openid.user.sub,

    }
    */
    res.json(req.resourcesAuth);
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
        console.log(`Server is listening on port ${settings.port}. Go to https://localhost:${settings.port}/`)
      })
} else {
    app.listen(settings.port, () => console.log(`Server is listening on port ${settings.port}. Go to http://localhost:${settings.port}/`))
}

