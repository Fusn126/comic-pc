import { createPinia } from 'pinia'
import { createApp } from 'vue'
import router from './router'

import { directs } from '@/utils/vue/directs'
import App from './App.vue'

import { createComicFav } from '@/class/comicFav.class'
import { createPlayHistory } from '@/class/playHistory.class'
import { createPlayProgress } from '@/class/playProgress.class'
import { createPreloadCdn } from '@/plugins/preloadCdn.class'
import { createVueInit } from '@/utils/vue/index'
import moment from 'moment'
import { elementPlusInit } from './plugins/elementPlus'
import { createTheme } from './theme/theme.class'

createPreloadCdn()
createTheme()
createPlayProgress().getStore()
createPlayHistory().getStore()
createComicFav().getStore()

const app = createApp(App)
app.config.globalProperties.$moment = moment

app.use(createPinia())
elementPlusInit(app)
createVueInit(app).useDirects(directs).useComps()
app.use(router).mount('#app')

window.addEventListener('unhandledrejection', (e) => {
  e.preventDefault()
})
