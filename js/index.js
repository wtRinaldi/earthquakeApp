let app = angular.module('MyApp', []);

app.service('date', function() {

  const date = new Date(); 
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  let dateObject = {
    day: day,
    month: month,
    year: year
  }

  return dateObject

})

app.service('earthquakeData',['date', '$http', function(dateObject, $http) {
  const today = dateObject.year + "-" + dateObject.month + "-" + dateObject.day;
  return $http.get('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=' + today + '&minmagnitude=1&orderby=magnitude')
}])

app.controller('MainCtrl', ['$scope', 'date', 'earthquakeData', function($scope, dateObject, report) {

  $scope.displayToday = dateObject.month + "-" + dateObject.day + "-" + dateObject.year;
  $scope.earthquakes = [];
  $scope.earthquake = {
    magnitude: 0,
    location: "",
    time: "",
    lat: 0,
    lng: 0
  };

  report.then(
    function(response) {
      let earthquakeReport = response.data.features.splice(0, 11);
          for (let item of earthquakeReport) {
      let quake = { "magnitude": item.properties.mag, 
                    "location": item.properties.place, 
                    "time": item.properties.time,
                    "lng": item.geometry.coordinates[0],
                    "lat": item.geometry.coordinates[1]}
        $scope.earthquakes.push(quake);     
    };

    setEarthQuake($scope.earthquakes[0]);
    setMap();

    }).catch(function() {
      $window.alert("broken");
    });

  
  $scope.displayQuake = function(selected) {
    setEarthQuake(selected);
    setMap();
  }

  setEarthQuake = function(quake) {
    $scope.earthquake.magnitude = quake.magnitude;
    $scope.earthquake.location = quake.location;
    $scope.earthquake.time = quake.time;
    $scope.earthquake.lat = quake.lat;
    $scope.earthquake.lng = quake.lng;
  }


  setMap = function() {
    let myLatLng = {lat: $scope.earthquake.lat, lng: $scope.earthquake.lng};

    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.HYBRID 
    });
    
    let marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: $scope.earthquake.magnitude.toString()
    })
  }




  
}]);
 

/*    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
    }  
    
    for (i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }*/
