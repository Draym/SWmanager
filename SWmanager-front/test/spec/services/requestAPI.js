'use strict';

describe('Service: requestAPI', function () {

  // load the service's module
  beforeEach(module('BibalouApp'));

  // instantiate service
  var requestAPI;
  beforeEach(inject(function (_requestAPI_) {
    requestAPI = _requestAPI_;
  }));

  it('should do something', function () {
    expect(!!requestAPI).toBe(true);
  });

});
