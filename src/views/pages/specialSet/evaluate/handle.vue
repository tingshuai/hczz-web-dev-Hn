<template>
	<div>
		<div class="clearfix tableStyle">
			<step :list="directFlow"></step>
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
				isSoon:false
			}
		},
		mounted() {
            this.getHandle();
		},
		methods: {
			getHandle(){
				this.fncHandle.then(res=>{
					this.directFlow = res.clrzList;
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