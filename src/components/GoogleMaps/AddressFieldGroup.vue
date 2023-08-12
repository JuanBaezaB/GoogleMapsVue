<template>
    <h3 class="text-lg font-medium">{{ label }}</h3>
    <div class="grid grid-cols-3 gap-5">
      <label class="col-span-2 block text-sm font-medium text-gray-700">
        Street
        <input
          class="block mt-1 w-full text-sm placeholder-gray-400 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          @input="$emit('update:street', $event.target.value)"
          :value="street"
          ref="streetRef"
          placeholder="Street"/>
      </label>
  
      <label class="block text-sm font-medium text-gray-700">
        Number
        <input
          class="block mt-1 w-full text-sm placeholder-gray-400 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          @input="$emit('update:streetNumber', $event.target.value)"
          :value="streetNumber"
          placeholder="Number"/>
      </label>
  
      <label class="block text-sm font-medium text-gray-700">
        Postcode
        <input
          class="block mt-1 w-full text-sm placeholder-gray-400 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          @input="$emit('update:postcode', $event.target.value)"
          :value="postcode"
          placeholder="Postcode"/>
      </label>
  
      <label class="block text-sm font-medium text-gray-700">
        City
        <input
          class="block mt-1 w-full text-sm placeholder-gray-400 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          @input="$emit('update:city', $event.target.value)"
          :value="city"
          placeholder="City"/>
      </label>
  
      <label class="block text-sm font-medium text-gray-700">
        Country
        <input
          class="block mt-1 w-full text-sm placeholder-gray-400 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          @input="$emit('update:country', $event.target.value)"
          :value="country"
          placeholder="Country"/>
      </label>
    </div>
  </template>
  
  <script>
  import {onMounted, onUnmounted, ref} from "vue";
  
  export default {
    props: {
      label: {
        type: String,
        default: '',
      },
      street: {
        type: String,
        default: '',
      },
      streetNumber: {
        type: String,
        default: '',
      },
      postcode: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
    },
    setup(props, context) {
      const streetRef = ref();
      let autocomplete;
  
      onMounted(() => {
        autocomplete = new google.maps.places.Autocomplete(streetRef.value, {
          types: ["address"],
          fields: ["address_components"]
        });
  
        google.maps.event.addListener(autocomplete, "place_changed", () => {
          const mapping = {
            street_number: "update:streetNumber",
            route: "update:street",
            locality: "update:city",
            postal_code: "update:postcode",
            country: "update:country",
          }
  
          for(const type in mapping) {
            context.emit(mapping[type], "");
          }
  
          let place = {
            address_components: [],
            ...autocomplete.getPlace()
          }
  
          place.address_components.forEach((component) => {
            component.types.forEach((type) => {
                if(mapping.hasOwnProperty(type)){
                  context.emit(mapping[type], component.long_name);
                }
            });
          });
        });
      });
  
      onUnmounted(() => {
        if(autocomplete) {
          google.maps.event.clearInstanceListeners(autocomplete);
        }
      });
  
      return {streetRef};
    }
  };
  </script>