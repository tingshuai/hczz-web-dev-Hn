<template>
	<div class="dailyCooperate">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic"  inline>
				<FormItem label="接警单编号：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.jjdbh" placeholder="请输入接警单编号"></Input>
				</FormItem>
				<FormItem label="报警内容：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.bjnr" placeholder="请输入报警内容"></Input>
				</FormItem>
				<FormItem label="接警时间段：" :label-width="84">
					<el-date-picker v-model="basePage.time"  type="daterange" @change="timeChange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
					</el-date-picker>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<ModalWarn  ref="warnModal" :obj="obj" @update="update"></ModalWarn>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import ModalWarn from './warningStart';
	import $ from 'jquery';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		components:{
			ModalWarn
		},
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
						key: 'afdd',
						ellipsis: true,
						minWidth: 100
					},
//					{
//						title: '警情状态',
//						align: 'center',
//						ellipsis: true,
//						minWidth: 100,
//						render:(h,params)=>{
//							if(params.row.jqzt==0){
//								return h('div','未发起')
//							}else{
//								return h('div','发起过')
//							}
//						}
//					},
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
											let tHczzSqxx={
												sabjbh: params.row.jjdbh,
                                                ywlx:api.ywlx.rc
											}
											api.api('post',api.configUrl+'/hczz/hc/isHandling',tHczzSqxx).then(res=>{
												if(!res){
													this.$refs.warnModal.show=true;
		                                            this.obj=params.row;
		                                            this.$refs.warnModal.resets();
												}else{
													this.$message.error('该警情已发起过，请不要重复发起')
												}
											})
                                           
										}
									}
								}, '发起 ')
							])
						}
					}
				],
				columnsData: [],
				obj:{},
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10,
					jjdbh: '',
					bjnr: '',
					starttime:'',
					endtime:'',
					time:''
				},
				total: 0,
				loading: false,
				height: 0,
				pickerOptions2: {
					shortcuts: [{
						text: '最近一天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近两天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				ajbh:'',//接警单编号
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.changeData();
				this.render();
				this.height = $(window).height() - 360;
			})
		},
		methods: {
			render() {
				this.columnsData=[];
              this.loading=true;
               api.api('post',api.configUrl+'/hczz/jjd/queryJjdList',this.basePage).then(res=>{
               	 if(res.list){
               	 	this.columnsData=res.list;
               	 }
               	 this.total=res.total;
               	 this.loading=false;
               })
			},
			search() {
                this.basePage.current=1;
                this.basePage.pageindex=1;
                this.render();
			},
			pageChange(current) {
                this.basePage.current=current;
                this.basePage.pageindex=current;
                this.render();
			},
			pageSizeChange(current) {
                this.basePage.pagesize=current;
                this.render();
			},
			update(value){
				this.$refs.warnModal.show=false;
				if(value){
					this.render();
				}
			},
			timeChange(val){
				if(val){
					this.basePage.starttime=new Date(val[0]).getTime();
					this.basePage.endtime=new Date(val[1]).getTime()+24*3600000;
				}else{
					this.basePage.starttime='';
					this.basePage.endtime='';
				}
			}
		}
	}
</script>
<style lang="less">
  .dailyCooperate {
  	.ivu-form-item-content{
  		width: auto;
  	}
  	.el-date-editor{
  		height: 34px !important;
  	}
  	.el-date-editor .el-range__icon{
  		line-height: 28px;
  	}
  	.el-date-editor .el-range-separator{
  		line-height: 28px;
  	}
  	.wholeContent{
  		padding-top: 20px;
  	}
  }
</style>