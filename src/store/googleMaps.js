import { defineStore } from 'pinia';
import { ref } from 'vue';
import GoogleMapsApiLoader from 'google-maps-api-loader';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const lat = import.meta.env.VITE_LATITUDE;
const lon = import.meta.env.VITE_LONGITUDE;


export const useGoogleMapsStore = defineStore('googleMaps', {
    state: () => ({
        google : ref(null),
    }),
    actions: {
        async init() {  
            console.log(API_KEY);
            this.google = await GoogleMapsApiLoader({
                apiKey: API_KEY,
                libraries: ['places'], // Add 'places' library to load Places API
              });
        }
    },
    getters: {

    }
});