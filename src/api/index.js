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

//登录
export const Login = query => {
    return request({
        url: 'http://106.15.126.218:8201/Login.ashx',
        method: 'post',
        headers:query,
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        crossDomain: true,
    });
};
//获取所有用户列表
export const getUserList = () => {
    return request({
         url: 'http://106.15.126.218:8201/GetUserObjectList.ashx',
        //url: './userPermission.json',
        method: 'get',
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        crossDomain: true,
    });
};
//新增用户列表
export const AddUser = (data) => {
    return request({
        url: 'http://106.15.126.218:8201/AddUserObject.ashx',
        method: 'post',
        data: data,
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        crossDomain: true,
    });
};



//更新用户列表
export const UpdateUser = (data) => {
    return request({
        url: 'http://106.15.126.218:8201/UpdateUserObject.ashx',
        method: 'post',
        data: data,
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        crossDomain: true,
    });
};


//删除用户列表
export const DelUser = (data) => {
    return request({
        url: 'http://106.15.126.218:8201/DeleteUserObject.ashx',
        method: 'post',
        data: data,
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        crossDomain: true,
    });
};
