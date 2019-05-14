<template>
    <el-dialog class="modal-ct workBench-group-modal" 
        :title="modelTitle" 
         @close='closeModel'
        :visible.sync="visible"
         :modal-append-to-body='false'
         width="700px"
        >
        <div>
            <el-tabs v-model="activeName"  @tab-click="handleClick" style="">
                <el-tab-pane label="流程轨迹" name="handle">
                    <handle :directFlowFunc='directFlowFunc'></handle>
                </el-tab-pane>
                <el-tab-pane label="详细信息" name="detail">
                    <detail :directDetailFunc='directDetailFunc'></detail>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="feedback-ct" v-show="statusInfo.isFeedback">
          <h3>反馈</h3>
          <el-form ref="formValidate" :model="formValidate">
            <el-form-item label="反馈内容" prop="fknr">
              <el-input :rows="4"  type="textarea" v-model="formValidate.fknr"></el-input>
            </el-form-item>
            <el-form-item label="附件" prop="name">
              <loadFile ref="procedFile" :size="1004800"  class="file-ct"
                   accept="image/gif,image/jpeg,image/png"></loadFile>
            </el-form-item>
          </el-form>
        </div>
      <div  slot="footer" >
			<Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
			<Button type="primary" v-show="statusInfo.isShow" class="sureBtn" @click="handleSignIn">{{statusInfo.label}}</Button>
		</div>
	</el-dialog>
</template>
<script>
import detail from "./detail";
import handle from "./handle";
import api from "@/fetch/api.js";
import loadFile from "@/views/main-components/file-upload/loadFile.vue";
import { cloneObj } from "@/libs/common/common.js";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    directiveInfo: {
      type: Object,
      default: {}
    }
  },
  components: {
    loadFile,
    detail,
    handle
  },
  data() {
    return {
      visible: this.show,
      activeName: "handle",
      statusSelect: [
        { key:"1", label: "签收", url: "/hczz/zl/qsZl", isFeedback: false,isShow:true },
        { key:"2", label: "反馈", url: "/hczz/zl/fkZl", isFeedback: true,isShow:true },
        { key:'3',label:'已反馈',isFeedback: false,isShow:false},
        { key:'4',label:'待评价',isFeedback: false,isShow:false}
      ],
      statusInfo: {},
      formValidate: {
        fknr: ""
      },
      directFlowFunc: null,
      directDetailFunc:null,
    };
  },
  watch: {
    show() {
      this.visible = this.show;
    }
  },
  computed: {
    modelTitle() {
      return `编号：${this.directiveInfo.zlwh}`;
    },
    isScroll() {
      return this.isEdit ? "编辑" : "新增";
    }
  },
  created() {
  	console.log(this.directiveInfo)
    this.handleStatus();
    this.directFlowFunc = this.getFlowInfo();
    this.directDetailFunc = this.directDetail();
  },
  methods: {
    handleStatus() {
      this.statusInfo = this.statusSelect.filter(item => {
        return item.key == this.directiveInfo.zt;
      })[0];
    },
    getFlowInfo() {
      return new Promise(relove => {
        api.api("get", `${api.configUrl}/hczz/common/clrz/getClrzList`, {glid: this.directiveInfo.zlid}).then(res => {
            relove(res)
          })
      })
    },
    directDetail() {
      return new Promise(relove => {
        api.api("post", `${api.configUrl}/hczz/zl/getDetailZlxx`, {id: this.directiveInfo.zlid}).then(res => {
            relove(res);
          })
      })
    },
    handleFileDate(res) {
      let array = [];
      cloneObj(res).fileList.forEach((item, index, arr) => {
        array[index] = {};
        array[index]["category"] = item.name.replace(/.+\.+/g, "");
        array[index]["filename"] = item.name;
        array[index]["minetype"] = item.type;
        array[index]["data"] = cloneObj(res).baseArr[index].replace(/.+;base64,+/g,"");
        array[index]["type"] = 0;
      });
      return array;
    },
    closeModel() {
      this.$emit("update:show", false);
    },
    handleSignIn() {
      let params = {};
      if (this.statusInfo.isFeedback) {
        params.zldwgl = {};
        params.zldwgl.id = this.directiveInfo.id;
        params.attach = this.handleFileDate(this.$refs.procedFile.obj);
        params.zldwgl.fknr = this.formValidate.fknr;
      } else {
        params = { id: this.directiveInfo.id };
      }
      api.api("post", api.configUrl + this.statusInfo.url, params).then(res => {
        this.$message.success(`恭喜你${this.statusInfo.label}编号：${this.directiveInfo.zlwh}指令成功`);
        this.$emit("update:show", false);
        this.$emit("refreshPage");
      });
    },
    handleClick(tab, event) {}
  }
};
</script>
<style lang="less">
.formApprove {
  padding-top: 20px;
  border-top: 1px solid #dddee1;
}
.feedback-ct {
  .el-form {
    border: 1px solid #e3e3e3;
    .el-form-item {
      margin-bottom: 0px;
      display: flex;
      align-items: stretch;
      &:nth-child(1) {
        border-bottom: 1px solid #e3e3e3;
      }
      .el-textarea__inner {
        border: 0px;
      }
      .el-form-item__label {
        text-align: center;
        padding: 0;
        background: #f6f7f9;
        border-right: 1px solid #e3e3e3;
        width: 25%;
      }
      .el-form-item__content {
        width: 75%;
        .file-ct {
          padding-left: 15px;
        }
      }
    }
  }
}
</style>