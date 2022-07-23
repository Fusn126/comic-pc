<template>
  <div v-if="detail" v-show="loaded" class="pixiv-content__item">
    <img :src="detail.preurl" @load="loaded = true" />
    <div v-if="detail.total > 1" class="total">
      <b>{{ detail.total }}</b>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComicSearchItem } from '@/api'
import { ref } from 'vue'
withDefaults(
  defineProps<{
    detail: ComicSearchItem | null
  }>(),
  {
    detail: null
  }
)
const loaded = ref(false)
</script>
<style lang="less" scoped>
.pixiv-content__item {
  position: relative;
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
    background: #def;
  }

  &:hover {
    img {
      box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
      transform: scale(0.98);
    }
  }

  .total {
    position: absolute;
    right: 20px;
    top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.9);
    font-size: 18px;
    font-variant-numeric: tabular-nums;
  }
}
</style>
