

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
// import '@/utils/img/test.less'

type Options={
    container:string,
    width:string,
    height:string,
}
type ImgData={
    width:number,
    height:number,
}
type EventRecord={
    allowDrap:boolean,
    allowScale:boolean,
    x:number,
    y:number,
    left:number,
    top:number,
    width:number,//记录原宽度
    height:number,//记录原高度
}

type Direction='nw'|'ne'|'se'|'sw'

export class ImgResize {
    public container:HTMLElement   //传入目标容器
    public original : HTMLImageElement = new Image()    // 原始图片实例
    public toImg : HTMLImageElement = new Image()    //  修改后的图片
    public reader : FileReader = new FileReader()  //  文件读取器
    public box : HTMLDivElement = document.createElement('div') as HTMLDivElement   //操作区域
    // private mask : HTMLDivElement = document.createElement('div') as HTMLDivElement   //遮罩层
    public selection : HTMLDivElement = document.createElement('div') as HTMLDivElement   //选择区域
    public file:File
    public result:any

    public imgOriginal:ImgData={//原始图片信息
        width:0,
        height:0,
    }

    public eventRecord:EventRecord={
        allowDrap:false,
        allowScale:false,
        x:0,
        y:0,
        left:0,
        top:0,
        width:0,
        height:0,
    }

