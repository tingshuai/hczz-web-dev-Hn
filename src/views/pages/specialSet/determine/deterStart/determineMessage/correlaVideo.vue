<template>
	<div class="person">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" :model="formDynamic" inline class="searchForm">
				<FormItem label="视频名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.ajbh" placeholder="请输入视频名称"></Input>
				</FormItem>
				<FormItem label="视频唯一名称" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.ajmc" placeholder="请输入视频唯一名称"></Input>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
				<Button type="primary" class="searchBtn" @click="addVideo">增加</Button>
			</Form>
			<div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<add-video :show="show" @update="update" :vidoId="vidoId"></add-video>
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
	import addVideo from './addVideo';
	export default {
		components:{
			addVideo
		},
		data() {
			return {
				formDynamic: {
					ajbh: '',
					ajmc: '',
					jyaq: '',
				},
				columns: [{
						title: '序号',
						align: 'center',
						key: 'ajbh',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '视频名称',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '视频唯一名称',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						key:'slsj'
					},
					{
						title: '备注',
						align: 'center',
						key: 'jyaq',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '创建人',
						align: 'center',
						key: 'ajlbMc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '创建时间',
						align: 'center',
						key: 'cjr',
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
											
										}
									}
								}, '发起 ')
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
				ajbh:'',//涉案编号
				activeName:0,
				activeMessage:0,
				show:false,
				overDeterShow:false,
				vidoId:''
			}
		},
		computed:{
			active(){
				return this.activeName+this.activeMessage
			}
		},
		watch:{
			'$store.state.app.activeName'(val){
				if(val=='message'){
					this.activeName=1;
				}else{
					this.activeName=0;
				}
			},
			'$store.state.app.activeMessage'(val){
				if(val=='video'){
					this.activeMessage=1;
				}else{
					this.activeMessage=0;
				}
			},
			active(val){
				if(val==2){
					this.render();
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
//				this.render();
				this.height = $(window).height() -$('.searchForm').height()- 400;
				this.changeData();
			})
		},
		methods: {
			render() {
				this.loading=true;
				let pageraj={};
				if(this.formDynamic.time!=null){
					pageraj={
						pagesize:this.basePage.pageSize,
						pageindex:this.basePage.pageNumber,
						ajbh:this.formDynamic.ajbh,
						ajmc:this.formDynamic.ajmc,
						jyaq:this.formDynamic.jyaq,
						starttime:new Date(this.formDynamic.time[0]).getTime(),
						endtime:new Date(this.formDynamic.time[1]).getTime(),
					}
				}else{
					pageraj={
						pagesize:this.basePage.pageSize,
						pageindex:this.basePage.pageNumber,
						ajbh:this.formDynamic.ajbh,
						ajmc:this.formDynamic.ajmc,
						jyaq:this.formDynamic.jyaq,
						starttime:'',
						endtime:'',
					}
				}
               api.api('post',api.configUrl+'/hczz/ajjbxx/queryAjjbxxList',pageraj).then(res=>{
               	if(res.total==0){
               		this.columnsData=[];
               		this.total=0;
               	}
               	 this.columnsData=res.list;
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
				this.show=false;
				this.render();
			},
			cancelBtn(){
				
			},
			addVideo(){
				this.show=true;
			}
		}
	}
</script>
<style lang="less">
  
</style>