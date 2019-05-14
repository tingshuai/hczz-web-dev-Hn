<template>
	<div>
		<div class="clearfix">
			<Modal v-model="visible" title="小组成员" class="modal-ct" width="550" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer">
					<Button @click="cancelBtn">关闭</Button>
				</div>
				<div class="groupMembers" v-if="!selectShow">
					<h2>
						<span>组长：</span>
						<span>{{firstLeader.xm}}</span>
					</h2>
					<div>
						<h2>副组长</h2>
						<ul class="membersImg">
							<li v-for="(item, index) in secondLeader" :key="index">
								<img src="../../../../../../images/ksh/tou.png" alt="" />
								<p>{{item.xm}}</p>
							</li>
						</ul>
						<h2>成员</h2>
						<ul class="membersImg">
							<li v-for="(item, index) in memberList" :key="index">
								<img src="../../../../../../images/ksh/tou.png" alt="" />
								<p>{{item.xm}}</p>
							</li>
						</ul>
						<!--<div>
							<span>组长：</span>
							<span>无人值班</span>
							<Button type="primary" @click="setMemberBtn">选择人员</Button>
						</div>-->
					</div>
				</div>
				<!--<div v-if="selectShow">
					<addMembers ref="selectModal" :roleInfo="roleInfo"></addMembers>
				</div>-->
			</Modal>
			
		</div>
	</div>
</template>

<script>
	import addMembers from '@/views/pages/workBench/groupModal/selectModal';
	import api from '@/fetch/api';
	export default {
		components:{
			addMembers
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			zzid:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				visible:this.show,
				roleInfo:{},
				selectShow:false,
				firstLeader:{},//组长
				secondLeader:[],//副组长
				memberList:[],//组员
				zaid:this.zzid//专案id
			}
		},
		watch:{
			show(val){
				this.visible=val;
			},
			zzid(val){
				this.zaid=val;
			}
		},
		mounted() {
          this.getMember();
		},
		methods: {
			handleClick(tab, event) {
				
			},
			cancelBtn(){
				if (this.selectShow) {
			        this.selectShow=false;
			        
			      } else {
			        this.$emit('update')
			      }
			},
			setMemberBtn(){
				this.selectShow=true;
//				this.$emit('update');
			},
			getMember(){
				let cc={
					zaid:this.zaid
				}
				api.api('post',api.configUrl+'/hczz/zaz/queryZazxxList',cc).then(res=>{
					let arr=res.filter((value)=>{
						return value.zylx==0
					})
					if(arr.length){
						this.firstLeader=arr[0]
					}
					this.secondLeader=res.filter((value)=>{
						return value.zylx==1
					})
					this.memberList=res.filter((value)=>{
						return value.zylx==2
					})
				})
			}
		}
	};
</script>
<style lang="less">
	.groupMembers{
		text-align: center;
		h2{margin-bottom: 10px;}
		.membersImg{
			display: flex;
			justify-content: space-around;
			list-style: none;
			flex-wrap: wrap;
			margin-bottom: 20px;
			li{
				width: 20%;
			}
		}
	}
	
</style>