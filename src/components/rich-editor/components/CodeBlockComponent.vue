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
      <pre><code :language="props.node.attrs.language"><node-view-content /></code></pre>
    </node-view-wrapper>
  </template>
  

<script lang="ts" setup>
import { computed,ref } from 'vue';
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
console.log(props.node.attrs);

</script>

  
  <style lang="less">
  .code-block {
    position: relative;

    select {
    //   display: none;
      position: absolute;
      top: 0.3rem;
      right: 0.5rem;
      border-radius: 0.2rem;
      user-select: none;
    }
  }
  .code-block:hover{
    select{
        display: block;
    }
  }
  </style>
  