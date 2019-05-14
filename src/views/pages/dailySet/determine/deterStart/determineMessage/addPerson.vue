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
						<FormItem label="人员类型：" prop="rylx">
							<Select v-model="formDynamic.rylx">
								<Option v-for="item in list" :key="item.key" :value="item.key">{{item.value}}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="姓名：" prop="xm">
							<Input v-model.trim="formDynamic.xm" clearable  placeholder="请输入姓名" :maxlength="20"></Input>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="证件类型：" prop="zjlx">
							<Select v-model="formDynamic.zjlx">
								<Option v-for="item in zjlxList" :key="item.id" :value="item.id">{{item.title}}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="证件号码：" prop="zjhm">
							<Input v-model.trim="formDynamic.zjhm" clearable  placeholder="请输入证件号码" :maxlength="18"></Input>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="户籍地：">
							<Input v-model.trim="formDynamic.hjdz" clearable  placeholder="请输入户籍地址" :maxlength="18"></Input>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="民族：">
							<Select v-model="formDynamic.mz">
								<Option v-for="item in mzList" :key="item.id" :value="item.id">{{item.title}}</Option>
							</Select>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="性别：">
							<RadioGroup v-model="formDynamic.xb">
				                <Radio label="1">男</Radio>
				                <Radio label="2">女</Radio>
				            </RadioGroup>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="联系电话：" prop="lxfs">
							<Input v-model.trim="formDynamic.lxfs" clearable  placeholder="请输入联系电话" :maxlength="11"></Input>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="指纹：">
							<loadFile @on-change="zwFile" ref="zwFile"></loadFile>
							<a v-for='item in zjFileList' class="zjfiled">
								<span>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
							</a>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="足迹：">
							<loadFile @on-change="zjFile" ref="zjFile"></loadFile>
							<a v-for='item in zzjFileList' class="zjfiled">
								<span>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
							</a>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<FormItem label="DNA：">
							<Input v-model.trim="formDynamic.dna" clearable  placeholder="请输入DNA" :maxlength="40"></Input>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<FormItem label="体貌特征：" prop="tmtz">
							<Input v-model.trim="formDynamic.tmtz" clearable type="textarea" :rows="4" placeholder="请输入体貌特征" :maxlength="300"></Input>
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
	import {telphoneNumber,validateNameExsitAdd} from '@/libs/common/check.js';
	export default {
		components: {
			loadFile
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			personId:{
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
					rylx: '',
					xm: '',
					zjlx:'',
					zjhm:'',
					hjdz:'',
					mz:'',
					xb:'',
					lxfs:'',
					dna:'',
					tmtz:''
				},
				ruleValidate: {
					rylx: [{
						required: true,
						message: '人员类型不能为空',
						trigger: 'blur'
					}],
					xm: [{
						required: true,
						message: '姓名不能为空',
						trigger: 'blur'
					}],
					zjlx: [{
						required: true,
						message: '证件类型不能为空',
						trigger: 'blur'
					}],
					zjhm: [{
						required: true,
						message: '证件号码不能为空',
						trigger: 'blur'
					},{
						validator:validateNameExsitAdd
					}],
					tmtz: [{
						required: true,
						message: '体貌特征不能为空',
						trigger: 'blur'
					}],
					lxfs:[{
						message:'请输入正确的手机号',
						validator:telphoneNumber
					}]
				},
				visible:this.show,
				zwObj:[],
				zjObj:[],
				list:[{
					key:'0',
					value:'犯罪嫌疑人'
				},{
					key:'1',
					value:'受害人'
				}],
				zjlxList:[],
				mzList:[],
				zjFileList:[],
				zzjFileList:[]
			}
		},
		mounted() {
           this.getZjlx();//获取证件类型
           this.getMz();//获取民族
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
	            			rylx:this.formDynamic.rylx,
	            			xm:this.formDynamic.xm,
	            			zjlx:this.formDynamic.zjlx,
	            			zjhm:this.formDynamic.zjhm,
	            			hjdz:this.formDynamic.hjdz,
	            			mz:this.formDynamic.mz,
	            			xb:this.formDynamic.xb,
	            			lxfs:this.formDynamic.lxfs,
	            			dna:this.formDynamic.dna,
	            			tmtz:this.formDynamic.tmtz,
							//sqid:this.$store.state.app.deterId,
							sqid: this.sqid,
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
							this.$emit('closeModal')
	            			this.resets();
	            		})
	            	}
	            })
            },
            zwFile(val){
            	this.zwObj=val;
            },
            zjFile(val){
            	this.zjObj=val;
            },
            resets(){
            	this.formDynamic={
					rylx: '',
					xm: '',
					zjlx:'',
					zjhm:'',
					hjdz:'',
					mz:'',
					xb:'',
					lxfs:'',
					dna:'',
					tmtz:''
				}
				this.$refs.zwFile.obj.fileList=[];
				this.$refs.zwFile.obj.baseArr=[];
				this.$refs.zjFile.obj.fileList=[];
				this.$refs.zjFile.obj.baseArr=[];
				this.$refs.formDynamicAdd.resetFields();
				this.zjFileList=[];
				this.zzjFileList=[];
            },
            getDetail(){
            	return api.api('post',api.configUrl+'/hczz/gl/glry/getGlryDetail',{id:this.personId}).then(res=>{
			        this.formDynamic=res;
			     })
            },
            getZwFile(){
            	api.api('post',api.configUrl+'/hczz/fj/getFjData',{
            		glid:this.formDynamic.id,
            		tablename:'T_HCZZ_GLRY',
            		type:0
            	}).then(res=>{
            		this.zjFileList=res;
            		$.each(res,(val)=>{
            			this.$refs.zwFile.fileList.push(val.filename);
            			this.$refs.zwFile.baseArr.push(val.filename);
					})
            		
            	})
            },
            getZjFile(){
            	api.api('post',api.configUrl+'/hczz/fj/getFjData',{
            		glid:this.formDynamic.id,
            		tablename:'T_HCZZ_GLRY',
            		type:1
            	}).then(res=>{
            		this.zzjFileList=res;
            		$.each(res,(val)=>{
            			this.$refs.zjFile.fileList.push(val.filename);
            			this.$refs.zjFile.baseArr.push(val.filename);
            		})
            		
            	})
            },
            cancelBtn(){
            	this.$emit('closeModal');
            	this.resets();
            	this.$refs.formDynamicAdd.resetFields();
            },
            getZjlx(){
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=JMSFZZZLXDM').then(res=>{
			        this.zjlxList=res;
			     })
            },
            getMz(){
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00011').then(res=>{
			        this.mzList=res;
			     })
            },
            async init(){
            	await this.getDetail();
            	this.getZwFile();
            	this.getZjFile()
            }
		}
	};
</script>
<style lang="less" scoped>
	.warn {
		padding-top: 20px;
		.wholeContent {
			height: 100%;
		}
	}
	.ivu-form-item-content {
		.zjfiled {
			cursor: default;
			display: block;
		}
	}
</style>