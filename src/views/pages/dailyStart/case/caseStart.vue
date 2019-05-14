<template>
	<div class="warn">
		<div class="clearfix">
			<Modal v-model="show" title="发起" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure" :loading ="rcajloading">确定</Button>
				</div>
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
											<Input v-model.trim="detailObj.ajbh" disabled></Input>
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
			</Modal>
		</div>
	</div>
</template>

<script>
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import $ from 'jquery';
	export default {
		components: {
			loadFile
		},
		props: {
			obj: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		watch: {
			obj(val) {
				this.detailObj = val
			}
		},
		data() {
			return {
				rcajloading:false,//日常案件发起loading
				detailObj: {},
				cases: {
					ajmc: '',
					jyrwnr: ''
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
					}]
				},
				show: false,
				proceduresObj: [], //手续附件
				taskObj: [] //任务附件
			}
		},
		methods: {
			sure() {
				this.$refs.case.validate((valid) => {
					if(valid) {
						this.rcajloading = true;
						let tajjbxx = {
							ajbh: this.obj.ajbh
						}
						let tsqxx = {
							ajmc: this.cases.ajmc,
							jyrwnr: this.cases.jyrwnr,
							sabjbh: this.obj.ajbh,
							afdz:this.obj.afdzmc,
							jqajzs:this.obj.jyaq,
							slsj:this.obj.slsj,
							jqajlx:this.obj.ajlbMc,
                            ywlx:api.ywlx.rc,
							rwly: '2'
						}
						let attach = [];
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
							ajjbxx: tajjbxx,
							sqxx: tsqxx,
							attach: attach
						}
						api.api('post', api.configUrl + '/hczz/za/startSqxx', objs,(code)=>{
							if(code == 400){
								this.rcajloading = false;
							}
						}).then(res => {
							this.rcajloading = false;
							this.$message.success('案件发起成功');
							this.$emit('update', 'a');
							this.$refs.case.resetFields();
						})
					}
				})
			},
			cancelBtn() {
				this.$emit('update');
				this.$refs.case.resetFields();
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
			}
		}
	};
</script>
<style scoped>
	.warn {
		padding-top: 20px;
	}
	
	.ivu-form-item {
		margin: 20px;
	}
	.lenSpan{
		position: absolute;
		color: #E6E6E6;
		bottom: 0;
		right: 30px;
	}
</style>