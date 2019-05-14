<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none;padding-bottom:10px;background:#fff;">
			<Form ref="formDynamic" inline class="search-ct">
				<!--<FormItem label="案件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqrxm" placeholder="请输入案件名称"></Input>
				</FormItem>-->
				<FormItem label="接警单编号:" :label-width="84" style="margin-left:5px;">
					<Input type="text" clearable v-model.trim="basePage.jjdbh" placeholder="请输入接警单编号"></Input>
				</FormItem>
				<FormItem label="报警内容:" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.bjnr" placeholder="请输入报警内容"></Input>
				</FormItem>
				<FormItem label="录入时间:" :label-width="84">
					<el-date-picker type="daterange" :default-value="new Date(new Date()-30*24*3600000)" :picker-options="pickerOptions2" v-model="basePage.time" start-placeholder="开始日期" end-placeholder="结束日期"  @change="handleDate"></el-date-picker>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct" :style="{height:height}">
				<Table style="height:100%" v-loading="loading"
					   element-loading-text="正在加载中，请稍后"
					   element-loading-spinner="el-icon-loading"
					   stripe :columns="columns" :data="columnsData" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<!-- <div class="fyDiv magin-top-20">
				<Button type="primary" class="magin-top-20" @click="prePage" :disabled="preDisabled">上一页</Button>
				<Button type="primary" class="magin-top-20" @click="nextPage">下一页</Button>
				需要注释下行
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div> -->
	</el-card>
</template>

<script>
	import api from '@/fetch/api';
	import { timestampToTime } from '@/libs/common/common';
	export default {
		data() {
			return {
				columns: [{
						title: '接警单编号',
						align: 'center',
						key: 'jjdbh',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '报警内容',
						align: 'center',
						key: 'bjnr',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '报警类型',
						align: 'center',
						key: 'bjfsmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '报警时间',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.bjsj))
						}
					},
					{
						title: '案发地址',
						align: 'center',
						key:'afdd',
						ellipsis: true,
						minWidth: 100
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
										marginRight: '5px',
										cursor: 'pointer'
									},
									on: {
										click: () => {
                                            let tHczzSqxx={
                                                sabjbh: params.row.jjdbh,
                                                ywlx:api.ywlx.zb
                                            }
                                            api.api('post',api.configUrl+'/hczz/hc/isHandling',tHczzSqxx).then(res=>{
                                                if(!res){
                                                    this.obj=params.row;
                                                    this.$router.push({
                                                        path: '/fullTimeStart',
                                                        query:{
                                                            obj:params.row,
                                                            rwly:1,
                                                            active:'warnList'
                                                        }
                                                    })
                                                }else{
                                                    this.$message.error('该警情已发起过，请不要重复发起')
                                                }
                                            })
										}
									}
								}, '发起')
							])

						}
					}
				],
				columnsData: [],
				preDisabled:true,
				loading:false,
				pageArray: [10, 20, 30],
				basePage: {
					bjnr:'',
					current: 1,
					pageindex: 1,
					pagesize: 10,
					jqbh: '',
					jjdbh: '',
					starttime: '',
					endtime: '',
					zt: ''
				},
				total: 0,
				height: 0,
				typeList: [{
					key: 0,
					value: '未审核'
				}, {
					key: 1,
					value: '已审核'
				}, {
					key: 2,
					value: '已签收'
				}, {
					key: 3,
					value: '已反馈'
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
					key: 'a',
					value: '审批中'
				}],
				list: [],
				pickerOptions2: {
					shortcuts: [{
						text: '最近三天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近十天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 10);
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
					}]
				}
			}
		},
		mounted() {
			this.height = $(window).height() - $('.search-ct').height() - 312 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 312 + 'px';
			}
			this.render();
		},
		methods: {
			render() {
				this.loading=true;
				this.columnsData=[];
				// api.api('post', api.configUrl + '/hczz/jjd/queryJjdList', this.basePage).then(res => {
				// 	this.columnsData = res;
				// 	this.loading=false;
				// })
				 api.api('post',api.configUrl+'/hczz/jjd/queryJjdList',this.basePage).then(res=>{
               	 if(res.list){
               	 	this.columnsData=res.list;
               	 }
               	 this.total=res.total;
               	 this.loading=false;
               })
			},
			handleDate(val) {
				if(val){
					this.basePage.starttime = new Date(val[0]).getTime();
				    this.basePage.endtime = new Date(val[1]).getTime()+24*3600*1000;
				}else{
					this.basePage.starttime = '';
				    this.basePage.endtime = '';
				}
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
			nextPage(){
				this.preDisabled=false;
				this.basePage.pageindex++;
				this.render();
			},
			prePage(){
				if(this.basePage.pageindex==2){
					this.preDisabled=true;
				}
				this.basePage.pageindex--;
				this.render();
			}
		}
	}
</script>
<style lang="less" scoped>
	.dailyCooperate {
		background: white;
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