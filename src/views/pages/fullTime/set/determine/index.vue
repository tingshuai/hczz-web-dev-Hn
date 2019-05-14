<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
			<Form ref="formDynamic"  inline class="search-ct">
				<FormItem label="案事件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案事件名称"></Input>
				</FormItem>
				<FormItem label="申请人：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqr" placeholder="请输入申请人"></Input>
				</FormItem>
				<FormItem label="申请日期：" :label-width="84">
					<DatePicker type="daterange"   placement="bottom-end" placeholder="请选择申请日期" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="当前状态：" :label-width="84">
					<Select v-model.trim="basePage.zt" filterable>
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct" :style="{height:height}">
				<Table style="height:100%" :loading="loading" :stripe="true"  :columns="columns" :data="columnsData"  ref="table"></Table>
			</div>  
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
		</el-card>
</template>

<script>
	import api from '@/fetch/api';
	import {timestampToTime,timestampToTimes} from '@/libs/common/common';
	export default {
		components:{
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
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.sqrq))
						}
					},
					{
						title: '当前状态',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							let status='';
							if(params.row.zt==1){
								status='研判中'
							}else if(params.row.zt>3 && params.row.zt<7){
								status='已研判'
							}else{
								status='cccc'
							}
							return h('div',[
								h('p',{
									style:{
										color:params.row.zt<4?'orange':'green'
									}
								},status)
							])
							
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
											this.$store.commit('setDeterId',params.row.id);
											let ztList=this.typeList.filter((value)=>{
												return value.code==params.row.zt
											})
											if(ztList.length){
												this.ztmc=ztList[0].title
											}
											if(params.row.zt>3 && params.row.zt<7){
												this.ztmc='已研判'
											}
                                           this.$router.push({
                                           	path:'/fullTimeDetermineStart',
                                           	query:{
                                           		id:params.row.id,
                                           		code:params.row.sqwh,
                                           		content:params.row.ajmc,
                                           		zaid:params.row.zaid
                                           	}
                                           })
										}
									}
								}, '处理 ')
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
					type:'2',
					zt: 'y'
				},
				total: 0,
				loading: false,
				height: 0,
				typeList:[{
					code:'y',
					title:'全部'
				},{
					code:'1',
					title:'研判中'
				},{
					code:'e',
					title:'已研判'
				}],
				ztmc:''
			}
		},
		mounted() {
			this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			}
	        this.render();
		},
		methods: {
			render() {
				this.columnsData=[];
               api.api('post',api.configUrl+'/hczz/zhb/queryList',this.basePage).then(res=>{
               	if(res.list){
               		 this.columnsData=res.list;
               	}
               	 this.total=res.total;
               	 this.loading=false;
               })
			},
			handleDate(val) {
				this.basePage.startDate = new Date(`${val[0]} 00:00:00`).getTime();
				this.basePage.endDate = new Date(`${val[1]} 23:59:59`).getTime();
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
  	.ivu-date-picker .ivu-select-dropdown{
  		margin-left: 308px;
  	}
  }
</style>