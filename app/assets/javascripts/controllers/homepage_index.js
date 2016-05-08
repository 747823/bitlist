( function() {
  "use strict";
  // Homepage controller
  angular.module("bitlist").controller( "HomepageIndexCtrl", [ "$scope", "locals", function( $scope, locals ) {

    var vm = $scope;

    vm.locals = locals;
    vm.caption = "Buy and sell stuff locally with bitcoins"; // This is just to test

    vm.geocodeComplete = function( res ) {
      if ( res && res.length ) {
        if ( res.length == 1 ) {
          // Matched exactly one location
        }
        else {
          // Matched multiple locations, prompt them to choose somehow
        }
      }
      // else user didn't type in a valid location

      if ( vm.locals.locationSet ) {
        console.log( "Selected location " + vm.locals.city )
      }
    }

    vm.geocode = function() {
      vm.locals.geocode( vm.geocodeComplete );
    }

  } ] );
})();