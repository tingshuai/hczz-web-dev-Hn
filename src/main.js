import Vue from 'vue';
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

import VueI18n from 'vue-i18n';
import * as filters from '@/libs/common/filters.js';
import App from './app.vue';
import instance from '@/fetch/api.js';
import './views/main-components/icons/index.js';
import './libs/scroll.js';
import $ from 'jquery';
// import yycpComponents from 'yycp-components';
// import Map from 'yycp-LeadorMap/dist/yycp-LeadorMap.js';
// import '../src/static/ueditor/ueditor.config.js';
// import '../src/static/ueditor/ueditor.all.js';
// import '../src/static/ueditor/lang/zh-cn/zh-cn.js';
// import '../src/static/ueditor/ueditor.parse.min.js';
import layui from 'layui-src/dist/layui.js';
import echarts from 'echarts';
import Swiper from 'swiper';
// import 'swiper/dist/css/swiper.min.css';
import htmlToPdf from './libs/htmlTopdf';
// Vue.use(Map);
// Vue.use(layui);
Vue.use(htmlToPdf);// 生成pdf
Vue.prototype.$echarts = echarts;
// 引入svg组件
const request = require.context('@/images/svg', true, /\.svg$/);
request.keys().forEach(request);
// Vue.use(yycpComponents);

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
Vue.use(VueI18n);
Vue.use(ElementUI);
Vue.use(iView);

Vue.prototype.$axios = instance.instance;
Vue.prototype.changeData = function () {
    this.$refs.table.$el.querySelector('.ivu-table-body').addEventListener('mouseover', function (e) {
        if (e.target.nodeName == 'SPAN') {
            if (e.target.innerText.length > 1) {
                e.target.setAttribute('title', e.target.innerText);
            }
        }
    });
};
var vm = new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        //      this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
