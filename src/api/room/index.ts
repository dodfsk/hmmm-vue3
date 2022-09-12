import request from '@/utils/axios/index';
import { Room } from '@/types/room';

export const getRoomList = async (query?:any) => {
	let url: string;
		url = `/room`;
	return await request({
		url,
        params:query,
		method: 'get',
	});
};

export const getRoom = async (id?: string) => {
	let url: string;
    url = `/room/${id}`;
	return await request({
		url,
		method: 'get',
	});
};

export const setRoom = async (data: Room) => {
	const id = data.hid;
	let url: string;
	let method: string;

	if (id) {
        url = `/room/${id}`;
		method = 'patch';
	} else {
		url = '/room';
		method = 'post';
	}

	return await request({
		url,
		method,
		data,
	});
};

export const delRoom = async (id: string) => {
	return request({
		url: `/room/${id}`,
		method: 'delete',
	});
};
