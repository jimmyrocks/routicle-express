# Responsicle
This project creates the response services in Express or Restify.  The goal of this project is that is can take a single Entity Relationship Diagram and a CRUD matrix, and use them to generate a usable REST interface with Express-like Node.js tools.

## Goals
There is currently no code out there that will create a full REST service from
a predefined table. This project hopes to make it easier for developers to
rapidly create a RESTful website using a config file for most of the DB work,
allowing the developer to focus on the application's functionality and display
design.

### Usage
See the database/config.json for an example of how to create a JSON file to
define your schema and your crud matrixes.

### TODO
This effort is still underway to create a very simple REST interface for any
table schema and crud matrix.  I would like to have a very simple gui that can
create the config.json file.
