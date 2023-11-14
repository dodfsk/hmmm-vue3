<template>
	<div class="editor-container" :class="theme">
		<div class="editor__header" v-if="editor && theme != 'headless'">
			<template v-for="(item, index) in TipTapMenuBar" :key="item.key">
                <!-- 普通按钮 -->
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
                <!-- 颜色选择 -->
				<input
					v-if="item.type === 'color'"
					type="color"
					id="color"
					@change="item.cmd"
					:value="item.value"
				/>
                <!-- 分隔竖线 -->
				<div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`"></div>
                <!-- 图片上传 -->
                <n-popover 
                    v-if="item.type==='image'"
					trigger="hover"
                    raw
                    :show-arrow="false"
					:footer-style="{ display: 'flex', justifyContent: 'end' }"
				>
					<template #trigger>
						<button
                            class="menu-item"
                            v-if="item.type==='image'"
                            :class="item.class"
                            :disabled="item.disabled"
                            :title="item.title"
                        >
                            <n-icon size="18" :component="item.svg" v-if="item.svg" />
                        </button>
					</template>
                    <div
                        :style="{
                            border:'#000 solid 3px',
                            borderRadius:'8px',
                            padding:'4px 10px',
                            background:'#fff',
                        }"
                    >
                    <n-button-group vertical size="small">

                        <n-button
                            color="#000"
                            quaternary
                            size="small"
                            @click="item.cmd"
                        >图片地址</n-button>
                        <n-button
                            color="#000"
                            quaternary
                            size="small"
                            @click="()=>showModal=true"
                        >本地上传</n-button>
                    </n-button-group>
                    </div>
                </n-popover>

			</template>

			<!-- <button
				class="menu-item"
                @click="handleResize"
            >    
            1
            </button> -->
		</div>

		<div class="editor__content">
			<EditorContent ref="editorRef" v-bind="$attrs" :editor="editor" style="height:100%">
				<!-- <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots" >
                    <slot :name="slotName" v-bind="slotProps"></slot>
                </template> -->
			</EditorContent>
		</div>

        <div class="editor__footer" v-if="showFooter">
            <UploadFileCard
                v-for="item in assets"
                :key="item.fileName"
                v-bind="item"
                @handleReInsert="reinsertImage"
                @handleFileDel="removeImage"
            ></UploadFileCard>
        </div>

        <BubbleMenu
            class="bubble-menu"
            :tippy-options="{ animation: true, duration: 100 }"
            :editor="editor"
            :keepInBounds="true"
            v-if="editor && theme !== 'headless'"
            v-show="editor.isActive('image')"
        >
            <template v-for="(item, index) in BubbleMenuBar" :key="item.key">
                <button class="bubble-item" v-if="!item.type" @click="item.cmd" :title="item.title">
                    <n-icon size="22" :component="item.svg" v-if="item.svg" />
                </button>
                <!-- 编辑图片的pop框 -->
                <n-popover
                    trigger="manual"
                    v-if="item.type === 'pop'"
                    :show="showPopover"
                    raw
                    :show-arrow="false"
                    @clickoutside="
                        () => {
                            showPopover = false
                        }
                    "
                    :footer-style="{ display: 'flex', justifyContent: 'end' }"
                >
                    <template #trigger>
                        <button class="bubble-item" :title="item.title" @click="item.click">
                            <n-icon size="22" :component="item.svg" v-if="item.svg" />
                        </button>
                    </template>
                    <div
                        :style="{
                            border:'#000 solid 3px',
                            borderRadius:'8px',
                            padding:'6px 8px',
                            background:'#fff',
                        }"
                    >
                        <n-space vertical align="end">
                        <n-form size="tiny">
                            <n-form-item label="src">
                                <n-input  v-model:value="bubbleState.src" placeholder="请输入图片地址" :disabled="bubbleState.isBase64"/>
                            </n-form-item>
                            <n-form-item label="alt">
                                <n-input v-model:value="bubbleState.alt" placeholder="请输入图片描述"/>
                            </n-form-item>
                            <n-form-item label="scalePercent">
                                <n-input-number
                                    v-model:value="bubbleState.scalePercent"
                                    placeholder="原图百分比"
                                    min="0"
                                    step="5"
                                    clearable
                                    style="width:200px"
                                >
                                    <template #prefix>%&nbsp</template>
                                </n-input-number>
                            </n-form-item>
                            <n-form-item label="width">
                                <n-input-number
                                    v-model:value="bubbleState.width"
                                    :disabled="bubbleState.scalePercent!==null&&bubbleState.scalePercent!==0"
                                    placeholder="宽 度 auto"
                                    clearable
                                    style="width:200px"
                                >
                                    <template #prefix>px</template>
                                </n-input-number>
                            </n-form-item>
                            <n-form-item label="height">
                                <n-input-number
                                    v-model:value="bubbleState.height"
                                    :disabled="bubbleState.scalePercent!==null&&bubbleState.scalePercent!==0"
                                    placeholder="高 度 auto"
                                    clearable
                                    style="width:200px"
                                >
                                <template #prefix>px</template>
                                </n-input-number>
                            </n-form-item>
                        </n-form>
                            <n-button size="tiny" type="info" @click="item.cmd"> 确定 </n-button>
                        </n-space>
                    </div>

                </n-popover>
            </template>
        </BubbleMenu>

        <UploadModal
            v-if="editor && theme !== 'headless'"
            v-model:show="showModal"
            ref="uploadModalRef"
            @handleUploadDone="insertImage"
        ></UploadModal>

	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, ShallowRef, toRefs, useAttrs, watch } from 'vue'
import { PreSignInfo } from '@/types/room'

import { useEditor, EditorContent, Editor, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Highlight from '@tiptap/extension-highlight'
import { Color } from '@tiptap/extension-color'
// import Image from '@tiptap/extension-image'
import Image from './components/ImageResizeModule'
import CodeBlockLowlight from './components/CodeBlockModule'
import UploadModal from './components/UploadModal.vue'
import UploadFileCard  from './components/UploadFileCard.vue'


import 'highlight.js/styles/vs2015.css'

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
    BorderRadius,
    Trash,
} from '@vicons/tabler'

export type DefineExpose = {
	editorRef: InstanceType<typeof EditorContent>
}
type Props = {
	theme?: string
	modelValue?: string
    assets?:PreSignInfo[]
}
type Emits = {
	// (e: 'functionName', value: any): void
	(e: 'update:modelValue', value: string): void
	(e: 'update:assets', value: PreSignInfo[]): void
    (e: 'handleSaveAssets'): void
}
type BubbleState={
    src?: string
    alt?: string
    scalePercent?: number | null
    width?: number | null
    height?: number | null
    isBase64:boolean
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: '',
})
const emits = defineEmits<Emits>()
// const emit = defineEmits(['update:modelValue'])

const { theme, modelValue,assets } = toRefs(props)

const showPopover = ref<boolean>(false)
const bubbleState = reactive<BubbleState>({
	scalePercent: null,
	width: null,
	height: null,
    isBase64:false,
})

const showModal = ref<boolean>(false)
const uploadModalRef = ref()
const showFooter=computed(()=>{
    if(props.theme==='headless'){
        return false
    }
    return props.assets!.length>0
})

const editor: ShallowRef<Editor | undefined> = useEditor({
	content: props.modelValue,
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
        //编辑器内容更新时触发emit事件
		// HTML
        if(props.theme!=='headless'){
            emits('update:modelValue', editor.getHTML()) //双向绑定
            if(props.assets!.length>0){
                emits('update:assets', props.assets!) //双向绑定
            }
        }

		// JSON
		// emits('update:modelValue', editor.getJSON())
	},
})
const editorRef = ref()

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
        type:'image',
		title: '图片',
		key: 'Image',
		cmd: () => {
                const url = window.prompt('URL')
                if (url) {
                    editor.value?.chain().focus().setImage({ src: url }).run()
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
                editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).blur().run()
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
		cmd: () => editor.value?.chain().focus().clearNodes().unsetAllMarks().blur().run(),
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
])
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
		disabled: bubbleState.isBase64,
		click: () => {
			showPopover.value = true
            bubbleState.isBase64=false
            
			const imgState = editor.value!.getAttributes('image')
            //将0.x化为百分比做显示
            if(imgState.scalePercent){
                imgState.scalePercent*=100
            }
            //对base64格式地址做处理
            if(imgState.src&&imgState.src.indexOf('data:image')>-1){
                imgState.src='粘贴或拖拽插入的base64格式图片'
                bubbleState.isBase64=true
            }
            //将图片信息传递给form表单
			Object.assign(bubbleState, imgState)
		},
		cmd: () => {
            //将百分比转换为0.x更新图片
            if(bubbleState.scalePercent){
                bubbleState.scalePercent/=100
            }
            //如果是base64图片,则删除src属性,避免更新
            if(bubbleState.isBase64){
                delete bubbleState.src
            }
            console.log(bubbleState)
            
			editor.value
			    ?.chain()
				.focus()
				.updateAttributes('image', { ...bubbleState })
				.run()
			showPopover.value = false
		},
		svg: Edit,
	},
    {
        title:'删除图片',
        key:'imgDelete',
        cmd:()=>editor.value?.chain().focus().deleteSelection().run(),
        svg:Trash,
    }
])

const insertImage=(data:PreSignInfo)=>{
    const indexF=props.assets!.findIndex((item)=>item.fileName===data.fileName)
    console.log(indexF,data)
    if(indexF===-1){
        const pushData={
            url:data.url,
            fileName:data.fileName
        }
        props.assets!.push(pushData)
        console.log(props.assets)
    }
    editor.value?.chain().focus().setImage({ src: data.url!,alt:data.fileName }).run()
    showModal.value=false
    emits('handleSaveAssets')//自动更新附件信息
    
}
const removeImage=(data:PreSignInfo)=>{
    const indexF=props.assets!.findIndex((item)=>item.fileName===data.fileName)
    console.log(indexF,data.fileName)
    if(indexF>-1){
        props.assets!.splice(indexF,1)
        console.log(props.assets)
    }
    
    //↓此处正则替换删除所有对应的img图片标签
    const regStr=`<img [^>]*src=['"]${data.url}['"][^>]*>`
    // const regStr=`<img [^>]*src=['"]([^'"]+)[^>]*>`
    const imgReg=new RegExp(regStr,'g')
    
    const content=editor.value!.getHTML().replace(imgReg,(match, capture)=>{
        console.log('match, capture',match, capture)
        return ''
    })
    emits('update:modelValue', content) //双向绑定修改数据
    // editor.value!.commands.setContent(content)//修改编辑器视图
    emits('handleSaveAssets')//自动更新附件信息
}
const reinsertImage=(data:PreSignInfo)=>{
    editor.value?.chain().focus().setImage({ src: data.url!,alt:data.fileName }).run()
}


