import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};


export const fetchPermission = query => {
    return request({
        url: './permission.json',
        method: 'get',
        params: query
    });
};
