
export type ChangePswType = {
	oldPassword: string
	newPassword: string
}

export interface PswFormType extends ChangePswType{
	reEnteredPassword: string
}

export type UserStats = {
	follow: number
	push: number
}

export type User = {
    uid:string
	username: string
	password?: string
    sign?:string
    sex?:string
	phone?: string
	email?: string
	birth?: Date
	avatar?: string
	role?: string
    createdAt?: Date
	updatedAt?: Date
    stats?:UserStats
}

export type UserParam=Partial<User>