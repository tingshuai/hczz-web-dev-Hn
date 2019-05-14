<template>
	<div class="start" :style="{height:height}">
		<el-form ref="request" :model="zzzbObj" :rules="zzzbRules" label-width="120px" class="padding-left-20 padding-right-20">
			<div class="tableStyle">
				<table border="1" cellspacing="0">
					<tr v-if="zwly==2">
						<th>
							<el-form-item label="案事件名称:">
								<p >{{zzObj.ajmc}}</p>
							</el-form-item>
						</th>
						<th>
							<el-form-item label="涉案编号:">
								<p v-if="zwly==2">{{zzObj.ajbh}}</p>
								<p v-else>{{zzObj.jjdbh}}</p>
							</el-form-item>
						</th>
					</tr>
					<tr v-if="zwly==2">
						<th>
							<el-form-item label="事件类型:">
								<p >{{zzObj.ajlbMc}}</p>
							</el-form-item>
						</th>
						<th>
							<el-form-item label="事件时间:">
								<p v-if="zwly==2">{{zzObj.slsj|timestampToTime}}</p>
								<p v-else>{{zzObj.bjsj}}</p>
							</el-form-item>
						</th>
					</tr>
					<tr v-if="zwly==1">
						<th :colspan="2">
							<el-form-item label="案事件名称:" prop="ajmc">
								<el-input placeholder="请输入案事件名称" v-model="zzzbObj.ajmc" :maxlength="20"></el-input>
							</el-form-item>
						</th>
					</tr>
					<tr v-if="zwly==1">
						<th :colspan="2">
							<el-form-item label="涉案编号:">
								<p v-if="zwly==2">{{zzObj.ajbh}}</p>
								<p v-else>{{zzObj.jjdbh}}</p>
							</el-form-item>
						</th>
					</tr>
					<tr v-if="zwly==1">
						<th>
							<el-form-item label="事件类型:">
								<p >{{zzObj.bjlxmc}}</p>
							</el-form-item>
						</th>
						<th>
							<el-form-item label="事件时间:">
								<p >{{zzObj.bjsj|timestampToTime}}</p>
							</el-form-item>
						</th>
					</tr>
					<tr>
						<th :colspan="2">
							<el-form-item label="简要案情:">
								<p v-if="zwly==2" style="">{{zzObj.jyaq}}</p>
								<p v-else>{{zzObj.bjnr}}</p>
							</el-form-item>
						</th>
					</tr>
					<tr>
						<th :colspan="2">
							<el-form-item label="事件案发地点:">
								<p v-if="zwly==2">{{zzObj.ajdzmc}}</p>
								<p v-else style="">{{zzObj.afdd}}</p>
							</el-form-item>
						</th>
					</tr>
					<tr>
						<th :colspan="2">
							<el-form-item label="简要任务内容:">
								<el-input type="textarea" :rows="3" v-model="zzzbObj.jyrwnr" :maxlength="100"></el-input>
							</el-form-item>
						</th>
					</tr>
					<tr>
						<th :colspan="2">
							<el-form-item label="相关文件:">
								<p></p>
							</el-form-item>
						</th>
					</tr>
					<tr>
						<th :colspan="2">
							<el-form-item label="任务附件:">
								<Upload @on-change="taskFiles" ref="taskFiles"></Upload>
							</el-form-item>
						</th>
					</tr>
					<tr>
						<th :colspan="2">
							<el-form-item label="协警类型:" prop="checkList">
								<el-checkbox-group v-model="zzzbObj.checkList">
									<el-checkbox :label="item.jzbh" :key="item.jzbh" v-for="item in typeList">{{item.jzjc}}</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
						</th>
					</tr>
					<tr v-for="(item,index) in tableList2">
						<th :colspan="2">
							<el-form-item :label="item.mbmc+':'" v-if="item.children">
								<table border="1" cellspacing="0" class="bottomTable">
									<tr>
										<th>序号</th>
										<th v-for="thItem in item.children">{{thItem.mbmc}}</th>
										<th class="deleteTh">删除</th>
									</tr>
									<tr v-for="(listItem,listIndex) in item.list">
										<td>{{listIndex+1}}</td>
										<td v-for="thItem in item.children">
											<el-input :maxlength="thItem.cdxz" v-model="listItem[thItem.mbdm]"></el-input>
										</td>
										<td>
											<i class="el-icon-circle-close-outline deleteIcon" @click="del(index,listIndex)"></i>
										</td>

									</tr>
									<tr>
										<th :colspan="item.children.length+2">
											<el-button type="primary" size="small" :maxlength="item.cdxz" @click="add(index)">增加</el-button>
										</th>
									</tr>
								</table>
							</el-form-item>
							<el-form-item :label="item.mbmc+':'" v-else>
								<el-input type="textarea" :rows="3" v-model="item.wbk" :maxlength="item.cdxz"></el-input>
							</el-form-item>
						</th>
					</tr>
				</table>
			</div>
			<div class="btn">
				<el-button size="small" @click="cancelBtn">取消</el-button>
				<!--<el-button size="small">导出</el-button>-->
				<el-button size="small" @click="saveInfo" :disabled="disabled" :loading="zzajkloading">确定</el-button>
			</div>
		</el-form>
	</div>

