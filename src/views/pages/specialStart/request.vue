<template>

	<!-- 案例文件代码跟request.vue文件相同 -->
		<el-tabs :tab-position="tabPosition" v-model="message" style="margin-bottom:0;background:#fff;border-top:1px solid #dcdee2;border-left:1px solid #dcdee2;border-right:1px solid #dcdee2">
		    <el-tab-pane label="案件库" name="caseList">
		    </el-tab-pane>
		    <el-tab-pane label="警情库" name="warnList">
		    </el-tab-pane>
		    <el-tab-pane label="手动发起" name="hand">
		    </el-tab-pane>
		    </el-tab-pane>
		    <component :is="currentView"></component>
		  </el-tabs>
	</div>
</template>

<script>
	import caseList from './case/case.vue';//案件
	import warnList from './warn/warning.vue';
	import hand from './requesea.vue';//注意requesea文件与requestd的区别
	
	export default{
		components:{caseList,hand,warnList},
		data(){
			return {
				currentView:'caseList',
				tabPosition:'top',
				message:'caseList'
			}
		},
		watch:{
			message(val){
				this.currentView=val;
			}
		},
		computed:{
			activeName(){
				return this.$route.query.activeName
			}
		},
		mounted(){
			if(this.activeName){
				this.currentView=this.activeName;
				this.message=this.activeName;
			}
		}
	}
</script>

<style lang="less" scoped>

.el-tabs__header{
	border-top:1px solid #dcdee2 !important;
	border-left:1px solid #dcdee2 !important;
	border-right:1px solid #dcdee2 !important;
}
.single-page{
  background: #fff;
}
.el-tabs__nav-scroll {
    overflow: hidden;
    margin-left: 27px !important;
}
.el-tabs__nav .is-top{
margin-left: 27px !important;	
}

</style>