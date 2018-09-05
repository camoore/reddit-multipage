"use strict";

/** @module post
 * A RESTful resource representing a post
 * implementing the CRUD methods.
 */

module.exports = {
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy,
  listByID: listByID,
  listByUser: listByUser
}

var fs = require('fs');
var fileserver = require('./../../lib/fileserver');
var media = require('./../../lib/media');
var multipart = require('./../../lib/form-multipart');
var json = require('./../../lib/form-json');
var urlencoded = require('./../../lib/form-urlencoded');

/** @function list
 * Sends a list of all commentss as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function list(req, res, db) {
  db.all("SELECT * FROM comments", [], function(err, comments) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error")
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(comments));
  });
}

/** @function create
 * Creates a new comment and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  multipart(req, res, function(req, res) {
    var comment = req.body;

    db.run('INSERT INTO comments (posts_id, user_id, content, score) VALUES (?, ?, ?, ?)', [
      comment.posts_id,
      comment.user_id,
      comment.content,
      1
    ], function(err) {
      if(err) {
        res.statusCode = 500;
        res.end("Server error");
        return;
      }
      res.statusCode = 200;
      res.end("Comment created");
    });

  });
}

/** @function read
 * Serves a specific comment as a JSON string
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function read(req, res, db) {
  var id = req.params.id;
  db.get("SELECT * FROM comments WHERE id=?", [id], function(err, comment) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!comment) {
      res.statusCode = 404;
      res.end("Comment not found");
      return;
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(comment));
  });
}

/** @update
 * Updates a specific comment with the supplied values
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function update(req, res, db) {
  var id = req.params.id;
  json(req, res, function(req, res) {
    var comment = req.body;
    db.run("UPDATE comments SET content=?, score=? WHERE id=?",
      [comment.content, comment.score, id],
      function(err) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Could not update comment in database");
          return;
        }
        res.statusCode = 200;
        res.end();
      }
    );
  });
}

/** @destroy
 * Removes the specified comment from the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res, db) {
  var id = req.params.id;
  db.run("DELETE FROM comments WHERE id=?", [id], function(err) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
    }
    res.statusCode = 200;
    res.end();
  });
}

/** @function listBySubpage
 * Sends a list of all posts with the given subpage_id as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function listByID(req, res, db) {
    var posts_id = req.params.id;
    db.all("SELECT * FROM comments WHERE posts_id=?", [posts_id], function(err, comments) {
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Server Error")
      }
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(comments));
    });
}

/** @function listByUser
 * Sends a list of all comments with the given user_id as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function listByUser(req, res, db) {
    var user_id = req.params.id;
    db.all("SELECT * FROM comments WHERE user_id=?", [user_id], function(err, comments) {
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Server Error")
      }
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(comments));
    });
}
