'use strict';

/**
 * @ngdoc service
 * @name SWmanagerApp.submitResult
 * @description
 * # submitResult
 * Factory in the SWmanagerApp.
 */
angular.module('SWmanagerApp')
  .factory('SubmitResult', function ($location, toaster) {
    // Service logic
    // ...

    // Public API here
    return {
      none : function() {
        return function(){};
      },
      submitSuccess: function(optionalTask, optionalMessage) {
        return function(response) {
          //console.log("Success:", response);
          if (!(optionalMessage == null)) {
            toaster.success({'body': (optionalMessage == "" ? "Done" : optionalMessage)});
          }
          if (!(optionalTask == null)) {
            if ((typeof optionalTask === "function")) {
              optionalTask(response);
            } else {
              toaster.success({'body': (optionalTask == "" ? "Done" : optionalTask)});
            }

          }
        };
      },
      submitFailure : function(optionalTask, optionalMessage) {
        return function(response) {
          //console.log("Fail:", response);
          if (!(optionalTask == null)) {
            if ((typeof optionalTask === "function")) {
              optionalTask(response);
            } else if (!optionalMessage) {
              optionalMessage = optionalTask;
            }
          }

          if (response.data != null) {
            toaster.error({'body': (response.data.message == null ? response.statusText : response.data.message)});

            if (response.data.message != null && response.data.message == "No token provided.") {
              $location.path("/login");
            }
          } else {
            toaster.error({'body': (optionalMessage == null ? "An error happened" : optionalMessage)});
          }
        };
      }
    };
  });
