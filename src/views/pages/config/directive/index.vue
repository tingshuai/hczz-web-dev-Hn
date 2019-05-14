<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
			<Form inline class="search-ct">
				<Button type="primary" class="searchBtn" @click="handleAdd" style="margin-bottom:20px">新增</Button>
			</Form>
			<div class="table-ct" :style="{height:height}">
        <el-table :data='configDirectiveList' :stripe="true" height="100%">
					<el-table-column label="序号" align="center" type="index">
					</el-table-column>
					<el-table-column label="指令级别名称" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.zljblxmc}}</span>
						</template>
					</el-table-column>
					<el-table-column label="签收时限" align="center">
						<template slot-scope="scope">
							<span>{{ Math.floor(scope.row.qssx/60) }}时{{ scope.row.qssx - Math.floor(scope.row.qssx/60)*60 }}分</span>
						</template>
					</el-table-column>
					<el-table-column label="反馈时限" align="center">
						<template slot-scope="scope">
							<span>{{ Math.floor(scope.row.fksx/60) }}时{{ scope.row.fksx - Math.floor(scope.row.fksx/60)*60 }}分</span>
						</template>
					</el-table-column>
					<el-table-column label="类型" align="center">
						<template slot-scope="scope">
							<span>{{ scope.row.type == '0' ? '请求' : '指令' }}</span>
						</template>
					</el-table-column>          
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<a href="javascript:void(0)" @click="editModal(scope.row)">编辑 | </a>
              <a href="javascript:void(0)" @click="deleteList(scope.row)">删除</a>
						</template>
					</el-table-column>
				</el-table>
				<!-- <Table @on-row-click='rowdetail' :loading="loading" stripe ref="selection" :columns="configDirectiveColumns" :data="configDirectiveList"></Table> -->
			</div>
			<div class="pagination-ct" style="overflow: hidden;">
				<Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<Modal v-model="deleteModal" width="300">
				<p slot="header" style="text-align:center">
					<Icon type="information-circled"></Icon>
					<span>删除确认</span>
				</p>
				<div style="text-align:center">
					<p>确认删除？</p>
				</div>
				<div slot="footer" class="font-size-0">
					<Button type="default" @click="deleteModal=false" class="cancelBtn">取消</Button>
					<Button type="primary" :loading="deleteModal_loading" @click="deleteModaldel" class="sureBtn">删除</Button>
				</div>
			</Modal>
      <div v-if="addModal">
          <add-modal :show.sync="addModal" @refreshTable="refreshTable" :directiveInfo.sync="directiveInfo"></add-modal>
      </div>
	</el-card>
</template>
<script>
import api from "@/fetch/api.js";
import { toNull, tableToLine, lineToNull } from "@/libs/common/common.js";
import addModal from "./addModal.vue";
export default {
  name: "",
  components: {
    addModal
  },
  data() {
    return {
      disabled: true,
      loading: false,
      height: 0,
      configDirectiveList:[],
      directiveInfo:{},
      deleteModal: false, // 删除模态框
      deleteModal_loading: false, // 删除模态框点击确认时添加loading样式
      deleteIds:[],
      addModal: false, // 新增模态框
      basePage: {
        pageindex: 1,
        pagesize: 10
      },
      pageArray: [10, 20, 30, 40], // 每页显示的数量
      total: 0, // 分页显示的总数量
      checkmodel: false, //,
    };
  },
  mounted() {
      this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
			}
  },
  created() {
    this.rendtable();
  },
  methods: {
      // 分页操作
    pagesizeChange(val) {
      this.basePage.pagesize = val;
      this.rendtable();
    },
    pageChange(val) {
      this.basePage.pageindex = val;
      this.rendtable();
    },
    //获取表格数据
    rendtable() {
      api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/queryZlsxpzList", this.basePage)
        .then(res => {
          this.configDirectiveList = res.list;
          this.total = res.total;
        });
    },
    //新增模态框
    handleAdd() {
      this.addModal = true;
    },
    //编辑模态框
    editModal(params) {
      this.directiveInfo = JSON.parse(JSON.stringify(params));
      this.addModal = true;
    },
    deleteBtn() {
      this.deleteModal = true;
    },
    rowdetail(){},
    deleteList(params){
      this.deleteIds.push(params.id);
      this.deleteModal= true;
    },
    deleteModaldel(){ 
      api.api('post', api.configUrl+'/hczz/xtpz/zlsxpz/deleteZlsxpz',{dellst:this.deleteIds}).then(res=>{
        this.$message.success('删除成功！！')
        this.deleteIds=[];
        this.deleteModal=false;
        this.refreshTable()
      })
    },
    refreshTable() {
      this.basePage= {
        pageindex: 1,
        pagesize: 10,
        dictType: "",
        dictTypeName: ""
      }
      this.rendtable()
    }
  }
};
</script>
<style lang="less">
  .config-directive {
    height: 100%;
    .table-ct {
      height: calc(~'100% - 80px');
      .ivu-table-wrapper {
        height: 100%;
      }
    }
  }
</style>
