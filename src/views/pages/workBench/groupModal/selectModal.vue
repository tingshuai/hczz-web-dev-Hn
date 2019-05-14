<template>
	<ul class="shuttle-select-ct">
		<li>
			<span>选择</span>
			<el-scrollbar tag="ul" wrap-class="el-scrollbar-wrap" view-class="el-scrollbar-view" ref="scrollbar" class="dept-search-ct">
				<el-input placeholder="请输入搜索的内容" v-model="filterText">
					<i class="el-icon-search el-input__icon" slot="suffix" @click="handleSearch"></i>
				</el-input>
				<el-radio v-model="radio1" label="1" class="margin-top-20 margin-bottom-10">值班</el-radio>
				<el-radio v-model="radio1" label="2">所有</el-radio>
				<!-- <i v-show="isLoadingIcon" class="el-icon-search icon-search" @click="handleSearch"></i>
              <i v-show="!isLoadingIcon" class="el-icon-loading icon-search" ></i> -->
				<el-tree class="elTree" style="display: block;" :data='treeData' node-key="id" :expand-on-click-node="true"  :filter-node-method="filterNode" :default-expand-all='isExpand' ref="depTree" @node-click="handleNodeClick">
					<span class="custom-tree-node" slot-scope="{ node, data }">
                  <span><svg-icon name="user" v-show="data.isRole"></svg-icon>{{ data.title }}</span>
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
</template>
<script>
	import api from "@/fetch/api.js"
	export default {
		props: {
			roleInfo: {
				type: Object,
				default: {}
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
				isExpand: false,
				isSearch: false,
				radio1:'1'
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
			}
		},
		created() {
			this.handleInit()
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
				// this.tempRoleTree = JSON.parse(JSON.stringify(this.treeData))
			},
			//初始化部门树
			initTree() {
				return new Promise(reslove => {
					this.isLoading = true
					api.api("post", api.systemUrl + "/office/findOfficeTreeByType").then(res => {
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
					console.log(node.isRole,"KKKKKK")
					//角色加入selectDate
					let res = this.selectedDate.filter(item => {
						return item["title"] == node.title
					});
					this.selectedDate = [node]; //每次只能添加一个成员
					//      this.roleInfo.isLeader?this.selectedDate.length < 1? this.selectedDate.push(node): this.$message.error("只能选择一位副组长！")
					//        : !res.length? this.selectedDate.push(node): this.$message.error("请勿重复选择人员")
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
		}
	}
</script>
<style lang="less" scoped>
	.dept-search-ct {
		position: relative;
		z-index: 20;
	}
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
	.shuttle-select-ct {
		.elTree{
			margin-left: -6px;
		}
	}
</style>