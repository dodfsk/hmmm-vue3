

//         //     <input id="npt" type="file">
//         //     <br>
//         // 原图：<img id="original" src="" alt="" />
//         // 裁剪后：<img id="later" src="" alt="" />

// let canvas = document.createElement("canvas");// 创建canvas对象
// let ctx = canvas.getContext('2d');

// let original = document.querySelector("#original") as any;
// let later = document.querySelector("#later") as any;
// let clone = [{x:170,y:100},{xx:370,yy:520}];//x y为要裁剪的左上角的坐标，xx yy为右下角的坐标


// // 获取图片base64数据
// let npt = document.getElementById("npt") as any;
// npt!.onchange = function () {
//     let reader = new FileReader();
//     reader.readAsDataURL(npt.files[0]);
//     reader.onloadend = function (e) {
//         original.src = e.target?.result;
//         // console.log(e.target.result);// 图片的base64数据
//         getImage(e.target?.result)
//     };
// };

// // 创建图片
// let getImage = function(b64:any){
//     // 创建图片对象
//     let image = new Image();
//     image.src = `${b64}`;
//     image.onload = ()=>{
//         // 获取原图宽高
//         let height = image.height;
//         let width = image.width;
//         //设置canvas大小与原图宽高一致
//         canvas.height = height;
//         canvas.width = width;
//         // 在canvas绘制图片
//         ctx!.drawImage(image,0, 0,width,height);
//         // 截图：
//         drawRect();
//     }
// };

// // 绘制截图矩阵
// let drawRect =  ()=>{
//     // 截图宽度
//     let w = clone[1].xx! - clone[0].x!;
//     // 截图高度
//     let h = clone[1].yy! - clone[0].y!;
//     // 获取截图区域内容,截图区域的像素点矩阵
//     let cutImage = ctx!.getImageData(clone[0].x as number,clone[0].y as number,w,h);
//     // 裁剪后的base64数据
//     let newImage = createNewCanvas(cutImage,w,h);
//     later.src = newImage;
//     // console.log(newImage);// 裁剪后的base64数据
// };

// //创建新的空白canvas画布将矩阵渲染截图
// let createNewCanvas = function (content:any,width:any,height:any){
//     let nCanvas = document.createElement('canvas');
//     let nCtx = nCanvas.getContext('2d') as any;
//     nCanvas.width = width;
//     nCanvas.height = height;
//     nCtx.putImageData(content,0,0);// 将画布上指定矩形的像素数据，通过 putImageData() 方法将图像数据放回画布
//     return nCanvas.toDataURL('image/png');
// }

type Options={
    container:string,
    width:string,
    height:string,
}
export class ImgResize {
    private container:HTMLElement   //传入目标容器
    private original : HTMLImageElement = new Image()    // 原始图片
    private toImg : HTMLImageElement = new Image()    //  修改后的图片
    private reader : FileReader = new FileReader()  //  文件读取器
    private mask : HTMLDivElement = document.createElement('div') as HTMLDivElement   //裁剪框
    private file:File
    private result:any

    constructor(file:File,options:Options){
        console.log(options);
        this.file=file
        this.container=document.querySelector(options.container) as HTMLElement
        this.container.style.width=options.width
        this.container.style.height=options.height


        this.init()
    }

    init(){
        this.container.appendChild(this.original)
        this.container.appendChild(this.mask)

        this.original.style.objectFit='contain'
        this.original.style.width='100%'
        this.original.style.height='100%'

        this.reader.readAsDataURL(this.file)
        this.reader.onload=(e)=>{
            const src=e.target?.result as string
            this.original.setAttribute('src', src)
        }

    }
    
}