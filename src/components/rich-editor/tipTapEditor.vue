<template>
	<div class="editor-container">

        <div class="editor__header" v-if="editor">
            <input
                type="color"
                @input="editor?.chain().focus().setColor(($event.target as any).value).run()"
                :value="editor.getAttributes('textStyle').color"
            >
            <button @click="editor?.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
            left
            </button>
            <button @click="editor?.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
            center
            </button>
            <button @click="editor?.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
            right
            </button>

            <button 
                class="menu-item" 
                v-for="item in TipTapMenuBar" 
                @click="item.click" 
                :class="item.class&&item.class" 
                :disabled="item.disabled&&item.disabled"
                :title="item.name"
            >
                <n-icon size="18" :component="item.svg" v-if="item.svg"/>
                <div v-else>
                    {{item.name}}
                </div>
            </button>

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
import { computed, inject, onBeforeUnmount, onMounted, reactive, Ref, ref, ShallowRef, useAttrs, useSlots, watch } from 'vue';
import { useEditor, EditorContent, Editor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Color } from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'

import { 
    Bold,Italic,Strikethrough,List,ListNumbers,ListDetails,
    TextWrap,Separator,ClearFormatting,
    Code,Quote,H1,H2,H3,ArrowBackUp,ArrowForwardUp,
} from '@vicons/tabler';

export type DefineExpose = {
	editorRef: InstanceType<typeof EditorContent>;
};
type Props = {
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

const { modelValue } = props;

const BulletListConfigure = BulletList.extend({
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

const editor: ShallowRef<Editor | undefined> = useEditor({
	content: modelValue,
	extensions: [
		StarterKit,
		BulletListConfigure,
        Color,
        TextStyle,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Image.configure({
            allowBase64: true,
        })
	],
	// onUpdate: ({ editor }) => {
	// 	// HTML
	// 	emits('update:modelValue', editor.getHTML());
	// 	console.log(editor.getHTML());

	// 	// JSON
	// 	// emits('update:modelValue', editor.getJSON())
	// },
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


const TipTapMenuBar=computed(()=>[
    {
        name:'bold',
        click:()=>editor.value?.chain().focus().toggleBold().run(),
        class:{ 'is-active': editor.value?.isActive('bold') },
        disabled:!editor.value?.can().chain().focus().toggleBold().run(),
        svg:Bold,
    },
    {
        name:'italic',
        click:()=>editor.value?.chain().focus().toggleItalic().run(),
        class:{ 'is-active': editor.value?.isActive('italic') },
        disabled:!editor.value?.can().chain().focus().toggleItalic().run(),
        svg:Italic,
    },
    {
        name:'strike',
        click:()=>editor.value?.chain().focus().toggleStrike().run(),
        class:{ 'is-active': editor.value?.isActive('strike') },
        disabled:!editor.value?.can().chain().focus().toggleStrike().run(),
        svg:Strikethrough
    },
    {
        name:'h1',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 1 }) },
        svg:H1,
    },
    {
        name:'h2',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 2 }) },
        svg:H2,
    },
    {
        name:'h3',
        click:()=>editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
        class:{ 'is-active': editor.value?.isActive('heading', { level: 3 }) },
        svg:H3,
    },
    {
        name:'bullet list',
        click:()=>editor.value?.chain().focus().toggleBulletList().run(),
        class:{ 'is-active': editor.value?.isActive('bulletList') },
        svg:List,
    },
    {
        name:'ordered list',
        click:()=>editor.value?.chain().focus().toggleOrderedList().run(),
        class:{ 'is-active': editor.value?.isActive('orderedList') },
        svg:ListNumbers,
    },
    {
        name:'task list',
        click:()=>editor.value?.chain().focus().toggleTaskList().run(),
        class:{ 'is-active': editor.value?.isActive('taskList') },
        svg:ListDetails,
    },
    {
        name:'code block',
        click:()=>editor.value?.chain().focus().toggleCodeBlock().run(),
        class:{ 'is-active': editor.value?.isActive('codeBlock') },
        svg:Code,
    },
    {
        name:'blockquote',
        click:()=>editor.value?.chain().focus().toggleBlockquote().run(),
        class:{ 'is-active': editor.value?.isActive('blockquote') },
        svg:Quote,
    },
    {
        name:'horizontal rule',
        click:()=>editor.value?.chain().focus().setHorizontalRule().run(),
        svg:Separator,
    },
    {
        name:'hard break',
        click:()=>editor.value?.chain().focus().setHardBreak().run(),
        svg:TextWrap,
    },
    {
        name:'clear nodes',
        click:()=>editor.value?.chain().focus().clearNodes().run(),
        svg:ClearFormatting,
    },
    {
        name:'undo',
        click:()=>editor.value?.chain().focus().undo().run(),
        class:{ 'is-active': editor.value?.isActive('undo') },
        disabled:!editor.value?.can().chain().focus().undo().run(),
        svg:ArrowBackUp,
    },
    {
        name:'redo',
        click:()=>editor.value?.chain().focus().redo().run(),
        class:{ 'is-active': editor.value?.isActive('redo') },
        disabled:!editor.value?.can().chain().focus().redo().run(),
        svg:ArrowForwardUp,
    },

])


onMounted(() => {});

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
	max-height: 550px;
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0;
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

  ul,ol {
    padding: 0 1rem;
  }
  ul[data-type="taskList"] {
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
        }

        > div {
            flex: 1 1 auto;
        }
    }
  }

  h1,h2,h3,h4,h5,h6 {
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

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

}
</style>

<style lang="less" scoped>
@import '@/utils/less/scrollbar.less';
@class:.editor__content;
.scrollbar-to(@class);

//↓scoped class

.editor-container {
    // width: 100%;
	height: 100%;
    display: flex;
    flex-direction: column;
    max-height: 26rem;
    color: #0d0d0d;
    background-color: #fff;
    border: 3px solid #0D0D0D;
    border-radius: 0.75rem;
}
.editor__header{
    text-align: left;
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: .25rem;
    border-bottom: 3px solid #0D0D0D;
    button{
        // font-size: 18px;
        font-size: inherit;
        font-family: inherit;
        color: #000;
        margin: .1rem;
        border: 1px solid black;
        border-radius: .3rem;
        padding: .1rem .4rem;
        background: white;
        accent-color: black;
    }
    .menu-item {
        width: 1.75rem;
        height: 1.75rem;
        color: #0d0d0d;
        border: none;
        background-color: transparent;
        border-radius: .4rem;
        padding: 0.25rem;
        margin-right: .25rem;
    }
    .menu-item svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
    }
    .menu-item:hover{
        background: black;
        color: #fff;
    }
    .menu-item[disabled]{
        opacity: .3;
        color: #000;
        background: none;
        cursor:not-allowed;
    }

    .is-active {
        background: black;
        color: #fff;
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
