<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
			<Form ref="formDynamic" inline class="search-ct">
				<FormItem label="案事件名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.ajmc" placeholder="请输入案事件名称"></Input>
				</FormItem>
				<FormItem label="申请人：" :label-width="84">
					<Input type="text" clearable v-model.trim="basePage.sqr" placeholder="请输入申请人"></Input>
				</FormItem>
				<FormItem label="申请日期：" :label-width="84">
					<DatePicker type="daterange"   clearable placement="bottom-end" placeholder="请选择申请日期" style="width: 200px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="当前状态：" :label-width="84">
					<Select v-model.trim="basePage.zt" filterable>
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<FormItem label="资料提交：" :label-width="84">
					<Select v-model.trim="basePage.qrtj" filterable clearable>
						<Option v-for="item in zlList" :value="item.key" :key="item.key">{{item.value}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
				<Button type="primary" class="searchBtn" v-if="!isPl" @click="plClick">批量操作</Button>
				<Button type="primary" class="searchBtn" v-if="isPl" @click="bjClick">标记为是</Button>
				<Button type="primary" class="searchBtn" v-if="isPl" @click="cancelBtn">取消</Button>
			</Form>
			<!-- <div class="margin-bottom-20">
				<Button type="primary" class="searchBtn" v-if="!isPl" @click="plClick">批量操作</Button>
				<Button type="primary" class="searchBtn" v-if="isPl" @click="bjClick">标记为是</Button>
				<Button type="primary" class="searchBtn" v-if="isPl" @click="cancelBtn">取消</Button>
			</div> -->
			<!--<div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>-->
			<div class="table-ct" :style="{height:height}">
				<el-table :data="columnsData" :stripe="true" style="width: 100%;height:100%" @selection-change="selectChange">
					<el-table-column type="selection" width="" v-if="isPl">
					</el-table-column>
					<el-table-column label="编号"  width="" align="center">
						<template slot-scope="scope">{{ scope.row.sqwh }}</template>
					</el-table-column>
					<el-table-column  label="申请人" width="" align="center">
						<template slot-scope="scope">{{ scope.row.sqr }}</template>
					</el-table-column>
					<el-table-column  label="案事件名称" align="center">
						<template slot-scope="scope">{{ scope.row.ajmc }}</template>
					</el-table-column>
					<el-table-column  label="申请时间" width="" align="center">
						<template slot-scope="scope">{{ scope.row.sqrq | timestampToTime}}</template>
					</el-table-column>
					<el-table-column  label="当前状态" width="" align="center">
						<template slot-scope="scope" >{{ scope.row.zt|ztFilter}}</template>
					</el-table-column>
					<el-table-column label="资料提交" width="" align="center">
						<template slot-scope="scope">{{ scope.row.qrtj | zlFilter}}</template>
					</el-table-column>
					<el-table-column  label="操作" show-overflow-tooltip width="" align="center">
						<template slot-scope="scope">
							<span size="mini" v-if="scope.row.zt==4" @click="handleEdit(scope.row)" style="cursor: pointer;color: #397cbf;">处理</span>
							<span size="mini" v-if="scope.row.zt==5" @click="handleLook(scope.row)" style="cursor: pointer;color: #397cbf;">查看</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" style="margin-top:10px" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="show">
				<Modal ref="modal" :show="show" @update="update" :rowObj="rowObj"></Modal>
			</div>
		</el-card>
</template>

<script>
	import api from '@/fetch/api';
	import { timestampToTime } from '@/libs/common/common';
	import Modal from './modal';
	export default {
		components: {
			Modal
		},
		data() {
			return {
				columnsData: [],
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10,
					ajmc: '',
					sqrxm: '',
					zt: 'e',
					qrtj: '',
					endtime: null,
					starttime: null
				},
				total: 0,
				loading: false,
				height: 0,
				title: '',
				typeList: [{
					code:'e',
					title:'全部'
				},{
					code:'4',
					title:'待评价'
				},{
					code:'5',
					title:'已评价'
				}],
				id: '',
				show: false,
				rowObj: {},
				zlList: [{
					key: '0',
					value: '否'
				}, {
					key: '1',
					value: '是'
				}],
				isPl:false,
				selectList:[]
			}
		},
		filters:{
			zlFilter(val){
				switch (val){
					case '0':
					return '否';
						break;
					case '1':
						return '是';
						break;
					default:
						break;
				}
			},
			ztFilter(val) {
				switch(val) {
					case '4':
						return '待评价'
						break;
					case '5':
						return '已评价'
						break;
					default:
						break;
				}
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
				api.api('post', api.configUrl + '/hczz/zhb/queryList', this.basePage).then(res => {
					this.loading = false;
					if(res.list) {
						this.columnsData = res.list;
						this.total
					} else {
						this.columnsData = [];
					}
					this.total = res.total;
				})
			},
			search() {
				this.basePage.current = 1;
				this.basePage.pageindex = 1;
				this.render();
			},
			handleDate(val) {
				this.basePage.startDate = new Date(`${val[0]} 00:00:00`).getTime();
				this.basePage.endDate = new Date(`${val[1]} 23:59:59`).getTime()
			},
			pageChange(current) {
				this.basePage.current = current;
				this.basePage.pageindex = current;
				this.render();
			},
			pageSizeChange(current) {
				this.basePage.pagesize = current;
				this.render();
			},
			update(value) {
				this.show = false;
				this.render();
			},
			handleEdit(row){
				this.show = true;
				this.title = '编号:' + row.id;
				this.rowObj = row;
			},
			handleLook(row){
				this.show = true;
				this.title = '编号:' + row.id;
				this.rowObj = row;
				this.$nextTick(()=>{
					this.$refs.modal.disabled=true;
					this.$refs.modal.getPj();
				})
			},
			plClick(){
				this.isPl=true;
			},
			cancelBtn(){
				this.isPl=false;
				this.render();
			},
			selectChange(val){
				this.selectList=val;
			},
			bjClick(){
				let arr=[];
				this.selectList.map(item=>{
					arr.push(item.id)
				})
				api.api('get',api.configUrl+'/hczz/zhb/confirmSubmit?ids='+arr.join(',')).then(res=>{
					this.cancelBtn();
				})
			}
		}
	}
</script>
<style lang="less">
	.dailyCooperate {
		.ivu-form-item-content {
			width: auto;
		}
		.el-date-editor {
			height: 34px !important;
		}
		.el-date-editor .el-range__icon {
			line-height: 28px;
		}
		.el-date-editor .el-range-separator {
			line-height: 28px;
		}
	}
</style>