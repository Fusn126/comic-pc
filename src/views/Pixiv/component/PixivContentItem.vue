<template>
  <div v-if="detail" class="pixiv-content__item">
    <img :src="detail.preurl" />
  </div>
</template>

<script lang="ts" setup>
import { GetComicImglistReturn } from '@/api'
withDefaults(
  defineProps<{
    detail: GetComicImglistReturn[0] | null
  }>(),
  {
    detail: null
  }
)
</script>
<style lang="less" scoped>
.pixiv-content__item {
  width: 100%;
  height: 100%;
  animation: identifier 0.25s;
  padding: 12px;
  box-sizing: border-box;
  @keyframes identifier {
    from {
      opacity: 0;
      transform: translateY(50%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 14px;
    transition: all 0.25s;
    cursor: pointer;
  }

  &:hover {
    img {
      box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
      transform: scale(0.98);
    }
  }
}
</style>
