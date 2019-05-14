<template>
	<div>
		<el-dialog class="modal-ct workBench-group-modal" :title="title" @close='closeModel' width="900px" :visible.sync="show" :modal-append-to-body='false'>
			<el-form :model="formValidate" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="申请人：">
							<span :title="zlObj.sqr" class="oSpan">{{zlObj.sqr}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="申请单位：">
							<span :title="zlObj.sqbmmc" class="oSpan">{{zlObj.sqbmmc}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="联系电话：">
							<span :title="zlObj.sqrlxdh" class="oSpan">{{zlObj.sqrlxdh}} </span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="案件编号：">
							<span :title="zlObj.sabjbh" class="oSpan">{{zlObj.sabjbh}}</span>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="案件名称：">
							<span :title="zlObj.ajmc" class="oSpan">{{zlObj.ajmc}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="案件类型：" clearable fliterable>
							<span :title="zlObj.jqajlx" class="oSpan">{{zlObj.jqajlx}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="接收单位：">
							<span>{{zlObj.jsdwmc}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="案件简介：">
							<span :title="zlObj.bz" class="oSpan">{{zlObj.bz}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="协作内容：">
							<span :title="zlObj.jyrwnr" class="oSpan">{{zlObj.jyrwnr}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="sp_div" v-if="spyjObj && spyjObj.length>1">
						<el-form-item label="审批流程：">
							<div v-for="(spItem,index) in spyjObj" class="all_div" v-if="index>0" :key="index">
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
				<el-row class="file">
					<el-col :span="12">
						<el-form-item label="手续附件：">
							<a v-for='(item,index) in dirTaskFileSX' :key="index">
								<span style="margin-top: 0;color:#409eff" @click="handlePrev(item)" class="tastFile" :title="item.filename"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
							</a>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务附件：">
							<a v-for='(item,index) in dirTaskFileRW' :key="index">
								<span style="margin-top: 0;color:#409eff" @click="handlePrev(item)" class="tastFile" :title="item.filename"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
							</a>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer">
				<el-button type="default" @click="closeModel" class="cancelBtn" size="small">取消</el-button>
				<el-button type="default" @click="saveInfo" class="successBtn" v-if="!flag" size="small">签收</el-button>
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
				default: {},
				required: true
			},
			zlObj: {
				type: Object,
				require: {},
			},
			spyjObj: {
				type: Array,
				default: []
			},
			dirTaskFileSX: {
				type: Array,
				default: []
			},
			dirTaskFileRW: {
				type: Array,
				default: []
			},
			flag: {
				type: Boolean,
				default: false,
			},
			title: {
				type: String,
				default: null,
			}
		},
		data() {
			return {
				rules: {
					remark: [{
						required: true,
						message: "请填写审批意见",
						trigger: "blur"
					}]
				},
				show:this.visible
			}
		},
		watch:{
			visible(val){
				this.show=val;
			}
		},
		methods: {
			closeModel() {
				this.$emit('closeModel')
				this.$emit('qqxcdqscloseModel')
			},
			saveInfo() {
				this.$emit('saveInfo')
				this.$emit('qqxcdqssaveInfo')
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