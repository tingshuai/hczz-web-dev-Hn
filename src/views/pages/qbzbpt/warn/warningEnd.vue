<template>
	<div class="warn margin-top-20">
		<div class="clearfix">
			<Modal v-model="show" title="加分" class="modal-ct" width="550" :styles="{top: '20%'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">提交</Button>
				</div>
				<div class="form-submit">
					<Form ref="warns" :model="warn" :rules="ruleValidateWarn" :label-width="120" class="padding-left-20 padding-right-20">
						<div class="tableStyle">
							<FormItem label="减分项：" prop="jfx">
								<Select v-model="warn.jfx" placeholder="请选择加分项" :maxlength="16" style="width:246px">
									<Option value="1">关键作用(-5分)</Option>
									<Option value="2">重要作用(-3分)</Option>
									<Option value="3">一般作用(-2分)</Option>
								</Select>
							</FormItem>
							<FormItem label="分值：">
								<Input v-model.trim="warn.fz"  placeholder="请输入分值" :maxlength="16" style="width:246px"></Input>
							</FormItem>
							<FormItem label="合成作战成员单位：" prop="dw">
								<Select v-model="warn.dw" placeholder="请选择单位" :maxlength="16" style="width:246px">
									<Option value="1">单位1</Option>
									<Option value="2">单位2</Option>
									<Option value="3">单位3</Option>
								</Select>
							</FormItem>
							<FormItem label="手续附件：">
								<loadFile @on-change="proceduresFiles" ref="proceduresFiles"></loadFile>
							</FormItem>
							
						</div>
					</Form>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import Upload from '@/views/main-components/file-upload/fileUpload.vue';
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import $ from 'jquery';
	export default {
		components: {
			Upload,
			loadFile
		},
		props: {
			
		},
		data() {
			return {
				detailObj: {},
				warn: {
					jfx: '',
					fx: '',
					dw:'',
					
				},
				ruleValidateWarn: {
					jfx: [{
						required: true,
						message: '加分项不能为空',
						trigger: 'change'
					}],
				},
				show: false,
				fjObj:[]//附件
			}
		},
		watch: {
			obj(val) {
				this.detailObj = val;
			}
		},
		methods: {
			sure() {
				
			},
			cancelBtn() {
//				this.$emit('update');
				this.$refs.warns.resetFields();
			},
			proceduresFiles(val) {
				this.fjObj = val;
			},
			
			resets() {
				this.warn = {
					jfx: '',
					fx: '',
					dw:'',
				};
				this.fjObj=[];//附件
			},
			closeModal() {

			}
		}
	};
</script>
<style lang="less" scoped="scoped">
	.form-submit {
		margin-top: 20px;
			.ivu-form-item {
				margin-bottom: 17px;
				width: 100%;
				.ivu-form-item-content {
					max-width: calc(~"100% - 200px");
				}
			}
			.content {
				.lenSpan {
					position: absolute;
					color: #E6E6E6;
					bottom: 0;
					right: 30px;
				}
			}
		}
</style>