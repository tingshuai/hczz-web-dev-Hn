<template>
	<div class="dailyCooperate">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix" style="min-width:1150px">
			<Form ref="formDynamic"  inline class="searchForm">
				<FormItem label="指令名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入选择部门"></Input>
				</FormItem>
				
				<FormItem label="起始日期：" :label-width="84">
					<DatePicker type="daterange"   placement="bottom-end" placeholder="请选择申请日期" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
			
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div>
				<Table :loading="loading" :stripe="true" :height="height" :columns="columns" :data="columnsData"  ref="table"></Table>
			</div>  
			<div class="pagination-ct">
				<Page class="clientPage" style="margin-top:2px" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		components:{
		},
		data() {
			return {
				columns: [{
						title: '部门',
						align: 'center',
						key: 'sqwh',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '已发起',
						align: 'center',
						key: 'sqr',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '待审批',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '待签收',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.sqrq))
						}
                    },
                    {
						title: '研判中',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},{
						title: '待评价',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},{
						title: '待战果总结',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},{
						title: '战果已总结',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},{
						title: '审批不通过',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},{
						title: '审批驳回并补充材料',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 150
					},
					// {
					// 	title: '当前状态',
					// 	align: 'center',
					// 	ellipsis: true,
					// 	minWidth: 100,
					// 	render:(h,params)=>{
					// 		let status='';
					// 		if(params.row.zt==1){
					// 			status='研判中'
					// 		}else if(params.row.zt>3 && params.row.zt<7){
					// 			status='已研判'
					// 		}else{
					// 			status='cccc'
					// 		}
					// 		return h('div',[
					// 			h('p',{
					// 				style:{
					// 					color:params.row.zt<4?'orange':'green'
					// 				}
					// 			},status)
					// 		])
							
					// 	}
					// },
					{
						title: '详情',
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
                                           this.$router.push({
                                           	path:'/fullTimeDetermineStart',
                                           	query:{
                                           		id:params.row.id,
                                           		code:params.row.sabjbh,
                                           		content:params.row.ajmc,
                                           		zt:this.ztmc,
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
					code:'4',
					title:'已研判'
				}],
				ztmc:''
			}
		},
		mounted() {
			this.height = $(window).height() - 330;
	        const that = this;
	        that.render();
	        window.onresize = function temp () {
	            $('.menuNav').css('height', $(window).height() - 60 + 'px');
	            that.height = $(window).height() - 330;
	        };

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
				this.basePage.starttime = new Date(`${val[0]} 00:00:00`).getTime();
				this.basePage.endtime = new Date(`${val[1]} 23:59:59`).getTime();
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
