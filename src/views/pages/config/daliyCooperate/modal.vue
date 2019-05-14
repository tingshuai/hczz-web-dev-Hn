<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" title="选择人员" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<ul class="shuttle-select-ct">
					<li>
						<span>选择</span>
						<el-scrollbar tag="ul" wrap-class="el-scrollbar__wrap" view-class="el-scrollbar__view" ref="scrollbar" class="dept-search-ct">
							<el-input placeholder="请输入搜索的内容" v-model="filterText">
								<i class="el-icon-search el-input__icon" slot="suffix" @click="handleSearch">
            </i>
							</el-input>
							<el-tree :data='treeData' node-key="id" :expand-on-click-node="true" :filter-node-method="filterNode" :default-expand-all='isExpand' ref="depTree" @node-click="handleNodeClick">
								<span class="custom-tree-node" slot-scope="{ node, data }">
					                  <span>
					                  	  <svg-icon name="user" v-show="data.isRole"></svg-icon>
					                  	  {{ data.title }}
					                  </span>
								</span>
							</el-tree>
						</el-scrollbar>
					</li>
					<li>
						<span>已选</span>
						<div>
							<ul class="selected-wrap">
								<li v-for="(item,index) in selectedDate" :key="index">
									<svg-icon name="user"></svg-icon>
									{{item.title}}<i class="el-icon-close" @click="delectArr(index)"></i>
								</li>
							</ul>
						</div>
					</li>
				</ul>
				<div>
					<Form ref="formDynamic" :model="formDynamic" :rules="ruleValidate" inline class="margin-top-10">
						<FormItem label="接警时间段：" :label-width="120" prop="time">
							<el-date-picker 
								v-model="formDynamic.time"  
								type="daterange"  
								range-separator="至" 
								start-placeholder="开始日期" 
								end-placeholder="结束日期" 
								:default-time="['00:00:00', '23:59:59']"
								align="right"
							>
							</el-date-picker>
						</FormItem>
					</Form>
				</div>
			</Modal>
		</div>
	</div>
