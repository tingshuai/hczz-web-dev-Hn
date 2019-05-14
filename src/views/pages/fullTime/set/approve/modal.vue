<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" v-if="approveZt=='n'" @click="cancelBtn">取消</Button>
					<Button type="default" class="cancelBtn" v-if="approveZt=='y'" @click="cancelBtn">关闭</Button>
					<Button type="primary" class="sureBtn" v-if="approveZt=='n'" @click="sure">确定</Button>
				</div>
				<div style="height: 450px;overflow: auto;">
					<el-tabs v-model="activeName"  @tab-click="handleClick">
						<el-tab-pane label="流程轨迹" name="handle">
							<handle ref="handle" :hadleFn="handleFn"></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :objFnc="objFnc"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="formApprove" v-if="approveZt=='n'">
                    <h3>审批</h3>
                    <Form ref="approve" :model="formDynamic" :rules="ruleValidate" :label-width="70">
                    <FormItem label="审批操作" prop="splx">
			            <RadioGroup v-model="formDynamic.splx">
			                <Radio label="1" :disabled="disabled">通过</Radio>
			                <Radio label="2" :disabled="disabled">不通过</Radio>
			                <Radio label="3" :disabled="disabled">不通过，驳回并补充材料</Radio>
			            </RadioGroup>
			        </FormItem>
			        <FormItem label="审批意见" prop="remark">
			            <Input v-model.trim="formDynamic.remark" clearable type="textarea" :disabled="disabled" :rows="4" placeholder="请输入简要任务内容" :maxlength="100"></Input>
			        </FormItem>
			        </Form>
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
	export default {
		components: {
			Upload,
			handle,
			detail
		},
		props: {
			title: {
				type: String,
				default: '',
				required: true
			},
			id:{
				type:String,
				default:''
			},
			task:{
				type:Object,
				default:''
			},
			show:{
				type:Boolean,
				default:false
			},
			approveZt:{
				type:String,
				default:'n'
			}
		},
		data() {
			return {
				activeName: 'handle',
				visible:this.show,
				formDynamic:{
					splx:'',
					remark:'',
					id:this.id,
					task:this.task
				},
				ruleValidate:{
					splx:[{
						required:true,
						message:'审批操作不能为空',
						trigger:'blur'
					}],
					remark:[{
						required:true,
						message:'审批意见不能为空',
						trigger:'blur'
					}]
				},
				list:[],
				objFnc:null,
				handleFn:null,
				disabled:false
			}
		},
		created(){
			this.handleFn=this.objFnc=this.getDetail();
		},
		watch:{
			task(val){
				this.formDynamic.task=val;
			},
			id(){
				this.formDynamic.id=id;
			},
			show(val){
				this.visible=val;
			}
		},
		mounted() {
			if(this.approveZt!='n'){
				this.getFlow();
				this.disabled=true;
			}else{
				this.disabled=false;
			}
		},
		methods: {
			handleClick(tab, event) {
				
			},
			cancelBtn(){
				this.$emit('update');
				this.$refs.approve.resetFields();
			},
			sure(){
				this.$refs.approve.validate((valid)=>{
	            	if(valid){
	            		let pforsp={
	            			busid:this.task.busId,
	            			remark:this.formDynamic.remark,
	            			splx:this.formDynamic.splx,
	            			taskid:this.task.taskId
	            		}
	            		api.api('post',api.configUrl+'/hczz/gzl/doApprove',pforsp).then(res=>{
	            			this.$message.success('审批成功');
	            			this.$refs.approve.resetFields();
	            			this.cancelBtn();
	            			this.$emit('update','a');
//                          this.getColunmnList();
                            
	            			
	            		})
	            	}
	            })
			},
            getColunmnList(){
            	let obj={
		              	pagesize:10,
		              	pageindex:1,
		              	busName:'',
		              	startUserName:'',
		              	starttime:'',
		              	endtime:'',
		              	gzllx:'0',
		              	lx:''
		              }
            	api.api('post',api.configUrl+'/hczz/gzl/queryMyUpcomingList',obj).then(res=>{
					this.loading=false;
					if(res.result){
						this.list=res.result;
						this.$store.commit('setApproveId',this.list[0].busId);
					}
				})
            },
            getFlow(){
            	console.log('yyyyy')
				api.api('get',api.configUrl+'/hczz/zhb/getFlow/'+this.formDynamic.id).then(res=>{
					this.directFlow=res.clrzList;
					let arr=res.clrzList.filter(item=>{
						return item.czlx=='审批同意'
					})
					this.formDynamic.splx='1';
					this.formDynamic.remark=arr[0].remark;
				})
			},
            getDetail(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/zhb/queryDetail/'+this.formDynamic.id).then(res=>{
						resolve(res)
					})
				})
				
			}
		}
	};
</script>
<style lang="less">
	.formApprove{
		padding-top: 20px;
		border-top: 1px solid #dddee1;
	}
</style>