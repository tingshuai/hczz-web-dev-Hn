<template>
  <el-dialog class="modal-ct add-recorder-dialog" :title="modelTitle" @close='closeModel' :visible.sync="visible" :modal-append-to-body='false' ref="addRecDialog" width="400px">
    <el-form ref="formValidate" :model="formValidate" label-width="60px" @click="handleClose" class="form-ct" :rules="rulesForm">
      <el-form-item label="部门:" prop="bmmc" class="tree-search-ct" v-clickoutside="handleClose">
        <el-input size="small" v-model="formValidate.bmmc" placeholder="请选择部门" @focus="handleShow" class="dep-click-ct" ref="depInput">
        </el-input>
        <div>
          <el-scrollbar v-if="isVisible" tag="ul" wrap-class="el-select-dropdown__wrap" view-class="el-select-dropdown__list" class="tree-search" ref="scrollbar">
            <el-input ref="depSearch" placeholder="请输入搜索的内容" v-model="filterText">
            </el-input>
            <el-tree :data='treeData' node-key="id" :expand-on-click-node="false" :filter-node-method="filterNode" :default-expand-all='isExpand' ref="depTree" @node-click="handleNodeClick">
              <span class="custom-tree-node" :class="data.title==formValidate.bmmc ? data.selectedTree : ''" slot-scope="{ node, data }">
                <span >{{ data.title }}1</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-form-item>
      <el-form-item label="人员:" prop="zxrxm">
        <el-select size="small" v-model.trim="formValidate.zxrxm" placeholder="请选择人员" filterable @change="handleRole">
          <el-option  v-for="item in list" :value="item.id" :label="item.userName" :key="item.id"></el-option>

        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <Button type="text" @click="closeModel" class="cancelBtn">取消</Button>
      <Button type="primary" class="sureBtn" @click="addconfirm">确认</Button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/fetch/api.js';
import { assign } from '@/libs/common/common';
import Clickoutside from '@/libs/clickoutside';
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        roleInfo: {
            type: Object,
            default: {}
        }
    },
    directives: { Clickoutside },
    data () {
        return {
            visible: this.show,
            filterText: '',
            isExpand: false,
            isVisible: false,
            formValidate: {
                bmbh: null,
                bmmc: null,
                zxrxm: null,
                zxrxm: null,
                id: null
            },
            rulesForm: {
                bmmc: [
                    { required: true, message: '请填写部门名称', trigger: 'change' }
                ],
                zxrxm: [
                    { required: true, message: '请选择人员名称', trigger: 'change' }
                ]
            },
            list: [],
            treeData: []
        };
    },
    // created(){
    // },
    watch: {
        show () {
            this.visible = this.show;
        },
        filterText (val) {
            console.log(val, 'sssss');
            this.$refs.depTree.filter(val);
        },
        'formValidate.bmmc' (val) {
    	if (val) {
    		this.isExpand = true;
    	} else {
    		this.isExpand = false;
    	}
        },
        isVisible (val) {
    	if (val) {
    		this.$nextTick(() => {
    			$('.selectedTree').parent().css('background', '#f5f7f9');
    		});
    	}
        }
    },
    computed: {
        modelTitle () {
            return this.roleInfo.id ? '修改补录人员信息' : '新建补录人员信息';
        },
        confirmUrl () {
            return this.roleInfo.id
                ? '/hczz/xtpz/blrpz/updateBlrpz'
                : '/hczz/xtpz/blrpz/insertBlrpz';
        }
    },
    created () {
        console.log(this.roleInfo, 'sssssPP');

        this.initOfficeSelect();
        this.handleEdit();
    },
    methods: {
        filterNode (value, data) {
            console.log(value, 'PPP');
            if (!value) return true;
            return (
                data.title.indexOf(value) !== -1 || data.code.indexOf(value) !== -1
            );
        },
        handleEdit () {
            this.requestRole(this.roleInfo.bmbh);
            assign(this.formValidate, this.roleInfo);
        },
        handleShow () {
            this.isVisible = !this.isVisible;
            this.$refs.depInput.blur();
        },
        handleClose () {
            this.isVisible = false;
        },
        handleNodeClick (node) {
            this.formValidate.zxrxm = '';
            console.log(node, 'ooo');
            this.formValidate.bmbh = node.code;
            this.formValidate.bmmc = node.title;
            this.isVisible = false;
            this.requestRole(node.code);
        },
        requestRole (code) {
            api
                .api(
                    'get',
                    `${api.systemUrl}/account/info/findAccInfoes?officeCode=${code}`
                )
                .then(res => {
                    console.log(res, 'AAA');
                    this.list = res;
                });
        },
        handleRole (val) {
            this.formValidate.zxrxm = '';
            this.formValidate.zxrxm = this.list.find(item => {
                return item.id === val;
            }).userName;
        },
        addconfirm () {
            this.$refs.formValidate.validate(valid => {
                if (valid) {
                    api
                        .api(
                            'post',
                            `${api.configUrl}${this.confirmUrl}`,
                            this.formValidate
                        )
                        .then(res => {
                            this.$message.success(`恭喜你！！${this.modelTitle}成功`);
                            this.closeModel();
                            this.$emit('refreshPage');
                        });
                }
            });
        },
        initOfficeSelect () {
            api
                .api('post', api.systemUrl + '/office/findOfficeTreeByType')
                .then(res => {
                    this.treeData = res;
                    this.treeData = this.pushName(this.treeData);
                    console.log(this.treeData);
                });
        },
        closeModel () {
            this.$emit('update:show', false);
            this.$emit('update:roleInfo', {});
        },
        pushName (arr) {
            //  	console.log(arr)
    	arr.forEach(item => {
                //  		item.selectedTree='selectedTree';
    		this.$set(item, 'selectedTree', 'selectedTree');
    		if (item.children && item.children.length) {
    			this.pushName(item.children);
    		}
    	});
    	return arr;
        }
    }
};
</script>
<style lang="less">
.add-recorder-dialog {
  .form-ct {
    width: 300px;
    margin: 0 auto;
    padding-top: 15px;
  }
  .tree-search-ct {
    position: relative;
    .dep-click-ct {
      .el-input__inner {
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        padding-left: 8px;
        font-size: 12px;
        &:hover {
          border-color: #57a3f3;
        }
      }
    }
    .tree-search {
      position: absolute;
      z-index: 99;
      width: 100%;
      box-sizing: border-box;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid #dcdfe6;
      background-color: #fff;
      min-height: 224px;
      border-top: none;
      .el-select-dropdown__wrap {
        padding: 10px;
        height: 240px;
        .el-input__inner {
          cursor: pointer;
          height: 32px;
          line-height: 32px;
          padding-left: 8px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>


