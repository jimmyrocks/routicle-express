// Open a database connection
var mongoose = require('mongoose');

exports.init = function(env) {
    var dbConnetion = "";
    switch (env) {
        case 'test':
            dbConnection = 'mongodb://localhost/ska5280-test';
            break;
        default:
            dbConnection = 'mongodb://localhost/ska5280';
    }

    mongoose.connect(dbConnection);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        console.log("Database Connected: " + dbConnection);
    });
}

// Define the tables
exports.tables = [{
    displayName: "Shows",
    model: mongoose.model(
            "shows",
            mongoose.Schema({
                name: String,
                doorsTime: Date, //doors
                showTime: Date, //Show
                endTime: Date,
                bands: Array,
                venue: String,
                advancedPrice: Number,
                doorPrice: Number,
                ticketPath: String,
                moreInfo: Array,
                ages: String,
                imgPath: Array
            })
    ),
    queryFields: [{
        externalName: "id",
        dbField: "_id",
        operator: "$all"
    }, {
        externalName: "name",
        dbField: "name",
        operator: "$all"
    }],
    crud: {
        user: "CRUD",
        moderator: "CRUD",
        admin: "CRUD"
    }
}, {
    displayName: "Bands",
    model: mongoose.model(
        "bands",
        mongoose.Schema({
            name: String,
            webpage: String,
            imgPath: Array
        })
    ),
    queryFields: [{
        externalName: "id",
        dbField: "_id",
        operator: "$all"
    }, {
        externalName: "name",
        dbField: "name",
        operator: "$all"
    }],
    crud: {
        user: "CRUD",
        moderator: "CRUD",
        admin: "CRUD"
    }
}, {
    displayName: "Venues",
    model: mongoose.model(
        "venues",
        mongoose.Schema({
            name: String,
            address: String,
            city: String,
            state: String,
            zip: String,
            lngLat: Array,
            phone: String,
            website: String,
            imgPath: Array
        })
    ),
    queryFields: [{
        externalName: "id",
        dbField: "_id",
        operator: "$all"
    }, {
        externalName: "name",
        dbField: "name",
        operator: "$all"
    }],
    crud: {
        user: "CRUD",
        moderator: "CRUD",
        admin: "CRUD"
    }
}];
