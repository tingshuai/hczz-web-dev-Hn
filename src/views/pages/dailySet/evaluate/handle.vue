<template>
	<div>
		<div class="clearfix tableStyle">
			<!--<div class="tablemmp">	
				<table border="1" cellspacing="0">
					<tr>
						<th>状态</th>
						<th colspan="3">{{detailObj.zt|taskStatus}}</th>
					</tr>
					<tr>
						<th>下一个处理部门</th>
						<th>{{ directFlowone.bmmc }}</th>
						<th>下一个处理人</th>
						<th>{{ directFlowone.zxr }}</th>
					</tr>
				</table>
			</div>-->
			<step :list="directFlow"></step>
			<!--<div class="path-flow-ct">
				<el-scrollbar tag="ul" ref="scrollbar" wrap-class="el-scrollbar__wrap" view-class="el-scrollbar__view" :class="{ 'scrollbar-path-flow':isScroll}" class="path-flow">
					<li v-for="(item,index) in directFlow">
						<div class="flow-step-ct">
							<p class="icon-ct">
								<i class="el-icon-circle-check-outline"></i>
								<em></em>
							</p>
							<p class="step-des-ct">
								<span><b>{{item.czlx}}</b></span>
								<span>{{item.czsj|timestampToTime}}</span>
								<span :class="{'and-so-on':isSoon}">{{item.bmmc}}&nbsp;&nbsp;{{item.zxr}}</span>
							</p>
						</div>
					</li>
				</el-scrollbar>
			</div>-->
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
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		data() {
			return {
				list: [1, 2, 3, 4, 5, 6, 7],
				directFlow: [],
				directFlowone: {},
				isSoon: false
			}
		},
		mounted() {
			this.getHandle();
		},
		methods: {
			getHandle() {
				this.fncHandle.then(res => {
					this.directFlow = res.clrzList;
					this.directFlow.forEach(item => {
						api.api('get', api.systemUrl + 'account/info/queryPage?id=' + item.zxrid).then(res => {
							item.bmmc = res.list[0].officeName
						})
					})
				})
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
	
	.tablemmp {
		width: 100%;
		height: 150px;
		overflow: hidden;
	}
</style>