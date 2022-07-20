<template>
  <div v-if="detail" class="pixiv-content__item">
    <img :src="detail.preurl" />
  </div>
</template>

<script lang="ts" setup>
import { GetComicImglistReturn } from '@/api'
import { onMounted } from 'vue'
const props = withDefaults(
  defineProps<{
    detail: GetComicImglistReturn[0] | null
  }>(),
  {
    detail: null
  }
)
// onMounted(() => {
//   console.log(props.detail?.id, 'in')
// })
</script>
<style lang="less" scoped>
.pixiv-content__item {
  width: 100%;
  animation: identifier 0.25s;
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
    padding: 0 8px;
    box-sizing: border-box;
    width: 100%;
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
