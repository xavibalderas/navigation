var Mapwize = require('mapwize');
import store from '../store'

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
    const _layers = map.getStyle().layers;
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


    map.setLayoutProperty('mapwize_places_symbol','text-size',33);
    map.setLayoutProperty('mapwize_places_symbol','text-optional',false);
    map.setLayoutProperty('mapwize_places_symbol','icon-size',1.5);
    map.setPaintProperty('mapwize_places_symbol','text-color','#FFFFFF');
    map.setPaintProperty('mapwize_places_symbol','text-halo-width',0);

    map.setLayoutProperty('mapwize_directions_dash', 'line-cap', 'square');
    map.setPaintProperty("mapwize_directions_dash", 'line-color', '#FAD23C');
    map.setPaintProperty("mapwize_directions_dash", 'line-width', 20);
    map.setPaintProperty("mapwize_directions_dash", 'line-dasharray',[1,0]);

    map.setPaintProperty("mapwize_directions", 'line-width', 0);

    map.setPaintProperty("background", 'background-color','#ABABAB');

    map.setMinZoom(20);

  },

  init: function(mapwizeMap, poiPosition){
    this.map = mapwizeMap; //save the map in the object, for later use.
    this._poi = poiPosition;

    //Initital setup of the map
    mapwizeMap.setFloor(1);
    mapwizeMap.setUserPosition({
      latitude:   poiPosition.latitude,
      longitude:  poiPosition.longitude,
      floor:      poiPosition.floor,
      accuracy:   8
    });

    //Change the style of the layers
    this._changeMapStyle(mapwizeMap);

    //subscribe for changes in the store to react in the map.
    store.subscribe((mutation, state) => {
      if (mutation.type === "changePlace"){
        //this.showMarker();
        this._highlightPlace();
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
    })
 },

  _highlightPlace: function (){
    const selectedPlace = store.state.selectedPlace;
    const previousPlace = store.state.previousPlace;
    if (previousPlace === selectedPlace) return;
    const marker = store.state.marker;
    const _removeMarker = marker.floor !== undefined;
    const _removePrevious = previousPlace._id !== undefined;

    _removePrevious ? this._removeSelectedPlace(previousPlace) : null;
    _removeMarker ? this.map.removeMarker(store.state.marker) : null;

    this.map.setPlaceStyle(selectedPlace, this._highLightStyle);
    this._displayMarker();
    this._fitBounds();
  },

  _fitBounds: function() {
    const userPosition = {
      latitude : this._poi.latitude,
      longitude: this._poi.longitude,
      bearing: this._poi.bearing
    }
    const selectedPlace = store.state.selectedPlace;
    var bounds = new this.map.LngLatBounds();
    console.log(selectedPlace);
//     var bbox = [[-79, 43], [-73, 45]];
// map.fitBounds(bbox, {
//   padding: {top: 10, bottom:25, left: 15, right: 5}
// });

  },

  _displayMarker: function(){
    const selectedPlace = store.state.selectedPlace;
    this.map.addMarkerOnPlace(selectedPlace).then(marker => {
        //store marker reference
        store.commit({
          type: 'addMarker',
          marker: marker
        });
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
        this.container = document.createElement('div');
        this.container.className = 'search-control';
        this.button = document.createElement('button');
        this.icon = document.createElement('i');
        this.icon.className = 'fas fa-search';
        this.button.appendChild(this.icon);

        this.button.addEventListener('click',(e)=>{
          e.stopPropagation();
          store.commit('toggleSearch');
        },false );
        this.container.appendChild(this.button);

        return this.container;
      }
      onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
      }
    }

    const searchControl = new SearchControl();
    this.map.addControl(searchControl,'top-right');

  },

  getVenue: function(map){
    Mapwize.Api.getVenue('5b8ffe23051cd90021bd526f').then(venue => {console.log(venue); console.log(map.getFloorsForVenue(venue))});
  },
  getFloors: function(map){
    return map.getFloors();
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
            var products = [];
            var letters = [];
            places.forEach((element)=>{
                this.map.setPlaceStyle(element._id,{fillOpacity:0});
                if (element.data !== undefined && element.data.articles!== undefined) {
                  element.data.articles.forEach((article)=> {
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
