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
			fncHandle: {
				type: Promise
			},
			sxzt: {
				type: String
			},
			spzt: {
				type: String
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
				nextName: '',
				zt: this.sxzt,
				dqzt: this.spzt //当前状态
			}
		},
		watch: {
			sxzt(val) {
				this.zt = val;
			},
			spzt(val) {
				this.dqzt = val;
			}
		},
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		mounted() {
			this.fncHandle.then(res => {
				this.directFlow = res.clrzList;
				this.directFlow.forEach(item => {
					api.api('get', api.systemUrl + 'account/info/queryPage?id=' + item.zxrid).then(res => {
						item.bmmc = res.list[0].officeName
					})
				})
//				this.directFlowone.nextName = res.nextName;
//				this.directFlowone.nextState = res.nextState;
//				this.getInfo(res.nextId);
			})
		},
		methods: {
//			getInfo(val) {
//				api.api('get', api.systemUrl + '/account/info/detail?id=' + val).then(res => {
//					this.officeName = res.officeName;
//					this.directFlowone.nextOffice = res.officeName;
//				})
//			}
		}
	};
</script>
<style lang="less">

</style>