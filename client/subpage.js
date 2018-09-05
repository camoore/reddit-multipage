"use strict";

/** @module subpage
  * Adds functions for displaying subpages
  * to the supplied library object
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  /** @function listSubpages
   * Displays a list of subpages available
   * to the user in the content element
   */
   reddit.listSubpages = function() {
     $('#subpage-list').empty();
     $.get('/subpages/', (subpages) => {
       subpages.forEach(function(subpage) {
         $('<li>').addClass("sp-nav-item")
           .append(
             $('<a>')
               .attr("href", "/")
               .attr("id", subpage.name)
               .text(subpage.name)
               .on('click', (e) => {
                 e.preventDefault();
                 $("a.active").removeClass("active");
                 $(e.target).addClass("active");

                 var post_link = $('#post-link')
                 if(post_link) {
                   post_link.remove();
                 }


                 reddit.showSubpage(subpage.id);
              })
          ).appendTo('#subpage-list');
      });
    });
  }

  /** @function newSubpage
   * Displays a form to create a new subpage
   * in the page's content div
   */
  reddit.newSubpage = function() {
    // set the modal title
    var title = "Create Subpage";

    // create the modal form
    var form = $('<form>')
    .append($('<div>').addClass('alert-name'))
      .append($('<div>').addClass('form-group')
        .append($('<input name="name" type="text" class="form-control">')
          .attr('placeholder', "name")))
      .append($('<div>').addClass('form-group')
        .append($('<input name="description" type="text" class="form-control">')
          .attr('placeholder', "description")));

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
          var nameLength = form.find("input[name='name']").val().length;

                   //Alert if name is too large
                  if(nameLength > 20){
                  nameLength =0;
                    //modal.modal('hide');
                    $('<div>').addClass("alert alert-danger alert-dismissable fade show text-center")
                      .attr('role', 'alert')
                      .attr('id', 'alert-message')
                      .append($('<button>').addClass("close")
                         .attr('type', 'button')
                        .attr('data-dismiss', 'alert')
                        .attr('aria-label', 'Close')
                        .append($('<span>').html("&times;")
                          .attr('aria-hidden', 'true')))
                      .append($('<strong>').text("Invalid name! "))
                      .append("Max name length is 20 characters.")
                      .prependTo('.alert-name');
                      window.setTimeout(function() {
                        $("#alert-message").fadeTo(500, 0).slideUp(500, function() {
                          $(this).remove();
                        });
                      }, 4000);
                  }

                  //Alert if name is empty
                  else if(nameLength <= 0){
                    nameLength = 0;
                    //modal.modal('hide');
                    $('<div>').addClass("alert alert-danger alert-dismissable fade show text-center")
                     .attr('role', 'alert')
                      .attr('id', 'alert-message')
                      .append($('<button>').addClass("close")
                        .attr('type', 'button')
                        .attr('data-dismiss', 'alert')
                        .attr('aria-label', 'Close')
                        .append($('<span>').html("&times;")
                          .attr('aria-hidden', 'true')))
                      .append($('<strong>').text("Invalid name! "))
                      .append("Name field is empty")
                      .prependTo('.alert-name');
                      window.setTimeout(function() {
                        $("#alert-message").fadeTo(500, 0).slideUp(500, function() {
                          $(this).remove();
                        });
                      }, 4000);
                  }

          else
          {
            $.post('/subpages/', form.serialize(), function(subpage) {
              console.log(subpage.id);
              reddit.listSubpages();
              reddit.showSubpage(subpage.id);
            });
          }

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

  /** @function showSubpage
   * Displays the specified subpage in the
   * content div of the page
   * @param {integer} id - the id of the subpage
   */
  reddit.showSubpage = function(id) {
    // grab and clear the content element
    var content = $('#content').empty();
    var content2 = $('#content2').empty();

    var comment_link = $('#comment-link')
    if(comment_link) {
      comment_link.remove();
    }

    if($('#post-link', '#side-menu').length != 1) {
      // add a menu item to add a post
      $('#side-menu')
        .append($('<div>').addClass("menu-item")
          .append($('<span>').addClass("menu-item-icon")
            .append(reddit.octicons.pencil.toSVG({"width": 24})))
          .append($('<span>').addClass("hover-text")
            .text("Add Post"))
          .attr('id', 'post-link')
          .on('click', function(e) {
            reddit.newPost(id);
          }));
    }

    $.get('/subpages/' + id, function(subpage) {
      // change the active tabe
      $('a.active').removeClass("active");
      $('#' + subpage.name).addClass("active");

      $('<div>').addClass("subpage-header")
        .append($('<h1>')
          .text(subpage.name))
        .append($('<h4>')
          .text(subpage.description))
        .appendTo('#content2');
    });
    reddit.listPostsByID(id);
  }
}
