var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PeopleSchema   = new Schema({
	firstName: String,
	lastName: String,
	gender: { type: String, enum: ['male', 'female'] },
	songPersonal: String,
	songWeds: String,
	email: String,
	attendance: Boolean,
	foodPref: { type: String, enum: ['meat', 'fish','vegan'] },

});
module.exports = mongoose.model('Person', PeopleSchema)
