<template>
    <div style="background-color: #ececec;" class="p-6">
        <div class="w-full flex justify-center">
            <a-button type="primary" @click="showDrawer">Open your Order</a-button>
        </div>
        <a-drawer v-model:open="open" class="custom-class" root-class-name="root-class-name"
            :root-style="{ color: 'blue' }" style="color: red" title="Review Your Order" placement="right"
            @after-open-change="afterOpenChange">
            <div class="p-4 bg-white rounded-md shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Your Cart</h3>
                <div v-if="booking.length > 0">
                    <div v-for="(item, index) in booking" :key="index" class="flex justify-between items-center mb-4">
                        <div>
                            <p class="font-medium">name : {{ item.name }}</p>
                            <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                        </div>
                        <div class="flex items-center">
                            <p class="text-lg font-bold">Price: ${{ item.price }} </p>
                            <!-- Assuming price is available -->
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
                :description="product.description" :price="product.price" :image="product.image"
                :rating="product.rating" @add-to-cart="handleAddToCart" :id="product.id" />
        </a-row>
    </div>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp();
definePageMeta({
    middleware: 'auth'
})
const user = ref<number>();
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
}
const booking = ref<Booking[]>([])
interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    price: string;
    category_name: string;
    category_id: number;
    rating: number;
    vonder_id: number
}

const products = ref<Product[]>([]);

const handleAddToCart = (item: any) => {
    booking.value.push(item)
};

const getData = async () => {
    try {
        const response = await $axios.get('/menu/getall', {
            params: { category_id: "" }
        });
        const userId = await $axios.get('/auth/me');
        user.value = userId.data.user.id

        if (response.data && response.data.data) {
            products.value.push(...response.data.data);
        } else {
            console.error('Invalid data format received', response);
        }
    } catch (e: any) {
        console.error('Error fetching data:', e);
        alert('An error occurred while fetching data.');
    }
};
onMounted(() => {
    getData();
});
const order = async () => {
    try {
        await $axios.post('/order/create', {
            user_id: user.value,
            vendor_id: 1,
            items: booking.value,
        }).then(() => {
            alert('Order created successfully.');
            open.value = false;  // Close the drawer after the order
        });
    }
    catch (e: any) {
        console.error('Error creating order:', e);
        alert('An error occurred while creating the order.');
    }
};

</script>

<style scoped></style>
