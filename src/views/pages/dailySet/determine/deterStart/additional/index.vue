<template>
	<div class="addTask">
		<div class="clearfix">
			<Modal v-model="visible" title="补录分配" class="modal-ct" width="900" :styles="{top: '250px',width:'550px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div>
                    <Form ref="approve" :model="formDynamic" :rules="ruleValidate" :label-width="120">
                    	<Row>
                    		<Col span="12">
                    			<FormItem label="选择部门：" prop="blbmid">
						            	<Select v-model="formDynamic.blbmid">
							            	<Option v-for="item in officeList" :value="item.code" :key="item.code">{{item.title}}</Option>
							            </Select>
						        </FormItem>
                    		</Col>
                    		<Col span="12">
                    			<FormItem label="选择人员：" prop="blrid">
						            	<Select v-model="formDynamic.blrid">
							            	<Option v-for="item in userList" :value="item.idCard" :key="item.idCard">{{item.userName}}</Option>
							            </Select>
						        </FormItem>
                    		</Col>
                    	</Row>
                    	<Row>
                    		<Col span="24">
                    			<FormItem label="联系电话：" prop="bllxdh">
						            <Input @on-keyup="inputNumber" v-model.trim="formDynamic.bllxdh" clearable  placeholder="请输入联系电话" :maxlength="11"></Input>
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
			</Modal>
		</div>
	</div>
</template>

<script>
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import {telphoneNumber} from '@/libs/common/check';
	export default {
		components: {
			loadFile
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
				userList:[]
			}
		},
		watch:{
			show(val){
				this.visible=val;
			},
			'formDynamic.blbmid'(val){
				this.getUser(val);
			}
		},
		mounted() {
            this.getOffice();
		},
		methods: {
			// input 输入框只能输入数字
			inputNumber() {
				this.formDynamic.bllxdh = this.formDynamic.bllxdh.replace(/[^\d]/g,'')
			},
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
						$.each(this.userList,(index,val)=>{
							if(this.formDynamic.blrid==val.idCard){
								this.formDynamic.blr=val.userName;
							}
						})
						let sqxx={
							id:this.additionalParams.sqid,
							blbmid:this.formDynamic.blbmid,
							blbmmc:this.formDynamic.blbmmc,
							blrid:this.formDynamic.blrid,
							blr:this.formDynamic.blr,
							bllxdh:this.formDynamic.bllxdh,
							blbz:this.formDynamic.blbz
						};
		        		api.api('post',api.configUrl+'/hczz/za/updateBlfpry',sqxx).then(res=>{
		        			this.$emit('update');
		        			this.formDynamic={
								blbmid:'',
								blbmmc:'',
								blr:'',
								blrid:'',
								bllxdh:'',
								blbz:''
							};
		        		})
					}
				})
				
			},
			getOffice(){
				api.api('post',api.systemUrl+'/office/findOfficeTreeByType').then(res=>{
					this.officeList=res[0].children;
				})
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