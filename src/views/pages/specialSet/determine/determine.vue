<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
			<Form ref="formDynamic"  inline class="search-ct">
				<FormItem label="案事件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案事件名称"></Input>
				</FormItem>
				<FormItem label="申请人：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqrxm" placeholder="请输入申请人"></Input>
				</FormItem>
				<FormItem label="申请时间：" :label-width="84">
					<DatePicker type="daterange"   placement="bottom-end" placeholder="请选择申请时间" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="当前状态：" :label-width="84" class="ztInput">
					<Select v-model.trim="basePage.zt" clearable @on-change="dqztChange">
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div  class="table-ct" :style="{height:height}">
				<Table style="height:100%" :loading="loading" stripe :columns="columns" :data="columnsData"  ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
	</el-card>
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
								status='待研判'
							}else if(params.row.zt<4){
								status='研判中'
							}else{
								status='已研判'
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
											let ztmc='';
											if(params.row.zt<2){
												ztmc='待研判'
											}else if(params.row.zt<4){
												ztmc='研判中'
											}else{
												ztmc='已研判'
											}
											this.$store.commit('setDeterId',params.row.id);
                                           this.$router.push({
                                           	path:'/specialStart',
                                           	query:{
                                           		id:params.row.id,
                                           		code:params.row.sqwh,
                                           		content:params.row.ajmc,
                                           		zt:ztmc,
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
					sqrxm: '',
					zt:'y',
					starttime: '',
					endtime:'',
                    ywlx:api.ywlx.za,
					tszt:'2'
				},
				total: 0,
				loading: false,
				height: 0,
				typeList:[{
					code:'1',
					title:'待研判'
				},{
					code:'2',
					title:'研判中'
				},{
					code:'e',
					title:'已研判'
				}]
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.$store.commit('setYpzt','');
				this.changeData();
				this.render();
				this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
				window.onresize = () => {
					this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
				}
			})
		},
		methods: {
			dqztChange(val){
				val ? null : this.basePage.zt = 'y';
			},			
			render() {
				this.columnsData=[];
               api.api('post',api.configUrl+'/hczz/za/querySqxxList',this.basePage).then(res=>{
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