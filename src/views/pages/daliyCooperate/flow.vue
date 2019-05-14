<template>
	<div class="flow">
		<Button type="primary" @click="goBack">返回</Button>
		<ul>
			<li v-for="(index,item) in list">
				<span>{{index}}</span>
				<span class="active2" v-show="index%3!=0 && index!=length-0"></span>
				<span class="active3" v-show="index%3!=0 && index!=length-0">&gt;</span>
				<span class="active1" v-show="index%3==0"></span>
				<span class="noActive1" v-show="index%3!=2 && index%3!=1 && index!=length"></span>
				<span class="noActive2" v-show="index%3==1 && (index!=length-0 && index!=length-1 && index!=length-2)"></span>
				<span class="noActive3" v-show="index%3==1 && (index!=length-0 && index!=length-1 && index!=length-2)">&gt;</span>
				<p class="op1" v-show="index%3==0 && (index!=length-0)"></p>
				<p class="op2" v-show="index%3==1 && (index!=length-0 && index!=length-1 && index!=length-2)"></p>
				<p class="op" v-show="index%3==2 && (index!=length-0 && index!=length-1)"></p>
			</li>
			
		</ul>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				list:[1,2,3,4,5,6,7,8,9,10],
				length:0
			}
		},
		mounted(){
			this.length=this.list.length;
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			}
		}
	}
</script>

<style lang="less">
    .flow ul{
    	list-style: none;
    	width: 900px;
    	overflow: auto;
    	.op1{
    		height: 1px;
		    background: black;
		    position: absolute;
		    top: 70px;
		    width: 100px;
    	}
    	.op{
    		height: 1px;
		    background: black;
		    position: absolute;
		    top: 70px;
		    width: 300px;
    	}
    	.op2{
    		height: 1px;
		    background: black;
		    position: absolute;
		    top: 70px;
		    width: 200px;
		    left: 100px;
    	}
    	li {
    		margin-bottom: 40px;
    		width: 300px;
    		display: inline-block;
    		position: relative;
    		span:nth-child(1){
    			width: 200px;
			   	height: 50px;
			   	border: 1px solid;
			   	display: inline-block;
    		}
    		span.active{
    			width: 100px;
			   	border: 1px solid;
			   	display: inline-block;
    		}
    		span.active2{
    			width: 90px;
    			height: 1px;
    			background: black;
			   	position: absolute;
			   	top: 25px;
    		}
    		span.active3{
    			width: 10px;
    			height: 10px;
			   	position: absolute;
			   	top: 17px;
			   	right: 0;
    		}
    		span.noActive1{
    			position: absolute;
			    width: 1px;
			    height: 20px;
			    left: 100px;
			    top: 50px;
			    background: black;
    		}
    		span.noActive2{
    			position: absolute;
			    width: 1px;
			    height: 10px;
			    left: 100px;
			    top: 70px;
			    background: black;
    		}
    		span.noActive3{
    			position: absolute;
			    width: 1px;
			    height: 10px;
			    left: 100px;
			    top: 80px;
			    background: black;
    		}
    	}
    }
</style>