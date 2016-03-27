(function() {
  "use strict";

  // We probably want to do a separate Vue controller depending on...
  // Whether this is new/edit, show, or index
  if ( $("#listing").length ) {
    var listing = new Vue({
      el: "#listing",
      data: {

        listingData: window.LISTING_DATA || {},
        sidebarExpanded: false

      },
      computed: {
        expandButtonText: function() {
          return this.sidebarExpanded ? "Collapse" : "";
        }
      },
      methods: {

        toggleSidebar: function() {
          console.log("toggle sidebar");
          this.sidebarExpanded = !this.sidebarExpanded;
        }

      }
    });
  }

})();