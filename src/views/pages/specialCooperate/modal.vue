<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">关闭</Button>
				</div>
				<div  style="height: 500px;overflow: auto;">
					<el-tabs v-model="activeName"  @tab-click="handleClick" style="height: 450px;">
						<el-tab-pane label="流程轨迹" name="handle">
							<handle :fncHandle='fncHandle'></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
						<el-tab-pane label="研判结果" name="result">
							<result :fncResult="fncResult"></result>
						</el-tab-pane>
					</el-tabs>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import Upload from '@/views/main-components/file-upload/fileUpload.vue';
	import api from '@/fetch/api';
	import detail from './detail';
	import handle  from './handle';
	import result from './result';
	import {isNumber} from '@/libs/common/check.js';
	export default {
		components: {
			Upload,
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
				activeName: 'result',
				visible:this.show,
				fncHandel:null,//处理流程的Promise对象
				fncDetail:null,//详细信息的Promise对象
				fncResult:null,//反馈结果的Promise对象
				disabled:false//是否评价过
			}
		},
		created(){
			this.fncDetail=this.fncResult=this.getDetail();
			this.fncHandle=this.getFlow();
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
				
			},
			cancelBtn(){
				this.$emit('update');
			},
		    getDetail(){//获取详细信息
				return new Promise((resolve,reject)=>{
					api.api('post',api.configUrl+'/hczz/za/getSqxxXx',{id:this.rowObj.id}).then(res=>{
					    resolve(res)
				    })
				})
			},
            getFlow(){//获取审批流程
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/za/getFlow/'+this.rowObj.id+'?type=0').then(res=>{
						if(res){
							resolve(res)
						}
					})
				})
			}
		}
	};
</script>
<style lang="less">
	
</style>