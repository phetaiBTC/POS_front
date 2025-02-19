<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">📦 ລາຍການຄຳສັ່ງຊື້</h2>

      <!-- Skeleton Loader -->
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-6 bg-gray-300 rounded w-3/4"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        <div class="h-4 bg-gray-300 rounded w-2/3"></div>
        <div class="h-4 bg-gray-300 rounded w-full"></div>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="text-red-500 text-center font-semibold">
        {{ error }}
      </div>

      <!-- Order Details -->
      <div v-else class="space-y-4">
        <div class="bg-gray-50 p-4 rounded-lg border">
          <p class="text-lg font-semibold">🆔 Order ID: <span class="text-gray-700">{{ order?.id }}</span></p>
          <p class="text-lg font-semibold">🆔 Order ID: <span class="text-gray-700">{{ order?.name }}</span></p>
          <p class="text-lg font-semibold">💰 Total Price: <span class="text-green-600">฿{{ order?.total_price }}</span>
          </p>
          <p class="px-3 py-1 inline-block rounded-full text-sm font-medium mt-2"
            :class="order?.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'">
          <h1 v-if="order?.status === 'peding'">⏳ ຖ້າດຳເນີນ</h1>
          <h1 v-else="order?.status === 'completed'">✅ ແລ້ວ</h1>
          <h1 v-else="order?.status === 'cancelled'">❌ ຍົກເລີກ</h1>
          </p>
        </div>

        <!-- Product List -->
        <h3 class="text-xl font-semibold border-b pb-2">🛒 ລາຍການສິນຄ້າ</h3>
        <div class="grid gap-4">
          <div v-for="item in order?.items" :key="item.id"
            class="flex justify-between items-center bg-white shadow-md p-4 rounded-lg border">
            <div>
              <p class="font-medium">📌 ເມນູ : {{ item.menu_id }}</p>
              <p class="text-sm text-gray-500">🛍️ ຈຳນວນ : {{ item.quantity }}</p>
            </div>
            <p class="font-semibold text-green-600">฿{{ item.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const { $axios } = useNuxtApp();
const route = useRoute();

const order = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchOrder = async () => {
  try {
    const orderId = route.params.id as string;
    const response = await $axios.get(`/order/${orderId}`);
    order.value = response.data;
    console.log(order.value)
  } catch (err) {
    error.value = "❌ ບໍ່ສາມາດສັ່ງຄິນຄ້າ";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrder();
});
</script>

<style scoped>
/* No extra styles needed since we use Tailwind CSS */
</style>