<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
			<Form inline class="search-ct">
				<Button type="primary" @click="add" class="add" style="margin-bottom:20px">增加</Button>
			</Form>
		
			<div class="table-ct" :style="{height:height}">
				<Table style="height:100%" :loading="loading" stripe :columns="columns" :data="columnsData"  ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<Modal ref="modal" :show="show" @closeModal="closeModal"></Modal>
			<el-dialog title="删除" :visible.sync="dialogVisible" width="30%" :modal="false">
				<span>是否确定删除？</span>
				<span slot="footer" class="dialog-footer">
				    <el-button @click="dialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="deleteBtn">确 定</el-button>
				</span>
			</el-dialog>
	</el-card>
</template>

<script>
	import api from '@/fetch/api';
	import { timestampToTime } from '@/libs/common/common';
	import Modal from './modal';
	export default {
		components: {
			Modal
		},
		data() {
			return {
				columns: [{
						title: '警种简称',
						align: 'center',
						key: 'jzjc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '处理部门',
						align: 'center',
						key: 'bmmc',
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							let arr = [];
							params.row.jzbmList.forEach(val => {
								arr.push(val.bmqc)
							})
							return h('p', arr.join(','))
						}
					},
					{
						title: '操作',
						key: 'operate',
						align: 'center',
						width: 100,
						render: (h, params) => {
							return h('div', [
								h('a', {
									on: {
										click: () => {
											this.show = true;
											this.$refs.modal.editModal(params.row);
										}
									}
								}, '编辑 '),
								h('a', {
									on: {
										click: () => {
											this.dialogVisible=true;
											this.deleteId=params.row.id;
										}
									}
								}, '删除 ')
							])
						}
					}
				],
				columnsData: [],
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10
				},
				total: 0,
				loading: false,
				height: 0,
				show: false,
				dialogVisible:false,
				deleteId:''
			}
		},
		mounted() {
			this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
			}
			this.render();
		},
		methods: {
			render() {
				this.loading = true;
				api.api('post', api.configUrl + '/hczz/jzpz/queryList', this.basePage).then(res => {
					this.loading = false;
					if(res.list) {
						this.columnsData = res.list;
						this.total = res.total;
					} else {
						this.columnsData = [];
					}
					this.total = res.total;
				})
			},
			pageSizeChange(val) {
				this.basePage.current = 1;
				this.basePage.pagesize = val;
				this.render();
			},
			pageChange(val) {
				this.basePage.pageindex = val;
				this.render();
			},
			closeModal() {
				this.show = false;
				this.render()
			},
			add() {
				this.show = true;
				this.$refs.modal.id=null;
			},
			deleteBtn() {
				api.api('get', api.configUrl + '/hczz/jzpz/deleteJzpz/' + this.deleteId).then(res => {
					this.$message.success('删除成功')
					this.dialogVisible=false;
					this.render();
				})
			}
		}
	}
</script>
<style lang="less">
	.dailyCooperate {
		.ivu-form-item-content {
			width: auto;
		}
		.el-date-editor {
			height: 34px !important;
		}
		.el-date-editor .el-range__icon {
			line-height: 28px;
		}
		.el-date-editor .el-range-separator {
			line-height: 28px;
		}
		.wholeContent {
			padding-top: 20px;
			min-width: 1100px;
		}
		.add {
			margin-bottom: 20px;
		}
	}
</style>