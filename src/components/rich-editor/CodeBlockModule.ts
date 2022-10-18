import { VueNodeViewRenderer } from '@tiptap/vue-3';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlockComponent from './CodeBlockComponent.vue';
import { lowlight } from 'lowlight/lib/common';

console.log(lowlight.listLanguages());

const CodeBlockLowlightModule = CodeBlockLowlight.extend({
    addAttributes(){
        return{
            ...this.parent?.(),
            language:{
                default:null,
                renderHTML: (attributes) =>{ 
                    return {
                        language:attributes.language
                    } 
                }
            }
        }
    },
	addNodeView() {
		return VueNodeViewRenderer(CodeBlockComponent);
	},
}).configure({ 
    lowlight, 
    // defaultLanguage: 'typescript' 
});

// export { ImageResizeModule };
export default CodeBlockLowlightModule;
