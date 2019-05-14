<template>
    <div ref="lazyDeptTree">
        <div class="lazyDeptTree-wrapper">
            <div class="input-container">
                <el-input placeholder="请输入部门" class="oInput" v-model="filterTextModal" size="medium"></el-input>
                <el-button size="mini" type="primary" style="margin-left: 5px;" @click="handleSearch">搜索</el-button>
            </div>
            <div class="lazydept-innertree">
                <el-tree
                    v-show="!showResult"
                    ref="tree"
                    v-loading="loading"
                    :props="defaultProps"
                    :load="loadNode"
                    node-key="id"
                    :highlight-current='isHighlight'
                    @node-click="onTree"
                    empty-text=""
                    :expand-on-click-node="true"
                    lazy
                ></el-tree>
            </div>
            <div class="deptList" v-if="showResult" v-loading="listLoading">
                <p v-if="resultList.length == 0" class="empty">暂无数据</p>
                <div v-else class="dept-item-wrapper">
                    <p class="dept-item" v-for="item in resultList" :key="item.id" @click="resultClick(item)">
                        {{item.officeName}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import axios from 'axios';
    import api from '@/fetch/api.js';
    export default {
        watch: {
            filterTextModal(val) {
                if (val == ''){
                    this.resultList = []
                    this.showResult = false;
                }
            }
        },
        data () {
            return {
                filterTextModal: '', // 模糊搜索下級   模态框中
                defaultProps: {
                    children: 'children',
                    label: 'title',
                    isLeaf: 'leaf'
                },
                loading: false,
                listLoading: false,
                isHighlight: true,
                showResult: false,
                resultList: []
            };
        },
        methods: {
            resultClick(item) {
                this.deparmentName = item.officeName;
                this.$emit('resultClick', item);
            },
            handleSearch() {
                let sreachText = this.filterTextModal.trim()
                if(!sreachText) {
                    this.$message.error("请输入搜索内容")
                    return
                }
                this.showResult = true;
                this.listLoading = true;
                api.api('post', api.systemUrl + '/office/queryPage', {
                    pageNum: 1,
                    pageSize: 20000000,
                    officeName: sreachText
                    // isNeedCurDeptCode: true
                }).then(res => {
                    this.listLoading = false
                    this.resultList = res.list
                })
            },
            onTree(node) {
                this.$emit('onTreeModal', node);
            },
            getData(parentId, deptCode, resolve) {
                api.api('post', api.systemUrl + '/office/findOfficeTreeOneByOne2', {
                    parentId,
                    deptCode,
                    isNeedCurDeptCode:true
                }).then((res) => {
                    res.forEach((el) => {
                        if (el.children.length == 0) {
                            el.leaf = true
                        } else {
                            el.leaf = false
                        }
                    })
                    resolve(res)
                    this.loading = false;
                })
            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    this.loading = true;
                    this.getData('', '', resolve)
                }
                // 其余节点处理
                if (node.level >= 1) {
                    // 把resolve传到异步中去
                    let deptCode, parentId
                    if (node.data.tag == '0') {
                        deptCode = node.data.code
                    } else {
                        parentId = node.data.id
                    }
                    this.getData(parentId, deptCode, resolve)
                }
            },
        }
    };
</script>

<style lang="less" scoped>
    .lazyDeptTree-wrapper{
        position: relative;
        width: 100%;
    }
    .input-container{
        padding: 10px;
        display: flex;
    }
    .lazydept-innertree{
        display: inline-block;
        // overflow: auto;
        min-width: 100%;
    }
    .deptList{
        padding: 0 10px;
        width: 100%;
        min-height: 120px;
        .empty{
            text-align: center;
            color: #999;
            font-size: 12px;
        }
        .dept-item-wrapper{
            display: inline-block;
            overflow-y: auto;
            .dept-item{
                cursor: pointer;
                padding: 0 10px;
                min-height: 22px;
                line-height: 22px;
                width: 100%;
                &:hover{
                     background-color: #e2e9f1;
                 }
            }
        }
    }
</style>
