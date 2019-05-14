import Vue from 'vue'
//import SvgIcon from './SvgIcon.vue'
//Vue.component('svg-icon',SvgIcon)
const request = require.context('@/images/svg', true, /\.svg$/);
request.keys().forEach(request)


