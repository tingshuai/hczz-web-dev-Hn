<template>
    <div style="height: 100%;">
        <div class="deterStartTop">
            <div class="left">
                <Button @click="backbtn" class="margin-right-20">返回</Button>
                <span>专班合成请求编号：</span>
                <span>{{code}}</span>
            </div>
            <div class="right">
                <!--<Button>处理流程</Button>-->
                <Button @click="membersBtn">小组成员</Button>
                <Button @click="flowsheetBtn">处理日志</Button>
            </div>
        </div>
        <div class="deterStartCon">

            <div class="right topRight">
                <hr/>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="我的任务" name="task">
                        <div slot="label">

                            <span>我的任务</span>
                            <!--<span class="oSpan">{{numbers}}</span>-->
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="详细信息" name="detail">
                    </el-tab-pane>
                </el-tabs>
                <component :is="currentView" style="margin-top: 74px;background: white;" ref="tasks"
                           @qsSuccess="qsSuccess" @fkSuccess="fkSuccess"></component>
            </div>
            <div class="left" style="height:50px;line-height:59px">
                <el-button type="primary" @click="over" size="small" v-if="isJsyp<4">结束研判</el-button>
                <p>
                    <span>案事件名称：</span>
                    <span class="overHidden" :title="content">{{content}}</span>
                    <span>| {{zt}}</span>
                </p>

            </div>
            <!--小组成员-->
            <div v-if="memebersShow">
                <groupMembers ref="groupMembers" :show="memebersShow" @update="memebersShow=false"
                              :groupFnc="groupFnc"></groupMembers>
            </div>
            <!--处理日志-->
            <div v-if="flowsheetShow">
                <treatmentFlowsheet :show.sync="flowsheetShow" @update="flowsheetShow=false"
                                    :flowFnc="flowFnc"></treatmentFlowsheet>
            </div>
            <!--结束研判-->
            <Modal v-model="overDeterShow" title="结束研判" class="modal-ct" :styles="{top: '250px',width:'250px'}"
                   @on-cancel="overDeterShow=false">
                <div slot="footer" class="font-size-0">
                    <Button type="default" class="cancelBtn" @click="overDeterShow=false">取消</Button>
                    <Button type="primary" class="sureBtn" @click="overDeterBtn">确定</Button>
                </div>
                <div>
                    <h3>是否结束研判</h3>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import api from '@/fetch/api.js';
    import task from './task/index';
    import detail from './detail/detail';
    import groupMembers from './groupMembers/index.vue';
    import treatmentFlowsheet from './treatmentFlowsheet/index';
    import Cookies from 'js-cookie';
    import {uniqueArr} from '@/libs/common/common';

    export default {
        components: {
            task,
            detail,
            groupMembers,
            treatmentFlowsheet
        },
        data () {
            return {
                activeName: 'task',
                taskList: [], // 我的任务树
                flowsheetShow: false, // 处理日志
                currentView: 'task',
                memebersShow: false,
                directFlow: {},
                numbers: 0, // 待处理条数
                groupFnc: null, // 小组成员
                flowFnc: null, // 处理日志
                overDeterShow: false, // 结束研判，
                isJsyp: 5, // 判断状态，根据状态，判断结束研判按钮是否显示
                zt: ''
            };
        },
        watch: {
            activeName (val) {
                this.currentView = val;
            },
            flowsheetShow (val) {
                if (val) {
                    this.flowFnc = this.getFlow();
                }
            }
        },
        computed: {
            code () {
                return this.$route.query.code;
            },
            content () {
                return this.$route.query.content;
            },
            accountId () {
                return window.localStorage.getItem('userId');
            },
            determineId () {
                return this.$route.query.id;
            },
            ids () {
                return this.$route.query.id;
            },
            zaid () {
                return this.$route.query.zaid;
            }
        },
        mounted () {
            this.groupFnc = this.getDetail();
        },
        methods: {
            handleClick (tab, event) {

            },
            membersBtn () {
                this.memebersShow = true;
            },
            flowsheetBtn () {
                this.flowsheetShow = true;
            },
            backbtn () {
                // this.$router.push({
                // path: '/fullTimeSet/determineManager'
                // })
                this.$router.go(-1);// 返回上一层
            },
            getDetail () {
                return new Promise((resolve, reject) => {
                    api.api('get', api.configUrl + '/hczz/zhb/queryDetail/' + this.determineId).then(res => {
                        this.isJsyp = res.sqxx.zt;
                        if (res.sqxx.zt > 3 && res.sqxx.zt < 7) {
                            this.zt = '已研判';
                        } else {
                            this.zt = '研判中';
                        }
                        if (this.isJsyp < 4) {
                            this.numbers = res.jzList.filter(item => {
                                return item.zt < 3;
                            }).length;
                        } else {
                            this.numbers = 0;
                        }
                        resolve(res);
                    });
                });
            },
            getFlow () {
                return new Promise((resolve, reject) => {
                    api.api('get', api.configUrl + '/hczz/zhb/getFlow/' + this.determineId).then(res => {
                        resolve(res);
                    });
                });
            },
            over () {
                this.overDeterShow = true;
            },
            overDeterBtn () {
                api.api('get', api.configUrl + '/hczz/zhb/endTask/' + this.determineId).then(res => {
                    this.overDeterShow = false;
                    this.$refs.tasks.myWork();
                    this.getDetail();
                    // this.getFlow();
                    this.$message.success('研判结束成功');
                });
            },
            qsSuccess (val) { // 签收成功回调
                this.flowFnc = this.getFlow();
            },
            fkSuccess () { // 反馈成功回调
                this.flowFnc = this.getFlow();
            }
        }
    };
</script>

<style lang="less">
    .deterStartTop {
        overflow: hidden;
        border: 1px solid #e6e6e6;
        background: white;
        padding: 20px;

        .left {
            float: left;

            span {
                font-size: 14px;
                color: #333333;
            }
        }

        .right {
            float: right;
        }
    }

    .deterStartCon {
        position: relative;
        border: 1px solid #e6e6e6;
        background: white;
        padding: 0 0 8px 0;
        height: 59px;
        margin-top: 20px;
        background: #fafafa;
        height: calc(~"100% - 100px");

        .overHidden {
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100px;
            white-space: nowrap;
            display: inline-block;
            /*width: 100px;*/
            line-height: 13px;
        }

        .left {
            font-size: 14px;
            color: #333333;
            float: left;
            height: 59px;
            width: 300px;
            padding-left: 20px;
            line-height: 50px;
            font-family: "microsoft yahei";

            .el-button {
                position: absolute;
                right: 20px;
                top: 5px;

                span {
                    color: white;
                }
            }

            span {
                color: #333333;
                font-size: 14px;
            }
        }

        .topRight {
            float: right;
            width: 100%;
            margin-left: -300px;
            margin-bottom: -15px;
            border: 1px solid #fafafa;
            background: white;

            hr {
                position: absolute;
                top: 49px;
                background: #ececec;
                width: 100%;
            }

            .oSpan {
                height: 20px;
                width: 20px;
                display: inline-block;
                border-radius: 50%;
                background: #f4884e;
                color: white;
                text-align: center;
                line-height: 20px;
                position: absolute;
            }

            .el-tabs--top {
                width: 377px;
                float: right;

                .el-tabs__nav {
                    height: 59px;
                }

                #tab-task {
                    line-height: 50px;
                }
            }
        }
    }

    .el-tabs__item {
        color: #999999;
    }
</style>