<template>
	<div class="person">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" :model="formDynamic" inline>
				<FormItem label="名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.ajbh" placeholder="请输入接警单编号"></Input>
				</FormItem>
				<FormItem label="部门：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.ajmc" placeholder="请输入报警内容"></Input>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	export default {
		components:{
			
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
						title: '人员类型',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '姓名',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						key:'slsj'
					},
					{
						title: '证件类型',
						align: 'center',
						key: 'jyaq',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '证件号码',
						align: 'center',
						key: 'ajlbMc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '创建人',
						align: 'center',
						key: 'ajztMc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '创建时间',
						align: 'center',
						key: 'ajztMc',
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
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.render();
				this.height = $(window).height() - 360;
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
				this.render();
			}
		}
	}
</script>
<style lang="less">
  
</style>