<template>
	<div class="addCar">
		<div class="clearfix">
			<Modal v-model="visible" title="新增关联车" class="modal-ct" width="700" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<Form ref="formDynamicAdd" :model="formDynamic" :rules="ruleValidate" :label-width="120" class="padding-left-20 padding-right-20">
					<Row>
						<Col span="12">
						<FormItem label="号牌号码：" prop="hpph">
							<Input v-model.trim="formDynamic.hpph" clearable  placeholder="请输入号牌号码" :maxlength="20"></Input>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="号牌种类：" prop="hpzl">
							<Select v-model="formDynamic.hpzl" filterable>
								<Option v-for="item in hpzlList" :key="item.id" :value="item.id">{{item.title}}</Option>
							</Select>
						</FormItem>
						</Col>
						
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="车辆类型：" prop="cllx">
							<Select v-model="formDynamic.cllx" filterable>
								<Option v-for="item in cllxList" :key="item.id" :value="item.id">{{item.title}}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="车身颜色：" prop="csys">
							<Select v-model="formDynamic.csys" filterable>
								<Option v-for="item in csysList" :key="item.id" :value="item.id">{{item.title}}</Option>
							</Select>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="车主：">
							<Input v-model.trim="formDynamic.cz" clearable  placeholder="请输入车主" :maxlength="13"></Input>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="联系方式：" prop="lxfs">
							<Input v-model.trim="formDynamic.lxfs" clearable  placeholder="请输入联系方式" :maxlength="11"></Input>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
						<FormItem label="备注：" prop="bz">
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
	import {telphoneNumber} from '@/libs/common/check.js';
	export default {
		components: {
			loadFile
		},
		props:{
			carId:{
				type:String,
				default:''
			},
			show:{
				type:Boolean,
				default:false
			},
			sqid: {
				type:String,
				default:''
			}
		},
		data() {
			return {
				formDynamic: {
					hpph: '',
					hpzl: '',
					cllx:'',
					csys:'',
					cz:'',
					lxfs:'',
					bz:''
				},
				ruleValidate: {
					hpph: [{
						required: true,
						message: '号牌号码不能为空',
						trigger: 'blur'
					}],
					hpzl: [{
						required: true,
						message: '号牌种类不能为空',
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
				hpzlList:[],//号牌种类
				cllxList:[],//车辆类型
				csysList:[],//车身颜色
			}
		},
		mounted() {
           this.getHpzl();//获取号牌种类
           this.getCllx();//获取车辆类型
           this.getCsys();//获取车身颜色
		},
		watch:{
			show(val){
				this.visible=val;
				if(this.carId && val){
					this.getDetail();
				}
			}
		},
		methods: {
            sure(){
            	this.$refs.formDynamicAdd.validate((valid)=>{
	            	if(valid){
	            		let urls=this.carId?'/hczz/gl/glcl/updateGlcl' :'/hczz/gl/glcl/insertGlcl';
	            		let glcl={
	            			hpph:this.formDynamic.hpph,
	            			hpzl:this.formDynamic.hpzl,
	            			cllx:this.formDynamic.cllx,
	            			csys:this.formDynamic.csys,
	            			cz:this.formDynamic.cz,
	            			lxfs:this.formDynamic.lxfs,
	            			bz:this.formDynamic.bz,
							//sqid:this.$store.state.app.deterId,
							sqid: this.sqid,
	            			id:this.carId
	            		}
	            		api.api('post',api.configUrl+urls,glcl).then(res=>{
	            			this.resets();
							this.$emit('update')
							this.$emit('closeModal')
	            		})
	            	}
	            })
            },
            cancelBtn(){
            	this.$emit('closeModal');
            	this.$refs.formDynamicAdd.resetFields();
            	this.resets();
            },
            getHpzl(){
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00306').then(res=>{
			        this.hpzlList=res;
			     })
            },
            getCllx(){
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00303').then(res=>{
			        this.cllxList=res;
			     })
            },
            getCsys(){
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00308').then(res=>{
			        this.csysList=res;
			     })
            },
            getDetail(){
            	api.api('post',api.configUrl+'/hczz/gl/glcl/getGlclDetail',{id:this.carId}).then(res=>{
			        this.formDynamic=res;
			     })
            },
            resets(){
            	this.formDynamic={
					hpph: '',
					hpzl: '',
					cllx:'',
					csys:'',
					cz:'',
					lxfs:'',
					bz:''
				}
            	this.$refs.formDynamicAdd.resetFields();
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
</style>