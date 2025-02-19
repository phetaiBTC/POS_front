<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
    <!-- Check if product data is available before rendering -->
    <div v-if="product">
      <!-- Product Info Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Image -->
        <div>
          <img :src="product.image" alt="Product Image" class="w-full h-80 object-cover rounded-lg shadow-md" />
        </div>

        <!-- Product Details -->
        <div>
          <h2 class="text-3xl font-semibold text-gray-900">{{ product.name }}</h2>
          <p class="text-xl text-gray-600 mt-2">Category ID: {{ product.category_id }}</p>
          <p class="text-xl text-gray-600 mt-2">Vendor ID: {{ product.vendor_id }}</p>
          <p class="text-2xl font-bold text-green-500 mt-4">${{ product.price }}</p>

          <!-- Product Description -->
          <div class="mt-6">
            <h3 class="text-2xl font-semibold text-gray-800">Description</h3>
            <p class="text-gray-700 mt-2">{{ product.description }}</p>
          </div>

          <!-- Product Rating -->
          <div class="mt-6">
            <h3 class="text-2xl font-semibold text-gray-800">Rating</h3>
            <p class="text-gray-700 mt-2">{{ product.rating }} / 5</p>
          </div>

          <!-- Buy Now Button -->
          <div class="flex justify-around mt-8">
            <button @click="cancel"
              class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Cancel
            </button>
            <button @click="buyNow"
              class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Message -->
    <div v-else>
      <p class="text-center text-lg text-gray-700">Loading product details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const { $axios } = useNuxtApp();

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  vendor_id: number;
  rating: number;
  category_id: number;
}

const product = ref<Product | null>(null);

const route = useRoute();

// Fetch product details from API
const fetchProductDetails = async () => {
  try {
    const productId = route.params.id as string; // Get the product ID from the route params
    const response = await $axios.get(`http://127.0.0.1:8000/api/menu/${productId}`);
    product.value = response.data; // Store product data
  } catch (error) {
    console.error("Error fetching product details", error);
  }
};

onMounted(() => {
  fetchProductDetails(); // Fetch product details when the component is mounted
});

// Buy Now button handler
const buyNow = () => {
  alert(`You have chosen to buy the product: ${product.value?.name}`);
  // Implement the purchase logic or redirection to checkout page here
};
const cancel = () => {
  navigateTo('/menu')
}
</script>

<style scoped>
/* Optional: Add any custom styling for the component */
</style>