import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const useGoogleMapsStore = defineStore('googleMaps', {
    state: () => ({
        google: ref(null),
        loader: ref(null),
        autocompleteService: ref(null),
        geocoder: ref(null),
        placesService: ref(null),
        predictions: ref([]),
    }),

    actions: {
        async init() {
            await this.initializeLoader();
            await this.loadGoogleMaps();
            console.log('Google Maps API loaded:', this.isGoogleMapsLoaded);
        },

        async initializeLoader() {
            if (!this.loader) {
                try {
                    this.loader = new Loader({
                        apiKey: API_KEY,
                        version: 'weekly',
                        libraries: ['places'],
                    });
                } catch (error) {
                    console.error('Error initializing Google Maps API loader:', error);
                }
            } else {
                console.log('Google Maps API loader already initialized.');
                return;
            }
        },

        async loadGoogleMaps() {
            // return if loader is not initialized
            if (!this.loader) {
                console.error('Google Maps API loader is not initialized.');
                return;
            }

            // return if google maps is already loaded if not load it
            if (this.google) {
                console.log('Google Maps API already loaded.');
                return;
            } else {
                try {
                    this.google = await this.loader.load();
                } catch (error) {
                    console.error('Error loading Google Maps API:', error);
                }
            }

        },

        // async loadAutocomplete() {
        //     if (!this.autocompleteService) {
        //         this.autocompleteService = await new this.google.maps.places.AutocompleteService();
        //     }
        // }

        /**
         * Retrieves place predictions based on a search string.
         * @param {string} search - The search string.
         * @returns {Object[]} - The place predictions.
         */
        async getPlacePredictions(search) {

            search = search.trim();

            if (search.length === 0) {
                this.predictions = [];
                return;
            }

            console.log('Search:', search);

            if (!this.isGoogleMapsLoaded) {
                console.error('Google Maps API is not initialized.');
                return;
            }

            if (!this.autocompleteService) {
                try {
                    this.autocompleteService = await new this.google.maps.places.AutocompleteService();
                } catch (error) {
                    console.error('Error initializing Autocomplete service:', error);
                    return;
                }
            }

            try {
                const predictions = await this._fetchPlacePredictions(this.autocompleteService, search);
                this.predictions = predictions;
                console.log('Place predictions:', predictions);
            } catch (error) {
                console.error('Error fetching place predictions:', error);
                this.predictions = [];
            }
        },

        async _fetchPlacePredictions(autocompleteService, search) {
            return new Promise((resolve, reject) => {
                autocompleteService.getPlacePredictions(
                    {
                        input: search,

                        // types: ['address'],
                    },
                    (result, status) => {
                        if (status !== this.google.maps.places.PlacesServiceStatus.OK) {
                            reject(status);
                        } else {
                            resolve(result);
                        }
                    }
                );
            });
        },

        /**
         * Retrieves place details based on a place ID.
         * @param {string} placeId - The place ID.
         * @returns {Object|null} - The place details or null if there's an error.
         */
        async getPlaceDetails(placeId) {
            if (!this.isGoogleMapsLoaded) {
                console.error('Google Maps API is not initialized.');
                return;
            }

            if (!this.placesService) {
                try {
                    this.placesService = await new this.google.maps.places.PlacesService(
                        document.createElement('div')
                    );
                } catch (error) {
                    console.error('Error initializing Places service:', error);
                    return;
                }
            }

            try {
                const place = await this._fetchPlaceDetails(this.placesService, placeId);
                console.log('Place details:', place);
                return place;
            } catch (error) {
                console.error('Error fetching place details:', error);
            }
        },

        async _fetchPlaceDetails(placesService, placeId) {
            return new Promise((resolve, reject) => {
                placesService.getDetails(
                    {
                        placeId: placeId,
                        fields: ['place_id', 'address_components', 'formatted_address', 'geometry', 'name'],
                    },
                    (result, status) => {
                        if (status !== this.google.maps.places.PlacesServiceStatus.OK) {
                            reject(status);
                        } else {
                            resolve(result);
                        }
                    }
                );
            });
        },
    },

    getters: {
        isGoogleMapsLoaded: state => state.google !== null,
    },
});
