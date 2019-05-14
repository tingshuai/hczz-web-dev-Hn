<template>
	<el-dialog class="modal-ct workBench-group-modal" :title="modelTitle" @close='closeModel' :visible.sync="visible" :modal-append-to-body='false'>
		<div>
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="反馈结果" name="feedback" v-if="statusInfo.isCommon">
					<feedback :feedBackFunc='feedBackFunc'></feedback>
				</el-tab-pane>
				<el-tab-pane label="反馈结果评价" name="feedbackpj" v-else>
					<feedbackpj :feedBackFunc='feedBackFuncPj'></feedbackpj>
				</el-tab-pane>
				<el-tab-pane label="流程轨迹" name="handle">
					<handle :directFlowFunc='directFlowFunc'></handle>
				</el-tab-pane>
				<el-tab-pane label="详细信息" name="detail">
					<detail :directDetailFunc='directDetailFunc'></detail>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="feedback-ct" v-show="statusInfo.isCommon">
			<h3>评价</h3>
			<el-form ref="formValidate" :model="formValidate">
				<el-form-item label="服务态度：">
					<Rate v-model="formValidate.fwtd">
					</Rate>
				</el-form-item>
				<el-form-item label="反馈速度：">
					<Rate v-model="formValidate.fksd">
					</Rate>
				</el-form-item>
				<el-form-item label="应用效果：">
					<Rate v-model="formValidate.yyxg">
					</Rate>
				</el-form-item>
				<el-form-item label="综合评价内容" prop="zhpjnl">
					<el-input :rows="4" type="textarea" v-model="formValidate.zhpjnl" maxlength="100"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="footerDiv">
				<Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
				<Button type="primary" class="sureBtn" @click="handleSignIn">{{statusInfo.label}}</Button>
			</div>
		</div>

	</el-dialog>
</template>
<script>
	import detail from "./detail";
	import handle from "./handle";
	import feedback from './feedback';
	import feedbackpj from './feedbackPj';
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
			feedback,
			feedbackpj
		},
		data() {
			return {
				visible: this.show,
				activeName: '',
				statusSelect: [{
						key: '0',
						label: '评价',
						url: '/hczz/zl/qsZl',
						isCommon: true
					},
					{
						key: '1',
						label: '已评价',
						isFeedback: true
					}
				],
				statusInfo: {},
				directFlowFunc: null,
				directDetailFunc: null,
				feedBackFunc: null,
				feedBackFuncPj:null,
				feedBackStatus: null,
				formValidate: {
					zlid: this.directiveInfo.zlid,
					zldwglid: this.directiveInfo.zldwglid,
					fknr: null,
					fwtd: 0,
					fksd: 0,
					yyxg: 0,
					zhpjnl:null
				}
			};
		},
		watch: {
			show() {
				this.visible = this.show;
			}
		},
		computed: {
			modelTitle() {
				return `编号：${this.directiveInfo.zlwh}`
			}
		},
		mounted() {
		},
		created() {
			console.log(this.directiveInfo.zlwh,"AAAABBB")
			this.handleStatus();
			this.directFlowFunc = this.getFlowInfo();
			this.directDetailFunc = this.directDetail();
			this.feedBackFunc = this.getFeedBackInfo();
			this.feedBackFuncPj = this.getFeedBackInfo();
		},

		methods: {
			handleStatus() {
				this.statusInfo = this.statusSelect.filter(item => {
					return item.key == this.directiveInfo.zt
				})[0]
				if(this.statusInfo.isCommon){
					this.activeName ="feedback"
				}else{
					this.activeName ="feedbackpj"
				}
				console.log(this.statusInfo.isCommon,"DDD")
			},
			closeModel() {
				this.$emit("update:show", false);
				// this.$emit("zlhcpjupdate:show", false);

			},
			handleSignIn() {
				api.api('post', api.configUrl + '/hczz/zl/pjZl', this.formValidate).then(res => {
						this.$message.success('评价成功')
						this.$emit("update:show", false);
						this.$emit('refreshPage')
					})
				//     this.feedBackFunc = await this.getFeedBackInfo()
//				if(this.feedBackStatus.zt !== '5') {
//					this.$message.error(`${this.directiveInfo.zlwh}指令还未反馈，所以你还不能评价`)
//				} else {
//					api.api('post', api.configUrl + '/hczz/zl/pjZl', this.formValidate).then(res => {
//						this.$message.success(`恭喜你评价编号：${this.directiveInfo.zlwh}指令成功`)
//						this.$emit("update:show", false);
//						this.$emit('refreshPage')
//					})
//				}
			},
			getFlowInfo() {
				return new Promise(relove => {
					api.api("get", `${api.configUrl}/hczz/common/clrz/getClrzList`, {
						glid: this.directiveInfo.zlid
					}).then(res => {
						relove(res)
					})
				})
			},
			directDetail() {
				return new Promise(relove => {
					api.api("post", `${api.configUrl}/hczz/zl/getDetailZlxx`, {
						id: this.directiveInfo.zlid
					}).then(res => {
						relove(res);
					})
				})
			},
			getFeedBackInfo() {
				return new Promise(relove => {
					api.api("post", `${api.configUrl}/hczz/zl/getZldwglDetail`, {
						id: this.directiveInfo.zldwglid
					}).then(res => {
						this.feedBackStatus = res.zldwgl;
						relove(res);
					})
				})
			},
			handleClick(tab, event) {}
		}
	};
</script>
<style lang="less">
	.formApprove {
		padding-top: 20px;
		border-top: 1px solid #dddee1;
	}
	
	.feedback-ct {
		.footerDiv{
			text-align: right;
			margin-top: 20px;
		}
		.el-form {
			border: 1px solid #E3E3E3;
			.el-form-item {
				margin-bottom: 0px;
				display: flex;
				align-items: stretch;
				border-bottom: 1px solid #e3e3e3;
				&:nth-last-child(1) {
					border-bottom: 0px solid #e3e3e3;
				}
				.el-textarea__inner {
					border: 0px;
				}
				.el-form-item__label {
					text-align: center;
					padding: 0;
					background: #F6F7F9;
					border-right: 1px solid #E3E3E3;
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