<template>
	<div class="addTask">
		<div class="clearfix">
			<Modal v-model="visible" title="新增下级任务" class="modal-ct" width="900" :styles="{top: '250px',width:'550px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div>
					<Form ref="approve" :model="formDynamic" :rules="ruleValidate" :label-width="120">
						<FormItem label="分配给：" prop="bmbh" class="newTaskForm">
							<div v-if="rwjb==0">
								<Col span="11">
								<Select v-model="formDynamic.bmbh">
									<Option v-for="item in officeList" :value="item.officecode" :key="item.officecode">{{item.officename}}</Option>
								</Select>
								</Col>
								<Col span="11" class="margin-left-20">
								<Select v-model="formDynamic.sqrid">
									<Option v-for="item in userList" :value="item.userid" :key="item.userid">{{item.xm}}</Option>
								</Select>
								</Col>
							</div>
							<div v-else>
								<Col span="11">
								<Select v-model="formDynamic.bmbh">
									<Option v-for="item in officeList" :value="item.officecode" :key="item.officecode">{{item.officename}}</Option>
								</Select>
								</Col>
								<Col span="11" class="margin-left-20">
								<Select v-model="formDynamic.sqrid">
									<Option v-for="item in userList1" :value="item.id" :key="item.id">{{item.userName}}</Option>
								</Select>
								</Col>
							</div>
						</FormItem>
						<FormItem label="简要任务内容" prop="rwnr">
							<Input v-model.trim="formDynamic.rwnr" clearable type="textarea" :rows="4" placeholder="请输入反馈内容" :maxlength="120"></Input>
						</FormItem>
						<FormItem label="附件">
							<loadFile @on-change="proceduresFiles" ref="proceduresFiles"></loadFile>
						</FormItem>
					</Form>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import { uniqueArr } from '@/libs/common/common';
	export default {
		components: {
			loadFile
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			params: {
				type: Object,
				default: {}
			}
		},
		data() {
			const bmbhValid=(rule,value,callback)=>{
				if(value=='' || this.formDynamic.sqrid==''){
					 callback('部门和人员不能为空')
				}
				return callback()
			}
			return {
				visible: this.show,
				rwjb: this.params.rwjb,
				formDynamic: {
					rwnr: '',
					fjid: '',
					bmbh: '',
					bmmc: '',
					sqr: '',
					sqrid: ''
				},
				ruleValidate: {
					rwnr: [{
						required: true,
						message: '简要内容不能为空',
						trigger: 'blur'
					}],
					bmbh: [{
						validator: bmbhValid
					}]
				},
				list: [1, 2, 3],
				officeList: [],
				userList: [],//副组长
				userList1: [],//组员
				proceduresObj: {},
				dataList: [],
				firstLeader:{}//组长
			}
		},
		watch: {
			show(val) {
				this.visible = val;
			},
			'formDynamic.bmbh' (val) {
				$.each(this.dataList, (index, value) => {
					this.formDynamic.bmmc = value.officename;
				})
				if(this.rwjb == 0) {//任务级别为0 即第一层任务时，只能派发给副组长，即小组管理设置的副组长
					this.getUser(val)
				} else {//第二层任务时，只能派发给改副组长部门下除去副组长 组长以外的所有其他成员
					api.api('get', api.systemUrl + '/account/info/queryPage?pageNum=1&pageSize=100000&officeCode=' + val).then(res => {
						this.userList1 = res.list.filter(item=>{
							return item.id!=this.params.zxrid && item.id!=this.firstLeader.userid
						});
					})
				}

			},
			'formDynamic.sqrid' (val) {
				if(this.rwjb == 0){//第一层任务，取执行人的姓名
					this.formDynamic.sqr=this.userList.filter(item=>{
						return val==item.userid
					})[0].xm
				}else{//第二层任务时，去执行人的姓名
					this.formDynamic.sqr=this.userList1.filter(item=>{
						return val==item.id
					})[0].userName
				}
				
			},
			params(val) {
				this.rwjb = val.rwjb;
				this.getOffice();
				if(val.rwjb == 1) {
					this.formDynamic.bmbh = val.bmbh;
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getOffice();
				this.getMember();
			})
		},
		methods: {
			cancelBtn() {
				this.$emit('update');
				this.resets();
			},
			sure() {
				this.$refs.approve.validate((valid) => {
					if(valid) {
						$.each(this.officeList, (index, val) => {
							if(this.formDynamic.bmbh == val.code) {
								this.formDynamic.bmmc = val.title;
							}
						})
						let rwfp = {
							zaid: this.params.zaid,
							rwnr: this.formDynamic.rwnr,
							sqid: this.params.sqid,
							rwjb: (Number(this.params.rwjb) + 1) + '',
							fjid: this.params.id,
							zxr: this.formDynamic.sqr,
							zxrid: this.formDynamic.sqrid,
							bmmc: this.formDynamic.bmmc,
							bmbh: this.formDynamic.bmbh,
							sqlx:'0'
						};
						let attach = [];
						$.each(this.proceduresObj.fileList, (index, val) => {
							attach.push({
								category: val.name.split('.')[1],
								filename: val.name.split('.')[0],
								minetype: this.proceduresObj.baseArr[index].split('base64,')[0],
								data: this.proceduresObj.baseArr[index].split('base64,')[1],
								type: 0
							})
						})
						let objs = {
							rwfp: rwfp,
							attach: attach
						}
						api.api('post', api.configUrl + '/hczz/za/insertRw', objs).then(res => {
							this.$message.success('新增下级任务成功')
							this.$emit('update');
							this.resets();
						})
					}
				})
			},
			getOffice() {
				let obj = {
					zaid: this.params.zaid
				}
				api.api('post', api.configUrl + '/hczz/zaz/getZazFzzDetail', obj).then(res => {
					this.dataList = res;
					if(this.rwjb==0){
						this.officeList = uniqueArr(res, 'officecode');
					}else{
						this.officeList=uniqueArr(res, 'officecode').filter(item=>{
							return item.userid==this.params.zxrid
						})
						this.formDynamic.bmbh = this.officeList[0].officecode
					}
				})
			},
			getUser(val) {
				this.userList = [];
				//				this.formDynamic.sqr='';
				$.each(this.dataList, (index, value) => {
					if(value.officecode == val) {
						this.userList.push(value)
					}
				})
			},
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			getMember(){//或者组长
				let obj={
					zaid:this.zaid
				}
				api.api('post',api.configUrl+'/hczz/zaz/queryZazxxList',obj).then(res=>{
					//zylx  0组长  1 副组长 2组员
					let arr=res.filter((value)=>{
						return value.zylx==0
					})
					if(arr.length){
						this.firstLeader=arr[0]
					}
				})
			},
			resets() {
				this.formDynamic = {
					rwnr: '',
					fjid: '',
					bmbh: '',
					bmmc: '',
					sqr: '',
					sqrid: ''
				}
				this.proceduresObj.baseArr = [];
				this.proceduresObj.fileList = [];
				this.$refs.approve.resetFields();
			}
		}
	};
</script>
<style lang="less">
	.newTaskForm{
			.ivu-form-item-content{
				height: 40px;
			}
		}
</style>