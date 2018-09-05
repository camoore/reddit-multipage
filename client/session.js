"use strict";

/** @module session
  * Adds functions for handling user
  * session related activites
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  /** @function newSession
   * Displays a form to create a new session
   * based on the user's login information
   */
  reddit.newSession = function() {
    // set the modal title
    var title = "Login";

    // create the modal form
    var form = $('<form>')
      .append($('<div>').addClass('form-group')
        .append($('<input name="username" type="text" class="form-control">')
          .attr('placeholder', "username")))
      .append($('<div>').addClass('form-group')
        .append($('<input name="password" type="password" class="form-control">')
          .attr('placeholder', "password")));

    // creat the modal footer
    var modalFooter = $('<div>').addClass("modal-footer")
      .append($('<button>').addClass("btn btn-primary")
        .text("Login")
        .on('click', function(e) {
          e.preventDefault();
          $.post('/sessions/', form.serialize(), function() {
            window.location.replace("/");
          }).fail(function() {
            modal.modal('hide');
            $('<div>').addClass("alert alert-danger alert-dismissable fade show text-center")
              .attr('role', 'alert')
              .attr('id', 'alert-message')
              .append($('<button>').addClass("close")
                .attr('type', 'button')
                .attr('data-dismiss', 'alert')
                .attr('aria-label', 'Close')
                .append($('<span>').html("&times;")
                  .attr('aria-hidden', 'true')))
              .append($('<strong>').text("Invalid username/password."))
              .prependTo('#content');
              window.setTimeout(function() {
                $("#alert-message").fadeTo(500, 0).slideUp(500, function() {
                  $(this).remove();
                });
              }, 4000);
          });
        }))
      .append($('<button>').addClass("btn btn-primary")
        .text("Sign Up")
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .on('click', function(e) {
          e.preventDefault();
          reddit.newUser();
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

   /** @function destroySession
    * Destroys the current session
    */
    reddit.destroySession = function() {
      $.get('/sessions/encryptedSession/destroy', function() {
        window.location.replace("/");
      });
    }

    /**
     * @function isLoggedIn
     * Determines if a user is logged in based
     * on the session cookie.
     * @returns {boolean} Whether or not a user
     * is logged in.
     */
    reddit.isLoggedIn = function() {
      // get the session cookie
      var value = "; " + document.cookie;
      var parts = value.split("; encryptedSession=");
      var cryptedCookie = "";
      // get the value of the session cookie
      if(parts.length == 2) {
        cryptedCookie = parts.pop().split(";").shift();
      }

      // if the cookie value is not an empty string
      // a user is logged in
      return (cryptedCookie.length > 0);
    }
}
