<template>
  <div>
    <h1 class="text-3xl font-bold underline">
      Google Maps API Status: {{ googleMapsStore.isGoogleMapsLoaded ? 'Loaded' : 'Not Loaded' }}
    </h1>

    <div class="m-10">


      <input v-model="searchQuery" @input="onSearchInput" placeholder="Search for a place" />


      <ul v-if="predictions.length > 0">
        <li v-for="(prediction, index) in predictions" :key="index" v-on:click="onPlaceSelected(prediction.place_id)">{{ prediction.description }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useGoogleMapsStore } from "./store/googleMaps";
import { onMounted, computed, ref } from "vue";

const googleMapsStore = useGoogleMapsStore();
// const { isGoogleMapsLoaded, init, getPlacePredictions, predictions } = useGoogleMapsStore();
const searchQuery = ref('');


onMounted(async () => {
  await googleMapsStore.init();
  googleMapsStore.getPlacePredictions("");
});



const predictions = computed(() => {
  return googleMapsStore.predictions;
});



const onSearchInput = async () => {
  // console.log(searchQuery.value);
  if (searchQuery.value.length >= 0) {
    await googleMapsStore.getPlacePredictions(searchQuery.value);
  } else if (searchQuery.value.length == 0) {
    // googleMapsStore.predictions = [];
  }
};

const onPlaceSelected = (place) => {
  googleMapsStore.getPlaceDetails(place);
  console.log("Place selected:", place);
};



</script>