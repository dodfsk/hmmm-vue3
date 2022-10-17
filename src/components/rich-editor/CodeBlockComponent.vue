<template>
    <node-view-wrapper class="code-block">
      <select contenteditable="false" v-model="selectedLanguage">
        <option :value="null">
          auto
        </option>
        <option disabled>
          —
        </option>
        <option v-for="(language, index) in languages" :value="language" :key="index">
          {{ language }}
        </option>
      </select>
      <pre><code><node-view-content /></code></pre>
    </node-view-wrapper>
  </template>
  

<script lang="ts" setup>
import { computed,onMounted, ref } from 'vue';
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
  
const props=defineProps(nodeViewProps)
const selectedLanguage=computed({
    get:()=>{
        return props.node.attrs.language
    },
    set:(language:any)=> {
        props.updateAttributes({ language })
    }
})
const languages=ref(props.extension.options.lowlight.listLanguages())//踩坑,原因不明的全部列出

</script>

  
  <style lang="less">
  .code-block {
    position: relative;
  
    select {
      position: absolute;
      top: 0.3rem;
      right: 0.5rem;
      border-radius: 0.2rem;
    }
  }
  </style>
  