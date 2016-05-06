( function() {
  "use strict";

  angular.module( "bitlist", [] )

  .factory( "locals", [ function() {
    var data = {
      searchRadiusOptions: [{
        name: "10", value: 10
      }, {
        name: "25", value: 25
      }, {
        name: "50", value: 50
      }, {
        name: "100", value: 100
      }, {
        name: "250", value: 250
      }],
      searchLocationUserInput: ""
    };
    data.searchRadius = data.searchRadiusOptions[2];
    return data;
  } ] )

  .controller( "HomepageIndexCtrl", [ "$scope", "locals", function( $scope, locals ) {
    $scope.locals = locals;
    $scope.caption = "Buy and sell stuff locally with bitcoins";
  } ] );

} )();