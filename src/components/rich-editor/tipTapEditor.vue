<template>
	<div class="tip-container">
		<n-space>
			<n-button dashed @click="bold" :class="bold_class"> Bold </n-button>
			<n-button dashed @click="code"> Code </n-button>
		</n-space>

		<EditorContent ref="editorRef" v-bind="$attrs" :editor="editor">
			<!-- <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots" >
                <slot :name="slotName" v-bind="slotProps"></slot>
            </template> -->
		</EditorContent>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, Ref, ref, ShallowRef, useAttrs, useSlots, watch } from 'vue';
import { useEditor, EditorContent, Editor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import { CashOutline as CashIcon } from '@vicons/ionicons5';

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
	extensions: [
		BulletListConfigure,
		StarterKit.configure({
			codeBlock: {
				HTMLAttributes: {
					class: 'my-custom-class',
				},
			},
		}),
		// Code.configure({
		//     HTMLAttributes: {
		//         class: 'my-custom-class',
		//     },
		// })
	],
	content: modelValue,
	onUpdate: ({ editor }) => {
		// HTML
		emits('update:modelValue', editor.getHTML());
		console.log(editor.getHTML());

		// JSON
		// emits('update:modelValue', editor.getJSON())
	},
});

// const editorOption= {
//     modules: {
//         syntax: {
//             highlight: (text:string) => {
//                 return hljs.highlightAuto(text).value // 这里就是代码高亮需要配置的地方
//             }
//         }
//     }
// }

const editorRef = ref();

const bold = () => editor.value?.chain().focus().toggleBold().run();
const bold_class = { 'is-active': editor.value?.isActive('bold') };
const code = () => editor.value?.chain().focus().toggleCodeBlock().run();

onMounted(() => {});

onBeforeUnmount(() => {
	editor.value?.destroy();
});

watch(
	() => modelValue,
	(newValue, oldValue) => {
		// HTML
		const isSame = editor.value?.getHTML() === oldValue;

		// JSON
		// const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

		if (isSame) {
			return;
		}

		editor.value?.commands.setContent(newValue, false);
	}
);

// const quillReady=()=>{
//     console.log('quill-editor is ready');
// console.log('useAttrs',useAttrs());
// console.log('useSlots',useSlots());
//     @textChange="quillChange()"
//     @ready="quillReady"
// }

defineExpose({
	editorRef,
});
</script>

<script lang="ts"></script>

<style lang="less">
@import '@/utils/less/scrollbar.less';
@class:.ProseMirror;
.scrollbar-to(@class);

//↓scoped class
.ProseMirror {
	min-height: 300px;
	max-height: 450px;
	margin-bottom: 10px;
	margin-top: 10px;
	padding: 12px 15px;
	text-align: left;
	border: 1px solid #000;
	border-radius: 3px;
	white-space: pre-wrap;
	overflow-y: auto;
	.my-custom-class {
		background-color: #23241f;
		color: #f8f8f2;
		overflow: visible;
		border-radius: 3px;
		white-space: pre-wrap;
		margin-bottom: 5px;
		margin-top: 5px;
		padding: 5px 10px;
	}
}
.ProseMirror-focused:focus {
	outline: none;
}

.scrollable {
	cursor: default;
}

</style>

<style lang="less" scoped>
.tip-container {
	width: 100%;
	max-height: 100%;
	// min-height: calc(100vh - 66px);
	// background-color: #ccc;
	// margin: 0 auto;
	// display: flex;
	// justify-content: center;
	// align-items: center;
}
</style>
