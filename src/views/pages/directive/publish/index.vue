<template>
	<el-dialog class="modal-ct workBench-group-modal evaluate" :visible.sync="visible" :modal-append-to-body='false' width="900px">
		<div class="border">
			<el-form ref="formValidate" :model="formValidate" label-width="100px" :rules="ruleValidate" size="small" style="padding:18px 20px 16px">
				<el-row class="cc">
					<el-col :span="8">
						<el-form-item label="指令名称：" prop='zlmc'>
							<el-input v-model.trim="formValidate.zlmc" clearable style="width:auto" maxlength="20"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="指令类型：" prop='zllx' clearable fliterable>
							<el-select size='small' v-model="formValidate.zllx" @change="handleZllxselect" clearable fliterable>
								<el-option v-for="item in zllxselect" :key='item.id' :value="item.id" :label="item.title">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="cc">
					<el-col :span="8">
						<el-form-item label="指令级别：" prop='zljb'>
							<el-select size='small' v-model="formValidate.zljb" @change="handleZljbSeclect" clearable fliterable>
								<el-option v-for="item in zljbselect" :key='item.id' :value="item.id" :label="item.zljblxmc">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="签收时限：" prop='qssx' clearable>
							<el-input v-model.trim="formValidate.qssx" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="反馈时限：" prop='fksx'>
							<el-input v-model="formValidate.fksx" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<hr class="thehr" />
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
				<hr class="thehr" />
				<el-row style="padding-top:10px">
					<el-col :span="24">
						<el-form-item label="指令内容：" prop='zlnr'>
							<el-input v-model.trim="formValidate.zlnr" clearable type="textarea" :rows="3" maxlength="120"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<hr class="thehr" />
				<el-row style="padding-top:10px">
					<el-col :span="12">
						<el-form-item label="接收部门：" prop='receiveOfficeArr'>
							<Button @click="handleReceiveOffice">选择</Button>
							<el-tag v-for="(tag,index) in resetObj.receiveOfficeArr" :key="tag.jsdwmc" closable type="info" @close="delectReceiveArr(index)">{{tag.jsdwmc}}</el-tag>
							<el-input v-model="formValidate.receiveOfficeArr" v-show="false"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="抄送部门：">
							<Button @click="handleCopyOffice">选择</Button>
							<el-tag v-for="(tag,index) in resetObj.copyOfficeArr" :key="tag.jsdw" closable type="info" @close="delectCopyArr(index)">{{tag.jsdwmc}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

				</el-row>
			</el-form>
			<div>
				<receive-office :show.sync="isReceive" :isCopy="isCopy" @handleOffice="handleOffice"></receive-office>
			</div>
		</div>
		<div slot="footer">
			<Button type="primary" @click='confirmPublish' class="thebtn">发起</Button>
				<!-- <el-button type="primary" v-show="isPj" @click="closeModel" class="cancelBtn" size="small">取消</el-button>
				<el-button type="primary" v-show="isPj" class="sureBtn successBtn" @click="saveInfo" size="small">评价</el-button>
				<el-button type="primary" v-show="!isPj" @click="closeModel" class="cancelBtn" size="small">关闭</el-button> -->
			</div>
		<!-- <div class="text-align-right">
			<Button type="primary" @click='confirmPublish' class="thebtn"  :loading="fqloading">发起</Button>
		</div> -->

	</el-dialog>
</template>
<script>
	import loadFile from "@/views/main-components/file-upload/loadFile.vue";
	import api from "@/fetch/api.js";
	import receiveOffice from "./receiveOffice.vue";
	import { cloneObj } from "@/libs/common/common.js";
	export default {
		props: {
			visible: {
            type: Boolean,
            default: false
			},
			title:{
				type:String,
				default:'',
				required:true
			}
		},
		components: {
			loadFile,
			receiveOffice
		},
		data() {
			return {
				fqloading:false,
				arr: [],
				formValidate: {
					zlmc: null,
					zllx: null,
					zllxmc: null,
					qssx: null,
					fksx: null,
					zljb: null,
					receiveOfficeArr: null,
					zlnr: null
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
						required: true,
						message: "请填写接收部门",
						trigger: "change"
					}],
					zlnr: [{
						required: true,
						message: "请填写指令内容",
						trigger: "blur"
					}]
				}
			};
		},
		created() {
			this.getSelect();
		},
		methods: {
			onRemoveProce(file,fileList){
				this.resetObj.procedFileArr=this.resetObj.procedFileArr.filter(item=>{
					return item.filename+'.'+item.category!=file.name
				})
			},
			//select选择框的数据init和处理
			getSelect() {
				api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/queryZlsxpzAll").then(res => {
					this.zljbselect = res;
				});
				api
					.api(
						"post",
						api.systemUrl + "/dict/findDictTreeByType?dictTypeCode=ZLLX"
					)
					.then(res => {
						this.zllxselect = res;
					});
			},
			handleZljbSeclect(val) {
				var res = this.zljbselect.filter(item => {
					return item.id == val;
				});
				this.formValidate.fksx = res[0].fksx;
				this.formValidate.qssx = res[0].qssx;
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
			},
			handleCopyOffice() {
				this.isReceive = true;
				this.isCopy = true;
			},
			//处理接收到的部门对象
			handleOffice(val) {
				this.isCopy ?
					(this.resetObj.copyOfficeArr = val) :
					((this.resetObj.receiveOfficeArr = val),
						(this.formValidate["receiveOfficeArr"] = val.toString()));
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
				console.log(this.resetObj.TaskFileArr)
				console.log(file)
				this.resetObj.TaskFileArr = this.resetObj.TaskFileArr.filter(item => {
					return item.filename+'.'+item.category !== file.name;
				});
				console.log(this.resetObj.TaskFileArr)
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
						api
							.api("post", api.configUrl + "/hczz/zl/insertZlxx", data, (code) => {
								// console.log(code)
								if(code == 400){
									this.fqloading = false
								}
							})
							.then(res => {
								this.fqloading = false;
								
								this.$message.success("恭喜你下发指令成功");
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
			}
		}
	};
</script>
<style lang="less" scoped>
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