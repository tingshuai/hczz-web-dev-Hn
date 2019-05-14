<template>
	<div class="warn margin-top-20">
		<div class="clearfix">
			<Modal v-model="show" title="发起" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure" :loading = "rcjqloading">确定</Button>
				</div>
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
			</Modal>
		</div>
	</div>
</template>

<script>
	import Upload from '@/views/main-components/file-upload/fileUpload.vue';
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import $ from 'jquery';
	export default {
		components: {
			Upload,
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
		data() {
			return {
				rcjqloading:false,//发起按钮loading
				detailObj: {},
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
					}]
				},
				show: false,
				proceduresObj: [],//手续附件
				taskObj: []//任务附件
			}
		},
		watch: {
			obj(val) {
				this.detailObj = val;
			}
		},
		methods: {
			sure() {
				this.$refs.warns.validate((valid) => {
					if(valid) {
						this.rcjqloading = true;
						let jjxx = {
							jjdbh: this.obj.jjdbh
						}
						let tsqxx = {
							ajmc: this.warn.ajmc,
							jyrwnr: this.warn.jyrwnr,
							sabjbh: this.obj.jjdbh,
							jqzjlx: this.obj.ajlbMc,
							jqajzs:this.obj.bjnr,
							slsj:this.obj.bjsj,
							jqajlx:this.obj.bjlxmc,
                            ywlx:api.ywlx.rc,
	            			rwly:'1'
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
							jjxx: jjxx,
							sqxx: tsqxx,
							attach: attach
						}
						api.api('post', api.configUrl + '/hczz/za/startSqxx', objs,(code)=>{
							if(code == 400){
									this.rcjqloading = false
							}
						}).then(res => {
							this.rcjqloading = false;
							this.$message.success('警情发起成功');
							this.$emit('update', 'a');
							this.$refs.warns.resetFields();
						})
					}
				})
			},
			cancelBtn() {
				this.$emit('update');
				this.$refs.warns.resetFields();
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
			closeModal() {

			}
		}
	};
</script>
<style lang="less">
	.form-submit {
		margin-top: 20px;
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
</style>