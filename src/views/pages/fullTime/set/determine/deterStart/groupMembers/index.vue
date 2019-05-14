<template>
	<div>
		<div class="clearfix">
			<Modal v-model="visible" title="小组成员" class="modal-ct" width="550" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer">
					<Button @click="cancelBtn">取消</Button>
				</div>
				<div class="groupMembers">
					<div v-for="item in list">
						<h3>{{item.jzjc}}</h3>
						<ul class="membersImg">
							<li v-for="itemMember in item.userList">
								<img src="../../../../../../../images/icon_person_outline.png" alt="" />
								<p>{{itemMember.userName}}</p>
							</li>
						</ul>
					</div>
				</div>
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
			groupFnc:{
				type:Promise
			},
			show:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				visible:this.show,
				firstLeader:{},//组长
				secondLeader:[],//副组长
				memberList:[],//组员
				list:[],
				
			}
		},
		watch:{
			show(val){
				this.visible=val;
			}
		},
		mounted() {
            this.groupFnc.then(res=>{
            	this.list=res.jzList;
            	this.list.forEach(item=>{
            		api.api('get',api.configUrl+'/hczz/jzpz/queryDetail/'+item.jzpzid).then(resS=>{
            			let arr=resS.jzbmList;
            			let brr=[];
            			arr.forEach(itemBrr=>{
            				brr.push(itemBrr.bmbh)
            			})
						this.$set(item,'officeCode',brr.join(','))
						
					})
            	})
            	setTimeout(()=>{
            		this.list.forEach(item=>{
	            		api.api('get',api.systemUrl+'/account/info/queryPage2',{
	            			officeCode:item.officeCode
	            		}).then(result=>{
	            			
	            			this.$set(item,'userList',result.list)
	            		})
	            	})
            	},500)
            })
		},
		methods: {
			cancelBtn(){
				this.$emit('update')
			}
		}
	};
</script>
<style lang="less">
	.groupMembers{
		text-align: center;
		.membersImg{
			display: flex;
			justify-content: flex-start;
			list-style: none;
			flex-wrap: wrap;
			max-height:300px;
			overflow:auto;
			li{
				width: 20%;
			}
		}
	}
	
</style>