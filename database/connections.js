var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ska5280');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("YAY");
});

var jquery = require('jquery');
// Schemas

var showsSchema = mongoose.Schema({
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
});

var bandsSchema = mongoose.Schema({
    name: String,
    webpage: String,
    imgPath: Array
});

var venuesSchema = mongoose.Schema({
    name: String,
    address: String,
    latLon: Array,
    phone: String,
    website: String,
    imgPath: Array
});

// Using the Schemas


exports.ShowsModel = mongoose.model("show", showsSchema);

/*
var newShow = new Shows({ name: "Gothic Party II"});
console.log(newShow);
//newShow.save();

*/
