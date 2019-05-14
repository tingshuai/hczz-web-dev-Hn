<template>
  <el-dialog class="modal-ct workBench-group-modal" :title="modelTitle" @close='closeModel' :visible.sync="visible" :modal-append-to-body='false' width="700px">
    <ul class="shuttle-select-ct offiece-select-ct">
      <!--<li>
        <span>选择单位</span>
        <el-scrollbar tag="div" wrap-class="el-scrollbar-wrap" view-class="el-scrollbar-view" ref="scrollbar">
          <el-input icon="search" placeholder="请输入搜索的内容" v-model="filterTextDept">
          </el-input>
          <el-tree :data="deptTree" :props="defaultProps" :filter-node-method="filterNodeDept" @node-click="handleDeptNode" ref="tree2"></el-tree>
        </el-scrollbar>
      </li>-->
      <li>
        <span>选择部门</span>
        <el-scrollbar tag="div" wrap-class="el-scrollbar-wrap" view-class="el-scrollbar-view" ref="scrollbar">
          <el-input icon="search" placeholder="请输入搜索的内容" v-model="filterTextOffice">
          </el-input>
          <el-tree class="el-tree" :data="treedata" :props="defaultProps" :filter-node-method="filterNodeOffice"  @node-click="handleNodeClick" ref="treeOffice"></el-tree>
        </el-scrollbar>
      </li>
      <li>
        <span>已选</span>
        <div>
          <ul class="selected-wrap">
            <li v-for="(item, index) in selectedDate" :key="index">{{item.jsdwmc}}<i class="el-icon-close" @click="delectArr(index)"></i>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div slot="footer">
      <Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
      <Button type="primary" class="sureBtn" @click="saveInfo">确认</Button>
    </div>
  </el-dialog>
</template>
<script>
import api from "@/fetch/api.js";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    urls:{
    	type:String,
    	default:'/office/queryPage'
    }
  },
  data() {
    return {
      visible: this.show,
      filterTextDept: "",
      filterTextOffice: "",
      radio: "",
      deptTree: [],
      treedata: [],
      defaultProps: {
        children: "children",
        label: "officeName"
      },
      selectedDate: []
    };
  },
  watch: {
    filterTextDept(val) {
      this.$refs.tree2.filter(val);
      this.filterTextOffice='';
    },
    filterTextOffice(val) {
      this.$refs.treeOffice.filter(val);
    },
    show() {
      this.visible = this.show;
    }
  },
  created() {
    this.initTree();
  },
  computed: {
    modelTitle() {
      return this.isCopy ? "抄送部门" : "接收部门";
    }
  },
  methods: {
    filterNodeDept(value, data) {
      if (!value) return true;
      return (
        data.title.indexOf(value) !== -1 || data.pinYing.indexOf(value) !== -1
      );
    },
    filterNodeOffice(value, data) {
      if (!value) return true;
      return (
        data.title.indexOf(value) !== -1 || data.pinYing.indexOf(value) !== -1
      );
    },
    initTree() {
    	api.api("post", api.systemUrl+'/office/queryPage',{
      	officeCode:JSON.parse(window.localStorage.getItem('userInfo')).officeCode,
      	pageSize:10,
      	pageNum:1
      }).then(res => {
        api.api("post", api.systemUrl+this.urls,{
	      	parentId:res.list[0].officeId,
	      	pageSize:10,
	      	pageNum:1
	      }).then(res => {
	        this.treedata =res.list;
	      });
      });
      
    },
    handleDeptNode(node) {
      api
        .api(
          "post",
          `${api.systemUrl}/office/findOfficeTreeByType?deptCode=${
            node.deptCode
          }`
        )
        .then(res => {
          this.treedata =
            res.toString() === "[object Object]" ? res[0].children : [];
        });
    },
    handleNodeClick(node) {
      let res = this.selectedDate.filter(val => {
        return val["jsdwmc"] == node.title;
      });
      this.isCopy
        ? !res.length
          ? this.selectedDate.push({ jsdwmc: node.officeName, jsdw: node.officeCode })
          : this.$message.error("请勿重复选择接收部门")
        : this.selectedDate.length < 1
          ? this.selectedDate.push({ jsdwmc: node.officeName, jsdw: node.officeCode })
          : this.$message.error("接收部门只能选一个！");
    },
    delectArr(index) {
      this.selectedDate.splice(index, 1);
    },

    closeModel() {
      this.$emit("update:show", false);
      this.filterTextDept='';
      this.selectedDate = [];
      this.treedata=[];
    },
    saveInfo() {
      this.$emit("update:show", false);
      this.$emit("handleOffice", JSON.parse(JSON.stringify(this.selectedDate)));
//    this.selectedDate = [];
      this.closeModel()
    }
  }
};
</script>
<style lang="less" scoped>
.offiece-select-ct {
  li {
    width: 48% !important;
  }
}
 .shuttle-select-ct li > div .selected-wrap li {
    line-height: 36px;
    position: relative;
    width: 100% !important;
  }
</style>


