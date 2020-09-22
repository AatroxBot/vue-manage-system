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

export const Login = query => {
    return request({
        url: 'http://106.15.126.218:8201/Login.ashx',
        method: 'post',
        headers:query,
    });
};



