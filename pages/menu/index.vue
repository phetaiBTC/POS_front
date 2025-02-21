<template>
    <div style="background-color: #ececec;" class="p-6">
        <div class="w-full flex justify-center">
            <a-button type="primary" @click="showDrawer">Open your Order</a-button>
        </div>
        <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name"
            :root-style="{ color: 'blue' }" style="color: red" title="Review Your Order" placement="right"
            @after-open-change="afterOpenChange">
            <div class="p-4 bg-white rounded-md shadow-lg">
                <h3 class="text-xl font-semibold mb-4 text-green-500 text-center pb-5">📦 ລາຍການຄຳສັ່ງຊື້</h3>
                <div v-if="booking.length > 0">
                    <div v-for="(item, index) in booking" :key="index"
                        class="flex justify-between items-center my-1 border border-gray-400 rounded p-2">
                        <img :src="item.image" alt="..." class="aspect-[1/0.8] w-20 rounded overflow-hidden">
                        <div>
                            <p class="font-medium text-blue-600">{{ item.name }}</p>
                            <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                        </div>
                        <div class="flex items-center flex-col">
                            <p class="text-lg font-bold text-black">${{ item.price }} </p>
                            <select v-model="item.payment_method">
                                <option value="qr_code" selected>Qr code 💳</option>
                                <option value="cash">Cash 💵</option>
                            </select>
                        </div>
                    </div>
                    <div class="mt-4">
                        <p class="text-lg font-semibold text-right">Total: ${{ totalPrice }}</p>
                    </div>
                </div>
                <div v-else>
                    <p class="text-center text-gray-500">Your cart is empty.</p>
                </div>
            </div>
            <div class="p-4 bg-gray-100 flex justify-end">
                <a-button type="primary" @click="order">Confirm Order</a-button>
            </div>
        </a-drawer>
        <a-row :gutter="16">
            <CardItem v-for="(product, index) in products" :key="index" :name="product.name"
                :description="product.description" :price="product.price" :image="product.image" :rating="5"
                @add-to-cart="handleAddToCart" :id="product.id" />
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { Item } from 'ant-design-vue/es/menu';
import { useUserStore } from '~/store/useUserStore';
const userStore = useUserStore();
const { $axios } = useNuxtApp();
definePageMeta({
    middleware: 'auth'
})
const open = ref<boolean>(false);

const totalPrice = computed(() => {
    return booking.value.reduce((total, item) =>
        total + (Number(item.price) * Number(item.quantity)), 0
    );
});



const afterOpenChange = (bool: boolean) => {
    console.log('open', bool);
};

const showDrawer = () => {
    open.value = true;
};
interface Booking {
    menu_id: number;
    quantity: number;
    name: string;
    price: string;
    image: string;
    payment_method: string;
}
const booking = ref<Booking[]>([])
interface Payment {
    payment_method: string
}
const payments = ref<Payment[]>([])
interface Product {
    id: number;
    user_id: number;
    name: string;
    description: string;
    vonder_id: number;
    vondor_name: number;
    price: string;
    created_at: string;
    updated_at: string;
    image: string;
}

const products = ref<Product[]>([]);

const handleAddToCart = (item: any) => {
    booking.value.push(item)
};

const getData = async () => {
    try {
        const response = await $axios.get('/menu-item');

        console.log(response.data);
        if (response.data) {
            products.value.push(...response.data);
        } else {
            console.error('Invalid data format received', response);
        }
    } catch (e: any) {
        console.error('Error fetching data:', e);
    }
};
onMounted(() => {
    getData();

});
interface itemR {
    menu_item_id: number;
    quantity: number;
}
const items = ref<itemR[]>([])

const order = async () => {

    try {
        for (let i in booking.value) {
            items.value.push({
                menu_item_id: booking.value[i].menu_id,
                quantity: booking.value[i].quantity
            })
        }
        for (let i in booking.value) {
            payments.value.push({
                payment_method: booking.value[i].payment_method
            })
        }
        console.log(items.value)
        console.log(payments.value)
        await $axios.post('/order', {
            user_id: userStore.user?.id,
            items: items.value,
            payments: payments.value
        }).then(() => {
            alert('Order created successfully.');
            open.value = false;  // Close the drawer after the order
        });
    }
    catch (e: any) {
        console.error('Error fetching data:', e);
    }
};

</script>

<style scoped></style>
