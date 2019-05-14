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
			fncHandle: {
				type: Promise
			}
		},
		data() {
			return {
				directFlow: [],
				directFlowone: {},
				isSoon: false,
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
			this.fncHandle.then(res => {
				this.directFlow = res;
				this.getInfo(res.nextId);
				this.directFlow.clrzList.forEach(item => {
					api.api('get', api.systemUrl + '/account/info/detail?id=' + item.zxrid).then(result => {
						this.$set(item, 'officeName', result.officeName)
					})
				})
			});
		},
		methods: {
			getInfo(val) {
				api.api('get', api.systemUrl + '/account/info/detail?id=' + val).then(res => {
					this.officeName = res.officeName;
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
	.step{
		height: 390px;
	}
</style>