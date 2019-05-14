<template>
	<el-dialog class="modal-ct workBench-group-modal" :title="modelTitle" @close='closeModel' :visible.sync="visible" :modal-append-to-body='false' width="700px">
		<ul class="shuttle-select-ct offiece-select-ct">
			<li>
				<span>选择部门</span>
				<el-scrollbar tag="div" wrap-class="el-scrollbar-wrap" view-class="el-scrollbar-view" ref="scrollbar">
					<lazy-dept-tree ref="deptTree" @onTreeModal="handleDeptNode" @resultClick="onResultClick" :deptCode="deptCode"></lazy-dept-tree>
				</el-scrollbar>
			</li>
			<li>
				<span>已选</span>
				<div>
					<ul class="selected-wrap">
						<li style="width:100%" v-for="(item, index) in selectedDate" :key="index">{{item.title}}<i class="el-icon-close" @click="delectArr(index)"></i>
						</li>
					</ul>
				</div>
			</li>
		</ul>
		<div slot="footer">
			<Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
			<Button type="primary" class="sureBtn" @click="saveInfo">确认</Button>
		</div>
	</el-dialog>
</template>
<script>
	import api from "@/fetch/api.js";
	import lazyDeptTree from '@/views/pages/specialSet/components/lazyDeptTree.vue';
	export default {
		components: {
			lazyDeptTree
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			isCopy: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				visible: this.show,
				filterTextDept: "",
				filterTextOffice: "",
				radio: "",
				deptTree: [],
				treedata: [],
				defaultProps: {
					children: "children",
					label: "title"
				},
				selectedDate: [],
				deptCode:JSON.parse(window.localStorage.getItem('userInfo')).deptCode
			};
		},
		watch: {
			filterTextOffice(val) {
				this.$refs.treeOffice.filter(val);
			},
			show() {
				this.visible = this.show;
			}
		},
		computed: {
			modelTitle() {
				return this.isCopy ? "抄送部门" : "选择部门";
			}
		},
		methods: {
			filterNodeDept(value, data) {
				if(!value) return true;
				return(
					data.title.indexOf(value) !== -1 || data.pinYing.indexOf(value) !== -1
				);
			},
			filterNodeOffice(value, data) {
				if(!value) return true;
				return(
					data.title.indexOf(value) !== -1 || data.pinYing.indexOf(value) !== -1
				);
			},
			onResultClick(item) {
				this.selectedDate = [{
					id: item.officeId,
					title: item.officeName
				}]
			},
			handleDeptNode(node) {
				if(node.tag === 1) {
					this.selectedDate = [node];
					this.$emit('click-role-node', this.selectedDate)
					let res = this.selectedDate.filter(item => {
						return item["jsdwmc"] == node.title;
						this.selectedDate = [node];
						this.$emit('click-role-node', this.selectedDate)
					});
				}
			},
			handleNodeClick(node) {
				let res = this.selectedDate.filter(item => {
					return item["title"] == node.title;
				});
				this.selectedDate = [node];
				this.$emit('click-role-node', this.selectedDate)
			},
			delectArr(index) {
				this.selectedDate.splice(index, 1);
			},

			closeModel() {
				this.$emit("update:show", false);
				this.filterTextDept = '';
				this.selectedDate = [];
				this.treedata = [];
			},
			saveInfo() {
				this.$emit("update:show", false);
				this.$emit("handleOffice", JSON.parse(JSON.stringify(this.selectedDate)));
				this.closeModel()
			}
		}
	};
</script>
<style lang="less" scoped>
	.el-scrollbar-wrap {
		padding: 0 !important;
	}
	
	.el-scrollbar {
		position: relative;
		z-index: 20;
	}
	
	.offiece-select-ct {
		li {
			width: 45% !important;
		}
	}
	
	.shuttle-select-ct li>div .selected-wrap li {
		line-height: 36px;
		position: relative;
		width: 100% !important;
	}
</style>