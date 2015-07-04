'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Rental = mongoose.model('Rental'),
	_ = require('lodash');

/**
 * Create a Rental
 */
exports.create = function(req, res) {
	var rental = new Rental(req.body);
	rental.user = req.user;

	rental.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rental);
		}
	});
};

/**
 * Show the current Rental
 */
exports.read = function(req, res) {
	res.jsonp(req.rental);
};

/**
 * Update a Rental
 */
exports.update = function(req, res) {
	var rental = req.rental ;

	rental = _.extend(rental , req.body);

	rental.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rental);
		}
	});
};

/**
 * Delete an Rental
 */
exports.delete = function(req, res) {
	var rental = req.rental ;

	rental.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rental);
		}
	});
};

/**
 * List of Rentals
 */
exports.list = function(req, res) { 
	Rental.find().sort('-created').populate('user', 'displayName').exec(function(err, rentals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rentals);
		}
	});
};

/**
 * Rental middleware
 */
exports.rentalByID = function(req, res, next, id) { 
	Rental.findById(id).populate('user', 'displayName').exec(function(err, rental) {
		if (err) return next(err);
		if (! rental) return next(new Error('Failed to load Rental ' + id));
		req.rental = rental ;
		next();
	});
};

/**
 * Rental authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.rental.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
