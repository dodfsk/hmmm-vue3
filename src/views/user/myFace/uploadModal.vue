<template>
	<!-- <div class="modal-container">
        <img 
            :src="props.src"
        />
	</div> -->
    <div class="modal-container">
        <imgResize></imgResize>
    </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, watch } from 'vue';
import imgResize from './imgResize.vue'
export type DefineExpose = {
	// cropper: InstanceType<typeof Cropper>;
};
type Props = {
	src?: string;
};
type Emits = {
	(e: 'update:content', value: string): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// let imgResize:any
const image = new Image();
// image.src = 'http://192.168.2.103:9000/picture/hmlc/test.png';
image.src = props.src!;
image.alt = 'Picture';

// nextTick(()=>{
//         handleCenter()
// })

onMounted(() => {

});


</script>

<style lang="less" scoped>
.modal-container{
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // border:1px solid #000;
    // border-radius:.375rem;
    height: 100%;
    padding:10px;

}
img{
    max-width: 700px;
    max-height: 200px;
}

</style>
