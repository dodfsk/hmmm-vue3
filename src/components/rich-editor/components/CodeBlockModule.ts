import { VueNodeViewRenderer } from '@tiptap/vue-3';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlockComponent from './CodeBlockComponent.vue';
// import { lowlight } from 'lowlight/lib/common';
import {common, createLowlight} from 'lowlight'//lowlight@3.0.0开始的用法
const lowlight = createLowlight(common)

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
    //添加快捷键tab为4空格
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
}).configure({ 
    lowlight, 
    // defaultLanguage: 'typescript' 
});

// export { ImageResizeModule };
export default CodeBlockLowlightModule;
