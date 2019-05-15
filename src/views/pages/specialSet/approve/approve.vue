<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
			<Form ref="formDynamic" inline class="search-ct">
				<FormItem label="案事件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案事件名称"></Input>
				</FormItem>
				<FormItem label="申请人：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqr" placeholder="请输入申请人"></Input>
				</FormItem>
				<FormItem label="申请时间：" :label-width="84">
					<DatePicker type="daterange"   placement="bottom-end" placeholder="请选择申请时间" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="当前状态：" :label-width="84" class="ztInput">
					<Select v-model.trim="basePage.zt">
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct" :style="{height:height}">
				<Table style="height:100%" :loading="loading" stripe :columns="columns" :data="columnsData"  ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="show">
			    <Modal ref="modal" :title="title" :id="id" :show="show" :taskObj="taskObj" :approveZt="approveZt" @update="update"></Modal>
			</div>
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
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							return h('div', timestampToTime(params.row.sqrq))
						}
					},
					{
						title: '当前状态',
						align: 'center',
						key: 'status',
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							return h('div', params.row.ztName=='n'?'待审批':'已审批')
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
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.show = true;
											this.title = '编号：' + params.row.sqwh;
											this.id = params.row.id;
											this.taskObj=params.row.task;
											this.approveZt=params.row.ztName;
										}
									}
								}, params.row.ztName=='n'?'处理':'查看')
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
					ajmc:'',
					sqr: '',
					startDate: '',
					endDate: '',
                    type:'1',
                    ywlx:api.ywlx.za,
					zt:'n'
				},
				total: 0,
				loading: false,
				height: 0,
				typeList: [{
					code:'n',
					title:'待审批'
				},{
					code:'y',
					title:'已审批'
				}],
				title: '',
				id: '',//该条的id
				taskObj:{},//审批时该条的task对象
				show: false,
				approveZt:''//该条的状态
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.changeData();
				this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
				window.onresize = () => {
					this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
				}
			})
		},
		created() {
			this.rendtable();
		},
		methods: {
			rendtable() {
				this.loading=true;
				api.api("post", `${api.configUrl}/hczz/hc/queryApproveList`, this.basePage).then(res => {
					if(res.list){
						this.columnsData = res.list;
					}else{
						this.columnsData=[];
					}
					this.columnsData.map(item=>{
						this.$set(item,'ztName',this.basePage.zt=='n'?'n' : 'y')
					})
					this.total = res.total;
					this.loading=false;
				})
			},
			handleDate(val) {
				this.basePage.startDate = new Date(`${val[0]} 00:00:00`).getTime();
				this.basePage.endDate = new Date(`${val[1]} 23:59:59`).getTime();
			},
			search() {
				this.basePage.current = 1;
				this.basePage.pageindex = 1;
				this.rendtable();
			},
			pageChange(current) {
				this.basePage.current = current;
				this.basePage.pageindex = current;
				this.rendtable();
			},
			pageSizeChange(current) {
				this.basePage.pagesize = current;
				this.rendtable();
			},
			update(value) {
				this.show = false;
				this.rendtable();
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
			/*min-width: 1196px;*/
			.ztInput{
				width: 246px;
			}
		}
	}
</style>