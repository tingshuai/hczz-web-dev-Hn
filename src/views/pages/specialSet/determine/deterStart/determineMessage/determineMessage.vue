<template>
	<div class="message">
		<el-tabs :tab-position="tabPosition" v-model="message">
		    <el-tab-pane label="关联人员" name="person">
		    </el-tab-pane>
		    <el-tab-pane label="关联车" name="car">
		    </el-tab-pane>
		    <el-tab-pane label="关联手机" name="phone">
		    </el-tab-pane>
		    <el-tab-pane label="关联虚拟号" name="dummy">
		    </el-tab-pane>
		    <el-tab-pane label="关联视频" name="videoo">
		    </el-tab-pane>
		    <component :is="currentView"></component>
		  </el-tabs>
	</div>
</template>

<script>
	import person from './correlaPerson';
	import car from './correlaCar';
	import phone from './correlaPhone';
	import dummy from './correlaDummy';
	import videoo from './correlaVideo';
	export default{
		components:{
			person,
			car,
			phone,
			dummy,
			videoo
		},
		data(){
			return {
				tabPosition:'left',
				message:'person',
				currentView:'person'
			}
		},
		watch:{
			message(val){
				this.currentView=val;
			}
		},
		mounted(){
			
		},
		methods:{
			
		}
	}
</script>

<style lang="less">
	.message{
  	.el-tabs{
  		.el-tabs__header{
  			margin-left: 0 !important;
  		}
  	}
  }
</style>