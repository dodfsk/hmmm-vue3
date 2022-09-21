<template>
    <div class="contianer">
        <QuillEditor ref="quill" v-bind="$attrs" :contentType="contentType" :options="editorOption">
            <!-- <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots" >
            <slot :name="slotName" v-bind="slotProps"></slot>
        </template> -->
            <!-- :content="content" -->

            <template #toolbar class="my-toolbar">
                <div class="my-toolbar"></div>
            </template>
        </QuillEditor>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, Ref, toRefs, ref, useAttrs, useSlots, watch, reactive } from 'vue';
import { QuillEditor, Quill } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

import ResizeModule from '@ssumo/quill-resize-module';

export type DefineExpose = {
	quill: InstanceType<typeof QuillEditor>;
};
type Props = {
	contentType: 'delta' | 'html' | 'text';
	// content: string
};
type Emits = {
	(e: 'update:content', value: string): void;
};

const props = withDefaults(defineProps<Props>(), {
	// content:'',
	contentType: 'html',
});
const emits = defineEmits<Emits>();
// const {content}=toRefs(props)
const { contentType } = props;
const attrs = useAttrs();
const slots = useSlots();
const quill = ref<InstanceType<typeof QuillEditor>>();

hljs.configure({
	languages: ['javascript', 'typescript', 'ruby', 'python', 'java'],
});

Quill.register('modules/resize', ResizeModule);

// const module = {
//       name: 'blotFormatter',
//       module: BlotFormatter,
//       options: {/* options */

//     }
// }
// const Syntax=Quill.import('modules/syntax')
const toolbarOptions = [
	[
		// { 'font': [] },{ 'size': ['small', false, 'large', 'huge'] },
		{ header: [1, 2, 3, false] },
		{ color: [] },
		{ background: [] }, // 文字颜色  背景颜色
		'bold',
		'italic',
		'underline',
		'strike',
	{ list: 'ordered' }, { list: 'bullet' }, 'code-block', 'blockquote', //  代码块,引用
	'image', 'video', 'link', // 图片 视频  超链接

	{ align: [] }, { direction: 'rtl' }, // 列表    对齐方式    文本方向

	{ indent: '-1' }, { indent: '+1' }, // outdent/indent
	'clean'], // remove formatting button
	//   [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
];
// const toolbarOptions = [
// 	[
// 		// { 'font': [] },{ 'size': ['small', false, 'large', 'huge'] },
// 		{ header: [1, 2, 3, false] },
// 	], //下拉选择
// 	[
// 		{ color: [] },
// 		{ background: [] }, // 文字颜色  背景颜色
// 		'bold',
// 		'italic',
// 		'underline',
// 		'strike',
// 	], // 切换按钮
// 	[{ list: 'ordered' }, { list: 'bullet' }, 'code-block', 'blockquote'], //  代码块,引用
// 	['image', 'video', 'link'], // 图片 视频  超链接

// 	[{ align: [] }, { direction: 'rtl' }], // 列表    对齐方式    文本方向

// 	[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
// 	['clean'], // remove formatting button
// 	//   [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
// ];
// // 自定义字体
// let fontList = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong']
// Quill.import('formats/font').whitelist = fontList; //将字体加入到白名单

const editorOption = {
	modules: {
		toolbar: toolbarOptions,
		syntax: {
			highlight: (text: string) => {
				return hljs.highlightAuto(text).value; // 这里就是代码高亮需要配置的地方
			},
		},
		resize: {
			locale: {
				altTip: '按住alt键比例缩放',
				floatLeft: '靠左',
				floatRight: '靠右',
				center: '居中',
				restore: '还原',
			},
		},
	},
};
const addQuillTitle = () => {
	const titleConfig: any = {
		'ql-bold': '加粗',
		'ql-font': '字体',
		'ql-code': '插入代码',
		'ql-italic': '斜体',
		'ql-link': '链接',
		'ql-color': '颜色',
		'ql-background': '背景颜色',
		'ql-size': '字体大小',
		'ql-strike': '删除线',
		'ql-script': '上标/下标',
		'ql-underline': '下划线',
		'ql-blockquote': '引用',
		'ql-header': '标题大小',
		'ql-indent': '缩进',
		'ql-list': '列表',
		'ql-align': '文本对齐',
		'ql-direction': '文本方向',
		'ql-code-block': '代码块',
		'ql-formula': '公式',
		'ql-image': '图片',
		'ql-video': '视频',
		'ql-clean': '清除字体样式',
	};
	let oToolBar = document.querySelector('.ql-formats');
	if (!oToolBar) {
		return;
	}
	let aButton = oToolBar.querySelectorAll('button');
	let aSpan = document.querySelectorAll('.ql-formats > span');``
 
	aButton.forEach((item) => {
		if (item.className === 'ql-script') {
			item.value === 'sub' ? (item.title = '下标') : (item.title = '上标');
		} else if (item.className === 'ql-indent') {
			item.value === '+1' ? (item.title = '向右缩进') : (item.title = '向左缩进');
		} else if (item.className === 'ql-list') {
			item.value === 'ordered' ? (item.title = '有序列表') : (item.title = '无序列表');
		} else {
			item.title = titleConfig[item.classList[0]];
		}
	});

    aSpan.forEach((item: any) => {
		item.title = titleConfig[item.classList[0]];
	});
};
const cls=ref()
let toolbar:any
let option:any
onMounted(() => {
	// console.log('useAttrs',useAttrs());
	// console.log('useSlots',useSlots());
	// console.log(quill.value,content.value);
	// setTimeout(()=>
	//     console.log(emits('update:content',content.value))
	// ,1000)
	addQuillTitle()
    let options=document.querySelectorAll('.ql-picker-options')
    toolbar=document.querySelector('.ql-toolbar.ql-snow')
    let div = document.createElement('div')
    // div.style.overflowY="visible"
    // div.style.overflowX="auto"
    // format?.parentNode?.insertBefore(div, format)
    // setTimeout(()=>
    // options.forEach((item,index)=>{
    //         console.log(item);
    //         console.log(toolbar);
    //         cls.value=item.scrollHeight

    //         if(toolbar){
    //             // toolbar.setAttribute('style','overflow-x:clip')
    //         }
    // })
    // ,2000)
});

