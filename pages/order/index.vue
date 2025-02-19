<template>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1300, y: 'max-content' }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
                <h1 :class="statusClass(record.status)">
                    <i :class="statusIcon(record.status)" class="mr-1"></i>
                    {{ record.status }}
                </h1>
            </template>
            <template v-if="column.key === 'operation'">
                <!-- <a @click="handleAction(record.id)">Action</a> -->
                 <div class="flex gap-2 flex-col">
                     <a-button type="primary" v-if=" role == 'admin'" @click="handleAction(record.id)">complete</a-button>
                     <a-button type="primary" @click="handleActionCancel(record.id)">cancel</a-button>
                     <a-button type="primary" @click="showBin(record.id)">Show</a-button>
                     <!-- <a-button type="primary" @click="showBin(record.id)">Show</a-button> -->
                 </div>
                
            </template>
            <template v-if="column.key === 'order_items'">
                <div v-if="record.items && record.items.length" class="flex gap-2 flex-wrap">
                    <div v-for="(item, index) in record.items" :key="index"
                        class="flex flex-col my-1 border p-2 rounded border-gray-400">
                        <h1>{{ item.menu.name }}</h1>
                        <div class="flex justify-between">
                            <p>Price: ${{ item.menu.price }}</p>
                            <p class="ml-3">{{ 'x' + item.quantity }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="column.key === 'name'">
                <h1>{{ record.name }}</h1>
            </template>
        </template>
    </a-table>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'auth'
})
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const role = useCookie('role')
import type { TableColumnsType } from 'ant-design-vue';
const { $axios } = useNuxtApp();
const { t } = useI18n();

const columns: TableColumnsType = [
    { title: t('table.name'), width: 130, dataIndex: 'status', key: 'name', fixed: 'left' },
    { title: t('table.total'), width: 120, dataIndex: 'total_price', key: 'total_price' },
    { title: t('table.status'), dataIndex: 'status', key: 'status', width: 150 },
    { title: t('table.order'), dataIndex: 'items', key: 'order_items' },
    { title: t('table.action'), key: 'operation', fixed: 'right', width: 120 },
];

interface OrderItem {
    id: number;
    order_id: number;
    menu_id: number;
    quantity: number;
    price: number;
    total_price: string;
    menu: { id: number; name: string; description: string; image: string; price: string; vendor_id: number; rating: number; category_id: number };
}
const showBin = (id:any) => {
    navigateTo(`/order/${id}`);
}
interface Order {
    id: number;
    user_id: number;
    vendor_id: number;
    total_price: string;
    status: string;
    user: { id: number; name: string; email: string; role: string; dristric_id: number };
    items: OrderItem[];
}

const data = ref<Order[]>([]);

const fetchOrders = async () => {
    try {
        const idUser = await $axios.get('auth/me');
        let params: { user_id?: string } = {};
        console.log(idUser.data.user.role)
        if (idUser.data.user.role !== 'admin') {
            params.user_id = idUser.data.user.id;
        }

        const response = await $axios.get('/order/getallorderuser', { params });

        data.value = response.data.map((order: Order) => ({
            ...order,
            name: order.user.name,
        }));

        console.log(data.value);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};


onMounted(fetchOrders);

const parsedOrderItems = (items: OrderItem[]) => items;

const statusClass = (status: string) => ({
    pending: "text-yellow-500 font-bold text-lg",
    completed: "text-green-500 font-bold text-lg",
    cancelled: "text-red-500 font-bold text-lg",
}[status] || "");

const statusIcon = (status: string) => ({
    pending: "fas fa-clock",
    completed: "fas fa-check",
    cancelled: "fas fa-times",
}[status] || "");

const handleAction = async (id: number) => {
    try {
        await $axios.put(`/order/status/${id}`, { status: 'completed' });
        await fetchOrders();
    } catch (error) {
        console.error('Error completing order:', error);
    }
};
const handleActionCancel = async (id: number) => {
    try {
        await $axios.put(`/order/status/${id}`, { status: 'cancelled' });
        await fetchOrders();
    } catch (error) {
        console.error('Error completing order:', error);
    }
};
</script>