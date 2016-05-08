( function() {
  "use strict";
  // Homepage controller
  angular.module("bitlist").controller( "HomepageIndexCtrl", [ "$scope", "locals", function( $scope, locals ) {

    var inputBlurDelay = 200;
    var locationInputTimeout = null;

    var vm = $scope;
    vm.locals = locals;
    vm.locationInputFocused = false;

    // Geocoder callback
    vm.geocodeComplete = function( res ) {
      vm.$apply();
      if ( vm.locals.locationSet ) {
        console.log( "Selected location " + vm.locals.city )
      }
    }

    // Geocoder controller wrapper method
    // Some test cases: "03801"
    // "Portsmouth"
    // "420 pleasant st, Portsmouth, NH"
    // "Portsmouth, NH"
    // "portsmotuh nh"
    // "a bs location"
    vm.geocode = function() {
      vm.locals.geocode( vm.geocodeComplete );
    }

    // Blur handler
    vm.locationInputBlur = function() {
      window.setTimeout( function() {
        vm.locationInputFocused = false;
        vm.$apply();
      }, inputBlurDelay );
    }

    // Focus handler
    vm.locationInputFocus = function() {
      vm.locationInputFocused = true;
      if ( locationInputTimeout ) {
        window.clearTimeout( locationInputTimeout );
        locationInputTimeout = null;
      }
    }

  } ] );
})();