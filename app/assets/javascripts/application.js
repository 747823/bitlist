// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require angular

( function() {
  "use strict";

  var bitlist = angular.module( "bitlist", [] );

  // Google maps client-side geocoder instance
  bitlist.service( "geocoder", google.maps.Geocoder );

  // Local user settings service
  bitlist.service( "locals", [ "geocoder", function( geocoder ) {

    var locals = this;

    locals.searchRadiusOptions = [ {
      name: "10",
      value: 10
    }, {
      name: "25",
      value: 25
    }, {
      name: "50",
      value: 50
    }, {
      name: "100",
      value: 100
    }, {
      name: "250",
      value: 250
    } ];
    locals.searchRadius = locals.searchRadiusOptions[ 2 ];
    locals.searchLocation = "";
    locals.latitude = null;
    locals.longitude = null;
    locals.city = "";
    locals.locationSet = false;

    // Pull the city + "state" out of the google api JSON data
    locals.cityFromAddressComponents = function( addressComponents ) {
      var city = "";
      for ( var each in addressComponents ) {
        var comp = addressComponents[ each ];
        if ( comp.types[ 0 ] === "locality" ) {
          city = comp.long_name;
        }
        else if ( comp.types[ 0 ] === "administrative_area_level_1" ) {
          city += ", " + comp.short_name;
          break;
        }
      }
      return city;
    }

    // Geocode the local search location
    locals.geocode = function( callback ) {

      // Skip geocoder call if search field is empty
      if ( !locals.searchLocation ) {
        callback( false );
        return;
      }

      // Reset location set
      locals.locationSet = false;

      // Test cases: { address: "03801" }, 
      // { address: "Portsmouth" }, 
      // { address: "420 pleasant st, Portsmouth, NH" }, 
      // { address: "Portsmouth, NH" }, 
      // { address: "a bs location" },
      geocoder.geocode( {
        address: locals.searchLocation
      }, function( res, status ) {

        console.log( res );

        if ( res.length == 1 ) {
          // Input matched one location, proceed to set values
          locals.latitude = res[ 0 ].geometry.location.lat();
          locals.longitude = res[ 0 ].geometry.location.lng();
          locals.city = locals.cityFromAddressComponents( res[ 0 ].address_components );
          locals.locationSet = true;
          // console.log("Matched one location");
        }
        else if ( res.length > 1 ) {
          // Input matched more than one location
        }

        // Else input matched no location

        callback( res );

      } );
    }

  } ] );

  // Homepage controller
  bitlist.controller( "HomepageIndexCtrl", [ "$scope", "locals", function( $scope, locals ) {

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

} )();



