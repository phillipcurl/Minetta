'use strict';

//Setting up route
angular.module('rentals').config(['$stateProvider',
	function($stateProvider) {
		// Rentals state routing
		$stateProvider.
		state('listRentals', {
			url: '/rentals',
			templateUrl: 'modules/rentals/views/list-rentals.client.view.html'
		}).
		state('createRental', {
			url: '/rentals/create',
			templateUrl: 'modules/rentals/views/create-rental.client.view.html'
		}).
		state('viewRental', {
			url: '/rentals/:rentalId',
			templateUrl: 'modules/rentals/views/view-rental.client.view.html'
		}).
		state('editRental', {
			url: '/rentals/:rentalId/edit',
			templateUrl: 'modules/rentals/views/edit-rental.client.view.html'
		});
	}
]);