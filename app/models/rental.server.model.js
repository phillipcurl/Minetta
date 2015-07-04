'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rental Schema
 */
var RentalSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Rental name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Rental', RentalSchema);