( function() {
  "use strict";

  angular.module( "bitlist", [] )


  // Local user settings service
  .factory( "locals", function() {
    var data = {
      searchRadiusOptions: [ { name: "10", value: 10 }, { name: "25",value: 25 }, { name: "50", value: 50 },
        { name: "100", value: 100 }, { name: "250", value: 250 } ],
      searchLocation: "",
      latitude: null,
      longitude: null,
      city: "",
      zip: ""
    };
    data.searchRadius = data.searchRadiusOptions[ 2 ];
    return data;
  } )

  // Google maps client-side geocoder instance
  .service( "geocoder", google.maps.Geocoder )

  // Homepage controller
  .controller( "HomepageIndexCtrl", [ "$scope", "locals", "geocoder", function( $scope, locals, geocoder ) {

    $scope.locals = locals;
    $scope.caption = "Buy and sell stuff locally with bitcoins";

    // Geocoder TEST
    // Test cases: { address: "03801" }, { address: "Portsmouth" }, { address: "Portsmouth, NH" }, { address: "a bs location" }
    geocoder.geocode( { address: "03801" }, function( res, status ) {
      if ( res.length == 1 ) {
        // Input matched a location, proceed to set location
        // console.log( res );
        $scope.locals.zip = res[0].address_components[0].long_name;
        $scope.locals.city = res[0].address_components[1].long_name+", "+res[0].address_components[3].short_name;
        $scope.locals.latitude = res[0].geometry.location.lat();
        $scope.locals.longitude = res[0].geometry.location.lng();
        console.log( "Matched location: " + JSON.stringify( $scope.locals ) );
      }
      else if ( res.length > 1 ) {
        // Input matched more than one location
        // Create a dropdown to refine the matches
        console.log( "Matched multiple locations!" );
      }
      else {
        console.log( "Matched no locations!" );
      }
    } );

  } ] );

} )();