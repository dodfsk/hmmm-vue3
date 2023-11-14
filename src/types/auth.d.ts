export type LoginType = {
	username: string
	password: string
}

export interface RegisterType extends LoginType {
	reEnteredPassword: string
}

