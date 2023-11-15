import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Plugin, PluginKey } from 'prosemirror-state'
import ImageModule from '@tiptap/extension-image'
import ImageResizeComponent from './ImageResizeComponent.vue'
import { imgCompress } from '@/utils/img/imgCompress'

const ImageResizeModule = ImageModule.extend({
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
				key: new PluginKey('eventHandler'),
				props: {
					handleDOMEvents: {
						//拖拽事件
						drop(view, event) {
							const hasFiles =
								event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length
							if (!hasFiles) {
								return
							}

							const imagesList = Array.from(event.dataTransfer.files).filter((file) =>
								/image/i.test(file.type)
							)

							if (imagesList.length === 0) {
								return
							}

							event.preventDefault()
							event.stopPropagation()

							const { schema } = view.state
							const coordinates = view.posAtCoords({
								left: event.clientX,
								top: event.clientY,
							})

							imagesList.forEach((imageFile, index) => {
								const reader = new FileReader()

								reader.readAsDataURL(imageFile)
								reader.onload = (readerEvent) => {
									const base64 = readerEvent.target!.result as string
									if (imageFile.type !== 'image/gif') {
										//采用webp压缩方案
										imgCompress(base64, (res) => {
											const node = schema.nodes.image.create({
												src: res,
												alt: imagesList[index].name,
											}) //创建image节点,src:base64-url,alt:image-name
											const transaction = view.state.tr.insert(coordinates!.pos, node)
											view.dispatch(transaction)
										})
									} else {
										//纯前端gif转webp,待实现
										if (imageFile.size > 1024 * 1024) {
											window.$message.error(
												`图片大小${(imageFile.size / (1024 * 1024)).toFixed(
													2
												)}MB , 此方式上传图片必须小于1M`
											)
										} else {
											const node = schema.nodes.image.create({
												src: base64,
												alt: imagesList[index].name,
											}) //创建image节点,src:base64-url,alt:image-name
											const transaction = view.state.tr.insert(coordinates!.pos, node)
											view.dispatch(transaction)
										}
									}
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

							const imagesList = Array.from(event.clipboardData.files).filter((file) =>
								/image/i.test(file.type)
							)

							if (imagesList.length === 0) {
								return
							}

							event.preventDefault()
							event.stopPropagation()

							const { schema } = view.state

							imagesList.forEach((imageFile, index) => {
								const reader = new FileReader()
								reader.readAsDataURL(imageFile)
								reader.onload = (readerEvent) => {
									const base64 = readerEvent.target!.result as string
									if (imageFile.type !== 'image/gif') {
										//采用webp压缩方案
										imgCompress(base64, (res) => {
											const node = schema.nodes.image.create({
												src: res,
												alt: imagesList[index].name,
											}) //创建image节点,src:base64-url,alt:image-name
											const transaction = view.state.tr.replaceSelectionWith(node)
											view.dispatch(transaction)
										})
									} else {
										//纯前端gif转webp,待实现
										if (imageFile.size > 1024 * 1024) {
											window.$message.error(
												`图片大小${(imageFile.size / (1024 * 1024)).toFixed(
													2
												)}MB , 此方式上传gif图片必须小于1M`
											)
										} else {
											const node = schema.nodes.image.create({
												src: base64,
												alt: imagesList[index].name,
											}) //创建image节点,src:base64-url,alt:image-name
											const transaction = view.state.tr.replaceSelectionWith(node)
											view.dispatch(transaction)
										}
									}
								}
							})
						},
					},
				},
			}),
		]
	},
})

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
