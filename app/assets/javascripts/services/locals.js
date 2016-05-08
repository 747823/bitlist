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
    locals.cityMatches = [];
    locals.matches = false;

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
      // Sometimes it will match an "administrative_area_level_1" but not "locality", so let's return false in those cases
      return ( city.charAt(0) !== "," ) ? city : false;
    }

    // Set the list of city matches from the response
    locals.setCityMatches = function( res ) {
      for ( var each in res ) {
        var city = locals.cityFromAddressComponents( res[each].address_components );
        if ( city ) {
          locals.cityMatches.push({ city: city, data: res[each] });
        }
      }
    }

    // Sets the matched city and other data from a single geocoded location
    locals.setCity = function( data ) {
      locals.latitude = data.geometry.location.lat();
      locals.longitude = data.geometry.location.lng();
      locals.city = locals.cityFromAddressComponents( data.address_components );
      locals.searchLocation = locals.city;
      locals.matches = false;
      locals.cityMatches = [];
      locals.locationSet = true;
      console.log("Set local city to " + locals.city);
      return false;
    }

    // Geocode the local search location
    locals.geocode = function( callback ) {

      // Reset matches
      locals.matches = false;
      locals.cityMatches = [];

      // Skip geocoder call if search field is empty
      if ( !locals.searchLocation ) {
        callback( false );
        return;
      }

      // Reset location set
      locals.locationSet = false;

      geocoder.geocode( {
        address: locals.searchLocation
      }, function( res, status ) {

        console.log( res );

        if ( res.length == 1 ) {
          // Input matched one location, proceed to set values right away
          // Make sure it's actually a valid city first
          var city = locals.cityFromAddressComponents( res[0].address_components );
          if ( city ) {
            locals.setCity( res[ 0 ] );
          }
          res = city ? res : [];
        }
        else if ( res.length > 1 ) {
          // Input matched more than one location, set the city matches
          locals.setCityMatches( res );
          locals.matches = true;
        }

        // Else input matched no location
        callback( res );

      } );
    }

  } ] );
})();