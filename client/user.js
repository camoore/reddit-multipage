"use strict";

/** @module user
  * Adds functions for handling user
  * related activites
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  /** @function newUser
   * Displays a form to create a new user
   */
  reddit.newUser = function() {
    // set the modal title
    var title = "Sign Up";

    // create the modal form
    var form = $('<form>')
      .append($('<div>').addClass('form-group')
        .append($('<input name="email" type="email" class="form-control">')
          .attr('placeholder', "email")))
      .append($('<div>').addClass('form-group')
        .append($('<input name="username" type="text" class="form-control">')
          .attr('placeholder', "username")))
      .append($('<div>').addClass('form-group')
        .append($('<input name="password" type="password" class="form-control">')
          .attr('placeholder', "password")))
      .append($('<div>').addClass('form-group')
        .append($('<input name="verify-password" type="password" class="form-control">')
          .attr('placeholder', "verify password")));

    // creat the modal footer
    var modalFooter = $('<div>').addClass("modal-footer")
      .append($('<button>').addClass("btn btn-primary")
        .text("Sign Up")
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .on('click', function(e) {
          e.preventDefault();
          $.post('/users/', form.serialize(), function() {
            reddit.newSession();
          }).fail(function() {
            alert('Something went wrong');
          });
        }));

    // create the modal body and append the form
    var modalBody = $('<div>').addClass("modal-body")
      .append(form);

    // create the modal header
    var modalHeader = $('<div>').addClass("modal-header")
      .append($('<h5>').text(title))
      .append($('<button>').addClass("close")
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .attr('aria-label', "Close")
        .append($('<span>').html("&times;")
          .attr('aria-hidden', 'true')));

    // create the modal content and append the modal header, footer and body
    var modalContent = $('<div>').addClass("modal-content")
      .append(modalHeader)
      .append(modalBody)
      .append(modalFooter);

    // create the modal dialog and append the modal content
    var modalDialog = $('<div>').addClass("modal-dialog")
      .attr('role', 'document')
      .append(modalContent);

    // create the modal and append the modal dialog
    var modal = $('<div>').addClass("modal fade")
      .append(modalDialog);

    // show the modal
    modal.modal('show');
  }
}
