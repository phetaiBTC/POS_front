<template>
    <div>
        <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'no'">
                    <h1 class="text-center">
                        {{ index + 1 }}
                    </h1>
                </template>
                <template v-if="column.key === 'operation'">
                    <div class="flex gap-2 w-full h-full justify-center items-center flex-col">
                        <a-button v-if="userStore.user?.roles.includes('admin')" type="primary"
                            @click="handleStatus(record.id,'completed')">completed</a-button>
                        <a-button v-if="userStore.user?.roles.includes('admin')" type="primary"
                            @click="handleStatus(record.id,'cancelled')">cancelled</a-button>
                        <a-button type="primary" @click="handleEdit(record.id)">View</a-button>
                        <a-button type="primary" danger ghost @click="handleDelete(record.id)">Danger</a-button>
                    </div>
                </template>
                <template v-if="column.key === '4'">
                    <div>
                        <div v-for="(item, index) in record.order_items" :key="index" class="border rounded p-2 my-2">
                            <p>{{ item.menu_item_name }}</p>
                            <p>{{ item.quantity }} x {{ item.price }} = {{ item.subtotal }}</p>
                        </div>
                    </div>
                </template>
                <template v-if="column.key === '5'">
                    <div v-for="(item, index) in record.order_payments" :key="index" class="border rounded p-2 my-2"
                        @click="handlePayment(item)">
                        <p>ຮ້ານ {{ item.vendor_name }}</p>
                        <p>ລາຄາ {{ item.amount }} Kip</p>
                        <p v-if="item.status === 'pending'" class="text-yellow-600">ສະຖານນະ {{ item.status }}</p>
                        <p v-if="item.status === 'paid'" class="text-green-600">ສະຖານນະ {{ item.status }}</p>
                        <p v-if="item.status === 'failed'" class="text-green-600">ສະຖານນະ {{ item.status }}</p>
                        <p>{{ item.payment_method === 'qr_code' ? 'Qr code' : 'Cash' }}</p>
                        <p>{{ item.transaction_id }}</p>
                    </div>
                </template>
                <template v-if="column.key === 'status'">
                    <p v-if="record.status === 'pending'" class="text-yellow-600">{{ record.status }}</p>
                    <p v-if="record.status === 'completed'" class="text-green-600">{{ record.status }}</p>
                    <p v-if="record.status === 'cancelled'" class="text-red-600">{{ record.status }}</p>
                </template>
                <template v-if="column.key === '1'">
                    <h1 class=" text-green-600">{{ record.total_price }} Kip</h1>
                </template>

            </template>
        </a-table>
    </div>
    <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk" class="flex justify-center items-center">
        <a-qrcode error-level="H" :value="'http://localhost:3000/payment/'+payment?.payment_id" icon="https://i.pinimg.com/236x/db/16/45/db1645cc1ed95625a5dff41ee9a0f164.jpg" size="200"/>
        <p>link : {{ 'http://localhost:3000/payment/'+payment?.payment_id }}</p>
        <p>amount : {{ payment?.amount }}</p>
        <p>vendor name : {{ payment?.vendor_name }}</p>
        <p>status : {{ payment?.status }}</p>
    </a-modal>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
import type { TableColumnsType } from 'ant-design-vue';
import { useUserStore } from '~/store/useUserStore';
const userStore = useUserStore()
const { $axios } = useNuxtApp();
const open = ref<boolean>(false);
interface pay {
    payment_id: number,
    amount: number,
    vendor_name: string,
    status: string,
    payment_method: string,
    transaction_id: string
}
const payment = ref<pay>()
const handleOk = (e: MouseEvent) => {
    console.log(e);
    open.value = false;
};
const columns: TableColumnsType = [
    { title: 'No', width: 100, dataIndex: 'name', key: 'no', fixed: 'left' },
    { title: 'status', width: 100, dataIndex: 'status', key: 'status', fixed: 'left' },
    { title: 'total price', dataIndex: 'total_price', key: '1', width: 150 },
    { title: 'order items', dataIndex: 'order_items', key: '4', width: 150 },
    { title: 'order payments', dataIndex: 'order_payments', key: '5', width: 150 },
    { title: 'created at', dataIndex: 'created_at', key: '2', width: 150 },
    { title: 'updated at', dataIndex: 'updated_at', key: '3', width: 150 },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 150,
    },
];

interface OrderItem {
    menu_item_id: number;
    menu_item_name: string;
    price: string;
    quantity: number;
    subtotal: string;
}

interface OrderPayment {
    vendor_id: number;
    vendor_name: string;
    amount: string;
    payment_method: string;
    status: string;
    transaction_id: string | null;
    payment_id: number;
}

interface DataItem {
    id: number;
    user_id: number;
    status: string;
    total_price: string;
    created_at: string;
    updated_at: string;
    order_items: OrderItem[];
    order_payments: OrderPayment[];
}
const handleEdit = (id: number) => {
    navigateTo(`/order/${id}`);
}
const handleDelete = async (id: number) => {
    try {
        await $axios.delete(`/order/${id}`);
        location.reload();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
const handleStatus = async (id: number, status: string) => {
    try {
        await $axios.put(`/order/order-status/${id}`, { status: status });
        location.reload();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
const handlePayment = async (item: any) => {
    open.value = true;
    payment.value = item
}
const data = ref<DataItem[]>([]);
const getOrder = async () => {
    try {
        const response = await $axios.get('/order');
        data.value = response.data;
        console.log(data.value);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
onMounted(async () => {
    getOrder()
})
</script>

<style scoped></style>