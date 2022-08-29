export type Room={
    _id?:string,
    hid?: string,
    title: string,
    content?:string|Delta,
    destription?:string,
    cover?:string,
    assest?:string,
    from?: string,
    createdAt?: Date,
    updateAt?: Date,
    comment?: Array<Comments>
}

export type Comments={
    username:string,
    comment:string,
}
