<template>
	<div class="ccj">
	<el-dialog class="thebody" @close='closeModel' :visible.sync="visible" width="100%" top="60px" :modal="false">
		<div>
			<div class="thebtnn">
				<Button type="default" class="cancelBtn" @click="fkBtn">反馈结果</Button>
				<Button type="default" class="cancelBtn" @click="fkBtn">反馈结果评价</Button>
				<Button type="default" class="cancelBtn" @click="lcBtn">流程轨迹</Button>
				<Button type="default" class="cancelBtn" @click="xxBtn">详细信息</Button>
			</div>
			<!--<h3 class="thetit margin-top-20">评价</h3>-->
			<div class="clearfix tableStyle thistable">
				<table border="1" cellspacing="0">
					<tr>
						<th>服务态度</th>
						<th colspan="3">
							<el-rate v-model="value1"></el-rate>
						</th>
					</tr>
					<tr>
						<th>反馈速度</th>
						<th colspan="3">
							<el-rate v-model="value2"></el-rate>
						</th>
					</tr>
					<tr>
						<th>反馈效果</th>
						<th colspan="3">
							<el-rate v-model="value3"></el-rate>
						</th>
					</tr>
					<tr>
						<th>是否破案</th>
						<th>
							<el-radio v-model="radio1" label="1">是</el-radio>
							<el-radio v-model="radio1" label="2">否</el-radio>
						</th>
						<th>是否发挥作用</th>
						<th>
							<el-radio v-model="radio2" label="1">是</el-radio>
							<el-radio v-model="radio2" label="2">否</el-radio>
						</th>
					</tr>
					<tr>
						<th>抓获人数</th>
						<th colspan="3">
							<el-input v-model="zhrs" placeholder="请输入内容"></el-input>
						</th>
					</tr>
					<tr>
						<th>评价内容</th>
						<th colspan="3">
							<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="pjnr">
							</el-input>
						</th>
					</tr>
				</table>
				<div class="thebottom">
					<Button type="default" class="cancelBtn">关闭</Button>
					<Button type="primary" class="sureBtn" @click="saveInfo">提交</Button>
				</div>
			</div>

		</div>
		<div class="special">
			<!--反馈结果-->
			<fkjg :show.sync="fkshow"></fkjg>
			<!--流程轨迹-->
			<lcgj :show.sync="lcshow"></lcgj>
			<!--详细信息-->
			<xxxx :show.sync="xxshow"></xxxx>
		</div>
	</el-dialog>
	</div>
</template>
<script>
	import fkjg from "./fkjg.vue";
	import lcgj from "./lcgj.vue";
	import xxxx from "./xxxx.vue";
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
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
				value1: null,
				value2: null,
				value3: null,
				radio1: null,
				radio2: null,
				zhrs: null,
				pjnr: null,
				fkshow: false,
				lcshow: false,
				xxshow: false
			};
		},
		watch: {
			show() {
				this.visible = this.show;
			}
		},
		computed: {

		},
		methods: {
			closeModel() {
				this.$emit("update:show", false);
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
				
			}
		}
	};
</script>
<style lang="less">
	.ccj .el-dialog__body {
		height: 830px;
		z-index:99;
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
		height:350px;
	}
</style>