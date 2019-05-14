<template>
	<div class="person">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" :model="formDynamic" inline class="searchForm">
				<FormItem label="车牌号码：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.hpph" placeholder="请输入车牌号码"></Input>
				</FormItem>
				<FormItem label="车主：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.cz" placeholder="请输入车主姓名"></Input>
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
			<!--新增车辆-->
			<addModals :show="show" :sqid="sqid" @update="update" @closeModal="closeModal" :carId="carId"></addModals>
			<!--二次删除确认-->
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
	import addModals from './addCar';
	import {timestampToTime} from '@/libs/common/common';
	
	export default {
		components:{
			addModals
		},
		data() {
			return {
				formDynamic: {
					hpph: '',
					cz: '',
					sqid:this.$route.query.id
				},
				sqid: '',	// 新增、查询都需要的id值
				columns: [{
						type: 'index',
						align: 'center',
						title:'序号',
						width: 65
					},
					{
						title: '号牌号码',
						align: 'center',
						key: 'hpph',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '号牌种类',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						key:'hpzl'
					},
					{
						title: '车辆类型',
						align: 'center',
						key: 'cllx',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '车身颜色',
						align: 'center',
						key: 'csys',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '车主',
						align: 'center',
						key: 'cz',
						ellipsis: true,
						minWidth: 70
					},
					{
						title: '联系方式',
						align: 'center',
						key: 'lxfs',
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
											this.carId=params.row.id;
										}
									}
								}, '编辑 '),
								h('a', {
									on: {
										click: () => {
											this.carId=params.row.id;
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
				overDeterShow:false,
				carId:''
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.sqid = this.$route.query.id
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
					hphm:this.formDynamic.hpph,
					cz:this.formDynamic.cz,
					//sqid:this.$store.state.app.deterId
					sqid: this.sqid
				}
               api.api('post',api.configUrl+'/hczz/gl/glcl/queryGlclList',pageraj).then(res=>{
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
			addBtn(){
				this.show=true;
				this.carId=null;
			},
			update(){
				this.render();
			},
			closeModal() {
				this.show=false;
			},
			cancelBtn(){
				let  del={dellst:[this.carId]};
				api.api('post',api.configUrl+'/hczz/gl/glcl/deleteGlcl',del).then(res=>{
        			this.overDeterShow=false;
        			this.render();
        		})
			}
		}
	}
</script>
<style lang="less">
  
</style>