<template>
	<div id="role">
		<div class="wholeContent">
			<Form ref="formDynamic" :model="formDynamic"  inline >
				<FormItem :label="'角色名称：'" class="margin-right-20 roleName">
					<Input type="text" clearable v-model.trim="formDynamic.roleName" placeholder="请输入角色名称"></Input>
				</FormItem>
				<Button type="primary" class="searchBtn"  @click="searchRole">查询</Button>
			</Form>
			<div class="font-size-0 text-align-right">
				<Button type="primary" icon="ios-plus-empty" @click="addRole">新增</Button>
				<Button type="primary" icon="ios-trash" :disabled="disabled" @click="deleteBtn">删除</Button>
			</div>
			<div>
				<Table @on-row-click="rowDetail":height="height" :loading="loading" stripe ref="selection" :columns="userManaColumns" :data="userManaData" @on-selection-change="selectTable"></Table>
			</div>
			<Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			<!--删除确认模态框-->
			<Modal v-model="deleteModal" title="删除"  class="lookStyle delStyle"  :mask-closable="false">
				<div class="text-align">
					<span class="delSpan">确认删除？</span>
				</div>
				<div slot="footer">
					<Button type="default" class="cancelBtn" @click="deleteModal=false">取消</Button>
					<Button type="primary" class="sureBtn" :loading="deleteModal_loading" @click="deleteModaldel">删除</Button>
				</div>
			</Modal>
			<!--新增模态框-->
			<Modal v-model="addModal" :title="title" class="lookStyle roleLookStyle"  :mask-closable="false">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
					<Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
				</div>
				<div>
					<Form ref="formValidateAdd" :model="formValidateAdd" :rules="ruleValidateAdd" :label-width="80">
						<FormItem label="角色名称：" prop="roleName">
							<Input :maxlength="32" v-model.trim="formValidateAdd.roleName" clearable placeholder="请输入角色名称"></Input>
						</FormItem>
						<FormItem label="角色简称：" prop="rolePname">
							<Input :maxlength="32" v-model.trim="formValidateAdd.rolePname" clearable placeholder="请输入角色简称"></Input>
						</FormItem>
					</Form>
				</div>
			</Modal>
			<!--查看模态框-->
			<Modal v-model="lookModal" title="查看角色" class="lookStyle roleLookStyle"  :mask-closable="false">
				<div slot="footer">
					<Button type="default" class="cancelBtn" @click="lookModal=false">关闭</Button>
				</div>
				<div>
					<Form    :label-width="80">
						<FormItem label="角色名称：" prop="roleName">
							<p>{{formValidateAdd.roleName}}</p>
						</FormItem>
						<FormItem label="角色简称：">
							<p>{{formValidateAdd.rolePname}}</p>
						</FormItem>
					</Form>
				</div>
			</Modal>
			<!--授权模态框-->
			<Modal v-model="accreditModal" title="角色授权"  class="editModalUser lookStyle"  :mask-closable="false">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="accreditModal=false">取消</Button>
					<Button type="primary" class="sureBtn"  @click="accreditModalok">确定</Button>
				</div>
				<div>
					<div class="editH3">
						<h3>用户授权</h3>
					</div>
					<div class="threeTable">
						<div class="oDiv">
							<h3 class="text-align">应用</h3>
							<div v-for="(itemApply,index) in applyData" @click="getResource(itemApply,index)">
								<p class="one" :style="itemApply.styles"></p>
								<p class="two" :class="itemApply.name">{{itemApply.clientName}}</p>
							</div>
						</div>
						<div class="oDiv">
							<h3 class="text-align">资源</h3>
							<div v-for="(itemResource,index) in resourceData" v-if="resourceData.length!=0" @click="getBtn(itemResource,index)">
								<p class="one" :style="itemResource.styles"></p>
								<p class="two" :class="itemResource.name">{{itemResource.nameCn}}</p>
								<button class="btn" v-if="itemResource.num==0" @click.stop="setPower(itemResource)">授权</button>
								<button class="btn" v-else @click.stop="removePower(itemResource)">撤销</button>
							</div>
							<div v-if="resourceData.length==0">暂无数据</div>
						</div>
						<div class="oDiv">
							<h3 class="text-align">按钮</h3>
							<div v-for="itemBtn in btnData" v-if="btnData.length!=0">
								<p class="one"></p>
								<p class="two">{{itemBtn.btnName}}</p>
								<button class="btn" v-if="itemBtn.num==0" @click="setBtn(itemBtn)">授权</button>
								<button class="btn" v-else @click="removeBtn(itemBtn)">撤销</button>
							</div>
							<div v-if="btnData.length==0">暂无数据</div>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	import { unique } from '@/libs/common/common.js';
	export default {
		components: {

		},
		data() {
			const roleNameUnique = (rule, value, callback) => {
		        setTimeout(() => {
		          if(this.title=="新增角色"){
		        		api.api('get', api.configUrl+'/role/getRoleCount?nameCn='+ value)
				            .then(res => {
				              if (res>0) {
				                callback(new Error('该角色名称已存在'))
				              } else {
				                callback()
				              }
				            })
		        	}else{
		        		api.api('get', api.configUrl+'/role/getRoleCount?nameCn=' + value+'&id='+this.roleId)
				            .then(res => {
				              if (res>0) {
				                callback(new Error('该角色名称已存在'))
				              } else {
				                callback()
				              }
				            })
		        	}
		        }, 10)
		      }
			return {
				params:{
					roleName:''
				},
				load:{
					cnText:'角色名称,角色简称',
					enText:'roleName,nameCn',
					fileName:'角色',
					accountIds:''
				},
				title: '新增角色',
				applyData: [],
				resourceData: [],
				roleAndResources:[],
				btnData: [],
				lookModal: false,
				loading: false,
				disabled: true,
				height: 0,
				roleId:'',//点击当前的角色id
				formDynamic: {
					roleName: ''
				},
				userManaColumns: [{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						type: 'index',
						width: 75,
						title: '序号',
						align: 'center'
					},
					{
						title: '角色名称',
						align: 'center',
						key: 'roleName',
						ellipsis:true,
						minWidth:100
					},
					{
						title: '角色简称',
						align: 'center',
						key: 'rolePname',
						ellipsis:true,
					    minWidth:100
					},
					{
						title: '操作',
						key: 'operate',
						align: 'center',
						width:120,
						render: (h, params) => {
							return h('div', [
								h('a', {
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.addModal = true;
											this.title = "编辑角色";
											this.editBtnM(params.row.roleId,event)
										}
									}
								}, '编辑  |'),
								h('a', {
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.roleId=params.row.roleId;
											this.roleAndResources=[];
				                            this.btnData=[];
											this.accreditBtn(params.row.roleId,event)
											this.resourceData=[];
					                        this.btnData=[];
										}
									}
								}, '授权')
							])
						}
					}
				],
				userManaData: [],
				pageArray:[10,20,30,40],
				deleteModal: false, // 删除模态框
				deleteModal_loading: false, // 删除模态框点击确认时添加loading样式
				addModal: false, // 新增模态框
				formValidateAdd: { // 表单
					rolePname: '',
					roleName: '',
					roleId: ''
				},
				ruleValidateAdd: {
					rolePname: [{
						required: true,
						message: '角色简称不能为空'
					}, {
						pattern: '^[A-Za-z0-9]+$',
						message: '角色简称只能包含英文、数字'
					}],
					roleName: [{
						required: true,
						message: '角色名称不能为空',
					}, {
						pattern: '^[A-Za-z0-9]+$',
						message: '角色名称只能包含英文、数字'
					},{
						validator:roleNameUnique
					}]
				}, // 新增表单验证
				accreditModal: false, // 授权模态框
				basePage: {
					pageSize: 10,
					pageNumber: 1
				},
				current:1,
				deleteRoleArr: [], // 选中要删除的数组
				total: 0, // 分页显示的总数量,
				applyStyle:'border-color: white #397bdf white white;'
			}
		},
		mounted() {
			this.height = $(window).height() - 330;
			const that = this;
			window.onresize = function temp() {
				$('.menuNav').css('height', $(window).height() - 60 + 'px');
				that.height = $(window).height() - 330;
			}
		},
		created() {
			this.render(this.basePage.pageNumber, this.basePage.pageSize)
		},
		methods: {
			setPower(val){
				val.num=1;
				var self=this;
				var indexs=-1;
				$.each(self.roleAndResources,function(index,item){
					if(val.id==item.resourceId){
						indexs=index;
					}
				})
				if(indexs!=-1){
					self.roleAndResources.splice(indexs,1)
				}else{
					this.roleAndResources.push({
						roleId:this.roleId,
						permission:0,
						resourceId:val.id,
						resourceType:0,
						isAuth:'1',
						name:val.nameCn
					})
				}
			},
			removePower(val){
				val.num=0;
				var self=this;
				var indexs=-1;
				$.each(self.roleAndResources,function(index,item){
					if(val.id==item.resourceId){
						indexs=index;
					}
				})
				if(indexs!=-1){
					self.roleAndResources.splice(indexs,1)
				}else{
					this.roleAndResources.push({
						roleId:this.roleId,
						permission:0,
						resourceId:val.id,
						resourceType:0,
						isAuth:'0'
					})
				}
			},
			getResource(item,index){
				let self=this;
				$.each(self.applyData, function(indexs,val) {
					self.applyData[indexs].name='';
					self.applyData[indexs].styles='';
				});
				self.applyData[index].name='applyActive';
				self.applyData[index].styles=this.applyStyle;
				api.api('post',api.configUrl+'/resources/findResourcesByCliIdAndRoleId',{
					clientId:item.id,
					roleId:self.roleId
				}).then(res=>{
					self.resourceData=res;
//					$.each(self.resourceData,function(index,vals){
//						if(vals.num>0){
//							self.roleAndResources.push({
//								roleId:self.roleId,
//								permission:0,
//								resourceId:vals.id,
//								resourceType:0
//							})
//						}
//					})
					$.each(self.resourceData,function(index,val){
						self.$emit(val,'name','');
						self.$emit(val,'styles','');
					})
				})
			},
			rowDetail(item,index){
				this.lookModal = true;
				this.editBtnM(item.roleId,event)
			},
			pageChange(current){//改变页码查询
				this.basePage.pageNumber = current;
				this.current=current;
				this.render(current, this.basePage.pageSize, this.formDynamic.roleName);
			},
			pageSizeChange(current){//改变数量查询
				this.basePage.pageSize = current;
				this.render(this.basePage.pageNumber, current, this.formDynamic.roleName);
			},
			modalCancel() {// 编辑 和 增加 模态框 取消事件
				this.$refs.formValidateAdd.resetFields();
				this.addModal = false;
			},
			refreshPage: function() {// 刷新当前页面
				this.disabled = true;
				this.render(this.basePage.pageNumber, this.basePage.pageSize,this.formDynamic.roleName)
			},
			deleteBtn() {
				this.deleteModal = true;
			},
			render(numbers, size, roleName) { //查询列表
				this.userManaData = [];
				let userManaUrl = '?pageNum=' + numbers + '&pageSize=' + size;
				if(roleName) {
					userManaUrl += '&roleName=' + roleName;
				}
				this.loading = false;
				api.api('get',api.configUrl+'/role/queryPage' + userManaUrl).then(res => {
					if(!res.total) {
							this.$Message.info('根据条件查不到数据');
							this.total = 0;
							this.loading = false;
							return
						}
						this.total = res.total;
						for(let i = 0; i < res.list.length; i++) {
							this.userManaData.push({
								roleId: res.list[i].id,
								rolePname: res.list[i].nameCn,
								roleName: res.list[i].roleName
							})
						}
						this.loading = false;
				})
			},
			handleSelectAll(status) { // 设置全选取消全选
				this.$refs.selection.selectAll(status);
			},
			deleteModaldel() {// 删除模态框确认
				this.deleteModal_loading = true;
				this.deleteModal = false;
				api.api('post',api.configUrl+'/role/deleteByIds',{
					ids:this.deleteRoleArr.join(',')
				}).then(res => {
					this.refreshPage();
					this.deleteModal_loading = false;
				})
			},
			addModalok() {//新增角色、编辑角色确认
				this.$refs.formValidateAdd.validate((valid) => {
					if(valid) {
						if(this.title == "新增角色") {
							api.api('post',api.configUrl+'/role/save',{
								roleName:this.formValidateAdd.roleName,
								nameCn:this.formValidateAdd.rolePname,
								delFlag:0
							}).then(res=>{
								this.refreshPage();
									this.$refs.formValidateAdd.resetFields();
									this.addModal = false;
							})

						} else {
							api.api('post',api.configUrl+'/role/update',{
								roleName:this.formValidateAdd.roleName,
								nameCn:this.formValidateAdd.rolePname,
								delFlag:0,
								id:this.formValidateAdd.roleId
							}).then(res=>{
								this.refreshPage();
								this.$refs.formValidateAdd.resetFields();
								this.addModal = false;
							})
						}
					}
				})
			},
			accreditBtn(roleId,event) { // 点击授权
				let self=this;
				self.accreditModal = true;
				api.api('post',api.configUrl+'/client/queryList').then(res => {
					self.applyData = res;
					$.each(self.applyData,function(index,val){
						self.$emit(self.applyData[index],'name','');
						self.$emit(self.applyData[index],'styles','');
					})
				})
				event.stopPropagation()
			},
			accreditModalok() {
				api.api('post',api.configUrl+'/resources/setResourcesByRoleId',{
//					roleId:this.roleId,
					mes:JSON.stringify(this.roleAndResources)
				}).then(res=>{
					this.accreditModal=false;
					this.refreshPage();
					this.resourceData=[];
					this.btnData=[];
				})
			},
			selectTable(name) {// 选中table的复选框时触发
				this.deleteRoleArr = [];
				this.disabled = true;
				for(let i = 0; i < name.length; i++) {
					this.disabled = false;
					this.deleteRoleArr[i] = name[i].roleId;
				}
				this.load.accountIds=this.deleteRoleArr.join(',')
			},
			editBtnM(id,event) {
				api.api('post',api.configUrl+'/role/detail',{
					id:id
				}).then(res=>{
					this.formValidateAdd.roleId = res.id;
					this.formValidateAdd.rolePname = res.nameCn;
					this.formValidateAdd.roleName = res.roleName;
				})
				event.stopPropagation()
			},
			addRole() {
				this.addModal = true;
				this.title = "新增角色";
				this.formValidateAdd={ // 表单
					rolePname: '',
					roleName: '',
					roleId: ''
				}
			},
			searchRole() {
				this.render(1, 10, this.formDynamic.roleName);
				this.disabled=true;
				this.current=1;
				this.params={
					roleName:this.formDynamic.roleName
				}
			},
			getBtn(item,index){
				let self=this;
				if(item.num==0) return
				$.each(self.resourceData, function(indexs,val) {
					val.name='';
					val.styles='';
				});
				self.resourceData[index].name='applyActive';
				self.resourceData[index].styles=this.applyStyle;
				api.api('get',api.configUrl+'/oper/action/findResourcesByResIdAndRoleId?resourceId='+item.id+'&roleId='+this.roleId).then(res=>{
					self.btnData=res;
				})
//				$.each(self.btnData,function(index,val){
//					if(val.delFlag==0){
//						self.roleAndResources.push({
//							roleId:self.roleId,
//							permission:1,
//							resourceId:val.id,
//							resourceType:0
//						})
//					}
//				})
			},
			removeBtn(val){
				val.num=0;
				var self=this;
				var indexs=-1;
				$.each(self.roleAndResources,function(index,item){
					if(val.id==item.resourceId){
						indexs=index;
					}
				})
				if(indexs!=-1){
					self.roleAndResources.splice(indexs,1)
				}else{
					this.roleAndResources.push({
						roleId:this.roleId,
						permission:0,
						resourceId:val.id,
						resourceType:1,
						isAuth:'0'
					})
				}
			},
			setBtn(val){
				val.num=1;
				var self=this;
				var indexs=-1;
				$.each(self.roleAndResources,function(index,item){
					if(val.id==item.resourceId){
						indexs=index;
					}
				})
				if(indexs!=-1){
					self.roleAndResources.splice(indexs,1)
				}else{
					this.roleAndResources.push({
						roleId:this.roleId,
						permission:0,
						resourceId:val.id,
						resourceType:1,
						isAuth:'1',
						name:val.btnName
					})
				}
			}
		}
	}
</script>
<style>

	.editModalUser .treeDiv {
		width: 100% !important;
		padding: 0 !important;
	}

	.threeTable {
		display: flex;
		justify-content: space-around;
	}

	.threeTable>div {
		width: 30%;
		border: 1px solid #c7d0d9;
	}
	.threeTable .ivu-table-wrapper .ivu-table {
		width: 100%;
	}

	.one {
		border-color: white #ccc white white;
		border-style: solid;
		border-width: 15px;
		height: 0px;
		width: 0px;
		float: left;
		margin-left: -15px;
	}

	.two {
		background: #ccc;
		height: 30px;
		line-height: 30px;
		text-align: center;
		overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 30px;
	}

	.btn {
		position: absolute;
		top: 7px;
		right: 20px;
	}

	.oDiv {
		height: 300px;
		overflow: auto;
	}

	.oDiv>div {
		position: relative;
		padding: 5px 15px;
	}
	.roleName .ivu-form-item-label{
		padding: 11px 12px 13px 0;
	}
	.roleName{
		margin-left: 0;
	}
	.applyActive,.resourceActive,.btnActive{
		background: #397bdf;
		color: white;
	}
</style>
