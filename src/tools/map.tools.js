var Mapwize = require('mapwize');
import store from '../store'

const placeTypesDepartments = [
   '57ff3c976e2cc00b00566a0d',
   '57285b8a7f0f7a0b0092cf5e'
 ]

const MapTools = {
  _selectedPlace: undefined,

  init: function(mapwizeMap){
    this.map = mapwizeMap;
    mapwizeMap.setFloor(1);
    mapwizeMap.setUserPosition({
      latitude: 47.42209953906886,
      longitude: 8.375177110719962,
      floor: 1,
      accuracy: 8
    });

    mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-size',33);
    mapwizeMap.setLayoutProperty('mapwize_places_symbol','icon-size',0.4);
    mapwizeMap.setLayoutProperty('position','icon-size',2);
    mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-offset',[0,0.4]);
    mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-optional',false);
    mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-anchor','center');
    mapwizeMap.setLayoutProperty('mapwize_places_symbol','text-anchor','top');
    //mapwizeMap.setLayoutProperty('mapwize_places_symbol', 'visibility', 'none');

    mapwizeMap.setPaintProperty('mapwize_places_symbol','text-color','#FFFFFF');
    mapwizeMap.setPaintProperty('mapwize_places_symbol','text-halo-width',0);
    //mapwizeMap.setPaintProperty("mapwize_places_fill", 'fill-color', '#FFFFFF');
    //mapwizeMap.setPaintProperty("mapwize_places_fill", 'fill-opacity', 0);
    mapwizeMap.setPaintProperty("mapwize_directions_dash", 'line-color', '#FAD23C');
    mapwizeMap.setPaintProperty("mapwize_directions_dash", 'line-width', 20);
    mapwizeMap.setLayoutProperty('mapwize_directions_dash', 'line-cap', 'square');
    mapwizeMap.setPaintProperty("mapwize_directions", 'line-width', 0);
    mapwizeMap.setPaintProperty("mapwize_directions_dash", 'line-dasharray',[1,0]);

    store.subscribe((mutation, state) => {
      if (mutation.type === "changePlace"){
        this.showDirections();
      }
    });

    mapwizeMap.on('zoom', () => {
           //console.log(mapwizeMap.getZoom());
           //mapwizeMap.setPaintProperty("mapwize_directions_dash", 'line-width', Math.round(mapwizeMap.getZoom()));

         });

    mapwizeMap.on('mapwize:click', e => {
        if (e.place !== null){
          mapwizeMap.setPlaceStyle(e.place, {
            fillColor: '#000000',
            fillOpacity: 0.2
          });
          if (this._selectedPlace!== undefined){
              mapwizeMap.setPlaceStyle(this._selectedPlace._id, {fillOpacity:0});
          }
          this._selectedPlace = e.place;


        //  showPlace(e.place);
        //  app.navigateDisabled = false;

        }
         // app.name = e.place.name;
         // app.articles = e.place.data ? e.place.data.articles : [];
    })

  },
  showDirections: function(){
    const newPlace = store.state.selectedPlace;

    Mapwize.Api.getDirection({
        from: {
          latitude: 47.42209953906886,
          longitude: 8.375177110719962,
          floor: 1
        },
        to: {
          placeId: newPlace._id
        },
        waypoints: [],
        options: {}
        }).then(direction => {
          this.map.setDirection(direction);
          //this.map.getSource("mapwize_directions").setData(direction.route[0].path);
          this.map.setBearing(48.1);
          
        });
  },


  initConfig: {
    bearing: 48.1,
    container: 'mapContainer',
    zoom: 20.338757675284295,
    userPosition: false,
    navigationControl: false,
    floorControl: false,
    venueId: '5b8ffe23051cd90021bd526f',
    floor: 1,
    color: '#fad23c',
    center:[8.375177110719962, 47.42209953906886], //longLat
    userPosition: {
      latitude: 47.42209953906886,
      longitude: 8.375177110719962,
      floor: 1,
      accuracy: 8
    }
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

    class FloorControl {
      onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'floor-control';
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

    const myCustomControl = new SearchControl();
    this.map.addControl(myCustomControl,'top-right');
  //  const m = this.map._controls[1];
//    this.map.removeControl(this.map._controls[0]);
  //  this.map.removeControl(this.map._controls[1]);
  //  this.map.removeControl(this.map._controls[2]);
  //  this.map.addControl(m,'top-left');
  },

  getVenue: function(map){
    Mapwize.Api.getVenue('5b8ffe23051cd90021bd526f').then(venue => {console.log(venue); console.log(map.getFloorsForVenue(venue))});
  },
  getFloors: function(map){
    return map.getFloors();
  },
  initInfo: function(map){

    Mapwize.Api.getPlaces({
          venueId: '5b8ffe23051cd90021bd526f'
        }).then(places => {
            var floors = store.state.floors;
            var departments = {};
            var facilities = {};
            floors.sort();
            var allPlaces = Object.assign({}, places);
            departments = floors.map((currentValue)=>(departments[currentValue] = []));
            facilities = floors.map((currentValue)=>(facilities[currentValue] = []));
            places.forEach((element)=>{
              const floor = element.floor;
              const isDepartment = placeTypesDepartments.indexOf(element.placeTypeId);
              if (isDepartment !== -1){
                departments[floor].push(element);
                this.map.setPlaceStyle(element._id,{fillOpacity:0});

              }else{
                facilities[floor].push(element);
              }
            })
            this._departments = Object.assign({}, departments);
            var products = [];
            var letters = [];
            places.forEach((element)=>{
              if (element.data !== undefined && element.data.articles!== undefined) {
                element.data.articles.forEach((article)=> {
                  products.push({name: article, placeId: element._id, letter: article.toUpperCase().charAt(0)});
                  letters.push(article.toUpperCase().charAt(0));
                });
              }
            });
            departments.forEach((fl)=>{
              fl.sort(function(a, b) {
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

            })

            facilities.forEach((fl)=>{
              fl.sort(function(a, b) {
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
              departments: departments,
              products: products,
              letters: letters,
              facilities: facilities
            });

        });
  }



}

export default MapTools;
