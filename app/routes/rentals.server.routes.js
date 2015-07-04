'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rentals = require('../../app/controllers/rentals.server.controller');

	// Rentals Routes
	app.route('/rentals')
		.get(rentals.list)
		.post(users.requiresLogin, rentals.create);

	app.route('/rentals/:rentalId')
		.get(rentals.read)
		.put(users.requiresLogin, rentals.hasAuthorization, rentals.update)
		.delete(users.requiresLogin, rentals.hasAuthorization, rentals.delete);

	// Finish by binding the Rental middleware
	app.param('rentalId', rentals.rentalByID);
};
