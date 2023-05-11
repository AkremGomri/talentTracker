import axios from 'axios';

const localforage = require("localforage");

const send = async (method, url, data = []) => {

    const options = {
        url: `${process.env.REACT_APP_API_URL}${url}`,
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${await localforage.getItem('token')}`
        },
        data
      };

    const response = await axios(options);
    return response.data;
};

const post = async (url, data) => {

    const options = {
        url: `${process.env.REACT_APP_API_URL}${url}`,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${await localforage.getItem('token')}`
        },
        data
      };

    const response = await axios(options);

    return response.data;
};

const put = async (url, data) => {

    const options = {
        url: `${process.env.REACT_APP_API_URL}${url}`,
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${await localforage.getItem('token')}`
        },
        data
      };

    const response = await axios(options);

    return response.data;
};

const get = async (url) => {

    const options = {
        url: `${process.env.REACT_APP_API_URL}${url}`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${await localforage.getItem('token')}`
        },
    };

    const response = await axios(options);

    return response.data;
}

const request = {
    send,
    post,
    get,
    put
}; 

export default request;