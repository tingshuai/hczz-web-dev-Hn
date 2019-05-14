<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0">
				<tr>
					<th>状态</th>
					<th>{{nextFlowInfo.cznr}}</th>
					<th rowspan="2">下一个处理人</th>
					<th rowspan="2">{{nextFlowInfo.czr}}</th>
				</tr>
				<tr>
					<th>下一个处理部门</th>
					<th>{{nextFlowInfo.czdw}}</th>
				</tr>
			</table>
			<div class="path-flow-ct">
			<el-scrollbar
			tag="ul"
			ref="scrollbar"
			wrap-class="el-scrollbar__wrap"
			view-class="el-scrollbar__view" :class="{ 'scrollbar-path-flow':isScroll}" class="path-flow">
				<li v-for="(item,index) in directFlow">
					<div class="flow-step-ct">
						<p class="icon-ct"> 
							<i class="el-icon-circle-check-outline"></i>
							<em></em>
						</p>
				    <p class="step-des-ct">
							<span><b>{{item.cznr}}</b></span>
							<span>{{item.czsj|timestampToTime}}</span>
							<span :class="{'and-so-on':isSoon}">{{item.czdw}}{{item.czr}}</span>
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
  created() {
    this.handleFlowData();
  },
  methods: {
    async handleFlowData() {
			await this.directFlowFunc.then(res => {
				this.directFlow = res
			})
			this.handleData()
		},
		handleData(){
			this.directFlow.forEach(item => {item.cznr = item.cznr.replace(item.czr, "")})
				this.nextFlowInfo = JSON.parse(JSON.stringify(this.directFlow)).pop()
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