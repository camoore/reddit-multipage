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
  listByID: listByID
}

var fs = require('fs');
var fileserver = require('./../../lib/fileserver');
var media = require('./../../lib/media');
var multipart = require('./../../lib/form-multipart');
var json = require('./../../lib/form-json');
var urlencoded = require('./../../lib/form-urlencoded');

/** @function list
 * Sends a list of all posts as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function list(req, res, db) {
  db.all("SELECT * FROM posts", [], function(err, posts) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error")
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(posts));
  });
}

/** @function create
 * Creates a new post and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  multipart(req, res, function(req, res) {
    var post = req.body;
    var file = req.body.media;
    var newFilename = null;
    var fileType = null;
    if(file) {
      var oldFilename = post.media.filename;
      var newFilename = media.createFilename(oldFilename);
      var fileType = media.getType(oldFilename);
    }

    db.run('INSERT INTO posts (subpage_id, title, content, filename, fileType, score) VALUES (?, ?, ?, ?, ?, ?)', [
      post.subpage_id,
      post.title,
      post.content,
      newFilename,
      fileType,
      1
    ], function(err) {
      if(err) {
        res.statusCode = 500;
        res.end("Server error");
        return;
      }
      res.statusCode = 200;
      res.end("Post created");
    });

    if(file) {
    // save the file
      fs.writeFile('./uploads/' + newFilename, post.media.data, function(err) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.statusMessage = "Server Error";
          res.end("Server Error");
          return;
        }
        // cache the file
        fileserver.loadFile(newFilename, './uploads/' + newFilename);
      });
    }
  });
}

/** @function read
 * Serves a specific post as a JSON string
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function read(req, res, db) {
  var id = req.params.id;
  db.get("SELECT * FROM posts WHERE id=?", [id], function(err, post) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!post) {
      res.statusCode = 404;
      res.end("Post not found");
      return;
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(post));
  });
}

/** @update
 * Updates a specific post with the supplied values
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function update(req, res, db) {
  var id = req.params.id;
  json(req, res, function(req, res) {
    var post = req.body;
    db.run("UPDATE posts SET title=?, content=?, filename=?, fileType=?, score=? WHERE id=?",
      [post.title, post.content, post.filename, post.fileType, post.score, id],
      function(err) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Could not update post in database");
          return;
        }
        res.statusCode = 200;
        res.end();
      }
    );
  });
}

/** @destroy
 * Removes the specified post from the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res, db) {
  var id = req.params.id;
  db.run("DELETE FROM posts WHERE id=?", [id], function(err) {
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
    var subpage_id = req.params.id;
    db.all("SELECT * FROM posts WHERE subpage_id=?", [subpage_id], function(err, posts) {
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Server Error")
      }
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(posts));
    });
}
