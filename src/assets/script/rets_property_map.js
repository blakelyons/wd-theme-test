var map, infoWindow, markerIcon, markerIconCurrent,
  markers = [],
  enableRefreshButton = true; // this is necessary since we can't distinguish between map events caused by the user and those caused by code


function initMap() {
  map = new google.maps.Map(document.getElementById('propertyMap'), {
    center: {
      lat: 38.6530169,
      lng: -90.3835463
    },
    zoom: 7,
    maxZoom: 18
  });

  infoWindow = new google.maps.InfoWindow({
    maxWidth: 300
  });
  markerIcon = new google.maps.MarkerImage('graphics/design/marker_icon.svg', new google.maps.Size(16, 16));
  markerIconCurrent = new google.maps.MarkerImage('graphics/design/marker_icon_current.svg', new google.maps.Size(16, 16));

  $('<button class="refresh">Show Properties in View</button>').appendTo('#propertyMap').on('click', getPropertiesInView);

  map.addListener('dragend', showRefreshButton);
  map.addListener('zoom_changed', showRefreshButton);
}

function showRefreshButton() {
  if(enableRefreshButton) $('#propertyMap .refresh').show();
  else enableRefreshButton = true;
}
function hideRefreshButton() {
  $('#propertyMap .refresh').hide();
  enableRefreshButton = true;
}

function getPropertiesInView() {

//google.maps.event.addListener(map, 'idle', function(event) {

  // Retrieve the properties within the bounds.
  var bounds = map.getBounds();
  var north = bounds.getNorthEast().lng(),
    east = bounds.getNorthEast().lat(),
    south = bounds.getSouthWest().lng(),
    west = bounds.getSouthWest().lat();

  var mapBoundsQueryString = 'Latitude.ge.'+west+'.and.Latitude.le.'+east+'.and.Longitude.ge.'+south+'.and.Longitude.le.'+north;

  console.log('mapBoundsQueryString');
  console.log(mapBoundsQueryString);

  console.log('north');
  console.log(north);
  console.log('east');
  console.log(east);
  console.log('south');
  console.log(south);
  console.log('west');
  console.log(west);

  var newUrl = location.protocol+'//'+location.host+location.pathname+'?';
  delete urlParameters.pos;

  if(urlParameters.query) {
    var queryParameterParts = urlParameters.query.split('.and.');
    queryParameterParts = queryParameterParts.filter(function(element, index, array){
      return (element.indexOf('Latitude') !== 0 && element.indexOf('Longitude') !== 0); // remove any cells pertaining to latitude and longitude
    });
    if(queryParameterParts.length) urlParameters.query = queryParameterParts.join('.and.')+'.and.'+mapBoundsQueryString;
    else urlParameters.query = mapBoundsQueryString;
  } else {
    urlParameters.query = mapBoundsQueryString;
  }

  newUrl += serializeObject(urlParameters);
  updateUrlAndGo(newUrl);
  hideRefreshButton();
//});
}

function updatePropertyMap() {
  console.log("Update Property Map Function Fired");
  var bounds = new google.maps.LatLngBounds();
  for(var i=0; i < markers.length; i++) markers[i].setMap(null);
  markers.length = 0;   // reset markers array

  // Create a marker for each property in the list.
  $('#propertyList .property').each(function(i) {
    var $this = $(this);

    if($this.data('lat') && $this.data('lng')) {
      // The marker's infoWindow should display the property's picture, price, and address.
      var imageHtml = '';
      if($this.find('.image').css('background-image')) imageHtml = '<div class="image"><img src="' + $this.find('.image').css('background-image').slice(4, -1).replace(/['"]/g, '') + '" /></div>';
      var content = '<div class="infoWindowContent">' + imageHtml + '<div class="info"><div>' + $this.find('.address').html() + '</div><div>' + $this.find('.price').html() + '</div></div>';
      var marker;
      var markerLatLng = new google.maps.LatLng($this.data('lat'), $this.data('lng'));
      bounds.extend(markerLatLng);

      marker = (new google.maps.Marker({
        position: markerLatLng,
        map: map,
        icon: markerIcon,
        infoContent: content,
        title: $this.find('.address').text()
      }));

      marker.addListener('mouseover', function(){
        marker.setIcon(markerIconCurrent);
        marker.setZIndex(10);
      });
      marker.addListener('mouseout', function(){
        marker.setIcon(markerIcon);
        marker.setZIndex(0);
      });

      // Attach click event listener to show the infoWindow with content specific to the marker clicked.
      marker.addListener('click', function() {
        if(infoWindow) infoWindow.close();
        infoWindow.setOptions({
          content: this.infoContent
        });
        infoWindow.open(map, this);
      });

      markers.push(marker);
    }
  });

  enableRefreshButton = false;
  map.fitBounds(bounds);
}

$(document).ready(function(){
  //initializePropertyListerPage('map');
});