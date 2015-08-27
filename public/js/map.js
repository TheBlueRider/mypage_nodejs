function initMap() {
  "use strict"
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 2,
    mapTypeControlOptions: {
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.SATELLITE
      ],
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });

  var places = new Array();
  var markerlist = new Array();
  var infowindowlist = new Array();

  var shanghaiinfo = {name: 'Shanghai', lat: 31.232327, lng: 121.469095, describe: '家', placeId: "ChIJMzz1sUBwsjURoWTDI5QSlQI"};
  var qingtaoinfo = {name: 'Qingtao', lat: 36.0882, lng: 120.3577, describe: '2011年|戎佳通, 霏霏, 鲍鲍', placeId: "ChIJa_D4gtUPljUR8_JMYfqCTWE"};
  var beijinginfo = {name: 'Beijing', lat: 39.903546, lng: 116.387578, describe: '2011年|戎佳通, 霏霏, 鲍鲍', placeId: "ChIJuSwU55ZS8DURiqkPryBWYrk"};
  var xiameninfo = {name: 'Xiamen', lat: 24.446111, lng: 118.067778, describe: '', placeId: "ChIJJ-u_5XmDFDQRVtBolgpnoCg"};

  var draguignaninfo = {name: 'Draguignan', lat: 43.540278, lng: 6.466667, describe: '2013-2016|Travaille au muy', placeId: "ChIJl94Jc4mrzhIRoM2P_aUZCAQ"};
  var parisinfo = {name: 'Paris', lat: 48.8567, lng: 2.3508, describe: '2014|Zhengye, baobao', placeId: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ"};
  var arlesinfo = {name: 'Arles', lat: 43.67665, lng: 4.627803, describe: '2014|huihui, enshuo', placeId: "ChIJzRRIXQdythIRUAWX_aUZCAQ"};

  var florenceinfo = {name: 'Florence', lat: 43.771667, lng: 11.253611, describe: '2014|huihui', placeId: "ChIJrdbSgKZWKhMRAyrH7xd51ZM"};
  var piseinfo = {name: 'Pise', lat: 43.716667, lng: 10.4, describe: '2014|huihui', placeId: "ChIJj1n28JqR1RIRyHiEp7UPuKo"};
  var romeinfo = {name: 'Rome', lat: 41.888732, lng: 12.48657, describe: '2014|huihui', placeId: "ChIJu46S-ZZhLxMROG5lkwZ3D7k"};
  var cinqueterreinfo = {name: 'CinqueTerre', lat: 44.10694, lng: 9.72917, describe: '2014|huihui', placeId: "ChIJs1eAAupN1RIRTF-_kHQh_8M"};

  var athenesinfo = {name: 'Athenes', lat: 37.966667, lng: 23.716667, describe: '2012|baobao', placeId: "ChIJ8UNwBh-9oRQR3Y1mdkU1Nic"};
  var santorininfo = {name: 'Santorini', lat: 36.387986, lng: 25.459785, describe: '2012|baobao', placeId: "ChIJNd2MuUg0mBQRC7NKapFD2HA"};

  var schwangauinfo = {name: 'Schwangau', lat: 47.583, lng: 10.733, describe: '2012|tuntun, paopao, hanxiao', placeId: "ChIJe87H33BYnEcR4AGM161IHgQ"};
  var cologneinfo = {name: 'Cologne', lat: 50.94257, lng: 6.958976, describe: '2012|tuntun, paopao, hanxiao', placeId: "ChIJ5S-raZElv0cR8HcqSvxgJwQ"};
  var berchtesgadeninfo = {name: 'Berchtesgaden', lat: 47.633, lng: 13, describe: '2012|tuntun, paopao, hanxiao', placeId: "ChIJ053XqF3rdkcRcLc3CaQlHQQ"};

  var barceloneinfo = {name: 'Barcelone', lat: 41.383333, lng: 2.166667, describe: '2014|huihui, enshuo', placeId: "ChIJ5TCOcRaYpBIRCmZHTz37sEQ"};

  places.push(shanghaiinfo);
  places.push(qingtaoinfo);
  places.push(beijinginfo);
  places.push(xiameninfo);
  places.push(draguignaninfo);
  places.push(parisinfo);
  places.push(arlesinfo);
  places.push(florenceinfo);
  places.push(piseinfo);
  places.push(romeinfo);
  places.push(cinqueterreinfo);
  places.push(athenesinfo);
  places.push(santorininfo);
  places.push(schwangauinfo);
  places.push(cologneinfo);
  places.push(berchtesgadeninfo);
  places.push(barceloneinfo);

  var i;
  for (i in places) {
    var marker = new google.maps.Marker({
      map: map,
      // Define the place with a location, and a query string.
      place: {
        location: {lat: places[i]["lat"], lng: places[i]["lng"]},
        placeId: places[i]["placeId"]
      },
      // Attributions help users find your site again.
      attribution: {
        source: 'Google Maps JavaScript API',
        webUrl: 'https://developers.google.com/maps/'
      }
    });

    markerlist.push(marker);
    // Construct a new InfoWindow.
    var infowindow = new google.maps.InfoWindow({
      content: places[i]["describe"]
    });

    infowindowlist.push(infowindow);
    // Opens the InfoWindow when marker is clicked.
  }

  for (i in markerlist) {
    markerlist[i].addListener('click', function() {
      var j;
      for (j in markerlist) {
        infowindowlist[j].close();
      }
      for (j in markerlist) {
        if (this == markerlist[j])
        {
          infowindowlist[j].open(map, this);
        }
      }
    });
  }
}
