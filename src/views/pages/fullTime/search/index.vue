<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
			<Form ref="formDynamic" inline class="search-ct">
				<FormItem label="案事件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案事件名称"></Input>
				</FormItem>
				<FormItem label="申请人：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqr" placeholder="请输入申请人"></Input>
				</FormItem>
				<FormItem label="任务状态：" :label-width="84">
					<Select v-model.trim="basePage.zt" filterable clearable>
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<FormItem label="申请日期：" :label-width="84">
					<DatePicker type="daterange"   placement="bottom-end" placeholder="请选择申请日期" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct" :style="{height:height}">
				<Table :style="{height:height}" :loading="loading" stripe :columns="columns1"  :data="columnsData"  ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" style="margin-top:10px" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="show">
				<modal :show="show" @update="update" :rowObj="rowObj"></modal>
			</div>

	</el-card>
</template>

<script>
	import api from '@/fetch/api';
	import { timestampToTime } from '@/libs/common/common';
	import modal from './modal.vue';
	export default {
		components: {
			modal
		},
		data() {
			return {
				columns1: [{
						title: '编号',
						align: 'center',
						key: 'sqwh',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '申请人',
						align: 'center',
						key: 'sqr',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '案事件名称',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '申请时间',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							return h('p',timestampToTime(params.row.sqrq))
						}
					},
					{
						title: '状态',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							if(params.row.zt=='a' && params.row.sxzt && params.row.sxzt == 0) {
								return h('div', [
									h('p', {
										style: {
											color: '#ed7601'
										}
									}, '驳回,补充材料')
								])
							} else {
								let ztList = this.typeList.filter((value) => {
									return value.code == params.row.zt
								})
								if(ztList.length) {
									return h('div', [
										h('p', {
											style: {
												color: ztList[0].title == '未审核' ? '#ed7601' : '#333333'
											}
										}, ztList[0].title)
									])
								}
							}
						}
					},
					{
						title: '操作',
						key: 'operate',
						align: 'center',
						width: 150,
						render: (h, params) => {
							return h('div', [
								h('a', {
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											 this.rowClick(params.row)
										}
									}
								}, '查看')
							])
						}
					}
				],
				columnsData: [],
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10,
					ajmc: '',
					sqr: '',
					startDate: '',
					endDate: '',
					zt: '',
					sxzt: ''
				},
				total: 0,
				loading: false,
				height: 0,
				typeList: [],
				list: [],
				show: false,
				rowObj: {}
			}
		},
		mounted() {
			this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			}
			this.init();
		},
		methods: {
			async init() {
				await this.getType();
				this.render();
			},
			timestampToTime(timestamp) { //时间戳转为YYYY-MM-DD
				var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
				var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var F = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

				return Y + M + D;
			},
			getType() {
				return new Promise((resolve, reject) => {
					api.api('post', api.systemUrl + '/dict/findDictTreeByType', {
						dictTypeCode: 'HCZHBZT'
					}).then(res => {
						this.typeList = res;
						resolve();
					});
				})
			},
			render() {
				return new Promise((resolve, reject) => {
					api.api('post', api.configUrl + '/hczz/zhb/queryList', this.basePage).then(res => {
						if(res.total == 0) {
							this.total = 0;
							this.columnsData = [];
						}
						if(res.list) {
							this.columnsData = res.list;
						}
						this.total = res.total;
						resolve();
					})
				})
			},
			handleDate(val) {
				this.basePage.startDate = new Date(`${val[0]} 00:00:00`).getTime();
				this.basePage.endDate = new Date(`${val[1]} 23:59:59`).getTime();
			},
			search() {
				this.basePage.current = 1;
				this.basePage.pageindex = 1;
				let obj = $.extend(true, {}, this.basePage);
				if(this.basePage.zt == 'a1') {
					obj.sxzt = '0';
					obj.zt = 'a';
				} else {
					obj.sxzt = null;
				}
				api.api('post', api.configUrl + '/hczz/zhb/queryList', obj).then(res => {
					if(res.total == 0) {
						this.total = 0;
						this.columnsData = [];
					}
					if(res.list) {
						this.columnsData = res.list;
					}
					this.total = res.total;
				})
			},
			pageChange(current) {
				this.basePage.current = current;
				this.basePage.pageindex = current;
				this.init();
			},
			pageSizeChange(current) {
				this.basePage.pagesize = current;
				this.init();
			},
			update() {
				this.show = false;
			},
			rowClick(row) {
				this.show = true;
				this.rowObj = row;
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
		}
	}
	.ivu-date-picker-cells-focused em{
		box-shadow: none !important;
	}
</style>