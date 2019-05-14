import {otherRouter, appRouter} from '@/router/router';
import Util from '@/libs/util';
import Vue from 'vue';
import Cookies from "js-cookie";
import $ from 'jquery'

const app = {
    state: {
        currentRoute:'',
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'light', // 主题
        themeColor: '',
        pageOpenedList: [],
        currentPageName: '',
        currentPath: [], // 面包屑数组
        menuList: [],
        btnList: [],
        approveId:'',//日常合成审批的每一条数据的id
        deterId:'',//日常合成研判的每一条数据的id
        summarizeId:'',//日常合成总结的每一条数据的id
        materialId:'',//日常合成补充材料的每一条数据的id
        taskItemAdd:{},//日常合成研判审批-点击树的时候，改变这一条的状态   新增下级任务
        taskItemFeedback:{},//日常合成研判审批-点击树的时候，改变这一条的状态   反馈任务
        taskItemAdditional:{},//专案研判点击补录分配时，改变状态
        taskItemSign:{},//日常合成研判审批-点击树的时候，改变这一条的状态   签收任务
        zlid:'',//指令核查每条的id
        ypZt:'',//日常合成研判操作时的状态
        fkZt:'',//专案合成反馈时的操作状态
        routers: [
            otherRouter,
            ...appRouter
        ],
        tagsList: [...otherRouter.children],
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    mutations: {
        setCurrentRoute(state,route){
        	state.currentRoute=route;
        },
        setTagsList(state, list) {
            state.tagsList.push(...list);
        },
        setYpzt(state, zt) {
            state.ypZt=zt;
        },
        setFkzt(state, zt) {
            state.fkZt=zt;
        },
        setBtnList(state, list) {
            state.btnList = list
        },
        setDeterId(state,id){
        	state.deterId=id;
        },
        setZlId(state,id){
        	state.zlid=id;
        },
        setApproveId(state,id){
        	state.approveId=id;
        },
        setSummarizeId(state,id){
        	state.summarizeId=id;
        },
        setMaterialId(state,id){
        	state.materialId=id;
        },
        setTaskItemAdd(state,item){
        	state.taskItemAdd=item;
        },
        setTaskItemFeedback(state,item){
        	state.taskItemFeedback=item;
        },
        setTaskItemAdditional(state,item){
        	state.taskItemAdditional=item;
        },
        setTaskItemSign(state,item){
        	state.taskItemSign=item;
        },
        updateMenulist(state) {
            let accessCode = parseInt(Cookies.get('token'));
            let menuList = [];
            let ll = state.menuList;
            let tags = state.pageOpenedList.slice();
            // 授权改变时，原先打开的标签页也消失
            for(var i = 0; i < tags.length; i++){
                var tagItem = tags[i];
                var title = tagItem.title;
                var isExist = false;
                for(var j = 0; j < ll.length; j++){
                    var llItem = ll[j];
                    var n = llItem.title;
                    if(n == title || tagItem.name == 'home_index'){
                        isExist = true;
                        break;
                    }
                }
                if(!isExist){
                    tags.splice(i, 1);
                }
            }
            state.pageOpenedList = tags;
            ll.forEach((item) => {
                if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            return child;
                        });
                        if (childrenArr === undefined || childrenArr.length === 0) {
                            menuList.splice(len - 1, 1);
                        } else {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                            handledItem.children = childrenArr;
                            menuList.splice(len - 1, 1, handledItem);
                        }
                    }
            });
            state.menuList = menuList;
        },
        changeMenuTheme(state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme(state, mainTheme) {
            state.themeColor = mainTheme;
        },
        addOpenSubmenu(state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage(state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage(state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag(state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList(state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags(state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags(state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList(state) {
            state.pageOpenedList = [otherRouter.children[0]];
        },
        setCurrentPath(state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName(state, name) {
            state.currentPageName = name;
        },
        setMymenu(state, name) {
            state.menuList = name;
        },
        setAvator(state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang(state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu(state) {
            state.openedSubmenuArr.length = 0;
        },
        setMessageCount(state, count) {
            state.messageCount = count;
        },
        increateTag(state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
    }
};

export default app;
