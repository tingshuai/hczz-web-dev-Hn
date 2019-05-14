<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">关闭</Button>
				</div>
				<div  style="height: 450px;overflow: auto;">
					<el-tabs v-model="activeName"  @tab-click="handleClick" style="height: 450px;">
						
						<el-tab-pane label="流程轨迹" name="handle">
							<handle :fncHandle='fncHandle'></handle>
						</el-tab-pane>
						<el-tab-pane label="反馈结果" name="result">
							<result :fncResult="fncResult"></result>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import detail from './detail';
	import handle  from './handle';
	import result from './result';
	import {isNumber} from '@/libs/common/check.js';
	export default {
		components: {
			handle,
			detail,
			result
		},
		props: {
			rowObj:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			show:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				activeName: 'handle',
				visible:this.show,
				detail:{},
				fncHandle:null,
				fncDetail:null,
				fncResult:null
			}
		},
		created(){
			this.fncHandle=this.getFlow();
			this.fncDetail=this.fncResult=this.getDetail();
			this.fncDetail.then(res=>{
				this.detail=res.sqxx
			})
		},
		computed:{
			title(){
				return '编号：'+this.rowObj.sqwh
			}
		},
		mounted() {
            
		},
		watch:{
			show(val){
				this.visible=val;
			}
		},
		methods: {
			handleClick(tab, event) {
				console.log(tab,"KK")
			},
			cancelBtn(){
				this.$emit('update');
			},
		    getDetail(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/zhb/queryDetail/'+this.rowObj.id).then(res=>{
					    resolve(res)
				    })
				})
			},
			getFlow(){
				console.log('1111111')
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/zhb/getFlow/'+this.rowObj.id).then(res=>{
						console.log(res,'2222222')
						resolve(res)
					})
				})
			}
		}
	};
</script>
<style lang="less">
	
</style>