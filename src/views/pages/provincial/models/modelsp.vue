<template>
    <div>
        <el-dialog class="modal-ct workBench-group-modal" :title="'编号：'+zlObj.sqwh" @close='closeModel' :visible="visible" :modal-append-to-body='false' width="900px">
			<el-form :model="formValidate" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="案件名称：" prop='zlmc'>
							<span class="oSpan" :title="zlObj.zlmc">{{zlObj.ajmc}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="案件类型：" prop='zllx' clearable fliterable>
							<span class="oSpan" :title="zlObj.zllxmc">{{zlObj.jqajlx}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="案件内容：" prop='bz'>
							<span class="oSpan" :title="zlObj.bz">{{zlObj.bz}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="协作内容：" prop='jyrwnr'>
							<span class="oSpan" :title="zlObj.jyrwnr">{{zlObj.jyrwnr}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="file">
					<el-col :span="12">
						<el-form-item label="手续附件：">
							<a v-for='item in dirTaskFileSX' :key="item.filename" style="cursor: pointer;">
								<p @click="handlePrev(item)" class="tastFile" style="margin: 0;color:#409eff"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
							</a>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务附件：">
							<a v-for='item in dirTaskFileRW' :key="item.filename" style="cursor: pointer;color:#409eff">
								<p @click="handlePrev(item)" class="tastFile" style="margin: 0;color:#409eff"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
							</a>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="sp_div" v-show="spyjObj.length>1">
						<el-form-item label="审批流程：">
							<div v-for="(spItem,index) in spyjObj" :key="index" class="all_div" v-show="index>0">
								<div>
									<span class="line-span"></span>
									<span class="radius-span">{{index}}</span>
								</div>
								<div class="recive all_receive" :class="{'bg-green':spItem.zxr!=null,'bg-blue':spItem.zxr==null}">
									<div class="triangle-up">
									</div>
									<div class="lcInfo-t cl ">
										<img class="all_img">
										<div :class="{'border-b-green':spItem.zxr!=null,'border-b-blue':spItem.zxr==null}" class="all_imgDiv">
											<p :title="spItem.czr" style="margin: 0;" class="lancolor">{{spItem.zxr}}</p>
										</div>
									</div>
									<pre class="all_pre" :title="spItem.remark">{{spItem.remark}}</pre>
									<i class="bottom-x"></i>
								</div>
							</div>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item v-if="iszxqsry" label="签收操作：" prop='splx'>
							<el-radio-group v-model="formValidateCopy.splx">
								<el-radio :label="0">签收</el-radio>
								<el-radio :label="2">拒绝，驳回并补充材料</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item v-else label="审批操作：" prop='splx'>
							<el-radio-group v-model="formValidateCopy.splx">
								<el-radio :label="1">通过</el-radio>
								<el-radio v-if="isneedparent" :label="3">请上级领导审批</el-radio>
								<el-radio :label="2">不通过</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="!iszxqsry">
					<el-col :span="24">
						<el-form-item label="审批意见：" prop='remark'>
							<el-input v-model.trim="formValidateCopy.remark" clearable type="textarea" :rows="3" size="small" :maxlength="100"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer">
				<el-button type="default" @click="closeModel" class="cancelBtn" size="small">取消</el-button>
				<el-button type="default" @click="saveInfo" class="successBtn" size="small">提交</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        formValidate: {
            type: Object,
            default() {
				return {}
			},
            required: true
        },
        zlObj: {
            type: Object,
			default() {
				return {}
			},
			required: true
        },
        dirTaskFileSX: {
            type: Array,
			default: [],
			required: true
        },
        dirTaskFileRW: {
            type: Array,
			default: [],
			required: true
        },
        spyjObj: {
            type: Array,
			default: [],
			required: true
        },
        iszxqsry: {
            type: Boolean,
            default: false
        },
        isneedparent: {
            type: Boolean,
            default: false
        }
	},
	created() {
		this.formValidateCopy = this.formValidate;
		this.visibleCopy = this.visible;
	},
    data() {
        return {
			visibleCopy: false,
			formValidateCopy: {},
            rules: {
                splx: [{
                    required: true,
                    message: "请选择审批操作",
                    trigger: "blur"
                }],
                remark: [{
                    required: true,
                    message: "请填写审批意见",
                    trigger: "blur"
                }]
            }
        }
    },
    methods: {
        closeModel() {
			this.$emit('closeModel')
			this.$emit('qqxcspcloseModel')
        },
        saveInfo() {
			this.$emit('saveInfo', this.$refs.ruleForm)
			this.$emit('qqxcspsaveInfo', this.$refs.ruleForm)
        },
        handlePrev(item) {
			this.$emit('handlePrev', item)
			this.$emit('handlePrevv', item)
        }
    }
}
</script>

<style>

</style>