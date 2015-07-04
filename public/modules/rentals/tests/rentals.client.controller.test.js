'use strict';

(function() {
	// Rentals Controller Spec
	describe('Rentals Controller Tests', function() {
		// Initialize global variables
		var RentalsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Rentals controller.
			RentalsController = $controller('RentalsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rental object fetched from XHR', inject(function(Rentals) {
			// Create sample Rental using the Rentals service
			var sampleRental = new Rentals({
				name: 'New Rental'
			});

			// Create a sample Rentals array that includes the new Rental
			var sampleRentals = [sampleRental];

			// Set GET response
			$httpBackend.expectGET('rentals').respond(sampleRentals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rentals).toEqualData(sampleRentals);
		}));

		it('$scope.findOne() should create an array with one Rental object fetched from XHR using a rentalId URL parameter', inject(function(Rentals) {
			// Define a sample Rental object
			var sampleRental = new Rentals({
				name: 'New Rental'
			});

			// Set the URL parameter
			$stateParams.rentalId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rentals\/([0-9a-fA-F]{24})$/).respond(sampleRental);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rental).toEqualData(sampleRental);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rentals) {
			// Create a sample Rental object
			var sampleRentalPostData = new Rentals({
				name: 'New Rental'
			});

			// Create a sample Rental response
			var sampleRentalResponse = new Rentals({
				_id: '525cf20451979dea2c000001',
				name: 'New Rental'
			});

			// Fixture mock form input values
			scope.name = 'New Rental';

			// Set POST response
			$httpBackend.expectPOST('rentals', sampleRentalPostData).respond(sampleRentalResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rental was created
			expect($location.path()).toBe('/rentals/' + sampleRentalResponse._id);
		}));

		it('$scope.update() should update a valid Rental', inject(function(Rentals) {
			// Define a sample Rental put data
			var sampleRentalPutData = new Rentals({
				_id: '525cf20451979dea2c000001',
				name: 'New Rental'
			});

			// Mock Rental in scope
			scope.rental = sampleRentalPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rentals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rentals/' + sampleRentalPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rentalId and remove the Rental from the scope', inject(function(Rentals) {
			// Create new Rental object
			var sampleRental = new Rentals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rentals array and include the Rental
			scope.rentals = [sampleRental];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rentals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRental);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rentals.length).toBe(0);
		}));
	});
}());