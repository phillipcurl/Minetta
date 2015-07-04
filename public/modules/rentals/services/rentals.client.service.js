'use strict';

//Rentals service used to communicate Rentals REST endpoints
angular.module('rentals').factory('Rentals', ['$resource',
	function($resource) {
		return $resource('rentals/:rentalId', { rentalId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);