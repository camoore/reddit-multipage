"use strict";

/** @module encipherion
 * A module of functions to encipher/decipher and digest
 */
module.exports = {
  salt: salt,
  digest: digest,
  encipher: encipher,
  decipher: decipher
}


// constants
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

// requires
var config = require('./../config.json');

/** @function salt
 * Creates a random value to use as a salt
 * @returns {string} a 32-bit salt
 */
function salt() {
  return crypto.randomBytes(32).toString('hex').slice(32);
}

/** @function digest
 * Creates a cryptographic hash of the provided text.
 * @param {string} plaintext - the text to create a digest from
 */
function digest(plaintext) {
  const hash = crypto.createHash('sha256');
  hash.update(plaintext);
  hash.update(config.secret);
  return hash.digest('hex');
}

/** @function encipher
 * Enciphers the provided text
 * @param {string} plaintext - the text to encipher
 * @returns {string} the enciphered text
 */
function encipher(plaintext) {
  const cipher = crypto.createCipher(algorithm, config.secret);
  var enciphered = cipher.update(plaintext, 'utf8', 'hex');
  enciphered += cipher.final('hex');
  return enciphered;
}

/** @function decipher
 * @param {string} crypttext - the text to decipher
 * @returns {string} the deciphered plain text
 */
function decipher(crypttext) {
  const decipher = crypto.createCipher(algorithm, config.secret);
  var deciphered = decipher.update(crypttext, 'hex', 'utf8');
  deciphered += decipher.final('utf8');
  return deciphered;
}
