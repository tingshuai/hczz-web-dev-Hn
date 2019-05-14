<template>
	<div class="person">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic"   inline class="searchForm">
				<FormItem label="姓名：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.xm" placeholder="请输入姓名"></Input>
				</FormItem>
				<FormItem label="身份证号：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.sfzh" placeholder="请输入身份证号码"></Input>
				</FormItem>
				<FormItem label="人员类型：" :label-width="84" style="width: 246px;">
					<Select v-model="formDynamic.rylx" clearable>
						<Option v-for="item in list" :key="item.key" :value="item.key">{{item.value}}</Option>
					</Select>
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
			<!--新增模态框-->
			<addModal :show="show" @update="update" :personId="personId"></addModal>
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
	import addModal from './addPerson';
	import {timestampToTime} from '@/libs/common/common';
	import {IdCodeValid} from '@/libs/common/check.js';
	export default {
		components:{
			addModal
		},
		data() {
			return {
				formDynamic: {
					rylx: '',
					sfzh: '',
					xm: '',
					sqid:''
				},
				columns: [{
						title: '序号',
						align: 'center',
						type: 'index',
						minWidth: 65
					},
					{
						title: '人员类型',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							if(params.row.rylx==0){
								return h('div','犯罪嫌疑人')
							}else{
								return h('div','受害人')
							}
						}
					},
					{
						title: '姓名',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						key:'xm'
					},
					{
						title: '证件类型',
						align: 'center',
						key: 'zjlx',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '证件号码',
						align: 'center',
						key: 'zjhm',
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
											this.personId=params.row.id;
										}
									}
								}, '编辑 '),
								h('a',{
									on:{
										click:()=>{
											this.overDeterShow=true;
											this.personId=params.row.id;
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
				list:[{
					key:0,
					value:'犯罪嫌疑人'
				},{
					key:1,
					value:'受害人'
				}],
				show:false,
				personId:'',
				overDeterShow:false
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.render();
				this.height = $(window).height() - $('.searchForm').height()-400;
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
					rylx:this.formDynamic.rylx,
					sfzh:this.formDynamic.sfzh,
					xm:this.formDynamic.xm,
					sqid:this.$route.query.id
				}
               api.api('post',api.configUrl+'/hczz/gl/glry/queryGlryList',pageraj).then(res=>{
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
//			update(){
//				this.render();
//			},
			addBtn(){
				this.show=true;
				this.personId=null;
			},
			update(){
				this.show=false;
				this.render();
			},
			cancelBtn(){
				let  del={dellst:[this.personId]};
				api.api('post',api.configUrl+'/hczz/gl/glry/deleteGlry',del).then(res=>{
        			this.overDeterShow=false;
        			this.render();
        		})
			}
		}
	}
</script>
<style lang="less">
  
</style>