import {Comment} from '@/types/comment'

export type PreSignInfo={
    url:string,
    fileName:string
}

export type Room={
    _id?:string,
    hid?: string,
    title?: string,
    content?:string|Delta,
    description?:string,
    cover?:string,
    assets?:Array<PreSignInfo>,//考虑拆分成单独的assets表,通过hid字段绑定关系,计划任务定期查=>附加表是否有绑定,无绑定做删除事件
    from?: string,
    isPublic?:boolean;
    createdAt?: Date,
    updateAt?: Date,
    // comment?: Array<Comment> //单独comment表 还未做
}

