'use strict';

describe('Service: toolsUtils', function () {

  // load the service's module
  beforeEach(module('BibalouApp'));

  // instantiate service
  var toolsUtils;
  beforeEach(inject(function (_toolsUtils_) {
    toolsUtils = _toolsUtils_;
  }));

  it('should do something', function () {
    expect(!!toolsUtils).toBe(true);
  });

});
