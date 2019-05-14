<template>
	<div class="warn" :style="{height:height}">
		<div>
			<div class="form-submit">
				<Form ref="case" :model="cases" :rules="ruleValidateCase" :label-width="120" class="padding-left-20 padding-right-20">
					<div class="tableStyle">
						<table border="1" cellspacing="0">
							<tr>
								<th>
									<FormItem label="案事件名称：" prop="ajmc">
										<Input v-model.trim="cases.ajmc" clearable placeholder="请输入案事件名称" :maxlength="15"></Input>
									</FormItem>
								</th>
								<th>
									<FormItem label="涉案编号：">
										<Input v-model.trim="obj.ajbh" disabled></Input>
									</FormItem>
								</th>
							</tr>
							<tr v-if="this.status== 1">
								<th :colspan="2">
									<!-- <FormItem label="专案组设置：" class="text-align-left" prop="selectedData">
										<Button @click.prevent="setLeader">设置专案组</Button>
										<span v-for="(item,index) in selectData" :key="index" class="margin-left-20">{{item.userName}}</span>
									</FormItem> -->
									<FormItem label="专案组设置：" class="text-align-left"  prop="selectedData">
										<Button @click="handleReceiveOffice">设置专案组</Button>
										<Input v-show="false" :rows="1" size="small"></Input>
										<el-tag  v-for="(tag,index) in selectData" :key="tag.title" closable type="info" @close="delectReceiveArr(index)">{{tag.userName}}</el-tag>
										<!-- <span v-if="!flag" :title="xcObj.jsdwmc" class="oSpan">{{xcObj.jsdwmc}}</span> -->
									</FormItem>
								</th>
							</tr>
							<tr>
								<th>
									<FormItem label="手续附件：">
										<loadFile @on-change="proceduresFiles" ref="proceduresFiles"></loadFile>
									</FormItem>
								</th>
								<th>
									<FormItem label="任务附件：">
										<loadFile @on-change="taskFiles" ref="taskFiles"></loadFile>
									</FormItem>
								</th>
							</tr>
							<tr>
								<th :colspan="2">
									<FormItem label="简要任务内容：" prop="jyrwnr" class="content">
										<Input v-model.trim="cases.jyrwnr" clearable type="textarea" :rows="4" placeholder="请输入简要任务内容" :maxlength="120"></Input>
										<span class="lenSpan">{{cases.jyrwnr.length}}/120</span>
									</FormItem>
								</th>
							</tr>
						</table>
					</div>
				</Form>
			</div>
			<div class="font-size-0 margin-top-20 margin-right-20 text-align-right">
				<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
				<Button type="primary" class="sureBtn" @click="sure" :loading="ajloading">确定</Button>
			</div>
		</div>
		<div>
				<select-modal :show.sync="isReceive"  @handleOffice="handleOffice" :selects="selectData"></select-modal>
		</div>
	</div>
</template>

