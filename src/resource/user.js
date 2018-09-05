"use strict";

/** @module user
 * A RESTful resource representing a user
 * implementing the CRUD methods.
 */

module.exports = {
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy
}

var urlencoded = require('./../../lib/form-urlencoded');
var encryption = require('./../../lib/encryption');
// var auth = require("./../../lib/auth-cookie.js");

/** @function list
 * Sends a list of all users as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function list(req, res, db) {
  // auth(req, res, function(req, res){
    db.all("SELECT * FROM users", [], function(err, users){
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Server Error")
      }
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(users));
    });
  //\ });
}

/** @function create
 * Creates a new user and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  urlencoded(req, res, function(req, res) {
    var user = req.body;
    var salt = encryption.salt();
    var cryptedPassword = encryption.digest(user.password + salt);
    db.run('INSERT INTO users (email, username, cryptedPassword, salt) VALUES (?, ?, ?, ?)', [
      user.email,
      user.username,
      cryptedPassword,
      salt
    ], function(err) {
      if(err) {
        res.statusCode = 500;
        res.end("Server error");
        return;
      }
      res.statusCode = 200;
      res.end("User Created");
    }
  )
  });
}

/** @function read
 * Serves a specific user as a JSON string
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function read(req, res, db) {
  var id = req.params.id;
  db.get("SELECT * FROM users WHERE id=?", [id], function(err, user) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!user) {
      res.statusCode = 404;
      res.end("User not found");
      return;
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(team));
  });
}

/** @update
 * Updates a specific user with the supplied values
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function update(req, res, db) {
  var id = req.params.id;
  db.get('SELECT eid, email, firstName, lastName FROM users where id=?', [id], function(user) {
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(user));
  });
}

/** @destroy
 * Removes the specified user from the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res, db) {
  var id = req.params.id;
  db.run("DELETE FROM users WHERE id=?", [id], function(err) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
    }
    res.statusCode = 200;
    res.end();
  });
}
