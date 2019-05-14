<template>
	<div class="warn margin-top-20">
		<div class="clearfix">
			<Modal v-model="show" title="研判报告" class="modal-ct" width="600" :styles="{top: '20%'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<img @click="sure" src="@/images/zbImg/ypbg1.png" alt="">
					<!--<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">提交</Button>-->
				</div>
				<div class="form-submit">
					<Form ref="warns" :model="warn" :rules="ruleValidateWarn" :label-width="120" class="padding-left-20 padding-right-20">
						<div class="tableStyle">
							<FormItem label="研判报告统计时间：" prop="time">
								<el-date-picker size="small"  style="width: 360px;"  v-model="warn.time" @change="timeChange" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
								</el-date-picker>
							</FormItem>
							
							<FormItem label="研判报告内容：" prop="nr">
								<CheckboxGroup v-model="warn.nr">
							        <Checkbox label="重点人员情况"></Checkbox>
							        <Checkbox label="情报线索情况"></Checkbox>
							    </CheckboxGroup>
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
					time:'',
					
					starttime:'',
					endtime:'',
					nr:['情报线索情况']
				},
				pickerOptions2: {
					shortcuts: [{
						text: '最近三天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近十天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 10);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				ruleValidateWarn: {
					jfx: [{
						required: true,
						message: '加分项不能为空',
						trigger: 'change'
					}],
				},
				show: false,
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
			
			resets() {
				this.warn = {
					time: '',
					nr: ['情报线索情况']
				};
				this.fjObj=[];//附件
			},
			timeChange(val){
				if(val){
					this.warn.starttime=new Date(val[0]).getTime();
					this.warn.endtime=new Date(val[1]).getTime()+24*3600000;
				}else{
					this.warn.starttime='';
					this.warn.endtime='';
				}
			},
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