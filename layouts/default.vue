<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div :class="['logo', collapsed ? 'collapsed' : '']">
                <img src="https://i.pinimg.com/236x/db/16/45/db1645cc1ed95625a5dff41ee9a0f164.jpg" alt="..." width="100"
                    class="rounded-full">
                <h1 class="text-[#fff]" style="margin: 5px 0 !important;" v-show="!collapsed">{{ userStore.user?.name }}
                </h1>
                <h1 class="text-[#fff]" v-show="!collapsed">{{ userStore.user?.email }}</h1>
                <!-- <h1 class="text-[#fff]" v-show="!collapsed">{{ userStore.user?.email }}</h1> -->
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <a-menu-item key="1">
                    <span class="anticon anticon-pie-chart">
                        <i class="fas fa-house-user text-[18px]"></i>
                    </span>
                    <span>
                        <nuxt-link to="/">{{ $t('header.home') }}</nuxt-link>
                    </span>
                </a-menu-item>
                <a-menu-item key="2">
                    <span class="anticon anticon-pie-chart">
                        <i class="fas fa-book-open  text-[18px]"></i>
                    </span>
                    <span>
                        <nuxt-link to="/menu">{{ $t('header.menu') }}</nuxt-link>
                    </span>
                </a-menu-item>
                <a-menu-item key="3" v-if="userStore.user?.roles.includes('admin')">

                    <span class="anticon anticon-pie-chart">
                        <i class="fas fa-pen-to-square  text-[20px] ml-[1px]"></i>
                    </span>
                    <span>
                        <nuxt-link to="/manage">{{ $t('header.manage') }}</nuxt-link>
                    </span>
                </a-menu-item>
                <a-menu-item key="4">
                    <span class="anticon anticon-pie-chart">
                        <i class="fas fa-cart-plus  text-[20px] ml-[1px]"></i>
                    </span>
                    <span>
                        <nuxt-link to="/order">{{ $t('header.order') }}</nuxt-link>
                    </span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <div class="w-full h-full flex justify-between px-[20px] items-center">
                    <h1>Shop</h1>
                    <div class="gap-[30px] flex ">
                        <i class="fas fa-bell text-[20px] text-pblue"></i>
                        <a-popover v-model:open="visible" :title="$t('header.setting')" trigger="click"
                            placement="bottomRight">
                            <template #content>
                                <div class="flex justify-between items-center mb-[10px]">
                                    <span>{{ $t('header.language') }}</span>
                                    <a-switch v-model:checked="state.checked1" checked-children="La"
                                        un-checked-children="En" />
                                </div>
                                <a-button type="primary" @click="showConfirm" class="w-full">Logout</a-button>
                            </template>
                            <i class="fas fa-gear text-[20px] text-pblue cursor-pointer"></i>
                        </a-popover>
                    </div>

                </div>
            </a-layout-header>
            <a-layout-content style="margin: 0 16px">
                <a-breadcrumb style="margin: 16px 0">
                    <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                        <nuxt-link :to="breadcrumb.path">{{ breadcrumb.name }}</nuxt-link>
                    </a-breadcrumb-item>
                </a-breadcrumb>
                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <slot />
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { useUserStore } from '~/store/useUserStore';
const userStore = useUserStore()
const { $axios } = useNuxtApp();
const profile = ref({
    name: '',
    email: ''
})
const token = useCookie('token')
const role = useCookie('role')
const { locale } = useI18n();
const state = reactive({
    checked1: true,
});
watch(
    () => state.checked1,
    (newValue) => {
        locale.value = newValue ? 'la' : 'en';
    },
);
const logout = async () => {
    $axios.post('/logout')
}
const showConfirm = () => {
    Modal.confirm({
        // title: t('modal.confirmTitle'),
        title: 'Are you sure?',
        content: createVNode('div', { style: 'color:red;' }, 'Are you sure?'),
        onOk() {
            console.log(token.value);
            token.value = null
            role.value = null
            logout()
            location.reload()
            // navigateTo('/auth')
        },
        onCancel() {
            console.log('Cancel');
        },
        class: 'test',
    });
};
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);

const route = useRoute();

const breadcrumbs = computed(() => {
    const pathSegments = route.path.split('/').filter((segment) => segment);
    const breadcrumbPaths = pathSegments.map((_, index) => ({
        name: pathSegments[index].charAt(0).toUpperCase() + pathSegments[index].slice(1),
        path: '/' + pathSegments.slice(0, index + 1).join('/'),
    }));
    return [{ name: 'Home', path: '/' }, ...breadcrumbPaths];
});
const visible = ref<boolean>(false);

</script>

<style scoped>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}

.logo {
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: all 0.3s ease;
    overflow: hidden;
}

.logo.collapsed {
    height: 80px;
}

.logo img {
    transition: all 0.3s ease;
}

.logo.collapsed img {
    width: 50px;
}

.logo h1 {
    margin: 0;
    font-size: 16px;
    transition: all 0.3s ease;
}
</style>