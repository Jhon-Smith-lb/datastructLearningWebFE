import axios from "axios";
import { Loading } from 'element-ui'

const loading = {
    loadingInstance: null,
    open: function() {
        this.loadingInstance = Loading.service({target:'.main'})
    },
    close: function() {
        if (this.loadingInstance != null) {
            this.loadingInstance.close()
        }
    }
}

const myaxios = axios.create({
    baseURL: '/api',
    timeout: 50000,
})

export default myaxios

// 请求拦截器
axios.interceptors.request.use(function(config) {
    loading.open();
    return config;
}, function(error){
    loading.close();
    return Promise.reject(error);
})

// 响应拦截器
axios.interceptors.response.use(function(response) {
    loading.close();
    return response;
}, function(error){
    loading.close();
    return Promise.reject(error);
})