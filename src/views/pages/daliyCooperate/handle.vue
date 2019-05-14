<template>
	<div>
		<div class="clearfix tableStyle" >
			<div class="tablemmp" v-if="isshow">	
				<table border="1" cellspacing="0" >
					<tr>
						<th>状态</th>
						<th colspan="3">{{status}}</th>
					</tr>
					<tr>
						<th>下一个处理人</th>
						<th colspan="3">{{nextpeople}}</th>
					</tr>
				</table>
			</div>
			<div class="path-flow-ct">
			<el-scrollbar
			tag="ul"
			ref="scrollbar"
			wrap-class="el-scrollbar__wrap"
			view-class="el-scrollbar__view" :class="{ 'scrollbar-path-flow':isScroll}" class="path-flow">
				<li v-for="(item,index) in directFlow" :key="index">
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
			fncHandle:{
				type:Promise
			}
		},
		computed: {
		    isScroll() {
		      return this.directFlow.length > 3;
		    }
		  },
		data() {
			return {
				list:[1,2,3,4,5,6,7],
				directFlow:[],
				directFlowone:{},
				isSoon:false,
				status:'',
				nextpeople:'',
				isshow:false,
			}
		},
		mounted() {
            this.getHandle();
		},
		methods: {
			getHandle(){
				this.fncHandle.then(res=>{
					this.directFlow = res.clrzList;
					this.status = res.nextState
					this.nextpeople= res.nextName
					if(res.clrzList[res.clrzList.length-1].czlx == "待审批"){
						this.isshow = true
					}else{
						this.isshow = false
					}
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
	.tablemmp{
    	width:100%;
    	height:150px;
    	overflow:hidden;
    }
</style>