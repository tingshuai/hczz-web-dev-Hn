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
					<DatePicker type="daterange"   placement="bottom-end" placeholder="请输入" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="当前状态：" :label-width="84">
					<Select v-model.trim="basePage.zt" filterable>
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct" :style="{height:height}">
				<Table style="height:100%;" :loading="loading" stripe :columns="columns" :data="columnsData" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" style="margin-top:10px" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="show">
				<Modal ref="modal" :title="title" :id="id" :task="task" :approveZt="approveZt" :show="show" @update="update"></Modal>
			</div>
	</el-card>
</template>

<script>
	import api from '@/fetch/api';
	import {timestampToTime} from '@/libs/common/common';
	import Modal from './modal';
	export default {
		components:{
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
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.sqrq))
						}
					},
					{
						title: '当前状态',
						align: 'center',
						key: 'status',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							if(params.row.ztName=='n'){
								return h('div','待审批')
							}else{
								return h('div','已审批')
							}
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
											this.show=true;
                                            this.title='编号：'+params.row.sqwh;
                                            this.id=params.row.id;
											this.task=params.row.task;
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
					startDate: '',
					endDate:'',
                    type:'1',
                    ywlx:api.ywlx.zb,
					zt:'n'
				},
				total: 0,
				loading: false,
				height: 0,
				typeList:[{
					code:'n',
					title:'待审批'
				},{
					code:'y',
					title:'已审批'
				}],
				title:'',
				id:'',
				task:{},
				show:false,
				approveZt:''
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
			timestampToTime(timestamp) {//时间戳转为YYYY-MM-DD
			    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			    var Y = date.getFullYear() + '-';
			    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			    var D = date.getDate()<10?'0'+date.getDate() + ' ': date.getDate() + ' ';
			    var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
			    var F = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
			    var S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
			    return Y + M + D;
			},
			render() {
				api.api('post',api.configUrl+'/hczz/hc/queryApproveList',this.basePage).then(res=>{
					this.loading=false;
					if(res.list){
						this.columnsData=res.list;
						this.columnsData.map(item=>{
							this.$set(item,'ztName',this.basePage.zt=='n'?'n' : 'y')
						})
					}else{
						this.columnsData=[];
					}
					this.total=res.total;
				})
			},
			handleDate(val) {
				this.basePage.startDate = new Date(val[0]).getTime();
				this.basePage.endDate = new Date(val[1]).getTime();
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
				this.show=false;
				if(value){
					this.render();
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