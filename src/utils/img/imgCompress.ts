export const imgCompress=(base64:string, callback:Function)=> {
    var targSize = 1024 * 1024 //1024KB  
    if (base64.length <= targSize) {
        callback(base64);
        // console.log("直接返回")
        return
    }
    var newImage = new Image();
    newImage.src = base64;
    console.log(base64.length)
    newImage.setAttribute("crossOrigin", 'Anonymous'); //url为外域时需要  
    newImage.onload = () => {
        var quality = 0.99; //压缩系数0-1之间
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(newImage, 0, 0, canvas.width, canvas.height);
        var base64 = canvas.toDataURL("image/png", quality); //压缩语句
        // 如想确保图片压缩到自己想要的尺寸,如要求在5-10kb之间，请加以下语句，quality初始值根据情况自定
        // console.log(base64.length + "循环1压缩" + (base64.length / 1024 > 512))
        
        // while (base64.length > targSize) {
        //     quality -= 0.05;
        //     // console.log(base64.length + "循环压缩" + quality)
        //     base64 = canvas.toDataURL("image/jpeg", quality);
        // }
        console.log(base64.length)

        callback(base64); //必须通过回调函数返回，否则无法及时拿到该值
    }
}
