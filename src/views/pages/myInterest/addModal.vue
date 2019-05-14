<template>
  <el-dialog class="modal-ct" :title="modelTitle" @close='$emit("update:show", false)' :visible.sync="visible" :modal-append-to-body='false' width="800px">
    <Form ref="formValidate" :model="formValidate" :label-width="80">
      <Row>
        <Col span='12'>
        <FormItem label="姓名/所属人:">
          <Input v-model="formValidate.xm"></Input>
        </FormItem>
        </Col>
        <Col span='12'>
        <FormItem>
          <Input v-model="formValidate.xm"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span='12'>
        <FormItem label="身份证:">
          <Input v-model="formValidate.xm"></Input>
        </FormItem>
        </Col>
        <Col span='12'>
        <FormItem label="车牌号:">
          <Input v-model="formValidate.xm"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span='12'>
        <FormItem label="状态:">
          <Input v-model="formValidate.xm"></Input>
        </FormItem>
        </Col>
        <Col span='12'>
        <FormItem label="车牌号:">
          <Input v-model="formValidate.xm"></Input>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
      <Button type="primary" class="sureBtn" @click="addconfirm">确认</Button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.show,
      modelTitle: "添加关注",
      formValidate: {
        xm: null,
        ly: "手工添加",
        zt: null
      }
    };
  },
  watch: {
    show() {
      this.visible = this.show;
    }
  },
  methods: {
    addconfirm() {},
    closeModel() {
      this.$emit("update:show", false);
    }
  }
};
</script>

