var _ = require('lodash');
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

// note: not such a good way to make this work.
if (require.main === module) {
  app.use(require('morgan')('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var Person = bookshelf.Model.extend({
  tableName: 'people'
});

var id = 1;
var people = {};

app.get('/', function(req, res) {
  res.redirect('/home/');
});

app.get('/api/people', function(req, res) {
  res.json({ people: _.values(people) });
});


// url: http://localhost:8000/api/people?firstName=lamp&lastName=love&address=portland
// returns: {"people": []}
app.post('/api/people', function(req, res) {
  var properties = _.keys(req.body);
  if (!_.isEqual(properties, ['firstName', 'lastName', 'address'])) {
    res.status(400);
    res.json({ error: 'Invalid request. Properties don\'t match allowed values.' });
  }
  else {
    Person.forge(req.body).save().then(function(person) {
      res.json({ person: person });
    })
    .catch(function(error) {
      res.status(500);
      res.json({ error: 'Unhandled exception' });
    })
    .done();
  }
});

app.put('/api/people/:id', function(req, res) {
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

module.exports = {
  app: app,
  knex: knex,
  bookshelf: bookshelf,
  Person: Person
};

// if this was done via the command line & not required from another file
if (require.main === module) {
  var server = app.listen(8000, function() {
    console.log('Listening on port %d', server.address().port);
  });
}
