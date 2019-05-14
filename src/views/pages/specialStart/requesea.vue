<template>
	<div class="request" :style="{height:height}">
		<div class="request wholeContent clearfix">

			<Form ref="request" :model="request" :rules="ruleValidateRequest" :label-width="120" class="padding-left-20 padding-right-20;" style="background: #fff;">
				<div class="tableStyle">
					<table border="1" cellspacing="0">
						<tr>
							<th>
								<FormItem label="案事件名称：" prop="ajmc">
									<Input v-model.trim="request.ajmc" clearable placeholder="请输入案事件名称" :maxlength="20"></Input>
								</FormItem>
							</th>
							<th>
								<FormItem label="案事件类型：">
									<Input v-model.trim="request.jqajlx" clearable placeholder="请输入案事件类型" :maxlength="20"></Input>
								</FormItem>
							</th>
						</tr>
						<tr v-if="this.status== 1">
							<th colspan="2">
								<FormItem label="专案组设置：" class="text-align-left" prop="selectedData">
									<Button @click="handleReceiveOffice">设置专案组</Button>
									<Input v-show="false" :rows="1" size="small"></Input>
									<el-tag v-for="(tag,index) in selectData" :key="tag.title" closable type="info" @close="delectReceiveArr(index)">{{tag.userName}}</el-tag>
								</FormItem>
							</th>
						</tr>
						<tr>
							<th>
								<FormItem label="手续附件：">
									<Upload @on-change="proceduresFiles" ref="proceduresFiles"></Upload>
								</FormItem>
							</th>
							<th>
								<FormItem label="任务附件：">
									<Upload @on-change="taskFiles" ref="taskFiles"></Upload>
								</FormItem>
							</th>
						</tr>
						<tr>
							<th :colspan="2">
								<FormItem label="简要任务内容：" prop="jyrwnr" class="content">
									<Input v-model.trim="request.jyrwnr" clearable type="textarea" :rows="4" placeholder="请输入简要任务内容" :maxlength="120"></Input>
									<span class="lenSpan">{{request.jyrwnr.length}}/120</span>
								</FormItem>
							</th>
						</tr>
					</table>

				</div>
				<div class="margin-top-20 text-align-right">
					<Button type="primary" @click="sure" :loading="zaloading">发起</Button>
				</div>
			</Form>
		</div>
		<div v-if="isReceive">
			<select-modal :show.sync="isReceive" @handleOffice="handleOffice" :selects="selectData"></select-modal>
		</div>
	</div>
</template>

<script>
	import Upload from '@/views/main-components/file-upload/loadFile.vue';
	import selectModal from './selectModal.vue';
	import $ from 'jquery';
	import api from '@/fetch/api';
	export default {
		components: {
			Upload,
			selectModal
		},
		data() {
			const selected = (rule, value, callback) => {
				if(!this.selectData.length) {
					return callback('组长设置不能为空')
				}
				return callback()
			}
			return {
				height:0,
				isReceive: false,
				zaloading: false, //专案发起loading
				request: {
					ajmc: '',
					jqajlx: '',
					jyrwnr: '',
					ywlx: api.ywlx.za,
					rwly: '0'
				},
				ruleValidateRequest: {
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
					selectedData: [{
						required: true,
						message: '专案组长不能为空',
						validator: selected
					}]
				},
				proceduresObj: [],
				taskObj: [],
				addGroupModal: false, //设置组长模态框显示
				selectData: [], //已选组长
				status: 0
			}
		},
		created() {
			api.api('get', api.configUrl + '/hczz/xtpz/ywlcgl/getYwlcgl', this.basePage).then(res => {
				this.status = res.czzt
			})
		},
		mounted(){
		//	$('form').height()- 250 
			this.height = $(window).height() - 250 + 'px';
			window.onresize = () => {
				this.height = $(window).height() -250 + 'px';
			}
		},
		methods: {
			handleOffice(val) {
				this.selectData = val;
			},
			delectReceiveArr(index) {
				this.selectData = null;
				this.sure();
				this.ruleValidateRequest["selectedData"] = null;
			},
			handleReceiveOffice() {
				this.isReceive = true;
			},
			sure() {
				this.$refs.request.validate((valid) => {
					if(valid) {
						this.zaloading = true;
						let sqxx = this.request;
						let attach = [];
						let zaxx = {};
						if(this.status == 1) {
							console.log(this.selectData[0]);
							zaxx = {
								userid: this.selectData[0].id,
								xm: this.selectData[0].userName,
								jybh: this.selectData[0].code,
								lxdh: this.selectData[0].phone,
								gadh: this.selectData[0].fixedNo,
								zp: this.selectData[0].img,
								officename: this.selectData[0].officeName,
								officecode: this.selectData[0].officecode,
								sfzh: this.selectData[0].idCard,
								zw: ''
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
							zamc: sqxx.ajmc, //专案名称
							sqxx: sqxx,
							attach: attach,
							zazclx: this.status,
							zaxx: zaxx //组长信息
						}
						api.api('post', api.configUrl + '/hczz/za/startSqxx', objs, (code) => {
							if(code == 400) {
								this.zaloading = false;
							}
						}).then(res => {
							this.zaloading = false;
							this.$message.success('添加成功！')
							this.resets();
						})
					}
				})
			},
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			taskFiles(val) {
				this.taskObj = val;
			},
			resets() {
				this.request = {
					ajmc: '',
					jqajlx: '',
					jyrwnr: '',
					ywlx: api.ywlx.za,
					rwly: '0'
				};
				this.$refs.proceduresFiles.obj.fileList = [];
				this.$refs.proceduresFiles.obj.baseArr = [];
				this.$refs.taskFiles.obj.fileList = [];
				this.$refs.taskFiles.obj.baseArr = [];
				this.selectData=[];
			},
			getSelect(val) {
				//				console.log(val)
				this.selectData = val;
			},
			update() {
				this.isReceive = false;
			},
			setLeader() {
				this.isReceive = true;
				if(this.selectData.length) {
					this.$refs.selectData.selectedDate = this.selectData;
				} else {
					let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
					this.$refs.selectData.selectedDate = [{
						id: userInfo.id,
						userName: userInfo.userName,
						code: userInfo.officeCode,
						phone: userInfo.phone,
						fixedNo: userInfo.fixedNo,
						img: userInfo.img,
						officeName: userInfo.officeName,
						officeCode: userInfo.officeCode,
						idCard: userInfo.idCard
					}];
				}
			}
		}
	};
</script>
<style lang="less">
	.request {
		overflow-y: auto;
		padding-top: 20px;
		background: white;
		height: 100%;
		.wholeContent {
			height: 100%;
			th {
				.ivu-form-item {
					margin: 18px 0 25px;
					width: 100%;
					.ivu-form-item-content {
						max-width: calc(~"100% - 200px");
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
	}
</style>