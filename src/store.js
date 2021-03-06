import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    map: {},
    floors: [
      {
        en: 'Ground Floor',
        de: 'Erdgeschoss'
      },
      {
        en: 'First Floor',
        de: 'Obergeschoss'
      },
    ],
    floors_short: [
      {
        en: '0',
        de: 'EG'
      },
      {
        en: '1',
        de: 'OG'
      },
    ],
    showRoute: false,
    places: [],
    placeLists: [],
    departments: [],
    facilities: [],
    products: [],
    letters: [],
    selectedLetter: 'A',
    selectedPlace: {},
    showSearch: false,
    marker: {},
    previousPlace: {},
    directionsVisible: false,
    containedPlaces: {},
    language: '',
    bearing: 0,
    lat: 0,
    lng: 0,
    floor: 0,
    centeronUser: false
  },
  mutations: {
    assignPlaces (state, payload){
      state.places =  payload.places;
      state.departments = payload.departments;
      state.products = payload.products;
      state.letters = payload.letters;
      state.facilities = payload.facilities;
    },
    assignFloors (state, payload){
      state.floors = payload.floors;
    },
    assignMap (state, payload){
      state.map = payload.map;
    },
    assignPlaceLists (state, payload){
      state.placeLists = payload.placeLists;
    },
    changeLetter (state, payload){
      state.selectedLetter = payload.letter;
    },
    changePlace (state, payload){
      state.previousPlace = state.selectedPlace;
      state.selectedPlace = payload.place;
      state.showRoute = payload.route;
    },
    addMarker (state, payload){
      state.marker = payload.marker;
    },
    toggleSearch (state){
      state.showSearch = !state.showSearch;
    },
    centerMap (state){
      state.centeronUser = true;
    },
    assignFacilities (state, payload) {
      state.facilities = payload.facilities;
    },
    assignContainedPlaces (state, payload) {
      state.containedPlaces = payload.placeLists;
    },
    toggleDirections (state, payload) {
      state.directionsVisible = payload.visible;
    },
    setPoiOptions (state, payload) {
      //state.language = payload.language;
      state.bearing = payload.bearing;
      state.lat = payload.lat;
      state.lng = payload.lng;
      state.floor = payload.floor;

    },
    setlanguage (state, payload){
      state.language = payload.l;
    }
  },
  getters: {
    getPlaceById: (state) => (id) => {
      const _p = state.places.find(pl => pl._id===id);
      return _p;
    },
    getTranslation: (state) => (feature, propName) => {
      const _t = feature.translations.find(_tr => _tr.language === state.language );
      return _t[propName]
    },
    getTranslationByID: (state, getters) => (placeId, propName) => {
      const _p = getters.getPlaceById(placeId)
      if (_p === undefined) return;
      if (_p.translations === undefined) return;
      const _t = _p.translations.find(_tr => _tr.language === state.language );
      return _t[propName]
    },
    getFloor: (state) => () =>{
      const _f = state.floor;

      //const floors = ['EG', 'OG'];
      return state.floors[_f][state.language];
    }

  },
  actions: {

  }
})
