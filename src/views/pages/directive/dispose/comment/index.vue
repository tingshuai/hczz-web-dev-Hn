<template>
	<el-card class="directive-ct directive-signIn-ct">
		<Form inline :label-width="75" class="search-ct">
			<div>
				<FormItem label="指令名称：">
					<el-input v-model.trim="basePage.zlmc" placeholder="请输入指令名称" clearable size="small" style="width: 180px"></el-input>
				</FormItem>
				<FormItem label="下发人：">
					<el-input v-model.trim="basePage.xfrxm" placeholder="请输入下发人" clearable size="small" style="width: 180px"></el-input>
				</FormItem>
				<FormItem label="下发时间：">
					<DatePicker type="daterange"     placement="bottom-end" placeholder="请输入下发时间" style="width: 180px" @on-change="handleDate"></DatePicker>
				</FormItem>
				<FormItem label="状态：">
					<el-select v-model="basePage.zt" clearable filterable size="small" placeholder="请选择状态" style="width: 180px">
						<el-option v-for="item in ztList" :key="item.key" :label="item.value" :value="item.key">
						</el-option>
					</el-select>
				</FormItem>
				<FormItem label="指令级别：">
					<el-select v-model="basePage.zljb" size="small" placeholder="请选择指令级别" style="width: 180px" clearable filterable>
						<el-option v-for="item in zljbVaildSelect" :key="item.id" :label="item.zljblxmc" :value="item.id">
						</el-option>
					</el-select>
				</FormItem>

				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</div>
		</Form>
		<div class="table-ct" :style="{height:height}">
			<el-table :data='list' :stripe="true" height="100%" v-loading="loading" element-loading-spinner="demo-table-icon-load">
				<!-- <el-table-column label="序号" align="center"
            type="index">
          </el-table-column> -->
				<el-table-column label="指令编号" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zlwh">{{scope.row.zlwh}}</span>
					</template>
				</el-table-column>
				<el-table-column label="下发人" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.xfrxm">{{scope.row.xfrxm}}</span>
					</template>
				</el-table-column>
				<el-table-column label="指令名称" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zlmc">{{scope.row.zlmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="接收部门" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.jsdwmc">{{scope.row.jsdwmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="指令类型" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zlmc">{{scope.row.zllxmc}}</span>
					</template>
				</el-table-column>
	<!-- <span :title="scope.row.czsj |timestampToTime">{{scope.row.czsj|timestampToTime}}</span> -->

				<el-table-column label="下发时间" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.czsj | timestampToTime">{{scope.row.czsj|timestampToTime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="当前状态" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.zt" :class="scope.row.zt==0 ? 'orSpan' : 'blSpan'">{{scope.row.zt|formatSelect(statusSelect)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="handleRow(scope.row)" v-if="scope.row.zt==0">处理</a>
						<a href="javascript:void(0)" @click="handleRow(scope.row)" v-else>查看</a>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination-ct">
			<Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
		</div>
		<div v-if="isComment">
			<comment-modal :show.sync="isComment" :directiveInfo.sync='directiveInfo' @refreshPage="refreshPage"></comment-modal>
		</div>
		<!--<div>
			<Modal :show.sync="isComment" :directiveInfo.sync='directiveInfo' @refreshPage="refreshPage"></Modal>
		</div>-->
	</el-card>
</template>
<script>
	import api from "@/fetch/api.js";
	import { toNull, tableToLine, lineToNull } from "@/libs/common/common.js";
	import commentModal from "./commentModal.vue";
	import Modal from "./Modal.vue";
	export default {
		name: "",
		components: {
			commentModal,
			Modal
		},
		data() {
			return {
				height:'',
				list: [],
				basePage: {
					pageindex: 1,
					pagesize: 10,
					zlmc: "",
					xfrxm: "",
					starttime: '',
					endttime: '',
					zljb: '',
					zt: ''
				},
				loading: false,
				pageArray: [10, 20, 30, 40],
				total: 0,
				statusSelect: [{
						label: "待评价",
						key: "0"
					},
					{
						label: "已评价",
						key: "1"
					}
				],
				ztList: [{
					key:'0',
					value:'待评价'
				},{
					key:'1',
					value:'已评价'
				}],
//				jbList: [],
                zljbVaildSelect:[],
				isComment: false,
				directiveInfo: {},
				show:false
			};
		},
		mounted(){
			this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			}
		},
		created() {
			this.rendtable();
			this.getZlType();
		},
		filters:{
			jbFilter(val){
				let arr=this.zllxList.filter(item=>{
					return val==item.code
				})
				return arr[0].title
			}
		},
		methods: {
			rendtable() {
				this.loading = true
				api
					.api("post", api.configUrl + "/hczz/zl/queryZlcgpjlList", this.basePage)
					.then(res => {
						this.list = res.list;
						this.total = res.total;
						this.loading = false
					});
			},
			handleDate(val) {
				console.log(val)
				this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
				this.basePage.endttime = new Date(`${val[1]} 23:59:59`);
				console.log(this.basePage.starttime)
				console.log(this.basePage.endtime)
			},
			handleRow(val) {
				this.directiveInfo = JSON.parse(JSON.stringify(val));
				// console.log(this.directiveInfo)
				this.isComment = true;
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
			pageChange(val) {
				this.basePage.pageindex = val;
				this.rendtable();
			},
			// 刷新页面
			refreshPage() {
				this.rendtable();
			},
			close(){
				this.show=false
			},
			kankan(){
				this.isComment = true;
			},
			getZlType(){
                api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/getVaildList").then(res => {
                    this.zljbVaildSelect = res;
                });
			}
		}
	};
</script>
<style lang="less">
	.directive-signIn-ct {
		.seacrh-row {
			width: 100%;
			display: flex;
			justify-content: center;
			.ivu-form-item {
				margin-bottom: 15px;
			}
			.search-btn-ct {
				width: 255px;
				text-align: right;
				margin-right: 10px;
			}
		}
		.table-ct {
			height: calc(~"100% - 185px");
			.orSpan{
				color: orange;
			}
			.blSpan{
				color: #333333;
			}
		}
	}
</style>