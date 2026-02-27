<template>
  <section class="identity-container" ref="containerRef">
    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Content Layer -->
    <div class="layer-content" :class="{ 'content-hidden': isLoading }">
      <div class="identity-wrapper">
        <!-- 1. Title Group (First) -->
        <h1 class="main-title stagger-item" style="--i: 1;"><span class="relic-text">I am Relic</span><br><span
            class="blue-text">I am Ark</span></h1>

        <!-- 2. Profile Tag & Details (Second) -->
        <div class="profile-header stagger-item" style="--i: 8;">
          <div class="h-line-anim"></div>
          <span class="header-tag">Profile Authenticated</span>
        </div>

        <div class="detail-grid">
          <div class="detail-left">
            <div class="detail-item group stagger-item" style="--i: 9;">
              <div class="icon-wrap">[MONITOR]</div>
              <div>
                <p class="detail-sub">Status / Objective</p>
                <p class="detail-main">JUFE Sophomore / Kaggle Preparing</p>
              </div>
            </div>

            <div class="detail-item group stagger-item" style="--i: 10;">
              <div class="icon-wrap">[MUSIC]</div>
              <div>
                <p class="detail-sub">Artist IN</p>
                <p class="detail-main">Animenz-Style-Pianist</p>
              </div>
            </div>
          </div>

          <div class="detail-right">
            <div class="signature-box stagger-item" style="--i: 11;">
              <p class="sig-label">Signature</p>
              <p class="sig-val" style="font-family: 'Noto Sans SC', serif;">清棫</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { preloadResources } from '@/utils/resourceLoader';
import { hasInitialLoaded } from '@/utils/globalState';

// Preload Contact asset images
// Assuming images are in src/views/Contact and using explicit relative paths
import contactBackscene from '@/views/Contact/backscene.png';
import contactGithubIcon from '@/views/Contact/githubicon.png';
import contactDesktop from '@/views/Contact/desktop.png';
import contactGame from '@/views/Contact/game.png';
import contactVinyl from '@/views/Contact/vinyl.png';
import contactLetter from '@/views/Contact/letter.png';

const isLoading = ref(!hasInitialLoaded.value);
const progress = ref(0);
const containerRef = ref(null);

// 定义资源清单 (请替换为你项目中真实的路径)
const resources = [
  // 关键图片 - Preload Contact Page Images
  { type: 'image', url: contactBackscene },
  { type: 'image', url: contactGithubIcon },
  { type: 'image', url: contactDesktop },
  { type: 'image', url: contactGame },
  { type: 'image', url: contactVinyl },
  { type: 'image', url: contactLetter },

  // 关键音频 (预加载这些可以让播放时不卡顿)
  // { type: 'audio', url: '/music/song1.mp3' }, 

  // 关键页面组件 (路由预热)
  { type: 'component', importFn: () => import('@/views/Projects/Index.vue') },
  { type: 'component', importFn: () => import('@/views/Blog/Index.vue') },
  { type: 'component', importFn: () => import('@/views/Music/Index.vue') },
  { type: 'component', importFn: () => import('@/views/Contact/Index.vue') },

  // 占位符 (为了演示效果，如果资源很少，进度条太快，可以加几个占位)
  { type: 'dummy' }, { type: 'dummy' }, { type: 'dummy' }
];

onMounted(async () => {
  const container = containerRef.value;

  // 每次进入先清理旧的动画类名，确保视差动画可以重新触发
  if (container) {
    container.classList.remove('animate-entry');
  }

  // 逻辑分流：判断是否是初次加载网站
  if (!hasInitialLoaded.value) {
    // 场景 A：初次进入，执行完整加载流程
    isLoading.value = true;
    progress.value = 0;

    try {
      // 执行真实预加载
      await preloadResources(resources, (p) => {
        progress.value = p;
      });

      // 加载完成，稍作停留展示 100%
      setTimeout(() => {
        finishLoading(true);
      }, 500);

    } catch (e) {
      console.error("Loading failed", e);
      finishLoading(true); // 出错也要进系统
    }
  } else {
    // 场景 B：从其他页面切回来
    // 直接跳过预加载，直接触发进场动画
    finishLoading(false);
  }
});

