'use strict';

describe('Service: User', function () {

  // load the service's module
  beforeEach(module('BibalouApp'));

  // instantiate service
  var user;
  beforeEach(inject(function (_user_) {
    user = _user_;
  }));

  it('should do something', function () {
    expect(!!user).toBe(true);
  });

});
