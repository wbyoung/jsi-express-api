'use strict';
// latest migration
exports.up = function(knex, Promise) {
// create table of people with column first name, last name, address as strings
  return knex.schema.createTable('people', function(table) {
// each person as an id, incrementing by one
    table.increments('id');
// first column
    table.string('firstName');
// second column
    table.string('lastName');
// third column
    table.string('address');
  });
};


// for rollback if needed - drops the current table
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('people');
};
