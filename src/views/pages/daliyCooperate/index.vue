<template>
	<div class="dailyCooperate">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" inline>
				<FormItem label="案事件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案事件名称"></Input>
				</FormItem>
				<FormItem label="申请人：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqrxm" placeholder="请输入申请人"></Input>
				</FormItem>
				<FormItem label="申请时间：" :label-width="84">
					<DatePicker type="daterange"   placement="bottom-end" placeholder="请输入" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="任务状态：" :label-width="84">
					<Select v-model="basePage.zt" filterable clearable>
						<Option v-for="item in typeList" :value="item.key" :key="item.key">{{item.value}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct" :style="{height:height}">
				<el-table :data='columnsData' :stripe="true" height="100%" v-loading="loading" element-loading-spinner="demo-table-icon-load">
					<el-table-column label="编号" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.sqwh">{{scope.row.sqwh}}</span>
						</template>
					</el-table-column>
					<el-table-column label="申请人" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.sqr">{{scope.row.sqr}}</span>
						</template>
					</el-table-column>
					<el-table-column label="案事件名称" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.ajmc">{{scope.row.ajmc}}</span>
						</template>
					</el-table-column>
					<el-table-column label="申请时间" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.sqrq|timestampToTime">{{scope.row.sqrq|timestampToTime}}</span>
						</template>
					</el-table-column>
					<el-table-column label="当前状态" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.zt|ztFilter">{{scope.row.zt|ztFilter}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<a href="javascript:void(0)" @click="handleRow(scope.row)">查看</a>
							<a href="javascript:void(0)" v-if="scope.row.zt==6" @click="zgzjClick(scope.row)">战果总结</a>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="show">
				<modal :show="show" @update="update" :rowObj="rowObj"></modal>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import modal from './modal.vue';
	export default {
		components: {
			modal
		},
		data() {
			return {
				columnsData: [],
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10,
					ajmc: '',
					sqrxm: '',
					starttime: '',
					endtime: '',
					zt: '',
                    ywlx:api.ywlx.rc
				},
				total: 0,
				loading: false,
				height: 0,
				typeList: [{
					key: 0,
					value: '发起失败'
				}, {
					key: 'a',
					value: '审批中'
				},{
					key: 1,
					value: '已审核'
				}, {
					key: 2,
					value: '研判中'
				}, {
					key: 4,
					value: '已研判'
				}, {
					key: 5,
					value: '已评价'
				}, {
					key: 6,
					value: '出战果'
				}, {
					key: 7,
					value: '审批不通过'
				}],
				list: [],
				show: false, //查看模态框显示
				rowObj: {} //该条的信息
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.render();
				this.height = $(window).height() - 360 + 'px';
				//				this.changeData();
			})
		},
		methods: {
			render() {
				this.loading = true;
				api.api('post', api.configUrl + '/hczz/za/querySqxxList', this.basePage).then(res => {
					if(res.total == 0) {
						this.total = 0;
						this.columnsData = [];
					}
					if(res.list) {
						this.columnsData = res.list;
					}
					this.total = res.total;
					this.loading = false;
				})
			},
			handleDate(val) {
				this.basePage.starttime = new Date(`${val[0]} 00:00:00`).getTime();
				this.basePage.endtime = new Date(`${val[1]} 23:59:59`).getTime();
			},
			search() {
				this.basePage.current = 1;
				this.basePage.pageindex = 1;
				this.render();
			},
			pageChange(current) {
				this.basePage.current = current;
				this.basePage.pageindex = current;
				this.render();
			},
			pageSizeChange(current) {
				this.basePage.pagesize = current;
				this.render();
			},
			update() {
				this.show = false;
				this.render();
			},
			handleRow(val) {
				this.show = true;
				this.rowObj = val;
			},
			zgzjClick(val) {
				this.$router.push({
					path: '/ueditorLook',
					query: {
						id: val.id,
						type:2
					}
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
		}
	}
</style>