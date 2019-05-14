<template>
	<div class="addPhone">
		<div class="clearfix">
			<Modal v-model="visible" title="新增手机号" class="modal-ct" width="650" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<Form ref="formDynamicAdd" :model="formDynamic" :rules="ruleValidate" :label-width="120" class="padding-left-20 padding-right-20">
					<Row>
						<Col span="12">
						<FormItem label="通讯号码：" prop="sjhm">
							<Input v-model.trim="formDynamic.sjhm" clearable  placeholder="请输入通讯号码" :maxlength="11"></Input>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="归属人：" prop="gsr">
							<Input v-model.trim="formDynamic.gsr" clearable  placeholder="请输入归属人" :maxlength="13"></Input>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<FormItem label="归属地：">
							<Input v-model.trim="formDynamic.gsd" clearable type="textarea" :rows="4" placeholder="请输入归属地" :maxlength="133"></Input>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<FormItem label="备注：">
							<Input v-model.trim="formDynamic.bz" clearable type="textarea" :rows="4" placeholder="请输入备注信息" :maxlength="300"></Input>
						</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	</div>
</template>

<script>
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import {telphoneNumber} from '@/libs/common/check.js';
	import $ from 'jquery';
	export default {
		components: {
			loadFile
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			phoneId:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				formDynamic: {
					sjhm: '',
					gsr: '',
					gsd:'',
					bz:''
				},
				ruleValidate: {
					sjhm: [{
						required: true,
						message: '通讯号码不能为空',
						trigger: 'blur'
					},{
						validator:telphoneNumber,
						trigger:'blur',
						message:'请填入正确的通讯号码'
					}],
					gsr: [{
						required: true,
						message: '归属人不能为空',
						trigger: 'blur'
					}]
				},
				visible:this.show
			}
		},
		mounted() {
           
		},
		watch:{
			show(val){
				this.visible=val;
				if(this.phoneId && val){
					this.getDetail();
				}
			}
		},
		methods: {
            sure(){
            	this.$refs.formDynamicAdd.validate((valid)=>{
	            	if(valid){
	            		let urls=this.phoneId?'/hczz/gl/gltxhm/updateGltxhm':'/hczz/gl/gltxhm/insertGltxhm'
	            		let gltxhm={
	            			sjhm:this.formDynamic.sjhm,
	            			gsr:this.formDynamic.gsr,
	            			gsd:this.formDynamic.gsd,
	            			bz:this.formDynamic.bz,
	            			id:this.phoneId,
	            			sqid:this.$store.state.app.deterId
	            		}
	            		api.api('post',api.configUrl+urls,gltxhm).then(res=>{
	            			this.$emit('update');
	            			this.resets();
	            		})
	            	}
	            })
            },
            cancelBtn(){
            	this.$emit('update');
            	this.$refs.formDynamicAdd.resetFields();
            	this.resets();
            },
            resets(){
            	this.formDynamic={
					sjhm: '',
					gsr: '',
					gsd:'',
					bz:''
				}
            	this.$refs.formDynamicAdd.resetFields();
            },
            getDetail(){
            	api.api('post',api.configUrl+'/hczz/gl/gltxhm/getyGltxhmDetail',{id:this.phoneId}).then(res=>{
			        this.formDynamic=res;
			     })
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