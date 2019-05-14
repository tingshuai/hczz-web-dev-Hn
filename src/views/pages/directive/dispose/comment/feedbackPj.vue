<template>
	<div>
		<div class="clearfix tableStyle approval-detail-ct">
			<table border="1" cellspacing="0">
				<tr>
					<th>服务态度</th>
					<th>
						<Rate v-model="formValidate.fwtd" allow-half :disabled="disabled" ></Rate>
					</th>
				</tr>
				<tr>
					<th>反馈速度</th>
					<th>
						<Rate v-model="formValidate.fksd" allow-half :disabled="disabled"></Rate>
					</th>
				</tr>
				<tr>
					<th>反馈效果</th>
					<th>
						<Rate v-model="formValidate.yyxg" allow-half  :disabled="disabled"></Rate>
					</th>
				</tr>
				<tr>
					<th>评价内容</th>
					<th :title="formValidate.zhpjnl">{{formValidate.zhpjnl}}</th>
				</tr>
			</table>
			<table border="1" cellspacing="0" class="margin-top-20">
				<tr>
					<th colspan="4" class="padding-left-20 text-align-left">反馈结果</th>
				</tr>
				<tr>
					<th>反馈人</th>
					<th>{{feedBackDetial.fkrxm}}</th>
					<th>反馈时间</th>
					<th>{{feedBackDetial.fksj|timestampToTime}}</th>
				</tr>
				<tr>
					<th>反馈内容</th>
					<th colspan="3" :title="feedBackDetial.fknr">{{feedBackDetial.fknr}}</th>
				</tr>
				<tr>
					<th>反馈附件</th>
					<th colspan="3">
						<p>
							<a v-for='item in feedBackAttach'>
								<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename}}&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
						</p>
					</th>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	import api from "@/fetch/api";
	export default {
		components: {},
		props: {
			feedBackFunc: {
				type: Promise
			}
		},
		data() {
			return {
				feedBackInfo: {},
				feedBackDetial: {},
				feedBackAttach: [],
				formValidate:{
					fwtd:null,
					fksd:null,
					yyxg:null,
					zhpjnl:null
				},
				disabled:false
			};
		},
		created() {
			this.handleFlowData();
		},
		methods: {
			async handleFlowData() {
				await this.feedBackFunc.then(res => {
					this.feedBackInfo = res;
				})
				this.handleData();
				this.getPj();
			},
			handleData() {
				this.feedBackDetial = this.feedBackInfo.zldwgl
				this.feedBackAttach = this.feedBackInfo.attach
			},
			handlePrev(val) {
				api.upload(val)
			},
			getPj(){
				api.api("post", `${api.configUrl}/hczz/zl/getZlcgpjList`, {
					id: this.feedBackInfo.zldwgl.zlid
				}).then(res => {
					this.formValidate=res[0];
					this.disabled=true;
				})
			}
		}
	};
</script>
<style lang="less">
	// .path-flow {
	//   li:nth-child(2) {
	//     .and-so-on {
	//       &::after {
	//         content: " 等····";
	//       }
	//     }
	//   }
	// }
</style>