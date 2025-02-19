<template>
    <a-col :span="8" class="my-4">
        <div class="m-2 rounded-2xl p-6 bg-white hover:scale-102 transition duration-100 relative overflow-hidden">
            <i class="fas fa-xmark absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-2xl" @click="deleteP(id)"
                v-if="role == 'admin'"></i>
            <img :src="image" :alt="name" class="rounded mb-2 aspect-[1/0.8]" width="100%" @click="detilies">
            <div class="flex flex-col gap-2">
                <h1 class="text-[18px] font-bold">{{ name }}</h1>
                <p class="text-[12px] h-[30px] overflow-hidden line-clamp-2">{{ description }}</p>
                <div class="flex justify-between items-center">
                    <h1 class="text-[18px] font-semibold text-green-600">
                        <!-- <i class="fas fa-dollar-sign mr-1"></i>{{ formattedPrice }} Kip -->
                        ລາຄາ : {{ formattedPrice }} Kip
                    </h1>
                    <a-rate v-model:value="props.rating" disabled />
                </div>
                <div class="flex justify-between items-center">
                    <a-input-number v-model:value="amount" :min="1" class="w-24">
                        <template #addonBefore>
                            <i class="fas fa-arrow-up-from-bracket"></i>
                        </template>
                    </a-input-number>
                    <a-button type="primary" @click="addToCart">Add to cart</a-button>
                </div>
            </div>
        </div>
    </a-col>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from "vue";
const { $axios } = useNuxtApp()
// const r = ref(5)
const props = defineProps({
    id: Number,
    name: String,
    description: String,
    price: String,
    image: String,
    rating: Number
});
const role = useCookie('role')
const amount = ref(1);
const emit = defineEmits(["add-to-cart"]);

const addToCart = () => {
    emit("add-to-cart", {
        menu_id: props.id,
        quantity: amount.value,
        name: props.name,
        price: props.price,
    });
};
const detilies = () => {
    navigateTo(`/menu/${props.id}`);
}

// const formattedPrice = computed(() => (props.price ?? 0)*amount.value.toLocaleString("en-US"));
const formattedPrice = computed(() => {
    const price = parseFloat(props.price ?? "0") || 0;
    return (price * amount.value).toLocaleString("en-US");
})
const deleteP = async (id: any) => {
    console.log(id)
    await $axios.delete(`/menu/${id}`)
    location.reload()
}
// console.log(props.rating);
</script>

<style scoped></style>
