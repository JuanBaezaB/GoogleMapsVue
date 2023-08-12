<template>
    <div>
      <input
        ref="autocompleteInput"
        class="autocomplete-input"
        placeholder="Enter a location..."
      />
      <div class="google-map" ref="googleMap"></div>
      <template v-if="Boolean(google) && Boolean(map)">
        <slot :google="google" :map="map" />
      </template>
    </div>
  </template>
  
  
  <script>
  import GoogleMapsApiLoader from 'google-maps-api-loader';
  
  export default {
    props: {
      apiKey: String,
    },
  
    data() {
      return {
        google: null,
        map: null,
        autocomplete: null,
      };
    },
  
    async mounted() {
      try {
        this.google = await GoogleMapsApiLoader({
          apiKey: this.apiKey,
          libraries: ['places'], // Add 'places' library to load Places API
        });
        this.initializeMap();
        this.initializeAutocomplete();
      } catch (error) {
        console.error('Error loading Google Maps API:', error);
      }
    },
  
    methods: {
      initializeMap() {
        const mapContainer = this.$refs.googleMap;
        this.map = new this.google.maps.Map(mapContainer, {
          center: { lat: 0, lng: 0 },
          zoom: 3,
        });
      },
  
      initializeAutocomplete() {
        const inputElement = this.$refs.autocompleteInput;
        this.autocomplete = new this.google.maps.places.Autocomplete(inputElement);
        this.autocomplete.bindTo('bounds', this.map);
  
        // Listen for the 'place_changed' event, which is triggered when a user selects a place from the suggestions.
        this.autocomplete.addListener('place_changed', this.onPlaceChanged);
      },
  
      onPlaceChanged() {
        // Get the selected place from the autocomplete input
        const selectedPlace = this.autocomplete.getPlace();
  
        if (!selectedPlace.geometry) {
          console.log('Place details not available for input:', selectedPlace.name);
          return;
        }
  
        // Center the map on the selected place
        this.map.setCenter(selectedPlace.geometry.location);
        this.map.setZoom(15); // Adjust zoom level as needed
      },
    },
  };
  </script>
  
  <style>
  .google-map {
    height: 400px;
    width: 100%;
  }
  
  .autocomplete-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  </style>