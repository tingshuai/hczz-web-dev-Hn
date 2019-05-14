<template>
	<el-dialog class="modal-ct workBench-group-modal" :title="modelTitle" @close='closeModel' :visible.sync="visible" :modal-append-to-body='false' width="700px">
		<div>
			<el-tabs v-model="activeName">
				<el-tab-pane label="流程轨迹" name="handle">
					<handle :directFlowFunc='directFlowFunc'></handle>
				</el-tab-pane>
				<el-tab-pane label="详细信息" name="detail">
					<detail :directDetailFunc='directDetailFunc'></detail>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="formApprove">
			<h3>审批</h3>
			<Form :model="formDynamic" :rules="ruleValidate" :label-width="70" ref="formDynamic">
				<FormItem label="审批操作" prop="splx">
					<RadioGroup v-model="formDynamic.splx">
						<Radio label="0">通过</Radio>
						<Radio label="1">不通过</Radio>
						<!--<Radio label="2">不通过，驳回并补充材料</Radio>-->
					</RadioGroup>
				</FormItem>
				<FormItem label="审批意见" prop="remark">
					<Input v-model.trim="formDynamic.remark" clearable type="textarea" :rows="4" placeholder="请输入简要任务内容" :maxlength="30"></Input>
				</FormItem>
			</Form>
		</div>
		<div slot="footer">
			<Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
			<Button type="primary" class="sureBtn" @click="saveInfo">确认</Button>
		</div>
	</el-dialog>
</template>
<script>
	import detail from "./detail";
	import handle from "./handle";
	import api from "@/fetch/api";
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			directiveInfo: {
				type: Object,
				default: {}
			}
		},
		components: {
			handle,
			detail
		},
		data() {
			return {
				visible: this.show,
				activeName: "handle",
				formDynamic: {
					splx: "",
					remark: "",
					taskid: null,
					gzllx: "2",
					busid: null,
					zlwh:'',
				},
				modelTitle: "",
				directFlowFunc: null,
				directDetailFunc: null,
				ruleValidate: {
					splx: [{
						required: true,
						message: '请进行审批操作',
						trigger: 'change'
					}],
					remark: [{
						required: true,
						message: '请输入审批意见',
						trigger: 'blur'
					}]
				}
			};
		},
		watch: {
			show() {
				this.visible = this.show;
			}
		},

		created() {
			this.handleInfo();
			this.directFlowFunc = this.getFlowInfo();
			this.directDetailFunc = this.directDetail();
		},
		methods: {
			handleInfo() {
				this.modelTitle = this.directiveInfo.zlwh
				this.formDynamic.zlwh = this.formDynamic.zlwh
				this.formDynamic.taskid = this.directiveInfo.taskId;
				this.formDynamic.busid = this.directiveInfo.busId;
			},
			getFlowInfo() {
				return new Promise(resolve => {
					api.api("get", `${api.configUrl}/hczz/common/clrz/getClrzList`, {
						glid: this.directiveInfo.busId
					}).then(res => {
						resolve([...res]);
					});
				});
			},
			directDetail() {
				return new Promise(resolve => {
					api
						.api("post", `${api.configUrl}/hczz/zl/getDetailZlxx`, {
							id: this.directiveInfo.busId
						})
						.then(res => {
							resolve(res);
						});
				});
			},
			closeModel() {
				this.$emit("update:show", false);
				this.$emit("update:directiveInfo", {});
			},
			saveInfo() {
				this.$refs.formDynamic.validate(valid => {
					if(valid) {
						api
							.api("post", `${api.configUrl}/hczz/gzl/doTask`, this.formDynamic)
							.then(res => {
								this.$message.success("恭喜你审批成功！！！");
								this.$emit("refreshPage");
								this.closeModel();
							});
					}
				});
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