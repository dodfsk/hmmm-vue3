type Options = {
	//-----主容器-----//
	container: string //容器#id
	cWidth: number //容器宽
	cHeight: number //容器高
	//-----预览容器-----//
	pre?: string
	pWidth?: number //容器宽
	pHeight?: number //容器高
	//-----输出相关-----//
	fixed?: number //固定尺寸,例1920/1080
	quality?: number
	outputWidth?: number //最终输出图像的宽
	outputHeight?: number //最终输出图像的高
}
type ImgData = {
	width: number
	height: number
}
type SelectionP = {
	x: number
	y: number
	width: number
	height: number
}
type EventRecord = {
	allowDrap: boolean
	allowScale: boolean
	allowMove: boolean
	x: number
	y: number
	left: number
	top: number
	right: number
	bottom: number
	width: number //记录原宽度
	height: number //记录原高度
}
type Direction = 'nw' | 'ne' | 'se' | 'sw'

export type Result = {
	base64?: string
	file: File | null
}

export class ImgClipper {
	public container: HTMLElement //传入目标容器
	public pre?: HTMLElement //传入目标容器
	public reader: FileReader = new FileReader() //  文件读取器
	public original: HTMLImageElement = new Image() // 原始图片实例
	public alter: HTMLImageElement = new Image() //  修改后的图片
	public preview: HTMLImageElement = document.createElement('img') //预览区域
	public box: HTMLDivElement = document.createElement('div') //操作区域
	public canvas: HTMLCanvasElement = document.createElement('canvas') //canvas
	public selection: HTMLDivElement = document.createElement('div') //选择区域
	public file: File //传入的图片file
	public options: Options
	public result: Result = {
		base64: '',
		file: null,
	} //返回的图片
	// public sizeRatio:string='auto'
	// public scaleRatio:number=1

	public imgOriginal: ImgData = {
		//原始图片信息
		width: 0,
		height: 0,
	}
	public selectionP: SelectionP = {
		//选择区域的左下和宽高
		x: 0,
		y: 0,
		width: 100,
		height: 100,
	}
	public eventRecord: EventRecord = {
		allowDrap: false,
		allowScale: false,
		allowMove: false,
		x: 0,
		y: 0,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		width: 0,
		height: 0,
	}

