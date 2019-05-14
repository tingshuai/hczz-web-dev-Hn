<template>
	<div class="feedback">
		<div class="clearfix">
			<Modal v-model="visible" title="反馈任务" class="modal-ct" width="550" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div>
                    <Form ref="approve" :model="formDynamic" :rules="ruleValidate" :label-width="120">
                    <FormItem label="任务内容：">
			            <p class="word-break">{{params.rwnr}}</p>
			        </FormItem>
			        <FormItem label="任务附件：">
			            <a v-for='item in columnsData'>
							<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
			        </FormItem>
			        <FormItem label="反馈内容：" prop="fknr">
			            <Input v-model.trim="formDynamic.fknr" clearable type="textarea" :rows="4" placeholder="请输入反馈内容" :maxlength="120"></Input>
			        </FormItem>
			        <FormItem label="附件：">
			            <loadFile @on-change="feedbackFiles" ref="feedbackFiles"></loadFile>
			        </FormItem>
			        </Form>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	export default {
		components: {
			loadFile
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			params:{
				type:Object,
				default:{}
			}
		},
		data() {
			return {
				visible:this.show,
				formDynamic:{
					fknr:''
				},
				ruleValidate:{
					fknr:[{
						required:true,
						message:'反馈内容不能为空',
						trigger:'blur'
					}]
				},
				feedbackObj:{},
				columnsData:[]
			}
		},
		watch:{
			show(){
				this.visible=this.show;
			}
		},
		mounted() {
			this.$nextTick(()=>{
				this.getAppendix();
			})
		},
		computed:{
			determineId(){
				return this.$route.query.id
			}
		},
		methods: {
			cancelBtn(){
				this.$emit('update');
				this.$refs.approve.resetFields();
				this.$refs.feedbackFiles.obj.fileList=[];
				this.$refs.feedbackFiles.obj.baseArr=[];
			},
			sure(){
				let refk={
					rwid:this.params.id,
					fknr:this.formDynamic.fknr
				}
				let attach=[];
        		$.each(this.feedbackObj.fileList,(index,val)=>{
        			attach.push({
        				category:val.name.split('.')[1],
        				filename:val.name.split('.')[0],
        				minetype:this.feedbackObj.baseArr[index].split('base64,')[0],
        				data:this.feedbackObj.baseArr[index].split('base64,')[1],
        				type:0
        			})
        		})
        		let objs={
        			rwfk:refk,
        			attach:attach
        		}
        		api.api('post',api.configUrl+'/hczz/za/rwFk',objs).then(res=>{
        			this.$message.success('反馈成功')
        			this.$emit('update','a');
        			this.$refs.approve.resetFields();
        			this.formDynamic.fknr='';
        		})
			},
			feedbackFiles(val){
				this.feedbackObj=val;
			},
			handlePrev(val) {
				api.upload(val)
			},
			getAppendix(){
				let id=this.params.rwjb==0?this.determineId:this.params.id;
				let tablename=this.params.rwjb==0?'T_HCZZ_SQXX':'T_HCZZ_RWFP';
				let type=this.params.rwjb==0?'1':'0';
			    	let objs={
		            	type:type,
		            	tablename:tablename,
		            	glid:id
		            }
				    api.api('post',api.configUrl+'/hczz/fj/getFjList',objs).then(res=>{
				        this.columnsData=res;
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