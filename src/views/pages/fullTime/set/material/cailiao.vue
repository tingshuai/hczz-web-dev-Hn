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
				    <DatePicker type="daterange"   clearable placement="bottom-end" placeholder="请选择申请时间" style="width: 200px" @on-change="handleSqDate"></DatePicker>
			    </FormItem>
				<!-- <FormItem label="创建时间：" :label-width="84">
					<DatePicker type="daterange"   clearable placement="bottom-end" placeholder="请选择创建时间" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem> -->
				<FormItem label="当前状态：" :label-width="84" class="ztInput">
					<Select v-model.trim="basePage.blzt" clearable>
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct" :style="{height:height}">
				<Table style="height:100%" :loading="loading" stripe :columns="columns" :data="columnsData" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="show">
				<Modal ref="modal" :show="show" @update="update" :rowObj="rowObj"></Modal>
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
                        title: '创建时间',
                        align: 'center',
                        ellipsis: true,
                        minWidth: 100,
                        render:(h,params)=>{
                            return h('div',timestampToTime(params.row.cjsj))
                        }
                    },
					{
						title: '补录类型',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							if(params.row.bllx==1){
								return h('div','驳回补录')
							}
							else{
								return h('div','研判补录')
							}
						}
					},
					{
						title: '当前状态',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',[
									h('p',{
										style:{
											color:params.row.blzt==0 ? 'orange' :'green'
										}
									},params.row.blzt==0?'待补充':'已补充')
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
											this.show=true;
                                            this.rowObj=params.row;
										}
									}
								}, params.row.blzt==0?'处理 ':'查看')
							])
						}
					}
				],
				columnsData: [],
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex:1,
					pagesize:10,
					sxzt: 'all',
					sqr:'',
					startTime:null,
					endTime:null,
                    sqStartTime:null,
                    sqEndTime:null,
                    ywlx:api.ywlx.zb,
					blzt:'all'
				},
				total: 0,
				loading: false,
				height: 0,
				title: '',
				typeList:[{
					code:'0',
					title:'待补充'
				},{
					code:'1',
					title:'已补充'
				}],
				id:'',
				show:false,
				rowObj:{}
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
				let obj=Object.assign({},this.basePage);
				if(this.basePage.blzt=='all'){
					obj.blzt=null;
				}
				api.api('post',api.configUrl+'/hczz/hc/blrw/queryBlrwList',obj).then(res=>{
					this.loading=false;
					if(res.list){
						this.columnsData=res.list;
						this.total
					}else{
						this.columnsData=[];
					}
					this.total=res.total;
				})
			},
			handleDate(val){
				this.basePage.startTime=new Date(`${val[0]} 00:00:00`);
				this.basePage.endTime=new Date(`${val[1]} 23:59:59`)
			},
            handleSqDate(val){
                this.basePage.sqStartTime=new Date(`${val[0]} 00:00:00`);
                this.basePage.sqEndTime=new Date(`${val[1]} 23:59:59`)
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