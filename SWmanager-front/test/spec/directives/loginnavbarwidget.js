'use strict';

describe('Directive: loginNavbarWidget', function () {

  // load the directive's module
  beforeEach(module('BibalouApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<login-navbar-widget></login-navbar-widget>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the loginNavbarWidget directive');
  }));
});
