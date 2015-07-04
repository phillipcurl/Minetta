'use strict';

// Configuring the Articles module
angular.module('sales').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sales', 'sales', 'dropdown', '/sales(/create)?');
		Menus.addSubMenuItem('topbar', 'sales', 'List Sales', 'sales');
		Menus.addSubMenuItem('topbar', 'sales', 'New Sale', 'sales/create');
	}
]);