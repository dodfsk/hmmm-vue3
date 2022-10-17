<template>
	<div class="editor-container" :class="theme">
		<div class="editor__header" v-if="editor && theme != 'headless'">
			<input
				type="color"
				id="color"
				@input="(e:any)=>editor?.chain().focus().setColor(e.target.value).run()"
				:value="editor.getAttributes('textStyle').color || '#000000'"
			/>
            <template v-for="(item,index) in TipTapMenuBar">
                <button
                    class="menu-item"
                    v-if="item.type!=='divider'"
                    @click="item.click"
                    :class="item.class && item.class"
                    :disabled="item.disabled && item.disabled"
                    :title="item.title"
                    :key="item.key"
                >
                    <n-icon size="18" :component="item.svg" v-if="item.svg" />
                    <div v-else>
                        {{ item.title }}
                    </div>
                </button>
                <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`" />
            </template>
            <!-- <button
				class="menu-item"
                @click="handleResize"
            >    
            1
            </button> -->
		</div>

		<div class="editor__content">
			<EditorContent ref="editorRef" v-bind="$attrs" :editor="editor">
				<!-- <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots" >
                    <slot :name="slotName" v-bind="slotProps"></slot>
                </template> -->
			</EditorContent>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	computed,
	onBeforeUnmount,
	onMounted,
	reactive,
	Ref,
	ref,
	ShallowRef,
	useAttrs,
	watch,
} from 'vue';

import { useEditor, EditorContent, Editor,BubbleMenu, VueNodeViewRenderer } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
// import Image from '@tiptap/extension-image'
import Image from './ImageResizeModule';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlockComponent from './CodeBlockComponent.vue';
import { lowlight } from 'lowlight/lib/common';
import 'highlight.js/styles/vs2015.css';

import {
	Bold,
	Italic,
	Strikethrough,
	List,
	ListNumbers,
	ListDetails,
	TextWrap,
	Separator,
	ClearFormatting,
	Code,
	Quote,
	H1,
	H2,
	H3,
	Photo,
	Highlight as HighlightSvg,
	AlignCenter,
	AlignLeft,
	AlignRight,
	ArrowBackUp,
	ArrowForwardUp,
} from '@vicons/tabler';

export type DefineExpose = {
	editorRef: InstanceType<typeof EditorContent>;
};
type Props = {
	theme?: string;
	modelValue?: string;
};
type Emits = {
	// (e: 'functionName', value: any): void
	(e: 'update:modelValue', value: string): void;
};

const props = withDefaults(defineProps<Props>(), {
	modelValue: '',
});
const emits = defineEmits<Emits>();
// const emit = defineEmits(['update:modelValue'])

const { theme, modelValue } = props;

console.log(lowlight.listLanguages());

const BulletListConfig = BulletList.extend({
	addKeyboardShortcuts() {
		return {
			Tab: () => {
				this.editor
					.chain()
					.sinkListItem('listItem')
					.command(({ tr }) => {
						tr.insertText('    '); //tab返回4空格
						return true;
					})
					.run();
				return true; // <- make sure to return true to prevent the tab from blurring.
			},
		};
	},
});
const CodeBlockLowlightConfig = CodeBlockLowlight.extend({
	addNodeView() {
		return VueNodeViewRenderer(CodeBlockComponent);
	},
}).configure({ lowlight, defaultLanguage: 'typescript' });

const editor: ShallowRef<Editor | undefined> = useEditor({
	content: modelValue,
	extensions: [
		StarterKit.configure({ codeBlock: false }),
		BulletListConfig,
		CodeBlockLowlightConfig,
		Color,
		TextStyle,
		TextAlign.configure({
			types: ['heading', 'paragraph'],
		}),
		TaskList,
		TaskItem.configure({
			nested: true,
		}),
		Highlight.configure({
			multicolor: true,
		}),
		Image.configure({
			inline: true,
			allowBase64: true,
		}),
	],
	onUpdate: ({ editor }) => {
		// HTML
		emits('update:modelValue', editor.getHTML());
		// console.log(editor.getHTML());

		// JSON
		// emits('update:modelValue', editor.getJSON())
	},
});
const editorRef = ref();

// const editorOption= {
//     modules: {
//         syntax: {
//             highlight: (text:string) => {
//                 return hljs.highlightAuto(text).value // 这里就是代码高亮需要配置的地方
//             }
//         }
//     }
// }

const TipTapMenuBar = computed(() => [
	{
		title: '加粗',
        key:'bold',
		click: () => editor.value?.chain().focus().toggleBold().run(),
		class: { 'is-active': editor.value?.isActive('bold') },
		disabled: !editor.value?.can().chain().focus().toggleBold().run(),
		svg: Bold,
	},
	{
		title: '斜体',
        key:'italic',
		click: () => editor.value?.chain().focus().toggleItalic().run(),
		class: { 'is-active': editor.value?.isActive('italic') },
		disabled: !editor.value?.can().chain().focus().toggleItalic().run(),
		svg: Italic,
	},
	{
		title: '删除线',
        key:'strike',
		click: () => editor.value?.chain().focus().toggleStrike().run(),
		class: { 'is-active': editor.value?.isActive('strike') },
		disabled: !editor.value?.can().chain().focus().toggleStrike().run(),
		svg: Strikethrough,
	},
	{
		title: '文本高亮',
        key:'highlight',
		click: () => editor.value?.chain().focus().toggleHighlight().run(),
		class: { 'is-active': editor.value?.isActive('highlight') },
		disabled: !editor.value?.can().chain().focus().toggleHighlight().run(),
		svg: HighlightSvg,
	},
    {
        type:'divider'
    },
	{
		title: '一级标题',
        key:'h1',
		click: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
		class: { 'is-active': editor.value?.isActive('heading', { level: 1 }) },
		svg: H1,
	},
	{
		title: '二级标题',
        key:'h2',
		click: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
		class: { 'is-active': editor.value?.isActive('heading', { level: 2 }) },
		svg: H2,
	},
	{
		title: '三级标题',
        key:'h3',
		click: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
		class: { 'is-active': editor.value?.isActive('heading', { level: 3 }) },
		svg: H3,
	},
	{
		title: '无序列表',
        key:'bulletList',
		click: () => editor.value?.chain().focus().toggleBulletList().run(),
		class: { 'is-active': editor.value?.isActive('bulletList') },
		svg: List,
	},
	{
		title: '有序列表',
        key:'orderedList',
		click: () => editor.value?.chain().focus().toggleOrderedList().run(),
		class: { 'is-active': editor.value?.isActive('orderedList') },
		svg: ListNumbers,
	},
	{
		title: '任务列表',
        key:'taskList',
		click: () => editor.value?.chain().focus().toggleTaskList().run(),
		class: { 'is-active': editor.value?.isActive('taskList') },
		svg: ListDetails,
	},
    {
        type:'divider'
    },
    {
		title: '图片',
        key:'Image',
		click: () => {
			const url = window.prompt('URL');
			if (url) {
				editor.value?.chain().focus().setImage({ src: url }).run();
			}
		},
		svg: Photo,
	},

	{
		title: '代码块',
        key:'codeBlock',
		click: () => editor.value?.chain().focus().toggleCodeBlock().run(),
		class: { 'is-active': editor.value?.isActive('codeBlock') },
		svg: Code,
	},
	{
		title: '引用块',
        key:'blockQuote',
		click: () => editor.value?.chain().focus().toggleBlockquote().run(),
		class: { 'is-active': editor.value?.isActive('blockquote') },
		svg: Quote,
	},
	{
		title: '水平线',
        key:'horizontal',
		click: () => editor.value?.chain().focus().setHorizontalRule().run(),
		svg: Separator,
	},
    {
        type:'divider'
    },
	{
		title: '文本居左',
        key:'alignLeft',
		click: () => editor.value?.chain().focus().setTextAlign('left').run(),
		class: { 'is-active': editor.value?.isActive({ textAlign: 'left' }) },
		svg: AlignLeft,
	},
	{
		title: '文本居中',
        key:'alignCenter',
		click: () => editor.value?.chain().focus().setTextAlign('center').run(),
		class: { 'is-active': editor.value?.isActive({ textAlign: 'center' }) },
		svg: AlignCenter,
	},
	{
		title: '文本居右',
        key:'alignRight',
		click: () => editor.value?.chain().focus().setTextAlign('right').run(),
		class: { 'is-active': editor.value?.isActive({ textAlign: 'right' }) },
		svg: AlignRight,
	},
    {
        type:'divider'
    },
	{
		title: '硬换行',
        key:'hardBreak',
		click: () => editor.value?.chain().focus().setHardBreak().run(),
		svg: TextWrap,
	},
	{
		title: '清除格式',
        key:'clearFormats',
		click: () => editor.value?.chain().focus().clearNodes().unsetAllMarks().run(),
		svg: ClearFormatting,
	},
    {
        type:'divider'
    },
	{
		title: '撤销',
        key:'undo',
		click: () => editor.value?.chain().focus().undo().run(),
		class: { 'is-active': editor.value?.isActive('undo') },
		disabled: !editor.value?.can().chain().focus().undo().run(),
		svg: ArrowBackUp,
	},
	{
		title: '重做',
        key:'redo',
		click: () => editor.value?.chain().focus().redo().run(),
		class: { 'is-active': editor.value?.isActive('redo') },
		disabled: !editor.value?.can().chain().focus().redo().run(),
		svg: ArrowForwardUp,
	},
]);

// const handleResize=()=>{
//     editor.value?.chain().focus().toggleResizable().run()

// }
// const showButton=computed(()=>{
//         return editor.value?.state?.selection?.node?.type?.name === 'ResizableImage';
//     }
// )
// const isDraggable=computed(()=>{
//     return editor.value?.state?.selection?.node?.attrs?.isDraggable;
// })

onMounted(() => {
	if (theme == 'headless') {
		editor.value?.setEditable(false);
	}
});

onBeforeUnmount(() => {
	editor.value?.destroy();
});

// watch(
// 	() => modelValue,
// 	(newValue, oldValue) => {
// 		// HTML
// 		const isSame = editor.value?.getHTML() === oldValue;

// 		// JSON
// 		// const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

// 		if (isSame) {
// 			return;
// 		}

// 		editor.value?.commands.setContent(newValue, false);
// 	}
// );

defineExpose({
	editorRef,
});
</script>

<style lang="less">
.ProseMirror {
	min-height: 300px;
	// max-height: 550px;
	word-wrap: break-word;
	white-space: pre-wrap;
	white-space: break-spaces;
	-webkit-font-variant-ligatures: none;
	font-variant-ligatures: none;
	font-feature-settings: 'liga' 0;
	position: relative;
}
.ProseMirror-focused:focus {
	outline: none;
}
.scrollable {
	cursor: default;
}

.ProseMirror {
	> * + * {
		margin-top: 0.75em;
	}

	ul,
	ol {
		padding: 0 1rem;
	}
	ul[data-type='taskList'] {
		list-style: none;
		padding: 0;
		p {
			margin: 0;
		}
		li {
			display: flex;
			> label {
				padding-top: 1.5px;
				flex: 0 0 auto;
				margin-right: 0.5rem;
				user-select: none;
				input[checked='checked'] {
					color: black;
					background-color: black;
				}
			}

			> div {
				flex: 1 1 auto;
			}
		}
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		line-height: 1.1;
	}

	//   code {
	// background-color: rgba(#616161, 0.1);
	// color: #616161;
	//   }

	pre {
		// background: #0D0D0D;
		// color: #FFF;
		// padding: 5px 10px;
		// border-radius: 3px;
		font-family: 'JetBrainsMono', monospace;
		background-color: #23241f;
		color: #f8f8f2;
		padding: 0.25rem 0.5rem;
		border-radius: 0.3rem;
		// overflow: visible;
		white-space: pre-wrap;
		code {
			color: inherit;
			padding: 0;
			background: none;
			font-size: 0.8rem;
		}
	}
	mark {
		background-color: #ffe066;
		padding: 0.125em 0;
		border-radius: 0.25em;
		box-decoration-break: clone;
	}

	img {
		max-width: 100%;
        margin: 0 2px;
		// height: auto;
	}

	blockquote {
		padding-left: 1rem;
		border-left: 2px solid rgba(#0d0d0d, 0.1);
	}

	hr {
		border: none;
		border-top: 2px solid rgba(#0d0d0d, 0.3);
		margin: 0.3rem 0;
	}
}
</style>

<style lang="less" scoped>
@import '@/utils/less/scrollbar.less';
@class: .editor__content;
.scrollbar-to(@class);

//↓scoped class

.editor-container {
	// width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	// max-height: 26rem;
	// color: #0d0d0d;
	// background-color: #fff;
	border: 3px solid #0d0d0d;
	border-radius: 0.75rem;
}
.headless {
	border: none;
}

.editor__header {
	text-align: left;
	display: flex;
	align-items: center;
	flex: 0 0 auto;
	flex-wrap: wrap;
	padding: 0.25rem;
	border-bottom: 3px solid #0d0d0d;
	button {
		// font-size: 18px;
		font-size: inherit;
		font-family: inherit;
		color: #000;
		margin: 0.1rem;
		border: 1px solid black;
		border-radius: 0.3rem;
		padding: 0.1rem 0.4rem;
		background: white;
		accent-color: black;
	}
	.menu-item {
		width: 1.75rem;
		height: 1.75rem;
		color: #0d0d0d;
		border: none;
		background-color: transparent;
		border-radius: 0.4rem;
		padding: 0.25rem;
		margin-right: 0.25rem;
	}
	.menu-item svg {
		width: 100%;
		height: 100%;
		fill: currentColor;
	}
	.menu-item:hover {
		background: black;
		color: #fff;
	}
	.menu-item[disabled] {
		opacity: 0.3;
		color: #000;
		background: none;
		cursor: not-allowed;
	}
	.is-active {
		background: black;
		color: #fff;
	}
	#color {
		border: none;
		outline: none;
		box-shadow: none;
		width: 30px;
		height: 24px;
		margin-right: 3px;
	}
    .divider {
        width: 2px;
        height: 1.25rem;
        background-color: #00000016;
        margin-left: 0.5rem;
        margin-right: 0.75rem;
    }

}
.editor__content {
	padding: 1rem 0.75rem;
	flex: 1 1 auto;
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
</style>
