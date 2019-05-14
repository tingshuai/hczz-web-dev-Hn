<template>
	<div>
		<div class="clearfix tableStyle">
			<!--<div class="tablemmp">	
				<table border="1" cellspacing="0">
					<tr>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
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
			<div class="path-flow-ct">
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
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	export default {
		components: {

		},
		props: {
			fncHandel: {
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
			this.getHandel()
		},
		methods: {
			getHandel() {
				this.fncHandel.then(res => {
					this.detailObj = res.sqxx;
					this.directFlow = res.clrz;
					this.directFlowone = this.directFlow[res.clrz.length - 1];
				})
			}
		}
	};
</script>
<style lang="less">
    .tablemmp{
    	width:100%;
    	height:150px;
    	overflow:hidden;
    }
    .tablemmp table{
    	margin-top:-40px;
    }
</style>