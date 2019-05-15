<template>
	<div class="approveStart">
		<div class="clearfix">
			<Modal v-model="visible" :title="title" class="modal-ct" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" v-if="rowObj.blzt==0" class="sureBtn" @click="sure">确定</Button>
				</div>
				<div style="height: 500px;">
					<el-tabs v-model="activeName"  @tab-click="handleClick" style="height: 450px;">
						<el-tab-pane label="流程轨迹" name="handle">
							<handle :fncHandle="fncHandle" :sxzt="sxzt" :spzt="spzt"></handle>
						</el-tab-pane>
						<el-tab-pane label="详细信息" name="detail">
							<detail :fncDetail="fncDetail"></detail>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="materials" v-if="rowObj.blzt==0">
                    <Form ref="approve" :rules="ruleValidate" :label-width="120">
                    <FormItem label="补充材料：">
							<loadFile @on-change="proceduresFiles" ref="proceduresFiles" :choiceList="columnsDataone"></loadFile>
							<div v-if="columnsDataone.length">
								<div v-for='(item,index) in columnsDataone' :key="index">
									<span>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
									<i class="el-icon-error" @click="del(index)"></i>
								</div>
							</div>
						</FormItem>
						<FormItem label="补充说明：">
							<el-input type="textarea" :rows="3" :maxlength="200" v-model="blbz"></el-input>
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
	import handle  from './handle';
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	export default {
		components: {
			Upload,
			handle,
			detail,
			loadFile
		},
		props: {
			show:{
				type:Boolean,
				default:false
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
				ruleValidate:{
					bccl:[{
						required:true,
						message:'请上传补充材料',
						trigger:'blur'
					}]
				},
				visible:this.show,
				proceduresObj: {},
				detail:{},
				columnsDataone:[],
				fncHandle:null,
				fncDetail:null,
				sxzt: '0', //状态
				spzt:'',
				blbz:''//补充说明
			}
		},
		computed:{
			title(){
				return '编号：'+this.rowObj.sqwh
			}
		},
		created(){
			this.fncHandle=this.getFlow();
			this.fncDetail=this.getDetail();
			this.getDetail().then(res=>{
				this.detail=res.sqxx;
				this.getAppendixone();
			})
		},
		mounted() {
            
		},
		watch:{
			show(val){
				this.visible=val;
			}
		},
		methods: {
			handleClick(tab, event) {
				
			},
			async init() {
				await this.getDetail();
				this.getAppendixone();
			},
			cancelBtn(){
				this.$emit('update');
//				this.$refs.approve.resetFields();
				this.resets();
			},
			sure(){
	            let attach=[];
	            $.each(this.columnsDataone, (index, val) => {
					attach.push({
						category: val.category,
						filename: val.filename,
						minetype: val.minetype,
						data: val.data,
						type: 0
					})
				})
	            $.each(this.proceduresObj.fileList,(index,val)=>{
	            	attach.push({
	            		category:val.name.split('.')[1],
	            		filename:val.name.split('.')[0],
	            		minetype:this.proceduresObj.baseArr[index].split('base64,')[0],
	            		data:this.proceduresObj.baseArr[index].split('base64,')[1],
	            		type:0
	            	})
	            })
	            let objs={
	            	id:this.rowObj.id,
	            	blbz:this.blbz,
	            	attachList:attach
	            }
	            api.api('post',api.configUrl+'/hczz/hc/blrw/handleBlrw',objs).then(res=>{
	            	this.$message.success('补充材料成功')
	            	this.$emit('update','a');
	            	this.resets();
	            	this.$refs.approve.resetFields();
	            })
          },
            proceduresFiles(val){
            	this.proceduresObj=val;
            },
            resets(){
				this.$refs.proceduresFiles.obj.fileList=[];
				this.$refs.proceduresFiles.obj.baseArr=[];
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
				return new Promise((resolve,reject)=>{
					api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {id: this.rowObj.sqid}).then(res => {
						this.sxzt = res.sqxx.sxzt;
						this.spzt=res.sqxx.zt;
						resolve(res)
					})
				})
			},
			del(index) {
				this.columnsDataone.splice(index, 1);
			},
			getFlow(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/za/getFlow/'+this.rowObj.sqid+'?type=0').then(res=>{
						if(res){
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