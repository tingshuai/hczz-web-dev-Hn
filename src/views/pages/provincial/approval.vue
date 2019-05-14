<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">		
		<!-- <div class="top">
			<el-form :inline="true" class="demo-form-inline theinput">
				<el-form-item label="案件名称：">
					<el-input v-model="basePage.ajmc" size="small" placeholder="请输入案件名称" clearable></el-input>
				</el-form-item>
				<el-form-item label="申请人：">
					<el-input v-model="basePage.sqr" size="small" placeholder="请输入申请人" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div> -->
		<Form inline :label-width="75" class="search-ct">
			<FormItem label="案件名称：">
				<Input type="text" v-model="basePage.ajmc"  placeholder="请输入案件名称" clearable style="width: 180px"></Input>
			</FormItem>
			<FormItem label="申请人：">
				<Input type="text" v-model.trim="basePage.sqr" placeholder="请输入申请人" clearable style="width: 180px"></Input>
			</FormItem>
			<FormItem label="申请时间：">
				<DatePicker type="daterange" :start-date="new Date(new Date()-30*24*3600*1000)" clearable placement="bottom-end" placeholder="请选择申请时间" style="width: 180px" @on-change="handleDate"></DatePicker>
			</FormItem>
			<Button type="primary" class="searchBtn" @click="search" style="margin-right:8px;">查询</Button>
		</Form>
	
		<Modelsp 
			:visible="visible"
			:formValidate="formValidate" 
			:zlObj="zlObj" 
			:spyjObj="spyjObj"
			:iszxqsry="iszxqsry"
			:isneedparent="isneedparent"
			:dirTaskFileSX="dirTaskFileSX" 
			:dirTaskFileRW="dirTaskFileRW"
			@closeModel="closeModel"
			@saveInfo="saveInfo"
			@handlePrev="handlePrev"
			></Modelsp>

		<div class="table-ct" :style="{height:height}">
			<el-table :data='list' :stripe="true" height="100%">
				<el-table-column label="编号" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.sqwh">{{scope.row.sqwh}}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请人" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.sqr">{{scope.row.sqr}}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请单位" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.sqbmmc">{{scope.row.sqbmmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="案件名称" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.ajmc">{{scope.row.ajmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="案件类型" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.jqajlx">{{scope.row.jqajlx}}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请时间" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span class="span-dqzt" :title="scope.row.sqrq">{{scope.row.sqrq | timestampToTime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span class="span-dqzt" :title="scope.row.zt">{{scope.row.zt | ztFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<a class="a-czl" href="javascript:void(0)" @click="handleRow(scope.row)">审批</a>
						<!-- <a class="a-czl" href="javascript:void(0)" @click="look(scope.row)">查看</a> -->
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination-ct">
			<Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>

			<!-- <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="basePage.pageindex" :page-sizes="pageArray" :page-size="10" :total="total">
			</el-pagination> -->
		</div>
	</el-card>
</template>

<script>
	import api from '@/fetch/api';
	import Modelsp from './models/modelsp.vue';
	import {timestampToTime} from '@/libs/common/common';

	export default {
	    data () {
	        return {
	            basePage: {
	                pageindex: 1,
	                pagesize: 10,
	                ajmc: null,
	                sqr: null,
                ywlx: api.ywlx.qx,
	                zt: 'n',
	                type: '1',
	                startDate: '',
	                endDate: ''
	            },
	            pageArray: [10, 20, 30, 40],
	            total: 0,
	            list: [],
	            height: 0,
	            formValidate: {
	                splx: '',
	                remark: '',
	                taskid: null,
	                gzllx: '4',
	                busid: null
	            },
	            resetObj: {
	                attach: [],
	                dwgl: [],
	                procedFileArr: [],
	                TaskFileArr: []
	            },
	            visible: false,
	            zlObj: {},
	            spList: [],
	            dirTaskFileSX: [],
	            dirTaskFileRW: [],
	            iszxqsry: false,
	            isneedparent: false,
	            spyjObj: []
	        };
	    },
	    watch: {
	        filterText (val) {
	            this.$refs.tree2.filter(val);
	        }
    },
    components: {
        Modelsp
    },
	    mounted () {
	        this.$nextTick(() => {
	            this.rendtable();
	            this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
	            window.onresize = () => {
	                this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
	            };
	        });
	    },
	    methods: {
	        pageChange (val) {
	            this.basePage.pageindex = val;
	            this.render();
	        },
	        pagesizeChange () {
	            this.basePage.pagesize = val;
	            this.render();
	        },
	        rendtable () {
	            api.api('post', api.configUrl + '/hczz/hc/queryApproveList', this.basePage).then(res => {
	                this.list = res.list;
	                this.total = res.total;
	            });
	        },
	        handleTaskFile (e) {
	            this.resetObj.TaskFileArr.push(this.handleFileDate(e, '2'));
	        },
	        closeModel () {
	            this.visible = false;
	        },
	        readerFile (file) {
	            return new Promise(resolve => {
	                var reader = new FileReader();
	                reader.readAsDataURL(file);
	                reader.onload = function () {
	                    reslove(this.result);
	                };
	            });
	        },
	        handleFileDate (e, type) {
	            let Obj = {};
	            Obj['category'] = e.name.replace(/.+\.+/g, '');
	            var reg = new RegExp('.' + Obj['category'] + '$');
	            Obj['filename'] = e.name.replace(reg, '');
	            Obj['minetype'] = e.raw.type;
	            this.readerFile(e.raw).then(res => {
	                Obj['data'] = res.split('base64,')[1];
	            });
	            Obj['type'] = type;
	            return Obj;
	        },
	        saveInfo (element) {
	            console.log(this.formValidate, 'ABCDE');
	            element.validate(valid => {
	                if (valid) {
	                    // console.log(valid,"ABC")
	                    // console.log("0000000")
	                    api.api('post', api.configUrl + '/hczz/gzl/doApprove', this.formValidate).then(res => {
	                        this.$message.success('恭喜你审批成功！！！');
	                        this.visible = false;
	                        this.rendtable();
	                    });
	                }
	            });
	        },
	        handleRow (val) {
	            this.visible = true;
	            this.zlObj = val;
	            this.formValidate.taskid = val.task.taskId;
	            this.formValidate.busid = val.task.busId;
	            this.formValidate.remark = '';
	            this.formValidate.splx = '';

	            this.getRWFileSX(val.id);
	            this.getRWFileRW(val.id);
            //				this.getSpyj(val.id);
	            this.getJsInfo(val);
	        },
	        search () {
	            this.basePage.pageindex = 1;
	            this.rendtable();
	        },
	        handleSizeChange (val) {
	            this.basePage.pagesize = val;
	            this.rendtable();
	        },
	        handleCurrentChange (val) {
	            this.basePage.pageindex = val;
	            this.rendtable();
	        },
	        getRWFileSX (id) {
	            api.api('post', api.configUrl + '/hczz/fj/getFjData', {
	                glid: id,
	                tablename: 'T_HCZZ_SQXX',
	                type: '1'
	            }).then(res => {
	                this.dirTaskFileSX = res;
	            });
	        },
	        getRWFileRW (id) {
	            api.api('post', api.configUrl + '/hczz/fj/getFjData', {
	                glid: id,
	                tablename: 'T_HCZZ_SQXX',
	                type: '2'
	            }).then(res => {
	                this.dirTaskFileRW = res;
	            });
	        },
	        handleFilter (arr, key, value) {
	            return arr.filter(item => {
	                return item[key] == value;
	            });
	        },
	        handlePrev (val) {
	            api.upload(val);
	        },
     		getJsInfo (val) { // 获取是否该角色
	            api.api('get', api.systemUrl + '/role/getRolesByAccountId?accountId=' + val.id, {}).then(res => {
	                this.iszxqsry = false;
	                this.isneedparent = false;
	                $.each(res, (index, item) => {
	                    if (item.roleName == '中心签收员') {
	                        this.iszxqsry = true;
	                    } else if (item.roleName == '请求上级领导') {
	                        this.isneedparent = true;
	                    }
	                });
	            });
	        },
	        handleDate (val) {
	            if (val[0] != '') {
	                this.basePage.startDate = new Date(`${val[0]} 00:00:00`);
	                this.basePage.endDate = new Date(`${val[1]} 23:59:59`);
	            } else{
	                this.basePage.startDate = '';
	                this.basePage.endDate = '';
	            }
	        }
        //			getSpyj(id) {
        //				api.api('post', api.configUrl + '/hczz/common/clrz/getSpClrzList', {
        //					glid: id
        //				}).then(res => {
        //					this.spyjObj = res;
        //					$.each(this.spyjObj, (index, val) => {
        //						val.src = '';
        //						api.api('get', api.systemUrl + '/account/info/detail?id=' + val.zxrid).then(res => {
        //							this.spyjObj[index].src = "http://10.166.116.17/yth/picture/" + res.idCard + ".jpg";
        //							$('.lcInfo-t img').eq(index).attr('src', "http://10.166.116.17/yth/picture/" + res.idCard + ".jpg")
        //						})
        //					})
        //				})
        //			}
	    }
	};
</script>

<style scoped>
	.el-dialog .el-form-item{margin-bottom: 0;}
	.searchTree {
		position: absolute;
		z-index: 99;
		width: 500px;
		height: 178px;
		/* background: white; */
		overflow: auto;
	}
	
	.el-form-item__content .oSpan {
		word-break: break-all;
	}
	
	.bg-green {
		background: linear-gradient(to bottom, #046517, #02440d);
	}
	
	.bg-blue {
		background: linear-gradient(to bottom, #012142, #02132c);
	}
	
	.triangle-up {
		width: 0;
		height: 0;
		border-width: 0 10px 10px;
		border-style: solid;
		border-color: transparent transparent #046517;
		position: absolute;
		top: 35px;
		left: 100px;
	}
	
	.border-b-green {
		border-bottom: 1px solid #0c8f35;
	}
	
	.border-b-blue {
		border-bottom: 1px solid #004672;
	}
</style>