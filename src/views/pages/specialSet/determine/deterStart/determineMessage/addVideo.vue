<template>
	<div class="addPerson">
		<div class="clearfix">
			<Modal v-model="visible" title="关联人特征" class="modal-ct" width="700" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<Form ref="formDynamicAdd" :model="formDynamic" :rules="ruleValidate" :label-width="120" class="padding-left-20 padding-right-20">
					<Row>
						<Col span="12">
						<FormItem label="视频：">
							<div id="filePicker">6656</div>
							<!--<loadFile @on-change="spFile" ref="spFile"></loadFile>-->
							<vue-upload
						        ref="uploader"
						        url="/api/v1/imageManage/save?login=admin"
						        uploadButton="#filePicker"
						        multiple
						        @fileChange="fileChange"
						        @progress="onProgress"
						        @success="onSuccess"
						></vue-upload>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<FormItem label="备注：">
							<Input v-model.trim="formDynamic.bz" clearable type="textarea" :rows="4" placeholder="请输入体貌特征" :maxlength="300"></Input>
						</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	</div>
</template>

<script>
	import vueUpload from '@/views/main-components/file-upload/big.vue';
	import api from '@/fetch/api';
	import $ from 'jquery';
	import {telphoneNumber,validateNameExsitAdd} from '@/libs/common/check.js';
	export default {
		components: {
			vueUpload
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			vidoId:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				formDynamic: {
					bz:''
				},
				ruleValidate: {
					
				},
				visible:this.show,
				zwObj:[],
				zjObj:[],
				
				zjlxList:[],
				mzList:[],
				spFileList:[]
			}
		},
		mounted() {
		},
		watch:{
			show(val){
				this.visible=val;
				if(this.personId && val){
					this.init();
				}
			}
		},
		methods: {
            sure(){
            	this.$refs.formDynamicAdd.validate((valid)=>{
	            	if(valid){
	            		let urls=this.personId?'/hczz/gl/glry/updateGlry':'/hczz/gl/glry/insertGlry'
	            		let glry={
	            			bz:this.formDynamic.bz,
	            			sqid:this.$store.state.app.deterId,
	            			id:this.personId
	            		}
	            		let attach=[];
	            		$.each(this.zwObj.fileList,(index,val)=>{
	            			attach.push({
	            				category:val.name.split('.')[1],
	            				filename:val.name.split('.')[0],
	            				minetype:this.zwObj.baseArr[index].split('base64,')[0],
	            				data:this.zwObj.baseArr[index].split('base64,')[1],
	            				type:0
	            			})
	            		})
	            		$.each(this.zjObj.fileList,(index,val)=>{
	            			attach.push({
	            				category:val.name.split('.')[1],
	            				filename:val.name.split('.')[0],
	            				minetype:this.zjObj.baseArr[index].split('base64,')[0],
	            				data:this.zjObj.baseArr[index].split('base64,')[1],
	            				type:1
	            			})
	            		})
	            		let objs={
	            			glry:glry,
	            			attach:attach
	            		}
	            		api.api('post',api.configUrl+urls,objs).then(res=>{
	            			this.$emit('update')
	            			this.resets();
	            		})
	            	}
	            })
            },
            spFile(val){
            	this.zjObj=val;
            },
            resets(){
            	this.formDynamic={
					bz:''
				}
				this.$refs.spFile.obj.fileList=[];
				this.$refs.spFile.obj.baseArr=[];
				this.$refs.formDynamicAdd.resetFields();
				this.spFileList=[];
            },
            getDetail(){
            	return api.api('post',api.configUrl+'/hczz/gl/glry/getGlryDetail',{id:this.personId}).then(res=>{
			        this.formDynamic=res;
			     })
            },
            getSpFile(){
            	api.api('post',api.configUrl+'/hczz/fj/getFjData',{
            		glid:this.formDynamic.id,
            		tablename:'T_HCZZ_GLRY',
            		type:0
            	}).then(res=>{
            		this.spFileList=res;
            		$.each(res,(val)=>{
            			this.$refs.spFile.fileList.push(val.filename);
            			this.$refs.spFile.baseArr.push(val.filename);
            		})
            		
            	})
            },
            cancelBtn(){
            	this.$emit('update');
            	this.resets();
            	this.$refs.formDynamicAdd.resetFields();
            },
            async init(){
            	await this.getDetail();
            	this.getSpFile();
            },
            fileChange(){
            	
            },
            onProgress(){
            	
            },
            onSuccess(){
            	
            }
		}
	};
</script>
<style lang="less">
	.warn {
		padding-top: 20px;
		.wholeContent {
			height: 100%;
		}
	}
</style>