var _ = require('lodash');
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var Person = bookshelf.Model.extend({
  tableName: 'people'
});

var id = 1;
var people = {};

app.get('/api/people', function(req, res) {
  res.json({ people: _.values(people) });
});


// url: http://localhost:8000/api/people?firstName=lamp&lastName=love&address=portland
// returns: {"people": []}
app.post('/api/people', function(req, res) {
  var person = _.pick(req.body, 'firstName', 'lastName', 'address');
  res.json({ person: person });
  Person.forge(person).save().then(function(person) {
  console.log('created a person %j', person.toJSON());
})
.done();
});

app.put('/api/people/:id', function(req, res) {
  console.log(req.params.id);
  var person = people[req.params.id];
  if (person) {
    person = _.pick(req.body, 'firstName', 'lastName', 'address');
    person.id = req.params.id;
    people[person.id] = person;
  };
  res.json({ person: person });
});

app.delete('/api/people/:id', function(req, res) {
  var person = people[req.params.id];
  if (person) {
    delete people[person.id];
  }
  res.json({ person: person });
});

// curl -X GET http://localhost:8000/api/people
// curl -X POST --data "firstName=Whitney&lastName=Young&address=Chicago" http://localhost:8000/api/people
// curl -X GET http://localhost:8000/api/people
// curl -X PUT --data "firstName=Whitney&lastName=Young&address=Portland" http://localhost:8000/api/people/1
// curl -X GET http://localhost:8000/api/people
// curl -X DELETE http://localhost:8000/api/people/1
// curl -X GET http://localhost:8000/api/people
// curl -X PUT --data "firstName=Whitney&lastName=Young&address=Nowhere" http://localhost:8000/api/people/1
// curl -X DELETE http://localhost:8000/api/people/1

var server = app.listen(8000, function() {
  console.log('Listening on port %d', server.address().port);
});
