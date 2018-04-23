import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import GoogleMapReact from 'google-map-react';
    
var outputObject = {};
const MARKER_SIZE = 40;
var infowindow = {};
class MapContainer extends React.Component {

	constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.onMapLoaded = this.onMapLoaded.bind(this);
    this.mouseEvents = this.mouseEvents.bind(this);
    this.state = {
        activeMarker: {},
        selectedPlace: {},
        defaultProps : {
            center: {lat: 37.0902, lng: -95.7129},
            zoom: 4
          },
        markers : {
            "FACT01":["Factory One","37.338208","-121.886329","critical","93.23",500, 363, 60,28],//[Factory Name, Lat, Long, Status, OEE, Weekly Total, Weekly Order, Daily Total, Daily Order] 
            "FACT02":["Factory Two","40.712775","-74.005973","normal","23.23",100, 123, 20,18],
            "FACT03":["Factory Three","38.496503","-81.058925","warning","43.23",200, 163, 90,58],
            "FACT04":["Factory Four","38.618014","-90.159700","warning","73.23",300, 263, 70,38],
            "FACT05":["Factory Five","34.759459","-103.409212","critical","93.23",500, 363, 60,28],
            "FACT06":["Factory Six","30.011812","-100.508821","normal","93.23",600, 463, 100,40]
        }
      }
      // binding this to event-handler functions
      this.onMarkerClick = this.onMarkerClick.bind(this);
      this.onMapClicked = this.onMapClicked.bind(this);
    }

    handleLoad(){
        
    }

    componentDidMount(){
        this.handleLoad();
    }

    onMarkerClick(props, marker, e) {
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
    }
  
    onMapClicked(props) {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        })
      }
    }
    onMapLoaded(mapObject){
        var maps = mapObject.maps,
            map = mapObject.map,
            markers = this.state.markers,
            mapMarkers = [];
        var _markerCount = 0;
        this.infoWindowCreate(maps);
        var currMarkerCount = 0;
        for(var i in markers){
            var icon = {
                url: "images/markers/"+markers[i][3]+".png", // url
                scaledSize: new maps.Size(33, 40), // scaled size
                origin: new maps.Point(0, 0), // origin
                anchor: new maps.Point(0, 30) // anchor
            };
            var latlng = new maps.LatLng(markers[i][1], markers[i][2]);
            var marker = new maps.Marker({
                    position: latlng,
                    title: markers[i][0],
                    draggable: false,
                    icon: icon,
                    map: map
                });
            if(markers[i][3] == "critical"){
                marker.setAnimation(maps.Animation.BOUNCE);
            }
            currMarkerCount++;
            this.mouseEvents(marker, currMarkerCount, i, maps, markers, map);
        }
    }

    infoWindowCreate(maps){
        infowindow = new maps.InfoWindow({
            content: '<div class="infoCard">'+
                        '<h2></h2>'+
                        '<h3>OEE</h3>'+
                        '<h4>%</h4>'+
                        '<div class="percArea">'+
                            '<div class="percBar"><div class="perc" style="width: 20%"></div></div>'+
                        '</div>'+
                        '<div class="orders"><div class="title">Weekly Orders</div><div class="value"></div></div>'+
                        '<div class="orders"><div class="title">Monthly Orders</div><div class="value"></div></div>'+
                    '</div>'
        });
    }
    
    infoWindowChangeContent(marker){
        infowindow.setContent('<div class="infoCard">'+
            '<h2>'+marker[0]+'</h2>'+
            '<h3>OEE</h3>'+
            '<h4>'+marker[4]+'%</h4>'+
            '<div class="percArea">'+
                '<div class="percBar '+marker[3]+'"><div class="perc" style="width:'+marker[4]+'%"></div></div>'+
            '</div>'+
            '<div class="orders"><div class="title">Weekly Orders</div><div class="value">'+marker[6]+'/'+marker[5]+'</div></div>'+
            '<div class="orders"><div class="title">Monthly Orders</div><div class="value">'+marker[8]+'/'+marker[7]+'</div></div>'+
        '</div>');
    }

    mouseEvents(currentMarker, currMarkerCount, name, maps, markers, map){
        var that = this;
        maps.event.addListener(currentMarker, 'mouseover', (function(currentMarker, currMarkerCount, maps) {
            return function() {
                that.infoWindowChangeContent(markers[name]);
                infowindow.open(map, currentMarker);
                that.infoWindowLoad(infowindow, maps);
            }
        })(currentMarker, currMarkerCount, maps));
        maps.event.addListener(currentMarker, 'mouseout', (function(currentMarker, currMarkerCount, maps) {
            return function() {
                infowindow.close();
            }
        })(currentMarker, currMarkerCount, maps));
        maps.event.addListener(currentMarker, 'click', (function(currentMarker, currMarkerCount, maps) {
            return function(){
                window.location = '/factoryFloor/'+name;
            }
        })(currentMarker, currMarkerCount, maps));
    }
    
    infoWindowLoad(infowindow, maps){
        maps.event.addListener(infowindow, 'domready', function() {

            // Reference to the DIV that wraps the bottom of infowindow
            var iwOuter = $('.gm-style-iw');
        
            /* Since this div is in a position prior to .gm-div style-iw.
            * We use jQuery and create a iwBackground variable,
            * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
            */
            var iwBackground = iwOuter.prev();
        
            // Removes background shadow DIV
            iwBackground.children(':nth-child(2)').css({'display' : 'none'});
        
            // Removes white background DIV
            iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        
            // Moves the infowindow 115px to the right.
            //iwOuter.parent().parent().css({left: '115px'});
            iwOuter.parent().parent().css({top: '20px'});
        
            // Moves the shadow of the arrow 76px to the left margin.
            iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'}).hide();
        
            // Moves the arrow 76px to the left margin.
            iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important; top: 0px !important;'}).hide();
        
            // Changes the desired tail shadow color.
            iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 0, 0, 0.6) 0px 1px 6px', 'z-index' : '1'});
        
            // Reference to the div that groups the close button elements.
            var iwCloseBtn = iwOuter.next();
        
            // Apply the desired effect to the close button
            iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', padding: "10px",display: "none", borderRadius: "5px", backgroundColor: "#FFF", backgroundPosition:"center center"});
            iwCloseBtn.find("img").css({left: "1px", top: "-334px"});
        
            // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
            if($('.iw-content').height() < 140){
            $('.iw-bottom-gradient').css({display: 'none'});
            }
        
            // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
            iwCloseBtn.mouseout(function(){
            $(this).css({opacity: '1'});
            });
        })
    }

    attachInfoWindow(marker, index, maps) {
        if (typeof infowindow === 'undefined') {
            infowindow = new maps.InfoWindow({});
        }
        var data = infoCentros[index]//helpful data
        //create content with dynamic data
        infowindow.setContent('<div id="infoWindowdiv" style="width: 300px">'+markers[i][0]+'</div>');
        infowindow.open(marker.getMap(), marker);//modify as per your requirement
    }
    createMapOptions(maps) {
        // next props are exposed at maps
        // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
        // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
        // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
        // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
        // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
        return {
          styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }],
          zoomControlOptions: {
            position: maps.ControlPosition.RIGHT_CENTER,
            style: maps.ZoomControlStyle.SMALL
          },
          mapTypeControlOptions: {
            position: maps.ControlPosition.TOP_RIGHT
          },
          mapTypeControl: true
        };
      }
  
    render() {
        return (
            <div id="MapContainer" ref="MapContainer">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: ["AIzaSyCJ5ZbJ-Z9tS0rDIZsXPqAWcAbUdjTkcME"] }}
                    options={this.createMapOptions}
                    center={this.state.defaultProps.center}
                    zoom={this.state.defaultProps.zoom}
                    onGoogleApiLoaded={this.onMapLoaded}
                >
                </GoogleMapReact>
            </div>
          );
    }
}
module.exports = MapContainer;