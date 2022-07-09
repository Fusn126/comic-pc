<template>
  <div id="setting">
    <div class="setting-box setting-themecolor">
      <div class="setting-box__title">主题色配置</div>
      <ThemeColorEditor
        ref="themeColorEditorComp"
        :themes="dfThemes"
        @onColorChanged="onColorChanged"
      />
      <div class="setting-box__control">
        <el-button type="danger" round @click="resetThemeColor">重置</el-button>
        <el-button type="primary" round @click="saveThemeColor">保存</el-button>
      </div>
    </div>
    <div class="setting-box setting-config">
      <div class="setting-box__title">参数配置</div>
      <el-form ref="configFormComp" :model="config" :rules="configRules">
        <el-form-item label="服务器地址" prop="serverIp">
          <el-input
            v-model="config.serverIp"
            :style="hideStyle"
            placeholder="如：http://192.169.1.19:8002/"
          />
        </el-form-item>
      </el-form>

      <div class="setting-box__control">
        <el-button type="primary" round @click="saveServerIpConfig"
          >保存</el-button
        >
      </div>
    </div>
    <div class="setting-box setting-config">
      <div class="setting-box__title">资源配置</div>
      <el-form ref="configFormComp" :model="config" :rules="configRules">
        <el-form-item label="播放器实时进度小图标" prop="serverIp">
          <el-input
            v-model="config.staticResource.videoProgressCurIcon"
            placeholder="如：https://api.adicw.cn/uploads/UserAvatar/default.jpg"
          />
        </el-form-item>
      </el-form>

      <div class="setting-box__control">
        <el-button type="primary" round @click="aveStaticResourceConfig"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, reactive, ref } from 'vue'

import { getThemeInstance } from '@/theme/theme.class'

import ThemeColorEditor, {
  ThemeColorVar
} from './components/ThemeColorEditor.vue'
import { ElForm, ElNotification } from 'element-plus'
import { useSystemConfigStore } from '@/stores/systemConfig.store'
import { FormRulesMap } from 'element-plus/lib/components/form/src/form.type'
import { useIsDev } from '@/hooks/utils'

function themeColorModule() {
  const themeColorEditorComp = ref<InstanceType<typeof ThemeColorEditor>>()
  const dfThemes = getThemeInstance()!.current

  const onColorChanged = (param: ThemeColorVar[]) => {
    getThemeInstance()?.colorVarInit(param)
  }
  const saveThemeColor = () => {
    const theme = themeColorEditorComp.value!.getCurrnetTheme()
    getThemeInstance()?.saveLocalColor(theme)
    ElNotification({
      title: '主题配置',
      message: '主题保存成功',
      type: 'success'
    })
  }
  const resetThemeColor = () => {
    getThemeInstance()?.clearLocalColor()
    themeColorEditorComp.value!.reset()
  }

  return {
    themeColorEditorComp,
    onColorChanged,
    saveThemeColor,
    resetThemeColor,
    dfThemes
  }
}

function configModule() {
  const configFormComp = ref<InstanceType<typeof ElForm>>()
  const systemConfigStore = useSystemConfigStore()

  const config = reactive({
    serverIp: systemConfigStore.serverIp,
    staticResource: systemConfigStore.staticResource
  })
  const configRules: FormRulesMap = reactive({
    serverIp: [
      {
        trigger: 'blur',
        validator(rule, value, callback) {
          if (value) {
            callback()
          } else {
            callback(new Error('请检查地址格式'))
          }
        }
      }
    ]
  })
  const saveServerIpConfig = async () => {
    try {
      await configFormComp.value!.validate()
      systemConfigStore.saveServerIp(config.serverIp)
      // ElNotification({
      //   title: '参数配置',
      //   message: '参数保存成功',
      //   type: 'success'
      // })
      location.reload()
    } catch (e) {
      // console.log(e)
    }
  }
  const aveStaticResourceConfig = async () => {
    try {
      await configFormComp.value!.validate()
      systemConfigStore.saveServerIp(config.serverIp)
      // ElNotification({
      //   title: '参数配置',
      //   message: '参数保存成功',
      //   type: 'success'
      // })
      location.reload()
    } catch (e) {
      // console.log(e)
    }
  }
  return {
    config,
    configRules,
    saveServerIpConfig,
    configFormComp,
    aveStaticResourceConfig
  }
}

export default defineComponent({
  name: 'Setting',
  components: {
    ThemeColorEditor
  },
  setup() {
    const isDev = useIsDev().get()
    const hideStyle = computed(
      () =>
        ({
          opacity: isDev ? 0 : 1
        } as CSSProperties)
    )
    return {
      hideStyle,
      ...themeColorModule(),
      ...configModule()
    }
  }
})
</script>
<style lang="less" scoped>
#setting {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .setting-box {
    width: 100%;
    background: var(--box-bg-color);
    padding: 30px;
    box-sizing: border-box;
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
    margin-bottom: 30px;
    &__title {
      font-weight: 600;
      font-size: 20px;
      padding-bottom: 20px;
    }
    &__control {
      margin-top: 20px;
    }
  }
  // .setting-themecolor {
  // height: 400px;
  // }
  .setting-config {
    ::v-deep(.el-form) {
      width: 400px;
    }
  }
}
</style>
