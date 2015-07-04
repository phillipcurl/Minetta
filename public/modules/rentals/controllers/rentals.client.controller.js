'use strict';

// Rentals controller
angular.module('rentals').controller('RentalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rentals',
	function($scope, $stateParams, $location, Authentication, Rentals) {
		$scope.authentication = Authentication;

		// Create new Rental
		$scope.create = function() {
			// Create new Rental object
			var rental = new Rentals ({
				name: this.name
			});

			// Redirect after save
			rental.$save(function(response) {
				$location.path('rentals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Rental
		$scope.remove = function(rental) {
			if ( rental ) { 
				rental.$remove();

				for (var i in $scope.rentals) {
					if ($scope.rentals [i] === rental) {
						$scope.rentals.splice(i, 1);
					}
				}
			} else {
				$scope.rental.$remove(function() {
					$location.path('rentals');
				});
			}
		};

		// Update existing Rental
		$scope.update = function() {
			var rental = $scope.rental;

			rental.$update(function() {
				$location.path('rentals/' + rental._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rentals
		$scope.find = function() {
			$scope.rentals = Rentals.query();
		};

		// Find existing Rental
		$scope.findOne = function() {
			$scope.rental = Rentals.get({ 
				rentalId: $stateParams.rentalId
			});
		};
	}
]);