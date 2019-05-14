<template>
	<div class="person">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" :model="formDynamic" inline class="searchForm">
				<FormItem label="通讯号码：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.sjhm" placeholder="请输入通讯号码"></Input>
				</FormItem>
				<FormItem label="归属人：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.gsr" placeholder="请输入归属人"></Input>
				</FormItem>
				<FormItem label="归属地：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.gsd" placeholder="请输入归属地"></Input>
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
			<addModalPhones :show="show" @update="update" :phoneId="phoneId"></addModalPhones>
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
	import addModalPhones from './addPhone';
	export default {
		components:{
			addModalPhones
		},
		data() {
			return {
				formDynamic: {
					sjhm: '',
					gsr: '',
					gsd: '',
				},
				columns: [{
						title: '序号',
						align: 'center',
						type: 'index',
						width:65
					},
					{
						title: '通讯号码',
						align: 'center',
						key: 'sjhm',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '归属人',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						key:'gsr'
					},
					{
						title: '归属地',
						align: 'center',
						key: 'gsd',
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
						key: 'cjsj',
						ellipsis: true,
						minWidth: 100
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
											this.phoneId=params.row.id;
										}
									}
								}, '编辑 '),
								h('a', {
									on: {
										click: () => {
											this.phoneId=params.row.id;
											this.overDeterShow=true;
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
				show:false,
				phoneId:'',
				overDeterShow:false
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.render();
				this.height = $(window).height() -$('.searchForm').height()- 400;
				this.changeData();
			})
		},
		methods: {
			render() {
				this.loading=true;
				let pageraj={};
				pageraj={
					pagesize:this.basePage.pageSize,
					pageindex:this.basePage.pageNumber,
					sjhm:this.formDynamic.sjhm,
					gsd:this.formDynamic.gsd,
					gsr:this.formDynamic.gsr,
					sqid:this.$route.query.id
				}
               api.api('post',api.configUrl+'/hczz/gl/gltxhm/queryGltxhmList',pageraj).then(res=>{
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
				this.show=false;
			},
			addBtn(){
				this.show=true;
				this.phoneId=null;
			},
			cancelBtn(){
				let  del={dellst:[this.phoneId]};
				api.api('post',api.configUrl+'/hczz/gl/gltxhm/deleteGltxhm',del).then(res=>{
        			this.overDeterShow=false;
        			this.render();
        		})
			}
		}
	}
</script>
<style lang="less">
  
</style>