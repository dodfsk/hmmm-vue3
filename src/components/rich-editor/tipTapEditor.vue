<template>
	<div class="editor-container" :class="theme">
		<div class="editor__header" v-if="editor && theme != 'headless'">
			<template v-for="(item, index) in TipTapMenuBar" :key="item.key">
				<button
					class="menu-item"
					v-if="!item.type"
					@click="item.cmd"
					:class="item.class && item.class"
					:disabled="item.disabled && item.disabled"
					:title="item.title"
				>
					<n-icon size="18" :component="item.svg" v-if="item.svg" />
					<div v-if="!item.svg">
						{{ item.title }}
					</div>
				</button>
				<input
					v-if="item.type == 'color'"
					type="color"
					id="color"
					@change="item.cmd"
					:value="item.value"
				/>
                <!-- (e:any)=>editor?.chain().focus().setColor(e.target.value).run()
                editor?.getAttributes('textStyle').color || '#000000' -->
				<div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`"></div>
			</template>

			<!-- <button
				class="menu-item"
                @click="handleResize"
            >    
            1
            </button> -->
		</div>
		<bubble-menu
			class="bubble-menu"
			:tippy-options="{ animation: true, duration: 100 }"
			:editor="editor"
			:keepInBounds="true"
			v-if="editor && theme != 'headless'"
			v-show="editor.isActive('image')"
		>
			<template v-for="(item, index) in BubbleMenuBar" :key="item.key">
				<button class="bubble-item" v-if="!item.type" @click="item.cmd" :title="item.title">
					<n-icon size="22" :component="item.svg" v-if="item.svg" />
				</button>
				<!-- 编辑图片的pop框 -->
				<n-popover
					trigger="manual"
					v-if="item.type == 'pop'"
					:show="showPopover"
					@clickoutside="
						() => {
							showPopover = false;
						}
					"
					:footer-style="{ display: 'flex', justifyContent: 'end' }"
				>
					<template #trigger>
						<button class="bubble-item" :title="item.title" @click="item.click">
							<n-icon size="22" :component="item.svg" v-if="item.svg" />
						</button>
					</template>

					<n-form size="tiny">
						<n-form-item label="src">
							<n-input v-model:value="bubbleState.src" placeholder="请输入图片地址"/>
						</n-form-item>
						<n-form-item label="alt">
							<n-input v-model:value="bubbleState.alt" placeholder="请输入图片描述"/>
						</n-form-item>
						<n-form-item label="scalePercent">
							<n-input-number
								v-model:value="bubbleState.scalePercent"
                                placeholder="请输入原图百分比"
                                step="5"
								clearable
                                style="width:200px"
						    >
                                <template #prefix>%</template>
                            </n-input-number>
						</n-form-item>
						<n-form-item label="width">
							<n-input-number
								v-model:value="bubbleState.width"
								:disabled="bubbleState.scalePercent!==0||bubbleState.scalePercent!==undefined"
                                placeholder="请输入图片宽度"
								clearable
                                style="width:200px"
							>
                                <template #prefix>px</template>
                            </n-input-number>
						</n-form-item>
						<n-form-item label="height">
							<n-input-number
								v-model:value="bubbleState.height"
								:disabled="bubbleState.scalePercent!==0||bubbleState.scalePercent!==undefined"
                                placeholder="请输入图片高度"
								clearable
                                style="width:200px"
							>
                            <template #prefix>px</template>
                            </n-input-number>
						</n-form-item>
					</n-form>

					<template #footer>
						<n-button size="tiny" type="info" @click="item.cmd"> 确定 </n-button>
					</template>
				</n-popover>
			</template>
		</bubble-menu>

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
import { computed, onBeforeUnmount, onMounted, reactive, ref, ShallowRef, useAttrs, watch } from 'vue';

import { useEditor, EditorContent, Editor, BubbleMenu, VueNodeViewRenderer } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
// import Image from '@tiptap/extension-image'
import Image from './ImageResizeModule';
import CodeBlockLowlight from './CodeBlockModule';

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
    Link as LinkSvg,
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
	Multiplier05X,
	Multiplier1X,
	Edit,
} from '@vicons/tabler';

export type DefineExpose = {
	editorRef: InstanceType<typeof EditorContent>
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

const bubbleState = reactive({
	src: '',
	alt: '',
	scalePercent: 0,
	width: 0,
	height: 0,
});
const showPopover = ref<boolean>(false);

const editor: ShallowRef<Editor | undefined> = useEditor({
	content: modelValue,
	extensions: [
		StarterKit.configure({ codeBlock: false }),
		CodeBlockLowlight,
        Link.configure({
            openOnClick: false,
            // autolink: false,
        }),
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
		emits('update:modelValue', editor.getHTML()); //双向绑定
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
		type: 'color',
		title: '文本颜色',
		key: 'color',
        cmd:(e:any)=>{editor.value?.chain().focus().setColor(e.target.value).blur().run()},
        //change事件+blur移除焦点防止文本选中bug
        value:editor.value?.getAttributes('textStyle').color || '#000000'
	},
	{
		title: '加粗',
		key: 'bold',
		cmd: () => editor.value?.chain().focus().toggleBold().run(),
		class: { 'is-active': editor.value?.isActive('bold') },
		disabled: !editor.value?.can().chain().focus().toggleBold().run(),
		svg: Bold,
	},
	{
		title: '斜体',
		key: 'italic',
		cmd: () => editor.value?.chain().focus().toggleItalic().run(),
		class: { 'is-active': editor.value?.isActive('italic') },
		disabled: !editor.value?.can().chain().focus().toggleItalic().run(),
		svg: Italic,
	},
	{
		title: '删除线',
		key: 'strike',
		cmd: () => editor.value?.chain().focus().toggleStrike().run(),
		class: { 'is-active': editor.value?.isActive('strike') },
		disabled: !editor.value?.can().chain().focus().toggleStrike().run(),
		svg: Strikethrough,
	},
	{
		title: '文本高亮',
		key: 'highlight',
		cmd: () => editor.value?.chain().focus().toggleHighlight().run(),
		class: { 'is-active': editor.value?.isActive('highlight') },
		disabled: !editor.value?.can().chain().focus().toggleHighlight().run(),
		svg: HighlightSvg,
	},
	{
		type: 'divider',
	},
	{
		title: '一级标题',
		key: 'h1',
		cmd: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
		class: { 'is-active': editor.value?.isActive('heading', { level: 1 }) },
		svg: H1,
	},
	{
		title: '二级标题',
		key: 'h2',
		cmd: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
		class: { 'is-active': editor.value?.isActive('heading', { level: 2 }) },
		svg: H2,
	},
	{
		title: '三级标题',
		key: 'h3',
		cmd: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
		class: { 'is-active': editor.value?.isActive('heading', { level: 3 }) },
		svg: H3,
	},
	{
		title: '无序列表',
		key: 'bulletList',
		cmd: () => editor.value?.chain().focus().toggleBulletList().run(),
		class: { 'is-active': editor.value?.isActive('bulletList') },
		svg: List,
	},
	{
		title: '有序列表',
		key: 'orderedList',
		cmd: () => editor.value?.chain().focus().toggleOrderedList().run(),
		class: { 'is-active': editor.value?.isActive('orderedList') },
		svg: ListNumbers,
	},
	{
		title: '任务列表',
		key: 'taskList',
		cmd: () => editor.value?.chain().focus().toggleTaskList().run(),
		class: { 'is-active': editor.value?.isActive('taskList') },
		svg: ListDetails,
	},
	{
		type: 'divider',
	},
	{
		title: '图片',
		key: 'Image',
		cmd: () => {
			const url = window.prompt('URL');
			if (url) {
				editor.value?.chain().focus().setImage({ src: url }).run();
			}
		},
		svg: Photo,
	},
    {   
        title: '超链接',
		key: 'link',
		cmd: () => {
            if(!editor.value?.isActive('link')){
                const previousUrl = editor.value?.getAttributes('link').href
                const url = window.prompt('URL', previousUrl)
                // cancelled
                if (url === null) {
                    return
                }
                // empty
                if (url === '') {
                    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
                    return
                }
                // update link
                editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
            else{
                editor.value?.chain().focus().extendMarkRange('link').unsetLink().blur().run()
                //移除超链接后移除焦点防止文本选中
            }
        },
		class: { 'is-active': editor.value?.isActive('link') },
        svg:LinkSvg,
    },
	{
		title: '代码块',
		key: 'codeBlock',
		cmd: () => editor.value?.chain().focus().toggleCodeBlock().run(),
		class: { 'is-active': editor.value?.isActive('codeBlock') },
		svg: Code,
	},
	{
		title: '引用块',
		key: 'blockQuote',
		cmd: () => editor.value?.chain().focus().toggleBlockquote().run(),
		class: { 'is-active': editor.value?.isActive('blockquote') },
		svg: Quote,
	},
	{
		title: '水平线',
		key: 'horizontal',
		cmd: () => editor.value?.chain().focus().setHorizontalRule().run(),
		svg: Separator,
	},
	{
		type: 'divider',
	},
	{
		title: '文本居左',
		key: 'alignLeft',
		cmd: () => editor.value?.chain().focus().setTextAlign('left').run(),
		class: { 'is-active': editor.value?.isActive({ textAlign: 'left' }) },
		svg: AlignLeft,
	},
	{
		title: '文本居中',
		key: 'alignCenter',
		cmd: () => editor.value?.chain().focus().setTextAlign('center').run(),
		class: { 'is-active': editor.value?.isActive({ textAlign: 'center' }) },
		svg: AlignCenter,
	},
	{
		title: '文本居右',
		key: 'alignRight',
		cmd: () => editor.value?.chain().focus().setTextAlign('right').run(),
		class: { 'is-active': editor.value?.isActive({ textAlign: 'right' }) },
		svg: AlignRight,
	},
	{
		type: 'divider',
	},
	{
		title: '硬换行',
		key: 'hardBreak',
		cmd: () => editor.value?.chain().focus().setHardBreak().run(),
		svg: TextWrap,
	},
	{
		title: '清除格式',
		key: 'clearFormats',
		cmd: () => editor.value?.chain().focus().clearNodes().unsetAllMarks().run(),
		svg: ClearFormatting,
	},
	{
		type: 'divider',
	},
	{
		title: '撤销',
		key: 'undo',
		cmd: () => editor.value?.chain().focus().undo().run(),
		class: { 'is-active': editor.value?.isActive('undo') },
		disabled: !editor.value?.can().chain().focus().undo().run(),
		svg: ArrowBackUp,
	},
	{
		title: '重做',
		key: 'redo',
		cmd: () => editor.value?.chain().focus().redo().run(),
		class: { 'is-active': editor.value?.isActive('redo') },
		disabled: !editor.value?.can().chain().focus().redo().run(),
		svg: ArrowForwardUp,
	},
]);
const BubbleMenuBar = computed(() => [
	{
		title: '50%',
		key: '0.5',
		cmd: () => editor.value?.chain().focus().updateAttributes('image', { scalePercent: 0.5 }).run(),
		svg: Multiplier05X,
	},
	{
		title: '100%',
		key: '1.0',
		cmd: () => editor.value?.chain().focus().updateAttributes('image', { scalePercent: 1.0 }).run(),
		svg: Multiplier1X,
	},
	{
		type: 'pop',
		title: '编辑图片',
		key: 'imgEdit',
		click: () => {
			showPopover.value = true;
			const imgState = editor.value!.getAttributes('image');
            imgState.scalePercent*=100
			Object.assign(bubbleState, imgState);
		},
		cmd: () => {
            bubbleState.scalePercent/=100
			editor.value
				?.chain()
				.focus()
				.updateAttributes('image', { ...bubbleState })
				.run();
			showPopover.value = false;
		},
		svg: Edit,
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

defineExpose({
	editorRef,
});
</script>

<style lang="less">
.ProseMirror {
	// min-width:600px;
	// min-height: 300px;
	// max-height: 550px;
	word-wrap: break-word;
	white-space: pre-wrap;
	white-space: break-spaces;
	-webkit-font-variant-ligatures: none;
	font-variant-ligatures: none;
	font-feature-settings: 'liga' 0;
	position: relative;
	// overflow: auto;
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

    a {
        color: #48add8;
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
		width: 100%;
		// margin: 0 2px;
		height: auto;
	}
	.img-container {
		margin: 0 2px;
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
// .headless {
//     .ProseMirror {
//         img{
//             width:100%
//         }
//     }
// }
</style>

<style lang="less" scoped>
@import '@/utils/less/scrollbar.less';
@class: .editor__content;
.scrollbar-to(@class);

//↓scoped class
.editor-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	// max-height: 26rem;
	// color: #0d0d0d;
	// background-color: #fff;
	border: 3px solid #0d0d0d;
	border-radius: 0.75rem;
	// overflow:auto;
}
.headless {
	border: none;
	.editor__content {
		overflow-x: hidden;
		overflow-y: auto;
	}
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
		margin: 0.1rem 0.15rem;
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
	overflow: auto;
	-webkit-overflow-scrolling: touch;
}
.bubble-menu {
	display: flex;
	background-color: #fff;
	padding: 0 0.2rem;
	border: 3px solid #0d0d0d;
	border-radius: 0.75rem;
	// button {
	//     border: none;
	//     background: none;
	//     color: #fff;
	//     font-size: 0.85rem;
	//     font-weight: 500;
	//     padding: 0 0.2rem;
	//     opacity: 0.6;
	//     &:hover,
	//     &.is-active {
	//         opacity: 1;
	//     }
	//     &.is-active {
	//         text-decoration: underline;
	//     }
	// }
	.bubble-item {
		width: 1.75rem;
		height: 1.75rem;
		color: #0d0d0d;
		border: none;
		background-color: transparent;
		border-radius: 0.4rem;
		padding: 0.25rem;
		margin: 0.1rem 0.15rem;
	}
	.bubble-item svg {
		width: 100%;
		height: 100%;
		fill: currentColor;
	}
	.bubble-item:hover {
		background: black;
		color: #fff;
	}
	.bubble-item[disabled] {
		opacity: 0.3;
		color: #000;
		background: none;
		cursor: not-allowed;
	}
	.is-active {
		background: black;
		color: #fff;
	}
}
</style>