</template>

<script>
	import api from '@/fetch/api.js';
	import $ from 'jquery';
	import {timestampToTime} from '@/libs/common/common';
	import Upload from '@/views/main-components/file-upload/loadFile.vue';
	export default {
		components: {
			Upload
		},
		data() {
			return {
				height:0,
				zzajkloading:false,//案件库确定loading
				zzzbObj: {
					ajmc:null,
					jqajlx: null,
					afdz: null,
					slsj:null,
					jyrwnr:null,
					checkList: [],
					jqajzs:''
				},
				zzzbRules: {
					checkList: [{
						required: true,
						message: '协警类型为必填项'
					}],
					jyrwnr: [{
						required: true,
						message: '简要任务内容为必填项',
						trigger: 'blur'
					}],
					ajmc: [{
						required: true,
						message: '请输入案件名称',
						trigger: 'blur'
					}],

				},
				tableList: [], //所有类型下的表格
				tableList2: [], //选择当前类型下的表格
				typeList: [], //类型列表
				taskObj: [], //任务附件
				proceduresObj: [], //手续附件
				ajlxList: [], //案件类型数组
				disabled:false
			}
		},
		mounted() {
			this.height = $(window).height()  - 190 + 'px';
			window.onresize = () => {
				this.height = $(window).height() -190 + 'px';
			}
			this.getType();
			this.getTable();
			if(this.rwly==2){
				
//				this.zzzbObj.jqajzs=this.zzObj.jyaq;
			}else{
				
//				this.zzzbObj.jqajzs=this.zzObj.bjnr;
			}
		},
		created(){
			console.log(this.$route.query.obj,"KKKKKKKBBB")
		},
		computed: {
			zzObj() {
				return this.$route.query.obj
			},
			zwly() {
				return this.$route.query.rwly
			},
			activeName() {
				return this.$route.query.active
			}
		},
		watch: {
			'zzzbObj.checkList' (val) {
				this.tableList2 = [];
				if(val.length) {
					val.forEach(item => {
						let arr = this.tableList.filter(res => {
							return res.jzbh == item;
						})
						this.tableList2 = [...this.tableList2, ...arr];
					})

				} else {
					this.tableList2 = [];
				}
			}
		},
		methods: {
			getType() { //获取设置的类型
				api.api('get', api.configUrl + '/hczz/jzpz/queryAllValid').then(res => {
					this.typeList = res;
				})
			},
			getTable() { //获取所有的table
				api.api('get', api.configUrl + '/hczz/jzpz/getTemplByJzbh').then(res => {
					this.tableList = res;

					this.tableList.map(item => {
						let obj = {};
						if(item.children) {
							item.children.map(val => {
								obj[val.mbdm] = ''
							})

						} else {
							this.$set(item, 'wbk', '')
						}
						this.$set(item, 'list', [obj])
					})
				})
			},
			add(index) { //点击每一个table的增加按钮
				let obj = {};
				this.tableList2[index].children.map(item => {
					obj[item.mbdm] = '';
				})
				this.tableList2[index].list.push(obj)
			},
			del(index1, index2) {
				this.tableList2[index1].list.splice(index2, 1);
			},
			saveInfo() {
				this.$refs.request.validate((valid) => {
					if(valid) {
						this.zzajkloading = true;
						this.disabled=true;
						let zhbList = [];
						this.tableList2.forEach(item => {
							if(item.children) {
								item.list.forEach((i, index) => {
									if(item.children) {
										item.children.forEach(m => {
											zhbList.push({
												key: index + 1,
												value: i[m.mbdm],
												mbdm: m.mbdm
											})
										})
									}
								})
							} else {
								zhbList.push({
									key: 1,
									value: item.wbk,
									mbdm: item.mbdm
								})
							}
						})
						let obj = {};
						let attach = [];
						$.each(this.proceduresObj.fileList, (index, val) => {
							attach.push({
								category: val.name.split('.')[1],
								filename: val.name.split('.')[0],
								minetype: this.proceduresObj.baseArr[index].split('base64,')[0],
								data: this.proceduresObj.baseArr[index].split('base64,')[1],
								type: 0
							})
						})
						$.each(this.taskObj.fileList, (index, val) => {
							attach.push({
								category: val.name.split('.')[1],
								filename: val.name.split('.')[0],
								minetype: this.taskObj.baseArr[index].split('base64,')[0],
								data: this.taskObj.baseArr[index].split('base64,')[1],
								type: 1
							})
						})
						obj.attach = attach;
						if(this.zwly == 2) {
							obj.ajmc = this.zzObj.ajmc;
							obj.sabjbh = this.zzObj.ajbh;
							obj.jqajlx = this.zzObj.ajlbMc;
							obj.jqajzs = this.zzObj.jyaq;
							this.zzzbObj.slsj=this.zzObj.slsj;
				            this.zzzbObj.afdz=this.zzObj.ajdzmc;
						} else {
							obj.ajmc = this.zzObj.ajmc;
							obj.sabjbh = this.zzObj.jjdbh;
							obj.jqajlx = this.zzObj.bjlxmc;
							obj.jqajzs = this.zzObj.bjnr;
							this.zzzbObj.slsj=this.zzObj.bjsj;
				            this.zzzbObj.afdz=this.zzObj.afdd;
						}
						
						if(this.zwly == 1){
							obj.ajmc = this.zzzbObj.ajmc;
						}
						obj.jyrwnr = this.zzzbObj.jyrwnr;
						obj.afdz = this.zzzbObj.afdz;
						obj.slsj = this.zzzbObj.slsj;
						obj.rwly = this.zwly;
						obj.jzList = [];
						let brr = [];
						this.zzzbObj.checkList.forEach(item => {
							let arr = this.typeList.filter(val => {
								return val.jzbh == item;
							})
							brr = brr.concat(arr);
						})
						brr.forEach(item => {
							obj.jzList.push({
								jzpzid: item.id,
								jzbh: item.jzbh,
								jzjc: item.jzjc
							})
						})
						obj.zhbList = zhbList;
						api.api('post', api.configUrl + '/hczz/zhb/insert', obj,(code)=>{
							console.log(code,"LLLl")
							if(code == 400){
								this.zzajkloading = false;
							}
						}).then(res => {
							this.zzajkloading = false;
							this.$message.success('发起成功')
							this.cancelBtn();
							this.disabled=false;
						})
					}
				})
			},
			taskFiles(val) {
				this.taskObj = val;
			},
			proceduresFiles(val) {
				this.proceduresObj = val;
			},
			cancelBtn() {
				this.$refs['request'].resetFields();
				this.$refs.taskFiles.obj.fileList = [];
				this.$refs.taskFiles.obj.baseArr = [];
				this.disabled=false;
				this.$router.push({
					path: '/fullTimeSet/fullTimeSetManager',
					query: {
						activeName: this.activeName
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.start {
		overflow-y: auto;
		background: white;
		height: 100%;
		padding-top: 20px;
		form {
			background: white;
			padding-bottom: 50px;
			th {
				/*height: 70px !important;*/
				text-align: left;
				padding: 0 20px;
				.el-form-item {
					/*margin: 18px 0 25px;*/
					width: 100%;
					padding: 10px 0;
					margin-bottom: 0px;
					.el-form-item-content {
						max-width: calc(~"100% - 120px");
						p {
							text-align: left;
						}
					}
				}
				.bottomTable {
					th {
						text-align: center;
						width: auto;
					}
					.deleteTh {
						width: 80px;
					}
				}
			}
			.specialTh {
				padding: 10px 20px;
			}
			td {
				text-align: center;
				.deleteIcon {
					font-size: 20px;
				}
				.el-input {
					padding: 5px;
				}
			}
			.btn {
				padding: 20px;
				border: 1px solid #ececec;
				text-align: right;
			}
		}
	}
</style>