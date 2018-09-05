"use strict";

/** @module media
 * A module of functions for media files
 */
module.exports = {
  getExtension: getExtension,
  isImage: isImage,
  isVideo: isVideo,
  createFilename: createFilename,
  getType: getType
}

// requires
var fs = require('fs');
var crypto = require('crypto');

/** @function getExtension
 * Determines the files extensions based on the
 * characters following the last period.
 *
 * @param {string} filename - the name of the file
 * @returns {string} the file extension
 */
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

/** @function isImage
 * Use the files extension to determine if the
 * file is an image.
 * @param {string} filename - the name of the file
 */
function isImage(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
    return true;
  }
  return false;
}

/** @function isVideo
 * Use the files extension to determine if the
 * file is a video.
 * @param {string} filename - the name of the file
 */
function isVideo(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      return true;
  }
  return false;
}

/** @function getType
 */
function getType(filename) {
  var ext = getExtension(filename);
  if(isImage(filename)) {
    return 'image/' + ext;
  } else if(isVideo(filename)) {
    return 'video/' + ext;
  } else {
    // TO DO: decide on a default type
    return 'text/plain';
  }
}

/** @function createFilename
 * Creates a new filename by taking the current
 * date in the format 'YYYYMMDD' and appending
 * the original filename and current milliseconds
 * hased together with md5.
 * @param {string} filename - the name of the file
 * @returns {string} the new filename
 */
function createFilename(filename) {
  // create a new date object
  var date = new Date();
  var year = date.getFullYear().toString();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);

  // combine the old filename and current milliseconds and hash with md5
  var hash = crypto.createHash('md5').update(filename + date.getMilliseconds()).digest('hex');

  return year + month + day + '_' + hash;
}
