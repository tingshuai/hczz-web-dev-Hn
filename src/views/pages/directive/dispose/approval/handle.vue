<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0">
				<tr>
					<th>状态</th>
					<th>待审批</th>
					<th rowspan="2">下一个处理人</th>
					<!-- <th rowspan="2"><p>{{nextFlowInfo[nextFlowInfo.length-1].czr}}</p></th> -->

					<th rowspan="2"><p v-if="nextFlowInfo.length>2">{{nextFlowInfo[nextFlowInfo.length-1].czr}}</p></th>
				</tr>
				<tr>
					<th>下一个处理部门</th>
					<th>{{nextStatusInfo.czdw}}</th>
				</tr>
			</table>
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
				    	
						<span><b>{{item.cznr}}</b></span>
						<!--<span v-if="item.remark">{{item.remark}}</span>-->
					    <!--<span v-else>{{item.czlx}}</span>-->
						<span>{{item.zxr}}</span>
						<span>{{item.czsj|timestampToTime}}</span>
						<span :class="{'and-so-on':isSoon}">{{item.czdw}}&nbsp;&nbsp;{{item.czr}}</span>
					</p>
					
					</div>
				</li>
			</el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script>
import api from "@/fetch/api";
export default {
  components: {},
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
			})
			this.handleData()
		},
		handleData(val){
//			this.directFlow.forEach(item => {
//				item.cznr = item.cznr.replace(item.czr, "")
//			})
						this.nextFlowInfo = this.directFlow;
//          this.nextFlowInfo.shift();
            this.nextStatusInfo = this.nextFlowInfo[0];
        if (this.directFlow.length > 2) {
//          this.directFlow = this.directFlow.splice(0, 2);
            this.isSoon = true;
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