</template>
<script>
	import api from "@/fetch/api.js";
	import {timestampToTime} from '@/libs/common/common.js';
	export default {
		props: {
			roleInfo: {
				type: Object,
				default: {}
			},
			show: {
				type: Boolean,
				default: false
			},
			zzid:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				filterText: "",
				treeData: [],
				selectedDate: [],
				isLoading: false,
				isLoadingIcon: true,
				officeString: "",
				tempString: "",
				tempTree: [],
				tempRoleTree: [],
				isExpand: true,
				isSearch: false,
				visible: this.show,
				formDynamic: {
					time: [],
					startTime: '',
					endTime: '',
					sqlx:'0'
				},
				ruleValidate:{
					time:[{
						required:true,
						message:'时间段是必填的'
					}]
				}
			}
		},
		watch: {
			filterText(val) {
				//搜索框为null时恢复到原始数据
				if(!val && this.isSearch) {
					this.treeData = JSON.parse(JSON.stringify(this.tempTree))
					this.treeData.forEach(item => {
						if(item.children.length > 0) {
							this.appendTree(item)
						}
					})
				}
				this.$refs.depTree.filter(val)
			},
			show(val) {
				this.visible = val;
			}
		},
		created() {
			this.handleInit();
		},
		mounted(){
			if(this.zzid){
				this.selectedDate=[{
					title:this.roleInfo.zxrxm,
					id:this.roleInfo.zxrid,
					officeCode:this.roleInfo.bmbh,
					officeName:this.roleInfo.bmmc
				}]
				this.formDynamic.time.push(new Date(timestampToTime(this.roleInfo.yxkssj)))
				this.formDynamic.time.push(new Date(timestampToTime(this.roleInfo.yxjssj)))
			}else{
				this.selectedDate=[];
			}
		},
		methods: {
			filterNode(value, data) {
				if(!value) return true
				return(
					data.title.indexOf(value) !== -1 || data.code.indexOf(value) !== -1
				)
			},
			//初始化树后插入第一层人员信息
			async handleInit() {
				await this.initTree()
				this.treeData.forEach(item => {
					if(item.children.length > 0) {
						this.appendTree(item)
					}
				})
			},
			//初始化部门树
			initTree() {
				return new Promise(reslove => {
					this.isLoading = true
					api.api("post", api.systemUrl + "/office/findOfficeTreeOneByOne2").then(res => {
						this.tempTree = JSON.parse(JSON.stringify(res));
						this.treeData = JSON.parse(JSON.stringify(this.tempTree));
						this.isLoading = false
						reslove()
					})
				})
			},
			//异步请求数据||push role
			handleNodeClick(node, data) {
				if(node.isRole) {
					//角色加入selectDate
					let res = this.selectedDate.filter(item => {
						return item["title"] == node.title
					});
					this.roleInfo.isLeader ? this.selectedDate.length < 1 ? this.selectedDate.push(node) : this.$message.error("只能选择一位副组长！") :
						!res.length ? this.selectedDate=[node] : this.$message.error("请勿重复选择人员")
					this.$emit('click-role-node', this.selectedDate)
				} else if(this.officeString.indexOf(node.id) == -1 && !this.filterText) {
					//部门发送请求且不重复发送
					this.appendTree(node)
					data.expanded = true
				}
			},
			appendTree(node) {
				this.officeString = this.officeString.indexOf(node.id) == -1 ? "" + this.officeString + node.id : this.officeString;
				this.reqRoleInfo(node.code).then(res => {
					res.forEach(item => {
						node.children.push(item)
					})
				})
			},
			reqRoleInfo(code) {
				return new Promise(reslove => {
					api.api("get", `${api.systemUrl}/account/info/queryPage2?pageNum=1&pageSize=1000&officeCode=${code}`)
						.then(res => {
							var result = JSON.parse(JSON.stringify(res.list)).map(item => {
								return Object.assign({
									isRole: true,
									title: item.userName,
									code: item.officeCode
								}, item)
							})
							reslove(result)
						})
				})
			},
			//搜索姓名，清空树结构(删除所有人员)
			async handleSearch(val) {
				this.isSearch = true
				if(!!this.filterText) {
					this.officeString = ''
					this.treeData = JSON.parse(JSON.stringify(this.tempTree));
					await this.handleSearchName(val)
					this.filterText = this.tempString
					this.isSearch = true
				}
			},
			handleSearchName(val) {
				return new Promise(reslove => {
					this.tempString = this.filterText;
					this.isSearch = false
					this.filterText = ""
					api.api("get", `${api.systemUrl}/account/info/findAccInfoes?userName=${this.tempString}`)
						.then(res => {
							res.forEach((item, index, arr) => {
								this.filterAppend(this.treeData, item)
								reslove()
							})
						})
				})
			},
			filterAppend(obj, val) {
				if(obj) {
					obj.forEach(item => {
						item.title.indexOf(val.officeName) == -1 ? this.filterAppend(item.children, val) :
							item.children.push(Object.assign({
								title: val.userName,
								isRole: true,
								code: val.officeCode
							}, val));
					})
				}
			},
			delectArr(index) {
				this.selectedDate.splice(index, 1)
			},
			sure() {
				let zzpz={};
				this.$refs.formDynamic.validate((valid)=>{
					if(valid){
						// let endtime=this.zzid?this.formDynamic.time[1].getTime()-24*3600*1000-1000:this.formDynamic.time[1].getTime()+24*3600*1000-1000
						let endtime = this.formDynamic.time[1].getTime()
						zzpz={
		               		bmbh:this.selectedDate[0].officeCode,
		               		bmmc:this.selectedDate[0].officeName,
		               		zxrid:this.selectedDate[0].id,
		               		zxrxm:this.selectedDate[0].userName,
		               		yxkssj:this.formDynamic.time[0].getTime(),
		               		yxjssj:endtime,
		               		zp:this.selectedDate[0].img,
		               		lxdh:this.selectedDate[0].phone,
		               		gadh:this.selectedDate[0].fixedNo,
		               		zw:'',
		               		id:this.zzid,
		               		sqlx:'1'
		               	}
						let urls=this.zzid==null ? '/hczz/xtpz/zzpz/insertZzpz' : '/hczz/xtpz/zzpz/updateZzpz';
						 api.api('post',api.configUrl+urls,zzpz).then(res=>{
			               	this.$emit('update');
			               	this.$refs.formDynamic.resetFields();
			               })
					}
				})
			},
			cancelBtn() {
               this.$emit('update');
               this.$refs.formDynamic.resetFields();
			}
		}
	}
</script>
<style lang="less">
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>