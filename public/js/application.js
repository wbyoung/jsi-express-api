$(function() {
  'use strict';

  var templates = {
    people: Handlebars.compile($("#people-template").html())
  };

  console.log('start');

  var handleError = function(e) {
    console.log(e);
    $('.error.predefined').show();
  };

  var updatePeople = function() {
    $.ajax('/api/people', { method: 'GET' }).then(function(data) {
      $('#people').html(templates.people(data));
    }, handleError);
  };

  $('#add-person').click(function(event) {
    var data = {
      firstName: $('#add-person-first-name').val(),
      lastName: $('#add-person-last-name').val(),
      address: $('#add-person-address').val()
    };
    var options = { method: 'POST', data: data };
    var promise = $.ajax('/api/people', options);
    promise.then(updatePeople, handleError);
    return false;
  });

  $(document).on('click', '.person-delete', function() {
    var $this = $(this);
    var id = $this.data('id');
    var options = { method: 'DELETE' };
    var url = '/api/people/' + id;
    var promise = $.ajax(url, options);
    promise.then(updatePeople, handleError);
    return false;
  });
  updatePeople();
});
