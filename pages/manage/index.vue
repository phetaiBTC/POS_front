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

            <!-- Category -->
            <div class="mb-4">
                <label for="category_id" class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="form.category_id" id="category_id"
                    class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required>
                    <option value="" disabled>Select Category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
                    </option>
                </select>
            </div>

            <div class="mb-4">
                <label for="category_id" class="block text-sm font-medium text-gray-700">Vendor</label>
                <select v-model="form.vendor_id" id="category_id"
                    class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required>
                    <option value="" disabled>Select Vendor</option>
                    <option v-for="vendor in vendors" :key="vendor.id" :value="vendor.id">{{ vendor.name }}</option>
                </select>
            </div>

            <!-- Image Upload -->
            <div class="mb-4">
                <label for="image" class="block text-sm font-medium text-gray-700">Product Image</label>
                <input type="file" @change="handleFileUpload"
                    class="w-full mt-2 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center mt-6">
                <button type="submit"
                    class="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">Add
                    Product</button>
            </div>
        </form>

        <p v-if="message" class="mt-4 text-center text-lg text-gray-700">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware:'auth'
})
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const { $axios } = useNuxtApp();
interface Product {
    name: string;
    price: number;
    description: string;
    category_id: number;
    image: File | string | null; // Allow null here
    vendor_id: number;
}

const form = ref<Product>({
    name: "",
    price: 0,
    description: "",
    category_id: 0,
    image: "",
    vendor_id: 0
});

interface Category {
    id: number;
    name: string;
}
interface Vendor {
    id: number;
    name: string;
}
const categories = ref<Category[]>();
const vendors = ref<Vendor[]>([]);
const message = ref("");
const router = useRouter();

const fetchCategories = async () => {
    try {
        const response = await $axios.get("/category/getall");
        categories.value = response.data;
    } catch (error) {
        console.error(error);
        message.value = "Failed to fetch categories.";
    }
};
const fetchVendors = async () => {
    try {
        const response = await $axios.get("/vendor/getall"); // Your API to fetch categories
        vendors.value = response.data.data;
    } catch (error) {
        console.error(error);
        message.value = "Failed to fetch categories.";
    }
};

onMounted(() => {
    fetchCategories();
    fetchVendors();
});

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
    formData.append("category_id", form.value.category_id ? form.value.category_id.toString() : "");
    formData.append("vendor_id", form.value.vendor_id ? form.value.vendor_id.toString() : "");


    if (form.value.image) {
        formData.append("image", form.value.image);
    }

    try {
        const response = await $axios.post("http://127.0.0.1:8000/api/menu/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Important for file uploads
            },
        });
        message.value = response.data.message; // Success message from API
        router.push("/menu"); // Redirect after successful submission
    } catch (error: any) {
        message.value = error.response?.data?.message || "Failed to create product.";
        console.error(error);
    }
};
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