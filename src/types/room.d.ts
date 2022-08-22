export type Room={
    hid: string,
    title: string,
    content?:string,
    from: string,
    createdAt: Date,
    updateAt: Date,
    comment?: Array<Comments>
}

export type Comments={
    username:string,
    comment:string,
}
