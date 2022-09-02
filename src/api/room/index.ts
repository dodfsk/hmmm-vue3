import request from '@/utils/axios/index';
import { Room } from '@/types/room';

export const getRoom = async (id?: string) => {
	let url: string;

	if (id) {
		url = `/room/${id}`;
	} else {
		url = `/room`;
	}

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
