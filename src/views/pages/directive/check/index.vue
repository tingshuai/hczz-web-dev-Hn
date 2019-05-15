<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
		<Form inline :label-width="75" class="search-ct">
			<FormItem label="指令名称：">
				<Input type="text" v-model.trim="basePage.zlmc" placeholder="请输入指令名称" clearable style="width: 180px"></Input>
			</FormItem>
			<FormItem label="下发人：">
				<Input type="text" v-model.trim="basePage.xfrxm" placeholder="请输入下发人" clearable style="width: 180px"></Input>
			</FormItem>
			<FormItem label="下发时间：">
				<DatePicker type="daterange"   clearable placement="bottom-end" placeholder="请选择下发时间" style="width: 180px" @on-change="handleDate"></DatePicker>
			</FormItem>
			<!-- <FormItem label="状态：">
				<Select v-model="basePage.spzt" style="width: 180px" filterable clearable>
					<Option v-for="item in statusSelect" :value="item.key" :key="item.key">{{item.label}}</Option>
				</Select>
			</FormItem> -->
			<FormItem label="指令级别：">
				<Select v-model="basePage.zljb" style="width: 180px" filterable clearable>
					<Option v-for="item in zljbselect" :value="item.id" :key="item.id">{{ item.zljblxmc}}</Option>
				</Select>
			</FormItem>
			<Button type="primary" class="searchBtn" @click="search" style="margin-right:5px;">查询</Button>
			<Button type="primary" class="searchBtn" @click="add()">新建</Button>
			<!-- <el-button type="primary"  @click="add()" size="small">新建</el-button> -->
		</Form>
		
		<div class="table-ct" :style="{height:height}">
			<el-table :data='list' :stripe="true" height="100%">
				<!-- <el-table-column label="序号" align="center"
            type="index">
          </el-table-column> -->
				<el-table-column label="指令编号" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zlwh">{{scope.row.zlwh}}</span>
					</template>
				</el-table-column>
				<el-table-column label="下发人" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.czrxm">{{scope.row.czrxm}}</span>
					</template>
				</el-table-column>
				<el-table-column label="指令名称" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zlmc">{{scope.row.zlmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="指令级别" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zljb | jbFilter">{{scope.row.zljb | jbFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column label="指令类型" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zllxmc">{{scope.row.zllxmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="下发时间" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.czsj |timestampToTime">{{scope.row.czsj|timestampToTime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="接收部门" align="center" >
					<template slot-scope="scope">
						<span v-if="scope.row.zldwgls[0]" :title="scope.row.zldwgls[0].jsdwmc">{{scope.row.zldwgls[0].jsdwmc}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="状态" align="center" >
					<template slot-scope="scope">
						<span :title="scope.row.zldwgls[0].zt| zlcxFilter">{{scope.row.zldwgls[0].zt | zlcxFilter}}</span>
					</template>
				</el-table-column> -->
				<el-table-column label="当前状态" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zldwgls[0].zt" :class="scope.row.spzt==2 ? 'orSpan' :'blSpan'">{{scope.row.zldwgls[0].zt | ztFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="handleRow(scope.row)">流程</a>
						<a href="javascript:void(0)" @click="rowClick(scope.row)">查看</a>
					</template>
				</el-table-column>
			</el-table>
		</div>
		
		<div class="pagination-ct">
			<Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
		</div>
		<div v-if="isDispose">
			<dispose-modal :show.sync="isDispose" :zlid="zlid" :limain.sync='limain'></dispose-modal>
		</div>
		<div v-if="isbackshow">
			<el-dialog class="modal-ct workBench-group-modal thetree" :visible.sync="isbackshow" :title = "title" @close='closeModel' :modal-append-to-body='false' width="1028px">
					<el-form ref="formValidate" :model="formValidate" label-width="100px" :rules="ruleValidate" size="small" style="padding:18px 20px 16px">
						<el-row class="cc">
							<el-col :span="12">
								<el-form-item label="指令名称：" prop='zlmc'>
									<el-input v-model.trim="formValidate.zlmc" clearable style="width:auto" maxlength="20"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="指令类型：" prop='zllx' clearable fliterable>
									<el-select size='small' v-model="formValidate.zllx" @change="handleZllxselect" clearable fliterable>
										<el-option v-for="item in zllxselect" :key='item.id' :value="item.id" :label="item.title">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="cc">
							<el-col :span=12>
								<el-form-item label="指令级别：" prop='zljb'>
									<el-select size='small' v-model="formValidate.zljb" @change="handleZljbSeclect" clearable fliterable>
										<el-option v-for="item in zljbselect" :key='item.id' :value="item.id" :label="item.zljblxmc">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" class="rowIn">
								<!-- <el-form-item label="签收时限：" prop='qssx' clearable>
									<el-input v-model.trim="formValidate.qssx" disabled></el-input>
								</el-form-item> -->
								<el-form-item label="签收时限：">
									<timer :objTime="objTimeQssx" @timeChange="timeChangeQssx"></timer>
								</el-form-item>
								<el-form-item label-width="10px">
									<DatePicker :editable="false" :readonly="true" :disabled="true" :value="formValidate.qsdqsj" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择签收时间"></DatePicker>
								</el-form-item>								
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" class="rowIn">
								<!-- <el-form-item label="反馈时限：" prop='fksx'>
									<el-input v-model="formValidate.fksx" disabled></el-input>
								</el-form-item> -->
								<el-form-item label="反馈时限：">
									<timer :objTime="objTimeFksx" @timeChange="timeChangeFksx"></timer>
								</el-form-item>
								<el-form-item label-width="10px">
									<DatePicker :value="formValidate.fkdqsj" :disabled="true" :readonly="true" :editable="false" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择反馈时间"></DatePicker>
								</el-form-item>								
							</el-col>
						</el-row>
						<el-row style="padding-top:10px">
							<el-col :span="12">
								<el-form-item label="手续附件：" prop='procedFileArr'>
									<el-upload class="upload-demo" action="##" :auto-upload='false' multiple ref="proceUpload" :on-change="handleProcedFile" :on-remove="onRemoveProce">
										<el-button size="small" :disabled="isProceUpload">
											<i class="el-icon-upload el-icon--left" v-show="!isProceUpload"></i>
											<i class="el-icon-loading el-icon--left" v-show="isProceUpload"></i> 点击上传
										</el-button>
									</el-upload>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="任务附件：">
									<el-upload class="upload-demo" action="##" :auto-upload='false' multiple :on-remove="handleTaskRemove" ref="taskUpload" :on-change="handleTaskFile">
										<el-button size="small" :disabled="isTaskUpload">
											<i class="el-icon-upload el-icon--left" v-show="!isTaskUpload"></i>
											<i class="el-icon-loading el-icon--left" v-show="isTaskUpload"></i> 点击上传
										</el-button>
									</el-upload>
									<!-- <Input v-model="formValidate.resetObj.copyOfficeArr" v-show="false"></Input> -->
								</el-form-item>
							</el-col>
						</el-row>
						<el-row style="padding-top:10px">
							<el-col :span="24">
								<el-form-item label="指令内容：" prop='zlnr'>
									<el-input v-model.trim="formValidate.zlnr" clearable type="textarea" :rows="3" maxlength="120"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row style="padding-top:10px">
							<el-col :span="12">
								<el-form-item label="接收部门：" prop='receiveOfficeArr'>
									<Button @click="handleReceiveOffice('jieshou')">选择</Button>
									<el-tag v-for="(tag,index) in resetObj.receiveOfficeArr" :key="tag.jsdwmc" closable type="info" @close="delectReceiveArr(index)">{{tag.jsdwmc}}</el-tag>
									<el-input v-model="formValidate.receiveOfficeArr" v-show="false"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="抄送部门：">
									<Button @click="handleCopyOffice()">选择</Button>
									<el-tag v-for="(tag,index) in resetObj.copyOfficeArr" :key="tag.jsdw" closable type="info" @close="delectCopyArr(index)">{{tag.jsdwmc}}</el-tag>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>

				<div slot="footer">
				   <Button type="primary" @click="closeModel" class="thebtn">取消</Button>

					<Button type="primary"  @click='confirmPublish' class="thebtn">发起</Button>

						<!-- <el-button type="primary" v-show="isPj" @click="closeModel" class="cancelBtn" size="small">取消</el-button>
						<el-button type="primary" v-show="isPj" class="sureBtn successBtn" @click="saveInfo" size="small">评价</el-button>
						<el-button type="primary" v-show="!isPj" @click="closeModel" class="cancelBtn" size="small">关闭</el-button> -->
				</div>
			</el-dialog>
			<receive-office ref="receiveOffice" :show.sync="isReceive" :isCopy="isCopy" @handleOffice="handleOffice"></receive-office>
		</div>
	</el-card>
</template>
<script>
    var vm;
	import api from "@/fetch/api.js";
	import { toNull, tableToLine, lineToNull,timestampToTime } from "@/libs/common/common.js";
	import disposeModal from "./disposeModal.vue";
	import xjModal from "../publish/index.vue";
	import { cloneObj } from "@/libs/common/common.js";
	import timer from './timer.vue';
	import loadFile from "@/views/main-components/file-upload/loadFile.vue";
	import receiveOffice from "../publish/receiveOffice";


	
	export default {
		name: "directive-check",
		components: {
			disposeModal,
		//	xjModal,//指令下发弹窗
			loadFile,
			receiveOffice,
			timer
		},
		data() {
			vm = this
			return {
				objTimeQssx:{
					event:"timeChange",
					hours:null,
					minutes:null
				},
				isShow:false,
				objTimeFksx:{
					event:"timeChange",
					hours:null,
					minutes:null
				},				
				limain:{},
				arr: [],
				formValidate: {
					zlmc: null,
					zllx: null,
					zllxmc: null,
					qssx: null,
					fksx: null,
					zljb: null,
					receiveOfficeArr: [],
					zlnr: null,
					qsdqsj:'',
					fkdqsj:''
				},
				isProceUpload: false,
				isTaskUpload: false,
				zljbselect: [],
				zllxselect: [],
				numbers: 5,
				resetObj: {
					attach: [],
					dwgl: [],
					receiveOfficeArr: [],
					copyOfficeArr: [],
					procedFileArr: [],
					TaskFileArr: []
				},
				isReceive: false,
				isCopy: false,
				disabled:false,
				ruleValidate: {
					zlmc: [{
						required: true,
						message: "请填写指令名称",
						trigger: "blur"
					}],
					zllx: [{
						required: true,
						message: "请填写指令类型",
						trigger: "change"
					}],
					qssx: [{
						required: true,
						message: "请填写指令签收时限",
						trigger: "change"
					}],
					fksx: [{
						required: true,
						message: "请填写指令反馈时限",
						trigger: "change"
					}],
					zljb: [{
						required: true,
						message: "请填写指令名称",
						trigger: "change"
					}],
					receiveOfficeArr: [{
						type:'array',
						required: true,
						message: "请填写接收部门",
						trigger: "change"
					}],
					zlnr: [{
						required: true,
						message: "请填写指令内容",
						trigger: "blur"
					}]
				},
				addtitle:"指令发起",
				isbackshow:false,
				list: [],
				basePage: {
					pageindex: 1,
					pagesize: 10,
					zlmc: null,
					xfrxm: null,
					starttime: null,
					endttime: null,
					spzt: null,
					zljb: null
				},
				pageArray: [10, 20, 30, 40],
				total: 0,
				statusSelect: [
					{
						label: "待审批",
						key: "1"
					},
					{
						label: "通过",
						key: "2"
					},
					{
						label: "不通过",
						key: "3"
					},
					{
						label: "待督办",
						key: "4"
					},
					{
						label: "审批中",
						key: "a"
					}
				],
				zljbselect: [],
				isDispose: false,
				height: 0,
				zlid:''//指令id
			};
		},
		watch:{
			// 'formValidate.zljb' (val) {
			// 	if(val) {
			// 		this.handleZljbSeclect(val);
			// 	}
			// }
		},
		filters: {
			ztFilter(val) {
				switch(val) {
					case '1':
						return '待签收'
						break;
					case '2':
						return '已签收'
						break;
					case '3':
						return '已反馈'
						break;
					case '4':
						return '已评价'
						break;
					default:
						break;
				}
			},
			jbFilter(val){
				// vm.zljbselect.forEach(item=>{
				// 	if(item.id==val){
				// 		return item.zljblxmc
				// 		console.log(item.zljblxmc,"ssss")
				// 	}
				// })
				return vm.zljbselect.find(item => item.id == val).zljblxmc
			}
		},
		
		created() {
			this.rendtable();
			this.getSelect();
		},
		mounted() {
			this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			}
		},
		methods: {
			timeChangeQssx(val){
				this.formValidate.qssx = val;
				this.setTimeInterval();//更新计时器...
			},
			timeChangeFksx(val){
				this.formValidate.fksx = val;
				this.setTimeInterval();//更新计时器...
			},
			handleZljbSeclect(val) {
				var res = this.zljbselect.filter(item => {
					return item.id == val;
				});
				this.objTimeFksx.hours = Math.floor(res[0].fksx/60);
				this.objTimeFksx.minutes = res[0].fksx - Math.floor(res[0].fksx/60)*60;
				this.objTimeQssx.hours = Math.floor( res[0].qssx/60 );
				this.objTimeQssx.minutes = res[0].qssx - Math.floor(res[0].qssx/60)*60;
				this.formValidate.qssx = res[0].qssx;
				this.formValidate.fksx = res[0].fksx;
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
			closeModel() {
				this.isbackshow = false;
				this.formValidate = {
					sqlx: '1',
					sabjbh: null,
					ajmc: null,
					jyrwnr: null,
					jsdw: null,
					bz: null,
					jqajlx: null,
					receiveOfficeArr:[]
				}
				// if(this.title == "新建请求") {
				// 	this.$refs.taskUploadSX.clearFiles();
				// 	this.$refs.taskUploadRW.clearFiles();
				// }
				this.resetObj.copyOfficeArr= [];
				// this.resetObj.TaskFileArr = [];
				// this.$refs.ruleForm.resetFields();
				this.resetObj.receiveOfficeArr=[];
			},
			onRemoveProce(file,fileList){
				this.resetObj.procedFileArr=this.resetObj.procedFileArr.filter(item=>{
					return item.filename+'.'+item.category!=file.name
				})
			},
			//select选择框的数据init和处理
			getSelect() {
				const a = api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/getZlsxpzList",{type:'1'});
				const b = api.api("post", api.systemUrl + "/dict/findDictTreeByType?dictTypeCode=ZLLX");
				Promise.all([a, b]).then(([resA, resB]) => {
					this.zllxselect = resB;
					this.zljbselect = resA;
				});
			},
			handleZllxselect(val) {
				var res = this.zllxselect.filter(item => {
					return item.id == val;
				});
				this.formValidate.zllxmc = res[0].title;
			},
			//展示接收/抄送部门模态框
			handleReceiveOffice() {
				this.isReceive = true;
				this.isCopy = false;
				this.isShow=true;
				this.$refs.receiveOffice.selectedDate = JSON.parse(JSON.stringify(this.formValidate.receiveOfficeArr));
				
			},
			handleCopyOffice() {
				this.isReceive = true;
				this.isCopy = true;
				this.isShow=true;
				this.$refs.receiveOffice.selectedDate = JSON.parse(JSON.stringify(this.resetObj.copyOfficeArr));
			},
			//处理接收到的部门对象
			handleOffice(val) {
				this.isShow=false;
				this.isCopy ?
					(this.resetObj.copyOfficeArr = val) :
					((this.resetObj.receiveOfficeArr = val),
					(this.formValidate["receiveOfficeArr"] = val));
			},
			delectReceiveArr(index) {
				this.formValidate["receiveOfficeArr"] = null;
				this.resetObj.receiveOfficeArr.splice(index, 1);
			},
			delectCopyArr(index) {
				this.resetObj.copyOfficeArr.splice(index, 1);
			},
			//处理上传附件对象

			handleProcedFile(e) {
				this.resetObj.procedFileArr.push(this.handleFileDate(e, "1"));
				console.log(this.resetObj);
			},
			handleTaskFile(e) {
				this.resetObj.TaskFileArr.push(this.handleFileDate(e, "2"));
			},
			readerFile(file) {
				return new Promise(reslove => {
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function() {
						reslove(this.result);
					};
				});
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
			handleTaskRemove(file, fileList) {
				this.resetObj.TaskFileArr = this.resetObj.TaskFileArr.filter(item => {
					return item.filename+'.'+item.category !== file.name;
				});
			},
			//处理文件和部门的类型
			arrStamp(arr, key, value) {
				arr.forEach(val => {
					val[key] = value;
				});
			},
			//处理数据
			handleForm() {
				this.resetObj.receiveOfficeArr[0]["lx"] = "1";
				this.arrStamp(this.resetObj.copyOfficeArr, "lx", "2");
				this.resetObj.dwgl = this.resetObj.receiveOfficeArr.concat(
					this.resetObj.copyOfficeArr
				);
				this.resetObj.attach = this.resetObj.procedFileArr.concat(
					this.resetObj.TaskFileArr
				);
			},
			//发送数据
			confirmPublish() {

				this.$refs.formValidate.validate(valid => {
					if(valid) {
						this.disabled=true;
						this.handleForm();
						var res = JSON.parse(JSON.stringify(this.formValidate));
						delete res.receiveOfficeArr;
						var data = {
							zlxx: res,
							dwgl: this.resetObj.dwgl,
							attach: this.resetObj.attach
						};
						api.api("post", api.configUrl + "/hczz/zl/insertZlxx", data, (code) => {
								if(code == 400){
									this.fqloading = false
								}
							}).then(res => {
								
								this.$message.success("恭喜你下发指令成功");
								this.isbackshow = false;
								this.rendtable();
								this.$refs["formValidate"].resetFields();
								
								this.handleReset(this.resetObj);
								this.$refs.taskUpload.clearFiles();
								this.$refs.proceUpload.clearFiles();
							});
					}
				});
			},
			//清空数据(对象里面的数组)
			handleReset(obj) {
				for(var key in obj) {
					obj[key] = [];
				}
			},
				
			//新建
			add() {
				this.title = "新建指令";
				if(this.title = "新建指令"){
					this.isbackshow = true
				}
			},
			rendtable() {
				api
					.api("post", api.configUrl + "/hczz/zl/queryZlxxList", this.basePage)
					.then(res => {
						this.list = res.list;
						this.total = res.total;
					});
			},
			//页数变化
			pagesizeChange(val) {
				this.basePage.pagesize = val;
				this.rendtable();
			},
			pageChange(val) {
				this.basePage.pageindex = val;
				this.rendtable();
			},
			//搜索日期处理
			handleDate(val) {
				if(val[0]!=''){
					this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
					this.basePage.endttime = new Date(`${val[1]} 23:59:59`);
				}else{
					this.basePage.starttime = '';
					this.basePage.endttime = '';
				}
			},
			//搜索
			search() {
				this.basePage.pageindex = 1;
				this.rendtable();
			},
			rowClick(row){
				this.limain = row
				this.isDispose = true;
				this.zlid=row.id;
			},
			handleRow(val) {
				this.$router.push({
					path:'/ksh',
					query:{
						zlid:val.id
					}
				})
//				console.log(val)
//				this.isDispose = true;
//				this.$store.commit('setZlId', val.zljb);
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
	.directive-check-ct {
		.table-ct {
			.orSpan{
				color: orange;
			}
			.blSpan{
				color: #333333;
			}
		}
	}
	.border {
		border: solid 1px #dddee1;
		margin: 20px 20px;
		overflow: hidden;
	}
	
	.thebtn {
		margin-right: 20px;
		margin-bottom: 20px;
	}
	
	div.el-col.el-col-24 {
		line-height: 51px
	}
	
	.cc input.el-input__inner {
		width: 246px;
	}
	
	.thehr {
		width: 200%;
		margin-left: -50%
	}
</style>