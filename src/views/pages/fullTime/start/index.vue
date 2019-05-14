<template>
	<div>
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
	import caseList from './caseList.vue';
	import warnList from './warnList.vue';
	import hand from './hand.vue';
	
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