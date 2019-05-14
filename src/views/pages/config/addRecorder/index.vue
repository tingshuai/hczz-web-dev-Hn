<template>
  <div class="my-interest-ct">
    <el-form ref="basePage" :model="basePage" inline>
      <el-form-item label="部门：">
        <el-input size='small' type="text" clearable v-model.trim="basePage.bmmc" placeholder="请输入部门"></el-input>
      </el-form-item>
      <el-form-item label="人员：" label-width="80px">
        <el-input size='small' type="text" clearable v-model.trim="basePage.zxrxm" placeholder="请输入人员"></el-input>
      </el-form-item>
      <el-form-item label-width="80px">
        <Button type="primary" class="searchBtn" @click="search">查询</Button>
      </el-form-item>
    </el-form>
    <div>
      <Button type="primary" class="searchBtn" @click="handleaddModal">添加</Button>
    </div>
    <div class="table-ct">
      <el-table :data='data' :stripe="true" height="100%">
        <el-table-column label="编号" align="center" type="index">
        </el-table-column>
        <el-table-column label="部门" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.bmmc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="人员" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.zxrxm}}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.czsj |timestampToTime}}</span>
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
    <div class="pagination-ct">
      <Page class="clientPage" :total="total" show-sizer placement="top" :current.sync="basePage.pageindex" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total>
      </Page>
    </div>
    <div v-if="isaddModal">
      <add-modal :show.sync="isaddModal" @refreshPage='refreshPage' :roleInfo.sync="roleInfo"></add-modal>
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
  </div>
</template>
<script>
import api from "@/fetch/api";
import addModal from "./addModal.vue";
export default {
  components: {
    addModal
  },
  data() {
    return {
      isaddModal: false,
      data: [],
      pageArray: [10, 20, 30],
      deleteModal: false,
      deleteModal_loading: false,
      dellst: {},
      basePage: {
        pageindex: 1,
        pagesize: 10,
        zxrxm: null,
        bmmc: null
      },
      total: 0,
      roleInfo: {}
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    renderTable() {
      api
        .api("post", api.configUrl + "/hczz/xtpz/blrpz/queryBlrpzList", this.basePage)
        .then(res => {
          this.data = res.list;
          console.log(res.list)
        });
    },
    search() {
    //  this.basePage.pageindex = 1;
      this.renderTable();
    },
    pageChange() {},
    pagesizeChange() {},
    handleaddModal() {
      this.isaddModal = true;
    },
    handleEdit(row) {
      this.roleInfo = row;
      this.isaddModal = true;
    },
    deleteModaldel() {
      api
        .api("post", `${api.configUrl}/hczz/xtpz/blrpz/deleteBlrpz`, this.dellst)
        .then(res => {
          this.deleteModal = false;
          this.dellst = {};
          this.refreshPage();
          this.$message.success("删除成功");
        });
    },
    handleDelete(row) {
      this.dellst = {
        dellst: []
      };
      this.dellst.dellst.push(row.id);
      this.deleteModal = true;
    },

    refreshPage() {
      this.renderTable();
    }
  }
};
</script>
<style lang="less">
.my-interest-ct {
  height: 100%;
  .table-ct {
    height: calc(~"100% - 150px");
    width: 100%;
  }
  .ivu-table-wrapper {
    height: 100%;
  }
}
</style>