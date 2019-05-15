<template>
	<div class="step">
		<ul>
			<li v-for="(item,index) in list" :key="index">
				<p class="cricle"></p>
				<p class="line" v-if="index!=list.length-1"></p>
				<p class="right_content">
					<span>{{item.cznr}}&nbsp;&nbsp;</span>
					<span v-if="item.zxr">{{item.zxr}}&nbsp;&nbsp;</span>
					<span v-if="item.czr">{{item.czr}}&nbsp;&nbsp;</span>
					<span v-if="item.bmmc">{{item.bmmc}}&nbsp;&nbsp;</span>
					<span v-if="item.officeName">{{item.officeName}}&nbsp;&nbsp;</span>
					<slot name="content"></slot>
				</p>
				<p class="right_remark" v-if="item.remark">{{item.remark}}</p>
				<p :class="item.remark?'right_time' : 'right_remark'">{{item.czsj | timestampToTime}}</p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
	    props: {
	        list: {
	            type: Array,
	            default: function () {
	                return [];
	            }
	        }
	    },
	    data () {
	        return {
	
	        };
	    },
	    methods: {
	
	    },
	    mounted () {
	        console.log(this.list);
	    }
	};
</script>

<style lang="less" scoped>
	.step {
		height: 446px;
        /*overflow: auto;*/
		margin-top:20px;
		margin-left:20px;
		ul{
			height: 100%;
			overflow-y: auto;
			overflow-x: hidden;
			li{
				height: fit-content;
				position: relative;
				.cricle {
					width: 13px;
					height: 13px;
					background-color: #fff;
					border-radius: 50%;
					border: 1px solid transparent;
					border-color: #397cbf;
					color: #397cbf;
				}
				.line{
					height: 100%;
				    border-left: 1px solid #e9eaec;
				    position: absolute;
				    left: 6px;
				    top:13px;
				}
				.right_content{
					/*position: absolute;*/
					position: relative;
				    left: 20px;
				    /*top: -3px;*/
					top:-17px;
				    font-size: 16px;
				}
				.right_time{
					/*position: absolute;*/
				    /*margin-left: 20px;*/
				    /*margin-top: 5px;*/
					position:relative;
					top:-17px;
					left:20px;
				    color: rgb(170,170,170);
				}
				.right_remark{
					/*position: absolute;*/
				    /*margin-left: 20px;*/
				    /*margin-top: 10px;*/
					position:relative;
					top:-17px;
					left:20px;
					color: rgb(170,170,170);
					white-space: pre-wrap;
					width: 100%;
					word-break: break-word;
					height: fit-content;					
				}
			}
		}
	}
</style>