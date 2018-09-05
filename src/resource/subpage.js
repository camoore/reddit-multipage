"use strict";

/** @module subpage
 * A RESTful resource representing a subpage
 * implementing the CRUD methods.
 */

module.exports = {
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy
}

// requires
var urlencoded = require('./../../lib/form-urlencoded');

/** @function list
 * Sends a list of all subpages as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function list(req, res, db) {
    db.all("SELECT * FROM subpages", [], function(err, subpages) {
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Server Error")
      }
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(subpages));
    });
}

/** @function create
 * Creates a new subpage and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  urlencoded(req, res, function(req, res) {
    var subpage = req.body;
    db.run('INSERT INTO subpages (name, description) VALUES (?, ?)', [
      subpage.name,
      subpage.description
    ], function(err) {
      if(err) {
        res.statusCode = 500;
        res.end("Server error");
        return;
      }
      db.get("SELECT LAST_INSERT_ROWID() AS `id`", function(err, id) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Server error");
          return;
        }
        if(!id) {
          res.statusCode = 404;
          res.end("Subpage ID not found");
          return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/json");
        res.end(JSON.stringify(id));
      });
    }
  )
  });
}

/** @function read
 * Serves a specific subpage as a JSON string
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function read(req, res, db) {
  var id = req.params.id;
  db.get("SELECT * FROM subpages WHERE id=?", [id], function(err, subpage) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!subpage) {
      res.statusCode = 404;
      res.end("Subpage not found");
      return;
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(subpage));
  });
}

/** @update
 * Updates a specific subpage with the supplied values
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function update(req, res, db) {
  var id = req.params.id;
  db.get('SELECT name, description FROM subpages where id=?', [id], function(subpage) {
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(subpage));
  });
}

/** @destroy
 * Removes the specified subpage from the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res, db) {
  var id = req.params.id;
  db.run("DELETE FROM subpages WHERE id=?", [id], function(err) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
    }
    res.statusCode = 200;
    res.end();
  });
}