watch(//内容-数据 双向绑定
    ()=>props.modelValue,
    (newValue,oldValue)=>{

    if(props.theme!=='headless'){
        // HTML
        const isSame = editor.value!.getHTML() === newValue

        // JSON
        // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

        if (isSame) {
            return
        }

        editor.value!.commands.setContent(newValue, false)
        }
    }
)

onMounted(() => {
	if (props.theme === 'headless') {
		editor.value?.setEditable(false)
	}
    // document.addEventListener("paste", (e:any)=>{
    //     if(e.clipboardData.items.type.match(/^image\//i))
    //     editor.value?.chain().focus().setImage({ src: '',alt:'' }).run()
    // })
})

onBeforeUnmount(() => {
	editor.value?.destroy()
    // document.removeEventListener("paste", handlectrlvEvent)
})


defineExpose({
	editorRef,
})
</script>

<style lang="less">
@import '@/utils/less/scrollbar.less';
.ProseMirror {
    .scrollbar-to(pre);
    pre:hover{
        &::-webkit-scrollbar-thumb {
            cursor: pointer;
            background-color: #666;
        }
    }
	// min-width:600px;
    min-height:100%;
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

	pre {
		background-color: #23241f;
		color: #f8f8f2;
		padding: 0.5rem 1rem;
		border-radius: 0.3rem;
        overflow-x: auto;
		// overflow: visible;
        // white-space: pre;
        word-break: normal;
        word-wrap: normal;
		code {
			color: inherit;
			padding: 0;
			background: none;
			font-size: 0.8rem;
		    font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,JetBrainsMono, monospace;   
		}
	}
	mark {
		background-color: #ffe066;
		padding: 0.125em 0;
		border-radius: 0.25em;
		box-decoration-break: clone;
	}
	blockquote {
		margin: 0.5rem 1rem 1rem;
		padding: 1rem;
		border: 2px solid rgba(#0d0d0d, 0.1);
        background-color: #eee;
	}
	hr {
		border: none;
		border-top: 2px solid rgba(#0d0d0d, 0.3);
		margin: 0.3rem 0;
	}
	img {
		width: 100%;
		height: auto;
		// margin: 0 2px;
	}
	.img-container {
		margin: 0 2px;
	}

    .ProseMirror-separator {
        visibility:hidden;//此class的dom导致无法选择行末尾的内联节点,因此隐藏元素只保留交互
    }
}
// .headless {
    // .ProseMirror {
    //     img{
    //         width:100%
    //     }
    // }
// }
</style>

<style lang="less" scoped>
@import '@/utils/less/scrollbar.less';
@content: .editor__content;
@footer:.editor__footer;
@class:@content@footer;
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
		overflow-y: hidden;
        // max-width:700px;
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
		// font-family: inherit;
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
	padding: 0.5rem 0.75rem;
	flex: 1 1 auto;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
}
.editor__footer {
    width:100%;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto ;
    overflow-x: overlay ;
	// flex: 0 0 auto;
	// flex-wrap: wrap;
    min-height:40px;
    height:40px;
    height:auto;
	padding: 5px;
	border-top: 3px solid #0d0d0d;
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
