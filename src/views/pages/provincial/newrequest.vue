<template>
    <el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
        <!-- <el-form :inline="true" class="demo-form-inline theinput">
            <el-form-item label="案件名称：">
                <el-input v-model="basePage.ajmc" size="small" placeholder="请输入案件名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="申请人：">
                <el-input v-model="basePage.sqrxm" size="small" placeholder="请输入申请人" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="search">查询</el-button>
                <el-button type="primary" @click="add('new')" size="small">新建</el-button>
            </el-form-item>
        </el-form> -->
        <Form inline :label-width="75" class="search-ct">
            <FormItem label="案事件名称：">
                <Input type="text" v-model="basePage.ajmc" placeholder="请输入案事件名称" clearable style="width: 180px"></Input>
            </FormItem>
            <FormItem label="申请人：">
                <Input type="text" v-model.trim="basePage.sqrxm" placeholder="请输入申请人" clearable
                       style="width: 180px"></Input>
            </FormItem>
            <FormItem label="申请时间：">
                <DatePicker type="daterange"   clearable
                            placement="bottom-end" placeholder="请选择申请时间" style="width: 180px"
                            @on-change="handleDate"></DatePicker>
            </FormItem>
            <Button type="primary" class="searchBtn" @click="search" style="margin-right:8px;">查询</Button>
            <Button type="primary" class="searchBtn" @click="add('new')">新建</Button>
            <!-- <el-button type="primary"  @click="add()" size="small">新建</el-button> -->
        </Form>

        <el-dialog class="modal-ct workBench-group-modal thetree" :title="title" @close='closeModel' :visible.sync="visible" :modal-append-to-body='false' width="1030px">
            <el-form :model="formValidate" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="申请人：">
                            <el-input v-if="flag" v-model.trim="formValidate.sqr" clearable size="small"
                                      v-model="userInfo.userName" disabled></el-input>
                            <span v-if="!flag" :title="xcObj.sqr" class="oSpan">{{xcObj.sqr}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请单位：">
                            <el-input v-if="flag" v-model.trim="formValidate.sqdw" clearable size="small"
                                      v-model="userInfo.officeName" disabled></el-input>
                            <span v-if="!flag" :title="xcObj.sqbmmc" class="oSpan">{{xcObj.sqbmmc}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系电话：">
                            <el-input v-if="flag" v-model.trim="formValidate.sqrlxdh" disabled clearable size="small"
                                      :maxlength="11"></el-input>
                            <span v-if="!flag" :title="xcObj.sqrlxdh" class="oSpan">{{xcObj.sqrlxdh}} </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="案件编号：" prop="sabjbh">
                            <el-input v-if="flag" v-model.trim="formValidate.sabjbh" clearable size="small"  :maxlength="20" placeholder="请输入"></el-input>
                            <span v-if="!flag" :title="xcObj.sabjbh" class="oSpan">{{xcObj.sabjbh}}</span>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="案件名称：" prop="ajmc">
                            <el-input v-if="flag" v-model.trim="formValidate.ajmc" :maxlength="20" clearable
                                      size="small" placeholder="请输入"></el-input>
                            <span v-if="!flag" :title="xcObj.ajmc" class="oSpan">{{xcObj.ajmc}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="案件类型：" clearable fliterable prop="jqajlx">
                            <el-input v-if="flag" v-model.trim="formValidate.jqajlx" :maxlength="20" clearable
                                      size="small" placeholder="请输入"></el-input>
                            <span v-if="!flag" :title="xcObj.jqajlx" class="oSpan">{{xcObj.jqajlx}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

				<el-row class="cc">
					<el-col :span=12>
						<el-form-item label="请求级别：" prop='qqjb'>
							<el-select v-if="flag" size='small' v-model="formValidate.qqjb" @change="handleZljbSeclect" clearable fliterable>
								<el-option v-for="item in zljbVaildSelect" :key='item.id' :value="item.id" :label="item.zljblxmc">
								</el-option>
							</el-select>
							<span v-if="!flag" class="oSpan">{{ zljbVaildSelect.filter((val,i,arr)=>{ return val.id == xcObj.qqjb })[0].zljblxmc }}</span>			
						</el-form-item>
					</el-col>
					<el-col :span="12" class="rowIn">
						<!-- <el-form-item label="签收时限：" prop='qssx' clearable>
							<el-input v-model.trim="formValidate.qssx" disabled></el-input>
						</el-form-item> -->
						<el-form-item v-if="flag" label="签收时限：">
							<timer :objTime="objTimeQssx" @timeChange="timeChangeQssx"></timer>
						</el-form-item>
						<el-form-item v-if="flag" label-width="10px">
							<DatePicker :editable="false" :readonly="true" :disabled="true" :value="formValidate.qsdqsj" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择签收时间"></DatePicker>
						</el-form-item>	
						<el-form-item label="签收时限：" v-if="!flag">
							<span class="oSpan">{{  `${ Math.floor(xcObj.qssx / 60) } 时 ${ parseInt(xcObj.qssx % 60) } 分` }}</span>			
						</el-form-item>														
					</el-col>
				</el-row>  
				<el-row>
					<el-col :span="12" class="rowIn">
						<!-- <el-form-item label="反馈时限：" prop='fksx'>
							<el-input v-model="formValidate.fksx" disabled></el-input>
						</el-form-item> -->
						<el-form-item v-if="flag" label="反馈时限：">
							<timer :objTime="objTimeFksx" @timeChange="timeChangeFksx"></timer>
						</el-form-item>
						<el-form-item v-if="flag" label-width="10px">
							<DatePicker :value="formValidate.fkdqsj" :disabled="true" :readonly="true" :editable="false" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择反馈时间"></DatePicker>
						</el-form-item>
						<el-form-item label="反馈时限：" v-if="!flag">
							<span class="oSpan">{{  `${ Math.floor(xcObj.fksx / 60) } 时 ${ parseInt(xcObj.fksx % 60) } 分` }}</span>			
						</el-form-item>	
					</el-col>
				</el-row>    
                <br/>
                <el-row style="position: relative;" id="tree">
                    <el-col :span="24">
                        <el-form-item label="接收单位：" prop="jsdw">
                            <Button @click="handleReceiveOffice" v-if="flag">选择</Button>
                            <el-input v-show="false" v-model.trim="formValidate.jsdw" :rows="1" size="small"></el-input>
                            <el-tag v-if="flag" v-for="(tag,index) in resetObj.receiveOfficeArr" :key="tag.title"
                                    closable type="info" @close="delectReceiveArr(index)">{{tag.title}}
                            </el-tag>
                            <span v-if="!flag" :title="xcObj.jsdwmc" class="oSpan">{{xcObj.jsdwmc}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <br/>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="案件简介：" prop="bz">
                            <el-input v-if="flag" v-model.trim="formValidate.bz" :maxlength="200" clearable
                                      type="textarea" :rows="3" size="small"></el-input>
                            <span v-if="!flag" :title="xcObj.bz" class="oSpan">{{xcObj.bz}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="协作内容：" prop="jyrwnr">
                            <el-input v-if="flag" v-model.trim="formValidate.jyrwnr" :maxlength="200" clearable
                                      type="textarea" :rows="3" size="small"></el-input>
                            <span v-if="!flag" :title="xcObj.jyrwnr" class="oSpan">{{xcObj.jyrwnr}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isbackshow">
                    <el-col :span="24" v-if="isbackshow">
                        <el-form-item label="退回原因：" prop="jsdwbz" v-if="isbackshow">
                            <el-input v-if="flag" v-model.trim="formValidate.jsdwbz" :maxlength="100" clearable
                                      type="textarea" :rows="3" size="small"></el-input>
                            <span v-if="!flag" :title="xcObj.jsdwbz" class="oSpan">{{xcObj.jsdwbz}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="file">
                    <el-col :span="12">
                        <el-form-item label="手续附件：">
                            <el-upload v-if="flag" class="upload-demo" action="##" :auto-upload='false' multiple
                                       :on-remove="handleTaskRemoveSX" ref="taskUploadSX" :on-change="handleTaskFileSX">
                                <el-button size="small">
                                    <i class="el-icon-loading el-icon--left"></i> 点击上传
                                </el-button>
                            </el-upload>
                            <a v-for='(item,index) in dirTaskFileSX' v-if="!flag" :key="index" style="cursor: pointer;">
                                <p @click="handlePrev(item)" class="tastFile" :title="item.filename" style="margin:0px">
                                    <i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;
                                </p>
                            </a>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务附件：">
                            <el-upload v-if="flag" class="upload-demo" action="##" :auto-upload='false' multiple
                                       :on-remove="handleTaskRemoveRW" ref="taskUploadRW" :on-change="handleTaskFileRW">
                                <el-button size="small">
                                    <i class="el-icon-loading el-icon--left"></i> 点击上传
                                </el-button>
                            </el-upload>
                            <a v-for='(item,index) in dirTaskFileRW' v-if="!flag" :key="index" style="cursor: pointer;">
                                <p @click="handlePrev(item)" class="tastFile" :title="item.filename" style="margin:0px">
                                    <i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;
                                </p>
                            </a>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button type="primary" v-if="flag" @click="closeModel" class="cancelBtn" size="small">取消</el-button>
                <el-button type="primary" v-show="!flag" @click="closeModel" class="cancelBtn" size="small">关闭
                </el-button>
                <el-button v-if="flag" type="primary" class="sureBtn successBtn" @click="saveInfo" size="small"
                           :loading="xjloading">确定
                </el-button>
            </div>
        </el-dialog>
        <div>
            <receive-office :show.sync="isReceive" @handleOffice="handleOffice"></receive-office>
        </div>
        <div class="table-ct" :style="{height:height}">
            <el-table :data='list' :stripe="true" height="100%">
                <el-table-column label="编号" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :title="scope.row.sqwh">{{scope.row.sqwh}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :title="scope.row.sqr">{{scope.row.sqr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="接收单位" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :title="scope.row.jsdwmc">{{scope.row.jsdwmc}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="案事件名称" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :title="scope.row.ajmc">{{scope.row.ajmc}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="简要任务内容" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :title="scope.row.jyrwnr" class="sl">{{scope.row.jyrwnr}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="联系电话" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :title="scope.row.sqrlxdh">{{scope.row.sqrlxdh}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="申请时间" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :title="scope.row.sqrq">{{scope.row.sqrq | timestampToTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span class="span-dqzt" :title="scope.row.zt">{{scope.row.zt|qqxcztFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <a class="a-czl" href="javascript:void(0)" @click="add(scope.row)">查看</a>
                        <a class="a-czl" href="javascript:void(0)" @click="handleRow(scope.row)">流程</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-ct">
            <!-- <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="basePage.pageindex" :page-sizes="pageArray" :page-size="10" :total="total">
            </el-pagination> -->
            <Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex"
                  show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange"
                  :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
        </div>
    </el-card>
</template>

<script>
	import api from '@/fetch/api.js';
    import {timestampToTime} from '@/libs/common/common';
	import timer from '@/views/pages/directive/check/timer.vue';

    import receiveOffice from './receiveOffice.vue';

    export default {
        components: {receiveOffice,timer},
        data() {
            return {
                zljbVaildSelect:[],//指令级别....
				objTimeQssx:{
					event:"timeChange",
					hours:null,
					minutes:null
				},
				objTimeFksx:{
					event:"timeChange",
					hours:null,
					minutes:null
				},	                
                xjloading: false, // 新建loading
                basePage: { // 查詢对象
                    pageindex: 1,
                    pagesize: 10,
                    ajmc: null,
                    sqrxm: null,
                    tszt: '0',
                    ywlx: api.ywlx.qx,
                    starttime: '',
                    endtime: ''
                },
                pageArray: [10, 20, 30, 40], // 每页显示条数数组
                total: 0, // 条数
                list: [], // 表格数组
                height: 0, // 表格高度
                formValidate: {// 发起请求对象
                    sqlx: '1',
                    sabjbh: null,
                    ajmc: null,
                    jyrwnr: null,
                    bz: null,
                    jqajlx: null,
                    jsdw: null,
                    ywlx: api.ywlx.qx,
                    jsdwbz: null,
					qsdqsj:'',
                    fkdqsj:'',
					qssx: null,
                    fksx: null,     
                    qqjb:null,
                    qqjbmc:null               
                },
                rules: {// 校验对象
                    sabjbh: [{
                        required: true,
                        message: '案件编号为必填项',
                        trigger: 'blur'
                    }],
                    ajmc: [{
                        required: true,
                        message: '案件名称为必填项'
                    }],
                    jqajlx: [{
                        required: true,
                        message: '案件类型为必填项'
                    }],
                    jsdw: [{
                        required: true,
                        message: '接收单位为必填项'
                    }],
                    bz: [{
                        required: true,
                        message: '案件简介为必填项'
                    }],
                    jyrwnr: [{
                        required: true,
                        message: '协做内容为必填项'
					}],
                    qqjb: [{
                        required: true,
                        message: '请求级别为必填项'
					}]
                },
                resetObj: {
                    dwgl: [],
                    receiveOfficeArr: [], // 接收单位
                    procedFileArr: [], // 手续附件
                    TaskFileArr: []// 任务附件
                },
                visible: false,
                flag: true, // 新建 or 查看
                title: '新建请求',
                xcObj: {},
                userInfo: {},
                dirTaskFileRW: [],
                show: false,
                dirTaskFileSX: [],
                checkedList: [],
                dwList: [],
                isReceive: false, // 接收单位弹框
				isbackshow: false,// 退回原因是否显示
				listOfZAHC:[]
            };
        },
        mounted() {
            this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
            window.onresize = () => {
                this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
			};
            this.render();
			this.getSelect();
//			this.getListOfZAHC();
        },
        watch: {
            title(val) {
                if (val == '新建请求') {
                    $('.el-dialog__body .el-form-item').css('marginBottom', '20px');
                } else {
                    $('.el-dialog__body .el-form-item').css('marginBottom', '0');
                }
            }
        },
        methods: {
			ajbhBlur(val){//案件编号失去焦点  搜索指定案件编号信息
				let _item = this.listOfZAHC.filter((val,i,arr)=>{
					return val.ajbh == this.formValidate.sabjbh;
				})
				if( _item.length == 0 ){
					this.$message.warning("未查找到此案件编号相关信息!");
				}else{
					this.formValidate.ajmc = _item[0].ajmc;
					this.formValidate.jqajlx = _item[0].ajlbMc;
					this.formValidate.bz = _item[0].jyaq;
				}
			},
			timeChangeQssx(val){
				this.formValidate.qssx = val;
				this.setTimeInterval();//更新计时器...
			},
			timeChangeFksx(val){
				this.formValidate.fksx = val;
				this.setTimeInterval();//更新计时器...
			},            
            pagesizeChange() {
                this.basePage.pagesize = val;
                this.render();
            },
			handleZljbSeclect(val) {
				var res = this.zljbVaildSelect.filter(item => {
					return item.id == val;
                });
				this.objTimeFksx.hours = Math.floor(res[0].fksx/60);
				this.objTimeFksx.minutes = res[0].fksx - Math.floor(res[0].fksx/60)*60;
				this.objTimeQssx.hours = Math.floor( res[0].qssx/60 );
				this.objTimeQssx.minutes = res[0].qssx - Math.floor(res[0].qssx/60)*60;
				this.formValidate.qssx = res[0].qssx;
                this.formValidate.fksx = res[0].fksx;
                this.formValidate.qqjbmc = res[0].zljblxmc;
				this.setTimeInterval();
			},
			setTimeInterval(){
				//联动 签收时间和反馈时间......
				clearInterval(this.intemer);
				let that = this;
				this.intemer = setInterval(()=>{
					that.formValidate.qsdqsj = new Date( Date.now() + that.formValidate.qssx*60000 );
					that.formValidate.fkdqsj = new Date( Date.now() + that.formValidate.fksx*60000 );
				},1000);
			},    
			//请求专案合成列表
			getListOfZAHC(){
                api.api('post',api.configUrl+'/hczz/ajjbxx/queryAjjbxxList',{pageindex:1,pagesize:99999}).then(res=>{
					this.listOfZAHC = res.list;
                })
			},
            // 流程查看
            handleRow(val) {
                console.log('1');
                this.$router.push({
                    path: '/ksb',
                    query: {
                        id: val.id,
                        type: 2,
                        bmmc: val.sqbmmc
                    }
                });

                // console.log(val)
                // this.isDispose = true;
                // this.$store.commit('setZlId', val.zljb);
            },
            render() {
                this.list = [];
                api.api('post', api.configUrl + '/hczz/qqxc/querySqxxList', this.basePage).then(res => {
                    this.list = res.list;
                    this.total = res.total;
                    res.list.map(item => {
                        if (item.zt == 8) {
                            this.isbackshow = true;
                        } else {
                            this.isbackshow = false;
                        }
                    });
                });
            },
            getUseInfo() {
                this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                this.formValidate.sqrlxdh = this.userInfo.phone;
            },
            initOffice() {
                let obj = {
                    pageindex: 1,
                    pagesize: 100000
                };
                api.json('post', api.systemUrl + '/office/findOfficeRelation', obj).then(res => {
                    this.dwList = res.list;
                });
            },
            disabledArr(arr) {
                let self = this;
                $.each(arr, (index, val) => {
                    val.disabled = true;
                    if (val.children.length) {
                        self.disabledArr(val.children);
                    }
                });
                return arr;
            },
            closeModel() {
                this.visible = false;
                this.formValidate = {
                    sqlx: '1',
                    sabjbh: null,
                    ajmc: null,
                    jyrwnr: null,
                    jsdw: null,
                    bz: null,
                    jqajlx: null,
					qsdqsj:'',
                    fkdqsj:'',
					qssx: null,
					fksx: null,                    
                };
                this.objTimeQssx.hours = null;
                this.objTimeQssx.minutes = null;
                this.objTimeFksx.hours = null;
                this.objTimeFksx.minutes = null;
                if (this.title == '新建请求') {
                    this.$refs.taskUploadSX.clearFiles();
                    this.$refs.taskUploadRW.clearFiles();
                }
                this.resetObj.procedFileArr = [];
                this.resetObj.TaskFileArr = [];
                this.$refs.ruleForm.resetFields();
                this.resetObj.receiveOfficeArr = [];
            },
            saveInfo() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.xjloading = true;
                        let tsqxx = {};
                        let arr = Object.keys(this.formValidate);
                        $.each(arr, (index, val) => {
                            tsqxx[val] = this.formValidate[val];
                        });
                        if (tsqxx.qssx) {
                            tsqxx.qssx = new Date(tsqxx.qssx).getTime();
                        }
                        if (tsqxx.fksj) {
                            tsqxx.qssx = new Date(tsqxx.fksx).getTime();
                        }
                        tsqxx.ywlx = api.ywlx.qx;
                        tsqxx.jsdw = this.resetObj.dwgl[0].jsdw;
                        tsqxx.jsdwmc = this.resetObj.dwgl[0].jsdwmc;
                        this.formValidate.sqlx = '1';
                        let attach = [];
                        attach = attach.concat(this.resetObj.TaskFileArr);
                        attach = attach.concat(this.resetObj.procedFileArr);
                        let objs = {
                            sqxx: tsqxx,
                            attach: attach,
                            dwgl: this.resetObj.dwgl
                        };
                        api.api('post', api.configUrl + '/hczz/qqxc/insertQqxc', objs).then(res => {
                            this.xjloading = false;
                            this.$message.success('添加成功！');
                            this.visible = false;
                            this.render();
                            this.closeModel();
                        });
                    }
                });
            },
            add(val) {
                this.xjloading = false;
                if (val == 'new') {
                    this.getUseInfo();
                    this.title = '新建请求';
                    if (this.title = '新建请求') {
                        this.isbackshow = false;
                    }
                    this.flag = true;
                } else {
                    this.flag = false;
                    this.xcObj = val;
                    this.title = '编号：' + val.sqwh;
                    var arr = this.dwList.filter(item => {
                        return item.officeCode === val.jsdw;
                    });
                    arr.forEach(item => {
                        this.xcObj.jsdwmc = item.officeName;
                    });
                    if (this.xcObj.zt == 8) {
                        this.isbackshow = true;
                    } else {
                        this.isbackshow = false;
                    }
                    this.getRWFile(val.id);
                    this.getSXFile(val.id);
                }
                this.visible = true;
            },
            search() {
                this.basePage.pageindex = 1;
                this.render();
            },
            pageChange(val) {
                this.basePage.pageindex = val;
                this.render();
            },
            handleCurrentChange(val) {
                this.basePage.pageindex = val;
                this.render();
            },
            handleTaskRemoveRW(file, fileList) {
                this.resetObj.TaskFileArr = this.resetObj.TaskFileArr.filter(item => {
                    return item.filename + '.' + item.category !== file.name;
                });
            },
            handleTaskRemoveSX(file, fileList) {
                this.resetObj.procedFileArr = this.resetObj.procedFileArr.filter(item => {
                    return item.filename + '.' + item.category !== file.name;
                });
            },
            handleTaskFileRW(e) {
				this.resetObj.TaskFileArr.push(this.handleFileDate(e, '2'));
            },
            handleTaskFileSX(e) {
				this.resetObj.procedFileArr.push(this.handleFileDate(e, '1'));
            },
            handleFileDate(e, type) {
				type == "1" ? (this.isProceUpload = true) : (this.isTaskUpload = true);
				let Obj = {};
				Obj["category"] = e.name.replace(/.+\.+/g, "");
				var reg = new RegExp("." + Obj["category"] + "$");
				Obj["filename"] = e.name.replace(reg, "");
				Obj["minetype"] = e.raw.type;
				this.readerFile(e.raw).then(res => {
					Obj["data"] = res.split('base64,')[1]
					type == "1" ?
						(this.isProceUpload = false) :
						(this.isTaskUpload = false);
				});
				Obj["type"] = type;
				return Obj;
            },
			getSelect() {
				const a = api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/getZlsxpzList",{type:'0'});
				Promise.all([a]).then(([resA]) => {
                    this.zljbVaildSelect = resA;
				});
			},            
            readerFile(file) {
                return new Promise(resolve => {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        resolve(this.result);
                    };
                });
            },
            getRWFile(id) {
                api.api('post', api.configUrl + '/hczz/fj/getFjData', {
                    glid: id,
                    tablename: 'T_HCZZ_SQXX',
                    type: '2'
                }).then(res => {
                    this.dirTaskFileRW = res;
                });
            },
            getSXFile(id) {
                api.api('post', api.configUrl + '/hczz/fj/getFjData', {
                    glid: id,
                    tablename: 'T_HCZZ_SQXX',
                    type: '1'
                }).then(res => {
                    this.dirTaskFileSX = res;
                });
            },
            handlePrev(val) {
                api.upload(val);
            },
            handleOffice(val) {
                this.resetObj.receiveOfficeArr = val;
                if (val.length) this.formValidate.jsdw = val[0].title;	// 设置接受单位必填字段
                $.each(val, (index, value) => {
                    this.resetObj.dwgl = [{
                        jsdw: value.code,
                        jsdwmc: value.title,
                        sqlx: '2'
                    }];
                });
                //	this.formValidate["receiveOfficeArr"] = val
            },
            delectReceiveArr(index) {
                this.formValidate['jsdw'] = null;
                this.formValidate['receiveOfficeArr'] = null;
                this.resetObj.receiveOfficeArr.splice(index, 1);
            },
            handleReceiveOffice() {
                this.isReceive = true;
            },
            handleDate(val) {
                if (val[0] != '') {
                    this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
                    this.basePage.endtime = new Date(`${val[1]} 23:59:59`);
                } else {
                    this.basePage.starttime = '';
                    this.basePage.endtime = '';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
	.rowIn{
		display: flex;
		justify-content: flex-start;
		.el-form-item{
		}
	}
    .modal-ct .el-form-item {
        /*margin-bottom: 20px;*/
    }

    ul {
        list-style: none;
    }

    .searchTree {
        position: absolute;
        z-index: 99;
        width: 500px;
        height: 178px;
        overflow: auto;
    }

    .modal-ct .oSpan {
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        overflow: hidden;
    }

    .file .el-form-item__content {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .sl {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }

    .el-dialog .el-form-item__content .tastFile {
        word-break: break-all;
    }
</style>