<template>
    <div>
      <input
        ref="autocompleteInput"
        
        placeholder="Enter a location..."
      />
    </div>
  </template>
  
  <script>
  import GoogleMapsApiLoader from 'google-maps-api-loader';
  
  export default {
    name: 'GoogleMapsAutocomplete', // Name of the component
    
    props: {
      apiKey: String,
    },
  
    data() {
      return {
        autocomplete: null,
      };
    },
  
    async mounted() {
      try {
        this.google = await GoogleMapsApiLoader({
          apiKey: this.apiKey,
          libraries: ['places'], // Add 'places' library to load Places API
        });
        this.initializeAutocomplete();
      } catch (error) {
        console.error('Error loading Google Maps API:', error);
      }
    },
  
    methods: {
      initializeAutocomplete() {
        const inputElement = this.$refs.autocompleteInput;
        this.autocomplete = new this.google.maps.places.Autocomplete(inputElement);
        this.autocomplete.addListener('place_changed', this.onPlaceChanged);
      },
  
      onPlaceChanged() {
        const selectedPlace = this.autocomplete.getPlace();
  
        if (!selectedPlace.geometry) {
          console.log('Place details not available for input:', selectedPlace.name);
          return;
        }
  
        // Emit the selected place data to the parent component or handle it as needed.
        this.$emit('place-selected', {
          name: selectedPlace.name,
          location: {
            lat: selectedPlace.geometry.location.lat(),
            lng: selectedPlace.geometry.location.lng(),
          },
        });
      },
    },
  };
  </script>
  
  