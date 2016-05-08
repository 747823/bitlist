( function() {
  "use strict";
  // Local user settings service
  angular.module("bitlist").service( "locals", [ "geocoder", function( geocoder ) {

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
})();