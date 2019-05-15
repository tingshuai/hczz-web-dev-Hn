<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" v-show="!disabled" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div  style="height: 500px;">
					<el-tabs v-model="activeName"  @tab-click="handleClick" style="height: 450px;">
						<el-tab-pane label="研判结果" name="result">
							<result :fncResult="fncResult"></result>
						</el-tab-pane>
						<el-tab-pane label="流程轨迹" name="handle">
							<handle :fncHandle='fncHandle'></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="evaluates">
                    <Form ref="approve" :model="formDynamic" :rules="ruleValidate" :label-width="120">
                    <FormItem label="服务态度" >
			            <el-rate v-model="formDynamic.fwtd" :disabled="disabled"></el-rate>
			        </FormItem>
			        <FormItem label="反馈速度">
			            <el-rate v-model="formDynamic.fksu" :disabled="disabled"></el-rate>
			        </FormItem>
			        <FormItem label="反馈效果">
			            <el-rate v-model="formDynamic.yyxg" :disabled="disabled"></el-rate>
			        </FormItem>
			        <Row>
			        	<Col span="12">
				        	<FormItem label="是否破案">
					             <RadioGroup v-model="formDynamic.sfpa">
					                <Radio label="1" :disabled="disabled">是</Radio>
					                <Radio label="2" :disabled="disabled">否</Radio>
					            </RadioGroup>
					        </FormItem>
				        </Col>
				        <Col span="12" class="uses">
				        	<FormItem label="是否发挥作用">
					             <RadioGroup v-model="formDynamic.sffhzy">
					                <Radio label="1" :disabled="disabled">是</Radio>
					                <Radio label="2" :disabled="disabled">否</Radio>
					            </RadioGroup>
					        </FormItem>
				        </Col>
			        </Row>
			        <FormItem label="抓获人数" prop="zhrs">
			            <Input v-model.trim="formDynamic.zhrs" :clearable="clearable"   placeholder="请输入抓获人数" :maxlength="10" :readonly="disabled"></Input>
			        </FormItem>
			        <FormItem label="综合内容评价" prop="zhpjnr">
			            <Input v-model.trim="formDynamic.zhpjnr" clearable type="textarea" :rows="4" placeholder="请输入综合内容评价" :maxlength="120" :readonly="disabled"></Input>
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
				formDynamic:{
					fwtd:0,//服务态度
					fksu:0,//反馈速度
					yyxg:0,//反馈效果
					sfpa:'',//是否破案
					sffhzy:'',//是否发挥作用
					zhrs:'',//抓获人数
					zhpjnr:'',//综合评价内容
					sqid:this.rowObj.id
				},
				ruleValidate:{
					zhpjnr:[{
						required:true,
						message:'综合评价内容不能为空',
						trigger:'blur'
					}],
					zhrs:[{
						validator:isNumber
					}]
				},
				detail:{},
				columnsDataone:[],
				fncHandel:null,//处理流程的Promise对象
				fncDetail:null,//详细信息的Promise对象
				fncResult:null,//反馈结果的Promise对象
				disabled:false,//是否评价过
				clearable:true
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
				return this.rowObj.sqwh
			}
		},
		mounted() {
            if(this.rowObj.zt>4){
            	this.getPjDetail();
            	this.clearable=false;
            }else{
            	this.disabled=false;
            }
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
				this.$refs.approve.resetFields();
			},
		    getDetail(){//获取详细信息
				return new Promise((resolve,reject)=>{
					api.api('post',api.configUrl+'/hczz/za/getSqxxXx',{id:this.rowObj.id}).then(res=>{
					    resolve(res)
				    })
				})
			},
			sure(){
				this.$refs.approve.validate((valid)=>{
	            	if(valid){
	            		api.api('post',api.configUrl+'/hczz/hc/pj/addPj',this.formDynamic).then(res=>{
	            			this.$emit('update','a');
	            			this.$refs.approve.resetFields();
	            		})
	            	}
	           })
			},
            resets(){
            	this.formDynamic={
					fwtd:0,
					fksu:0,
					yyxg:0,
					sfpa:'',
					sffhzy:'',
					zhrs:"",
					zhpjnr:''
				};
            },
            getFlow(){//获取审批流程
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/za/getFlow/'+this.rowObj.id+'?type=0').then(res=>{
						if(res){
							resolve(res)
						}
					})
				})
			},
			getPjDetail(){//获取评价信息
				api.api('post',api.configUrl+'/hczz/hc/pj/getPjDetal',{
					id:this.rowObj.id
				}).then(res=>{
					this.formDynamic=res[0];
					this.disabled=true;
				})
			}
		}
	};
</script>
<style lang="less">
	
</style>