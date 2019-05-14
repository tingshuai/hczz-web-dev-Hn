import Cookies from 'js-cookie';
import axios from "axios";
import $ from 'jquery';
import Vue from 'vue';
import qs from 'qs';
import store from '@/store/index.js';
import { Message } from 'element-ui';

let AUTH_TOKEN = (function () {
    return Cookies.get("token");
})();

var instance = axios.create({
    timeout: 50000,
    headers: {
        // "Content-Type": "application/json"
    }
});
instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;
instance.interceptors.request.use(function (config) {
    config.headers.Authorization = Cookies.get("token");
    if (config.method === 'post' || config.method === 'patch') {
    	if(config.url.includes('getTreeResources') || config.url.includes('api/v3')){
    		config.data = qs.stringify(config.data)
    	}
           
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});
instance.interceptors.response.use(async function (res) {
    if (res.headers.authorization) {
        Cookies.set('token', res.headers.authorization);
//      await SetToken.rewriteToken(res.headers.authorization, Cookies.get('user'))
    }
    return res;
}, function (err) {
    return err;
});
Vue.prototype.$axios = instance;

export function ajaxApi(method, url, params, callback) {
    return new Promise(function (resolve, reject) {
        var ajaxParams = {};
        if (method === 'post') {
            ajaxParams = {
                method: method,
                url: url,
                data: params
            }
        } else {
            ajaxParams = {
                method: method,
                url: url,
                params: params
            }
        }
        instance(ajaxParams).then(res => {
//          SetToken.loginOut();
            var result = JSON.parse(JSON.stringify(res.data))
            if (result.code == 200) {
                resolve(result.data)
                
            } else if (result.code == 20014 || result.code == 20016 || result.code == 10013 || result.code == 20015) {
//              SetToken.rewriteToken()
//                 Message({
//                     type: 'error',
//                     message: '登录已过期,5秒后进入到登录页面',
//                     duration: 5000
//                 })
//                 //              $('<p class="goLogin">登录已过期,5秒后进入到登录页面</p>').appendTo('body')
//                 setTimeout(function () {
//                     console.log('未登录');
//                     window.location.href = window.location.protocol + "//" + window.location.host + '/#login';
//                     window.location.reload();
//                 }, 5000)
                Cookies.set('user', '')
                store.commit('setMymenu', '');
                // window.location.href = 'http://74.6.57.207:8080/stars/frame_4g_stars3/login/default/login.jsp'

            } else {
                Message({
                    type: 'error',
                    message: result.message,
                    duration: '1800'
                })
                if (callback && typeof callback === 'function') {
                    reject(callback(result.code))
                }
            }
        }).catch((error) => {
            reject(error)
        })

    })
}

export function ajaxJson(method, url, data) {
    return new Promise(function (resolve, reject) {
        axios({
            method: method,
            url: url,
            data: data
        }).then(res => {
            if (res.data.code == 200) {
                resolve(res.data.data)
            } else {
                Message({
                    type: 'error',
                    message: res.data.message,
                    duration: '1800'
                })
            }
        }).catch((error) => {
            reject(error)
        })
    })
}
export function ajaxFile(obj) {
    return new Promise((resolve,reject) => {
        const { method, url, params } = obj
        var ajaxParams = {}
        var ajaxdata = qs.stringify(params)
        ajaxParams = {
            method: method,
            url: url,
            data: ajaxdata,
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        }
        instance(ajaxParams).then(res => {
            if (!res.data.code) {
                const content = res.data
                const blob = new Blob([content])
                const fileName = params.sFileName
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
            } else {
                Message({
                    type: 'error',
                    message: res.data.message,
                    duration: '1800'
                })
                reject(res.data)
            }
        }).catch(error=>reject(error))
    })
}
const loginUrl = '/api/v1';
const configUrl = '/api/v2';
const systemUrl = '/api/v3';
const ywlx = {
    rc: '11',
    za: '12',
    zb: '13',
    qx: '21',
    zl: '31'
}
export default {
    api(method, url, params, callback) {
        return ajaxApi(method, url, params, callback)
    },
    json(method, url, params) {
        return ajaxJson(method, url, params)
    },
    fileApi(method, url, params, callback) {
        return ajaxFile(method, url, params, callback);
    },
    upload(val){
    	var elemIf=document.createElement('iframe');
    	let urls=val.fileurl.replace(/\\/g,'/')
		elemIf.src=configUrl+'/hczz/fj/getDownLoadFile?login=admin&sFileUrl='+urls+'&sFileName='+val.filename + '.' + val.category;
		elemIf.style.display='none';
		document.body.appendChild(elemIf)
    },
    loginUrl,
    configUrl,
    systemUrl,
    instance,
    ywlx
}
