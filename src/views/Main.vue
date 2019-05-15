<style lang="less">
    @import "./main.less";

    .main .tags-con {
        border: 1px solid #dfe1e4;
    }

    .modal-ct .el-form {
        padding: 18px 20px 16px;
        border: 1px solid #dddee1;
    }

    .el-tabs--border-card > .el-tabs__content {
        margin-top: 15px;
    }

    .main-breadcrumb {
        padding: 8px 30px !important;
        float: left;
    }

    .el-form-item {
        margin-bottom: 0 !important;
    }

    .el-form-item__label, .el-form-item__content {
        vertical-align: middle !important;
    }

    /*.workBench-group-modal .el-form-item {*/
    /*margin-bottom:20px !important;*/
    /*}*/
    .el-input--small, .el-input {
        margin-bottom: 20px !important;
    }

    .el-form-item__error {
        top: calc(100% - 20px) !important;
    }

    .feedback-ct .el-form-item__error {
        top: 80%;
    }

    .header-middle-con {
        margin-top: 10px;
    }

    .main .header-avator-con {
        width: 160px !important;
    }

    .main .main-header .header-middle-con {
        right: 170px !important;
    }

    .main-header .header-avator-con .user-dropdown-menu-con {
        width: 160px !important;
    }

    .main .main-header-con {
        height: 50px !important;
        z-index: 1 !important;
    }

    .main .single-page-con {
        top: 60px !important;
        // height: 100%;
    }

    .header-avator-con a {
        color: #fff;
    }

    .ivu-avatar {
        background: url("../images/icon_user.png") no-repeat !important;
        width: 36px;
        height: 36px;
    }

    .ivu-icon {
        margin-left: 5px;
    }

    .ivu-shrinkable-menu,
    .ivu-menu-dark {
        background: #fff !important;
    }

    .main-header-bg {
        background: url("../images/bg_head_left.png") no-repeat;
        width: 300px;
        height: 60px;
    }

    .header-logos {
        height: 60px;
        display: inline-block;
        float: left;
    }

    .ps__rail-y {
        display: none !important;
    }

    .header-title p {
        color: #fff;
        float: left;
        font-size: 11px;
        line-height: 20px;
    }

    .header-title p.header-title-name {
        font-size: 22px;
        margin-top: 14px;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item {
        color: #333;
        font-size: 14px;
        border-bottom: 1px solid #ddd;
        border-left: 3px solid #fff;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover,
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover,
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu),
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover {
        background: #fff;
        color: #397cbf;
        border-left: 3px solid #397cbf;
        border-right: 0 none;
    }

    .ivu-dropdown .ivu-btn .ivu-icon {
        color: #333 !important;
    }

    .bottomPage {
        padding-top: 15px;
        box-sizing: border-box;
        width: 100%;
        /*position: fixed;*/
        bottom: 15px;
        display: block;
        text-align: center;
    }

    #navicon .ivu-btn {
        margin-left: -8px !important;
    }

    #navicon .ivu-btn-text:focus {
        box-shadow: none !important;
    }

    .newMessage {
        position: absolute;
        bottom: 50px;
        right: 30px;
        background: #fff;
        box-shadow: #999 0 0 10px;
        width: 418px;
        height: 0px;
        z-index: 9;
        border-radius: 8px;

        .new_h {
            padding: 16px 20px;
            border-bottom: 1px solid #ccc;

            img {
                float: left;
                margin-right: 10px;
                width: 20px;
            }

            p {
                font-size: 16px;
                color: #333;
                height: 20px;
                line-height: 20px;
            }

            i {
                float: right;
                margin-top: -16px;
                cursor: pointer;
            }
        }

        .new_c {
            margin-left: 50px;
            margin-top: 10px;
            clear: both;
            margin-bottom: 16px;
            height: 30px;
            cursor: pointer;

            img {
                float: left;
                margin-right: 10px;
            }

            p {
                height: 30px;
                line-height: 30px;
            }

            .typeP {
                float: left;
            }

            .new_p {
                float: right;
                margin-right: 50px;
            }
        }
    }

    .showMessage {
        position: absolute;
        bottom: 30px;
        right: 20px;
        width: 40px;
        display: none;
        cursor: pointer;

        img {
            width: 100%;
        }
    }
