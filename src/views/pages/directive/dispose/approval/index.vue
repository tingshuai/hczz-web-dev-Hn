<template>
	<el-card class="directive-ct directive-signIn-ct" style="min-width:1150px;width:100%">
		<div class="directive-check-ct">
			<Form inline :label-width="90" class="theinput specialForm">
				<FormItem label="指令名称：">
					<Input type="text" v-model="basePage.productName" placeholder="请输入指令名称" style="width:180px" clearable></Input>
				</FormItem>
				<FormItem label="下发人：">
					<Input type="text" v-model="basePage.startUserName" placeholder="请输入下发人" style="width:180px"  clearable></Input>
				</FormItem>
				<FormItem label="下发时间：">
					<DatePicker type="daterange" :start-date="new Date(new Date()-30*24*3600*1000)" placement="bottom-end" placeholder="请输入下发时间" style="width: 180px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="状态：">
					<Select v-model="basePage.zt" style="width:180px">
						<Option v-for="item in statusSelect" :value="item.key" :key="item.key">{{item.label}}</Option>
					</Select>
				</FormItem>
				<FormItem label="指令级别：">
					<Select v-model="basePage.dictTypeName" style="width:180px" clearable>
						<Option v-for="item in zljbselect" :value="item.id" :key="item.id">{{ item.zljblxmc}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct" :height="height">
				<el-table :data='data' :stripe="true" width='100%' :height="height" v-loading="loading" element-loading-spinner="demo-table-icon-load">
					<el-table-column label="指令编号" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.busId">{{scope.row.zlwh}}</span>
						</template>
					</el-table-column>
					<el-table-column label="下发人" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.startUserName">{{scope.row.startUserName}}</span>
						</template>
					</el-table-column>
					<el-table-column label="指令名称" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.zlmc">{{scope.row.zlmc}}</span>
						</template>
					</el-table-column>
					<el-table-column label="指令级别" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.zljb | jbFilter">{{scope.row.zljb | jbFilter}}</span>
						</template>
					</el-table-column>
					<el-table-column label="接收部门" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.czrdwmc">{{scope.row.czrdwmc}}</span>
						</template>
					</el-table-column>
					<el-table-column label="指令类型" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.zllxmc">{{scope.row.zllxmc}}</span>
						</template>
					</el-table-column>
					<el-table-column label="下发时间" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.createTime|timestampToTime">{{scope.row.createTime|timestampToTime}}</span>
						</template>
					</el-table-column>
					<el-table-column label="当前状态" align="center">
						<template slot-scope="scope">
							<span style="color:#ed7601">待审批</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<a href="javascript:void(0)" @click="handleRow(scope.row)">处理</a>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" style="margin-left: 10px;display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<div v-if="isDispose">
				<dispose-modal :show.sync="isDispose" :directiveInfo.sync="directiveInfo" @refreshPage="refreshPage" :title="title"></dispose-modal>
			</div>
		</div>
	</el-card>
</template>
<script>
	var vm;
	import api from "@/fetch/api.js";
	import { toNull, tableToLine, lineToNull } from "@/libs/common/common.js";
	import disposeModal from "./disposeModal.vue";
	export default {
		name: "",
		components: {
			disposeModal
		},
		data() {
			vm=this;
			return {
				title:'',
				height:0,
				disabled: true,
				data: [],
				zljbselect: [],
				deleteModal: false, // 删除模态框
				deleteModal_loading: false, // 删除模态框点击确认时添加loading样式
				loading: false,
				basePage: {
					pageindex: 1,
					pagesize: 10,
					gzllx: 2
				},
				pageArray: [10, 20, 30, 40], // 每页显示的数量
				total: 0, // 分页显示的总数量
				isDispose: false,
				directiveInfo: {},
				statusSelect: [{
						label: "待审批",
						key: "1"
					},
					{
						label: "已审批",
						key: "2"
					},
					
				],
			};
		},
		mounted () {
			 this.height = ($(window).height() - 250) -($('.specialForm').height())+'px'
	        const that = this;
	        window.onresize = function () {
				 that.height = ($(window).height() -250)-($('.specialForm').height()) +'px';
	        };
		},
		created() {
			this.initSelect();
			this.rendtable();
			this.height = ($(window).height() - 250) -($('.specialForm').height())+'px'
	        const that = this;
	        window.onresize = function () {
				 that.height = ($(window).height() -250)-($('.specialForm').height()) +'px';
	        }
		},
		filters:{
			jbFilter(val){
				if(val){
					return vm.zljbselect.find(item => item.id == val).zljblxmc
				}
            	 
			}
		},
		methods: {
			async rendtable() {
				this.loading = true
				await this.requestWorkflow()
				let res = this.handleWfId()
				if(res.buslst.length){
					await this.requestdirName(res)
				}
				this.loading = false;
			},
			requestWorkflow() {
				return new Promise(resolve => {
					api.api("post", `${api.configUrl}/hczz/gzl/queryMyUpcomingList`, this.basePage).then(res => {
						this.data = res.result;
						this.total = res.total;
						resolve()
					})
				})
			},
			handleWfId() {
				let pforspdetail = {
					gzllx: 2,
					buslst: []
				}
				this.data.forEach(item => {
					pforspdetail.buslst.push(item.busId)
				})
				return pforspdetail
			},
			requestdirName(params) {
				return new Promise(resolve => {
					const merge = (a, b) => [...a.concat(b).reduce((t, c) => {
						let sid = c.busId || c.id
						return t.set(sid, Object.assign(t.get(sid) || {}, c))
					}, new Map()).values()]
					api.api("post", `${api.configUrl}/hczz/gzl/getSpDetail`, params).then(res => {
						this.data = merge(this.data, res);
						resolve()
					});
				})
			},
			initSelect() {
				api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/queryZlsxpzAll").then(res => {
					this.zljbselect = res;
				});
			},
			handleRow(val) {
				console.log(val,"aaaa");
				
				this.directiveInfo = val;
				this.isDispose = true;
			},
			//搜索
			search() {
				this.basePage.pageindex = 1;
				this.rendtable();
			},
			// 每页数量变化触发的函数
			pagesizeChange(val) {
				this.basePage.pagesize = val;
				this.rendtable();
			},
			// 变换页码时触发的函数
			pageChange(val) {
				this.basePage.pageindex = val;
				this.rendtable();
			},
			handleDate(val) {
				this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
				this.basePage.endtime = new Date(`${val[1]} 23:59:59`);
			},
			// 刷新页面
			refreshPage() {
				this.rendtable();
			}
		}
	};
</script>
<style lang="less" scoped>
	.directive-check-ct {
		height: 100%;
		padding-top: 10px;
	}
</style>