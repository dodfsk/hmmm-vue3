import Image from '@tiptap/extension-image';

export const ResizableImage = Image.extend({
  name: 'resizable-image',
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
    };
  },
  renderHTML(props) {
    const { HTMLAttributes } = props;
    return ['img', HTMLAttributes];
  },
});
