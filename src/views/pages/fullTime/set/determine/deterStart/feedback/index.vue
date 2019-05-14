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
			            <p style="word-break: break-all;">{{params.sqxx.jyrwnr}}</p>
			        </FormItem>
			         <FormItem label="任务附件：">
						<i class="el-icon-document" v-show="attach.length>0" style="color:#1890ff;font-weight: bold;"></i>
			            <span style="color:#1890ff;cursor: pointer;font-weight: bold;" @click="handlePrev(item)" v-for="(item,index) in attach" :key="index">{{item.filename}}.{{item.category}}&nbsp;&nbsp;</span>
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
			},
			sqid:{
				type:String
			},
			jzidFk:{
				type:String
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
				attach:[]
			}
		},
		watch:{
			show(){
				this.visible=this.show;
			}
		},
		mounted() {
			console.log(this.params,'BBBB')
			this.attach=this.params.attach.filter(item=>{
				return item.type==1
			})
		},
		methods: {
			handlePrev(val) {
				api.upload(val)
			},
			cancelBtn(){
				this.$emit('update');
				this.$refs.approve.resetFields();
				this.$refs.feedbackFiles.obj.fileList=[];
				this.$refs.feedbackFiles.obj.baseArr=[];
				this.formDynamic.fknr='';
			},
			sure(){
				let zhbFk={
					fknr:this.formDynamic.fknr,
					sqid:this.jzidFk
					// sqid:this.sqid

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
        		zhbFk.attach=attach;
        		api.api('post',api.configUrl+'/hczz/zhb/feedback/'+this.jzidFk,zhbFk).then(res=>{
        			this.$message.success('反馈成功')
        			this.cancelBtn();
        			// this.$emit('fkSuccess','bbbbb')
        		})
			},
			feedbackFiles(val){
				this.feedbackObj=val;
			},
			handlePrev(val) {
				api.upload(val)
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