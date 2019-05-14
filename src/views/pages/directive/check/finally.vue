<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0">
				<tr>
					<th>反馈人</th>
					<th>{{feedBackDetial.fkrxm}}</th>
					<th>反馈时间</th>
					<th>{{feedBackDetial.fksj|timestampToTime}}</th>
				</tr>
				<tr>
					<th>反馈附件</th>
					<th colspan="3">
						<p>
							<a v-for='item in feedBackAttach'>
								<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename}}.{{item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
						</p>
					</th>
				</tr>
				<tr>
					<th>反馈内容</th>
					<th :colspan="3" :title="feedBackDetial.fknr" style="overflow: hidden;text-overflow: ellipsis;">{{feedBackDetial.fknr}}</th>
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
			finaFnc: {
				type: Promise
			}
		},
		data() {
			return {
//				feedBackInfo: {},
				feedBackDetial: {},
				feedBackAttach: []
			};
		},
		created() {
			this.handleFlowData();
		},
		methods: {
			async handleFlowData() {
				await this.finaFnc.then(res => {
					this.feedBackDetial = res.zldwgl.filter(item=>{
						return item.lx==1
					})[0];
				})
				this.handleData(this.feedBackDetial.id)
			},
			handleData(id) {
				api.api('post',api.configUrl+'/hczz/fj/getFjList',{
					glid: id,
				    tablename: "T_HCZZ_ZLDWGL",
				    type: "0"
				}).then(res=>{
					this.feedBackAttach=res;
				})
			},
			handlePrev(val) {
				api.upload(val)
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