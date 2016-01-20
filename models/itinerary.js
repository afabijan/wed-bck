var mongoose     = require('mongoose');
var Person     = require('./person');
var Schema       = mongoose.Schema;

var ItinerarySchema   = new Schema({
	itTitle: String,
	people: []

});

module.exports = mongoose.model('Itinerary', ItinerarySchema)
