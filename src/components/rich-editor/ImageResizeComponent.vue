<template>
	<node-view-wrapper 
        as="span"
        class="img-container" 
        :class="{
            'ProseMirror-selectednode': (props.selected && props.editor.isEditable)||eventRecord.allowScale,
            inline: options.inline,
        }" 
    >
		<img 
            ref="imgRef"
            class="img-content"
            v-bind="attrs"
            draggable="true"
            data-drag-handle
        />
        <!-- :src="attrs.src"
        :style="{width:attrs.width+'px',height:attrs.height+'px'}" -->
        <span 
            class="img-resizer"  
            ref="resizeRef" 
            v-show="isLoaded"
        ></span>

	</node-view-wrapper>
</template>

<script lang="ts" setup>
import { computed,onMounted, reactive, ref } from 'vue';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';

const props=defineProps(nodeViewProps)
const imgRef=ref<HTMLImageElement>()
const resizeRef=ref<HTMLDivElement>()
const attrs = computed(() => props.node.attrs);
const options = computed(() => props.extension.options);
const isLoaded = ref<boolean>(false);
const imgRatio=ref<number>()
console.log('props.node.attrs',props.node.attrs);

const eventRecord=reactive({
    x:0,
    y:0,
    width:0,
    height:0,
    fixed:0,
    allowScale:false,
})

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

        // console.log(newW,newH)
        props.updateAttributes({ 
            width:newW,
            height:newH,
        })
    }
}
const fixEvent=(e:KeyboardEvent)=>{
    e.preventDefault()
    e.stopPropagation()
    if(e.altKey){
        if(eventRecord.fixed!==imgRatio.value){
            eventRecord.fixed=imgRatio.value?imgRatio.value:0
        }
    }
}
onMounted(()=>{
    // When the image has loaded
    imgRef.value!.onload = (e:any) => {
        isLoaded.value = true
        // 保存图片的原始比例
        imgRatio.value = imgRef.value!.naturalWidth / imgRef.value!.naturalHeight;
        // 图片最大 100%
        const maxW = props.editor.view.dom.clientWidth
        const imgW = imgRef.value!.naturalWidth
        //   const imgW = e.target?.clientWidth
        if (imgW > maxW) {
            props.updateAttributes({ width: maxW })
        }

        //设置缩放按钮事件
        if(resizeRef.value&&imgRef.value)
        resizeRef.value.onpointerdown=(e)=>{
            e.preventDefault();
            e.stopPropagation();
            eventRecord.x= e.clientX 
            eventRecord.y = e.clientY 
            eventRecord.width = imgRef.value!.getBoundingClientRect().width
            eventRecord.height = imgRef.value!.getBoundingClientRect().height
            eventRecord.allowScale=true
            window.onpointermove=(e)=>scaleEvent(e)
            
        }
        window.onpointerup=(e)=>{
            e.preventDefault()
            e.stopPropagation()
            eventRecord.allowScale = false  //设为true表示可以移动
            window.onpointermove=null
            // window.onpointerup=null
        }
        window.onkeyup=(e)=>{
            e.preventDefault()
            e.stopPropagation()
            eventRecord.fixed=0
            window.onkeydown=null
        }

    };

})
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
    box-sizing: content-box;
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

.ProseMirror-selectednode {
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