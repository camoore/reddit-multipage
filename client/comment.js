"use strict";

/** @module comment
  * Adds functions for displaying posts
  * to the supplied library object
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  reddit.octicons = require('octicons');

  /** @function listComments
   * Displays a list of comments sorted
   * by popularity.
   */
   reddit.listComments = function() {
     // grab and clear the content element
     var content = $('#content').empty();

     $.get('/comments/', function(comments) {
       comments.forEach(function(comment) {
           $('<div>').addClass("comment")
             .append($('<div>').addClass("details")
               .append($('<h4>').text(comment.id))
               .append($('<h5>').text(comment.content))
             ).appendTo('#content');

       });
     });
   }

   /** @function listCommentsByID
    * Displays a list of comments with
    * the given post ID
    */
    reddit.listCommentsByID = function(posts_id) {
      $.get('/comments/' + posts_id + '/list', {posts_id: posts_id}, function(comments) {
        // grab and clear the content element
        var content = $('#content').empty();

        comments.forEach(function(comment) {
            $('<div>').addClass("comment")
              .append($('<div>').addClass("details")
                .append($('<h5>').text(comment.content))
              ).appendTo('#content');
        });
      });
    }

  /** @function newComment
   * Displays a form to create a new project
   * in the page's content div
   */
  reddit.newComment = function(posts_id) {
    // set the modal title
    var title = "Create Comment";

    // create the modal form
    var form = $('<form>')
      .append($('<div>').addClass('form-group')
        .append($('<input name="content" type="text" class="form-control">')
          .attr('placeholder', "content")))
      .append($('<div>').addClass('form-group')
        .append($('<div>').addClass("progress-bar")
          .attr('role', 'progressbar')
          .height(20)
          .width(0)));


    // creat the modal footer
    var modalFooter = $('<div>').addClass("modal-footer")
      .append($('<button>').addClass("btn btn-secondary")
        .text("Close")
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .attr('aria-label', "Cancel"))
      .append($('<button>').addClass("btn btn-primary")
        .text("Create")
        .attr('type', 'button')
        .attr('data-dismiss', 'modal')
        .on('click', function(e) {
          e.preventDefault();
          var formData = new FormData(form.get(0));
          formData.append('posts_id', posts_id);
          // $.post('/comments/' , form.serialize(), function(comment) {
          //   console.log(comment.id);
          //   reddit.listCommentsByID(comments.posts_id);
          // });
          $.ajax({
            url: '/comments/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
            }});
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

  /** @function updateComment
 * Increments/decrements the likes column of
 * the comment.
 * @param {integer} id - the post to update
 */
reddit.updateComment = function(id, val) {
  $.get('/comments/' + id, (comment) => {
    comment.score += val;
    $.post('/comments/' + id, JSON.stringify(comment), function() {
      reddit.listCommentsByID(id);
    });
  });
}

}
