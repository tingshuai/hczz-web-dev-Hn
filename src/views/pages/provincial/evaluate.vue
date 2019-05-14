<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">	
		<!-- <div class="top">
			<el-form :inline="true" class="demo-form-inline theinput">
				<el-form-item label="案件名称：">
					<el-input v-model="basePage.ajmc" size="small" placeholder="请输入案件名称" clearable></el-input>
				</el-form-item>
				<el-form-item label="反馈人：">
					<el-input v-model="basePage.fkrxm" size="small" placeholder="请输入申请人" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
		</div> -->
		<Form inline :label-width="75" class="search-ct">
			<FormItem label="案事件名称：">
				<Input type="text" v-model="basePage.ajmc"  placeholder="请输入案事件名称" clearable style="width: 180px"></Input>
			</FormItem>
			<FormItem label="反馈人：">
				<Input type="text" v-model.trim="basePage.fkrxm" placeholder="请输入反馈人" clearable style="width: 180px"></Input>
			</FormItem>
			<FormItem label="申请时间：">
				<DatePicker type="daterange"   clearable placement="bottom-end" placeholder="请选择申请时间" style="width: 180px" @on-change="handleDate"></DatePicker>
			</FormItem>
			<Button type="primary" class="searchBtn" @click="search" style="margin-right:8px;">查询</Button>
		</Form>
		<Modelpj
			:visible="visible"
			:formValidate="formValidate"
			:xcObj="xcObj"
			:title="title"
			:isPj="isPj"
			:pjObj="pjObj"
			:dirTaskFileSX="dirTaskFileSX"
			:dirTaskFileRW="dirTaskFileRW"
			:dirTaskFile="dirTaskFile"
			@closeModel="closeModel"
			@saveInfo="saveInfo"
			@handlePrev="handlePrev"
		 >
		</Modelpj>
		<div class="table-ct" :style="{height:height}">
			<el-table :data='list' :stripe="true" height="100%">
				<el-table-column label="编号" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.sqwh">{{scope.row.sqwh}}</span>
					</template>
				</el-table-column>
				<el-table-column label="反馈人" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.fkrxm">{{scope.row.fkrxm}}</span>
					</template>
				</el-table-column>
				<el-table-column label="案事件名称" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.ajmc">{{scope.row.ajmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="简要任务内容" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.jyrwnr" class="sl">{{scope.row.jyrwnr}}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请时间" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span class="span-dqzt">{{scope.row.sqrq| timestampToTime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span class="span-dqzt" :title="scope.row.zt|pjFilter">{{scope.row.zt|pjFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<a class="a-czl" href="javascript:void(0)" v-if="scope.row.zt != 5" @click="add(scope.row)">评价</a>
						<a class="a-czl" href="javascript:void(0)" v-if="scope.row.zt == 5" @click="look(scope.row)">查看</a>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination-ct">
			<Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>

			<!-- <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="basePage.pageindex" :page-sizes="pageArray" :page-size="10" :total="total">
			</el-pagination> -->
		</div>
	</el-card>
</template>

