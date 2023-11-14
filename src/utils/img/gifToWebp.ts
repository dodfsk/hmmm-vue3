export const gif2webp=(file:File, callback:Function)=> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const result:{file?:File,base64?:string}={}

    canvas.toBlob(
        (blob) => {
            if (blob)
            result.file = new File([blob], file.name, {
                type: 'image/webp',
                // type: 'image/png',
            })
            callback(result);
        },
        'image/webp',
        // this.file.type,
        0.92
    )

}