<template>
	<div>
		<div class="clearfix tableStyle">
			<step :list="directFlow.clrzList"></step>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import step from '@/views/main-components/step/step.vue';
	export default {
		components: {
			step
		},
		props: {
			hadleFn: {
				type: Promise
			}
		},
		data() {
			return {
				list: [1, 2, 3, 4, 5, 6, 7],
				directFlow: [],
				directFlowone: {},
				isSoon: false,
				setApproveId: '',
				detailObj: {},
				officeName: ''
			}
		},
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		mounted() {
			this.hadleFn.then(res => {
				this.getFlow(res.sqxx.id)
			});
		},
		methods: {
			getFlow(val) {
				api.api('get', api.configUrl + '/hczz/zhb/getFlow/' + val).then(res => {
					this.directFlow = res;
					this.getInfo(res.nextId);
					this.directFlow.clrzList.forEach(item => {
						api.api('get', api.systemUrl + '/account/info/detail?id=' + item.zxrid).then(result => {
							this.$set(item, 'officeName', result.officeName)
						})
					})
				})
			},
			getInfo(val) {
				api.api('get', api.systemUrl + '/account/info/detail?id=' + val).then(res => {
					this.officeName = res.officeName;
				})
			}
		}
	};
</script>
<style lang="less" scoped>
	.tableStyle2 {
		width: 100%;
		table {
			width: 100%;
			border: 1px solid #dddee1;
			border-collapse: collapse;
			border-spacing: 0;
			border-radius: 8px;
			th {
				height: 46px;
				border: 1px solid #dddee1;
				width: auto;
			}
			.oddTh {
				color: #6c6c6c;
			}
		}
	}
	.step{
		height: 280px;
		margin-top: 20px;
	}
</style>