	constructor(file: File, options: Options) {
		console.log(file, options)
		this.file = file
		this.options = options
		this.container = document.querySelector(options.container) as HTMLElement
		console.log(this.container)
		this.container.style.maxWidth = '100%'
		this.container.style.maxHeight = '100%'
		this.container.style.width = options.cWidth + 'px'
		this.container.style.height = options.cHeight + 'px'
		this.container.style.position = 'relative'
		this.container.style.backgroundImage = 'repeating-conic-gradient(#CCC 0deg, #CCC 25%, #FFF 0deg, #FFF 50%)'
		this.container.style.backgroundSize = '1rem 1rem'
		///////container样式
		this.container.style.outline = '1px solid #ccc'
		// this.container.style.minHeight = '200px'
		this.container.style.overflow = 'hidden'

		if (options.pre) {
			this.pre = document.querySelector(options.pre) as HTMLElement
			this.pre.style.width = options.pWidth + 'px'
			this.pre.style.height = options.pHeight + 'px'
			this.pre.style.backgroundImage = 'repeating-conic-gradient(#CCC 0deg, #CCC 25%, #FFF 0deg, #FFF 50%)'
			this.pre.style.backgroundSize = '1.5rem 1.5rem'
			this.pre.style.outline = '1px solid #ccc'
			this.pre.style.overflow = 'hidden'
		}
		this.init()
	}
	//初始化入口
	init() {
		this.container.appendChild(this.box)
		this.box.style.width = this.container.style.width
		this.box.style.height = this.container.style.height
		// this.box.style.maxWidth = this.container.style.width
		// this.box.style.maxHeight = this.container.style.height
		this.box.style.display = 'flex'
		this.box.style.justifyContent = 'center'
		this.box.style.alignItems = 'center'
		this.initOriginal()
		this.initSelection()
	}
	//初始化原始图片
	initOriginal() {
		//初始化图片
		this.box.appendChild(this.original)
		this.original.setAttribute('id', 'clipper-original')
		this.original.setAttribute('style', '-webkit-user-drag:none;') //关闭拖拽动作
		// this.original.setAttribute("style","filter:brightness(0.5)")//滤镜模式
		this.original.style.objectFit = 'contain'
		// this.original.style.border='2px solid #000'
		this.original.style.maxWidth = '100%'
		this.original.style.maxHeight = '100%'
		this.original.style.margin = '0'
		this.original.style.padding = '0'
		this.original.style.userSelect = 'none'
		this.original.style.position = 'absolute'
		this.original.crossOrigin = 'Anonymous'
		this.original.style.pointerEvents = 'none' //当点击事件发生在元素上时,不进行任何操作

		this.reader.readAsDataURL(this.file)
		this.reader.onload = (e) => {
			const src = e.target?.result as string
			this.original.setAttribute('src', src)
			this.original.onload = () => {
				// 图片原始尺寸
				this.imgOriginal.width = this.original.naturalWidth
				this.imgOriginal.height = this.original.naturalHeight
				// this.canvas.width=this.original.offsetWidth
				// this.canvas.height=this.original.offsetHeight
				// this.canvas.getContext('2d')?.drawImage(this.original,0,0,this.original.offsetWidth,this.original.offsetHeight)
				// console.log(this.canvas.toDataURL("image/png"))
				// 最大尺寸限制
				// let maxWidth = 400, maxHeight = 400;
				// // 图片尺寸超过400x400的限制
				// if (originWidth > maxWidth || originHeight > maxHeight) {
				//     alert("图片过大，请选择400*400以下的图片");
				//     return false;
				// }
				// this.initMask()
				this.initPreview()
			}
		}
	}
	initPreview() {
		if (this.pre) {
			// this.preview.width = this.options.pWidth!
			// this.preview.height = this.options.pHeight!
			this.preview.src = this.original.src
			this.preview.style.position = 'relative'
			this.preview.style.userSelect = 'none'
			this.previewEvent()
			this.pre.appendChild(this.preview)
		}
	}
	//初始化遮罩层
	// initMask(){
	//     this.box.appendChild(this.mask)
	//     this.mask.setAttribute("id","clipper-mask")
	//     this.mask.style.width=this.imgOriginal.width+'px'
	//     this.mask.style.height=this.imgOriginal.height+'px'
	//     this.mask.style.backgroundColor='#000'
	//     this.mask.style.opacity='0.5'
	//     this.mask.style.position='absolute'
	// }
	//初始化选择框
	initSelection() {
		this.box.appendChild(this.selection)

		this.selection.setAttribute('id', 'clipper-selection')
		// this.selection.setAttribute("style","-webkit-touch-callout:none")//关闭长按动作
		// this.selection.setAttribute("style","backdrop-filter:brightness(2)")//滤镜模式
		this.selection.style.outline = '1px solid rgba(0, 0, 0, 0.65)' //外边框模式
		this.selection.style.outlineWidth = '3000px'
		this.selection.style.border = '1px dashed rgba(238, 238, 238, 1)'
		this.selection.style.boxSizing = 'border-box'
		this.selection.style.width = 100 + 'px'
		this.selection.style.height = (this.options.fixed ? 100 / this.options.fixed : 100) + 'px'
		this.selection.style.cursor = 'move'
		this.selection.style.position = 'absolute'
		this.selection.style.zIndex = '999'
		this.selection.style.touchAction = 'none' //当触控事件发生在元素上时,不进行任何操作
		this.selection.tabIndex = 0

		this.selection.style.left = (this.options.cWidth - 100) / 2 + 'px'
		this.selection.style.top = (this.options.cHeight - 100) / 2 + 'px'

		// this.selection.style.maxWidth=this.options.outputWidth||'100%'
		// this.selection.style.maxHeight=this.options.outputHeight||'100%'

		//拖动选择框
		this.selection.onpointerdown = (e: PointerEvent) => {
			// console.log(e);
			e.preventDefault()
			e.stopPropagation()
			// console.log(e.clientX,e.clientY,this.selection.offsetLeft,this.selection.offsetTop);

			this.setEventRecord(e)

			this.selection.style.left = this.eventRecord.left + 'px'
			this.selection.style.right = ''
			this.selection.style.top = this.eventRecord.top + 'px'
			this.selection.style.bottom = ''

			this.eventRecord.allowDrap = true //设为true表示可以移动
			this.selection.focus() //手动为div触发onfocus事件
			// console.log(this.eventRecord);
			//-------挂载事件-------//
			window.onpointermove = (e) => this.dragEvent(e)
			window.onpointerup = (e) => {
				e.preventDefault()
				e.stopPropagation()
				this.eventRecord.allowDrap = false //设为true表示可以移动
				window.onpointermove = () => null
				// window.onpointerup=()=>null
			}
		}
		//键盘上下左右微调位置

		this.selection.onfocus = (e) => {
			e.preventDefault()
			e.stopPropagation()
			// console.log('focus');
			this.eventRecord.allowMove = true
			//-------挂载事件-------//
			window.onkeydown = (e) => this.moveEvent(e)
		}
		this.selection.onblur = (e) => {
			e.preventDefault()
			e.stopPropagation()
			// console.log('blur');
			this.eventRecord.allowMove = false
			window.onkeydown = () => null
		}

		// this.selection.addEventListener('mousedown',this.mouseDown)
		// this.selection.addEventListener('mouseup',this.mouseUp)

		this.initSelectionChild()
	}
	//初始化选择区域四个角的拉伸按钮
	initSelectionChild() {
		const directionList: Array<Direction> = ['nw', 'ne', 'sw', 'se'] //四角-左上-右上-左下-右下(最后生成)
		for (let direction of directionList) {
			const span = document.createElement('span') as HTMLSpanElement
			span.setAttribute('id', `${direction}-resizer`)
			span.style.backgroundColor = 'rgba(51, 153, 255)'
			span.style.opacity = '0.7'
			span.style.position = 'absolute'
			span.style.border = '1px solid #ccc'
			span.style.height = '8px'
			span.style.width = '8px'
			switch (direction) {
				case 'nw':
					span.style.left = '-4px'
					span.style.top = '-4px'
					span.style.cursor = 'nwse-resize'
					break

				case 'ne':
					span.style.right = '-4px'
					span.style.top = '-4px'
					span.style.cursor = 'nesw-resize'
					break

				case 'se':
					span.style.right = '-5px'
					span.style.bottom = '-5px'
					span.style.cursor = 'nwse-resize'
					span.style.backgroundColor = 'green'
					span.style.height = '10px'
					span.style.width = '10px'
					break

				case 'sw':
					span.style.left = '-4px'
					span.style.bottom = '-4px'
					span.style.cursor = 'nesw-resize'
					break
			}
			span.onpointerdown = (e: PointerEvent) => {
				e.preventDefault()
				e.stopPropagation()
				// this.eventRecord.x = e.clientX - this.selection.offsetLeft//鼠标-选择框的左距离=偏差值
				// this.eventRecord.y = e.clientY - this.selection.offsetTop//鼠标-选择框的上距离=偏差值

				// this.eventRecord.sx = e.clientX - span.offsetLeft;//鼠标位置-四角的左距离=偏差值
				// this.eventRecord.sy = e.clientY - span.offsetTop;//鼠标位置-四角的上距离=偏差值

				//记录选择框改变前的数值-左边/上边/右边/下边
				this.setEventRecord(e)

				this.eventRecord.allowScale = true //设为true表示可以缩放
				switch (direction) {
					case 'nw':
						this.selection.style.left = ''
						this.selection.style.right = this.eventRecord.right + 'px'
						this.selection.style.top = ''
						this.selection.style.bottom = this.eventRecord.bottom + 'px'
						break

					case 'ne':
						this.selection.style.left = this.eventRecord.left + 'px'
						this.selection.style.right = ''
						this.selection.style.top = ''
						this.selection.style.bottom = this.eventRecord.bottom + 'px'
						break

					case 'se':
						this.selection.style.left = this.eventRecord.left + 'px'
						this.selection.style.right = ''
						this.selection.style.top = this.eventRecord.top + 'px'
						this.selection.style.bottom = ''
						break

					case 'sw':
						this.selection.style.left = ''
						this.selection.style.right = this.eventRecord.right + 'px'
						this.selection.style.top = this.eventRecord.top + 'px'
						this.selection.style.bottom = ''
						break
				}
				// console.log(this.eventRecord);
				//-------挂载事件-------//
				window.onpointermove = (e) => this.scaleEvent(e, direction)
				window.onpointerup = (e) => {
					e.preventDefault()
					e.stopPropagation()
					this.eventRecord.allowScale = false //设为true表示可以缩放
					window.onpointermove = () => null
					window.onpointerup = () => null
				}
			}
			this.selection.appendChild(span)
		}
	}
	//记录选择框的位置信息
	setSelectionP() {
		this.selectionP.x = this.selection.offsetLeft - this.original.offsetLeft
		this.selectionP.y = this.selection.offsetTop - this.original.offsetTop
		this.selectionP.width = this.selection.offsetWidth
		this.selectionP.height = this.selection.offsetHeight
	}
	//记录选择框改变前的数值-左边/上边/右边/下边
	setEventRecord(e?: PointerEvent) {
		//如果传入了event,记录pointer事件坐标
		if (e) {
			this.eventRecord.x = e.clientX
			this.eventRecord.y = e.clientY
		}
		// this.eventRecord.width = this.selection.offsetWidth
		// this.eventRecord.height = this.selection.offsetHeight
		//采用getBoundingClientRect方法获取更精确的宽高
		this.eventRecord.width = this.selection.getBoundingClientRect().width
		this.eventRecord.height = this.selection.getBoundingClientRect().height
		this.eventRecord.left = this.selection.offsetLeft
		this.eventRecord.top = this.selection.offsetTop
		this.eventRecord.right = this.container.offsetWidth - (this.eventRecord.left + this.eventRecord.width)
		this.eventRecord.bottom = this.container.offsetHeight - (this.eventRecord.top + this.eventRecord.height)
	}
	//拖拽事件
	dragEvent(e: PointerEvent) {
		e.preventDefault()
		e.stopPropagation()
		// console.log(this.container.offsetWidth,this.container.offsetHeight);
		// if(e.pointerType=='mouse' &&e.buttons==1)

		if (this.eventRecord.allowDrap) {
			//选择框位置=移动事件鼠标位置-按下事件鼠标位置
			const left = this.eventRecord.left + (e.clientX - this.eventRecord.x)
			const top = this.eventRecord.top + (e.clientY - this.eventRecord.y)
			const right = this.container.offsetWidth - this.eventRecord.width
			const bottom = this.container.offsetHeight - this.eventRecord.height

			//边距3自动吸附
			const adsorbSize = 3

			if (left < adsorbSize) {
				this.selection.style.left = 0 + 'px'
			} else if (left > right - adsorbSize) {
				this.selection.style.left = right + 'px'
			} else {
				this.selection.style.left = left + 'px'
			}

			if (top < adsorbSize) {
				this.selection.style.top = 0 + 'px'
			} else if (top > bottom - adsorbSize) {
				this.selection.style.top = bottom + 'px'
			} else {
				this.selection.style.top = top + 'px'
			}
			this.previewEvent()
		} else return
	}
	//缩放事件
	scaleEvent(e: PointerEvent, d: Direction) {
		e.preventDefault()
		e.stopPropagation()

		if (this.eventRecord.allowScale) {
			const x = e.clientX - this.eventRecord.x
			const y = e.clientY - this.eventRecord.y
			const fixed = this.options.fixed
			let newW: number
			let newH: number
			let maxW: number
			let maxH: number
			switch (d) {
				case 'nw': //左上
					newW = this.eventRecord.width - x
					newH = fixed ? newW / fixed : this.eventRecord.height - y
					maxW = this.container.offsetWidth - this.eventRecord.right
					maxH = this.container.offsetHeight - this.eventRecord.bottom
					break

				case 'ne': //右上
					newW = this.eventRecord.width + x
					newH = fixed ? newW / fixed : this.eventRecord.height - y
					maxW = this.container.offsetWidth - this.eventRecord.left
					maxH = this.container.offsetHeight - this.eventRecord.bottom
					break

				case 'se': //右下
					newW = this.eventRecord.width + x
					newH = fixed ? newW / fixed : this.eventRecord.height + y
					maxW = this.container.offsetWidth - this.eventRecord.left
					maxH = this.container.offsetHeight - this.eventRecord.top
					break

				case 'sw': //左下
					newW = this.eventRecord.width - x
					newH = fixed ? newW / fixed : this.eventRecord.height + y
					maxW = this.container.offsetWidth - this.eventRecord.right
					maxH = this.container.offsetHeight - this.eventRecord.top
					break
			}
			//处理固定尺寸时的越界
			if (fixed) {
				maxW / fixed <= maxH ? (maxH = maxW / fixed) : (maxW = maxH * fixed)
			}
			//更新宽高↓
			//width
			if (newW > 0 && newW < maxW) {
				this.selection.style.width = newW + 'px'
			} else if (newW <= 0) {
				this.selection.style.width = '0px'
			} else if (newW > maxW) {
				this.selection.style.width = maxW + 'px'
			}
			//height
			if (newH > 0 && newH < maxH) {
				this.selection.style.height = newH + 'px'
			} else if (newH <= 0) {
				this.selection.style.height = '0px'
			} else if (newH > maxH) {
				this.selection.style.height = maxH + 'px'
			}
			this.previewEvent()
		}
	}
	//预览事件
	previewEvent() {
		if (!this.pre) {
			return
		}
		this.setSelectionP()
		const { x, y, width, height } = this.selectionP

		// this.pre.style.width = width  + 'px'
		// this.pre.style.height = height+ 'px'

		const preRatio = this.options.pWidth! / width
		// const preRatioWidth = this.options.pWidth! / width
		// const preRatioHeight = this.options.pHeight! / width

		this.preview.style.width = this.original.offsetWidth * preRatio + 'px'
		this.preview.style.height = this.original.offsetHeight * preRatio + 'px'
		this.preview.style.left = -x * preRatio + 'px'
		this.preview.style.top = -y * preRatio + 'px'
		// this.preview.style.top = -y * preRatioHeight + 'px'
	}
	//拖拽事件
	moveEvent(e: KeyboardEvent) {
		e.preventDefault()
		e.stopPropagation()

		//键盘事件xy不用记录
		this.setEventRecord()

		if (this.eventRecord.allowMove) {
			//选择框位置=移动事件鼠标位置-按下事件鼠标位置
			const { left, top, right, bottom } = this.eventRecord

			if (e.key == 'ArrowLeft' && left > 0) {
				console.log('ArrowLeft', left)
				this.selection.style.left = left - 1 + 'px'
			}
			if (e.key == 'ArrowUp' && top > 0) {
				console.log('ArrowUp', top)
				this.selection.style.top = top - 1 + 'px'
			}
			if (e.key == 'ArrowRight' && right > 0) {
				console.log('ArrowRight', right)
				this.selection.style.left = left + 1 + 'px'
			}
			if (e.key == 'ArrowDown' && bottom > 0) {
				console.log('ArrowDown', bottom)
				this.selection.style.top = top + 1 + 'px'
			}

			this.previewEvent()
		} else return
	}
	//剪裁事件
	getAlterResult() {
		return new Promise((resolve) => {
			const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
			ctx!.imageSmoothingQuality = 'high'

			const ratio = this.imgOriginal.width / this.original.offsetWidth //渲染图像与原始图像的比例
			const pixelRatio = window.devicePixelRatio
			const quality = this.options.quality ?? 0.92
			// console.log('ratio,pixelRatio',ratio,pixelRatio);

			this.setSelectionP()
			const { x, y, width, height } = this.selectionP
			const { outputWidth, outputHeight } = this.options
			//初始化canvas宽高
			this.canvas.width = outputWidth || width * ratio
			this.canvas.height = outputHeight || height * ratio

			// console.log(this.container.offsetLeft,this.original.offsetLeft);
			// console.log(this.container.offsetTop,this.original.offsetTop);

			// 创建图片
			ctx?.drawImage(
				this.original,
				x * ratio,
				y * ratio,
				width * ratio,
				height * ratio, //原始图像裁取部分-原始尺寸
				0,
				0,
				this.canvas.width,
				this.canvas.height //从0,0坐标开始填充画图-目标尺寸
			)
			ctx.scale(pixelRatio, pixelRatio)
			//保存base64
			let imgbase64 = this.canvas.toDataURL('image/png')
			this.original.src = imgbase64
			this.result.base64 = imgbase64
			// console.log(imgbase64);
			const alterName = this.file.name

			//保存file
			this.canvas.toBlob(
				(blob) => {
					if (blob)
						this.result.file = new File([blob], alterName, {
							type: 'image/webp',
							// type: 'image/png',
						})
					resolve(this.result)
				},
				'image/webp',
				// this.file.type,
				quality
			)
		})
	}

	getFile() {
		return Promise.resolve(this.result)
	}
}
