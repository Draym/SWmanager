'use strict';

describe('Controller: CreateAccountCtrl', function () {

  // load the controller's module
  beforeEach(module('BibalouApp'));

  var CreateAccountCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateAccountCtrl = $controller('CreateAccountCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CreateAccountCtrl.awesomeThings.length).toBe(3);
  });
});
