"use strict";

/**
 * @module form-json
 * A module for processing JSON encoded HTTP requests
 */
module.exports = json;

/**
 * @function json
 * Takes a request and response object,
 * parses the body of the JSON encoded request
 * and attaches its contents to the request
 * object.  If an error occurs, we log it
 * and send a 500 status code.  Otherwise
 * we invoke the next callback with the
 * request and response.
 * @param {http.incomingRequest} req the request object
 * @param {http.serverResponse} res the repsonse object
 * @param {function} next the next function in the req/res pipeline
 */
function json(req, res, next) {
  var body = "";

  // handle error events by logging the error
  // and responding with a 500 server error
  req.on('error', function(err){
    console.log(err);
    res.statusCode = 500;
    res.statusMessage = "Server error";
    res.end("Server err");
  });

  // handle data events by appending the new
  // data to the chunks array
  req.on('data', function(chunk) {
    body += chunk;
  });

  // handle end events by parsing the body and
  // attaching the resulting object to the request object
  req.on('end', function() {

    // store the parsed body in the req.body property
    req.body = JSON.parse(body);

    // trigger the next callback with the modified req object
    next(req, res);
  });
}
