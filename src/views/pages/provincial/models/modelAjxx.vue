<template>
    <div class="ajxxContent">
			<Form ref="formDynamic"  inline class="search-ct">
				<FormItem label="涉案编号：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajbh" placeholder="请输入涉案编号"></Input>
				</FormItem>
				<FormItem label="案件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案件名称"></Input>
				</FormItem>
				<FormItem label="简要案情：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.jyaq" placeholder="请输入简要案情"></Input>
				</FormItem>
				<FormItem label="受理时间：" :label-width="84">
					<el-date-picker v-model="basePage.time" @change="timeChange" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
					</el-date-picker>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<Table highlight-row :loading="loading" height="300" :columns="columns" :data="columnsData" @on-current-change="curRowChange"  ref="table"></Table>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
    </div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		components:{
			
		},
		data() {
			return {
				columns: [{
						title: '涉案编号',
						align: 'center',
						key: 'ajbh',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '案件名称',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '受理时间',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.slsj))
						}
					},
					{
						title: '简要案情',
						align: 'center',
						key: 'jyaq',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '案件类型',
						align: 'center',
						key: 'ajlbMc',
						ellipsis: true,
						minWidth: 100
					},
//					{
//						title: '案件状态',
//						align: 'center',
//						ellipsis: true,
//						minWidth: 100,
//						render:(h,params)=>{
//							if(params.row.ajzt==0){
//								return h('div','未发起')
//							}else{
//								return h('div','发起过')
//							}
//						}
//					},
				],
				columnsData: [],
				obj:{},
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10,
					ajbh: '',
					ajmc: '',
					jyaq: '',
					starttime:'',
					endtime:'',
					time:''
				},
				total: 0,
				loading: false,
				height: 0,
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
				},
				ajbh:'',//涉案编号
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.changeData();
				this.render();
				this.height = $(window).height() - $('.search-ct').height() - 312 + 'px';
				window.onresize = () => {
					this.height = $(window).height() - $('.search-ct').height() - 312 + 'px';
				}
			})
		},
		methods: {
			curRowChange(curRow){
				this.$emit("selectAjxx",curRow)
			},
			render() {
				this.columnsData=[];
				this.loading=true;
                api.api('post',api.configUrl+'/hczz/ajjbxx/queryAjjbxxList',this.basePage).then(res=>{
               	if(res.list){
               		this.columnsData=res.list;
               	}
               	 this.total=res.total;
               	 this.loading=false;
                })
			},
			search() {
				this.basePage.pageindex=1;
				this.basePage.current=1;
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
	.ajxxContent{		
		height: 500px;
		overflow: auto;
	}
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