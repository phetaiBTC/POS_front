<template>
    <div>
        <h1>Payment</h1>
    </div>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp();
const route = useRoute();
const id = route.params.id
const changeStatus = async () => {
    try {
        await $axios.put(`/payment/${id}`);
        navigateTo('/order');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
onMounted(() => {
    changeStatus()
})
</script>

<style scoped></style>