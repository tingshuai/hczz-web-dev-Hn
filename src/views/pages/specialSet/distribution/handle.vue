<template>
	<div class="handle">
		<div class="clearfix tableStyle">
			<step :list="directFlow"></step>
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
			fncHandle: {
				type: Promise
			}
		},
		data() {
			return {
				list: [1, 2, 3, 4, 5, 6, 7],
				directFlow: [],
				directFlowone: {},
				isSoon: false,
				detailObj: {}
			}
		},
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		mounted() {
			this.getHandle()
		},
		methods: {
			getHandle() {
				this.fncHandle.then(res => {
					this.detailObj = res.sqxx;
					this.directFlow = res.clrzList;
					this.directFlow.forEach(item => {
						api.api('get', api.systemUrl + 'account/info/queryPage?id=' + item.zxrid).then(res => {
							item.bmmc = res.list[0].officeName
						})
					})
					this.directFlowone = this.directFlow[res.clrzList.length - 1];
				})
			}
		}
	};
</script>
<style lang="less" scoped>
	.tablemmp {
		width: 100%;
		height: 150px;
		overflow: hidden;
	}
	
	.tablemmp table {
		margin-top: -40px;
	}
	.handle .step{
		height: 380px;
	}
</style>