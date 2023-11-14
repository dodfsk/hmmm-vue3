# Vue 3 + TypeScript + Vite

大体上是一个论坛系统的前端

本项目由官方 vite,vue3-ts 模板开始从头构建。
从最初想写个人博客到追加用户系统的多人博客,到后面还想追加音视频，聊天室，消息订阅等社交论坛方向的功能。边写边改需求，不断优化写法，也踩了不少坑，作为前端的练手项目。

## Description

<p align="center">
<a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"><img width="95" src="https://vuejs.org/images/logo.png" alt="Vue logo"></a>
<a href="https://github.com/microsoft/TypeScript" target="_blank" rel="noopener noreferrer"><img width="95" src="https://upload.wikimedia.org/wikipedia/commons/f/f5/Typescript.svg" alt="Ts"></a>
  <a href="https://npmjs.com/package/vite"><img width="100" src="https://vitejs.dev/logo.svg" alt="Vite logo"></a>
  <a href="https://github.com/tusen-ai/naive-ui">
   <img width="84px" src="https://naiveui.oss-cn-hongkong.aliyuncs.com/naivelogo.svg" />
  </a>
</p>

##### 相关技术栈:

    基础框架: vue3 + typescript + vite
    状态管理: pinia
    路由: vue-router4
    请求: axios
    UI相关: naive-ui @vicons/ionicons5
    富文本编辑器框架: tiptap2

##### 目录:

    ───/src
        ├── api             #接口地址
        ├── assets          #静态资源
        ├── components      #二次封装的公共vue组件
        ├── router          #路由相关
        ├── store           #pinia全局状态管理配置
        ├── type            #和后端对应的返回、接口类型
        ├── utils           #公用工具类,axios,less等
        └── views           #业务功能页面

##### 功能介绍:

* 文章模块,实现了富文本文章的草稿、发布、更新、删除。
* 评论模块,以github、nga、tieba为参考,以建楼，无二级评论，使用引用评论的方案实现
* 用户模块,修改基本信息,上传头像,修改密码

##### 更多:

权限安全相关：

    1. 用户登陆成功时,将接口返回的token存入localstorage和pinia-store中
    2. 每次请求接口将token携带在Bearer中,当请求出现code401时清除localstorage和pinia中的用户信息和token,作为注销方法
    3. 使用无状态jwt方案,根据传递给后端的token判断用户及用户是否有权操作

接口相关:

    1. 在type目录中定义了TS泛型返回类Response Type(res.data),跟后端的类型同步
    2. 用pinia在不同的store里定义请求接口的方法,将对应接口的data类型传入泛型类中,让页面中使用res.data.data时有类型提示
    3. res.code判断接口是否请求到后端,res.data.code才作为业务逻辑的code

富文本编辑器框架:

    1. tiptap是一个headless富文本编辑器框架,基于ProseMirror,根据官网的demo二次封装了最基础样式和功能的版本
    2. 对@tiptap/extension-image库进行二次封装,对最基础的图片功能插件新增了右下角标的缩放拉伸功能,以及选中图片可以对浮动菜单操作直接修改图片的地址,宽,高
    3. 对接后端的minio对象存储服务,预签名接口从后端获取签名url,直接put上传到minio服务器,再添加进编辑框内,同时保存附件信息
    4. 文章的预览页使用该组件,传递字段提供只读的文本界面,保证读写的样式一致

图片拖放裁剪工具:

    1. 原生class类组件的方式封装的图片裁剪,拖放,预览工具,主要是由pointer事件监听触发位置计算偏移量实现的,作为原生js组件不受框架限制
    2. 用new关键字实例化,使用时传入一个配置对象,其中有container,pr容器(div)的id,宽高,输出图片的宽高,是否固定比例等
    3. 实现了四角按住缩放裁剪框,拖动裁剪框,键盘上下左右微调裁剪框位置,同时预览裁剪后图片的功能
    4. 目前默认输出webp格式图片以压缩图片大小的同时不损失过多质量并且支持透明
    5. 头像的裁剪,富文本的裁剪上传图片,文章封面的裁剪上传都使用了该工具


## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn vite

# production mode
$ yarn build
```
