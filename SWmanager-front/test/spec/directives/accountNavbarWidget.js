'use strict';

describe('Directive: accountNavbarWidget', function () {

  // load the directive's module
  beforeEach(module('BibalouApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<account-navbar-widget></account-navbar-widget>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the accountNavbarWidget directive');
  }));
});
