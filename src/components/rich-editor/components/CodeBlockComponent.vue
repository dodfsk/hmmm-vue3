<template>
	<node-view-wrapper class="code-block">
		<select contenteditable="false" v-model="selectedLanguage">
			<option :value="null">auto</option>
			<option disabled>—</option>
			<option v-for="(language, index) in languages" :value="language" :key="index">
				{{ language }}
			</option>
		</select>
		<pre><code :language="props.node.attrs.language"><node-view-content style="white-space: pre;"/></code></pre>
	</node-view-wrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)
const selectedLanguage = computed({
	get: () => {
		return props.node.attrs.language
	},
	set: (language: any) => {
		props.updateAttributes({ language })
	},
})
const languages = ref(props.extension.options.lowlight.listLanguages()) //踩坑,原因不明的全部列出
console.log(props.node.attrs)
</script>

<style lang="less">
@import '@/utils/less/scrollbar.less';
.code-block {
	position: relative;
    .scrollbar-to(select);

	select {
        // display: none;
        font-size: 10px;
		position: absolute;
		bottom: 0.3rem;
		right: 0.3rem;
		border-radius: 0.2rem;
		user-select: none;
        background-color: #000;
        color: #fff;
        opacity: 0.2;
        width: auto;
	}
    select:focus{
        display: block;
		//   display: none;
        opacity: 1;
    }
}
//   .code-block:hover {
//     select{
//         display: block;
// 		//   display: none;
//     }
//   }
</style>
