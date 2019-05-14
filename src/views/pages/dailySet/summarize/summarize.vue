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
				<FormItem label="申请日期：" :label-width="84">
					<DatePicker type="daterange" :start-date="new Date(new Date()-30*24*3600*1000)" clearable placement="bottom-end" placeholder="请选择申请日期" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="当前状态：" :label-width="84" class="ztInput">
					<Select v-model.trim="basePage.zt">
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
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
							<span :title="scope.row.zt==5?'带总结':'已总结'" :style="{color:scope.row.zt==5?'orange':'green'}">{{scope.row.zt|zjZt}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<a href="javascript:void(0)" v-if="scope.row.zt==5" @click="handleRow(scope.row,'edit')">处理</a>
							<a href="javascript:void(0)" v-else @click="handleRow(scope.row,'look')">查看</a>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	export default {
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
					zt: 'assess',
					endtime: null,
					starttime: null,
                    ywlx:api.ywlx.rc
				},
				total: 0,
				loading: false,
				height: 0,
				pickerOptions2: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				typeList: [{
					code: 'assess',
					title: '全部'
				}, {
					code: '5',
					title: '待总结'
				}, {
					code: '6',
					title: '已总结'
				}]
			}
		},
		filters: {
			zjZt(val) {
				if(val == 5) {
					return '待总结'
				} else {
					return '已总结'
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.render();
				this.height = $(window).height() - $('form').height() - 250 + 'px';
				//				this.changeData();
			})
		},
		methods: {
			render() {
				api.api('post', api.configUrl + '/hczz/za/querySqxxList', this.basePage).then(res => {
					this.loading = false;
					if(res.list) {
						this.columnsData = res.list;
						this.total
					} else {
						this.columnsData = [];
					}
					this.total = res.total;
				})
			},
			search() {
				this.basePage.current = 1;
				this.basePage.pageindex = 1;
				this.render();
			},
			handleDate(val) {
				this.basePage.starttime = new Date(`${val[0]} 00:00:00`).getTime();
				this.basePage.endtime = new Date(`${val[1]} 23:59:59`).getTime()
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
			handleRow(val, type) {
				if(type == 'edit') {
					this.$router.push({
						path: '/ueditor',
						query: {
							sqid: val.id,
							type:1
						}
					})
				} else {
					this.$router.push({
						path: '/ueditorLook',
						query: {
							id: val.id,
							type:1
						}
					})
				}
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