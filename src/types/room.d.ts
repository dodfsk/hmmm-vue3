import {Comment} from '@/types/comment'

export type PreSignInfo={
    url:string,
    fileName:string
}

export type Room={
    _id?:string,
    hid?: string,
    title: string,
    content?:string|Delta,
    description?:string,
    cover?:string,
    assets?:Array<PreSignInfo>,
    from?: string,
    isPublic?:boolean;
    createdAt?: Date,
    updateAt?: Date,
    comment?: Array<Comment>
}

