//使用canvas将jpg/png转为webp来压缩图片大小
type CallBack = (res: string) => void

export const imgCompress = (originBase64: string,callback: CallBack) => {
	const img = new Image()
	img.src = originBase64

	// img.setAttribute('crossOrigin', 'Anonymous') //url为外域时需要
	img.onload = () => {
		const quality = 0.8 //默认0.92
		const canvas = document.createElement('canvas')
		canvas.width = img.width
		canvas.height = img.height
		canvas.getContext('2d')?.drawImage(img, 0, 0)
		const resultBase64 = canvas.toDataURL('image/webp', quality) //压缩语句

		callback(resultBase64) //必须通过回调函数返回，否则无法及时拿到该值
	}
}
