"use strict";

/** @module session
 * A RESTful resource representing a session
 * implementing the CRUD methods.
 */

module.exports = {
  create: create,
  destroy: destroy,
  loginRequired: loginRequired
}

// requires
var urlencoded = require('./../../lib/form-urlencoded');
var encryption = require('./../../lib/encryption');

/** @function create
 * Creates a new session and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  urlencoded(req, res, function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    db.get("SELECT * FROM users WHERE username=?", [username], function(err, user) {
      if(err) {
        res.statusCode = 500;
        res.end("Server error");
        return;
      }
      if(!user) {
        // username not in database
        res.statusCode = 403;
        res.end("Incorrect username/password");
        return;
      }
      var cryptedPassword = encryption.digest(password + user.salt);
      if(cryptedPassword != user.cryptedPassword) {
        // invalid password/username combination
        res.statusCode = 403;
        res.end("Incorrect username/password");
        return;
      } else {
        // successful login
        // encrypt user.id and store in the cookies
        var cookieData = JSON.stringify({userId: user.id});
        var encryptedCookie = encryption.encipher(cookieData);
        res.setHeader("Set-Cookie", ["encryptedSession=" + encryptedCookie + "; Path=/;"]);
        res.statusCode = 200;
        res.end("Successfully logged in");
      }
    });
  });
}

/** @destroy
 * Removes the specified session from the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res) {
  res.setHeader("Set-Cookie", [req.params.id + "=; Path=/;"]);
  res.statusCode = 200;
  res.end("Logged out successfully");
}

/** @function loginRequired
* A helper function to make sure a user is logged
* in.  If they are not logged in, the user is
* redirected to the login page.  If they are,
* the next request handler is invoked.
* @param {http.IncomingRequest} req - the request object
* @param {http.serverResponse} res - the response object
* @param {function} next - the request handler to invoke if
* a user is logged in.
*/
function loginRequired(req, res, next) {
  // Make sure both a session exists and contains a
  // username (if so, we have a logged-in user)
  if(!(req.session && req.session.userId)) {
    // Redirect to the login page
    res.statusCode = 302;
    res.setHeader('Location', '/login.html');
    return res.end();
  }
  // Pass control to the next request handler
  next(req, res);
}
