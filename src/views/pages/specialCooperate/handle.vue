<template>
	<div>
		<div class="clearfix tableStyle">
			<step :list="directFlow"></step>
		</div>
	</div>
</template>

<script>
	import step from '@/views/main-components/step/step.vue';
	import api from '@/fetch/api';
	export default {
		components: {
			step
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
<style lang="less" scoped>
	.step{
		margin-top: 20px;
		height: 440px;
	}
</style>