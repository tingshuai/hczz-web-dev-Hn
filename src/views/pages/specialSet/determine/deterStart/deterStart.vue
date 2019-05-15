<template>
	<div class="caseWraper">
		<div class="deterStartTop">
			<div class="left">
				<Button  @click="backbtn" class="margin-right-20">返回</Button>
				<span>专案合成请求编号：</span>
			    <span>{{code}}</span>
			</div>
			<div class="right">
				<!--<Button>处理流程</Button>-->
				<!--<Button  @click="imGroup">即时通讯</Button>-->
				<!--<Button  v-show="more" @click="open">更多</Button>-->
				<Button   @click="manageBtn" v-if="isZz">小组管理</Button>
				<Button   @click="membersBtn">小组成员</Button>
				<Button   @click="flowsheetBtn">处理日志</Button>
				<!--<Button  v-show="!more">展开/收起全部任务</Button>-->
				<!--<Button  v-show="!more" @click="close">收起</Button>-->
			</div>
		</div>
		<div class="break"></div>
		<div class="deterStartCon">
			<section class="headerWraper">
				<div class="left"> 
					<span class="middle">案事件名称：</span>
					<span class="overHidden middle" :title="content">{{content}}</span>
					<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
					<span class="middle">{{zt}}</span>
				</div>
				<div class="right topRight">
					<Tabs v-model="activeName"  @on-click="handleClick">
						<TabPane :label="label" name="task"></TabPane>
						<TabPane label="详细信息" name="detail"></TabPane>
					</Tabs>
				</div>
			</section>
			<component :is="currentView" class="caseMsg"></component>
		</div>
		<!--小组管理-->
		<div v-if="addGroupModal">
			<groupManage :show.sync="addGroupModal" :zzid="zaid" :isFzz="isFzz"></groupManage>
		</div>
		<!--小组成员-->
		<div v-if="memebersShow">
			<groupMembers ref="groupMembers" :show="memebersShow" :zzid="zaid" @update="memebersShow=false"></groupMembers>
		</div>
		<!--处理日志-->
		<div v-if="flowsheetShow">
			<treatmentFlowsheet :show.sync="flowsheetShow" @update="flowsheetShow=false" :flowFnc="flowFnc"></treatmentFlowsheet>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api.js';
	import task from './task/index';
	import detail from './detail/detail';
	import feature from './feature/feature';
	import determineMessage from './determineMessage/determineMessage.vue';
	import groupManage from '@/views/pages/workBench/groupModal/groupModal';
	import groupMembers from './groupMembers/index';
	import treatmentFlowsheet from './treatmentFlowsheet/index';
    import Cookies from 'js-cookie';
    import { uniqueArr } from '@/libs/common/common';
	export default {
		components:{
			task,
			detail,
			feature,
			determineMessage,
			groupManage,
			groupMembers,
			treatmentFlowsheet
		},
		data(){
			return {
                label: (h) => {
                    return h('div', [
                        h('span', '我的任务'),
                        h('Badge', {
                            props: {
                                count: this.numbers
                            }
                        })
                    ])
                },
				more:true,//更多按钮
				activeName:'task',
				taskList:[],//我的任务树
				flowsheetShow:false,//处理日志
				currentView:'task',
				memebersShow:false,
				directFlow:{},
				addGroupModal:false,
				isZz:false,//组长和副组长才能看到小组管理
				numbers:0,
				zt:'',//该条任务的状态
				isFzz:false,//如果是副组长，在小组管理看不到副组长模块
				flowFnc:null//处理日志Promise对象
			}
		},
		watch:{
			activeName(val){
				this.currentView=val;
			},
			'$store.state.app.ypZt'(val){
				if(val<2){
					this.zt='待研判'
				}else if(val<4){
					this.zt='研判中'
				}else{
					this.zt='已研判'
				}
				this.flowFnc=this.getFlow();
			},
			'$store.state.app.fkZt'(val){
				this.flowFnc=this.getFlow();
			}
		},
		computed:{
			code(){
				return this.$route.query.code
			},
			content(){
				return this.$route.query.content
			},
			accountId() {
				return window.localStorage.getItem('userId')
			},
			determineId(){
				return this.$route.query.id
			},
			ids(){
				return this.$route.query.id
			},
			zaid(){
				return this.$route.query.zaid
			}
		},
		mounted(){
			this.getOffice();
			this.zt=this.$route.query.zt;
			this.flowFnc=this.getFlow();
			this.$nextTick(()=>{
				this.getNumber();
			})
		},
		methods:{
			getNumber(){
				let that = this;
				api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {
					id: this.determineId
				}).then(res=>{
					that.numbers=res.rwfp.filter(val=>{
						return val.zxrid==this.accountId
					}).length;
				})
			},
			getOffice() {
				let obj = {
					zaid: this.zaid
				}
				api.api('post', api.configUrl + '/hczz/zaz/queryZazxxList', obj).then(res => {
					let arr=res.filter(val=>{
						return val.zylx==0;
					});
					// let brr=res.filter(val=>{
					// 	return val.zylx==1;
					// })
					let crr=[];
					// let drr=[];
					if(arr.length){
						crr=arr.filter(item=>{
							return item.userid==this.accountId
						})
					}
					// if(brr.length){
					// 	drr=brr.filter(item=>{
					// 		return item.userid==this.accountId
					// 	})
					// }
					// if(drr.length){
					// 	this.isFzz=true;
					// }else{
					// 	this.isFzz=false;
					// }
					if(crr.length>0){
						this.isZz=true;
					}else{
						this.isZz=false;
					}
				})
			},
			open(){
				this.more=false;
			},
			close(){
				this.more=true;
			},
			handleClick(tab, event){
				
			},
			manageBtn(){
				this.addGroupModal = true;
			},
			membersBtn(){
				this.memebersShow=true;
				setTimeout(()=>{
					this.$refs.groupMembers.selectShow=false;
				},100)
			},
			flowsheetBtn(){
				this.flowsheetShow=true;
			},
			backbtn(){
				this.$router.go(-1);//返回上一层
				// this.$router.push({
                //     path:'/specialSet/specialdetermineManager'
                // })
			},
			getNew(){
				
			},
			getFlow(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/za/getFlow/'+this.determineId+'?type=0').then(res=>{
						if(res){
							resolve(res)
						}
					})
				})
			},
			fkSuccess(){
				this.flowFnc=this.getFlow();
			}
		}
	}
</script>

<style lang="less" scoped>

	.deterStartTop{
		overflow: hidden;
		border: 1px solid #e6e6e6;
		background: white;
		padding: 10px;
		.left{
			float: left;
			span{
				font-size: 14px;
				color: #333333;
				vertical-align: middle;
			}
		}
		.right{
			float: right;
			button{
				color:#333333;
				font-weight: 600;
				margin-left: 7px;
			}
		}
	}
	.caseWraper{
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: white;
		.break{
			background-color: #f0f0f0;
			height: 10px;		
		}		
	}
	.deterStartCon{
		flex: 1;
		display: flex;
		flex-direction: column;
		height: calc(100% - 76px);
		.overHidden{
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100px;
		    white-space: nowrap;
		    display: inline-block;
		    line-height: 13px;
		}
		.caseMsg{
			flex: 1;
			height: calc(100% - 50px);
		}
		.headerWraper{
			display: flex;
			justify-content: space-between;
			min-height: 50px;
			height: 50px;			
			.left{
				display: flex;
				align-items: center;
				padding-left: 20px;				
			}
			.topRight{
				
			}
		}
	}
	.el-tabs__item{
		color: #999999;
	}
</style>