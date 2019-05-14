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
					            <Select  v-model="formDynamic.blbmid" filterable>
					            	<Option  v-for="item in officeList" :key="item.code" :value="item.code">{{item.simpleName}}</Option>
					            </Select>
					        </FormItem>
				        </Col>
				        <Col span="12" class="uses">
				        	<FormItem label="选择人员" prop="blrid" >
					             <Select v-model="formDynamic.blrid" filterable>
					            	<Option  v-for="item in userList" :key="item.idCard" :value="item.idCard">{{item.userName}}</Option>
					            </Select>
					        </FormItem>
				        </Col>
			        </Row>
			        <FormItem label="联系电话" prop="bllxdh">
			            <Input v-model.trim="formDynamic.bllxdh" clearable   placeholder="请输入联系电话" :maxlength="11">{{columnsDataone.bllxdh}}</Input>
			        </FormItem>
			        <FormItem label="备注" prop="blbz">
			            <Input v-model.trim="formDynamic.blbz" clearable type="textarea" :rows="4" placeholder="请输入备注信息" :maxlength="120"></Input>
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
	import {telphoneNumber} from '@/libs/common/check.js';
	export default {
		components: {
			Upload,
			handle,
			detail
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
				userList:[],
				params:{},
				columnsDataone:[],
				fncHandel:null,
				fncDetail:null
			}
		},
		computed:{
			title(){
				return this.rowObj.ajmc
			}
		},
		created(){
			this.fncDetail=this.fncHandle=this.getDetail();
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
	            		let sqxx={
	            			id:this.rowObj.id,
	            			blbmmc:this.formDynamic.blbmmc,
	            			blr:this.formDynamic.blr,
	            			bllxdh:this.formDynamic.bllxdh,
	            			blbz:this.formDynamic.blbz,
	            			blrid:this.formDynamic.blrid,
	            			blbmid:this.formDynamic.blbmid
	            		}
	            		api.api('post',api.configUrl+'/hczz/za/updateBlfpry',sqxx).then(res=>{
	            			this.$emit('update','a');
				            this.$refs.approve.resetFields();
				            this.columnsDataone=res
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
            resets(){
            	this.formDynamic={
					blbmmc: '',
					blr: '',
					bllxdh:'',
					blbz:''
				};
            }
		}
	};
</script>
<style lang="less">
	
</style>