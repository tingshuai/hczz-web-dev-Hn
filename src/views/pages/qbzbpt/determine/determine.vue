<template>
	<div id="dcwd">
		<div class="box-cj" >
            <header style="text-align:left;padding-left: 20px;">
                <Button type="default">返回</Button>
                <Button type="primary" style="background:#007BBA;">导出word</Button>
            </header>
            <main>
                <h1>{{title}}</h1>
                <p> 发布时间：{{times}}</p>
                <div v-for="(item,index) in content" :key="index" class="box-text">
                      <h2>{{item.title}}</h2>  
                      <p>{{item.conText}}</p>
                </div>
            </main>
        </div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	import {timestampToTime} from '@/libs/common/common';
	export default{
		data(){
			return {
                title:'基于巴彦淖尔市公安局合成作战研判报告',
                times:'2018-11-15',
                content:[{
                    title:'一、重点人员情况',
                    conText:'公安厅党委扫黑除恶专项斗争专项巡察意见反馈会在巴彦淖尔市公安局召开。市政府副市长、公安局局长宝山出席并讲话，公安厅党委第二巡察组组长巴图一行三人，市局在家的党委领导成员，以及开发区、河灌分局，扫黑除恶相关部门负责人，刑侦支队全体人员在主会场参加了会议。'
                },{
                    title:'二、重点人员情况',
                    conText:'公安厅党委扫黑除恶专项斗争专项巡察意见反馈会在巴彦淖尔市公安局召开。市政府副市长、公安局局长宝山出席并讲话，公安厅党委第二巡察组组长巴图一行三人，市局在家的党委领导成员，以及开发区、河灌分局，扫黑除恶相关部门负责人，刑侦支队全体人员在主会场参加了会议。'
                },{
                    title:'三、重点人员情况',
                    conText:'公安厅党委扫黑除恶专项斗争专项巡察意见反馈会在巴彦淖尔市公安局召开。市政府副市长、公安局局长宝山出席并讲话，公安厅党委第二巡察组组长巴图一行三人，市局在家的党委领导成员，以及开发区、河灌分局，扫黑除恶相关部门负责人，刑侦支队全体人员在主会场参加了会议。'
                },{
                    title:'四、重点人员情况',
                    conText:'公安厅党委扫黑除恶专项斗争专项巡察意见反馈会在巴彦淖尔市公安局召开。市政府副市长、公安局局长宝山出席并讲话，公安厅党委第二巡察组组长巴图一行三人，市局在家的党委领导成员，以及开发区、河灌分局，扫黑除恶相关部门负责人，刑侦支队全体人员在主会场参加了会议。'
                },{
                    title:'五、重点人员情况',
                    conText:'公安厅党委扫黑除恶专项斗争专项巡察意见反馈会在巴彦淖尔市公安局召开。市政府副市长、公安局局长宝山出席并讲话，公安厅党委第二巡察组组长巴图一行三人，市局在家的党委领导成员，以及开发区、河灌分局，扫黑除恶相关部门负责人，刑侦支队全体人员在主会场参加了会议。'
                }]
			}
		},
		methods:{
            goback(){
                this.$router.push('/')
            }
			
		}
	}
</script>

<style lang="less">
	#dcwd{
		.ivu-form-item{
			margin-bottom: 0;
		}
		.box-cj{
			border-radius:5px;
	        background:#FFFFFF;
	        /*overflow: hidden;*/
	        border: 1px solid #E2E2E2;
	        header{
	            padding: 16px 0;
	            border-bottom: 1px solid #E2E2E2;
	        }
	        main {
	            padding-top: 24px;
	            padding-top:14px;
	            overflow-y:auto;
	            text-align: center;
	        }
	        .box-text{
	            text-align: left;
	            padding: 10px 30px;
	            p{
	                font-size: 16px;
	                text-indent:32px;
	            }
	        }
		}	
		.tab-box{
			width: 100%;
			border-collapse:collapse;
			td {
				border: 1px solid lightgray;
				padding:10px 0;
				text-align: left;
			}
		}
	}
	

</style>