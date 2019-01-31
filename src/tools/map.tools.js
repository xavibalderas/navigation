var Mapwize = require('mapwize');
import store from '../store'
import {
  getBoundingBox, insideBoundingBox
} from 'geolocation-utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const placeTypesDepartments = [
   '57ff3c976e2cc00b00566a0d',
   '57285b8a7f0f7a0b0092cf5e'
 ]

const MapTools = {

  _highLightStyle: {
      fillColor: '#000000',
      fillOpacity: 0.2
  },

  _selectedPlace: undefined,

  _changeMapStyle : function(map){


    //Hide all the layers that are not needed
    var _layers = map.getStyle().layers;

    _layers.forEach((_l)=>{
      if (!_l.id.includes('mapwize') && _l.id!=='background' && _l.id!=='position'){
        map.setLayoutProperty(_l.id, 'visibility', 'none');
      }
    })

    //map.setLayoutProperty('mapwize_places_symbol','icon-size',0.4);
    //map.setLayoutProperty('mapwize_places_symbol','text-offset',[0,0.4]);
    //map.setLayoutProperty('mapwize_places_symbol','text-anchor','center');
    //map.setLayoutProperty('mapwize_places_symbol','text-anchor','top');
    //map.setLayoutProperty('mapwize_places_symbol', 'visibility', 'none');
    //map.setPaintProperty("mapwize_places_fill", 'fill-color', '#FFFFFF');
    //map.setPaintProperty("mapwize_places_fill", 'fill-opacity', 0);

    map.setLayoutProperty('position','icon-size',2);

    map.setLayoutProperty('mapwize_places_symbol','text-size',40);
    map.setLayoutProperty('mapwize_places_symbol','text-optional',false);
    map.setLayoutProperty('mapwize_places_symbol','icon-size',1.5);
    map.setPaintProperty('mapwize_places_symbol','text-color','#FFFFFF');
    map.setPaintProperty('mapwize_places_symbol','text-halo-color','#555555');
    //map.setPaintProperty('mapwize_places_symbol','text-halo-width',0);

    map.setLayoutProperty('mapwize_directions_dash', 'line-cap', 'square');
    map.setPaintProperty("mapwize_directions_dash", 'line-color', '#FAD23C');
    map.setPaintProperty("mapwize_directions_dash", 'line-width', 20);
    map.setPaintProperty("mapwize_directions_dash", 'line-dasharray',[1,1]);
    map.setPaintProperty("mapwize_directions_dash", 'line-gap-width',0);

    map.setPaintProperty("mapwize_directions", 'line-width', 0);

    map.setPaintProperty("background", 'background-color','#ABABAB');

    map.setMinZoom(20);

  },

  init: function(mapwizeMap, poiPosition){
    this.map = mapwizeMap; //save the map in the object, for later use.
    console.log(poiPosition);
    this._poi = poiPosition;
    this.marker = {};

    mapwizeMap.setPreferredLanguage('de');

    //Initital setup of the map
    mapwizeMap.setFloor(this._poi.floor);
    mapwizeMap.setUserPosition({
      latitude:   poiPosition.latitude,
      longitude:  poiPosition.longitude,
      floor:      poiPosition.floor,
      accuracy:   8
    });
    mapwizeMap.setBearing(this._poi.bearing);
    mapwizeMap.setFloor(this._poi.floor);
    //mapwizeMap.refresh();
    //Change the style of the layers
    this._changeMapStyle(mapwizeMap);

    //subscribe for changes in the store to react in the map.
    store.subscribe((mutation, state) => {
      if (mutation.type === "changePlace"){
        //this.showMarker();
        this._highlightPlace();
        this._loadIncludedPlaces();
      //  this.showDirections();
      }
    });
    //Once the places are loaded into the store, we can load the lists
    store.subscribe((mutation, state) => {
      if (mutation.type === "assignPlaces"){
        this._loadPlaceLists();
      }
    });

    this._addMapEvents(mapwizeMap);
  },

   _addMapEvents: function(map) {

     map.on('mapwize:markerclick', e => {
              this._showDirections();
            });

     map.on('mapwize:click', e => {
          if (e.place !== null){
            store.commit({
              type: 'changePlace',
              place: e.place
            });
          }
      });

      map.on('click', function(e) {
        console.log(e);
      });

      map.on('dragend', function(event){
        console.log(map.getBounds());
      });

   },

  _highlightPlace: function (){
    const selectedPlace = store.state.selectedPlace;
    const previousPlace = store.state.previousPlace;
    const floor = this.map.getFloor();
    const placeFloor = selectedPlace.floor;
    if (previousPlace === selectedPlace) return;
    const marker = this.marker; //store.state.marker;
    const _removeMarker = marker.floor !== undefined;
    const _removePrevious = previousPlace._id !== undefined;
    _removePrevious ? this._removeSelectedPlace(previousPlace) : null;
    _removeMarker ? this.map.removeMarker(this.marker) : null;
    if (placeFloor!==floor) this.map.setFloor(placeFloor);
    this.map.setPlaceStyle(selectedPlace, this._highLightStyle);
    //this._showDirections();
    this._displayMarker();
    this._fitBounds();
  },

  _fitBounds: function() {

    var _visibleBounds = this.map.getBounds();
    const userPosition = {
      latitude : this._poi.latitude,
      longitude: this._poi.longitude,
      bearing: this._poi.bearing
    }
    const selectedPlace = Object.assign({} ,store.state.selectedPlace);
    var _geometry = [];
    if (Array.isArray(selectedPlace.geometry.coordinates[0])){
      _geometry = selectedPlace.geometry.coordinates[0].slice();
    }else {
      _geometry.push(selectedPlace.geometry.coordinates.slice());
    }
    _geometry.push([userPosition.longitude, userPosition.latitude]);
    const margin = 10 // meters
    const box = getBoundingBox(_geometry, margin);

    // change from lat/lon to lon/lat;
    var bbox = [[ box.topLeft[0],box.bottomRight[1]],[box.bottomRight[0], box.topLeft[1]]];//box.bottomRight[0], box.topLeft];
    if (this._checkIfBoundingBoxIncluded(_visibleBounds, bbox)) return;
    var cameraTransform = this.map.cameraForBounds(bbox, {
      padding: {top: 10, bottom:25, left: 15, right: 5}
    });
    cameraTransform.bearing = userPosition.bearing;
    this.map.easeTo(cameraTransform);

  },

  _checkIfBoundingBoxIncluded: function (bounding, polygon){
    //polygon is an array in the form:
    //  [lon, lat]
    //bounding is in the format sw/ne : lng/lat we need it in nw/se : lat/ln. Bounding is and LngLatBounds object from Mapbox
      //bounding
      const nw = bounding.getNorthWest();
      const se = bounding.getSouthEast();

      const box = {
        topLeft:     {lat: nw.lat, lon: nw.lng},
        bottomRight: {lat: se.lat, lon: se.lng}
      }
      const _r = polygon.reduce((accumulator, currentValue) => {
        //we reduce the array, if just one is false, the end result is false.
        //const _in = insideBoundingBox({lat:currentValue[1], lon:currentValue[0]}, box);
        return insideBoundingBox({lat:currentValue[1], lon:currentValue[0]}, box) && accumulator;
        //return true;
      }, true);
      return _r;

  },

  _displayMarker: function(){
    const selectedPlace = store.state.selectedPlace;
    this.map.addMarkerOnPlace(selectedPlace).then(marker => {
        //store marker reference
        this.marker = marker;
      }).catch(err => {
          console.log(err);
      });
  },

  _removeSelectedPlace: function(place){
    const directionsVisible = store.state.directionsVisible;
    this.map.setPlaceStyle(place._id, {fillOpacity:0});
    directionsVisible ? this._removeDirections() : null;

  },

  _removeDirections: function(){
   this.map.removeDirection();
   store.commit({
     type: 'toggleDirections',
     visible: false
   });
  },

  _showDirections: function(){
    const selectedPlace = store.state.selectedPlace;
    const directionsVisible = store.state.directionsVisible;

    if (directionsVisible) return;

    Mapwize.Api.getDirection({
        from: {
          latitude: 47.42209953906886,
          longitude: 8.375177110719962,
          floor: 1
        },
        to: {
          placeId: selectedPlace._id
        },
        waypoints: [],
        options: {}
        }).then(direction => {
          this.map.setDirection(direction);
          //this.map.getSource("mapwize_directions").setData(direction.route[0].path);
          this.map.setBearing(this._poi.bearing);
          store.commit({
            type: 'toggleDirections',
            visible: true
          });
        });
  },

  initConfig: {
    container: 'mapContainer',
    zoom: 20.338757675284295,
    venueId: '5b8ffe23051cd90021bd526f',
    floor: 1,
    color: '#fad23c',
    center:[8.375177110719962, 47.42209953906886], //longLat
    dragRotate: false,
    touchZoomRotate: false,
    doubleClickZoom: false,
    maxBounds: [[8.374323,47.420685],[8.377237, 47.422580]] //[[sw_long, sw_lat],[ne_long, ne_lat]] with bearing = 0

  },

  mapConfig: {
    attributionControl: false,
    navigationControl: false,
    floorControl: true,
    userPosition: true,
    color: '#fad23c',

  },

  test: function(){
    console.log(this.map);
  },

  addControls: function (){

    class SearchControl {
      onAdd(map){
        this.map = map;
        this.container = document.getElementById('search-control');
        return this.container;
      }
      onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
      }
    }

    class ZoomInControl {
      onAdd(map){
        this.map = map;
        this.container = document.getElementById('zoomin-control');
        return this.container;
      }
      onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
      }
    }
    class ZoomOutControl {
      onAdd(map){
        this.map = map;
        this.container = document.getElementById('zoomout-control');
        return this.container;
      }
      onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
      }
    }


    const searchControl = new SearchControl();
    const zoomInControl = new ZoomInControl();
    const zoomOutControl = new ZoomOutControl();
    this.map.addControl(searchControl,'top-right');
    this.map.addControl(zoomInControl,'top-left');
    this.map.addControl(zoomOutControl,'top-left');

  },

  zoomIn: function(){
    this.map.zoomIn();
  },
  zoomOut: function() {
    this.map.zoomOut();
  },
  getVenue: function(map){
    Mapwize.Api.getVenue('5b8ffe23051cd90021bd526f').then(venue => {console.log(venue); console.log(map.getFloorsForVenue(venue))});
  },
  getFloors: function(map){
    return map.getFloors();
  },

  _loadIncludedPlaces: function(){
    const selectedPlace = store.state.selectedPlace;
    const previousPlace = store.state.previousPlace;
    if (previousPlace === selectedPlace) return;

    Mapwize.Api.getPlaces({
        latitudeMin:  selectedPlace.latitudeMin,
        latitudeMax:  selectedPlace.latitudeMax,
        longitudeMin:  selectedPlace.longitudeMin,
        longitudeMax:  selectedPlace.longitudeMax,
        floor:  selectedPlace.floor
    }).then((places) => {
        store.commit({
          type: 'assignContainedPlaces',
          placeLists: places,
        });
    });

  },

  _loadPlaceLists: function(){

    Mapwize.Api.search({
        query: 'departments',
        venueId:  '5b8ffe23051cd90021bd526f',
        objectClass: ['placeList']
    }).then((results) => {
      store.commit({
        type: 'assignPlaceLists',
        placeLists: results.hits,
      });
    });

    Mapwize.Api.search({
        query: 'facilities',
        venueId:  '5b8ffe23051cd90021bd526f',
        objectClass: ['placeList']
    }).then((results) => {
      store.commit({
        type: 'assignFacilities',
        facilities: results.hits,
      });
    });

  },

  initInfo: function(map){

    Mapwize.Api.getPlaces({
          venueId: '5b8ffe23051cd90021bd526f'
        }).then(places => {
            var floors = store.state.floors;
            const _language = store.state.language;
            var products = [];
            var letters = [];
            places.forEach((element)=>{
                this.map.setPlaceStyle(element._id,{fillOpacity:0});
                if (element.data !== undefined && element.data[_language]!== undefined) {
                  element.data[_language].forEach((article)=> {
                    products.push({name: article, placeId: element._id, letter: article.toUpperCase().charAt(0)});
                    letters.push(article.toUpperCase().charAt(0));
                  });
                }
            })

            products.sort(function(a, b) {
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                // names must be equal
                return 0;
              });
            letters = [...new Set(letters)];
            letters.sort();
            store.commit({
              type: 'assignPlaces',
              places: places, //allPlaces,
              products: products,
              letters: letters,
            });

        });
  }



}

export default MapTools;
