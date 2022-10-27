export  const ImgToOss=(data:string)=>{
    const regStr=`<img [^>]*src=['"]${import.meta.env.VITE_APP_OSS}`
    // const regStr=`<img [^>]*src=['"]([^'"]+)[^>]*>`
    const regex=new RegExp(regStr,'g')

    //只修改  <img src="http:192.168.x.x   前缀为@oss
    const oss='@oss'
    const imgSrc="<img src=\""+oss
    // console.log(oss,imgSrc);
    return data.replace(regex,imgSrc)
}

export  const ImgReplace=(data:string)=>{
    const regex= /<img [^>]*src=['"]@oss/g
    //只修改  <img src="oss   前缀为oss地址
    // const a=/[o][s][s]/
    const oss=import.meta.env.VITE_APP_OSS
    const imgSrc="<img src=\""+oss
    // console.log(oss,imgSrc);
    return data.replace(regex,imgSrc)
}


export  const UrlToOss=(data:string)=>{
    const regStr=`${import.meta.env.VITE_APP_OSS}`
    // const regStr=`<img [^>]*src=['"]([^'"]+)[^>]*>`
    const regex=new RegExp(regStr,'g')

    //只修改  <img src="http:192.168.x.x   前缀为@oss
    const oss='@oss'
    // console.log(oss,imgSrc);
    return data.replace(regex,oss)
}

export  const UrlReplace=(data:string)=>{
    const regex=/@oss/g
    //只修改oss前缀为oss地址
    // const a=/[o][s][s]/
    const oss=import.meta.env.VITE_APP_OSS
    // console.log(oss,imgSrc);
    return data.replace(regex,oss)
}


