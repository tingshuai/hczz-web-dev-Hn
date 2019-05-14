<template>
	<div class="request">
		<div class="request wholeContent clearfix">

			<Form ref="request" :model="request" :rules="ruleValidateRequest" :label-width="120" class="padding-left-20 padding-right-20">
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
					<Button type="primary" @click="sure" :loading="rcsdloading">发起</Button>
				</div>
			</Form>
			
		</div>
	</div>
</template>

<script>
	import Upload from '@/views/main-components/file-upload/loadFile.vue';
	import $ from 'jquery';
	import api from '@/fetch/api';
	export default {
		components: {
			Upload
		},
		data() {
			return {
				rcsdloading:false,//日常手动发起loading
				request: {
					ajmc: '',
					jqajlx: '',
					jyrwnr: '',
                    ywlx:api.ywlx.rc,
					rwly:'0'
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
					}]
				},
				proceduresObj: [],
				taskObj: []
			}
		},
		methods: {
			sure() {
				this.$refs.request.validate((valid) => {
					if(valid) {
						this.rcsdloading = true;
                        let sqxx = this.request;
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
							sqxx: sqxx,
							attach: attach
						}
						api.api('post', api.configUrl + '/hczz/za/startSqxx', objs,(code)=>{
							if(code == 400){
								this.rcsdloading = false;
							}
						}).then(res => {
							this.rcsdloading = false;
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
                    ywlx:api.ywlx.rc,
					rwly:'0'
				};
				this.$refs.proceduresFiles.obj.fileList = [];
				this.$refs.proceduresFiles.obj.baseArr = [];
				this.$refs.taskFiles.obj.fileList = [];
				this.$refs.taskFiles.obj.baseArr = [];
			}
		}
	};
</script>
<style lang="less">
	.request {
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
				.content{
					.lenSpan{
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