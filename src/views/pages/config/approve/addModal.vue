<template>
    <el-dialog class="modal-ct workBench-group-modal" 
        :title="modelTitle" 
         @close='closeModel'
        :visible.sync="visible"
         :modal-append-to-body='false'
        width="800px"
        >
      <Form ref="formValidate" :rules="ruleValidate"
           :model="formValidate" :label-width="130">
           <Row>
             <Col span='12'>
              <FormItem label="产品名称：" prop="cpid">
                <Select v-model="formValidate.cpid" style="width:200px" :label-in-value="true" @on-change="handleProductName">
                  <Option v-for="item in selectDate.productName" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span='12'>
              <FormItem label="产品模块名称：" prop="cpmkid">
                <Select v-model="formValidate.cpmkid" style="width:200px" :label-in-value="true" @on-change="handleModelName">
                  <Option v-if="selectDate.modelName.length" v-for="item in selectDate.modelName" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span='12'>
              <FormItem label="工作流名称：" prop="gzlkey">
                <Select v-model="formValidate.gzlkey" style="width:200px" :label-in-value="true" @on-change="handleProjectMoodel">
                  <Option v-if="selectDate.projectMoodel.length" v-for="item in selectDate.projectMoodel" :value="item.actKey" :key="item.actKey">{{ item.businessName }}</Option>
                </Select>
              </FormItem>
              </Col>
            <Col span='12'>
            <FormItem label="工作流类型：" prop="gzllx">
                <Select v-model="formValidate.gzllx" style="width:200px">
                    <Option v-for="item in selectDate.workflowType" :value="item.code" :key="item.code">{{ item.title }}</Option>
                </Select>
            </FormItem>
            </Col>
            </Row>
            <Col span='12'>
              <FormItem label="状态：" prop="zt">
                <Select v-model="formValidate.zt" style="width:200px">
                  <Option v-for="item in selectDate.workflowStatus" :value="item.key" :key="item.key">{{ item.label }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span='12'>
              <FormItem label="工作流编号：" prop="gzlkey">
                <Input placeholder="工作流编号" v-model.trim="formValidate.gzlkey" disabled style="width:200px"></Input>
              </FormItem>
              </Col>
            </Row>
		   </Form>
      <div  slot="footer" >
        <Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
        <Button type="primary"  class="sureBtn" @click="saveInfo">确认</Button>
      </div>
	</el-dialog>
</template>
<script>
import api from "@/fetch/api.js";
import {assign} from "@/libs/common/common"
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    approveInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      visible: this.show,
      formValidate: {
        gzlkey: null,
        cpmkmc: null,
        gzllx: null,
        gzlmc: null,
        cpmkid: null,
        cpid: null,
        cpmc: null,
        zt: null,
        id:null
      },
      selectDate: {
        productName: [],
        modelName: [],
        projectMoodel: [],
        workflowType: [],
        workflowStatus: [
          { label: "需要审批", key: '1' },
          { label: "不需要审批", key: '0' }
        ]
      },
      ruleValidate: {
        cpid: [
          {
            required: true,
            message: "请选择产品名称",
            trigger: "blur"
          }
        ],
        cpmkid: [
          {
            required: true,
            message: "请选择产品模块名称",
            trigger: "blur"
          }
        ],
        gzllx: [
          {
            required: true,
            message: "请选择工作流类型",
            trigger: "blur"
          }
        ],
        gzlkey: [
          {
            required: true,
            message: "请选择工作流名称",
            trigger: "blur"
          }
        ],
        zt: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    show() {
      this.visible = this.show;
    },
    'formValidate.cpid'(val){
    	this.selectDate.modelName=[];
    	this.formValidate.cpmkid='';
    	if(val){
    		api.api("post", api.configUrl + "/hczz/gzl/getProjectMoudle").then(res => {
	            this.selectDate.modelName = res.filter(item=>{
	            	return item.parentId==val
	            });
	            this.handleEdit()
	        });
    	}
    	
    },
    'formValidate.cpmkid'(val){
    	this.selectDate.projectMoodel=[];
    	this.formValidate.gzlkey='';
    	if(val){
    		api.api("post", api.configUrl + "/hczz/gzl/getProjectMoudlePage").then(res => {
	            this.selectDate.projectMoodel = res.filter(item=>{
	            	return item.resourceId==val
	            });
	          });
    	}
    },
    'formValidate.gzlkey'(val){
    	this.handleEdit()
    }
  },
  computed: {
    modelTitle() {
      return this.approveInfo.id?'编辑审批工作流':'新建审批工作流';
    },
    confirmUrl(){
      return this.approveInfo.id?'/hczz/xtpz/gzlpz/updateGzlpz':'/hczz/xtpz/gzlpz/insertGzlpz';
    }
  },
  created() {
    this.initSelect();
  },
  methods: {
    initSelect() {
      
      let resq1 = new Promise(reslove => {
         api.api("post", api.configUrl + "/hczz/gzl/getProject").then(res => {
          this.selectDate.productName = res;
          reslove()
        });
     });
//    let resq2 = new Promise(reslove => {
//      api.api("post", api.configUrl + "/hczz/gzl/getProjectMoudle").then(res => {
//          this.selectDate.modelName = res;
//          reslove();
//        });
//    });
//   let resq3 = new Promise(reslove => {
//      api.api("post", api.configUrl + "/hczz/gzl/getProjectMoudlePage").then(res => {
//          this.selectDate.projectMoodel = res;
//          reslove();
//        });
//    });
     let resq4 = new Promise(reslove => {
         api.api("post", api.systemUrl + '/dict/findDictTreeByType?dictTypeCode=HCYWDM').then(res => {
             this.selectDate.workflowType = res;
             reslove();
         });
     });
      Promise.all([resq1,resq4]).then(res=>{
         this.handleEdit()
      })
    },
    handleEdit(){
      //编辑状态下
      if(this.approveInfo.id){
        assign(this.formValidate,this.approveInfo)
      }
    },
    handleProductName(node) {
    	if(node){
    		this.formValidate.cpmc = node.label;
    	}
      
    },
    handleModelName(node) {
      if(node){
      	this.formValidate.cpmkmc = node.label;
      }
    },
    handleProjectMoodel(node) {
      if(node){
      	this.formValidate.gzlmc = node.label;
      }
    },
    closeModel() {
      this.$emit("update:show", false);
      this.$emit("update:approveInfo",{})
    },
    saveInfo() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          api.api("post",`${api.configUrl}${this.confirmUrl}`,this.formValidate)
            .then(res => {
              this.$message.success(`恭喜你${this.modelTitle}成功！！！`);
              this.$emit('refreshTable');
              this.closeModel();
          })
        }
      })
    }
  }
};
</script>
<style lang="less">
</style>

