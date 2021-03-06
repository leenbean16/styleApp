// =============================================================
// 			Requesting the Stylist data from the server 
//						to build a list
// =============================================================
// "use strict"

(function(window, google){
  $(document).ready(function() {
    console.log("in module sortedlistrequest");
                console.log('====================================')
    getStylists();
      console.log("after call");
                console.log('====================================')
    $(document).on("click", "button", newSearch);

  	// This function grabs stylists from the database and 
  	// returns them sorted according to search parameters
  	function getStylists() {
        //  take in search parameters from the page and build a request
        console.log("stylists start");
        var params = (new URL(document.location)).searchParams;
        console.log('params ', params)
        var service = params.get("service");
        console.log('service = ', service)
        var searchAddress = params.get("address");
        console.log('searchAddress = ', searchAddress)

        //  request data from server side
      	$.get("../api/stylist/search/" + service + "/" + searchAddress, function(data) {
      				console.log("stylists", data);
      				if (data) {
                console.log("how many = ", data.length);
                console.log('====================================')
                var marker;
                        //  populate a list on the page
                        for (var i = 0; i < data.length; i++) {
                            var display   = {
                                    // img       : (data.Stylist[i].img),
                                    id        : (data[i].id),
                                    name      : (data[i].first_name
                                                +" "
                                                +data[i].last_name),
                                    bio       : (data[i].bio),
                                    email     : data[i].email,
                                    photo     : '.'+data[i].picture,
                                    // services  : (data[i].services),
                                    // rating    : (data[i].Review.rating),
                                    lat       : (data[i].address_lat),
                                    long      : (data[i].address_long),
                                    reference : ""
                            };
                            console.log('display = ', display)                            
                            
                            //  populate markers on map
                            if ((display.lat !== null) && (display.long !== null)) {
                                console.log('latlong = '+ display.lat +" , "+display.long)
                                display.reference = placeMarker(display.lat, display.long); 
                                console.log('display.reference = ', display.reference)  
                            }
                            //  dynamically build the display box
                            buildStylistDisplay(i, display);
                            makeStylistMiniProfile(data[i]);
                            fillStylistMiniProfile(data[i]);

                            google.maps.event.trigger(map, "resize");
                        }
              }
    	  });
    };


//===============================================================
//      new search
//===============================================================
    function newSearch() {
          window.location.href = "../list/?service=" + svcSearch +"&range=" + distSearch+"/"
    }
//===============================================================
//      populate list of stylists
//===============================================================!
    function buildStylistDisplay(i, display) {

      var headDiv = $('#boxlist');

      headDiv.append(
          $('<div/>', {'class': 'box', id: display.id}).append(
              $('<article/>', {'class': 'media'}).append(
                  $('<div/>', {class: 'media-left'}).append(
                      $('<figure/>', {class: 'image is-84x84'}).append(
                          $('<img>', {src: display.photo,
                                      alt: 'Image'}
                           )
                      ).append(
                          $('<p>', {class: 'ref', text: display.reference}))
                  )
              ).append(
                  $('<div/>', {class: 'media-content'}).append(
                      $('<div/>', {class: 'content'}).append(
                          $('<p/>').append(
                              $('<strong/>', {class: 'name', text: display.name + " - "})
                          ).append(
                              $('<small/>', {class: 'username', text: display.email})
                          ).append(
                              $('<br>')
                          )
                      ).append(
                          $('<p/>', {id: 'bio', text: display.bio})
                      ).append(
                          $('<p/>')
                      )
                  )
              )
          )
      );

    };      

//===============================================================
//      populate markers on map
//===============================================================
    function placeMarker (lat, long) {
        console.log('placeMarker')
        console.log('latlong = '+ lat +" , "+long)
        console.log('--------------------------------------------')
        var markerOptions = {
            center: new google.maps.LatLng(33.4457848, -117.6280111),
            position: { 
                        lat: lat, 
                        lng: long
                      },
            label: labels[labelIndex++ % labels.length],
        };
        marker = new google.maps.Marker(markerOptions);
        marker.setMap(map);
        return markerOptions.label;
    };   

//===============================================================
//      populate markers' info windows on map
//===============================================================
// var latLngA = {33.4457848, -117.6280111}
// var latLngB = {33.4557848, -117.6280111}
// var dist = google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);
// console.log('distance = ', dist);

    // var infoWindowOptions = {
    //     content: 'Moscone Is Here!'
    // };

    // infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    // google.maps.event.addListener(marker,'click',function(e){
  
    //     infoWindow.open(map, marker);
  
    // });    
  });

  function fillStylistMiniProfile(stylist){
      function boolToYes(bool) {
          return bool ? "Yes!" : "No."
      }

      $('#profile-name-' + stylist.id).text(stylist.first_name +" "+ stylist.last_name);
      $('#profile-email-' + stylist.id).text(stylist.email)
      $('#profile-bio-' + stylist.id).text(stylist.bio)
      $('#profile-phone-' + stylist.id).text(stylist.phone_number)
      $('#profile-travel-' + stylist.id).text(stylist.travel_range)
      $('#profile-city-' + stylist.id).text(stylist.city)
      $('#profile-state-' + stylist.id).text(stylist.state)
      $('#profile-cut-' + stylist.id).text(boolToYes(stylist.cut))
      $('#profile-blowdry-' + stylist.id).text(boolToYes(stylist.blowdry))
      $('#profile-color-' + stylist.id).text(boolToYes(stylist.color))
      $('#profile-highlights-' + stylist.id).text(boolToYes(stylist.highlights))
      $('#profile-lowlights-' + stylist.id).text(boolToYes(stylist.lowlights))
      $('#profile-ombre-' + stylist.id).text(boolToYes(stylist.ombre))
      $('#profile-balayage-' + stylist.id).text(boolToYes(stylist.balayage))
      $('#profile-hairdo-' + stylist.id).text(boolToYes(stylist.hairdo))
  }

  function makeStylistMiniProfile(stylist){
      var profileList = ["Name", "Email", "Bio", "Phone", "Travel", "City", "State", "Cut",
       "Blowdry", "Color", "Highlights", "Lowlights", "Ombre", "Balayage", "Hairdo"];

      $("body").append(
          $("<div/>", {id: "stylistProfile-" + stylist.id, class: "modal"}).append(
              $("<div/>", {class: "modal-background"})
          ).append(
              $("<div/>", {class: "modal-card", id: "stylistCard-"+stylist.id}).append(
                  $("<header/>",  {class: "modal-card-head"}).append(
                      $("<p/>", {class: "modal-card-title", text: "Stylist"})
                  )
              )
          )
      )

      var list = $("<ul/>")

      profileList.forEach(function(elem) {
          list.append(
              $("<li/>", {text: elem+ ": "}).append(
                  $("<span/>", {id: "profile-"+elem.toLowerCase()+"-"+stylist.id})
              )
          )
      })

      $("#stylistCard-"+stylist.id).append(
          $("<section/>", {class: "modal-card-body"}).append(
              $("<div/>", {class: "field is-grouped"}).append(
                  $("<div/>", {class: "control"}).append(
                      $("<figure/>", {class: "image is-84x84"}).append(
                          $("<img>", {
                              src: '.'+stylist.picture,
                              alt: "Image"
                              }
                          )
                      )
                  ).append(
                      list
                  ).append(
                      $("<div/>", {class: "control"}).append(
                          $("<a/>", {href: "mailto:"+stylist.email, target: "_top", text: "Email"})
                      )
                  ).append(
                      $("<a/>", {class: "exit-profile", text: "Exit"})
                  )
              )
          )
      )
  }


})(window, google);