function finishLoading(isFirstTime) {
  const container = containerRef.value;

  if (isFirstTime) {
    hasInitialLoaded.value = true; // 修改全局状态
  }
  
  isLoading.value = false;
  // sessionStorage.setItem('hasVisited', 'true'); // 不需要再记录
  if (container) {
    // 延迟一小会儿确保 DOM 更新后再添加动画类
    setTimeout(() => {
      container.classList.add('animate-entry');
    }, 50);
  }
}
</script>

<style scoped>
.blue-text {
  color: #22d3ee;
}

.relic-text {
  color: #888888;
}

/* 新增：Loading 样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0a0a;
  /* 与背景色一致 */
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Vue <transition> 的内置类名控制淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-content {
  width: 300px;
  /* 居中对齐 */
  margin: 0 auto; 
}


.progress-bar-track {
  width: 100%;
  height: 2px;
  background: rgba(34, 211, 238, 0.2);
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: #22d3ee;
  width: 0%;
  transition: width 0.2s linear;
  box-shadow: 0 0 10px #22d3ee;
}



/* 控制内容显示的辅助类 */
.content-hidden {
  opacity: 0;
}

.identity-container {
  min-height: 80vh;
  height: 100%;
  position: relative;
  overflow: hidden;
  /* Default state handled by items */
}

/* Stagger Animation System */
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* When container has 'animate-entry', trigger children */
.identity-container.animate-entry .stagger-item {
  opacity: 1;
  transform: translateY(0);
  transition-delay: calc(var(--i) * 0.1s);
  /* Speed up base logic slightly */
}

/* 1. Title appears FIRST (Solo) */
/* Instant or very fast */
.identity-container.animate-entry .main-title.stagger-item {
  transition-delay: 0.1s;
}

/* 2. Figure 2 Content - Layered Stagger */
/* Profile Header (Top of Fig 2) */
/* Shorter Gap: 0.8s -> 0.5s */
.identity-container.animate-entry .profile-header.stagger-item {
  transition-delay: 0.5s !important;
}

/* Left Column Details (Monitor, Music) */
.identity-container.animate-entry .detail-left .stagger-item:nth-child(1) {
  transition-delay: 0.7s !important;
}

.identity-container.animate-entry .detail-left .stagger-item:nth-child(2) {
  transition-delay: 0.9s !important;
}

/* Right Column (Signature) */
.identity-container.animate-entry .signature-box.stagger-item {
  transition-delay: 1.1s !important;
}

/* ... existing styles ... */

.identity-container.page-leaving .page-exit-item {
  opacity: 0;
  transform: translateY(-30px);
}

.layer-content {
  display: flex;
  align-items: center;
  padding: 0 24px;
}

@media (min-width: 1024px) {
  .layer-content {
    padding: 0 96px;
  }
}

.identity-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
}

@media (min-width: 1024px) {
  .identity-wrapper {
    width: 66.66%;
  }
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.h-line-anim {
  height: 2px;
  width: 48px;
  background-color: #22d3ee;
}

.header-tag {
  font-size: 12px;
  letter-spacing: 0.5em;
  color: #22d3ee;
  font-weight: 500;
  text-transform: uppercase;
}

.main-title {
  font-size: 72px;
  font-weight: 500;
  font-style: normal;
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: 32px;
  margin-top: 0;
  text-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@media (min-width: 1024px) {
  .main-title {
    font-size: 160px;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 40px;
}

@media (min-width: 768px) {
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.detail-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.icon-wrap {
  color: #22d3ee;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  min-width: 85px;
  /* Ensure alignment between items */
}

.detail-sub {
  font-size: 10px;
  opacity: 0.4;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
  margin-top: 0;
}

.detail-main {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1em;
  margin: 0;
}

.detail-right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  text-align: right;
}

.signature-box {
  background: transparent;
  border-left: 2px solid #22d3ee;
  padding: 24px;
  width: 100%;
  backdrop-filter: none;
}

@media (min-width: 768px) {
  .signature-box {
    width: 288px;
  }
}

.sig-label {
  font-size: 9px;
  opacity: 0.4;
  margin-bottom: 8px;
  letter-spacing: 0.1em;
  margin-top: 0;
}

.sig-val {
  font-size: 20px;
  font-family: monospace;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: #22d3ee;
  margin: 0;
}

.background-text {
  position: absolute;
  bottom: -5%;
  right: 0;
  pointer-events: none;
  opacity: 0.03;
  user-select: none;
}

.background-text h2 {
  font-size: 25vw;
  font-weight: 500;
  font-style: normal;
  line-height: 1;
  margin: 0;
}
</style>
