<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div  style="height: 450px;overflow: auto;">
					<el-tabs v-model="activeName"  @tab-click="handleClick" style="height: 450px;">
						<el-tab-pane label="流程轨迹" name="handle">
							<handle :fncHandle="fncHandle"></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="evaluates">
                    <Form ref="approve" :model="formDynamic" :rules="ruleValidate" :label-width="120">
			        <Row>
			        	<Col span="12">
				        	<FormItem label="选择部门" prop="blbmid" >
				        		<Button @click="handleReceiveOffice">选择</Button>
							    <el-input v-if="false" v-model.trim="formDynamic.blbmid" :rows="1" size="small"></el-input>
							    <el-tag  v-for="(tag,index) in receiveOfficeArr" :key="tag.title" closable type="info" @close="delectReceiveArr(index)">{{tag.title}}</el-tag>
					            <!--<Select  v-model="formDynamic.blbmid" filterable>
					            	<Option  v-for="item in officeList" :key="item.code" :value="item.code">{{item.simpleName}}</Option>
					            </Select>-->
					        </FormItem>
				        </Col>
				        <Col span="12" class="uses">
				        	<FormItem label="选择人员" prop="blrid" >
					             <Select v-model="formDynamic.blrid" filterable>
					            	<Option  v-for="item in userList" :key="item.id" :value="item.id">{{item.userName}}</Option>
					            </Select>
					        </FormItem>
				        </Col>
			        </Row>
			        <FormItem label="联系电话" prop="bllxdh">
			            <el-input v-model.trim="formDynamic.bllxdh" disabled    :maxlength="11"></el-input>
			        </FormItem>
			        <FormItem label="备注" prop="blbz">
			            <Input v-model.trim="formDynamic.blbz" clearable type="textarea" :rows="4" placeholder="请输入备注信息" :maxlength="120"></Input>
			        </FormItem>
			        </Form>
				</div>
				<div>
					<receive-office :show.sync="isReceive"  @handleOffice="handleOffice"></receive-office>
				</div>
			</Modal>
			
		</div>
	</div>
</template>

<script>
	import Upload from '@/views/main-components/file-upload/fileUpload.vue';
	import receiveOffice from "./receiveOffice.vue";
	import api from '@/fetch/api';
	import detail from './detail';
	import handle  from './handle';
	import {telphoneNumber} from '@/libs/common/check.js';
	export default {
		components: {
			Upload,
			handle,
			detail,
			receiveOffice
		},
		props: {
			show:{
				type:Boolean,
				default:false
			},
			rowObj:{
				type:Object,
				default:()=>{
					return {}
				}
			}
		},
		data() {
			return {
				activeName: 'handle',
				visible:this.show,
				formDynamic:{
					blbmmc:'',
					blbmid:'',
					blrid:'',
					blr:'',
					bllxdh:'',
					blbz:''
				},
				ruleValidate:{
					blbmid:[{
						required:true,
						trigger:'blur',
						message:'请选择部门'
					}],
					blrid:[{
						required:true,
						trigger:'blur',
						message:'请选择人员'
					}],
					blbz:[{
						required:true,
						trigger:'blur',
						message:'请输入备注信息'
					}],
					bllxdh:[{
						validator:telphoneNumber
					}]
				},
				officeList:[],
				userList:[],//人员数组
				params:{},
				columnsDataone:[],
				fncHandel:null,
				fncDetail:null,
				isReceive:false,//接收单位弹窗
				receiveOfficeArr:[],//已选接收单位部门数组
			}
		},
		computed:{
			title(){
				return '编号：'+this.rowObj.sqwh
			}
		},
		created(){
			this.fncDetail=this.getDetail();
			this.fncHandle=this.getFlow();
			this.fncDetail.then(res=>{
				this.detail=res.sqxx;
			})
		},
		mounted() {
                this.render();
		},
		watch:{
			show(val){
				this.visible=val;
			},
			'formDynamic.blbmid'(val){
				api.api('get',api.systemUrl+'/account/info/queryPage2?officeCode='+val+'&pageSize=1000000&pageNum=1').then(res=>{
                    this.userList=res.list;
				})
			},
			'formDynamic.blrid'(val){
				let arr=this.userList.filter(item=>{
					return item.id==val
				})
				this.formDynamic.blr=arr[0].userName;
				this.formDynamic.bllxdh=arr[0].phone
			}
		},
		methods: {
			render(){
				api.api('post',api.systemUrl+'/office/findOfficeTreeByType').then(res=>{
					this.officeList=res;
				})
			},
			changeData(val){
				api.api('get',api.systemUrl+'/account/info/queryPage2?officeCode='+val+'&pageSize=1000000&pageNum=1').then(res=>{
                    this.userList=res.list;
				})
			},
			handleClick(tab, event) {

			},
			cancelBtn(){
				this.$emit('update');
				this.$refs.approve.resetFields();
			},
			sure(){
				this.$refs.approve.validate((valid)=>{
	            	if(valid){
	            		let obj={};
	            		obj.sqid=this.rowObj.id;
                        obj.bz=this.formDynamic.blbz;
	            		obj.blrwList=[{
	            			blbm:this.formDynamic.blbmmc,
	            			blr:this.formDynamic.blr,
	            			blrdh:this.formDynamic.bllxdh,
	            			blrid:this.formDynamic.blrid,
	            			bmbh:this.formDynamic.blbmid
	            		}]
	            		api.api('post',api.configUrl+'/hczz/hc/blrw/insertBlrw',obj).then(res=>{
	            			this.$message.success('分配成功')
	            			this.$emit('update','a');
				            this.$refs.approve.resetFields();
	            		})
	            	};
	           })
			},
			getDetail() {
				return new Promise((resolve,reject)=>{
					api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {id: this.rowObj.id}).then(res => {
						resolve(res)
					})
				})
			},
			getFlow(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/za/getFlow/'+this.rowObj.id+'?type=0').then(res=>{
						if(res){
							resolve(res)
						}
					})
				})
			},
            resets(){
            	this.formDynamic={
					blbmmc: '',
					blr: '',
					bllxdh:'',
					blbz:''
				};
            },
            handleOffice(val){//接收单位
            	this.receiveOfficeArr = val;
            	console.log(val)
            	this.formDynamic.blbmid=this.receiveOfficeArr[0].code;
            	this.formDynamic.blbmmc=this.receiveOfficeArr[0].title;
            },
            delectReceiveArr(index){//刪除已选的部门
            	this.receiveOfficeArr.splice(index, 1);
            	this.formDynamic.blbmid=null;
            	this.formDynamic.blrid=null;
            },
            handleReceiveOffice(){//点击弹出选择部门弹窗
            	this.isReceive=true;
            }
		}
	};
</script>
<style lang="less">
	
</style>