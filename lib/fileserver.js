"use strict";

/** @module fileserver
 * A module for loading and serving static files
 */
module.exports = {
  loadFile: loadFile,
  loadDir: loadDir,
  isCached: isCached,
  serveFile: serveFile
}

// initialize the list of cached items
var files = {};

// requires
var fs = require('fs');
var media = require('./media');

function loadFile(item, path) {
  var parts = path.split('.');
  var extension = parts[parts.length-1];
  var type = 'application/octet-stream';
  switch(extension) {
    case 'html':
    case 'htm':
      type = 'text/html';
      break;
    case 'css':
      type = 'text/css';
      break;
    case 'js':
      type = 'text/javascript';
      break;
    case 'jpeg':
    case 'jpg':
      type = 'image/jpeg';
      break;
    case 'gif':
    case 'png':
    case 'bmp':
    case 'tiff':
    case 'svg':
      type = 'image/' + extension;
      break;
  }
  files[item] = {
    contentType: type,
    data: fs.readFileSync(path)
  };
  files['/' + item] = {
    contentType: type,
    data: fs.readFileSync(path)
  };
}

/**
 * @function loadDir
 * Recursively traverses the given directory and
 * caches any files found.
 * @param {string} directory the directory containing
 * the files to cache
 */
function loadDir(directory) {
  var items = fs.readdirSync(directory);
  items.forEach(function(item) {
    var path = directory + '/' + item;
    var stats = fs.statSync(path);
    if(stats.isFile()) {
      loadFile(item, path);
    }
    if(stats.isDirectory()) {
      loadDir(path);
    }
  });
}

/**
 * @function isCached
 * Determines given file is cached.
 * @param {string} path the path to the file
 * @returns {boolean} Whether or not the file
 * is cached.
 */
function isCached(path) {
  return files[path] != undefined;
}

/**
 * @function serveFile
 * Serves the given file.
 * @param {string} path the path to the file
 * @param {http.incomingRequest} req the request object
 * @param {http.serverResponse} res the repsonse object
 * @returns {boolean} Whether or not the file
 * is cached.
 */
function serveFile(path, req, res) {
  if(req.headers.range) {
    streamVideo(path, req, res);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', files[path].contentType);
    res.end(files[path].data);
  }
}


/** @function streamVideo
 * Serves a portion of the requested video file.
 * The video file is embodied in the request url
 * (in the form /videos/{video file name}), and
 * the range of bytes to serve is contained in the
 * request http range header.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range
 * for details.
 * @param {http.incomingRequest} req - the request object
 * @param {http.clientResponse} res - the response object
 */
function streamVideo(filename, req, res) {
  // The range header specifies the part of the file to send
  // in the form bytes={start}-{end}, where {start} is
  // the starting byte position in the file to stream, and
  // {end} is the ending byte position (or blank)
  var range = req.headers.range;
  var positions = range.replace(/bytes=/, "").split("-");
  var start = parseInt(positions[0], 10);

  // Extract the video file name from the url, and
  // use the extension to set up the file type
  // TO DO: get file extension
  var path = 'uploads/' + filename;
  var type = 'video/mp4';// + path.split('.')[1];

  // We need to stat the video file to determine the
  // correct ending byte index (as the client may be
  // requesting more bytes than our file contains)
  fs.stat(path, (err, stats) => {
    if(err) {
      console.error(err);
      res.statusCode = 404;
      res.end();
      return;
    }
    var total = stats.size;
    // Set the end position to the specified end, or the total
    // number of bytes - 1, whichever is smaller.
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    // The chunk size is the number of bytes we are sending,
    // i.e. the end-start plus one.
    var chunksize = (end - start) + 1;
    // Set the response status code to 206: partial content,
    // and set the headers to specify the part of the video
    // we are sending
    res.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": type
    });
    // Pipe the portion of the file we want to send to the
    // response object.
    var stream = fs.createReadStream(path, {start: start, end: end})
      .on('open', () => stream.pipe(res))
      .on('error', (err) => res.end(err));
  });
}
