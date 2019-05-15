<template>
	<div class="dailyCooperate">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" inline>
				<FormItem label="案事件名称：" :label-width="94">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案事件名称"></Input>
				</FormItem>
				<FormItem label="申请人：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqrxm" placeholder="请输入申请人"></Input>
				</FormItem>
				<FormItem label="申请日期：" :label-width="84">
					<DatePicker type="daterange"   placement="bottom-end" placeholder="请选择申请日期" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="当前状态：" :label-width="84" class="ztInput">
					<Select v-model.trim="basePage.zt" clearable>
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
							<span :title="scope.row.zt|ypZt" :style="{color:scope.row.zt<4?'orange':'green'}">{{scope.row.zt|ypZt}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<a href="javascript:void(0)" @click="handleRow(scope.row)">处理</a>
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
	import { timestampToTime } from '@/libs/common/common';
	export default {
		components: {},
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
					zt: 'y',
					starttime: '',
					endtime: '',
                    ywlx:api.ywlx.rc,
					tszt: '2'
				},
				total: 0,
				loading: false,
				height: 0,
				typeList: [{
					code: '1',
					title: '待研判'
				},{
					code: '2',
					title: '研判中'
				}, {
					code: 'e',
					title: '已研判'
				}]
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.$store.commit('setYpzt','')
//				this.changeData();
				this.render();
				this.height = $(window).height() - $('form').height() - 250 + 'px';
			})
		},
		filters: {
			ypZt(val) {
				if(val == 1) {
					return '待研判'
				} else if(val < 4) {
					return '研判中'
				} else {
					return '已研判'
				}
			}
		},
		methods: {
			render() {
				this.loading = true;
				this.columnsData = [];
				api.api('post', api.configUrl + '/hczz/za/querySqxxList', this.basePage).then(res => {
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
			handleRow(val) {
				let ztmc = '';
				if(val.zt < 2) {
					ztmc = '待研判'
				} else if(val.zt < 4) {
					ztmc = '研判中'
				} else {
					ztmc = '已研判'
				}
				this.$store.commit('setDeterId', val.id);
				this.$router.push({
					path: '/deterStart',
					query: {
						id: val.id,
						code: val.sqwh,
						content: val.ajmc,
						zt: ztmc
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
		.ivu-date-picker .ivu-select-dropdown {
			margin-left: 308px;
		}
	}
</style>