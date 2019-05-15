<template>
	<el-card class="directive-ct directive-signIn-ct">
		<Form inline :label-width="75" class="search-ct">
			<FormItem label="指令名称：">
				<Input type="text" v-model="basePage.zlmc" placeholder="请输入指令名称" style="width:180px" clearable></Input>
			</FormItem>
			<FormItem label="下发人：">
				<Input type="text" v-model="basePage.xfrxm" placeholder="请输入下发人" style="width:180px" clearable></Input>
			</FormItem>
			<FormItem label="下发时间：">
				<DatePicker type="daterange"   placement="bottom-end" placeholder="请输选择下发时间" style="width: 180px" @on-change="handleDate"></DatePicker>
			</FormItem>
			<FormItem label="状态：">
				<Select v-model.trim="basePage.zt" style="width:180px" clearable fliterable>
					<Option v-for="item in statusSelect" :value="item.key" :key="item.key">{{item.label}}</Option>
				</Select>
			</FormItem>
			<FormItem label="指令级别：">
				<Select v-model="basePage.zljb" style="width:180px" clearable fliterable>
					<Option v-for="item in zljbVaildSelect" :value="item.id" :key="item.id">{{ item.zljblxmc}}</Option>
				</Select>
			</FormItem>
			<Button type="primary" class="searchBtn" @click="search">查询</Button>
		</Form>
		<div class="table-ct" :style="{height:height}">
			<el-table class="myTable" :data='list' :stripe="true" height="100%" v-loading="loading" element-loading-spinner="demo-table-icon-load" :row-class-name="tableRowClassName">
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
				<el-table-column label="下发时间" align="center">
					<template slot-scope="scope">
						<span :title="scope.row.czsj|timestampToTime">{{scope.row.czsj|timestampToTime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="当前状态" show-overflow-tooltip align="left" width="150px">
					<template slot-scope="scope">
						<span v-if="scope.row.lx==1" :title="scope.row.spzt">{{scope.row.zt|formatSelect(statusSelect)}}</span>
						<span v-if="scope.row.lx==2" :title="scope.row.spzt">抄送</span>
						<Icon v-if="scope.row.zt == 1 || scope.row.zt == 2" type="ios-alarm-outline" />						
						<span style="font-size:12px;" v-if="scope.row.zt == 1">{{ scope.row.showTimeQs || "00:00:00" }}</span>
						<span style="font-size:12px;" v-if="scope.row.zt == 2">{{ scope.row.showTimeFk || "00:00:00" }}</span>
					</template>					
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<a href="javascript:void(0)" v-if="scope.row.lx==1 && scope.row.zt<3" @click="handleRow(scope.row)">处理</a>
						<a href="javascript:void(0)" v-if="scope.row.lx!=1 || scope.row.zt>2" @click="handleRow(scope.row)">查看</a>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination-ct">
			<Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
		</div>
		<div v-if="isSignIn">
			<signIn-modal :show.sync="isSignIn" :directiveInfo.sync='directiveInfo' @refreshPage="refreshPage"></signIn-modal>
		</div>
	</el-card>
</template>
<script>
	import api from "@/fetch/api.js";
	import { toNull, tableToLine, lineToNull, timestampToTime } from "@/libs/common/common.js";
	import signInModal from "./signInModal.vue";
	export default {
		name: "dicTypeManager",
		components: {
			signInModal
		},
		data() {
			return {
				height:'',
				list: [],
				loading: false,
				basePage: {
					pageindex: 1,
					pagesize: 10,
					starttime: null,
					endttime: null,
					zt: null
				},
				pageArray: [10, 20, 30, 40],
				total: 0,
				statusSelect: [{
						label: "待签收",
						key: "1"
					},
					{
						label: "待反馈",
						key: "2"
					},
					{
						label: "已反馈",
						key: "3"
					},
					{
						label: "已评价",
						key: "4"
					},
					//			{ label: "待签收", key: "5" }
				],
//				zljbselect: [],
                zljbVaildSelect:[],
				isSignIn: false,
				directiveInfo: {}
			};
		},
		created() {
			this.initSelect();
			this.rendtable();
		},
		mounted(){
			this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 250 + 'px';
			}
		},
		methods: {
			timeDown(){
				clearInterval( this.interval );
				this.interval = setInterval(() => {
					this.list.forEach((row,i,arr) => {
						let _qs = new Date(row.qsdqsj || row.qssj).getTime() - Date.now();
						let _fk = new Date(row.fkdqsj || row.fksj).getTime() - Date.now()
						
						_qs < 1000 ? this.$set(arr[i],"showTimeQs","00:00:00") : this.$set(arr[i],"showTimeQs",this.formatDuring(_qs) );
						_fk < 1000 ? this.$set(arr[i],"showTimeFs","00:00:00") : this.$set(arr[i],"showTimeFk",this.formatDuring(_fk) );
					});
				}, 1000);
			},
			tableRowClassName({row, rowIndex}) {
				let _timefksj = new Date( row.qsdqsj || row.qssj ).getTime() - Date.now();
				let _timeqssj = new Date( row.fkdqsj || row.fksj ).getTime() - Date.now();
				if (( row.zt === "1" && _timeqssj < 3600*1000 && _timeqssj > 1000 )||( row.zt === "2" && _timefksj < 3600*1000 && _timefksj > 1000 )) {//待签收待反馈低于1小时...
					return 'nearly'
				}else if( ( row.zt === "1" && _timeqssj < 1000 )||( row.zt === "2" && _timefksj < 1000 )){//代签收待反馈超时....
					return "chaoshi"
				}else{
					return 'white';
				}
			},
			formatDuring(mss) {
				var hours = parseInt(mss / (1000 * 60 * 60) );
				var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = (mss % (1000 * 60)) / 1000;
				return ( hours<10 ? `0${hours}` : hours ) + ":" + (parseInt(minutes)<10 ? `0${minutes}` : minutes) + ":" + (parseInt(seconds)<10 ? `0${parseInt(seconds)}` : parseInt(seconds) );
			},			
			initSelect() {
//				api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/queryZlsxpzAll").then(res => {
//					this.zljbselect = res;
//				});
                api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/getZlsxpzList",{"type":'1'}).then(res => {
                    this.zljbVaildSelect = res;
                });
			},
			rendtable() {
				this.loading = true
				api.api('post', api.configUrl + '/hczz/zl/queryZldwdlList', this.basePage).then(res => {
					this.list = res.list;
					this.total = res.total;
					this.loading = false
				})
			},
			handleRow(val) {
				this.directiveInfo = JSON.parse(JSON.stringify(val));
				this.isSignIn = true;
			},
			//搜索
			search() {
				this.basePage.pageindex = 1;
				this.rendtable();
			},
			handleDate(val) {
				if(val[0] != '') {
					this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
					this.basePage.endttime = new Date(`${val[1]} 23:59:59`);
				} else {
					this.basePage.starttime = '';
					this.basePage.endttime = '';
				}
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
			}
		}
	};
</script>
<style lang="less" scoped>
	.myTable{
		/deep/ .chaoshi {
			background: #faa6a7;
		}
		/deep/ .nearly {
			background: #ffddab;
		}
		/deep/ .over{
			background:white;
		}
		.orSpan {
			color: orange;
		}
		.blSpan {
			color: #333333;
		}
	}
</style>