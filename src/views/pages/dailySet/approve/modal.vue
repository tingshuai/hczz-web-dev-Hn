<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div style="height: 500px;">
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="流程轨迹" name="handle">
							<handle  :handFnc="handFnc"></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="formApprove">
					<h3>审批</h3>
					<Form ref="approve" :model="formDynamic" :rules="ruleValidate" :label-width="70">
						<FormItem label="审批操作" prop="splx">
							<RadioGroup v-model="formDynamic.splx">
								<Radio label="1">通过</Radio>
								<Radio label="2">不通过</Radio>
								<Radio label="3">驳回</Radio>
							</RadioGroup>
						</FormItem>
						<FormItem label="审批意见" prop="remark">
							<el-input v-model.trim="formDynamic.remark" clearable type="textarea" :rows="4" placeholder="请输入简要任务内容" maxlength="120"></el-input>
						</FormItem>
					</Form>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import Upload from '@/views/main-components/file-upload/fileUpload.vue';
	import api from '@/fetch/api';
	import detail from './detail';
	import handle from './handle';
	export default {
		components: {
			Upload,
			handle,
			detail
		},
		props: {
			title: {
				type: String,
				default: '',
				required: true
			},
			id: {
				type: String,
				default: ''
			},
			show: {
				type: Boolean,
				default: false
			},
			taskObj: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				activeName: 'handle',
				visible: this.show,
				formDynamic: {
					splx: '',
					remark: '',
				},
				ruleValidate: {
					splx: [{
						required: true,
						message: '审批操作不能为空',
						trigger: 'blur'
					}],
					remark: [{
						required: true,
						message: '审批意见不能为空',
						trigger: 'blur'
					}]
				},
				list: [],
				fncDetail: null, //详情的promise对象
				handFnc:null//审批流程Promise对象
			}
		},
		watch: {
			show(val) {
				this.visible = val;
			}
		},
		mounted() {
			this.handFnc=this.getFlow();
			this.fncDetail = this.getDetail();
		},
		methods: {
			handleClick(tab, event) {

			},
			cancelBtn() {
				this.$refs.approve.resetFields();
				this.$emit('update');
			},
			sure() {
				this.$refs.approve.validate((valid) => {
					if(valid) {
						let pforsp = {
							busid: this.taskObj.busId,
							remark: this.formDynamic.remark,
							splx: this.formDynamic.splx,
							taskid: this.taskObj.taskId,
							gzllx: "0"
						}
						api.api('post', api.configUrl + '/hczz/gzl/doApprove', pforsp).then(res => {
							this.$message.success('审批成功');
							this.cancelBtn();
						})
					}
				})
			},
			getDetail() {
				return new Promise((resolve, reject) => {
					api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {
						id: this.id
					}).then(res => {
						if(res){
							resolve(res)
						}
					})
				})
			},
			getFlow(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/za/getFlow/'+this.id+'?type=0').then(res=>{
						if(res){
							resolve(res)
						}
					})
				})
			}
		}
	};
</script>
<style lang="less">
	.formApprove {
		padding-top: 20px;
		border-top: 1px solid #dddee1;
	}
</style>