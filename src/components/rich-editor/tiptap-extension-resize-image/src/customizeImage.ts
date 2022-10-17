import Image from '@tiptap/extension-image';

// import ResizableImageTemplate from './ResizableImageTemplate.vue';


 const CustomImage = Image.extend({

    name: 'CustomImage',
    addAttributes() {
        return {
            ...this.parent?.(),
            src: {
                default: null,
                renderHTML: attributes => {
                    return {
                        src: attributes.src,
                    };
                },
            },
            width: { default: null },
            height: { default: null },
            class: { default: null },
            isDraggable: {
                default: true,
                renderHTML: () => {
                    // return {};
                },
            },

        };

    },

    addNodeView() {
        return () => {

            const container = document.createElement('div')

            const content = document.createElement('div')
            container.append(content)

            return {
                dom: container,
                contentDOM: content,
            }

        }
    },
})

export { CustomImage };

export default CustomImage;
