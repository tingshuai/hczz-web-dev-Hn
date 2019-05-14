<template>
	<div class="dailyCooperate">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" inline>
				<FormItem label="案事件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案事件名称"></Input>
				</FormItem>
				<FormItem label="申请人：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqrxm" placeholder="请输入申请人"></Input>
				</FormItem>
				<FormItem label="申请时间：" :label-width="84">
				    <DatePicker type="daterange" :start-date="new Date(new Date()-30*24*3600*1000)" clearable placement="bottom-end" placeholder="请选择申请时间" style="width: 200px" @on-change="handleDate"></DatePicker>
			    </FormItem>
				<FormItem label="当前状态：" :label-width="84" class="ztInput">
					<Select v-model.trim="basePage.sxzt">
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="show">
				<Modal ref="modal" :show="show" @update="update" :rowObj="rowObj"></Modal>
			</div>
		</div>
	</div>
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
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',[
									h('p',{
										style:{
											color:params.row.sxzt==0 ? 'orange' :'green'
										}
									},params.row.sxzt==0?'待补充材料':'已补充')
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
								}, params.row.sxzt==0?'处理 ':'查看')
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
					id: '',
					sxzt: 'all',
					sqrxm:'',
					starttime:null,
					endtime:null,
                    ywlx:api.ywlx.rc
				},
				total: 0,
				loading: false,
				height: 0,
				title: '',
				typeList:[{
					code:'all',
					title:'全部'
				},{
					code:'0',
					title:'待补充材料'
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
			this.$nextTick(() => {
				this.render();
				this.height = $(window).height()-$('form').height() - 250+'px';
				this.changeData();
			})
		},
		methods: {
			render() {
				api.api('post',api.configUrl+'/hczz/za/querySqxxList',this.basePage).then(res=>{
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
				this.basePage.starttime=new Date(`${val[0]} 00:00:00`).getTime();
				this.basePage.endtime=new Date(`${val[1]} 23:59:59`).getTime()
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