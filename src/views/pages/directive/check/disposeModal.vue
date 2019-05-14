<template>
	<el-dialog class="modal-ct workBench-group-modal" :title="modelTitle" @close='cancelBtn' :visible.sync="visible" :modal-append-to-body='false' width="900px">
		<div>
			<el-tabs v-model="activeName">
				<el-tab-pane label="流程轨迹" name="handle">
					<handle :handFnc="handFnc"></handle>
				</el-tab-pane>
				<el-tab-pane label="详细信息" name="detail">
					<detail :detailFnc="detailFnc"></detail>
				</el-tab-pane>
				<el-tab-pane label="反馈结果" name="thefinal" v-if="thefinally">
					<thefinal :finaFnc="finaFnc"></thefinal>
				</el-tab-pane>
				<!--<el-tab-pane label="反馈结果评价" name="theevaluate" v-if="theevaluate">
					<theevaluate></theevaluate>
				</el-tab-pane>-->
			</el-tabs>
		</div>
		<div slot="footer" class="font-size-0">
			<Button type="primary" class="cancelBtn" @click="cancelBtn">关闭</Button>
		</div>
	</el-dialog>
</template>
<script>
	import api from '@/fetch/api.js';
	import detail from "./detail";
	import handle from "./handle";
	import thefinal from "./finally";
	import theevaluate from "./theevaluate";
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			zlid:{
				type:String,
				default:''
			},
			limain: {
				type: Object,
				default: {}
			}
		},
		components: {
			handle,
			detail,
			thefinal,
			theevaluate
		},
		data() {
			return {
				title:",,",
				visible: this.show,
				activeName: "handle",
				thefinally: true,
				theevaluate: true,
				handFnc: null,
				detailFnc:null,
				finaFnc:null
			};
		},
		created(){
			console.log(this.limain,"jjjj;0000")
		},
		computed:{
			modelTitle() {
				return `编号：${this.limain.zlwh}`;
			},
		},
		watch: {
			show() {
				this.visible = this.show;
			}
		},
		mounted(){
			this.handFnc=this.getFlowInfo();
			this.finaFnc=this.detailFnc=this.directDetail();
		},
		methods: {
			cancelBtn() {
				this.$emit("update:show", false);
			},
			getFlowInfo() {
				return new Promise(relove => {
					api.api("get", `${api.configUrl}/hczz/common/clrz/getClrzList`, {
						glid: this.zlid
					}).then(res => {
						console.log('ttttt')
						relove(res)
					})
				})
			},
			directDetail() {
				return new Promise(relove => {
					api.api("post", `${api.configUrl}/hczz/zl/getDetailZlxx`, {
						id: this.zlid
					}).then(res => {
						relove(res);
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