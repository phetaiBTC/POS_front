<template>
    <div
        class="flex justify-center items-center bg-[#fff] w-[700px] h-[400px] relative rounded-2xl overflow-hidden shadow-blue-800 shadow-2xl">
        <div class="h-full flex w-[1050px] absolute transition-all duration-500 ease-in-out"
            :style="move ? 'left: 0' : 'left: -350px'">
            <div class="h-full w-1/3 flex flex-col justify-between items-center p-6">
                <div class="flex flex-col pt-10">
                    <h1 class="text-3xl font-semibold text-center">Login</h1>
                    <FloatingLabelInput v-model="datalogin.email" type="email" label="Email" width="w-64"
                        icon="fas fa-user" />
                    <FloatingLabelInput v-model="datalogin.password" type="password" label="password" width="w-64"
                        icon="fas fa-lock" />
                    <div class="flex justify-between items-center w-64">
                        <a-checkbox v-model:checked="checked">Remember me</a-checkbox>
                        <nuxt-link to="" class="text-[12px] cursor-pointer">Forgot password</nuxt-link>
                    </div>
                </div>
                <div class="flex flex-col justify-center items-center gap-2">
                    <a-button type="primary" class="w-64" @click="Login">Sign in</a-button>
                    <span class="text-[12px] flex-wrap flex gap-1">don't have an account?<h1
                            class="cursor-pointer text-blue-500 underline" @click="move = !move">Register</h1></span>
                </div>
            </div>

            <div class="h-full w-1/3 flex justify-center items-center">
                <img src="https://i.pinimg.com/736x/d4/8f/56/d48f565585885798b493885eb3c479d2.jpg" alt=""
                    class="w-full h-full">
            </div>
            <div class="h-full w-1/3 flex flex-col justify-between items-center p-6">
                <div class="flex flex-col">
                    <h1 class="text-3xl font-semibold text-center">Register</h1>
                    <FloatingLabelInput v-model="dataregister.username" type="text" label="Username" width="w-64"
                        icon="fas fa-user" />
                    <FloatingLabelInput v-model="dataregister.email" type="email" label="Email" width="w-64"
                        icon="fas fa-envelope" />
                    <FloatingLabelInput v-model="dataregister.password" type="password" label="password" width="w-64"
                        icon="fas fa-lock" />
                    <FloatingLabelInput v-model="dataregister.password_confirm" type="password" label="password confirm"
                        width="w-64" icon="fas fa-lock" />
                    <FloatingLabelInput v-model="dataregister.phone" type="text" label="Phone"
                        width="w-64" icon="fas fa-phone" />
                    <!-- <div class="flex justify-between items-center w-64">
                        <a-checkbox v-model:checked="checked">Agree to terms</a-checkbox>
                    </div> -->
                </div>
                <div class="flex flex-col justify-center items-center gap-2">
                    <a-button type="primary" class="w-64" @click="Register()">Sign up</a-button>
                    <span class="text-[12px] flex-wrap flex gap-1">Already have an account?<h1
                            class="cursor-pointer text-blue-500 underline" @click="move = !move">Login</h1></span>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">

const { $axios } = useNuxtApp();

const errorValidate = ref('')
definePageMeta({
    layout: 'auth',
    name: 'auth'
})
const datalogin = reactive({
    email: "phetaidev@gmail.com",
    password: "password"
})

const dataregister = reactive({
    username: "customer",
    email: "phetaibtc@gmail.com",
    password: "aBC123!@#",
    password_confirm: "aBC123!@#",
    phone: "0123456789"
})
const checked = ref(false);
const move = ref(true);
const Login = async () => {
    try {
        const response = await $axios.post('/login', {
            email: datalogin.email,
            password: datalogin.password
        });
        if (response.data?.token) {
            const token = useCookie('token');
            token.value = response.data.token;
            navigateTo('/');
        } else {
            console.error('Login failed: No token received');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
};

const Register = async () => {
    try {
        const response = await $axios.post('/register', {
            name: dataregister.username,
            email: dataregister.email,
            password: dataregister.password,
            password_confirmation: dataregister.password_confirm,
            phone: dataregister.phone,
            avatar:""
        });
        alert('register successful' + response.data)
        navigateTo('/');

    } catch (error: any) {
        console.error('register : ', error.response.data.message);
        errorValidate.value = error.response.data.message
        alert(errorValidate.value)
    }
    navigateTo('/');
}
</script>

<style scoped></style>