<template>
	<div style="height: 100%;">
		<div class="deterStartTop">
			<div class="left">
				<Button  @click="backbtn" class="margin-right-20">返回</Button>
				<span>日常合成请求编号：</span>
			    <span>{{code}}</span>
			</div>
			<div class="right">
				<!--<Button>处理流程</Button>-->
				<!--<Button  @click="imGroup">即时通讯</Button>-->
				<!--<Button  v-show="more" @click="open">更多</Button>-->
				<Button  v-if="isZz && userInfo.zylx != '2' " v-show="isZa"  @click="manageBtn">小组管理</Button>
				<Button  v-show="isZa" @click="membersBtn">小组成员</Button>
				<Button  @click="flowsheetBtn">处理日志</Button>
				<!--<Button  v-show="!more">展开/收起全部任务</Button>-->
				<!--<Button  v-show="!more" @click="close">收起</Button>-->
			</div>
		</div>
		<div class="deterStartCon">
			<div class="right topRight">
				<hr />
				<el-tabs v-model="activeName"  @tab-click="handleClick">
				    <el-tab-pane label="我的任务" name="task">
				    	<div slot="label">
				    		<span>我的任务1</span>
				    		<span class="oSpan" @click="getNew">{{numbers}}</span>
				    	</div>
				    </el-tab-pane>
				    <el-tab-pane label="详细信息" name="detail">
				    </el-tab-pane>
				    <el-tab-pane label="案件特征" name="feature">
				    </el-tab-pane>
				    <el-tab-pane label="研判信息" name="determineMessage">
				    </el-tab-pane>
				  </el-tabs>
				  <component :is="currentView" style="margin-top: 74px;background: white;" @signSuccess="signSuccess"></component>
			</div>
			<div class="left" style="height:59px;line-height:59px;">
				<span class="middle">案事名称：</span>
				<span class="overHidden middle" :title="content">{{content}}</span>
				<span class="middle">| {{zt}}</span>
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
				more:true,//更多按钮
				activeName:'task',
				taskList:[],//我的任务树
				flowsheetShow:false,//处理日志
				currentView:'task',
				memebersShow:false,
				directFlow:{},
				addGroupModal:false,
				isZz:false,
				numbers:0,
				zt:'',//该条任务的状态
				isFzz:false,//如果是副组长，在小组管理看不到副组长模块
				zaid:null,//签收完才有专案id
				isZa:false,//签收完毕才有专案id
				flowFnc:null,//处理日志页面Promise对象
				userInfo: null	// 用户信息
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
			zaid(val){
				if(val){
					this.isZa=true;
				}
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
			}
		},
		mounted(){
			this.getNumber().then(res=>{
				this.getOffice()
			});
			
			this.zt=this.$route.query.zt;
			this.flowFnc=this.getFlow();
		},
		methods:{
			getNumber(){
				return new Promise((resolve,reject)=>{
					api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {
						id: this.determineId
					}).then(res=>{
						this.zaid=res.sqxx.zaid;
						this.numbers=res.rwfp.filter(val=>{
							return val.zxrid==this.accountId
						}).length;
						resolve()
					})
				})
			},
			getOffice() {
				let obj = {
					zaid: this.zaid
				}
				api.api('post', api.configUrl + '/hczz/zaz/queryZazxxList', obj).then(res => {
					this.userInfo = res[0]
					let arr=res.filter(val=>{
						return val.zylx==0;
					});
					let brr=res.filter(val=>{
						return val.zylx==1;
					})
					let crr=[];
					let drr=[];
					if(arr.length){
						crr=arr.filter(item=>{
							return item.userid==this.accountId
						})
					}
					if(brr.length){
						drr=brr.filter(item=>{
							return item.userid==this.accountId
						})
					}
					if(drr.length){
						this.isFzz=true;
					}else{
						this.isFzz=false;
					}
					if(crr.length>0 || drr.length>0){
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
			signSuccess(val){
				this.getNumber().then(res=>{
					this.getOffice();
				});
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
			getFlow(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/za/getFlow/'+this.determineId+'?type=0').then(res=>{
						if(res){
							resolve(res)
						}
					})
				})
			},
			async imGroup(){//及时通讯代码
				let self=this;
				await new Promise(resolve=>{
					api.api('post',api.configUrl+'/hczz/za/getSqxxXx',{id:self.$route.query.id}).then(res=>{
						self.directFlow=res.za;
						resolve()
					})
				})
                await this.$store.dispatch("getUserInfo");

                layimWeb.chat({
                    name: this.directFlow.zamc
                    ,type: 'group' //群组类型
                    ,avatar: 'http://tp2.sinaimg.cn/5488749285/50/5719808192/1'
                    ,id:this.directFlow.id //定义唯一的id方便你处理信息
                    ,members: 0 //成员数，不好获取的话，可以设置为0
                });

                layimWeb.on('sendMessage', res=>{
                    //聊天数据
                    var mine=res.mine;
                    var to=res.to;
                    var message = new proto.Model();
                    var content = new proto.MessageBody();
                    message.setMsgtype(4);
                    message.setCmd(5);
                    message.setToken(Cookies.get('token'));
                    message.setSender(this.$store.getters.personal_userInfo.id);
                    message.setGroupid(res.to.id);
                    content.setContent(mine.content);
                    content.setType(0);
                    message.setContent(content.serializeBinary());
                    socket.send(message.serializeBinary());
                });
			},
			backbtn(){
				// this.$router.push({
                //     path:'/dailySet/determineManager'
				// })
				this.$router.go(-1);//返回上一层
			},
			getNew(){
				
			}
		}
	}
</script>

<style lang="less">
	.deterStartTop{
		overflow: hidden;
		border: 1px solid #e6e6e6;
	    background: white;
	    padding: 20px;
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
		}
	}
	.deterStartCon{
		position: relative;
		border: 1px solid #e6e6e6;
	    background: white;
	    padding: 0 0 8px 0;
	    height: 59px;
	    margin-top: 20px;
	    background: #fafafa;
	    height: calc(~"100% - 100px");
		.overHidden{
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100px;
		    white-space: nowrap;
		    display: inline-block;
		    line-height: 13px;
		}
		.left{
			font-size: 14px;
		    color: #333333;
		    float: left;
		    height: 50px;
		    width: 300px;
		    padding-left: 20px;
		    line-height: 50px;
		    font-family: "microsoft yahei";
			span{
				color: #333333;
				font-size: 14px;
			}
		}
		.topRight{
			float: right;
			width: 100%;
			margin-left: -300px;
			margin-bottom: -15px;
			border: 1px solid #fafafa;
			background: white;
			hr{
				position: absolute;
			    top: 49px;
			    background: #ececec;
			    width: 100%;
			}
			.oSpan{
				height:20px;
				width: 20px;
				display: inline-block;
				border-radius: 50%;
				background: #f4984e;
				color: white;
				text-align: center;
				line-height: 20px;
				position: absolute;
			}
			.el-tabs--top{
				width:377px;
				float:right;
				.el-tabs__nav{
					height: 59px;
				}
				#tab-task{
					line-height: 50px;
				}
			}
		}
	}
	.el-tabs__item{
		color: #999999;
	}
</style>