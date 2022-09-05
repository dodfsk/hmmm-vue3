import {Comment} from '@/types/comment'

export type Room={
    _id?:string,
    hid?: string,
    title: string,
    content?:string|Delta,
    description?:string,
    cover?:string,
    assest?:string,
    from?: string,
    createdAt?: Date,
    updateAt?: Date,
    comment?: Array<Comment>
}

