<template>

	<!-- 案例文件代码跟request.vue文件相同 -->
		<el-tabs :tab-position="tabPosition" v-model="message">
		    <el-tab-pane label="案件库" name="caseList">
		    </el-tab-pane>
		    <el-tab-pane label="警情库" name="warnList">
		    </el-tab-pane>
		    <el-tab-pane label="手动发起1" name="hand">
		    </el-tab-pane>
		    </el-tab-pane>
		    <component :is="currentView"></component>
		  </el-tabs>
	</div>
</template>

<script>
	import caseList from './requesea.vue';//案件
	import warnList from './warn/warning.vue';
	import hand from './case/case.vue';
	
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

<style>
</style>