<template>
	<div>
		<div class="clearfix tableStyle">
			<step :list=" directFlow.clrzList"></step>
		</div>
	</div>
</template>

<script>
	import step from '@/views/main-components/step/step.vue';
	import api from '@/fetch/api';
	export default {
		components: {
			step
		},
		props: {
			fncHandle: {
				type: Promise
			}
		},
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		data() {
			return {
				directFlow: [],
				directFlowone: {},
				isSoon: false,
				detailObj: {}
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
	.step{
		margin-top: 20px;
		height: 100%;
	}
</style>