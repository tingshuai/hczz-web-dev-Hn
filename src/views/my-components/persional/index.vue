<template>
<div>
    <p><span>账号名：</span><span>{{personalInfo.userName}}</span></p>
    <p><span>警务编号：</span><span>{{personalInfo.staffCard}}</span></p>
    <p><span>身份证：</span><span>{{personalInfo.idCard}}</span></p>
    <p class="phone-item">
        <span>电话：</span>
        <span v-show="isphoneEdit">{{personalInfo.phone}}</span>
        <!-- <Form v-show ="!isphoneEdit"  :model="personalForm" ref="personalForm" :rules="personalFormRule">
            <FormItem prop="phone">
                <Input v-model="personalForm.phone" :maxlength="11"></Input>
            </FormItem>
        </Form> -->
        <!-- <a href="javascript:void(0)" @click="updatePhone">{{phoneEdit}}</a> -->
    </p>
    <p><span>所属部门：</span><span>{{personalInfo.officeName}}</span></p>
        </div>
</template>
<script>
import { telphoneNumber } from "@/libs/common/check.js";
export default {
  data() {
    return {
      personalInfo: {},
      personalForm: {
        phone: null
      },
      isphoneEdit: false,
      personalFormRule: {
        phone: {
          validator: telphoneNumber,
          trigger: "blur"
        }
      },
      userId: null
    };
  },
  computed: {
    phoneEdit() {
      return this.isphoneEdit ? "编辑" : "保存";
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    handlePersonal() {
      this.personalInfo = JSON.parse(JSON.stringify(this.$store.getters.personal_Info));
      this.isphoneEdit = this.personalInfo.phone ? true : false;
      this.personalForm.phone = this.personalInfo.phone? this.personalInfo.phone : null;
    },
    updatePhone() {
      if (this.isphoneEdit) {
        this.isphoneEdit = false;
      } else {
        this.$refs.personalForm.validate(valid => {
          if (valid && this.personalForm.phone) {
            this.personalForm.id = this.personalInfo.id;
            this.$store.dispatch("updatedUserPhone", this.personalForm).then(res => {
                this.getUser();
              });
          } else {
            this.$message.error("请输入正确的手机号码");
          }
        });
      }
    },
    async getUser() {
      await this.$store.dispatch("getUser");
      // await this.$store.dispatch("getUserId");
      // await this.$store.dispatch("getUserInfo",this.$store.getters.personal_userId);
      this.handlePersonal();
    }
  }
};
</script>
<style lang="less">
.personal-info-panel.el-dropdown-menu {
  min-width: 340px;
  top: 49px !important;
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background: #ffffff;
    color: #606266;
  }
  p {
    line-height: 2.1;
    font-size: 14px;
    span:nth-child(1) {
      display: inline-block;
      width: 70px;
      text-align: right;
    }
  }
  .phone-item {
    display: flex;
    span {
      line-height: 32px;
    }
    span:nth-child(2) {
      display: inline-block;
      padding-right: 30px;
    }
    a {
      line-height: 32px;
    }
    .ivu-form {
      display: inline-block;
    }
    .ivu-input-wrapper {
      width: 180px;
      .ivu-input {
        width: 180px;
        height: 32px;
      }
    }
  }
}
</style>


