// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var app        = express();
//var morgan     = require('morgan');

// configure app
//app.use(morgan('dev')); // log requests to the console

app.use(cors());

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port     = process.env.PORT || 8080; // set our port

// Set up the mongoDB connection
mongoose   = require('mongoose');
var uriUtil = require('mongodb-uri');
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } },  };

// read the params from a credentials file OR when using HEROKU use the .env
// LOCAL SOLUTION
//var configParams = require('./credentials.json');
//u = configParams.mongoDBusername;
//p = configParams.mongoDBpassword;

//USING HEROKU VARIABLES
// in termina€: heroku config:set var=value
// # heroku config:set MONUSER=...
// # heroku config:set MONPWD=...
// # heroku local

u = process.env.MONUSER;
p = process.env.MONPWD;



var mongodbUri = 'mongodb://'.concat(u).concat(':').concat(p).concat('@ds055832.mongolab.com:55832/wedding');
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri, options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function() {
  // Wait for the database connection to establish, then start the app.
});
var Person     = require('./models/person');
var Itinerary = require('./models/itinerary');



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

// for /people
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

  // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
  .put(function(req, res) {

      // use our bear model to find the bear we want
      Person.findById(req.params.person_id, function(err, person) {

          if (err)
              res.send(err);
          if (req.body.firstName)
              person.firstName = req.body.firstName;
          if (req.body.lastName)
            person.lastName = req.body.lastName;
          if (req.body.gender)
            person.gender = req.body.gender;
          if (req.body.songPersonal)
            person.songPersonal = req.body.songPersonal;
          if (req.body.songWeds)
            person.songWeds = req.body.songWeds;
          if (req.body.email)
            person.email  = req.body.email;
          if (req.body.attendance)
            person.attendance = req.body.attendance;
          if (req.body.foodPref)
            person.foodPref  = req.body.foodPref;       // enum

          // save the Person's updated details
          person.save(function(err) {
              if (err)
                  res.send(err);

              res.json({ message: 'Person updated!' });
          });

      });
  })


	// delete the person with this id
	.delete(function(req, res) {
		Person.remove({
			_id: req.params.person_id
		}, function(err, person) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// Routes for Itinerary
// GET ITINERARY shoud show all the itineraries  DONE
// GET ITINERARY/ID should show all the people under that itinerary IDs  DONE
// DELETE ITINERARY/ID should delete the itinerary under that ID   DONE
// CReate Itinerary -> should create the itinerary with the set of people given as params DONE



router.route('/itineraries')

  //GET ALL
  .get(function(req, res) {
    Itinerary.find(function(err, itineraries) {
      if (err)
        res.send(err);

      res.json(itineraries);
    });
  })


	// create an ITINERARY (accessed at POST http://localhost:8080/people)
	.post(function(req, res) {
    //var sifra = req.body.sifra;
    var body = req.body;


    res.json(body);
    var iti = new Itinerary();
    iti.itTitle = body.sifra;
    iti.people = body.peopleIds;


    // do the actual saving into the database
		iti.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Itinerary created!' });
		});


	}); //end for routes/itineraries


router.route('/itineraries/:itTitle')
  // get the Itinerary with a certain ID
  // .get(function(req, res) {
  //   Itinerary.findById(req.params.it_id, function(err, itinerary) {
  //     if (err)
  //       res.send(err);
  //     res.json(itinerary);
  //   });
  // })

  // returns the objects that match the title (sifra) of the familly
.get(function(req, res)
{
    Itinerary.findOne({'itTitle':req.params.itTitle},'people').lean().exec(function (err, itinerary)
    {
        if (err)
          res.send(err);

          // res.json(itinerary);
          var x = itinerary.people;


        console.log(typeof x);
        // res.json(x);

        // // another find that returns people's data
        Person.find({'_id': {$in : x}}, function(err, peopleData) {
          if (err)
            res.send(err);

            //we reuturn the people data that belong to sifra
            res.json(peopleData);
        });



    }
);
}
  )


  //
  //
  // Itinerary.findOne({'itTitle':req.params.itTitle}, function(err, itinerary) {
  //   if (err)
  //     res.send(err);
  //
  //   // we get the people inside itinerary
  //   var x = itinerary.people;
  //   console.log(x[0]);
  //   //r

  .delete(function(req, res) {
    Itinerary.remove({
      _id: req.params.it_id
    }, function(err, itinerary) {
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
