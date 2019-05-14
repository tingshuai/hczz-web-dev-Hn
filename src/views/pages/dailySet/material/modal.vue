<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" v-if="detail.sxzt==0" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div style="height: 500px;overflow: auto;">
					<el-tabs v-model="activeName" @tab-click="handleClick" style="height: 450px;">
						<el-tab-pane label="流程轨迹" name="handle">
							<handle :fncHandle="fncHandle" :sxzt="sxzt" :spzt="spzt"></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="materials" v-if="detail.sxzt==0">
					<Form ref="approve" :rules="ruleValidate" :label-width="120">
						<FormItem label="补充材料" prop="bccl">
							<loadFile @on-change="proceduresFiles" ref="proceduresFiles" :choiceList="columnsDataone"></loadFile>
							<div v-if="columnsDataone.length">
								<div v-for='(item,index) in columnsDataone'>
									<span>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<i class="el-icon-error" @click="del(index)"></i>
								</div>
							</div>
						</FormItem>
						<FormItem label="备注">
							<Input v-model.trim="bz" clearable type="textarea" :rows="4" placeholder="请输入备注信息" :maxlength="120"></Input>
						</FormItem>
					</Form>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import Upload from '@/views/main-components/file-upload/fileUpload.vue';
	import api from '@/fetch/api';
	import detail from './detail';
	import handle from './handle';
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	export default {
		components: {
			Upload,
			handle,
			detail,
			loadFile
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			rowObj: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			const bcclVidator = (rule, value, callback) => {
				console.log(this.proceduresObj)
				if(!this.proceduresObj.fileList) {
					return callback('材料不能为空')
				}
				return callback()
			}
			return {
				activeName: 'handle',
				ruleValidate: {
					bccl: [{
						required: true,
						message: '请上传补充材料',
						validator: bcclVidator
					}]
				},
				visible: this.show,
				proceduresObj: {},
				detail: {},
				columnsDataone: [],
				fncHandel: null,
				fncDetail: null,
				sxzt: '0', //状态
				bz: '', //补充材料的备注
				spzt:''
			}
		},
		computed: {
			title() {
				return this.rowObj.sqwh
			}
		},
		created() {
			this.fncDetail = this.getDetail();
			this.fncHandle = this.getFlow();
			this.getDetail().then(res => {
				this.detail = res.sqxx;
				this.getAppendixone();

			})
		},
		mounted() {

		},
		watch: {
			show(val) {
				this.visible = val;
			}
		},
		methods: {
			handleClick(tab, event) {

			},
			async init() {
				await this.getDetail();
				this.getAppendixone();
			},
			cancelBtn() {
				this.$emit('update');
				this.$refs.approve.resetFields();
				this.resets();
			},
			sure() {
				this.$refs.approve.validate((valid) => {
					if(valid) {
						let sqxx = {
							id: this.rowObj.id,
							bz: this.bz
						}
						let attach = [];
						$.each(this.columnsDataone, (index, val) => {
							attach.push({
								category: val.category,
								filename: val.filename,
								minetype: val.minetype,
								data: val.data,
								type: 0
							})
						})
						$.each(this.proceduresObj.fileList, (index, val) => {
							attach.push({
								category: val.name.split('.')[1],
								filename: val.name.split('.')[0],
								minetype: this.proceduresObj.baseArr[index].split('base64,')[0],
								data: this.proceduresObj.baseArr[index].split('base64,')[1],
								type: 0
							})
						})
						let objs = {
							sqxx: sqxx,
							attach: attach
						}
						api.api('post', api.configUrl + '/hczz/za/updateBlsx', objs).then(res => {
							this.resets();
							this.$emit('update', 'a');
							this.$refs.approve.resetFields();
						})
					}
				})
			},
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			resets() {
				this.proceduresObj={};
				this.$refs.proceduresFiles.obj.fileList = [];
				this.$refs.proceduresFiles.obj.baseArr = [];
			},
			getAppendixone() {
				let objs = {
					type: 0,
					tablename: 'T_HCZZ_SQXX',
					glid: this.detail.id
				}
				api.api('post', api.configUrl + '/hczz/fj/getFjList', objs).then(res => {
					this.columnsDataone = res;
				})
			},
			getDetail() {
				return new Promise((resolve, reject) => {
					api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {
						id: this.rowObj.id
					}).then(res => {
						this.sxzt = res.sqxx.sxzt;
						this.spzt=res.sqxx.zt;
						resolve(res)
					})
				})
			},
			del(index) {
				this.columnsDataone.splice(index, 1);
			},
			getFlow() {
				return new Promise((resolve, reject) => {
					api.api('get', api.configUrl + '/hczz/za/getFlow/' + this.rowObj.id + '?type=0').then(res => {
						if(res) {
							resolve(res)
						}
					})
				})
			}
		}
	};
</script>
<style lang="less">

</style>