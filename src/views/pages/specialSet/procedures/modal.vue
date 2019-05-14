<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div style="height: 450px;overflow: auto;">
					<el-tabs v-model="activeName" @tab-click="handleClick" style="height: 450px;">
						<el-tab-pane label="流程轨迹" name="handle">
							<handle  :fncHandel="fncHandel"></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="materials">
					<Form ref="approve" :label-width="120">
						<!--<FormItem label="补全手续描述" prop="bz">
			            <Input v-model.trim="formDynamic.bz" clearable type="textarea" :rows="2" placeholder="请输入备注信息" :maxlength="120"></Input>
			        </FormItem>-->
						<FormItem label="补充材料">
							<loadFile @on-change="proceduresFiles" ref="proceduresFiles" :choiceList="columnsDataone"></loadFile>
							<div v-if="columnsDataone.length">
								<div v-for='(item,index) in columnsDataone'>
									<span>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<Icon type="close-circled" @click="del(index)"></Icon>
								</div>
							</div>
						</FormItem>
						<!--<FormItem label="备注" prop="bz">
			            <Input v-model.trim="formDynamic.bz" clearable type="textarea" :rows="4" placeholder="请输入备注信息" :maxlength="120"></Input>
			        </FormItem>-->
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
			rowObj:{
				type:Object,
				default:()=>{
					return {}
				}
			}
		},
		data() {
			return {
				activeName: 'handle',
				visible: this.show,
				params: {},
				proceduresObj: {},
				detail: {}, //申请信息
				columnsDataone: [], //已有的补充材料列表
				fncHandel:null,
				fncDetail:null
			}
		},
		created() {
             this.fncDetail=this.fncHandel=this.getDetail();
             this.fncDetail.then(res=>{
             	this.detail=res.sqxx;
             	this.getAppendixone();
             })
		},
		computed:{
			title(){
				return this.rowObj.ajmc
			}
		},
		watch: {
			show(val) {
				this.visible = val;
			}
		},
		methods: {
			handleClick(tab, event) {

			},
			cancelBtn() {
				this.$emit('update');
				this.resets();
				this.$refs.approve.resetFields();
			},
			sure() {
				let sqxx = {
					id: this.rowObj.id
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
					this.$emit('update', 'a');
					this.resets();
					this.$refs.approve.resetFields();
				})
			},
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			resets() {
				this.$refs.proceduresFiles.obj.fileList = [];
				this.$refs.proceduresFiles.obj.baseArr = [];
			},
			getAppendixone() {
				let objs = {
					type: 0,
					tablename: 'T_HCZZ_SQXX',
					glid: this.detail.id
				}
				api.api('post', api.configUrl + '/hczz/fj/getFjData', objs).then(res => {
					this.columnsDataone = res;
				})
			},
			getDetail() {
				return new Promise((resolve,reject)=>{
					api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {id: this.rowObj.id}).then(res => {
						resolve(res)
					})
				})
			},
			del(index) {
				this.columnsDataone.splice(index, 1);
			}
		}
	};
</script>
<style lang="less">

</style>