// const quillChange=()=>{
//     console.log('attrs',attrs, 'attrs.content,', attrs.content,);
// }

// const quillReady=()=>{
//     console.log('quill-editor is ready');
// @textChange="quillChange()"
//     @ready="quillReady"
// }
// const onBlur = () => {
// 	emits('update:content', quill.value?.getHTML() as string);
// };

// watch(
// 	() => attrs.content,
// 	(newValue, oldValue) => {
//         console.log('attrs',attrs, 'attrs.content,', attrs.content,);
//         console.log('newValue',newValue, 'oldValue', oldValue);
//         console.log('quill.value?.getHTML()',quill.value?.getHTML());

// 		// HTML
// 		const isSame = newValue === oldValue;
//         // console.log('isSame');

// 		// JSON
// 		// const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

// 		if (isSame) {
// 			return;
// 		}

// 		// quill.value?.setHTML(newValue as string);
//         // emits('update:content',newValue as string)
// 	},
//     // {immediate:true,deep:true}
// );


watch(
	() => quill.value?.getToolbar().clientHeight,
	() => {
		console.log('cls',quill.value?.getToolbar().scrollHeight);
        if(null){
            quill.value?.getToolbar().setAttribute('style','overflow-x:clip')
        }
	},
	{ immediate:true,deep:true}
);
defineExpose({
	quill,
});
</script>

<script lang="ts"></script>

<style lang="less">
@import '@/utils/less/scrollbar.less';
@editor:.ql-editor;
@toolbar:.ql-toolbar.ql-snow;
@class:@editor;
.scrollbar-to(@class);

// p {
//   margin: 10px;
// }

.contianer{
    height: 100%;
}

.ql-toolbar.ql-snow {
	text-align: left !important;
    display: flex;
	white-space: nowrap;
    max-height:65px;
    // overflow: clip;
	// overflow-y:visible;     
    // height:auto;
}

.ql-container.ql-snow {
	// min-height: 300px;
	// height: calc(100% - 45px);
	max-height: 500px;
	// .ql-editor {
	// 	min-height: 300px;
	// }
}
.ql-editor{
	overflow: auto;
	overflow: overlay;
}

#editor-resizer {
    margin:auto;
	max-height: 480px;
} //关闭富文本图片resize模块


// .ql-container.ql-bubble{
//     min-height: 300px;
// }

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
	content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
	content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
	content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
	content: '标题3';
}
// .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
// .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
//   content: "标题4";
// }
// .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
// .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
//   content: "标题5";
// }
// .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
// .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
//   content: "标题6";
// }
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


// .ql-editor::-webkit-scrollbar,
// .ql-toolbar.ql-snow::-webkit-scrollbar {
// 	width: 14px;
// 	height: 14px;
// }
// .ql-editor::-webkit-scrollbar-track,
// .ql-editor::-webkit-scrollbar-thumb,
// .ql-toolbar.ql-snow::-webkit-scrollbar-track,
// .ql-toolbar.ql-snow::-webkit-scrollbar-thumb {
// 	border-radius: 999px;
// 	border: 5px solid transparent;
// }
// .ql-editor::-webkit-scrollbar-track,
// .ql-toolbar.ql-snow::-webkit-scrollbar-track {
// 	box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
// }
// .ql-editor::-webkit-scrollbar-thumb,
// .ql-toolbar.ql-snow::-webkit-scrollbar-thumb {
// 	min-height: 20px;
// 	background-clip: content-box;
// 	box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.2) inset;
// }
// .ql-editor::-webkit-scrollbar-corner,
// .ql-toolbar.ql-snow::-webkit-scrollbar-corner {
// 	background: transparent;
// }
</style>
