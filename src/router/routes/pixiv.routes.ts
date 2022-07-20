import { WEB_NAME } from '@/common/static'

const Pixiv = () => import('@/views/Pixiv/Index.vue')
const PixivMain = () => import('@/views/Pixiv/Routes/PixivMain/Index.vue')
export default {
  path: '/pixiv',
  name: 'Pixiv',
  component: Pixiv,
  meta: {
    title: WEB_NAME + '-Pixiv'
    // elName: '#pixiv'
  },
  children: [
    {
      path: 'pixiv-main/:id',
      name: 'PixivMain',
      component: PixivMain,
      props: true,
      meta: {
        title: WEB_NAME + '-图片详情'
      }
    }
  ]
}
