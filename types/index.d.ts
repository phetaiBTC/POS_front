import { AxiosInstance } from 'axios';
import { I18n } from 'vue-i18n';

declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance;
    $i18n: I18n;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $i18n: I18n
    $t: I18n['t']
  }
}


export {};