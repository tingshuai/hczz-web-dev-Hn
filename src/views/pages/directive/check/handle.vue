<template>
	<div>
		<div class="clearfix tableStyle">
			<step :list="directFlow"></step>

		</div>
	</div>
</template>

<script>
	import step from '@/views/main-components/step/step.vue';
	import api from "@/fetch/api";
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
			this.handFnc.then(res => {
				this.directFlow = res;
			});
		},
		methods: {
		}
	};
</script>
<style lang="less">
	.path-flow {
		li:nth-child(2) {
			.and-so-on {
				&::after {
					content: " 等····";
				}
			}
		}
	}
</style>