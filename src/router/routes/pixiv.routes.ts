import { WEB_NAME } from '@/common/static'

const Pixiv = () => import('@/views/Pixiv/Index.vue')
export default {
  path: '/pixiv',
  name: 'Pixiv',
  component: Pixiv,
  meta: {
    title: WEB_NAME + '-Pixiv'
    // elName: '#pixiv'
  },
  children: []
}
