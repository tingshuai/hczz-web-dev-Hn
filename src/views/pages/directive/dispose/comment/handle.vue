<template>
	<div>
		<div class="clearfix tableStyle">
			<step :list="directFlow"></step>
		</div>
	</div>
</template>

<script>
	import api from "@/fetch/api";
	import step from '@/views/main-components/step/step.vue';
	export default {
		components: {step},
		props: {
			directFlowFunc: {
				type: Promise
			}
		},
		data() {
			return {
				isSoon: false,
				nextFlowInfo: [],
				nextStatusInfo: {},
				directFlow: []
			};
		},
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		mounted() {},
		created() {
			this.handleFlowData();
		},
		methods: {
			async handleFlowData() {
				await this.directFlowFunc.then(res => {
					this.directFlow = res;
					this.directFlow.forEach(item => {
						api.api('get', api.systemUrl + 'account/info/queryPage?id=' + item.czrid).then(res => {
							this.$set(item,'bmmc',res.list[0].officeName)
						})
					})
				})
				this.handleData()
			},
			handleData() {
				this.directFlow.forEach(item => {
					item.cznr = item.cznr.replace(item.czr, "")
				})
				this.nextFlowInfo = JSON.parse(JSON.stringify(this.directFlow)).pop();
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