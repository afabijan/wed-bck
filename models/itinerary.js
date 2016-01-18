var ItinerarySchema   = new Schema({
	itTitle: String,
	people: [PeopleSchema]

});

module.exports = mongoose.model('Itinerary', ItinerarySchema)
