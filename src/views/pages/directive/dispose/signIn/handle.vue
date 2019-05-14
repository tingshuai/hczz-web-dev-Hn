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
				directFlow: [],
				zt: '',
				isSp: false, //如果最后一个节点是待审批，让其显示，否则隐藏下一个审批人
			};
		},
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		created() {
			this.handleFlowData();
		},
		filters: {
			ztFilter(val) {
				switch(val) {
					case '1':
						return '待签收'
						break;
					case '2':
						return '待反馈';
						break;
					case '3':
						return '已反馈';
						break;
					case '4':
						return '已评价';
						break;
					case '5':
						return '待签收';
						break;
					default:
						break;
				}
			}
		},
		methods: {
			async handleFlowData() {
				await this.directFlowFunc.then(res => {
					this.directFlow = JSON.parse(res.split('/')[0]);
					this.directFlow.forEach(item => {
						api.api('get', api.systemUrl + 'account/info/queryPage?id=' + item.czrid).then(res => {
							this.$set(item,'bmmc',res.list[0].officeName)
						})
					})
					if(this.directFlow[this.directFlow.length - 1].cznr.includes('待审批')) {
						this.isSp = true;
					} else {
						this.isSp = false;
					}
					this.zt = res.split('/')[1];
				})
				this.handleData()
			},
			handleData() {
				this.directFlow.forEach(item => {
					item.cznr = item.cznr.replace(item.czr, "")
				})
				this.nextFlowInfo = JSON.parse(JSON.stringify(this.directFlow)).pop()
				if(this.directFlow[this.directFlow.length - 1].cznr !== '待审批') {
					this.nextFlowInfo.czr = '';
				}

			}
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