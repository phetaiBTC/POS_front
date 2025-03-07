<template>
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-center mb-6">Add Product</h2>
        <form @submit.prevent="submitForm">
            <!-- Product Name -->
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
                <input v-model="form.name" type="text" id="name"
                    class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required />
            </div>

            <!-- Price -->
            <div class="mb-4">
                <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
                <input v-model="form.price" type="number" id="price"
                    class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required />
            </div>

            <!-- Description -->
            <div class="mb-4">
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea v-model="form.description" id="description" rows="3"
                    class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
            </div>
            <div class="mb-4">
                <label for="image" class="block text-sm font-medium text-gray-700">Product Image</label>
                <input type="file" @change="handleFileUpload"
                    class="w-full mt-2 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div class="flex justify-center mt-6">
                <button type="submit"
                    class="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">Add
                    Product</button>
            </div>
        </form>

        <p v-if="message" class="mt-4 text-center text-lg text-gray-700">{{ message }}</p>
    </div>

    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }" class="mt-8">
        <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'no'">
                <h1 class="text-center">
                    {{ index + 1 }}
                </h1>
            </template>
            <template v-if="column.key === 'status'">
                <div class="flex items-center w-full">
                    <img v-if="record.image" :src="record.image" alt="..." class="w-10 h-10 mr-2">
                    <h1>{{ record.name }}</h1>
                </div>
            </template>
            <template v-if="column.key === 'operation'">
                <div class="flex gap-2 w-full h-full justify-center items-center">
                    <a-button type="primary" @click="handleEdit(record.id)">Edit</a-button>
                    <a-button type="primary" danger ghost @click="handleDelete(record.id)">Danger</a-button>
                </div>
            </template>
        </template>
    </a-table>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/store/useUserStore";
import type { TableColumnsType } from 'ant-design-vue';

const userStore = useUserStore()
const { $axios } = useNuxtApp();

const columns: TableColumnsType = [
    { title: 'No', width: 100, key: 'no', fixed: 'left' },
    { title: 'name', width: 100, dataIndex: 'name', key: 'status', fixed: 'left' },
    { title: 'price', dataIndex: 'price', key: '1', width: 150 },
    { title: 'description', dataIndex: 'description', key: '4', width: 150 },
    { title: 'vendor', dataIndex: 'vendor_name', key: '6', width: 150 },
    { title: 'vendor id', dataIndex: 'vendor_id', key: '7', width: 150 },
    { title: 'created at', dataIndex: 'created_at', key: '2', width: 150 },
    { title: 'updated at', dataIndex: 'updated_at', key: '3', width: 150 },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 150,
    },
];
interface Product {
    name: string;
    price: number;
    description: string;
    image: File | string | null; // Allow null here
}
const form = ref<Product>({
    name: "",
    price: 0,
    description: "",
    image: ""
});
interface DataItem {
    id: number;
    name: number;
    description: string;
    image: string;
    created_at: string;
    updated_at: string;
    price: string;
    vendor_id: number;
    vendor_name: string;
}
const data = ref<DataItem[]>([]);

const message = ref("");
// Handle file upload
const handleFileUpload = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
        form.value.image = fileInput.files[0];
        console.log(form.value.image);
    }
};
// Submit form to create a new product
const submitForm = async () => {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("price", form.value.price.toString());
    formData.append("description", form.value.description);
    formData.append("vendor_id", userStore.user?.vendor_id.toString() || "");
    if (form.value.image) {
        formData.append("images[]", form.value.image);
    }
    try {
        console.log(form.value)

        const response = await $axios.post("/menu-item", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        message.value = "add product successfully";
        // router.push("/menu");
    } catch (error: any) {
        message.value = error.response?.data?.message || "Failed to create product.";
        console.error(error);
    }
};
const getItem = async () => {
    try {
        const response = await $axios.get("/menu-item");
        data.value = response.data;
    } catch (error) {
        console.error(error);
    }
};
onMounted(() => {
    getItem();
});
const handleEdit = (id: number) => {
    navigateTo(`/manage/${id}`);
}
const handleDelete = async (id: number) => {
    try {
        await $axios.delete(`/menu-item/${id}`);
        location.reload();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
</script>

<style scoped>
.container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 12px;
}

button {
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #38a169;
}
</style>