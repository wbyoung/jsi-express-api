'use strict';

process.env.NODE_ENV = 'testing';
// NODE_ENV=testing ./node_modules/.bin/knex migrate:latest

var _ = require('lodash');
var expect = require('chai').expect;
var request = require('request');
var util = require('util');
var server = require('../server');
var app = server.app;
var knex = server.knex;
var Person = server.Person;
var server;
var port = 38239;
var baseURL = util.format('http://localhost:%d', port);


describe('api', function() {

  before(function(done) {
    server = app.listen(port, done);
  });

  after(function(done) {
    server.close(done);
  });

  beforeEach(function(done) {
    knex('people').delete().then(function() { done(); }, done);
  });

  it('handles POST /api/people', function(done) {
    var data = {
      firstName: 'Whitney',
      lastName: 'Young',
      address: 'Chicago'
    };
    request.post(baseURL + '/api/people', { form: data }, function(err, response, body) {
      Person.fetchAll().then(function(people) {
        var bodyObject = JSON.parse(body);
        delete bodyObject.person.id;
        var peopleWithoutIds = people.toJSON().map(function(person) {
          return _.omit(person, 'id');
        });
        expect(bodyObject).to.eql({
          person: {
            firstName: 'Whitney',
            lastName: 'Young',
            address: 'Chicago'
          }
        })
        expect(peopleWithoutIds).to.eql([{
          firstName: 'Whitney',
          lastName: 'Young',
          address: 'Chicago'
        }]);
        done();
      });
    });
  });

  it('rejects POST /api/people when there is too much info', function(done) {
    var data = {
      firstName: 'Whitney',
      lastName: 'Young',
      address: 'Chicago',
      puppies: '12 of them'
    };
    request.post(baseURL + '/api/people', { form: data }, function(err, response, body) {
      var bodyObject = JSON.parse(body);
      expect(bodyObject).to.eql({ error: 'Invalid request. Properties don\'t match allowed values.' });
      expect(response.statusCode).to.eql(400);
      Person.fetchAll().then(function(people) {
        expect(people.toJSON()).to.eql([]);
        done();
      });
    });
  });

});
