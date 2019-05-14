<template>
	<div class="ueditor">
		<div class="msDiv">
			<p class="msP">填写战果</p>
		</div>
		<div class="content">
			<p>战果描述</p>
			<div>
				<ueditor :content='content1' :config='config1'></ueditor>
			</div>
		</div>
		<!--<div class="fjDiv">
			<Form ref="request" :label-width="100">
				<FormItem label="附件上传">
					<loadFile @on-change="proceduresFiles" ref="proceduresFiles"></loadFile>
				</FormItem>
			</Form>

		</div>-->
		<div class="text-align-right margin-right-20 btn">
			<Button @click="cancel">取消</Button>
			<Button type="primary" @click="saveInfo">确定</Button>
		</div>
	</div>
</template>
<script>
	import loadFile from '@/views/main-components/file-upload/loadFile.vue';
	import api from '@/fetch/api';
	import ueditor from '@/views/main-components/ueditor/ueditor.vue';
	export default {
		components: {
			loadFile,
			ueditor
		},
		props: {
			menubar: {
				default: ''
			},
			height: {
				type: Number,
				required: false,
				default: 360
			}
		},
		data() {
			return {
				hasChange: false,
				hasInit: false,
				zgzj: null,
				content1: '',
				config1: {
					initialFrameWidth: '100%',
					initialFrameHeight: 350,
					wordCount: false,
				},
				ue1: "ue1", // 不同编辑器必须不同的id
				proceduresObj: []
			}
		},
		mounted() {
			if(this.type==2){
				this.getZgzjContent();
			}
		},
		computed: {
			ids() {
				return this.$route.query.sqid
			},
			type(){
				return this.$route.query.type
			},
			id(){
				return this.$route.query.id
			}
		},
		methods: {
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			saveInfo() {
				let urls=this.type==1?'/hczz/hc/zg/insertZgzj':'/hczz/za/updateZgzj';
				let content1 = UE.getEditor('ccc').getContentTxt();
				let obj = {
					sqid: this.ids,
					zgnr: content1,
					id:this.id
				}
				api.api('post', api.configUrl + urls, obj).then(res => {
					this.$message.success('总结成功')
					this.$router.back(-1);
					UE.getEditor('ccc').setContent('')
				})
			},
			getZgzjContent() {
				let obj = {
					sqid: this.ids,
				}
				api.api('post', api.configUrl + '/hczz/hc/zg/getZgzj', obj).then(res => {
					this.zgzj = res;
					UE.getEditor('ccc').setContent(res.zgnr)
				})
			},
			cancel() {
				this.$router.back(-1);
			}
		}
	}
</script>
<style scoped lang="less">
	.ueditor {
		background: #fff;
		.msDiv {
			border-bottom: 1px solid #ececec;
			.msP {
				height: 40px;
				line-height: 40px;
				margin-left: 20px;
			}
		}
		.content {
			overflow: hidden;
			height: 500px;
			border-bottom: 1px solid #ececec;
			p {
				width: 100px;
				float: left;
				padding-left: 20px;
				height: 500px;
				line-height: 500px;
				border-right: 1px solid #ECECEC;
			}
			div {
				float: left;
				margin-left: 20px;
				padding-top: 20px;
				width: calc(~'100% - 150px');
			}
		}
		.fjDiv {
			border-bottom: 1px solid #ececec;
			.ivu-form-item {
				/*margin-bottom: 0;*/
				margin:20px 0;
				.ivu-form-item-label {
					border-right: 1px solid #ECECEC;
				}
				/*.ivu-form-item-content{
					margin-left: 120px;
				}*/
			}
		}
		.margin-right-20 {
			padding: 20px;
		}
	}
</style>