// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
//var morgan     = require('morgan');

// configure app
//app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

// Set up the mongoDB connection
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/people');
var Person     = require('./models/person');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// ----------------------------------------------------
router.route('/people')

	// create a Person (accessed at POST http://localhost:8080/people)
	.post(function(req, res) {

		var person = new Person();		              // create a new instance of the Person model
		person.firstName = req.body.firstName;      // set the Persons name (comes from the request)
    person.lastName = req.body.lastName;
    person.gender = req.body.gender;            //enum
    person.songPersonal = req.body.songPersonal;//the song that the RSVPs will dance on
    person.songWeds = req.body.songWeds;        //the song that the couple has to dance on
    person.email  = req.body.email;
    person.attendance = req.body.attendance;    //boolean
    person.foodPref  = req.body.foodPref;       // enum

    // do the actual saving into the database
		person.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Person created!' });
		});


	})

	// get all the People (accessed at GET http://localhost:8080/api/people)
	.get(function(req, res) {
		Person.find(function(err, people) {
			if (err)
				res.send(err);

			res.json(people);
		});
	});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/people/:person_id')

	// get the bear with that id
	.get(function(req, res) {
		Person.findById(req.params.person_id, function(err, person) {
			if (err)
				res.send(err);
			res.json(person);
		});
	})

	// update the bear with this id
	.put(function(req, res) {
		Person.findById(req.params.person_id, function(err, person) {

			if (err)
				res.send(err);

			person.name = req.body.name;
			person.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Person updated!' });
			});

		});
	})

	// delete the bear with this id
	.delete(function(req, res) {
		Person.remove({
			_id: req.params.person_id
		}, function(err, person) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
