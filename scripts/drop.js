// requires
var fs = require('fs'),
_ = require('underscore');

// set up the database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('reddit.sqlite3', function(err) {
  if(err) console.error(err);
});

db.run("DROP TABLE IF EXISTS posts");
db.run("DROP TABLE IF EXISTS subpages");
db.run("DROP TABLE IF EXISTS comments");
db.run("DELETE FROM migrations WHERE filename='2-create-posts.sql'");
db.run("DELETE FROM migrations WHERE filename='1-create-subpages.sql'");
db.run("DELETE FROM migrations WHERE filename='6-create-comments.sql'");

/*removeDirForce("./uploads/");

// path should have trailing slash
function removeDirForce(path) {
  fs.readdir(path, function(err, files) {
    if (err) {
      console.log(err.toString());
    } else {
      if (files.length == 0) {
        fs.rmdir(path, function(err) {
          if (err) {
            console.log(err.toString());
          }
        });
      } else {
        _.each(files, function(file) {
          var filePath = path + file + "/";
          fs.stat(filePath, function(err, stats) {
            if (stats.isFile()) {
              fs.unlink(filePath, function(err) {
                if (err) {
                  console.log(err.toString());
                }
              });
            }
            if (stats.isDirectory()) {
              removeDirForce(filePath);
            }
          });
        });
      }
    }
  });
}*/
