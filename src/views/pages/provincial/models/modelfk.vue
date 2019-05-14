<template>
    <div>
        <el-dialog class="modal-ct workBench-group-modal" :title="'编号：'+xcObj.sqwh" @close='closeModel' :visible.sync="visible" :modal-append-to-body='false' width="700px">
			<el-form :model="formValidate" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="rules">
				<el-row>
					<el-col :span="12">
						<el-form-item label="申请人：">
							<span :title="xcObj.sqr" class="oSpan">{{xcObj.sqr}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="申请单位：">
							<span :title="xcObj.sqbmmc" class="oSpan">{{xcObj.sqbmmc}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

					<el-col :span="12">
						<el-form-item label="案件类型：">
							<span :title="xcObj.jqajlx" class="oSpan">{{xcObj.jqajlx}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="案件编号：">
							<span :title="xcObj.sabjbh" class="oSpan">{{xcObj.sabjbh}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话：">
							<span :title="xcObj.sqrlxdh" class="oSpan">{{xcObj.sqrlxdh}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="案件名称：">
							<span :title="xcObj.ajmc" class="oSpan">{{xcObj.ajmc}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="案件简介：">
							<span :title="xcObj.bz" class="oSpan">{{xcObj.bz}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="案件内容：">
							<span :title="xcObj.jyrwnr" class="oSpan">{{xcObj.jyrwnr}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="手续附件：">
							<a v-for='(item,index) in dirTaskFileSX' :key="index">
								<div @click="handlePrev(item)" style="margin: 0;color:#409eff" class="tastFile" :title="item.filename"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
							</a>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务附件：">
							<a v-for='(item,index) in dirTaskFileRW' :key="index">
								<div @click="handlePrev(item)" style="margin: 0;color:#409eff" class="tastFile" :title="item.filename"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
							</a>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="反馈内容：" v-model="formValidate" prop='fknr' class="word-break">
							<el-input v-if="states" v-model.trim="formValidate.fknr" clearable type="textarea" :rows="3" size="small" :maxlength="300"></el-input>
							<span v-else :rows="3" size="small" :maxlength="300" class="oSpan">{{formValidate.fknr ? formValidate.fknr : "--"}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="附件上传：" v-if="states">
							<el-upload class="upload-demo" action="##" :auto-upload='false' multiple ref="proceUpload" :on-change="handleProcedFile">
								<el-button size="small">
									<i class="el-icon-upload el-icon--left"></i>
									<i class="el-icon-loading el-icon--left"></i> 点击上传
								</el-button>
							</el-upload>
						</el-form-item>
						<el-form-item label="反馈附件：" v-else>
							<a  v-for='(item,index) in dirTaskFile' :key="index"> <span style="margin: 0;color:#409eff" @click="handlePrev(item)"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span> </a>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer">
				<el-button type="primary" v-if="states" @click="closeModel" class="cancelBtn" size="small">取消</el-button>
				<el-button type="primary" v-if="states" class="sureBtn successBtn" @click="saveInfo" size="small">反馈</el-button>
				<el-button type="primary" v-if="!states" class="sureBtn cancelBtn" @click="closeModel" size="small">关闭</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        visible: {
            type: Boolean,
            default: false
        },
        formValidate: {
            type: Object,
            default: {fknr: ""},
            required: true
        },
        xcObj: {
            type: Object,
            default: {},
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
        dirTaskFile: {
            type: Array,
			default: [],
			required: true
        },
        states: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            rules: {
                fknr: [{
                    required: true,
                    message: "请输入反馈内容",
                    trigger: "blur"
                }]
            }
        }
	},
	mounted() {
		console.log(this.dirTaskFile)
	},
    methods: {
        closeModel() {
            let that = this
            that.visible = false
			this.$refs.proceUpload.clearFiles()
			this.$refs.ruleForm.clearValidate();
			this.$emit('closeModel', that.$refs.ruleForm, that.$refs.proceUpload)
			this.$emit('qqxcdfkcloseModel', that.$refs.ruleForm, that.$refs.proceUpload)
        },
        saveInfo() {
			this.$emit('saveInfo')
			this.$emit('qqxcdfksaveInfo')
        },
        handlePrev(item) {
            this.$emit('handlePrev', item)
			this.$emit('handlePrevv', item)
        },
        handleProcedFile(e) {
            this.$emit('handleProcedFile', e)
		},
		handleTaskRemoveRW(){
			this.$emit('handleTaskRemoveRW')
		}
    }
}
</script>

<style>
    .modal-ct .el-form-item {
        /*margin-bottom: 20px;*/
    }
</style>
