export  const ImgReplace=(data:string)=>{
    const regex= /<img [^>]*src=['"]oss/g
    //只修改  <img src="oss   前缀为oss地址
    // const a=/[o][s][s]/
    const oss=import.meta.env.VITE_APP_OSS
    const imgSrc="<img src=\""+oss
    // console.log(oss,imgSrc);
    return data.replace(regex,imgSrc)
}

export  const OssReplace=(data:string)=>{
    const regex= /oss/g
    //只修改oss前缀为oss地址
    // const a=/[o][s][s]/
    const oss=import.meta.env.VITE_APP_OSS
    // console.log(oss,imgSrc);
    return data.replace(regex,oss)
}