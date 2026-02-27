import { ref } from 'vue';

// 记录整个应用是否已经完成过初始的资源加载
export const hasInitialLoaded = ref(false);