<script>
	import {timestampToTime} from '@/libs/common/common';
	import api from '@/fetch/api.js';
	import Modelpj from './models/modelpj.vue';
	export default {
		data() {
			return {
				basePage: {
					orderby : "fksj desc",
					pageindex: 1,
					pagesize: 10,
					fkrxm: null,
					sqrxm: null,
                    ywlx:api.ywlx.qx,
					tszt: "0",
					starttime:'',
					endtime:'',
					// zt: '3'	
					lstzt:['3','5'],
				},
				pageArray: [10, 20, 30, 40],
				total: 0,
				list: [],
				height: 0,
				formValidate: {
					fksd: 0,
					fktd: 0,
					yyxg: 0,
					zhpjnr:null
				},
				visible: false,
				xcObj: {},
				dirTaskFile: [],//反馈附件
				title: '',
				pjObj: {},
				isPj: true,
				dirTaskFileSX: [],//手续附件
				dirTaskFileRW: [],//任务附件
			}
		},
		components:{
			Modelpj,
		},
		filters:{
            pjFilter(val){
				if(val==3){
					return '待评价'
				}else{
					return '已评价'
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.render();
				this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
				window.onresize = () => {
					this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
				}
			})
		},
		methods: {
			pageChange(val) {
					this.basePage.pageindex = val;
					this.render();
				},
				pagesizeChange(){
					this.basePage.pagesize = val;
					this.render();
			},
			render() {
				api.api('post', api.configUrl + '/hczz/qqxc/querySqxxList', this.basePage).then(res => {
					
					this.list = res.list;
					this.total = res.total;
				})
			},
			closeModel() {
				this.visible = false;
				this.formValidate.fwtd = null;
				this.formValidate.fksu = null;
				this.formValidate.yyxg = null;
				this.formValidate.zhpjnr=null;
			},
			saveInfo() {
				let pjxx = {
					sqid: this.xcObj.id,
					fwtd: this.formValidate.fwtd,
					fksu: this.formValidate.fksu,
					yyxg: this.formValidate.yyxg,
					sfpa: this.formValidate.sfpa,
					sffhzy: this.formValidate.sffhzy,
					zhrs: this.formValidate.zhrs,
					zhpjnr: this.formValidate.zhpjnr
				}
				api.api('post', api.configUrl + '/hczz/hc/pj/addPj', pjxx).then(res => {
					this.$message.success("评价成功");
					this.closeModel();
					this.render();
				})
			},
			add(val) {
				this.visible = true;
				this.isPj = true;
				this.title = "反馈评价";
				api.api('get', api.configUrl + '/hczz/qqxc/getDetailById', {
                    sqid: val.id
				}).then(res => {
					this.obj = res;
					this.xcObj = res.data;
				})
				this.getFile(val.id);
				this.getRWFile(val.id);
				this.getSXFile(val.id);
			},
			search() {
				this.basePage.pageindex = 1;
				this.render();
			},
			handleSizeChange(val) {
				this.basePage.pagesize = val;
				this.render();
			},
			handleCurrentChange(val) {
				this.basePage.pageindex = val;
				this.render();
			},
			getRWFile(id) {
				api.api('post', api.configUrl + '/hczz/fj/getFjData', {
					glid: id,
					tablename: 'T_HCZZ_SQXX',
					type: '2'
				}).then(res => {
					this.dirTaskFileRW = res;
				})
			},
			getSXFile(id) {
				api.api('post', api.configUrl + '/hczz/fj/getFjData', {
					glid: id,
					tablename: 'T_HCZZ_SQXX',
					type: '1'
				}).then(res => {
					this.dirTaskFileSX = res;
				})
			},
			getFile(id) {
				api.api('post', api.configUrl + '/hczz/fj/getFjData', {
					glid: id,
					tablename: 'T_HCZZ_SQXX',
					type: '3'
				}).then(res => {
					this.dirTaskFile = res;
				})
			},
			handlePrev(val) {
				api.upload(val);
			},
			look(val) {
				this.visible = true;
				this.isPj = false;
				this.title = "查看评价";
				api.api('post', api.configUrl + '/hczz/hc/pj/getPjDetal', {
					id: val.id
				}).then(res => {
					this.pjObj = res[0];
				})
				api.api('get', api.configUrl + '/hczz/qqxc/getDetailById', {
                    sqid: val.id
				}).then(res => {
					this.obj = res;
					this.xcObj = res.data;
				})
				this.getFile(val.id);
				this.getRWFile(val.id);
				this.getSXFile(val.id);
			},
			handleDate(val) {
				if(val[0]!=''){
					this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
					this.basePage.endtime = new Date(`${val[1]} 23:59:59`);
				}else{
					this.basePage.starttime = '';
					this.basePage.endtime = '';
				}
			}
		}
	}
</script>

<style>
	.sl {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.el-dialog .el-form-item__content .oSpan {
		word-break: break-all;
		line-height: 1.4;
		vertical-align: middle;
	}
</style>