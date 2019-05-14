<template>
	<div>
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
			handFnc: {
				type: Promise
			}
		},
		data() {
			return {
				directFlow: [],
				directFlowone: {
					nextName: '',
					nextState: '',
					nextOffice: ''
				},
				isSoon: false,
				setApproveId: '',
				detailObj: {}
			}
		},
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		watch: {
			handFnc(val) {
				if(val) {
					val.then(res => {
						this.directFlow = res.clrzList;
						this.directFlow.forEach(item => {
							api.api('get', api.systemUrl + 'account/info/queryPage?id=' + item.zxrid).then(res => {
								item.bmmc = res.list[0].officeName
							})
						})
						this.directFlowone.nextName = res.nextName;
						this.directFlowone.nextState = res.nextState;
						this.getInfo(res.nextId);
					})
				}
			}
		},
		mounted() {

		},
		methods: {
			getInfo(val) {
				api.api('get', api.systemUrl + '/account/info/detail?id=' + val).then(res => {
					this.officeName = res.officeName;
					this.directFlowone.nextOffice = res.officeName;
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
	.step{
		height: 440px;
		margin-top: 20px;
	}
</style>