<script>
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import selectModal from '../selectModal.vue';
	import api from '@/fetch/api';
	import $ from 'jquery';
	export default {
		components: {
			loadFile,
			selectModal
		},
		computed: {
			obj() {
				return this.$route.query.obj
			},
			activeName(){
				return this.$route.query.active
			}
		},
		data() {
			const selected=(rule, value, callback) => {
			    if(!this.selectData.length){
			    	return callback('组长设置不能为空')
			    }
			    return callback()
			}
			return {
				height:0,
				isReceive:false,
				ajloading:false,//案件发起确定loading
				cases: {
					ajmc: '',
					jyrwnr: ''
				},
				 basePage: {
					ywzt: "YWLCGLDM",
				},
				ruleValidateCase: {
					ajmc: [{
						required: true,
						message: '案事件名称不能为空',
						trigger: 'blur'
					}],
					jyrwnr: [{
						required: true,
						message: '简要任务内容不能为空',
						trigger: 'blur'
					}],
					selectedData:[{
						required:true,
						message:'专案组长不能为空',
						validator:selected
					}]
				},
				proceduresObj: [], //手续附件
				taskObj: [], //任务附件
				addGroupModal: false, //设置组长模态框显示
				selectData:[],//已选组长
				status:0
			}
		},
		mounted(){
			this.height = $(window).height()  - 190 + 'px';
			window.onresize = () => {
				this.height = $(window).height() -190 + 'px';
			}
		},
		created(){
			api.api('get', api.configUrl + '/hczz/xtpz/ywlcgl/getYwlcgl', this.basePage).then(res => {
						this.status = res.czzt
			})
		},
		methods: {
			delectReceiveArr(index) {
				this.selectData = null;
				this.sure();
			},
			handleOffice(val){
				this.selectData = val;
			},
			handleReceiveOffice() {
				this.isReceive = true;
			},
			sure() {
				this.$refs.case.validate((valid) => {
					if(valid) {
						this.ajloading = true
						let tajjbxx = {
							ajbh: this.obj.ajbh
						}
						let ajjbxx = [];
						ajjbxx.push(tajjbxx)
						let tsqxx = {
							ajmc: this.cases.ajmc,
							jyrwnr: this.cases.jyrwnr,
							sabjbh: this.obj.ajbh,
							afdz: this.obj.afdzmc,
							jqajzs: this.obj.jyaq,
							slsj: this.obj.slsj,
							jqajlx: this.obj.ajlbMc,
							ywlx:api.ywlx.za,
							afdz:this.obj.ajdzmc,
							rwly: '2'
						}
						let sqxx = [];
						sqxx.push(tsqxx);
						let attach = [];

                        let zaxx = {};
						if(this.status== 1) {
                            zaxx = {
                                userid:this.selectData[0].id,
                                xm:this.selectData[0].userName,
                                jybh:this.selectData[0].code,
                                lxdh:this.selectData[0].phone,
                                gadh:this.selectData[0].fixedNo,
                                zp:this.selectData[0].img,
                                officename:this.selectData[0].officeName,
                                officecode:this.selectData[0].officecode,
                                sfzh:this.selectData[0].idCard,
                                zw:''
                            }

							if(!(zaxx && zaxx.userid)) {
                                this.$message.error('请选择组长信息');
                                return;
							}
						}

						$.each(this.proceduresObj.fileList, (index, val) => {
							attach.push({
								category: val.name.split('.')[1],
								filename: val.name.split('.')[0],
								minetype: this.proceduresObj.baseArr[index].split('base64,')[0],
								data: this.proceduresObj.baseArr[index].split('base64,')[1],
								type: 0
							})
						})
						$.each(this.taskObj.fileList, (index, val) => {
							attach.push({
								category: val.name.split('.')[1],
								filename: val.name.split('.')[0],
								minetype: this.taskObj.baseArr[index].split('base64,')[0],
								data: this.taskObj.baseArr[index].split('base64,')[1],
								type: 1
							})
						})
						let objs = {
                            zamc:this.cases.ajmc,//专案名称
                            ajjbxx: tajjbxx,
							sqxx: tsqxx,
							attach: attach,
							zazclx:this.status,
                            zaxx:zaxx//组长信息
						}
						api.api('post', api.configUrl + '/hczz/za/startSqxx', objs).then(res => {
							this.ajloading = false
							this.$message.success('案件发起成功');
							this.cancelBtn();
							this.$refs.case.resetFields();
						})
					}
				})
			},
			cancelBtn() {
				this.$router.push({
					path:'/specialSet/requestManager',
					query:{
						activeName: this.activeName
					}
				})
				this.$refs.case.resetFields();
				this.selectData=[];
			},
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			taskFiles(val) {
				this.taskObj = val;
			},
			resets() {
				this.cases = {
					ajmc: '',
					jyrwnr: ''
				};
				this.$refs.proceduresFiles.obj.fileList = [];
				this.$refs.proceduresFiles.obj.baseArr = [];
				this.$refs.taskFiles.obj.fileList = [];
				this.$refs.taskFiles.obj.baseArr = [];
			},
			setLeader() {
				this.addGroupModal = true;
				if(this.selectData.length){
					this.$refs.selectData.selectedDate=this.selectData;
				}else{
					let userInfo=JSON.parse(window.localStorage.getItem('userInfo'));
					this.$refs.selectData.selectedDate=[{
						id:userInfo.id,
						userName:userInfo.userName,
						code:userInfo.officeCode,
						phone:userInfo.phone,
						fixedNo:userInfo.fixedNo,
						img:userInfo.img,
						officeName:userInfo.officeName,
						officeCode:userInfo.officecode,
						idCard:userInfo.idCard
					}];
				}
			},
			update(){
				this.addGroupModal=false;
			},
			getSelect(val){
//				console.log(val)
				this.selectData=val;
			}
		}
	};
</script>
<style scoped>
	.warn {
		overflow-y: auto;
		padding-top: 20px;
		background: #fff;
		height: 100%;
	}
	
	.ivu-form-item {
		margin: 20px;
	}
	
	.lenSpan {
		position: absolute;
		color: #E6E6E6;
		bottom: 0;
		right: 30px;
	}
</style>