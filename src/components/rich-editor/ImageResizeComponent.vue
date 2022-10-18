<template>
	<node-view-wrapper 
        as="span"
        class="img-container" 
        :class="{
            'ProseMirror-selectednode': props.editor.isEditable&&(props.selected || eventRecord.allowScale),
            inline: options.inline,
        }" 
    >
		<img 
            ref="imgRef"
            class="img-content"
            draggable="true"
            data-drag-handle
            :src="attrs.src"
            :style="{
                width:attrs.width+'px',
                height:attrs.height+'px',
            }"
        />
            <!-- v-bind="attrs" -->
        <span 
            class="img-resizer"  
            ref="resizeRef" 
            v-show="isLoaded"
        ></span>
        <!-- @pointerdown="pointerDown" -->

	</node-view-wrapper>
</template>

<script lang="ts" setup>
import { computed,onMounted, reactive, ref,watch } from 'vue';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';

const props=defineProps(nodeViewProps)
const imgRef=ref<HTMLImageElement>()
const resizeRef=ref<HTMLDivElement>()
const attrs = computed(() => props.node.attrs);
const options = computed(() => props.extension.options);
const isLoaded = ref<boolean>(false);
console.log('props.node.attrs',props.node.attrs);
const imgState=reactive({
    width:0,
    height:0,
    ratio:0,
})//原始图片信息
const eventRecord=reactive({
    x:0,
    y:0,
    width:0,
    height:0,
    fixed:0,
    allowScale:false,
})//事件数值记录
const pointerDown=(e:PointerEvent)=>{
    console.log(imgRef.value)
    
    e.preventDefault()
    e.stopPropagation()
    eventRecord.x= e.clientX
    eventRecord.y = e.clientY
    eventRecord.width = imgRef.value!.getBoundingClientRect().width
    eventRecord.height = imgRef.value!.getBoundingClientRect().height
    eventRecord.allowScale=true
    props.updateAttributes({ 
        scalePercent:0,
    })
    window.onpointermove=(e)=>scaleEvent(e)
    window.onpointerup=(e)=>pointerUp(e)
}
const pointerUp=(e:PointerEvent)=>{
    e.preventDefault()
    e.stopPropagation()
    eventRecord.allowScale = false  //设为true表示可以移动
    window.onpointermove=null

}
const scaleEvent=(e:PointerEvent)=>{
    // console.log(e)
    e.preventDefault();
    e.stopPropagation();
    //添加alt键锁定比例事件
    window.onkeydown=(e:KeyboardEvent)=>fixEvent(e)

    if(eventRecord.allowScale){    
        const x = e.clientX - eventRecord.x
        const y = e.clientY - eventRecord.y
        const newW=eventRecord.width + x 
        const newH=eventRecord.fixed?(newW/eventRecord.fixed):(eventRecord.height + y)
        // const newH=eventRecord.height + y 
        // const maxW=resizeRef.value!.parentElement!.parentElement!.clientWidth
        props.updateAttributes({ 
            width:newW,
            height:newH,
        })//更新宽高
    }
}
const fixEvent=(e:KeyboardEvent)=>{
    e.preventDefault()
    e.stopPropagation()
    if(e.altKey){
        if(eventRecord.fixed!==imgState.ratio){
            eventRecord.fixed=imgState.ratio
        }
    }
    window.onkeyup=(e)=>{
        e.preventDefault()
        e.stopPropagation()
        eventRecord.fixed=0
        window.onkeydown=null
    }
}
// 图片最大宽度为编辑器宽度-待修改
const maxSize=()=>{
    const maxW = props.editor.view.dom.clientWidth
    if (imgState.width > maxW) {
        props.updateAttributes({ 
            width: maxW,
            height:maxW/imgState.ratio,
        })
    }
}
onMounted(()=>{
    // When the image has loaded
    imgRef.value!.onload = (e:any) => {
        isLoaded.value = true
        // 保存图片的原始信息(宽,高,尺寸比例)
        imgState.width=imgRef.value!.naturalWidth
        imgState.height=imgRef.value!.naturalHeight
        imgState.ratio = imgRef.value!.naturalWidth / imgRef.value!.naturalHeight;
        

        //设置缩放按钮事件
        if(resizeRef.value&&imgRef.value){
            resizeRef.value.onpointerdown=(e)=>pointerDown(e)
        }

    };
})

watch(
    () => props.selected,
    ()=>{
        if(resizeRef.value){
            resizeRef.value!.onpointermove=null
            resizeRef.value!.onpointerup=null
        }
    }
)
watch(
    () => props.node.attrs.scalePercent,
    ()=>{
        //如果缩放比例不为0,修改图片宽高为原始尺寸x缩放比例
        if(props.node.attrs.scalePercent){
            props.updateAttributes({ 
                width: attrs.value.scalePercent*imgState.width, 
                height: attrs.value.scalePercent*imgState.height, 
            })
        }
    }
)


</script>

<style lang="less">
.img-container{
    // z-index: 999;
    position: relative;
    &.inline {
      display: inline-block;
    }
}
.img-content{
    box-sizing: border-box;
}
.img-resizer{
    background-color: #18a058;
    border: 1px solid rgba(0, 0, 0, 0.6);
    display: none;
    position: absolute;
    width:10px;
    height:10px;
    right:-7px;
    bottom:-1px;
    z-index: 999;
    opacity: 0.7;
    touch-action: none;
    cursor: nwse-resize;
}

.img-container.ProseMirror-selectednode {
    // z-index: 999;
    .img-resizer {
      display: block;
    }
    .img-content{
        filter:brightness(0.95);
        outline:3px solid #68cef8;
    }
}
</style>