import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    map: {},
    floors: [
      {floor: 0, name: 'UG'},
      {floor: 1, name: 'EG'}
    ],
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
    language: 'en'
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
    },
    addMarker (state, payload){
      state.marker = payload.marker;
    },
    toggleSearch (state){
      state.showSearch = !state.showSearch;
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

  },
  getters: {
    getPlaceById: (state) => (id) => {
      const _p = state.places.find(pl => pl._id===id);
      return _p;
    },
    getTranslation: (state, getters) => (placeId, propName) => {
      const _p = getters.getPlaceById(placeId)
      if (_p === undefined) return;
      if (_p.translations === undefined) return;
      const _t = _p.translations.find(_tr => _tr.language === state.language );
      return _t[propName]
    }

  },
  actions: {

  }
})
