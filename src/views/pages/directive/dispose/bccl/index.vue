<template>
	<el-card class="directive-ct directive-signIn-ct">
			<Form inline :label-width="75" class="search-ct theinput">
					<FormItem label="指令名称：">
						<Input type="text" v-model="basePage.zlmc" placeholder="请输入指令名称" style="width:180px"></Input>
					</FormItem>
					<FormItem label="下发人：">
						<Input type="text" v-model="basePage.xfrxm" placeholder="请输入下发人" style="width:180px"></Input>
					</FormItem>
					<FormItem label="下发时间：">
						<DatePicker type="daterange" :start-date="new Date(new Date()-30*24*3600*1000)" placement="bottom-end" placeholder="请输入下发时间" style="width: 180px" @on-change="handleDate"></DatePicker>
					</FormItem>
					<FormItem label="状态：">
						<Select v-model.trim="basePage.zt" style="width:180px">
							<Option v-for="item in statusSelect" :value="item.key" :key="item.key">{{item.label}}</Option>
						</Select>
					</FormItem>
					<FormItem label="指令级别：">
						<Select v-model="basePage.zljb" style="width:180px">
							<Option v-for="item in zljbselect" :value="item.id" :key="item.id">{{ item.zljblxmc}}</Option>
						</Select>
					</FormItem>
					<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form>
			<div class="table-ct">
			 <el-table :data='list' :stripe="true" height="100%" v-loading="loading"  element-loading-spinner="demo-table-icon-load">
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
							<span :title="scope.row.jsdwmc">{{scope.row.zlmc}}</span>
						</template>
					</el-table-column>
					<el-table-column label="指令类型" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.zlmc">{{scope.row.zlmc}}</span>
						</template>
					</el-table-column>
					<el-table-column label="下发时间" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.czsj">{{scope.row.czsj|timestampToTime}}</span>
						</template>
					</el-table-column>
					<el-table-column label="当前状态" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.spzt">{{scope.row.zt|formatSelect(statusSelect)}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope" >
							<a href="javascript:void(0)" @click="handleRow(scope.row)">处理</a>
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
import { toNull, tableToLine, lineToNull } from "@/libs/common/common.js";
import signInModal from "./signInModal.vue";
export default {
  name: "dicTypeManager",
  components: {
    signInModal
  },
  data() {
    return {
		list: [],
		loading: false,
        basePage: {
            pageindex: 1,
		    pagesize: 10,
		    starttime:null,
		    endtime:null,
		    zt:null,
        },
        pageArray: [10, 20, 30, 40],
	    total: 0,
	    statusSelect: [
            { label: "待签收", key: "1" },
            { label: "待反馈", key: "2" },
            { label: "已反馈", key: "3" },
            { label: "待评价", key: "4" }
	    ],
	    zljbselect: [],
	    isSignIn: false,
	    directiveInfo:{}
        };
  },
  created() {
	this.initSelect();
    this.rendtable();
  },
  methods: {
		initSelect() {
      api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/queryZlsxpzAll").then(res => {
        this.zljbselect = res;
      });
    },
    rendtable() {
			this.loading = true
			api.api('post',api.configUrl+'/hczz/zl/queryZldwdlList',this.basePage).then(res=>{
				this.list = res.list;
				this.total = res.total;
				this.loading = false
			})
		},
    handleRow(val) {
    	    console.log(val)
			this.directiveInfo = JSON.parse(JSON.stringify(val));
			console.log(this.directiveInfo)
			this.isSignIn = true;
    },
    //搜索
    search() {
      this.basePage.pageindex = 1;
      this.rendtable();
	},
	handleDate(val) {
      this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
      this.basePage.endtime = new Date(`${val[1]} 23:59:59`);
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
<style lang="less">
.directive-signIn-ct {
	/*.seacrh-row {
		width: 100%;
		display: flex;
		justify-content: center;
		.ivu-form-item{
			margin-bottom: 15px;
		}
		.search-btn-ct {
			width: 255px;
			text-align: right;
			margin-right: 10px;
		}
	}*/
    .table-ct{
      height: calc(~'100% - 155px');
    }
  }
</style>