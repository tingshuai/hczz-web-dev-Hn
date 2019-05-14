<template>
	<div>
		<div class="clearfix tableStyle">
			<div class="tablemmp margin-bottom-20" v-if="sxzt==1&&dqzt=='a'">
				<table border="1" cellspacing="0">
					<tr>
						<th>状态</th>
						<th colspan="3">{{directFlowone.nextState}}</th>
					</tr>
					<tr>
						<th>下一个处理部门</th>
						<th>{{ directFlowone.nextOffice }}</th>
						<th>下一个处理人</th>
						<th>{{ directFlowone.nextName }}</th>
					</tr>
				</table>
			</div>
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
				this.directFlowone.nextName = res.nextName;
				this.directFlowone.nextState = res.nextState;
				this.getInfo(res.nextId);
			})
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
<style lang="less">

</style>