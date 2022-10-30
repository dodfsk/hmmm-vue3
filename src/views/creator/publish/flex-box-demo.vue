<template>
<div class="container">
    <div class="card">
        <div class="header">
            <div class="header-left">
                <h2>我的发布</h2>
                <hr>
            </div>
            <n-button type="primary"> 修 改</n-button>
        </div>
        <div class="content">
            <div class="content-item">
                <div class="content-item-left">
                    <div class="circle" style="color:#fff;padding-top: 35px;">
                        Cover
                    </div>
                    我是时间
                </div>
                <div class="content-item-right">
                    <div class="content-item-right__header">
                        <h1>我是标题</h1>
                    </div>
                    <div class="content-item-right__article">
                        我是内容
                    </div>
                    <div class="content-item-right__footer">
                        我是footer
                        <n-button type="info">查看</n-button>
                        <n-button type="primary">编辑</n-button>
                    </div>
                </div>
            </div>

            <div class="content-item">
                test
            </div>

        </div>
    </div>
</div>
</template>

<script setup lang='ts'>

</script>

<style lang='less' scoped>
.container{
    background-color: rgba(206, 255, 127,0.5);
    padding: 40px;
    display:flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
}
.card{
    width:70%;
    // height:max-content;
    max-width:1000px;
    min-width:500px;
    padding: 30px;
    background-color: #fff;
    border-radius: 3px;
	box-shadow: 0 0 10px rgba(51, 51, 51, 0.721);
    display:flex;
    flex-direction: column;
    align-items: center;
}
.card .header{
    width:80%;
    // min-width:500px;
    margin-bottom: 20px;
    display:flex;
    justify-content: center;
    &-left{
        width:70%;
        text-align: left;
        hr{
            width:50%;
            min-width:286px; 
            color:"#ccc";
        }
    }
}
.card .content{
    width:80%;
    display:flex;
    flex-direction: column;
    align-items: start;
    gap:24px;
}
.card .content-item{
    width:100%;
    height:200px;
    // border: 1px solid #000;
    border-radius: 3px;
	box-shadow: 0 0 5px rgba(51, 51, 51, 0.721);
    display:flex;
    &-left{
        // flex:200px 1 auto;
        width:150px;
        height: 100%;
        background-color: rgba(127, 255, 212, 0.666);
        display:flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
    &-right{
        flex:1;
        display:flex;
        flex-direction: column;
        justify-content: space-between;
        // align-items: start;
        &__header{
            width:100%;
            padding:5px;
            text-align: left;
            overflow:hidden;
        }
        &__article{
            width:100%;
            padding:10px;
            text-align: left;
            overflow:auto;
        }
        &__footer{
            height:50px;
            width:100%;
            padding:5px;
            text-align: right;
            background-color: rgba(220, 20, 60, 0.63);
        }
    }
}

.circle {
    width:100px;
    height:100px;
	padding: 3px;
	// border: 1px solid #000;
	border-radius: 50px;
    background-color:darkslateblue;
    text-align: center;
}

:deep(#editor-resizer) {
	display: none;
} //关闭富文本图片resize模块
</style>