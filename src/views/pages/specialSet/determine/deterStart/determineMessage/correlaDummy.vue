<template>
	<div class="person">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" :model="formDynamic" inline class="searchForm">
				<FormItem label="虚拟号码：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.xyhm" placeholder="请输入虚拟号码"></Input>
				</FormItem>
				<FormItem label="昵称：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.nc" placeholder="请输入昵称"></Input>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
				<Button type="primary" class="searchBtn" @click="addBtn">新增</Button>
			</Form>
			<div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<addModal :show="show" @update="update" :dummyId="dummyId"></addModal>
			<!--删除二次确认-->
			<Modal v-model="overDeterShow" title="确认删除" class="modal-ct"  :styles="{top: '250px',width:'250px'}" @on-cancel="overDeterShow=false">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="overDeterShow=false">取消</Button>
					<Button type="primary" class="sureBtn" @click="cancelBtn">确定</Button>
				</div>
				<div>
	                <h3>是否确认删除？</h3>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import addModal from './addDummy';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		components:{
			addModal
		},
		data() {
			return {
				formDynamic: {
					xyhm: '',
					nc: ''
				},
				columns: [{
						title: '序号',
						align: 'center',
						type: 'index',
						width:65
					},
					{
						title: '身份类型',
						align: 'center',
						key: 'sflx',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '虚拟号码',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						key:'xyhm'
					},
					{
						title: '昵称',
						align: 'center',
						key: 'nc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '创建人',
						align: 'center',
						key: 'cjr',
						ellipsis: true,
						minWidth: 100
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
											this.dummyId=params.row.id;
										}
									}
								}, '编辑 '),
								h('a',{
									on:{
										click:()=>{
											this.overDeterShow=true;
											this.dummyId=params.row.id;
										}
									}
								},'删除')
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
				show:false,
				overDeterShow:false,
				dummyId:''
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.changeData();
				this.render();
				this.height = $(window).height() -$('.searchForm').height()- 400;
			})
		},
		methods: {
			render() {
				this.loading=true;
				let pageraj={};
				pageraj={
					pagesize:this.basePage.pageSize,
					pageindex:this.basePage.pageNumber,
					xyhm:this.formDynamic.xyhm,
					nc:this.formDynamic.nc,
					sqid:this.$route.query.id
				}
               api.api('post',api.configUrl+'/hczz/gl/glxnsf/queryGlxnsfList',pageraj).then(res=>{
               	if(res.total==0){
               		this.columnsData=[];
               		this.total=0;
               	}
               	 if(res.list){
               	 	this.columnsData=res.list;
               	 }
               	 this.total=res.total;
               	 this.loading=false;
               })
			},
			search() {
               this.render();
			},
			pageChange(current) {
               this.basePage.current=current;
               this.basePage.pageNumber=current;
               this.render();
			},
			pageSizeChange(current) {
                this.basePage.pageSize=current;
                this.render();
			},
			update(){
				this.render();
			},
			addBtn(){
				this.show=true;
				this.dummyId=null;
			},
			update(){
				this.render();
				this.show=false;
			},
			cancelBtn(){
				let  del={dellst:[this.dummyId]};
				api.api('post',api.configUrl+'/hczz/gl/glxnsf/deleteGlxnsf',del).then(res=>{
        			this.overDeterShow=false;
        			this.render();
        		})
			}
		}
	}
</script>
<style lang="less">
  
</style>