</style>
<template>
    <div class="main">
        <water-mark></water-mark>
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'180px'}" v-scrollBar>
            <div slot="top" class="logo-con">
                <div class="navicon-con" id="navicon">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                            @click="toggleClick">
                        <Icon type="md-menu" size="32"/>
                    </Button>
                </div>
            </div>
            <shrinkable-menu :menu-list="menuList" :shrink="shrink">
            </shrinkable-menu>
        </div>
        <div class="main-header-con">
            <div class="main-header">
                <div class="main-header-bg" @click="goHome">
                    <img src="@/images/head.png" class="header-logos"/>
                </div>
                <div class="header-avator-con">
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Avatar :src="avator" style="margin-left: 10px;"></Avatar>
                            <!-- <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ personal_Info.userName }}</span>
                                    <Icon type="md-arrow-dropdown" />
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown> -->
                            <el-dropdown trigger="click" :hide-on-click="false" ref="dropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ personal_Info.userName }}</span>
                                    <Icon type="md-arrow-dropdown"/>
                                </a>
                                <el-dropdown-menu slot="dropdown" class="personal-info-panel">
                                    <el-dropdown-item>
                                        <personal-com></personal-com>
                                    </el-dropdown-item>
                                    <el-dropdown-item divided>
                                        <el-button type="primary" size="small" @click="handleLoginOut">退出登录</el-button>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </Row>
                    </div>
                </div>
            </div>

        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'180px'}">
            <div class="header-middle-con">
                <div class="tags-con" style="margin-left: 30px;">
                    <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
                </div>
            </div>
            <div class="single-page reset-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
                <!--<water-mark></water-mark>-->
            </div>
            <div class="newMessage">
                <div class="new_h">
                    <img src="../images/newMessage/tx.png"/>
                    <p>待处理事项提醒</p>
                    <i class="el-icon-minus" @click="hideMessage"></i>
                </div>
                <div class="new_c" @click="handle" v-if="dbObj.zlList.length">
                    <img src="../images/newMessage/zl.png" alt=""/>
                    <p class="typeP">指令</p>
                    <p class="new_p">当前有{{dbObj.zlList.length}}条等待处理，点击处理</p>
                </div>
                <div class="new_c" @click="handle" v-if="dbObj.qqxcList.length">
                    <img src="../images/newMessage/qq.png" alt=""/>
                    <p class="typeP">请求</p>
                    <p class="new_p">当前有{{dbObj.qqxcList.length}}条等待处理，点击处理</p>
                </div>
                <div class="new_c" @click="handle" v-if="dbObj.rchcList.length">
                    <img src="../images/newMessage/rchc.png" alt=""/>
                    <p class="typeP">日常合成</p>
                    <p class="new_p">当前有{{dbObj.rchcList.length}}条等待处理，点击处理</p>
                </div>
                <div class="new_c" @click="handle" v-if="dbObj.zahcList.length">
                    <img src="../images/newMessage/zahc.png" alt=""/>
                    <p class="typeP">专案合成</p>
                    <p class="new_p">当前有{{dbObj.zahcList.length}}条等待处理，点击处理</p>
                </div>
                <div class="new_c" @click="handle" v-if="dbObj.zzzbList.length">
                    <img src="../images/newMessage/zzzb.png" alt=""/>
                    <p class="typeP">专班合成</p>
                    <p class="new_p">当前有{{dbObj.zzzbList.length}}条等待处理，点击处理</p>
                </div>
            </div>
            <div class="showMessage" @click="showMessage">
                <img src="../images/newMessage/showMessage.png"/>
            </div>
            <div class="bottomPage">
                <div style="width: 675px;margin: auto;display:block">
                    <!--<img src="../images/footer.png" />-->
                    <span style="height: 18px;line-height: 18px;font-weight: 700;">© 2018 海南省公安厅版权所有</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
    import Cookies from "js-cookie";
    import personalCom from './my-components/persional/index.vue';
    import waterMark from '@/views/main-components/watermark/watermark.vue';
    import util from "@/libs/util.js";

    export default {
        components: {
            personalCom,
            shrinkableMenu,
            waterMark
        },
        data() {
            return {
                shrink: false,
                userName: "",
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                avatorPath: require('@/images/icon_user.png'),
                dbObj: {
                    zlList: [], //最新指令的数组
                    qqxcList: [], //最新请求协查测数组
                    rchcList: [], //最新的日常合成数组
                    zahcList: [], //最新专案合成数组
                    zzzbList: [] //最新专职专办数组
                },
                ywlx: {
                    rc: '11',
                    za: '12',
                    zb: '13',
                    qx: '21',
                    zl: '31'
                }
            };
        },
        computed: {
            menuList() {
                var menus = this.$store.state.app.menuList;
                for (var i = 0; i < menus.length; i++) {
                    if (menus[i].name == 'qbzbpt') {
                        for (var j = 0; j < menus[i].children.length; j++) {
                            if (menus[i].children[j].name.indexOf('Details') != -1) {
                                menus[i].children.splice(j, 1);
                            }
                        }
                    }
                }
                return this.$store.state.app.menuList;
            },
            pageTagsList() {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath() {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            // avatorPath() {
            //   return localStorage.avatorImgPath;
            // },
            cachePage() {
                return this.$store.state.app.cachePage;
            },
            lang() {
                return this.$store.state.app.lang;
            },
            menuTheme() {
                return this.$store.state.app.menuTheme;
            },
            mesCount() {
                return this.$store.state.app.messageCount;
            },
            personal_Info() {
                return this.$store.getters.personal_Info;
            },
            avator() {
                if (this.personal_Info.img && this.personal_Info.img != '') {
                    return 'api/v1/imageManage/findImageByImgPath?imgPath=' + this.personal_Info.img + '&login=admin';
                } else {
                    return this.avatorPath
                }
            }
        },
        methods: {
            getDbList(time) {
                this.$store.dispatch("getDbList").then(res => {
                    if (res && res.length) {
                        this.dbObj.zlList = res.filter(item => { //最新指令
                            return item.ywlx == this.ywlx.zl;
                        })
                        this.dbObj.qqxcList = res.filter(item => { //最新请求协查
                            return item.ywlx == this.ywlx.qx;
                        })
                        this.dbObj.rchcList = res.filter(item => { //最新日常
                            return item.ywlx == this.ywlx.rc;
                        })
                        this.dbObj.zahcList = res.filter(item => { //最新专案
                            return item.ywlx == this.ywlx.za;
                        })
                        this.dbObj.zzzbList = res.filter(item => { //最新专职专办
                            return item.ywlx == this.ywlx.zb;
                        })
                        if (res[0].sqsj > time) {
                            $('.newMessage').show();
                            $('.showMessage').hide();
                            $('.newMessage').animate({
                                height: '255px'
                            }, 500)
                        }
                    }
                });
            },
            getNewList() {//获取最新的待办事项
                this.$store.dispatch("getDbList").then(res => {
                    if (res && res.length) {
                        this.dbObj.zlList = res.filter(item => { //代办指令总数
                            return item.ywlx == this.ywlx.zl;
                        })
                        this.dbObj.qqxcList = res.filter(item => { //待办请求协查总数
                            return item.ywlx == this.ywlx.qx;
                        })
                        this.dbObj.rchcList = res.filter(item => { //待办日常总数
                            return item.ywlx == this.ywlx.rc;
                        })
                        this.dbObj.zahcList = res.filter(item => { //待办专案总数
                            return item.ywlx == this.ywlx.za;
                        })
                        this.dbObj.zzzbList = res.filter(item => { //待办专职专办总数
                            return item.ywlx == this.ywlx.zb;
                        })
                        let hrefs = window.location.href;
                        if (hrefs.includes('?')) {
                            $('.newMessage').css('display', 'none')
                        } else {
                            $('.newMessage').animate({
                                height: '255px'
                            }, 1000)
                        }
                    } else {
                        $('.newMessage').css('display', 'none')
                    }
                })
            },
            handle() {
                let href = window.location;
                window.open(href.origin + '/#/workBench/workBenchManager?display=none')
            },
            hideMessage() { //缩小消息提醒
                $('.newMessage').animate({
                    height: '0',
                }, 500)
                setTimeout(() => {
                    $('.newMessage').hide();
                    $('.showMessage').show();
                }, 500)
            },
            showMessage() {
                this.getNewList();
                $('.newMessage').show();
                $('.showMessage').hide();
                $('.newMessage').animate({
                    height: '255px'
                }, 500)
            },
            goHome() {
                this.$router.push({
                    path: "/home"
                });
            },
            init() {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit("addOpenSubmenu", pathArr[1].name);
                }
                this.userName = Cookies.get("user");
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                // this.checkTag(this.$route.name);
                this.$store.commit("setMessageCount", 3);
            },
            toggleClick() {
                this.shrink = !this.shrink;
            },
            handleLoginOut() {
                // 退出登录

                this.$store.commit("logout", this);
                this.$store.commit("setMymenu", []);
                this.$store.commit("clearOpenedSubmenu");
                // window.location.href = 'http://74.6.57.207:8080/stars/frame_4g_stars3/login/default/login.jsp'
                // this.$router.push({
                // 	name: "login"
                // });
//				this.$store.dispatch("getUserInfo");
//				if(socket != null) { //关闭socket
//					var message = new proto.Model();
//					var browser = BrowserUtil.info();
//					message.setVersion("1.0");
//					message.setDeviceid("");
//					message.setCmd(4);
//					message.setSender(this.$store.getters.personal_userInfo.id);
//					message.setMsgtype(1);
//					message.setFlag(1);
//					message.setPlatform(browser.name);
//					message.setPlatformversion(browser.version);
//					message.setToken(Cookies.get('token'));
//					var bytes = message.serializeBinary();
//					socket.send(bytes);
//					logOutSystem = true;
//				}
//				window.location.reload();
            },
            // handleClickUserDropdown(name) {
            //   if (name === "ownSpace") {
            //     util.openNewPage(this, "ownspace_index");
            //     this.$router.push({
            //       name: "ownspace_index"
            //     });
            //   } else if (name === "loginout") {
            //     // 退出登录
            //     this.$store.commit("logout", this);
            //     this.$store.commit("setMymenu", []);
            //     this.$store.commit("clearOpenedSubmenu");
            //     this.$router.push({
            //       name: "login"
            //     });
            //     this.$store.dispatch("getUserInfo");
            //     if(socket!=null){ //关闭socket
            //         var message = new proto.Model();
            //         var browser=BrowserUtil.info();
            //         message.setVersion("1.0");
            //         message.setDeviceid("");
            //         message.setCmd(4);
            //         message.setSender(this.$store.getters.personal_userInfo.id);
            //         message.setMsgtype(1);
            //         message.setFlag(1);
            //         message.setPlatform(browser.name);
            //         message.setPlatformversion(browser.version);
            //         message.setToken(Cookies.get('token'));
            //         var bytes = message.serializeBinary();
            //         socket.send(bytes);
            //         logOutSystem=true;
            //     }
            //     window.location.reload();
            //   }
        },
        // checkTag(name) {
        //   let openpageHasTag = this.pageTagsList.some(item => {
        //     if (item.name === name) {
        //       return true;
        //     }
        //   });
        //   if (!openpageHasTag) {
        //     //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        //     util.openNewPage(
        //       this,
        //       name,
        //       this.$route.params || {},
        //       this.$route.query || {}
        //     );
        //   }
        // },
        handleSubmenuChange(val) {
        },
        beforePush(name) {
            return true;
        },
        fullscreenChange(isFullScreen) {
        },

        watch: {
            $route(to, from, next) {
                if (to.path == '/zbksh') {
                    $('.reset-page').css('background', '#fff')
                } else {
                    $('.reset-page').css('background', '#f0f0f0')
                }
                this.$store.commit("setCurrentPageName", to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit("addOpenSubmenu", pathArr[1].name);
                }
                // this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang() {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            },
            "pageTagsList.length": function (val) {
                if (val > 7) {
                    this.pageTagsList.shift();
                }
            },
            menuList(val) {

            }
        },
        mounted() {
            this.getNewList();
            setInterval(() => {
                let times = new Date().getTime() - 120 * 1000;
                if ($('.newMessage').css('display') == 'none') {
                    this.getDbList(times)
                }
            }, 120000)
            console.log('pageTagsList',this.pageTagsList)
            this.init();
        },
        created() {
            // 显示打开的页面的列表
            this.$store.commit("setOpenedList")
            this.$store.dispatch("getUser")
        }
    };
</script>