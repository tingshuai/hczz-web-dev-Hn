<template>
	<div class="addPerson">
		<div class="clearfix">
			<Modal v-model="visible" title="添加视频" class="modal-ct" width="540" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" v-if="!isStore" class="sureBtn" @click="sure">确定</Button>
				</div>
				<Form ref="formDynamicAdd" :model="formDynamic" :rules="rules" :label-width="120" class="padding-left-20 padding-right-20">
					<Row>
						<Col span="12">
						<FormItem label="视频：" prop="videoFile">
							<div v-if="!isStore">
								<Input v-show="false" v-model.trim="formDynamic.videoFile"></Input>
								<loadFile @on-change="spFile" ref="spFile" :multiple="multiple" :numbers="numbers"></loadFile>
								<p v-for='(item,index) in spFileList' :key="index" class="zjfiled">
									<span>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
								</p>
								<!-- <vue-upload
									ref="uploader"
									url="/api/v1/imageManage/save?login=admin"
									uploadButton="#filePicker"
									multiple
									@fileChange="fileChange"
									@progress="onProgress"
									@success="onSuccess"
								></vue-upload> -->
							</div>
							<p v-else>{{formMore.spmc}}</p>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<FormItem label="备注：">
							<Input v-if="!isStore" v-model.trim="formDynamic.bz" clearable type="textarea" :rows="4" placeholder="请输入备注内容" :maxlength="300"></Input>
							<p v-else>{{formMore.bz}}</p>
						</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';

	export default {
		props:{
			show:{
				type: Boolean,
				default: false
			},
			isStore: {
				type: Boolean,
				default: false
			},
			sqid: {
				type: String,
				default: ''
			},
			formMore: {
				type: Object,
				default: {}
			},
			videoId:{
				type:String,
				default:''
			},
		},
		components: {
			loadFile
		},
		data() {
			return {
				multiple: false,	// 是否可以上传多个文件
				numbers: 1,			// 最多上传文件个数
				visible: this.show,	// 弹窗的显示和隐藏
				formDynamic: {
					bz: '',			// 备注
					videoFile: '',
				},
				rules: {
					videoFile: [
						{ required: true, message: '请上传视频文件' }
					]
				},
				zwObj: [],
				zjObj: [],
				spFileList:[]
			}
		},
		watch:{
			show(val){
				this.visible = val;
			}
		},
		methods: {
			// 点击确定按钮
            sure(){
				let that = this
            	this.$refs.formDynamicAdd.validate((valid)=>{
	            	if(valid){
						let urls = this.videoId?'/hczz/gl/glsp/updateGlsp':'/hczz/gl/glsp/insertGlsp'
						let glry = {
							sqid: that.$route.query.id,
							bz: that.formDynamic.bz,
							id: this.videoId,
						}

						let attach = [];

						$.each(this.zwObj.fileList,(index,val)=>{
	            			attach.push({
	            				category: val.name.split('.')[1],
	            				filename: val.name.split('.')[0],
	            				minetype: this.zwObj.baseArr[index].split('base64,')[0],
	            				data: this.zwObj.baseArr[index].split('base64,')[1],
	            				type: 0
	            			})
						})
						
	            		$.each(this.zjObj.fileList,(index,val)=>{
	            			attach.push({
	            				category: val.name.split('.')[1],
	            				filename: val.name.split('.')[0],
	            				minetype: this.zjObj.baseArr[index].split('base64,')[0],
	            				data: this.zjObj.baseArr[index].split('base64,')[1],
	            				type: 1
	            			})
						})
						
						let objs = {
	            			glry: glry,
	            			attach: attach,
						}
						
	            		api.api('post', api.configUrl + urls, objs).then(res=>{
							this.$emit('update')
							this.$emit('closeModalHandle');
	            			this.resets();
	            		})
					}
	            })
			},
			// 点击取消按钮
            cancelBtn(){
				this.resets()
				this.$emit('closeModalHandle');
			},
			// 关闭弹窗，重置内容
			resets() {
				this.formDynamic = {
					bz: '',
					videoFile: '',
				}
				this.spFileList = [];
				if(this.$refs.spFile) {
					this.$refs.spFile.obj.fileList = [];
					this.$refs.spFile.obj.baseArr = [];
				}
				this.$refs.formDynamicAdd.resetFields();
			},
			spFile(val){
				this.formDynamic.videoFile = '1'
            	this.zjObj = val;
			},
		}
	};
</script>
<style lang="less" scoped>
	.ivu-form-item {
		margin-left: 0;
	}
	.warn {
		padding-top: 20px;
		.wholeContent {
			height: 100%;
		}
	}
</style>