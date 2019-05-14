import Cookies from 'js-cookie';
import api from '@/fetch/api.js';
const user = {
    state: {
        personal: {
            id: null,
            info: {}
        }
    },
    getters: {
        personal_userId: state => state.personal.id,
        personal_Info: state => state.personal.info
    },
    mutations: {
        logout(state, vm) {
            Cookies.remove('user');
            Cookies.remove('password');
            Cookies.remove('access');
            // 恢复默认样式
//          let themeLink = document.querySelector('link[name="theme"]');
//          themeLink.setAttribute('href', '');
//          // 清空打开的页面等数据，但是保存主题数据
//          let theme = '';
//          if (localStorage.theme) {
//              theme = localStorage.theme;
//          }
//          localStorage.clear();
//          if (theme) {
//              localStorage.theme = theme;
//          }
        },
        USER_ID (state, userId) {
            state.personal.id = userId;
        },
        PERSONAL_INFO (state, res) {
            state.personal.info = res;
        }
    },
    actions: {
        getUser ({commit}) {
            return new Promise(resolve => {
                api.api('post', api.loginUrl + '/login/getAccount').then(res => {
                    commit('USER_ID', res.id);
                    commit('PERSONAL_INFO', res);
                    window.localStorage.setItem('userId', res.id)
					window.localStorage.setItem('userInfo', JSON.stringify(res))
                    resolve(res);
                });
            });
        },
    }
};

export default user;
