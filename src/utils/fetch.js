import axios from 'axios';
import {getToken} from '../utils/auth';
let flag=false;

// 取消请求操作
// const allPendingRequestsRecord = [];
// const pending = {};
// const removeAllPendingRequestsRecord = () => {
//     allPendingRequestsRecord && allPendingRequestsRecord.forEach((func) => {
//         // 取消请求（调用函数就是取消该请求）
//         func('路由跳转了取消所有请求');
//     });
//     // 移除所有记录
//     allPendingRequestsRecord.splice(0);
// };

// // 取消同一个重复的ajax请求
// const removePending = (key, isRequest = false) => {
//     if (pending[key] && isRequest) {
//         pending[key]('取消重复请求');
//     }
//     delete pending[key];
// };

// 取消所有请求的函数
// export const getConfirmation = (mes = '', callback = () => {}) => {
//     removeAllPendingRequestsRecord();
//     callback();
// };

// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    timeout: 50000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    const token=getToken();
    // let reqData = config.url + config.method + JSON.stringify(config.params||config.data);
    // 如果用户连续点击某个按钮会发起多个相同的请求，可以在这里进行拦截请求并取消上 一个 重复的请求
    // removePending(reqData,true);
    // config.cancelToken=new axios.CancelToken((c)=>{
    //     pending[reqData]=c;
    //     allPendingRequestsRecord.push(c);
    // });
    if(token){
        config.headers.authorization ='Bearer '+token;
    }
    return config;
}, error => {
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    res => {
        if(res.status === 200 || res.status === 304){
            if(res.data.code && res.data.code!==200){
                throw new Error(res.data.message);
            }
            else{
                return res.data;
            }
        }
        else{
            console.log('网络不太给力哦，检查一下您的网络再试吧！')
        }
    },
    error => {
        // 终结由于取消重复请求而引发的报错提示
        // if (axios.isCancel(error)) {
        //     return new Promise(() => {});
        // }
        if(error.response.status===403&&!flag){
            flag=true;
            if(window.confirm('token已过期，请重新登录！')){
                window.history.replaceState(null, null, '/login');
                window.location.reload();
            }else{
                console.log('cancel')
            }
        }
        console.log('err' , error.response); // for debug
        console.log('网络不太给力哦，检查一下您的网络再试吧！')
        return Promise.reject(error);    
    },
);

export default service;


