export type Comment={
    hid?:string,
    content?:string,
    from?: string,
    createdAt?: Date,
    updateAt?: Date,
    reply?:Array<Reply>,
}

export type Reply={
    from?:string,
    content?:string,
    replyTo?:string,
    createdAt?: Date,
    updateAt?: Date,
}
