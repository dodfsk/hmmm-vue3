import request from '@/utils/axios/index';
export const api='https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=CNY,USD'
export const getCryptoCoin = async (id?: string) => {
    return request({
		url: api,
		method: 'get',
	});
}