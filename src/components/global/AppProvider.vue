<template>
  <!-- <n-config-provider> -->
    <!-- <n-loading-bar-provider> -->
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <slot></slot>
            <NaiveProviderContent />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    <!-- </n-loading-bar-provider> -->
  <!-- </n-config-provider> -->
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import {  useDialog, useMessage, useNotification } from 'naive-ui'
// import { 
//     NaivePiniaComposition
// } from '@/store/global/index'
// const NaivePinia=NaivePiniaComposition()

// NaivePinia.setUseMessage(useMessage())
// NaivePinia.setUseNotification(useNotification())

// // 挂载naive组件的方法至window, 以便在全局使用
function setupNaiveTools() {
  window.$dialog = useDialog()
  window.$notification=useNotification()
  window.$message=useMessage()
}

const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools()
  },
  render() {
    return h('div')
  },
})
</script>
