'use strict';

describe('Service: dateTools', function () {

  // load the service's module
  beforeEach(module('BibalouApp'));

  // instantiate service
  var dateTools;
  beforeEach(inject(function (_dateTools_) {
    dateTools = _dateTools_;
  }));

  it('should do something', function () {
    expect(!!dateTools).toBe(true);
  });

});
