/** server.js
 * Server for a reddit-like web app.
 */

"use strict";

// constants
var PORT = 4000;
var SESSION = "encryptedSession";

// requires
var http = require('http');
var encryption = require('./lib/encryption');
var parseCookie = require('./lib/cookie-parser');
var fileserver = require('./lib/fileserver');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('reddit.sqlite3', function(err) {
  if(err) console.error(err);
});
var router = new (require('./lib/route')).Router(db);

// cache static directories in the fileserver
fileserver.loadDir('public');
fileserver.loadDir('uploads');

// define our routes
var post = require('./src/resource/post');
var subpage = require('./src/resource/subpage');
var user = require('./src/resource/user');
var session = require('./src/resource/session');
var comment = require('./src/resource/comment');
router.resource('/posts', post);
router.resource('/subpages', subpage);
router.resource('/users', user);
router.resource('/sessions', session);
router.resource('/comments', comment);

var server = new http.Server(function(req, res) {
  // check for a session cookie to determine
  // if a user is logged in
  var cookies = parseCookie(req.headers.cookie);

  // encrypt session cookie before sending to client
  var encryptedSession = cookies[SESSION];

  // check if a session exists
  if(!encryptedSession) {
    // if not, set req.session to be empty
    req.session = {}
  } else {
    // if so, the session is encrypted, and must be decrypted
    var sessionData = encryption.decipher(encryptedSession);

    // further, it is in JSON form, so parse it and set the
    // req.session object to be its parsed value
    req.session = JSON.parse(sessionData);
  }

  // remove the leading '/' from the resource url
  var resource = req.url.slice(1);

  // if no resource is requested, serve the cached index page.
  if(resource == '')
    fileserver.serveFile('/index.html', req, res);
  // if the resource is cached in the fileserver, serve it
  else if(fileserver.isCached(resource))
    fileserver.serveFile(resource, req, res);
  // otherwise, route the request
  else router.route(req, res);
});

// launch the server
server.listen(PORT, function(){
  console.log("listening on port " + PORT);
  // db.all('SELECT * from posts', function(err, table) {
  // console.log(table);
  //  });
  //  db.all('SELECT * from comments', function(err, table) {
  //  console.log(table);
    // });
});
