<template>
  <div class="app-contain">
    <AppTabBar />
    <aside class="app-contain__aside" :class="{ hide: !asideVisible }">
      <div
        class="switch"
        :title="asideVisible ? '隐藏' : '展开'"
        @click="asideVisible = !asideVisible"
      ></div>
      <b v-show="asideVisible" class="animate__jello">{{ WEB_NAME }}</b>
      <AppAsideBar v-show="asideVisible" />
    </aside>
    <main class="app-contain__main">
      <AppRouter />
    </main>
  </div>
</template>

<script lang="ts" setup>
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js'
import { ref } from 'vue'

import AppAsideBar from '@/layout/AppAsideBar.vue'
import AppRouter from '@/layout/AppRouter.vue'
import AppTabBar from '@/layout/AppTabBar.vue'

import { WEB_NAME } from './common/static'
import { useIsDev } from './hooks/utils'
import { useSystemConfigStore } from './stores/systemConfig.store'

const systemConfigStore = useSystemConfigStore()
systemConfigStore.init()

const { isDev } = useIsDev()

const asideVisible = ref(true)
</script>

<style lang="less">
@import '~styles/common';
@import '~styles/app';
</style>

<style lang="less" scoped>
@import '~styles/var';
.app-contain {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background: var(--bg-color);
  color: var(--font-color);
  @slideDruation: 0.625s;
  &__aside {
    display: flex;
    flex-direction: column;
    width: 280px;
    height: calc(100% - @frameTop*2);
    background: var(--aside-bg-color);
    border-radius: var(--df-radius);
    padding-left: @frameTop;
    box-sizing: border-box;
    animation: slide-in @slideDruation forwards;
    transition: all 0.25s;
    &.hide {
      width: 80px;
    }
    & > b {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      aspect-ratio: 2/1;
      font-size: 30px;
      animation-duration: 1.25s;
      animation-delay: @slideDruation;
    }
    .switch {
      position: absolute;
      top: 0;
      right: 8px;
      bottom: 0;
      margin: auto 0;
      width: 20px;
      height: 100px;
      cursor: pointer;
      &::before {
        .mask(1,var(--font-color));
        right: 0;
        margin: 0 auto;
        width: 5px;
        height: 100%;
        border-radius: 20px;
        opacity: 0.6;
        transition: all 0.25s;
      }
      &:hover::before {
        opacity: 0.8;
      }
    }
    @keyframes slide-in {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(-@frameTop);
      }
    }
  }
  &__main {
    margin-top: @frameTop;
    box-sizing: border-box;
    height: calc(100% - @frameTop);
    flex: 1;
    overflow: hidden;
    position: relative;
    opacity: 0;
    animation: fade-in 1s @slideDruation forwards;
    @keyframes fade-in {
      to {
        opacity: 1;
      }
    }
  }
}
</style>
