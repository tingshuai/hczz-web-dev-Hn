<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">
		<Form inline :label-width="75" class="search-ct">
			<FormItem label="案件名称：">
				<Input type="text" v-model="basePage.ajmc"  placeholder="请输入案件名称" clearable style="width: 180px"></Input>
			</FormItem>
			<FormItem label="申请人：">
				<Input type="text" v-model.trim="basePage.sqrxm" placeholder="请输入申请人" clearable style="width: 180px"></Input>
			</FormItem>
			<FormItem label="签收时间：">
				<DatePicker type="daterange" :start-date="new Date(new Date()-30*24*3600*1000)" clearable placement="bottom-end" placeholder="请选择下发时间" style="width: 180px" @on-change="handleDate"></DatePicker>
			</FormItem>
			<Button type="primary" class="searchBtn" @click="search" style="margin-right:8px;">查询</Button>
		</Form>
		<Modelfk
			:title="title"
			:visible="visible"
			:xcObj="xcObj"
			:states="states"
			:formValidate="formValidate"
			:dirTaskFileSX="dirTaskFileSX"
			:dirTaskFileRW="dirTaskFileRW"
			:dirTaskFile="dirTaskFile"
			@closeModel="closeModel"
			@saveInfo="saveInfo"
			@handlePrev="handlePrev"
			@handleProcedFile="handleProcedFile"
		></Modelfk>

		<div class="table-ct myTable" :style="{ height:height }">
			<el-table :data='list' :stripe="true" height="100%" :row-class-name="tableRowClassName">
				<el-table-column label="编号" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.sqwh">{{scope.row.sqwh}}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请人" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.sqr">{{scope.row.sqr}}</span>
					</template>
				</el-table-column>
				<el-table-column label="申请单位" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.sqbmmc">{{scope.row.sqbmmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="案事件名称" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.ajmc">{{scope.row.ajmc}}</span>
					</template>
				</el-table-column>
				<el-table-column label="简要任务内容" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span :title="scope.row.jyrwnr" class="text-overflow">{{scope.row.jyrwnr}}</span>
					</template>
				</el-table-column>
				<el-table-column label="签收时间" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span class="span-dqzt" :title="scope.row.qssj">{{scope.row.qssj|timestampToTime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
            			<span class="span-dqzt" :title="scope.row.zt">{{scope.row.zt|fkFilter}}</span>
						<Icon v-if="scope.row.zt <= 2" type="ios-alarm-outline" />						
						<span style="font-size:12px;" v-if="scope.row.zt <= 2">{{ scope.row.showTimeFk || "00:00:00" }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<a class="a-czl" v-if="scope.row.zt == 3 || scope.row.zt == 5" href="javascript:void(0)" @click="lookData(scope.row)">查看</a>
						<a class="a-czl" v-else href="javascript:void(0)" @click="add(scope.row)">反馈</a>

					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination-ct">
			<Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>

			<!-- <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="basePage.pageindex" :page-sizes="pageArray" :page-size="10" :total="total">
			</el-pagination> -->
		</div>
	</el-card>
</template>

<script>
	import api from '@/fetch/api.js';
	import Modelfk from './models/modelfk'
	import {timestampToTime} from '@/libs/common/common';

	export default {
		data() {
			return {
				states: false,
				title: "",
				basePage: {
					orderby:"qssj desc ",
					pageindex: 1,
					pagesize: 10,
                    ywlx:api.ywlx.qx,
					tszt: "1",
					lstzt:['2','3','5'],
					ajmc: null,
					sqrxm: null,
					starttime:'',
					endtime:''
				},
				pageArray: [10, 20, 30, 40],
				total: 0,
				list: [],//table列表
				height: 0,
				formValidate: {
					fknr: ""
				},
				resetObj: {
					procedFileArr: [],//上传的反馈附件
				},
				visible: false,
				xcObj: {},
				dirTaskFileSX: [],//手续附件
				dirTaskFileRW: [],//任务附件
				dirTaskFile: []//反馈附件
			}
		},
		components: {
			Modelfk
		},
		mounted() {
			this.$nextTick(() => {
				this.render();
				this.timeDown();
				this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
				window.onresize = () => {
					this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
				}
			})
		},
		filters:{
             fkFilter(val){
				 if(val==2){
					 return '待反馈'
				 }else{
					 return '已反馈'
				 }
			 }
		},
		methods: {
			timeDown(){
				clearInterval( this.interval );
				this.interval = setInterval(() => {
				this.list.forEach((row,i,arr) => {
					let _qs = new Date(row.sqrq + row.qssx*60000).getTime() - Date.now();
					let _fk = new Date(row.sqrq + row.fksx*60000).getTime() - Date.now()
					_qs < 1000 ? this.$set(arr[i],"showTimeQs","00:00:00") : this.$set(arr[i],"showTimeQs",this.formatDuring(_qs) );
					_fk < 1000 ? this.$set(arr[i],"showTimeFs","00:00:00") : this.$set(arr[i],"showTimeFk",this.formatDuring(_fk) );
				});
				}, 1000);
			},
			tableRowClassName({row, rowIndex}) {
				let _timefksj = new Date(row.sqrq + row.fksx*60000).getTime() - Date.now()
				let _timeqssj = new Date(row.sqrq + row.qssx*60000).getTime() - Date.now();
				if ( row.zt <= "2" && _timefksj < 3600*1000 && _timefksj > 1000 ) {//待签收待反馈低于1小时...
					return 'nearly'
				}else if( row.zt <= "2" && _timefksj < 1000 ){//代签收待反馈超时....
					return "chaoshi"
				}else{
					return 'white';
				}
			},
			formatDuring(mss) {
				var hours = parseInt(mss / (1000 * 60 * 60) );
				var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = (mss % (1000 * 60)) / 1000;
				return ( hours<10 ? `0${hours}` : hours ) + ":" + (parseInt(minutes)<10 ? `0${minutes}` : minutes) + ":" + (parseInt(seconds)<10 ? `0${parseInt(seconds)}` : parseInt(seconds) );
			}, 			
			pageChange(val) {
					this.basePage.pageindex = val;
					this.render();
				},
				pagesizeChange(){
					this.basePage.pagesize = val;
					this.render();
			},
			render() {
				api.api('post', api.configUrl + '/hczz/qqxc/querySqxxList', this.basePage).then(res => {
					this.list = res.list;
					this.total = res.total;
				})
			},
			handleProcedFile(e) {
				// console.log(e)
				this.resetObj.procedFileArr.push(this.handleFileDate(e, "3"));
			},
			handleTaskRemoveRW(file, fileList) {
				this.resetObj.procedFileArr = this.resetObj.procedFileArr.filter(item => {
					return item.filename + '.' + item.category !== file.name;
				});
			},
			closeModel(ruleForm, proceUpload) {
				this.visible = false
				this.formValidate.fknr = null;
				//ruleForm.resetFields();
				// if(this.states) {
				// 	proceUpload.clearFiles();
				// }
				this.resetObj.procedFileArr = [];
			},
			saveInfo() {
				// console.log(123)
				// console.log(this.resetObj.procedFileArr)
				let refk = {
					id: this.xcObj.id,
					fknr: this.formValidate.fknr
				}
				let objs = {
					sqxx: refk,
					attach: this.resetObj.procedFileArr
				}
				api.api('post', api.configUrl + '/hczz/qqxc/sqxxFk', objs).then(res => {
					this.$message.success("恭喜你反馈成功");
					this.render();
					this.closeModel();
				})
			},
			add(val) { //反馈的点击事件
				this.visible = true;
				this.states = true;
				api.api('get', api.configUrl + '/hczz/qqxc/getDetailById', {
                    sqid: val.id
				}).then(res => {
					this.obj = res;
					this.xcObj = res.data;
					this.title = "反馈请求";
					this.getRWFile(res.data.id);
					this.getSXFile(res.data.id);

				})
			},
			lookData(params) { //查看的点击事件
				this.visible = true;
				this.states = false;
				api.api('get', api.configUrl + '/hczz/qqxc/getDetailById', {
                    sqid: params.id
				}).then(res => {
					this.obj = res;
					this.xcObj = res.data;
					this.formValidate.fknr = this.xcObj.fknr;
					this.title = "title"+this.xcObj.sqwh
					this.getRWFile(res.data.id);
					this.getSXFile(res.data.id);
					this.getFile(res.data.id);
				})
			},
			search() {
				this.basePage.pageindex = 1;
				this.render();
			},
			handleSizeChange(val) {
				this.basePage.pagesize = val;
				this.render();
			},
			handleCurrentChange(val) {
				this.basePage.pageindex = val;
				this.render();
			},
			handleFileDate(e, type) {
				let Obj = {};
				Obj["category"] = e.name.replace(/.+\.+/g, "");
				var reg = new RegExp("." + Obj["category"] + "$");
				Obj["filename"] = e.name.replace(reg, "");
				Obj["minetype"] = e.raw.type;
				this.readerFile(e.raw).then(res => {
					Obj["data"] = res.split('base64,')[1]
				});
				Obj["type"] = type;
				return Obj;
			},
			readerFile(file) {
				return new Promise(reslove => {
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function() {
						reslove(this.result);
					};
				});
			},
			getRWFile(id) {
				api.api('post', api.configUrl + '/hczz/fj/getFjData', {
					glid: id,
					tablename: 'T_HCZZ_SQXX',
					type: '2'
				}).then(res => {
					this.dirTaskFileRW = res;
				})
			},
			getSXFile(id) {
				api.api('post', api.configUrl + '/hczz/fj/getFjData', {
					glid: id,
					tablename: 'T_HCZZ_SQXX',
					type: '1'
				}).then(res => {
					this.dirTaskFileSX = res;
				})
			},
			getFile(id) {
				api.api('post', api.configUrl + '/hczz/fj/getFjData', {
					glid: id,
					tablename: 'T_HCZZ_SQXX',
					type: '3'
				}).then(res => {
					this.dirTaskFile = res;
				})
			},
			handlePrev(val) {
				api.upload(val);
			},
			handleDate(val) {
				if(val[0]!=''){
					this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
					this.basePage.endtime = new Date(`${val[1]} 23:59:59`);
				}else{
					this.basePage.starttime = '';
					this.basePage.endtime = '';
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.myTable{
		/deep/ .chaoshi {
			background: #faa6a7;
		}
		/deep/ .nearly {
			background: #ffddab;
		}
		/deep/ .over{
			background:white;
		}
		.orSpan {
			color: orange;
		}
		.blSpan {
			color: #333333;
		}
	}
	ul {
		list-style: none;
	}
	
	.searchTree {
		position: absolute;
		z-index: 99;
		width: 500px;
		height: 178px;
		overflow: auto;
	}
	
	.modal-ct .oSpan {
		width: 100%;
		display: inline-block;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.modal-ct .el-form-item{margin-bottom: 0;}
	.el-dialog .el-form-item__content .oSpan {
		display: inline-block;
		word-wrap: break-word;
		width: 100%;
	}
	
	.el-dialog .el-form-item__content .tastFile {
		word-break: break-all;
	}
</style>