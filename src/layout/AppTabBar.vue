<template>
  <div class="app-tab__bar">
    <div v-click-outside="() => (comiclistVisible = false)" class="comiclist">
      <Icon
        class="tool"
        :class="{ active: comiclistVisible }"
        name="history"
        @click="comiclistVisible = !comiclistVisible"
      />
      <AppTabBarComiclist v-model:visible="comiclistVisible" />
    </div>
    <div class="avatar">
      <BaseImg src="https://api.adicw.cn/uploads/UserAvatar/default.jpg" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import AppTabBarComiclist from './AppTabBarComiclist.vue'
export default defineComponent({
  name: 'AppTabBar',
  components: {
    AppTabBarComiclist
  },
  setup() {
    const comiclistVisible = ref(false)
    return {
      comiclistVisible
    }
  }
})
</script>
<style lang="less" scoped>
.app-tab__bar {
  position: fixed;
  right: 40px;
  top: 10px;
  display: flex;
  align-items: center;
  z-index: 8;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .tool {
    position: relative;
    display: flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    margin-right: 14px;
    cursor: pointer;
    color: var(--font-color);
    &::after {
      .mask(-1,var(--aside-bg-color));
      border-radius: 50%;
      opacity: 0.8;
    }
    &.active {
      color: var(--primary-color);
    }
  }
  .comiclist {
    position: relative;
    user-select: none;
  }
}
</style>
