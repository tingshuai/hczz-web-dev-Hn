<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn" v-if="rowObj.blzt==0">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure" v-if="rowObj.blzt==0">确定</Button>
					<Button type="default" class="cancelBtn" @click="cancelBtn" v-if="rowObj.blzt!=0">关闭</Button>
				</div>
				<div style="height: 450px;overflow: auto;">
					<el-tabs v-model="activeName" @tab-click="handleClick" style="height: 450px;">
						<el-tab-pane label="流程轨迹" name="handle">
							<handle :fncHandle="fncHandle"></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="materials margin-top-20" v-if="rowObj.blzt==0">
					<Form ref="approve" :rules="ruleValidate" :label-width="120">
						<FormItem label="补充材料">
							<loadFile @on-change="proceduresFiles" ref="proceduresFiles" :choiceList="columnsDataone"></loadFile>
							<div v-if="columnsDataone.length">
								<div v-for='(item,index) in columnsDataone' :key="index">
									<span>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<Icon type="close-circled" @click="del(index)"></Icon>
								</div>
							</div>
						</FormItem>
						<FormItem label="备注">
							<Input v-model.trim="formDynamic.blbz" clearable type="textarea" :rows="4" placeholder="请输入备注信息" :maxlength="120"></Input>
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
			return {
				activeName: 'handle',
				ruleValidate: {
					bccl: [{
						required: true,
						message: '请上传补充材料',
						trigger: 'blur'
					}]
				},
				formDynamic:{blbz:''},
				visible: this.show,
				proceduresObj: {},
				detail: {},
				columnsDataone: [],
				fncHandel: null,
				fncDetail: null,
				disabled:false,
				readonly:false
			}
		},
		computed: {
			title() {
				return  '编号：'+this.rowObj.sqwh
			}
		},
		created() {
			
			this.fncHandle =this.getFlow();
			this.fncDetail = this.getDetail();
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
			cancelBtn() {
				this.$emit('update');
			},
			sure() {
				let attach = [];
				$.each(this.columnsDataone, (index, val) => {
					attach.push({
						category: val.category,
						filename: val.filename,
						minetype: val.minetype,
						data: val.data,
						type: '3'
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
					blbz: this.formDynamic.blbz,
					attachList: attach,
					id:this.rowObj.id
				}
				api.api('post', api.configUrl + '/hczz/hc/blrw/handleBlrw', objs).then(res => {
					this.$message.success('补充材料成功')
					this.$emit('update', 'a');
				})
			},
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			getDetail() {
				return new Promise((resolve, reject) => {
					api.api('get',api.configUrl+'/hczz/zhb/queryDetail/'+this.rowObj.sqid).then(res => {
						resolve(res)
					})
				})
			},
			getFlow(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/zhb/getFlow/'+this.rowObj.sqid).then(res=>{
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