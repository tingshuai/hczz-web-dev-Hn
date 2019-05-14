<template>
	<div class="addTask">
		<div class="clearfix">
			<Modal v-model="visible" title="补录分配" class="modal-ct" width="700" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div>
                    <Form ref="approve" :model="formDynamic" :rules="ruleValidate" :label-width="120">
                    	<Row>
                    		<Col span="12">
                    			<FormItem label="选择部门：" prop="blbmid">
                    				<Button @click="handleReceiveOffice">选择</Button>
								    <el-input v-if="false" v-model.trim="formDynamic.blbmid" :rows="1" size="small"></el-input>
								    <el-tag  v-for="(tag,index) in receiveOfficeArr" :key="tag.title" closable type="info" @close="delectReceiveArr(index)">{{tag.title}}</el-tag>
						            	<!--<Select v-model="formDynamic.blbmid">
							            	<Option v-for="item in officeList" :value="item.code" :key="item.code">{{item.title}}</Option>
							            </Select>-->
						        </FormItem>
                    		</Col>
                    		<Col span="12">
                    			<FormItem label="选择人员：" prop="blrid">
						            	<Select v-model="formDynamic.blrid">
							            	<Option v-for="item in userList" :value="item.id" :key="item.id">{{item.userName}}</Option>
							            </Select>
						        </FormItem>
                    		</Col>
                    	</Row>
                    	<Row>
                    		<Col span="24">
                    			<FormItem label="联系电话：" prop="bllxdh">
						            	<Input v-model.trim="formDynamic.bllxdh" disabled placeholder="请输入联系电话" :maxlength="11"></Input>
						        </FormItem>
                    		</Col>
                    	</Row>
                    	<Row>
                    		<Col span="24" prop="bz"> 
                    			<FormItem label="备注：">
						            	<Input v-model.trim="formDynamic.blbz" clearable type="textarea" :rows="4" placeholder="请输入备注" :maxlength="120"></Input>
						        </FormItem>
                    		</Col>
                    	</Row>
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
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import receiveOffice from "@/views/pages/specialSet/distribution/receiveOffice.vue";
	import {telphoneNumber} from '@/libs/common/check';
	export default {
		components: {
			loadFile,
			receiveOffice
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			additionalParams:{
				type:Object,
				default:{}
			}
		},
		data() {
			return {
				visible:this.show,
				formDynamic:{
					blbmid:'',
					blbmmc:'',
					blr:'',
					blrid:'',
					bllxdh:'',
					blbz:''
				},
				ruleValidate:{
					blbmid:[{
						required:true,
						message:'部门不能为空',
						trigger:'blur'
					}],
					blrid:[{
						required:true,
						message:'人员不能为空',
						trigger:'blur'
					}],
					blbz:[{
						required:true,
						message:'备注不能为空',
						trigger:'blur'
					}],
					bllxdh:[{
						validator:telphoneNumber,
						trigger:'blur'
					}]
				},
				officeList:[],
				userList:[],
				isReceive:false,//接受部门弹框显示
				receiveOfficeArr:[]//已选择部门的数组
			}
		},
		watch:{
			show(val){
				this.visible=val;
			},
			'formDynamic.blbmid'(val){
				if(val){
					this.getUser(val);
				}
			},
			'formDynamic.blrid'(val){
				if(val){
					let arr=this.userList.filter(item=>{
						return item.id==val
					})
					this.formDynamic.blr=arr[0].userName;
					this.formDynamic.bllxdh=arr[0].phone;
				}
			}
		},
		mounted() {
            
		},
		methods: {
			cancelBtn(){
				this.$emit('update');
				this.$refs.approve.resetFields();
				this.resets();
			},
			sure(){
				this.$refs.approve.validate((valid)=>{
					if(valid){
						$.each(this.officeList,(index,val)=>{
							if(this.formDynamic.blbmid==val.code){
								this.formDynamic.blbmmc=val.title;
							}
						})
						let obj={};
						obj.sqid=this.additionalParams.sqid;
                        obj.bz=this.formDynamic.blbz;
	            		obj.blrwList=[{
	            			blbm:this.formDynamic.blbmmc,
	            			blr:this.formDynamic.blr,
	            			blrdh:this.formDynamic.bllxdh,
	            			blrid:this.formDynamic.blrid,
	            			bmbh:this.formDynamic.blbmid
	            		}]
		        		api.api('post',api.configUrl+'/hczz/hc/blrw/insertBlrw',obj).then(res=>{
		        			this.$message.success('分配成功');
		        			this.$emit('update');
		        			this.resets();
		        		})
					}
				})
				
			},
			handleReceiveOffice(){//点击弹出选择部门弹窗
            	this.isReceive=true;
            },
            handleOffice(val){//接收单位
            	this.receiveOfficeArr = val;
            	this.formDynamic.blbmid=this.receiveOfficeArr[0].code;
            	this.formDynamic.blbmmc=this.receiveOfficeArr[0].title;
            },
            delectReceiveArr(index){//刪除已选的部门
            	this.receiveOfficeArr.splice(index, 1);
            	this.formDynamic.blbmid=null;
            	this.formDynamic.blrid=null;
            	this.formDynamic.bllxdh=null;
            	this.userList=[];
            },
			getUser(val){
				api.api('get',api.systemUrl+'/account/info/queryPage?officeCode='+val+'&pageSize=1000000&pageNum=1').then(res=>{
                    this.userList=res.list;
				})
			},
            resets(){
            	this.formDynamic={
					blbmid:'',
					blbmmc:'',
					blr:'',
					blrid:'',
					bllxdh:'',
					blbz:''
				};
				this.userList=[];
				this.receiveOfficeArr=[];
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