<template>
	<div class="addDummy">
		<div class="clearfix">
			<Modal v-model="visible" title="新增虚拟号" class="modal-ct" width="600" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<Form ref="formDynamicAdd" :model="formDynamic" :rules="ruleValidate" :label-width="120" class="padding-left-20 padding-right-20">
					<Row>
						<Col span="12">
						<FormItem label="身份类型：" prop="sflx">
							<Input v-model.trim="formDynamic.sflx" clearable  placeholder="请输入身份类型" :maxlength="10"></Input>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="虚拟号码：" prop="xyhm">
							<Input v-model.trim="formDynamic.xyhm" clearable  placeholder="请输入虚拟号码" :maxlength="18"></Input>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<FormItem label="昵称：">
							<Input v-model.trim="formDynamic.nc" clearable type="textarea" :rows="4" placeholder="请输入昵称" :maxlength="10"></Input>
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
			dummyId:{
				type:String,
				default:''
			},
			sqid: {
				type:String,
				default:''
			}
		},
		data() {
			return {
				formDynamic: {
					sflx: '',
					xyhm: '',
					nc:'',
					bz:''
				},
				ruleValidate: {
					sflx: [{
						required: true,
						message: '身份类型不能为空',
						trigger: 'blur'
					}],
					xyhm: [{
						required: true,
						message: '虚拟号码不能为空',
						trigger: 'blur'
					}]
				},
				visible:this.show,
				list:[{
					key:'0',
					value:'犯罪嫌疑人'
				},{
					key:'1',
					value:'受害人'
				}]
			}
		},
		watch:{
			show(val){
				this.visible=val;
				if(val && this.dummyId){
					this.getDetail();
				}
			}
		},
		methods: {
            sure(){
            	this.$refs.formDynamicAdd.validate((valid)=>{
	            	if(valid){
	            		let urls=this.dummyId?'/hczz/gl/glxnsf/updateGlxnsf':'/hczz/gl/glxnsf/insertGlxnsf'
	            		let glxnsf={
	            			sflx:this.formDynamic.sflx,
	            			xyhm:this.formDynamic.xyhm,
	            			nc:this.formDynamic.nc,
	            			bz:this.formDynamic.bz,
							//sqid:this.$store.state.app.deterId,
							sqid: this.sqid,
	            			id:this.dummyId
	            		}
	            		api.api('post',api.configUrl+urls,glxnsf).then(res=>{
							this.$emit('update');
							this.$emit('closeModal');
	            			this.resets();
	            		})
	            	}
	            })
            },
            getDetail(){
            	api.api('post',api.configUrl+'/hczz/gl/glxnsf/getGlxnsfDetail',{id:this.dummyId}).then(res=>{
			        this.formDynamic=res;
			     })
            },
            cancelBtn(){
            	this.$emit('closeModal');
            	this.$refs.formDynamicAdd.resetFields();
            	this.resets();
            	
            },
            resets(){
            	this.formDynamic={
					sflx: '',
					xnhm: '',
					nc:'',
					bz:''
				}
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