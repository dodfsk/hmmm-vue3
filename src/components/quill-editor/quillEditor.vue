<template>
<QuillEditor
    ref="quillEditorRef"
    v-bind="$attrs"
    :contentType="contentType"
    :options="editorOption"
>
    <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots" >
        <slot :name="slotName" v-bind="slotProps"></slot>
    </template>

    <template #toolbar class="my-toolbar">
      <div class="my-toolbar">
        </div>
    </template>

</QuillEditor>
</template>

<script setup lang='ts'>
import {  computed,inject,onMounted,Ref,ref,useAttrs,useSlots } from 'vue';
import  { QuillEditor }  from '@vueup/vue-quill' 
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

export type DefineExpose={
    quillEditorRef:InstanceType<typeof QuillEditor>,
}
type Props={
    contentType?:"delta" | "html" | "text"
}
type Emits={
    // (e: 'functionName', value: any): void
}

const props=withDefaults(defineProps<Props>(),{
    contentType:'html',
})
const emits=defineEmits<Emits>()
const {contentType}=props
hljs.configure({
    languages:['javascript','typescript','ruby','python','java']
})
const toolbarOptions = [
  [{ 'font': [] },{ 'size': ['small', false, 'large', 'huge'] },{ 'header': [1, 2, 3, 4, 5, 6, false] }],//下拉选择
  [{ 'color': [] }, { 'background': [] }],          // 文字颜色  背景颜色
  ['bold', 'italic', 'underline', 'strike'],        // 切换按钮
  [ 'code-block','blockquote'],     //  代码块,引用
  ['image', 'video','link'],          // 图片 视频  超链接

[{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'align': [] },{ 'direction': 'rtl' }],             // 列表    对齐方式    文本方向 

  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  ['clean']                                         // remove formatting button
//   [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
];
const editorOption= {
    modules: {
        toolbar:toolbarOptions,
        syntax: {
            highlight: (text:string) => {
                return hljs.highlightAuto(text).value // 这里就是代码高亮需要配置的地方
            }
        }
    }
}


const quillEditorRef=ref()

onMounted(() => {
})

// const quillChange=()=>{
//     console.log(quillContent.value);
// }

// const quillReady=()=>{
//     console.log('quill-editor is ready');
    console.log('useAttrs',useAttrs());
    console.log('useSlots',useSlots());    
//     @textChange="quillChange()"
//     @ready="quillReady"
// }

defineExpose({
    quillEditorRef,
})


</script>

<script lang="ts">

</script>

<style lang='less' >
    // p {
    //   margin: 10px;
    // } 
    .ql-toolbar.ql-snow {
        text-align: left !important
    }
    .ql-container.ql-snow{
        min-height: 300px;
        height: 50vh;
    }

    // .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    // .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    //   content: "14px";
    // }
    // .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
    // .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    //   content: "10px";
    // }
    // .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
    // .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    //   content: "18px";
    // }
    // .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
    // .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    //   content: "32px";
    // }

     
    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
      content: "文本";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
      content: "标题1";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
      content: "标题2";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
      content: "标题3";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
      content: "标题4";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
      content: "标题5";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
      content: "标题6";
    }
/*      
    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
      content: "标准字体";
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
      content: "衬线字体";
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
      content: "等宽字体";
    } */
    </style>