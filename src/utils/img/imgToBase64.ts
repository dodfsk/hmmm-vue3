export const fileToBase64 = (file:File, callback:Function) =>{
    const reader = new FileReader()
    reader.onload = (e)=>{
        const src=e.target?.result
        if(typeof callback === 'function') {
            callback(src)
        } else {
            console.log("我是base64:", src);
            return src
        }

    }
    /* readAsDataURL 方法会读取指定的 Blob 或 File 对象
    ** 读取操作完成的时候，会触发 onload 事件
    *  result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
    */ 
    reader.readAsDataURL(file);
}

