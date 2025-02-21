<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4 my-6" id="printableArea">
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
          <p class="text-lg font-semibold">👤 User ID: <span class="text-gray-700">{{ order?.user_id }}</span></p>
          <p class="text-lg font-semibold">💰 Total Price: <span class="text-green-600">฿{{ order?.total_price }}</span></p>

          <p class="px-3 py-1 inline-block rounded-full text-sm font-medium mt-2"
            :class="order?.status === 'pending' ? 'bg-yellow-100 text-yellow-600' 
              : order?.status === 'completed' ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'">
            <span v-if="order?.status === 'pending'">⏳ ຖ້າດຳເນີນ</span>
            <span v-else-if="order?.status === 'completed'">✅ ແລ້ວ</span>
            <span v-else-if="order?.status === 'cancelled'">❌ ຍົກເລີກ</span>
          </p>
        </div>

        <!-- Product List -->
        <h3 class="text-xl font-semibold border-b pb-2">🛒 ລາຍການສິນຄ້າ</h3>
        <div class="grid gap-4">
          <div v-for="item in order?.order_items" :key="item.menu_item_id"
            class="flex justify-between items-center bg-white shadow-md p-4 rounded-lg border">
            <div>
              <p class="font-medium">📌 ເມນູ : {{ item.menu_item_name }}</p>
              <p class="text-sm text-gray-500">🛍️ ຈຳນວນ : {{ item.quantity }}</p>
            </div>
            <p class="font-semibold text-green-600">฿{{ item.subtotal }}</p>
          </div>
        </div>

        <!-- Payment Details -->
        <h3 class="text-xl font-semibold border-b pb-2">💳 ຂໍ້ມູນການຈ່າຍເງິນ</h3>
        <div class="grid gap-4">
          <div v-for="payment in order?.order_payments" :key="payment.vendor_id"
            class="flex justify-between items-center bg-white shadow-md p-4 rounded-lg border">
            <div>
              <p class="font-medium">🏪 ຮ້ານຄ້າ: {{ payment.vendor_name }}</p>
              <p class="text-sm text-gray-500">💰 ຈຳນວນເງິນ: ฿{{ payment.amount }}</p>
              <p class="text-sm text-gray-500">💳 ວິທີຈ່າຍ: {{ payment.payment_method }}</p>
            </div>
            <p class="font-semibold"
              :class="payment.status === 'pending' ? 'text-yellow-600' 
                : payment.status === 'paid' ? 'text-green-600' 
                : 'text-red-600'">
              {{ payment.status === 'pending' ? '⏳ ຖ້າດຳເນີນ' : payment.status === 'paid' ? '✅ ແລ້ວ' : '❌ ຍົກເລີກ' }}
            </p>
            
          </div>
        </div>
        <button @click="printDiv" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
          🖨️ Print Order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useNuxtApp } from "#app";

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
  } catch (err) {
    error.value = "❌ ບໍ່ສາມາດດຶງຂໍ້ມູນຄຳສັ່ງຊື້ໄດ້";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const printDiv = () => {
  const printableArea = document.getElementById('printableArea');
  if (!printableArea) return;
  
  // เปิดหน้าต่างใหม่สำหรับการพิมพ์เฉพาะเนื้อหาที่เลือก
  const printWindow = window.open('', '', 'width=800,height=600');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Content</title>
        <style>
          /* สามารถเพิ่มสไตล์สำหรับการพิมพ์ได้ที่นี่ */
          body { font-family: sans-serif; margin: 20px; }
        </style>
      </head>
      <body>
        ${printableArea.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  
  // เรียกใช้ฟังก์ชันพิมพ์แล้วปิดหน้าต่าง
  printWindow.print();
  printWindow.close();
};
onMounted(() => {
  fetchOrder();
});
</script>

<style scoped>
/* No extra styles needed since we use Tailwind CSS */
</style>
