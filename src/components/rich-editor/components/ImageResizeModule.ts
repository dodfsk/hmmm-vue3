import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Plugin, PluginKey } from 'prosemirror-state'
import Image from '@tiptap/extension-image'
import ImageResizeComponent from './ImageResizeComponent.vue'

const ImageResizeModule = Image.extend({
	name: 'image', //module name

    //添加属性
	addAttributes() {
		return {
			...this.parent?.(),
			width: {
				default: null,
				renderHTML: (attributes) => {
					return {
						width: attributes.width,
					}
				},
			},
			height: {
				default: null,
				renderHTML: (attributes) => {
					return {
						height: attributes.height,
					}
				},
			},
			scalePercent: {
				default: null,
			},
		}
	},
    //渲染节点
	addNodeView() {
		return VueNodeViewRenderer(ImageResizeComponent)
	},
    //添加自定义复制粘贴事件
	addProseMirrorPlugins() {
		return [
			new Plugin({
				props: {
					handleDOMEvents: {
                        //拖拽事件
						drop(view, event) {
							const hasFiles =
								event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length
							if (!hasFiles) {
								return
							}
                            
							const images = Array.from(event.dataTransfer.files).filter((file) =>
								(/image/i).test(file.type)
							)

							if (images.length === 0) {
								return
							}

							event.preventDefault()
                            event.stopPropagation()

							const { schema } = view.state
							const coordinates = view.posAtCoords({
								left: event.clientX,
								top: event.clientY,
							})

							images.forEach((image,index) => {
								const reader = new FileReader()
                                if(image.size>1024*1024){
                                    window.$message.error(`图片大小${(image.size/(1024*1024)).toFixed(2)}MB , 此方式上传图片必须小于1M`)
                                }
                                else{
                                    reader.onload = (readerEvent) => {
                                        const node = schema.nodes.image.create({
                                            src: readerEvent.target!.result,
                                            alt: images[index].name
                                        })//创建image节点,src:base64-url,alt:image-name
                                        const transaction = view.state.tr.insert(coordinates!.pos, node)
                                        view.dispatch(transaction)
                                    }
                                    reader.readAsDataURL(image)
                                }
							})
						},
                        //粘贴事件
						paste(view, event) {                            
							const hasFiles =
								event.clipboardData && event.clipboardData.files && event.clipboardData.files.length
                                if (!hasFiles) {
								return
							}

							const images = Array.from(event.clipboardData.files).filter((file) =>
								(/image/i).test(file.type)
							)

							if (images.length === 0) {
								return
							}

							event.preventDefault()
                            event.stopPropagation()

							const { schema } = view.state

							images.forEach((image,index) => {
								const reader = new FileReader()
                                if(image.size>1024*1024){
                                    window.$message.error(`图片大小${(image.size/(1024*1024)).toFixed(2)}MB , 此方式上传图片必须小于1M`)
                                }
                                else{
                                    reader.onload = (readerEvent) => {
                                        const node = schema.nodes.image.create({
                                            src: readerEvent.target!.result,
                                            alt: images[index].name
                                        })//创建image节点,src:base64-url,alt:image-name
                                        const transaction = view.state.tr.replaceSelectionWith(node)
                                        view.dispatch(transaction)
                                    }
                                    reader.readAsDataURL(image)
                                }
                            })
						},
					},
				},
			}),
		]
	},
})
	// addProseMirrorPlugins() {
	//     return [
	//       new Plugin({
	//         key: new PluginKey('eventHandler'),
	//         props: {
	//             handleDOMEvents: {
	//                 drop(view, event) {
	//                   event.preventDefault()
	//                   const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
	//                   const content = event.dataTransfer!.getData('text/plain')
	//                   const transaction = view.state.tr.insertText(content, coordinates!.pos)
	//                   view.dispatch(transaction)
	//                 }
	//               },
	//           handleClick(view, pos, event) { /* … */ },
	//           handleDoubleClick(view, pos, event) { /* … */ },
	//           handlePaste(view, event, slice) {

	//            },
	//         //   handleDrop (view, event) {
	//         //     event.preventDefault()
	//         //             event.stopImmediatePropagation()
	//         //         if (event.dataTransfer?.files?.length !== 1) {
	//         //             return
	//         //         }

	//         //         const images = Array.from(event.dataTransfer.files).filter(file => (/image/i).test(file.type))
	//         //         if (images.length === 1) {

	//         //             const { schema } = view.state
	//         //             const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
	//         //             const reader = new FileReader()
	//         //             reader.onload = (readerEvent) => {
	//         //                 const node = schema.nodes.image.create({
	//         //                     src: readerEvent.target?.result,
	//         //                     alt: images[0].name
	//         //                 })
	//         //                 const transaction = view.state.tr.insert(coordinates!.pos, node)
	//         //                 view.dispatch(transaction)
	//         //             }
	//         //             reader.readAsDataURL(images[0])
	//         //         }
	//         //     },

	//         },
	//       }),
	//     ]
	//   },

// addCommands() {
//     return {
//         changeImage: (options:any) => ({ commands }) => {
//                 return commands.updateAttributes('image', options)
//         },
//     }
// },
// renderHTML(props) {
// 	const { HTMLAttributes,node } = props
//     HTMLAttributes.width=node.attrs.width
//     HTMLAttributes.height=node.attrs.height
// 	return ['img', HTMLAttributes]
// },

// export { ImageResizeModule }
export default ImageResizeModule