    constructor(file:File,options:Options){
        console.log(file,options);
        this.file=file
        this.container=document.querySelector(options.container) as HTMLElement
        this.container.style.maxWidth='100%'
        this.container.style.maxHeight='100%'
        this.container.style.width=options.width
        this.container.style.height=options.height
        this.container.style.position='relative'
        this.container.style.backgroundImage='repeating-conic-gradient(#CCC 0deg, #CCC 25%, #FFF 0deg, #FFF 50%)'
        this.container.style.backgroundSize='1rem 1rem';
        this.init()
    }
    //初始化入口
    init(){
        this.container.appendChild(this.box)
        this.box.style.maxWidth=this.container.style.width
        this.box.style.maxHeight=this.container.style.height
        this.box.style.display='flex'
        this.box.style.justifyContent='center'
        this.box.style.alignItems='center'

        this.initOriginal()
        this.initSelection()

    }
    //初始化原始图片
    initOriginal(){  
        //初始化图片
        this.box.appendChild(this.original)
        this.original.setAttribute("id","clipper-original")
        this.original.setAttribute("style","-webkit-user-drag:none")
        // this.original.setAttribute("style","filter:brightness(0.5)")//滤镜模式
        this.original.style.objectFit='contain'
        this.original.style.maxWidth='100%'
        this.original.style.maxHeight='100%'
        this.original.style.userSelect='none'
        this.original.style.position='absolute'
        // this.original.style.left='0'

        this.reader.readAsDataURL(this.file)
        this.reader.onload=(e)=>{
            const src=e.target?.result as string
            this.original.setAttribute('src', src)
            this.original.onload = ()=>{
                // 图片原始尺寸
                this.imgOriginal.width = this.original.width;
                this. imgOriginal.height = this.original.height;
                // 最大尺寸限制
                // let maxWidth = 400, maxHeight = 400;
                // // 图片尺寸超过400x400的限制
                // if (originWidth > maxWidth || originHeight > maxHeight) {
                //     alert("图片过大，请选择400*400以下的图片");
                //     return false;
                // }
                // this.initMask()
            };
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
    initSelection(){
        this.box.appendChild(this.selection)
        
        this.selection.setAttribute("id","clipper-selection")
        // this.selection.setAttribute("style","backdrop-filter:brightness(2)")//滤镜模式
        this.selection.style.outline='rgba(0, 0, 0, 0.65) solid 1px'//外边框模式
        this.selection.style.outlineWidth='3000px'
        this.selection.style.border='1px dashed rgba(238, 238, 238, 0.5)'
        this.selection.style.boxSizing="border-box"
        this.selection.style.width='100px'
        this.selection.style.height='100px'
        this.selection.style.cursor='move'
        this.selection.style.position='absolute'
        this.selection.style.zIndex='999'
        this.selection.style.touchAction='none'//当触控事件发生在元素上时,不进行任何操作

        this.selection.style.left='43%'
        this.selection.style.top='40%'

        this.selection.onpointerdown=(e)=>{
            console.log(e);   
            e.preventDefault();
            e.stopPropagation();
            // console.log(e.clientX,e.clientY,this.selection.offsetLeft,this.selection.offsetTop);
            this.eventRecord.left = e.clientX - this.selection.offsetLeft;
            this.eventRecord.top = e.clientY - this.selection.offsetTop;
            this.eventRecord.allowDrap = true; //设为true表示可以移动
    
            window.onpointermove=(e)=>this.dragEvent(e)
        }
        window.onpointerup=(e)=>{
            console.log(e);   
            e.preventDefault();
            e.stopPropagation();
            this.eventRecord.allowDrap = false; //设为true表示可以移动
            window.onpointermove=null;
        }
        // this.selection.addEventListener('mousedown',this.mouseDown)
        // this.selection.addEventListener('mouseup',this.mouseUp)

        this.initSelectionChild()
    }
    //初始化选择区域四个角的拉伸按钮
    initSelectionChild(){
        const directionList:Array<Direction>=['nw','ne','sw','se']//四角-左上-右上-左下-右下(最后生成)
        for(let direction of directionList){
            const span=document.createElement('span') as HTMLSpanElement
            span.setAttribute('id',`${direction}-resizer`)
            span.style.backgroundColor='rgba(51, 153, 255)'
            span.style.opacity='0.5'
            span.style.position='absolute'
            span.style.border='1px solid #ccc'
            span.style.height='8px'
            span.style.width='8px'
            switch(direction){
                case 'nw':
                    span.style.left='-4px'
                    span.style.top='-4px'
                    span.style.cursor='nwse-resize'
                break;

                case 'ne':
                    span.style.right='-4px'
                    span.style.top='-4px'
                    span.style.cursor='nesw-resize'
                    break;

                case 'se':
                    span.style.right='-5px'
                    span.style.bottom='-5px'
                    span.style.cursor='nwse-resize'
                    span.style.backgroundColor='green'
                    span.style.height='10px'
                    span.style.width='10px'
                    break;

                case 'sw':
                    span.style.left='-4px'
                    span.style.bottom='-4px'
                    span.style.cursor='nesw-resize'
                    break;
            }
            span.onpointerdown=(e)=>{
                e.preventDefault();
                e.stopPropagation();
                this.eventRecord.x = e.clientX - this.selection.offsetLeft//鼠标-事件源的左距离=偏差值
                this.eventRecord.y = e.clientY - this.selection.offsetTop//鼠标-事件源的上距离=偏差值

                this.eventRecord.left = e.clientX - span.offsetLeft;//鼠标位置-四角的左距离=偏差值
                this.eventRecord.top = e.clientY - span.offsetTop;//鼠标位置-四角的上距离=偏差值

                this.eventRecord.width = this.selection.offsetWidth
                this.eventRecord.height = this.selection.offsetHeight

                this.eventRecord.allowScale = true; //设为true表示可以缩放
                window.onpointermove=(e)=>this.scaleEvent(e,direction)
            }
            window.onpointerup=(e)=>{
                e.preventDefault();
                e.stopPropagation();
                this.eventRecord.allowScale = false; //设为true表示可以缩放
                window.onpointermove=()=>null
            }
            this.selection.appendChild(span)
        }

    }


    //拖拽事件
    dragEvent(e : PointerEvent) {
        e.preventDefault();
        e.stopPropagation();
        if(this.eventRecord.allowDrap){
            //选择框位置=移动事件鼠标位置-按下事件鼠标位置
            const left = e.clientX -  this.eventRecord.left + 'px'
            const top = e.clientY -  this.eventRecord.top + 'px'

            this.selection.style.left=left
            this.selection.style.top=top
        }
        else return

    }
    //缩放事件
    scaleEvent(e:PointerEvent,d:Direction){
        e.preventDefault();
        e.stopPropagation();
        if(this.eventRecord.allowScale){
            const x = e.clientX -  this.eventRecord.x - 4 
            const y = e.clientY -  this.eventRecord.y - 4

            const left = e.clientX -  this.eventRecord.left
            const top = e.clientY -  this.eventRecord.top

            const width=this.eventRecord.width-left
            const height=this.eventRecord.height-top

            switch(d){
                case 'nw':
                    this.selection.style.width= width+'px'
                    this.selection.style.height= height +'px'
                    if(width>1){
                        this.selection.style.left=x+ 'px'
                    }
                    if(height>1){
                        this.selection.style.top=y+ 'px'
                    }

                    // if(this.eventRecord.width-x<=0||this.eventRecord.height-y<=0){
                    //     window.onmousemove=()=>null
                    // }
                break;

                case 'ne':
                    this.selection.style.width= left+'px'
                    this.selection.style.height= this.eventRecord.height - top+'px'
                    // if(width>1){
                    //     this.selection.style.left=x+ 'px'
                    // }
                    if(height>1){
                        this.selection.style.top=y+ 'px'
                    }

                break;

                case  'se':
                    this.selection.style.width=left+'px'
                    this.selection.style.height=top+'px'
                break;

                case 'sw':
                    this.selection.style.width= this.eventRecord.width - left+'px'
                    this.selection.style.height= top+'px'
                    if(width>1){
                        this.selection.style.left=x+ 'px'
                    }
                    // if(height>1){
                    //     this.selection.style.top=y+ 'px'
                    // }
                break;
            }
        }
    }

    
}