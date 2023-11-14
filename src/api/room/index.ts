import request from '@/utils/axios/index';
import { Room } from '@/types/room';

export const getRoomList = async (query?:any) => {
	let url: string= `/room`;

	return await request({
		url,
        params:query,
		method: 'get',
	});
};

export const getMyRoomList = async (data?:any) => {
	let url: string = `/room/getMyList`;
	return await request({
		url,
        data,
		method: 'post',
	});
};

export const updateStatus = async (id:string,data: Partial<Room>) => {
	let url: string = `/room/updateStatus/${id}`;
	return await request({
		url,
		method: 'patch',
		data,
	});
};


export const getRoom = async (id: string) => {
	let url: string = `/room/${id}`;
	return await request({
		url,
		method: 'get',
	});
};

export const setRoom = async (data: Partial<Room>) => {
	let url: string = `/room`;
	return await request({
		url,
		method:'post',
		data,
	});
};

export const putRoom = async (data: Partial<Room>) => {
	const id = data.hid;
	let url: string = `/room/${id}`;
	return await request({
		url,
		method: 'patch',
		data,
	});
};

export const delRoom = async (id: string) => {
	let url: string = `/room/${id}`;
	return request({
		url,
		method: 'delete',
	});
};
