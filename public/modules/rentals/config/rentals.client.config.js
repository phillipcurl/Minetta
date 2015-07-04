'use strict';

// Configuring the Articles module
angular.module('rentals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rentals', 'rentals', 'dropdown', '/rentals(/create)?');
		Menus.addSubMenuItem('topbar', 'rentals', 'List Rentals', 'rentals');
		Menus.addSubMenuItem('topbar', 'rentals', 'New Rental', 'rentals/create');
	}
]);