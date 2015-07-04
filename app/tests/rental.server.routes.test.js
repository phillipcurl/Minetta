'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Rental = mongoose.model('Rental'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, rental;

/**
 * Rental routes tests
 */
describe('Rental CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Rental
		user.save(function() {
			rental = {
				name: 'Rental Name'
			};

			done();
		});
	});

	it('should be able to save Rental instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rental
				agent.post('/rentals')
					.send(rental)
					.expect(200)
					.end(function(rentalSaveErr, rentalSaveRes) {
						// Handle Rental save error
						if (rentalSaveErr) done(rentalSaveErr);

						// Get a list of Rentals
						agent.get('/rentals')
							.end(function(rentalsGetErr, rentalsGetRes) {
								// Handle Rental save error
								if (rentalsGetErr) done(rentalsGetErr);

								// Get Rentals list
								var rentals = rentalsGetRes.body;

								// Set assertions
								(rentals[0].user._id).should.equal(userId);
								(rentals[0].name).should.match('Rental Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Rental instance if not logged in', function(done) {
		agent.post('/rentals')
			.send(rental)
			.expect(401)
			.end(function(rentalSaveErr, rentalSaveRes) {
				// Call the assertion callback
				done(rentalSaveErr);
			});
	});

	it('should not be able to save Rental instance if no name is provided', function(done) {
		// Invalidate name field
		rental.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rental
				agent.post('/rentals')
					.send(rental)
					.expect(400)
					.end(function(rentalSaveErr, rentalSaveRes) {
						// Set message assertion
						(rentalSaveRes.body.message).should.match('Please fill Rental name');
						
						// Handle Rental save error
						done(rentalSaveErr);
					});
			});
	});

	it('should be able to update Rental instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rental
				agent.post('/rentals')
					.send(rental)
					.expect(200)
					.end(function(rentalSaveErr, rentalSaveRes) {
						// Handle Rental save error
						if (rentalSaveErr) done(rentalSaveErr);

						// Update Rental name
						rental.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Rental
						agent.put('/rentals/' + rentalSaveRes.body._id)
							.send(rental)
							.expect(200)
							.end(function(rentalUpdateErr, rentalUpdateRes) {
								// Handle Rental update error
								if (rentalUpdateErr) done(rentalUpdateErr);

								// Set assertions
								(rentalUpdateRes.body._id).should.equal(rentalSaveRes.body._id);
								(rentalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rentals if not signed in', function(done) {
		// Create new Rental model instance
		var rentalObj = new Rental(rental);

		// Save the Rental
		rentalObj.save(function() {
			// Request Rentals
			request(app).get('/rentals')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Rental if not signed in', function(done) {
		// Create new Rental model instance
		var rentalObj = new Rental(rental);

		// Save the Rental
		rentalObj.save(function() {
			request(app).get('/rentals/' + rentalObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', rental.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Rental instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rental
				agent.post('/rentals')
					.send(rental)
					.expect(200)
					.end(function(rentalSaveErr, rentalSaveRes) {
						// Handle Rental save error
						if (rentalSaveErr) done(rentalSaveErr);

						// Delete existing Rental
						agent.delete('/rentals/' + rentalSaveRes.body._id)
							.send(rental)
							.expect(200)
							.end(function(rentalDeleteErr, rentalDeleteRes) {
								// Handle Rental error error
								if (rentalDeleteErr) done(rentalDeleteErr);

								// Set assertions
								(rentalDeleteRes.body._id).should.equal(rentalSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Rental instance if not signed in', function(done) {
		// Set Rental user 
		rental.user = user;

		// Create new Rental model instance
		var rentalObj = new Rental(rental);

		// Save the Rental
		rentalObj.save(function() {
			// Try deleting Rental
			request(app).delete('/rentals/' + rentalObj._id)
			.expect(401)
			.end(function(rentalDeleteErr, rentalDeleteRes) {
				// Set message assertion
				(rentalDeleteRes.body.message).should.match('User is not logged in');

				// Handle Rental error error
				done(rentalDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Rental.remove().exec();
		done();
	});
});