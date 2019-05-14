<template>
	<div>
		<div class="clearfix tableStyle approval-detail-ct">
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
								<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename}}&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
						</p>
					</th>
				</tr>
				<tr>
					<th>反馈内容</th>
					<th colspan="3" :title="feedBackDetial.fknr" style="overflow: hidden;text-overflow: ellipsis;">{{feedBackDetial.fknr}}</th>
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
				feedBackAttach: []
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
				this.handleData()
			},
			handleData() {
				this.feedBackDetial = this.feedBackInfo.zldwgl
				this.feedBackAttach = this.feedBackInfo.attach
			},
			handlePrev(val) {
				api.upload(val)
			}
		}
	};
</script>
<style lang="less">
	.approval-detail-ct {
		th {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			max-width: 165px;
		}
	}
</style>