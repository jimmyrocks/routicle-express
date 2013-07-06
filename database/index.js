// Open a database connection
var mongoose = require('mongoose');
var config = require('./config');

// Set up the database based on environment
exports.init = function(env, callback) {

    // Define the database connection
    mongoose.connect(config.databases[env]);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log("Database Connected: " + config.databases[env]);
    });

    //Convert the tables to Mongoose tables
    var mongooseTables = [];

    // Since JSON doesn't support types
    var typeLookup = {
        "string": String,
        "number": Number,
        "array": Array,
        "date": Date,
        "boolean": Boolean,
        "object": Object
    };

    // Function to convert the CRUD string into T/F values
    var splitCrud = function(crudString) {
        var crudObject = {};
        crudString.split('').map(function(character) {
            if (character) {
                crudObject[character.toLowerCase()] = true;
            }
        });
        return crudObject;
    };

    // Loop through the tables and build them
    config.tables.map(function(table) {
        var tableObject = {};
        // Add the display name
        tableObject["displayName"] = table["displayName"];
        tableObject["queryFields"] = [];

        // Create the schema
        var schema = {};
        for (var fieldName in table.fields) {
            if (table.fields.hasOwnProperty(fieldName)) {
                var field = table.fields[fieldName];
                schema[fieldName] = typeLookup[field["type"].toLowerCase()];
                if (field["query"]) {
                    var queryObject = field["query"];
                    queryObject["dbField"] = fieldName;
                    tableObject["queryFields"].push(queryObject);
                }
            }
        }

        // Create the model
        tableObject["model"] = mongoose.model(
            table.internalName,
            mongoose.Schema(schema)
        );

        // Create the queryable fields

        // Add it to the larger mongooseTables
        mongooseTables.push(tableObject);
    });


    // Send back to caller
    callback(mongooseTables);
}

