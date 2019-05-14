<template>
	<div class="dailyCooperate">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Button type="primary" @click="add" class="add">增加</Button>
			<div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="show">
				<Modal ref="modal"   :show="show" @update="update" :roleInfo="roleInfo" :zzid="zzid"></Modal>
			</div>
			<el-dialog
			  title="删除"
			  :visible="dialogVisible"
			  width="30%"
			  :modal-append-to-body='false'
			  @close="dialogVisible=false">
			  <span>确认删除该条信息</span>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
			    <el-button type="primary" @click="deleteSure" size="small">确 定</el-button>
			  </span>
			</el-dialog>
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
				columns: [
					{
						title: '执行人',
						align: 'center',
						key: 'zxrxm',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '执行部门',
						align: 'center',
						key: 'bmmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '有效开始时间',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.yxkssj))
						}
					},
					{
						title: '有效结束日期',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.yxjssj))
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
									on: {
										click: () => {
                                           this.show=true;
                                           this.zzid=params.row.id;
                                           this.roleInfo=params.row;
										}
									}
								}, '编辑 '),
								h('a', {
									on: {
										click: () => {
                                           this.dialogVisible=true;
                                           this.deleteId=params.row.id;
										}
									}
								}, '删除 ')
							])
						}
					}
				],
				columnsData: [],
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageNumber: 1,
					pageSize: 10
				},
				total: 0,
				loading: false,
				height: 0,
				title:'',
				taskid:'',
				show:false,
				roleInfo:{},
				zzid:'',
				dialogVisible:false,//删除模态框
				deleteId:''//删除该条的id
			}
		},
		mounted() {
			
			this.$nextTick(() => {
				this.changeData();
				this.render();
			})
			this.height = $(window).height() -330;
	        const that = this;
	        window.onresize = function temp () {
	            $('.menuNav').css('height', $(window).height() - 60 + 'px');
	            that.height = $(window).height() - 330;
	        };
		},
		methods: {
			render() {
				this.loading=true;
				api.api('post',api.configUrl+'/hczz/xtpz/zzpz/queryZzpzList',this.basePage).then(res=>{
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
			pageSizeChange(current){
				this.basePage.current=1;
				this.basePage.pageNumber=1;
				this.basePage.pagesize=current;
				this.render();
			},
			pageChange(current){
				this.basePage.current=1;
				this.basePage.pageNumber=current;
				this.render();
			},
			update(){
				this.show=false;
				this.render()
			},
			add(){
				this.show=true;
				this.zzid=null;

			},
			deleteSure(){
				let pfordelete={
					pfordelete:[]
				};
				let dellst=[];
				dellst.push(this.deleteId);
				pfordelete.dellst=dellst;
				api.api('post',api.configUrl+'/hczz/xtpz/zzpz/deleteZzpz',pfordelete).then(res=>{
					this.$message.success('删除成功');
					this.dialogVisible=false;
					this.render();
				})
			}
		}
	}
</script>
<style lang="less">
  .dailyCooperate {
	.ivu-table-overflowX {
		overflow-x: hidden;
  	}
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
  	.add{
  		margin-bottom: 20px;
  	}
  }
</style>