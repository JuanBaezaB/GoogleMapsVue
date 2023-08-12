<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>

<script setup>;
import { useGoogleMapsStore } from "./store/googleMaps";
const googleMapsStore = useGoogleMapsStore();
googleMapsStore.init();  // Initialize the store

</script>./store/googleMaps