<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
      <Form inline :label-width="80" class="search-ct">
        <FormItem label="工作流名称:" class="dicsizecode">
          <Input type="text" v-model="basePage.gzlmc" placeholder="请输入工作流名称" clearable></Input>
        </FormItem>
        <Button type="primary" class="searchBtn" @click="search">查询</Button>
        <Button type="primary" class="searchBtn" @click="handleAdd">配置工作流</Button>
      </Form>
      <div class="table-ct" :style="{height:height}">
        <el-table :data='data' :stripe="true" height="100%"  ref="table">
          <el-table-column label="编号" align="center" type="index">
          </el-table-column>
          <el-table-column label="产品模块名称" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.cpmkmc}}</span>
            </template>
          </el-table-column>
          <el-table-column label="工作流名称" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.gzlmc}}</span>
            </template>
          </el-table-column>
          <el-table-column label="工作流编号" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.gzlkey}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.zt|formatSelect(selectDate.workflowStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.czsj|timestampToTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="handleEdit(scope.row)">编辑 | </a>
              <a href="javascript:void(0)" @click="handleDelete(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-ct" style="">
        <Page class="clientPage" style="margin-left: 10px;display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
      </div>
      <div v-if="addModal">
        <add-modal :show.sync="addModal" @refreshTable="refreshPage" :approveInfo.sync="approveInfo"></add-modal>
      </div>
      <Modal v-model="deleteModal" class="lookStyle delStyle">
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
      height:0,
      selectDate: {
        workflowType: [
          { label: "日常工作流", key: "0" },
          { label: "专案工作流", key: "1" },
          { label: "指令工作流", key: "2" }
        ],
        workflowStatus: [
          { label: "需要审批", key: "1" },
          { label: "不需要审批", key: "0" }
        ]
      },
      data: [],
      basePage: {
        pageindex: 1,
        pagesize: 10,
        gzlmc:''
      },
      pageArray: [10, 20, 30, 40],
      total: 0,
      addModal: false,
      approveInfo: {},
      deleteModal: false,
      deleteModal_loading: false,
      dellst:{}
    };
  },

  mounted() {
    this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
      }
       this.rendtable();
  },
  methods: {
    rendtable() {
      api
        .api("post", api.configUrl + "/hczz/xtpz/gzlpz/queryGzlpzList", this.basePage)
        .then(res => {
          this.data = res.list;
        });
    },
    handleAdd() {
      this.addModal = true;
    },
    //    搜索
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
    // 新增页面
    addBtn() {
      this.addModal = true;
    },
    // 编辑页面
    handleEdit(val) {
      this.approveInfo = JSON.parse(JSON.stringify(val));
      this.addModal = true;
    },
    deleteModaldel() {
       api
        .api("post", `${api.configUrl}/hczz/xtpz/gzlpz/deleteGzlpz`, this.dellst)
        .then(res => {
          this.deleteModal = false;
          this.dellst = {};
          this.refreshPage();
          this.$message.success("删除成功");
        })
    },
    handleDelete(row) {
      this.dellst = {
        dellst: []
      };
      this.dellst.dellst.push(row.id);
      this.deleteModal = true;
    },
    // 刷新页面
    refreshPage() {
      this.rendtable();
    }
  }
};
</script>
<style lang="less">
.directive-check-ct {
  // min-width: 1350px;
  .table-ct {
    height: calc(~"100% - 150px");
  }
}
</style>