import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Image from '@tiptap/extension-image';
import ImageResizeComponent from './ImageResizeComponent.vue';


const ImageResizeModule = Image.extend({
	name: 'image',//module name
    
	addAttributes() {
		return {
			...this.parent?.(),
            width: {
                default: null,
                renderHTML: (attributes) => {
                    return {
                    width: attributes.width
                    }
                },
            },
            height: {
                default: null,
                renderHTML: (attributes) => {
                    return {
                        height: attributes.height,
                    };
                },
            },
            scalePercent:{
                default: 0,
            }
		};
	},
    addNodeView() {
        return VueNodeViewRenderer(ImageResizeComponent)
	},
    // addCommands() {
    //     return {
    //         changeImage: (options:any) => ({ commands }) => {
    //                 return commands.updateAttributes('image', options)
    //         },
    //     }
    // },
	// renderHTML(props) {
	// 	const { HTMLAttributes,node } = props;
    //     HTMLAttributes.width=node.attrs.width
    //     HTMLAttributes.height=node.attrs.height
	// 	return ['img', HTMLAttributes];
	// },

 
});

// export { ImageResizeModule };
export default ImageResizeModule;