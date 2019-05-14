<template>
	<div class="warn margin-top-20"  :style="{height:height}">
		<div class="clearfix">
			<div class="form-submit">
				<Form ref="warns" :model="warn" :rules="ruleValidateWarn" :label-width="120" class="padding-left-20 padding-right-20">
					<div class="tableStyle">
						<table border="1" cellspacing="0">
							<tr>
								<th>
									<FormItem label="案事件名称：" prop="ajmc">
										<Input v-model.trim="warn.ajmc" clearable placeholder="请输入案事件名称" :maxlength="16"></Input>
									</FormItem>
								</th>
								<th>
									<FormItem label="接警单编号：">
										<Input v-model.trim="obj.jjdbh" disabled></Input>
									</FormItem>
								</th>
							</tr>
							<tr v-if="this.status== 1">
								<th :colspan="2">
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
										<Input v-model.trim="warn.jyrwnr" clearable type="textarea" :rows="4" placeholder="请输入简要任务内容" :maxlength="200"></Input>
										<span class="lenSpan">{{warn.jyrwnr.length}}/200</span>
									</FormItem>
								</th>
							</tr>
						</table>
					</div>
				</Form>
			</div>
			<div class="font-size-0 margin-top-20 margin-right-20 text-align-right">
				<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
				<Button type="primary" class="sureBtn" @click="sure" :loading="jqloading">确定</Button>
			</div>
			<div>
				<select-modal :show.sync="isReceive"  @handleOffice="handleOffice" :selects="selectData"></select-modal>
			</div>
		</div>
	</div>
</template>

<script>
	import selectModal from '../selectModal.vue';
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import $ from 'jquery';
	export default {
		components: {
			selectModal,
			loadFile
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
				    this.$message.error('组长设置不能为空');
			    	return callback('组长设置不能为空')
			    }
			    return callback()
			}
			return {
				isReceive:false,
				jqloading:false,//警情发起loading
				warn: {
					ajmc: '',
					jyrwnr: ''
				},
				ruleValidateWarn: {
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
				show: false,
				proceduresObj: [], //手续附件
				taskObj: [], //任务附件
				addGroupModal: false, //设置组长模态框显示
				selectData: [],
                status:0
			}
		},
        created(){
            api.api('get', api.configUrl + '/hczz/xtpz/ywlcgl/getYwlcgl', this.basePage).then(res => {
                this.status = res.czzt
            })
		},
		mounted(){
			this.height = $(window).height()  - 200 + 'px';
			window.onresize = () => {
				this.height = $(window).height() -200 + 'px';
			}
		},
		methods: {
			delectReceiveArr(index) {
				this.selectData = null;
			},
			handleOffice(val){
				this.selectData = val;
			},
			handleReceiveOffice() {
				this.isReceive = true;
			},
			sure() {
				this.$refs.warns.validate((valid) => {
					if(valid) {
						this.jqloading = true
						let jjxx = {
							jjdbh: this.obj.jjdbh
						}
						let getJjxx = [];
						getJjxx.push(jjxx)
						let tsqxx = {
							ajmc: this.warn.ajmc,
							jyrwnr: this.warn.jyrwnr,
							sabjbh: this.obj.jjdbh,
							jqzjlx: this.obj.ajlbMc,
							jqajzs: this.obj.bjnr,
							slsj: this.obj.bjsj,
							jqajlx: this.obj.bjlxmc,
                            ywlx:api.ywlx.za,
							rwly: '1'
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
                            zamc:this.warn.ajmc,//专案名称
							jjxx: jjxx,
							sqxx: tsqxx,
							attach: attach,
                            zazclx:this.status,
                            zaxx:zaxx//组长信息
						}
						api.api('post', api.configUrl + '/hczz/za/startSqxx', objs).then(res => {
							this.jqloading = false
							this.$message.success('警情发起成功');
							this.cancelBtn();
							this.$refs.warns.resetFields();
							
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
				});
				this.$refs.warns.resetFields();
				this.selectData=[];
			},
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			taskFiles(val) {
				this.taskObj = val;
				this.$refs.taskFiles.delFile();
			},
			resets() {
				this.warn = {
					ajmc: '',
					jyrwnr: ''
				};

				this.$refs.proceduresFiles.obj.fileList = [];
				this.$refs.proceduresFiles.obj.baseArr = [];
				this.$refs.taskFiles.obj.fileList = [];
				this.$refs.taskFiles.obj.baseArr = [];
			},
			update() {
				this.addGroupModal = false;
			},
            getSelect(val){
                this.selectData=val;
            },
			setLeader() {
				this.isReceive = true;
				if(this.selectData.length) {
					this.$refs.selectData.selectedDate = this.selectData;
				} else {
					let userInfo=JSON.parse(window.localStorage.getItem('userInfo'));
					this.$refs.selectData.selectedDate=[{
						id:userInfo.id,
						userName:userInfo.userName,
						code:userInfo.officeCode,
						phone:userInfo.phone,
						fixedNo:userInfo.fixedNo,
						img:userInfo.img,
						officeName:userInfo.officeName,
						officeCode:userInfo.officeCode,
						idCard:userInfo.idCard
					}];
				}
			}
		}
	};
</script>
<style lang="less">
	.warn {
		overflow-y: auto;
		background: #fff;
		height: 100%;
		.form-submit {
			margin-top: 20px;
			.ivu-form-item {
				margin: 18px 0 25px;
				width: 100%;
				.ivu-form-item-content {
					max-width: calc(~"100% - 220px");
				}
			}
			.content {
				.lenSpan {
					position: absolute;
					color: #E6E6E6;
					bottom: 0;
					right: 30px;
				}
			}
		}
	}
</style>