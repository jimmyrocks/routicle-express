# Routicle
Routicle is an interface to Express and Restify that creates a complete RESTful interface to any schema defined by the user.

## Goals
There is currently no code out there that will create a full REST service from
a predefined table. This project hopes to make it easier for developers to
rapidly create a RESTful website using a config file for most of the DB work,
allowing the developer to focus on the application's functionality and display
design.

## Usage
See the database/config.json for an example of how to create a JSON file to
define your schema and your crud matrixes.

### Config Example
```javascript
{
  "databases":{ // Define the databases connection strings used for each type of database
    "development":"mongodb://localhost/routicle-development",
    "staging":"mongodb://localhost/routicle-staging",
    "production":"mongodb://localhost/routicle",
    "test":"mongodb://localhost/routicle-test"
  },
  "tables":[
    {
      "displayName":"Demo Table", // Name visible to the public
      "internalName":"demo", // internal MongoDB table name
      "tableCrud":{ // Most restrictive crud. This restrict field based CRUDS further.
        "guest":"r", // Users with the "guest" role can only read (get) from any queries in this database
        "user":"r", // Users with the "user" role can only read (get) from any queries in this database
        "moderator":"cru", // Users with the "moderator" role can create (post), read (get), and update (put) any queries in this database
        "admin":"crud" // Users with the "moderator" role can create (post), read (get), update (put), and delete (delete) any queries in this database
      },
      "mongoFields":{ // Define how internal MongoDB fields are displayed and queried
        "_id":{
          "displayField":[ // Sets up a list of which users can get this field back in a query
            "guest",
            "user",
            "moderator",
            "admin"
          ],
          "query":[ // Set up a REST
            {
              "name":"id", // Externally exposed name for the "_id" field
              "operator":"$all", // MongoDB Operator
              "crud":{ // Crud matrix for this individual query
                "guest":"r",
                "user":"r",
                "moderator":"cru",
                "admin":"crud"
              }
            }
          ]
        },
        "__v":{ // The version field in mongoDB is of no use to our application, it does not need to be defined in the schema
                // but it is here for completeness.
          "displayField":[ // Since an empty array is listed, no users will be able to see this field
                                                   // If this field were null, or not included, the field would default to visible to all
          ]
        }
      },
      "fields":{ // Define custom fields within the mongoDB Document
        "name":{ // Define the field name
          "type":"String", //Define the field type ("String", "Number", "Date", "Array", "Object", "Boolean")
          "query":[ // Define a query for this field that can be accessed through REST
            {
              "name":"name", // query name exposed to the user
              "operator":"$all", // MongoDB operation
              "crud":{ // Custom CRUD Matrix for this query, a CRUD is required for each query
                "guest":"r",
                "user":"r",
                "moderator":"cru",
                "admin":"crud"
              }
            }
          ]
        },
        "startTime":{ // Define another custom field
          "type":"Date"
        } // This field will not be queriable by the REST server, so no more information is needed
    }
  ]
}
```

## TODO
This effort is still underway to create a very simple REST interface for any
table schema and crud matrix.  I would like to have a very simple gui that can
create the config.json file.
