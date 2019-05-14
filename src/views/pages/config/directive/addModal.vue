<template>
	<!--新增对话框-->
	<Modal class="modal-ct config-directive-add-modal" 
        :title="modelTitle" 
         @on-cancel="closeModel"
        v-model="visible">
		<div slot="footer">
			<Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
			<Button type="primary" @click="addconfirm" class="sureBtn">确认</Button>
		</div>
    <el-form class="dire_form" ref="formValidateAdd" status-icon :rules="ruleValidateAdd" size="small" :model="formValidateAdd" label-width="150px">
      <el-form-item label="指令级别名称：" prop="zljblxmc">
        <el-input class="nameInput" placeholder="指令级别名称" clearable v-model.trim="formValidateAdd.zljblxmc" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
          <el-radio-group v-model="formValidateAdd.type">
            <el-radio label="0">请求</el-radio>
            <el-radio label="1">指令</el-radio>
          </el-radio-group>
      </el-form-item>
      <br/> 
      <el-form-item label="签收时限：">
          <timer :objTime="objTimeQssx" @timeChange="timeChangeQssx"></timer>
      </el-form-item>
      <br/>
      <el-form-item label="反馈时限：">
          <timer :objTime="objTimeFksx" @timeChange="timeChangeFksx"></timer>
      </el-form-item>
    </el-form>    
	</Modal>
</template>
<script>
import api from "@/fetch/api.js";
import axios from "axios";
import { assign } from "@/libs/common/common.js";
import { isNumber, remarkValid, isWeight } from "@/libs/common/check.js";
import timer from '@/views/pages/directive/check/timer.vue';
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
  data() {
    return {
      objTimeQssx:{
        event:"timeChange",
        hours:null,
        minutes:null
      },
      objTimeFksx:{
        event:"timeChange",
        hours:null,
        minutes:null
      },
      visible: this.show,
      dictTypeTree: [],
      formValidateAdd: {
        // zljblxid: null,
        zljblxmc: null,
        qssx: 0,
        fksx: 0,
        type:'0'
      },
      ruleValidateAdd: {
        zljblxmc: [{required: true,message: "指令名称不能为空",trigger: "blur"}]
      }
    };
  },
  components:{
    timer
  },
  created() {
    this.isEditForm();
  },
  watch: {
    show() {
      this.visible = this.show;
    }
  },
  computed:{
    modelTitle(){
      return this.directiveInfo.id ? '编辑当前指令级别' : '新增指令级别'
    }
  },
  methods: {
    timeChangeQssx(val){
      this.formValidateAdd.qssx = val;
    },
    timeChangeFksx(val){
      this.formValidateAdd.fksx = val;
    },
    isEditForm() {
      if (this.directiveInfo.id) {
        assign(this.formValidateAdd, this.directiveInfo);
        this.formValidateAdd.id = this.directiveInfo.id
        this.objTimeQssx.hours = Math.floor(this.directiveInfo.qssx/60);
        this.objTimeQssx.minutes = this.directiveInfo.qssx - Math.floor(this.directiveInfo.qssx/60)*60;
        this.objTimeFksx.hours = Math.floor(this.directiveInfo.fksx/60);
        this.objTimeFksx.minutes = this.directiveInfo.fksx - Math.floor(this.directiveInfo.fksx/60)*60;
      }
    },
    // 新增表单数据
    addconfirm() {
      this.$refs.formValidateAdd.validate(valid => {
        if (valid) {
          let saveUrl = this.directiveInfo.id? api.configUrl + "/hczz/xtpz/zlsxpz/updateZlsxpz": api.configUrl + "/hczz/xtpz/zlsxpz/insetZlsxpz";
          api.api("post",saveUrl,this.formValidateAdd).then(res => {
              this.closeModel();
              this.$emit("refreshTable");
          });
        }
      });
    },
    // 关闭模态框后更新数据
    closeModel() {
      this.$emit("update:show", false);
      this.$emit("update:directiveInfo", {});
    }
  }
};
</script>
<style scope lang="less">
  .dire_form{
    margin: 30px auto;
      .nameInput{
        width: 280px;
      }
  }
</style>


