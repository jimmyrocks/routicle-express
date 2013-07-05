// Open a database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ska5280');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("YAY! Database Connected!");
});

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
                venue: Number,
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
    crud: "CRUD"
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
    crud: "CRUD"
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
    crud: "CRUD"
}];
