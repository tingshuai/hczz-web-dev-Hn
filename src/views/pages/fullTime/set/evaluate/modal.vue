<template>
	<div class="ccj">
	<el-dialog class="thebody" @close='closeModel' :visible.sync="visible" width="100%" top="60px" :modal="false">
		<div>
			<div class="thebtnn">
				<Button type="default" class="cancelBtn" @click="lcBtn">流程轨迹</Button>
				<Button type="default" class="cancelBtn" @click="fkBtn">反馈结果</Button>

				<Button type="default" class="cancelBtn" @click="xxBtn">详细信息</Button>
			</div>
			<span class="thetit">评价</span>
			<div class="tableStyle thistable">
				<table border="1" cellspacing="0">
					<tr>
						<th>是否破案</th>
						<th>
							<el-radio v-model="formitObj.sfpa" label="1" :disabled="disabled">是</el-radio>
							<el-radio v-model="formitObj.sfpa" label="0" :disabled="disabled">否</el-radio>
						</th>
						<th>是否发挥作用</th>
						<th>
							<el-radio v-model="formitObj.sffhzy" label="1" :disabled="disabled">是</el-radio>
							<el-radio v-model="formitObj.sffhzy" label="0" :disabled="disabled">否</el-radio>
						</th>
					</tr>
					<tr>
						<th>抓获人数</th>
						<th>
							<el-input v-model="formitObj.zhrs" placeholder="请输入内容" :maxlength="10" v-if="rowObj.zt==4"></el-input>
							<p v-else>{{formitObj.zhrs}}</p>
						</th>
						<th>是否提供材料</th>
						<th>
							<el-radio v-model="formitObj.sftj" label="1" :disabled="disabled">是</el-radio>
							<el-radio v-model="formitObj.sftj" label="0" :disabled="disabled">否</el-radio>
						</th>
					</tr>
					<tr>
						<th>评价内容</th>
						<th :colspan="3">
							<el-input type="textarea" :rows="2" placeholder="请输入内容" :maxlength="100" v-model="formitObj.zhpjnr" v-if="rowObj.zt==4">
							</el-input>
							<p v-else style="overflow: hidden;text-overflow: ellipsis;" :title="formitObj.zhpjnr">{{formitObj.zhpjnr}}</p>
						</th>
					</tr>
				</table>
				<div class="thebottom">
					<Button type="default" class="cancelBtn" @click="closeModel">关闭</Button>
					<Button type="primary" class="sureBtn" @click="saveInfo" v-if="rowObj.zt==4">提交</Button>
				</div>
			</div>

		</div>
		<div class="special">
			
			<!--流程轨迹-->
			<lcgj :show.sync="lcshow" :lcgjFnc="lcgjFnc"></lcgj>
			<!--反馈结果-->
			<fkjg :show.sync="fkshow" :fkjg="fkjg"></fkjg>
			<!--详细信息-->
			<xxxx :show.sync="xxshow" :xxFnc="xxFnc"></xxxx>
		</div>
	</el-dialog>
	</div>
</template>
<script>
	import api from '@/fetch/api.js';
	import fkjg from "./fkjg.vue";
	import lcgj from "./lcgj.vue";
	import xxxx from "./xxxx.vue";
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			rowObj:{
				type:Object,
				default:{}
			}
		},
		components: {
			fkjg,
			lcgj,
			xxxx
		},
		data() {
			return {
				visible: this.show,
				fkshow: false,
				lcshow: false,
				xxshow: false,
				lcgjFnc:null,
				xxFnc:null,
				fkjg:null,
				formitObj:{
					sfpa: null,//是否破案
					sffhzy: null,//是否发挥作用
					sftj:null,//是否提供材料
					zhrs: null,
					zhpjnr: null
				},
				disabled:false
			};
		},
		watch: {
			show() {
				this.visible = this.show;
			}
		},
		created(){
			this.lcgjFnc=this.getFlow();
			this.fkjg=this.xxFnc=this.getDetail();
		},
		methods: {
			closeModel() {
				this.$emit("update");
				this.$emit("zzzbdpj")
			},
			fkBtn() {
				this.fkshow = true
			},
			lcBtn() {
				this.lcshow = true
			},
			xxBtn() {
				this.xxshow = true
			},
			saveInfo(){
				api.api('post',api.configUrl+'/hczz/zhb/assess/'+this.rowObj.id,this.formitObj).then(res=>{
					this.$message.success("恭喜你评价成功");
					this.closeModel();
					

				})
			},
			getFlow(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/zhb/getFlow/'+this.rowObj.id).then(res=>{
						resolve(res)
					})
				})
			},
			getDetail(){
				return new Promise((resolve,reject)=>{
					api.api('get',api.configUrl+'/hczz/zhb/queryDetail/'+this.rowObj.id).then(res=>{
						resolve(res)
					})
				})
			},
			getPj(){
				console.log('33333')
				api.api('get',api.configUrl+'/hczz/zhb/assessDeatil/'+this.rowObj.id).then(res=>{
					this.formitObj=res;
				})
			}
		}
	};
</script>
<style lang="less">
	.ccj .el-dialog__body {
		height: 748px;
		z-index:99;
		overflow: auto;
	}
	
	/*.v-modal {
		width: 0px;
	}*/
	
	.thebtnn button {
		margin-left: 30px;
	}
	
	.thetit {
		font-size: 25px;
		position: absolute;
		left: 50%;
		display: block;
		width: 100px;
		text-align: center;
		margin-left: -50px;
		margin-top: 50px;
		margin-bottom: 50px;
	}
	
	.thistable {
		width: 900px;
		position: absolute;
		left: 50%;
		margin-left: -450px;
		margin-top: 100px;
	}
	
	.thistable input {
		border: none
	}
	
	.thistable textarea {
		border: none
	}
	
	.thebottom {
		width: 200px;
		position: absolute;
		left: 50%;
		margin-left: -100px;
		margin-top: 50px;
	}
	
	.thebottom .cancelBtn {
		float: left;
	}
	
	.thebottom .sureBtn {
		float: right;
	}
	.special .el-dialog__body{
		height:400px;
	}
	.ccj .el-dialog__wrapper {
		top:61px;
		right:31px;
		bottom:0;
		left:210px;
	}
</style>