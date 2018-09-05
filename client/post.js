"use strict";

/** @module post
  * Adds functions for displaying posts
  * to the supplied library object
  * @param {object} reddit - the object to expand
  */
module.exports = function(reddit) {

  reddit.octicons = require('octicons');
  reddit.mustache = require('mustache');

  /** @function listPosts
   * Displays a list of posts sorted
   * by popularity.
   */
   reddit.listPosts = function() {
     // grab and clear the content element
     var content = $('#content').empty();

     $.get('/posts/', function(posts) {
       posts.forEach(function(post) {
         if(post.filename) {
           var img;
           var type = post.fileType.split('/')[0];
           if(type === 'video') {
             addVideoPost(post);
           } else if(type === 'image') {
             var img = $('<img>').addClass("thumbnail-img")
               .attr("src", post.filename);
             $('<div>').addClass("post")
               .append($('<div>').addClass("vote")
               .append($('<div>').addClass("upvote")
                 .append($('<a>')
                   .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
                   .on('click', function(e) {
                     reddit.updatePost(post.id, 1);
                   })))
               .append($('<div>').addClass("score")
                 .text(post.score))
               .append($('<div>').addClass("downvote")
                 .append($('<a>')
                   .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
                   .on('click', function(e) {
                     reddit.updatePost(post.id, -1);
                   }))))
               .append($('<a>').addClass("thumbnail-link")
                 .append(img))
               .append($('<div>').addClass("details")
               .append($('<a>')
                    .attr("href", "/")
                    .attr("id", post.title)
                    .text(post.title)
                    .on('click', (e) => {
                      e.preventDefault();
                      $("a.active").removeClass("active");
                      $(e.target).addClass("active");
                      reddit.showPost(post.id);
                   })
                )
                 .append($('<h6>').text(post.content))
               ).appendTo('#content');
           }
         } else {
           $('<div>').addClass("post")
           .append($('<div>').addClass("vote")
             .append($('<div>').addClass("upvote")
               .append($('<a>')
                 .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
                 .on('click', function(e) {
                   reddit.updatePost(post.id, 1);
                 })))
             .append($('<div>').addClass("score")
               .text(post.score))
             .append($('<div>').addClass("downvote")
               .append($('<a>')
                 .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
                 .on('click', function(e) {
                   reddit.updatePost(post.id, -1);
                 }))))
             .append($('<div>').addClass("details")
             .append(
               $('<a>')
                 .attr("href", "/")
                 .attr("id", post.title)
                 .text(post.title)
                 .on('click', (e) => {
                   e.preventDefault();
                   $("a.active").removeClass("active");
                   $(e.target).addClass("active");
                   reddit.showPost(post.id);
                })
            )
               .append($('<h6>').text(post.content))
             ).appendTo('#content');
         }
       });
     });
   }

   /** @function listPostsByID
    * Displays a list of posts with
    * the given subpage ID
    */
    reddit.listPostsByID = function(subpage_id) {
      $.get('/posts/' + subpage_id + '/list', {subpage_id: subpage_id}, function(posts) {
        // grab and clear the content element
        var content = $('#content').empty();

        posts.forEach(function(post) {
          if(post.filename) {
            var img;
            var type = post.fileType.split('/')[0];
            if(type === 'video') {
              addVideoPost(post);
            } else if(type === 'image') {
              var img = $('<img>').addClass("thumbnail-img")
                .attr("src", post.filename);
              $('<div>').addClass("post")
              .append($('<div>').addClass("vote")
                .append($('<div>').addClass("upvote")
                  .append($('<a>')
                    .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
                    .on('click', function(e) {
                      reddit.updatePost(post.id, 1);
                    })))
                .append($('<div>').addClass("score")
                  .text(post.score))
                .append($('<div>').addClass("downvote")
                  .append($('<a>')
                    .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
                    .on('click', function(e) {
                      reddit.updatePost(post.id, -1);
                    }))))
                .append($('<a>').addClass("thumbnail-link")
                  .append(img))
                .append($('<div>').addClass("details")
                .append(
                  $('<a>')
                    .attr("href", "/")
                    .attr("id", post.title)
                    .text(post.title)
                    .on('click', (e) => {
                      e.preventDefault();
                      $("a.active").removeClass("active");
                      $(e.target).addClass("active");
                      reddit.showPost(post.id);
                   })
               )
                  .append($('<h6>').text(post.content))
                ).appendTo('#content');
            }
          } else {
            $('<div>').addClass("post")
            .append($('<div>').addClass("vote")
              .append($('<div>').addClass("upvote")
                .append($('<a>')
                  .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
                  .on('click', function(e) {
                    reddit.updatePost(post.id, 1);
                  })))
              .append($('<div>').addClass("score")
                .text(post.score))
              .append($('<div>').addClass("downvote")
                .append($('<a>')
                  .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
                  .on('click', function(e) {
                    reddit.updatePost(post.id, -1);
                  }))))
              .append($('<div>').addClass("details")
              .append(
                $('<a>')
                  .attr("href", "/")
                  .attr("id", post.title)
                  .text(post.title)
                  .on('click', (e) => {
                    e.preventDefault();
                    $("a.active").removeClass("active");
                    $(e.target).addClass("active");
                    reddit.showPost(post.id);
                 })
             )
                .append($('<h6>').text(post.content))
              ).appendTo('#content');
          }
        });
      });
    }

  /** @function newPost
   * Displays a form to create a new project
   * in the page's content div
   */
  reddit.newPost = function(subpage_id) {
    // set the modal title
    var title = "Create Post";

    // create the modal form
    var form = $('<form>')
    .append($('<div>').addClass('alert-name'))
      .append($('<div>').addClass('form-group')
        .append($('<input name="title" type="text" class="form-control">')
          .attr('placeholder', "title")))
      .append($('<div>').addClass('form-group')
        .append($('<input name="content" type="text" class="form-control">')
          .attr('placeholder', "content")))
      .append($('<div>').addClass('form-group')
        .append($('<input name="media" type="file" class="form-control">')
          .attr('placeholder', "media")))
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
        .on('click', function(e) {
          e.preventDefault();
          var formData = new FormData(form.get(0));
          formData.append('subpage_id', subpage_id);
                 var titleLength = formData.get('title').length;
                    var contentLength = form.find('input[name="content"]').val().length;
                    var files = form.find('input[type=file]')[0].files;


                    //if upload field amd content empty
                    if(contentLength + files.length <= 0){
                      contentLength =0;
                         $.get("alert.html", function(template){
                          var data =
                           {
                               "strong_text": "Invalid input!",
                               "text":  "Must enter Content or Upload a File.",
                               "alert_name": subpage_id
                           };

                           $(".alert-name").prepend(reddit.mustache.to_html(template, data));
              window.setTimeout(function() {
                $("div[role='alert']").fadeTo(500, 0).slideUp(500, function() {
                                   $(this).remove();
                                 });
                               }, 4000);
                            })
                           }



          if(files.length > 0) {
            var file = files[0];
            formData.append('media', file, file.name);
            var fileSize = (file.size/(1024*1024));
            if(fileSize > 100.0) {
              $.get("alert.html", function(template){
              var data =
                {
                    "strong_text": "File size too large!",
                    "text":  "Files must be less than 100MB.",
                    "alert_name": subpage_id
                };

                $("#content").prepend(reddit.mustache.to_html(template, data));
                window.setTimeout(function() {
                  $("div[role='alert']").fadeTo(500, 0).slideUp(500, function() {
                     $(this).remove();
                   });
                 }, 4000);
             })
            }
          }
 if(titleLength> 0 && titleLength <= 20 && contentLength + files.length > 0){
          $.ajax({
            url: '/posts/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
              console.log('Upload successful - ' + data);
            },
            xhr: function() {
              // create an XMLHttpRequest
              var xhr = new XMLHttpRequest();

              // listen to the 'progress' event
              xhr.upload.addEventListener('progress', function(evt) {
                if (evt.lengthComputable) {
                  // calculate the percentage of upload completed
                  var percentComplete = evt.loaded / evt.total;
                  percentComplete = parseInt(percentComplete * 100);

                  // update the Bootstrap progress bar with the new percentage
                  $('.progress-bar').text(percentComplete + '%');
                  $('.progress-bar').width(percentComplete + '%');

                  // once the upload reaches 100%, set the progress bar text to done
                  if (percentComplete === 100) {
                    $('.progress-bar').html('Done');
                    modal.modal('hide');
                    setTimeout(function() {
                      reddit.showSubpage(subpage_id);
                    }, 1500);
                  }
                }
              }, false);

              return xhr;
            }

          });}
          $.post('/posts/', form.serialize(), function(post) {
            console.log(post.id);
            reddit.listPostsByID(post.subpage_id);
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

  /** @function updatePost
 * Increments/decrements the likes column of
 * the post.
 * @param {integer} id - the post to update
 */
reddit.updatePost = function(id, val) {
  $.get('/posts/' + id, (post) => {
    post.score += val;
    $.post('/posts/' + id, JSON.stringify(post), function() {
      reddit.listPostsByID(post.subpage_id);
    });
  });
}

/** @function showPost
 * Displays the specified post in the
 * content div of the page
 * @param {integer} id - the id of the subpage
 */
reddit.showPost = function(id) {
  // grab and clear the content element
  var content = $('#content').empty();
  var content2 = $('#content2').empty();

  var post_link = $('#post-link')
  if(post_link) {
    post_link.remove();
  }

  if($('#comment-link', '#side-menu').length != 1) {
    // add a menu item to add a post
    $('#side-menu')
      .append($('<div>').addClass("menu-item")
        .append($('<span>').addClass("menu-item-icon")
          .append(reddit.octicons.comment.toSVG({"width": 24})))
        .append($('<span>').addClass("hover-text")
          .text("Add Comment"))
        .attr('id', 'comment-link')
        .on('click', function(e) {
          reddit.newComment(id);
          reddit.showPost(id);
        }));
  }

  $.get('/posts/' + id, function(post) {
    // change the active tabe
    $('a.active').removeClass("active");
    $('#' + post.title).addClass("active");

    if(post.filename) {
      var type = post.fileType.split('/')[0];
      var media;
      if(type === 'video') {
        media = $('<video>').addClass("post-media center")
          .attr('controls', 'true')
          .append($('<source>')
            .attr('type', post.fileType)
            .attr('src', post.filename));
      } else if(type === 'image') {
        media = $('<img>').addClass("post-media")
          .attr('src', post.filename);
      }
    }
    $('<div>').addClass("post-header")
      .append($('<h1>')
        .text(post.title))
      .append($('<h4>')
        .text(post.content))
      .appendTo('#content2');
      if(media) media.appendTo('#content2');
      reddit.listCommentsByID(post.id);
  });
}

  function addVideoPost(post) {
    var video = $('<video>')
      .append($('<source>')
        .attr('type', post.fileType)
        .attr('src', post.filename)).get(0);
    video.addEventListener('loadeddata', function() {
      var canvas = $('<canvas>').get(0);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var dataURI = canvas.toDataURL('image/jpg');
      var img = $('<img>').attr("src", dataURI);
      img = getThumbnail(img, video.videoWidth, video.videoHeight);
      // var arrow-up = octicons['arrow-up'].toSVG();
      $('<div>').addClass("post")
        .append($('<div>').addClass("vote")
          .append($('<div>').addClass("upvote")
            .append($('<a>')
              .append(reddit.octicons['arrow-up'].toSVG({"width": 20}))
              .on('click', function(e) {
                reddit.updatePost(post.id, 1);
              })))
          .append($('<div>').addClass("score")
            .text(post.score))
          .append($('<div>').addClass("downvote")
            .append($('<a>')
              .append(reddit.octicons['arrow-down'].toSVG({"width": 20}))
              .on('click', function(e) {
                reddit.updatePost(post.id, -1);
              }))))
        .append($('<a>').addClass("thumbnail-link")
          .append(img))
        .append($('<div>').addClass("details")
        .append(
          $('<a>')
            .attr("href", "/")
            .attr("id", post.title)
            .text(post.title)
            .on('click', (e) => {
              e.preventDefault();
              $("a.active").removeClass("active");
              $(e.target).addClass("active");
              reddit.showPost(post.id);
           })
       )
          .append($('<h6>').text(post.content)))
        .appendTo('#content');
   });
   video.addEventListener("error", function () {
     console.log(this.error);
   });
  }

  function getThumbnail(img, oldWidth, oldHeight) {
    // adjust thumbnail size
    var maxWidth = 125;
    var ratio = 0;
    var width = oldWidth;
    var height = oldHeight;

    if(width > maxWidth) {
      ratio = maxWidth / width;
      img.css("width", maxWidth);
      img.css("height", height * ratio);
      height = height * ratio;
      width = width * ratio;
    }
    return img;
  }
}
