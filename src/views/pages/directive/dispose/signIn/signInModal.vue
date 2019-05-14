<template>
	<el-dialog class="modal-ct workBench-group-modal" :title="modelTitle" @close='closeModel' :visible.sync="visible" :modal-append-to-body='false' width="700px">
		<div>
			<el-tabs v-model="activeName" @tab-click="handleClick" style="">
				<el-tab-pane label="流程轨迹" name="handle">
					<handle :directFlowFunc='directFlowFunc'></handle>
				</el-tab-pane>
				<el-tab-pane label="详细信息" name="detail">
					<detail :directDetailFunc='directDetailFunc'></detail>
				</el-tab-pane>
				<el-tab-pane label="反馈结果" name="feedback" v-if="zlZt>2">
					<feedback :feedBackFunc='feedBackFunc'></feedback>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="feedback-ct" v-show="statusInfo.isFeedback">
			<h3 style="height:40px;line-height:40px">反馈</h3>
			<el-form ref="formValidate" :model="formValidate" :rules="rules">
				<el-form-item label="反馈内容" prop="fknr">
					<el-input :rows="4" type="textarea" v-model="formValidate.fknr" maxlength="100"></el-input>
				</el-form-item>
				<el-form-item label="附件" prop="name">
					<loadFile ref="procedFile" @on-change="onChange" class="file-ct"></loadFile>
				</el-form-item>
			</el-form>
		</div>
		<div slot="footer">
			<Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
			<Button type="primary" v-show="statusInfo.isShow" class="sureBtn" v-if="directiveInfo.lx==1" @click="handleSignIn">{{statusInfo.label}}</Button>
		</div>
	</el-dialog>
</template>
<script>
	import detail from "./detail";
	import handle from "./handle";
	import feedback from './feedback';
	import api from "@/fetch/api.js";
	import loadFile from "@/views/main-components/file-upload/loadFile.vue";
	import { cloneObj } from "@/libs/common/common.js";
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
			loadFile,
			detail,
			handle,
			feedback
		},
		data() {
			return {
				rules: {
					fknr: [{
						required: true,
						message: "请输入反馈内容",
						trigger: "blur"
					}]
				},
				visible: this.show,
				activeName: "handle",
				statusSelect: [{
						key: "1",
						label: "签收",
						url: "/hczz/zl/qsZl",
						isFeedback: false,
						isShow: true
					},
					{
						key: "2",
						label: "反馈",
						url: "/hczz/zl/fkZl",
						isFeedback: true,
						isShow: true
					},
					{
						key: '3',
						label: '已反馈',
						isFeedback: false,
						isShow: false
					},
					{
						key: '4',
						label: '待评价',
						isFeedback: false,
						isShow: false
					}
				],
				statusInfo: {},
				formValidate: {
					fknr: ""
				},
				directFlowFunc: null,
				directDetailFunc: null,
				feedBackFunc:null,//反馈的promise对象
				disabled: false,
				size: 1024, //上传附件的大小
				fjObj: {}, //附件
				zlZt:''//指令状态  状态大于2 代表已经反馈过，可以显示反馈内容
			};
		},
		watch: {
			show() {
				this.visible = this.show;
			}
		},
		computed: {
			modelTitle() {
				return `编号：${this.directiveInfo.zlwh}`;
			},
			isScroll() {
				return this.isEdit ? "编辑" : "新增";
			}
		},
		created() {
			this.handleStatus();
			this.directFlowFunc = this.getFlowInfo();
			this.feedBackFunc=this.directDetailFunc = this.directDetail();
		},
		methods: {
			handleStatus() {
				this.statusInfo = this.statusSelect.filter(item => {
					return item.key == this.directiveInfo.zt;
				})[0];
			},
			getFlowInfo() {
				return new Promise(relove => {
					api.api("get", `${api.configUrl}/hczz/common/clrz/getClrzList`, {
						glid: this.directiveInfo.zlid
					}).then(res => {
						relove(JSON.stringify(res) + '/' + this.directiveInfo.zt)
					})
				})
			},
			directDetail() {
				return new Promise(relove => {
					api.api("post", `${api.configUrl}/hczz/zl/getDetailZlxx`, {
						id: this.directiveInfo.zlid
					}).then(res => {
						this.zlZt=res.zldwgl[0].zt
						relove(res);
					})
				})
			},
			closeModel() {
				this.$emit("update:show", false);
				this.disabled = false;
			},
			handleSignIn() {
				this.disabled = true;
				let params = {};
				let attach = [];
				if(this.statusInfo.isFeedback) {
					params.zldwgl = {};
					params.zldwgl.id = this.directiveInfo.id;
					params.zldwgl.zlid = this.directiveInfo.zlid;
					$.each(this.fjObj.fileList, (index, val) => {
						attach.push({
							category: val.name.split('.')[1],
							filename: val.name.split('.')[0],
							minetype: this.fjObj.baseArr[index].split('base64,')[0],
							data: this.fjObj.baseArr[index].split('base64,')[1],
							type: 0
						})
					})
					params.attach = attach;
					params.zldwgl.fknr = this.formValidate.fknr;
				} else {
					params = {
						id: this.directiveInfo.id
					};
				}
				api.api("post", api.configUrl + this.statusInfo.url, params).then(res => {
					this.$message.success(`恭喜你${this.statusInfo.label}编号：${this.directiveInfo.zlwh}指令成功`);
					this.$emit("update:show", false);
					this.disabled = true;
					this.$emit("refreshPage");
				});
			},
			handleClick(tab, event) {},
			onChange(val) {
				this.fjObj = val;
			}
		}
	};
</script>
<style lang="less">
	.formApprove {
		padding-top: 20px;
		border-top: 1px solid #dddee1;
	}
	
	.feedback-ct {
		.el-form {
			border: 1px solid #e3e3e3;
			.el-form-item {
				margin-bottom: 0px;
				display: flex;
				align-items: stretch;
				&:nth-child(1) {
					border-bottom: 1px solid #e3e3e3;
				}
				.el-textarea__inner {
					border: 0px;
				}
				.el-form-item__label {
					text-align: center;
					padding: 0;
					background: #f6f7f9;
					border-right: 1px solid #e3e3e3;
					width: 25%;
				}
				.el-form-item__content {
					width: 75%;
					.file-ct {
						padding-left: 15px;
					}
				}
			}
		}
	}
</style>