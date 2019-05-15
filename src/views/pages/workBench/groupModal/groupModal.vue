<template>
    <!--新增对话框-->
    <el-dialog class="modal-ct workBench-group-modal" :title="modelTitle" @close='closeModel("all")'
               :visible.sync="visible" :modal-append-to-body='false' width="600px">
        <div v-if="!empowerShow">
            <Tabs value="leader" v-show="!isSelect">
                <TabPane label="副组长" name="leader" v-if="!isFzz">
                    <leader-modal @addLeader="addLeader" @empowerClick="empowerClick" ref="leader"
                                  :zaid="zaid"></leader-modal>
                </TabPane>
                <!-- <TabPane label="组员" name="menber">
                    <menber-modal @addMenber="addMenber" @empowerClick="empowerClick" ref="member"
                                  :zaid="zaid"></menber-modal>
                </TabPane> -->
            </Tabs>

            <div v-if="isSelect">
                <select-modal ref="selectModal" :roleInfo='roleInfo' @click-role-node="nodeClick"></select-modal>
            </div>
        </div>
        <div v-else class="empowerRadio">
            <el-radio v-model="empower" label="1">副组长</el-radio>
            <el-radio v-model="empower" label="2">组员</el-radio>
        </div>
        <div slot="footer">
            <Button type="text" v-if="!empowerShow" @click="closeModel" class="cancelBtn">取消</Button>
            <Button type="primary" v-if="!empowerShow && isSelect" class="sureBtn" @click="saveInfo">确认</Button>
            <Button type="text" v-if="empowerShow" @click="closeEmpower" class="cancelBtn">取消</Button>
            <Button type="primary" v-if="empowerShow" class="sureBtn" @click="sureEmpower">确认</Button>
        </div>
    </el-dialog>
</template>
<script>
    import api from "@/fetch/api.js";
    import {assign} from "@/libs/common/common.js";
    import leaderModal from './leaderModal.vue'
    import menberModal from './menberModal.vue'
    import selectModal from './selectModal.vue'

    export default {
        components: {
            leaderModal,
            menberModal,
            selectModal
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            zzid: {
                type: String,
                default: ''
            },
            isFzz: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                visible: this.show,
                modelTitle: "小组管理",
                isSelect: false,
                empowerShow: false,//授权页面是否显示
                empower: '1',//授权为组员或者组长,
                zyObj: {},//授权的该条的所有信息
                roleInfo: {
                    isLeader: false
                },
                parmas: null,
                data: [],
                zaid: this.zzid,//专案id
                columns: [{
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                    {
                        title: "图片",
                        key: "",
                        align: "center"
                    },
                    {
                        title: "名称",
                        align: "center",
                        key: ""
                    },
                    {
                        title: "部门",
                        align: "center",
                        key: ""
                    },
                    {
                        title: "操作",
                        align: "center",
                        key: ""
                    }
                ]
            };
        },
        mounted() {
            console.log(this.isFzz)
        },
        watch: {
            show() {
                this.visible = this.show;
            },
            zzid(val) {
                this.zaid = val;
            }
        },
        methods: {
            // 新增表单数据
            addconfirm() {
            },
            // 关闭模态框后更新数据
            closeModel(type) {
                console.log(this.visible);
                if (type === 'all') {
                    if (this.isSelect) {
                        this.isSelect = false;
                        this.$emit('update:show', false)
                    } else {
                        this.$emit('update:show', false)
                    }
                } else {
                    if (this.isSelect) {
                        this.isSelect = false;
                        // this.$emit('update:show', false)
                    } else {
                        this.$emit('update:show', false)
                    }
                }
                this.empowerShow = false;
            },
            closeEmpower() {
                this.modelTitle = '小组管理';
                this.empowerShow = false;
            },
            sureEmpower() {
                this.$set(this.zyObj, 'zylx', this.empower)
                api.api('post', api.configUrl + '/hczz/zaz/updateZylx', this.zyObj).then(res => {
                    this.$message.success('授权成功！')
                    this.closeEmpower();
                    this.$refs.leader.initTable();
                    this.$refs.member.initTable();
                })
            },
            saveInfo() {
                console.log(this.parmas, "AA")
                if (this.isSelect) {
                    this.handleDate()
                    if (this.parmas) {
                        api.api('post', api.configUrl + '/hczz/zaz/insertZazxx', this.parmas).then(res => {
                            this.$message.success('恭喜你添加人员成功！')
                            this.isSelect = false;
                            if (!this.isFzz) {
                                this.$refs.leader.initTable();
                            }
                            this.$refs.member.initTable();
                        })
                    } else {
                        this.$message.error("请选择组员");
                    }
                }
            },
            handleDate() {
                var res = JSON.parse(JSON.stringify(this.$refs.selectModal.selectedDate))
                var data = []
                res.forEach(item => {
                    var obj = this.handleRoleData(item)
                    obj.zylx = this.roleInfo.isLeader ? 1 : 2
                    data.push(obj);
                })
                this.parmas = this.roleInfo.isLeader ? data[0] : data[0]
            },
            nodeClick(val) {

            },
            handleRoleData(val) {
                var result = {};
                return {
                    xm: val.title,
                    officecode: val.officeCode,
                    officename: val.officeName,
                    userid: val.id,
                    jybh: val.staffCard,
                    zw: val.zw,
                    zp: val.img,
                    lxdh: val.phone,
                    gadh: val.fixedNo,
                    zylx: null,
                    sqlx: '0',
                    zaid: this.zaid
                };
            },
            addLeader() {
                this.isSelect = true;
                this.roleInfo.isLeader = true;
            },
            addMenber() {
                this.roleInfo.isLeader = false;
                this.isSelect = true;
            },
            empowerClick(params) {
                this.modelTitle = '授权';
                this.empowerShow = true;
                this.zyObj = params;
            }
        }
    };
</script>
<style lang="less">
    .ivu-table-overflowX {
        overflow-x: hidden;
    }

    .ivu-table-tip {
        overflow-x: hidden;
    }

    .workBench-group-modal {
        .ivu-tabs-bar {
            margin-bottom: 0px;
        }

        .ivu-form {
            padding: 10px 0px;

            .ivu-form-item {
                margin-bottom: 10px;
            }
        }

        .empowerRadio {
            padding: 20px 20px 10px;
        }
    }
</style>