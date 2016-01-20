var mongoose     = require('mongoose');
var Person     = require('./models/person');
var Schema       = mongoose.Schema;

var ItinerarySchema   = new Schema({
	itTitle: String,
	people: [Person]

});

module.exports = mongoose.model('Itinerary', ItinerarySchema)
