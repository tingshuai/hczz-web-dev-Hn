<template>
	<div class="workbench-page">
		<div class="ddd" style="height:300px;width:100%;margin-bottom: 20px;">
			<Echarthome ref="chart" :echarttop="echarttop">
			</Echarthome>
		</div>
		<div class="work-todo-table">
			<el-card class="work-todo-table-card">
				<p slot="header">
					<img src="@/images/home/rwsx.png" alt="" />
					<span>任务事项</span>
				</p>
				<div class="radio">
					<el-radio v-model="radio" label="1">待办事项</el-radio>
					<el-radio v-model="radio" label="2">跟进事项</el-radio>
				</div>
				<Table :columns="columns" :data="dataCopy" :loading="loading"></Table>
				<div class="pagination-ct">
					<Page class="clientPage" :current.sync="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
				</div>
			</el-card>
		</div>
		<div class="group-modal" v-if="addGroupModal">
			<group-modal :show.sync="addGroupModal"></group-modal>
		</div>
		<select-leader :selectShow.sync="selectShow" @update="zzzbdpj"></select-leader>
		<!-- 专案评价弹窗 -->
		<div v-if="zahcdpjobj.show">
			<ModalzaDpj ref="modal" :show.sync="zahcdpjobj.show" @update="updateazpj" :rowObj="zahcdpjobj.rowObj"></ModalzaDpj>
		</div>
		<!-- 专案补充材料 -->
		<div v-if="zaBcclobj.show">
			<ModalzaBccl ref="modal" :show.sync="zaBcclobj.show" @update="updateZaBccl" :rowObj="zaBcclobj.rowObj"></ModalzaBccl>
		</div>
		<!-- 指令核查评价 -->
		<div v-if="zlhcpjobj.show">
			<ModalzlpjDpj :show.sync="zlhcpjobj.show" :directiveInfo.sync='zlhcpjobj.directiveInfo' @refreshPage="refreshPage"></ModalzlpjDpj>
		</div>
		<!-- 专案待审批 -->
		<div v-if="obj3.show">
			<ModalzaDsp ref="modal" :title="obj3.title" :id="obj3.id" :show="obj3.show" :taskObj="obj3.taskObj" @update="zaspupdate"></ModalzaDsp>
		</div>
		<!--日程合成待审批-->
		<div v-if="obj1.show">
			<ModalrcDsp ref="modal" :title="obj1.title" :id="obj1.id" :show="obj1.show" :taskObj="obj1.taskObj" @update="update1"></ModalrcDsp>
		</div>
		<!-- 日常合成-待评价： -->
		<div v-if="obj2.show">
			<ModalrcDpj ref="modal" :show="obj2.show" @update="updatehcpj" :rowObj="obj2.rowObj"></ModalrcDpj>
		</div>
		<!-- 请求协查审批 -->
		<div v-if="qqxcobj.show">
			<ModalxcDsp :visible="qqxcobj.show" :formValidate="qqxcobj.formValidate" :zlObj="qqxcobj.zlObj" :spyjObj="qqxcobj.spyjObj" :iszxqsry="qqxcobj.iszxqsry" :isneedparent="qqxcobj.isneedparent" :dirTaskFileSX="dirTaskFileSX" :dirTaskFileRW="dirTaskFileRW" @closeModel="qqxcspcloseModel" @saveInfo="qqxcspsaveInfo" @handlePrev="handlePrevv"></ModalxcDsp>
		</div>
		<!-- 请求协查待签收 -->
		<div v-if="qqxcdqsobj.show">
			<ModalxcDqs :title="qqxcdqsobj.title" :visible="qqxcdqsobj.show" :formValidate="qqxcdqsobj.formValidate" :zlObj="qqxcdqsobj.zlObj" :spyjObj="qqxcdqsobj.spyjObj" :dirTaskFileSX="dirTaskFileSX" :dirTaskFileRW="dirTaskFileRW" :flag="qqxcdqsobj.flag" @handlePrev="handlePrevv" @closeModel="qqxcdqscloseModel" @saveInfo="qqxcdqssaveInfo"></ModalxcDqs>
		</div>
		<!-- 请求协查待反馈 -->
		<div v-if="qqxcdfkobj.show">
			<ModalxcDfk :title="qqxcdfkobj.title" :visible="qqxcdfkobj.show" :xcObj="qqxcdfkobj.xcObj" :states="qqxcdfkobj.states" :formValidate="qqxcdfkobj.formValidate" :dirTaskFileSX="dirTaskFileSX" :dirTaskFileRW="dirTaskFileRW" :dirTaskFile="qqxcdfkobj.dirTaskFile" @saveInfo="qqxcdfksaveInfo" @closeModel="qqxcdfkcloseModel" @handlePrev="handlePrevv" @handleProcedFile="handleProcedFile"></ModalxcDfk>
		</div>
		<!-- 请求协查待评价 -->
		<div v-if="qqxcdpjobj.show">
			<ModalxcDpj :visible="qqxcdpjobj.show" :title="qqxcdpjobj.title" :formValidate="qqxcdpjobj.formValidate" :xcObj="qqxcdpjobj.xcObj" :isPj="qqxcdpjobj.isPj" :pjObj="qqxcdpjobj.pjObj" :dirTaskFileSX="dirTaskFileSX" :dirTaskFileRW="dirTaskFileRW" :dirTaskFile="dirTaskFile" @saveInfo="qqxcdpjsaveInfo" @handlePrev="handlePrevv" @closeModel="qqxcdpjcloseModel">
			</ModalxcDpj>
		</div>
		<!-- 指令核查待反馈签收 -->
		<div v-if="zlhcdfkobj.isSignIn">
			<ModalzlDqs :show.sync="zlhcdfkobj.isSignIn" :directiveInfo.sync='zlhcdfkobj.directiveInfo' @refreshPage="refreshPage"></ModalzlDqs>
		</div>
		<!-- 专制专专办待审批 -->
		<div v-if="zzzbdspobj.show">
			<ModalzzzbDsp ref="modal" :title="zzzbdspobj.title" :id="zzzbdspobj.id"  :task="zzzbdspobj.task"  :show="zzzbdspobj.show" @update="zzzbdspobja"></ModalzzzbDsp>
		</div>
		<!-- 专职专办待评价 -->
		<div v-if="zzzbdpjobj.show">
			<Modalzzzbdpj ref="modal" :show="zzzbdpjobj.show" @zzzbdpj="zzzbdpj" :rowObj="zzzbdpjobj.rowObj"></Modalzzzbdpj>
		</div>
		<!-- 专职专办补充材料 -->
		<div v-if="zzzbBcclobj.show">
			<ModalzzzbBccl ref="modal" :show="zzzbBcclobj.show" @update="zzzbBccl" :rowObj="zzzbBcclobj.rowObj"></ModalzzzbBccl>
		</div>
	</div>
</template>
<script>
	import Echarthome from '../common/Echarthome.vue'
	// import CaseCaketypesoild from '../common/CaseCaketypesoild.vue'
	// import ColumneChart from '../common/ColumneChart'
	import api from "@/fetch/api.js";
	import { timestampToTime } from '@/libs/common/common';
	import groupModal from "./groupModal/groupModal.vue";
	import selectLeader from './groupModal/select.vue';
	import Mock from "mockjs";
	//指令核查评价
	import ModalZlhcpj from '../directive/dispose/comment/Modal.vue';
	/*
	  代办事项，需要当前页面弹窗的对应模块 
	*/
	// 专案合成---待审批
	import ModalzaDsp from '../specialSet/approve/modal.vue';
	// 专案合成---待评价
	import ModalzaDpj from '../specialSet/evaluate/modal.vue';
	//专案合成补充材料
	import ModalzaBccl from '../specialSet/material/modal.vue';
	// 请求协查---待审批
	import ModalxcDsp from '../provincial/models/modelsp.vue';
	// 请求协查---待签收
	import ModalxcDqs from '../provincial/models/modeldqs.vue';
	// 请求协查---待反馈
	import ModalxcDfk from '../provincial/models/modelfk.vue';
	// 请求协查---待评价
	import ModalxcDpj from '../provincial/models/modelpj.vue';
	// 指令查询---待签收、待反馈---它们是同一个弹窗
	import ModalzlDqs from '../directive/dispose/signIn/signInModal.vue';
	// 指令查询评价---待评价
	import ModalzlpjDpj from '../directive/dispose/comment/commentModal.vue';
	//专职专办待审批
	import ModalzzzbDsp from '../fullTime/set/approve/modal';
	//专职专办待评价弹窗
	import Modalzzzbdpj from '../fullTime/set/evaluate/modal';
	//专职专办补充材料弹窗
	import ModalzzzbBccl from '../fullTime/set/material/modal';
	export default {
		components: {
			Echarthome,
			// ColumneChart,
			// CaseCaketypesoild,
			groupModal,
			selectLeader,
			Modalzzzbdpj, //专职专办--待评价
			ModalzzzbDsp, //专职专办--待审批
			ModalzzzbBccl, //专职专办补充材料
			ModalzaDsp, //专案合成---待审批
			ModalzaDpj, //专案待评价
			ModalzaBccl, //专案补充材料
			ModalxcDsp, //请求协查---待审批
			ModalxcDfk, //请求协查待反馈
			ModalzlDqs, //指令查询---待签收、待反馈(它们是同一个弹窗)
			ModalzlpjDpj, // 指令查询评价---待评价
			ModalxcDqs, //请求协查待审批
			ModalxcDpj, //请求协查待评价
		},
		watch: {
			radio(val) {
				this.columns.pop();
				if(val == 1) {
					this.columns.push(this.operateObj);
					this.getLeader(1)
				} else {
					this.gjsx(1);
					this.columns.push(this.stateObj);
				}
				this.basePage.current = 1;
				this.basePage.pageNum = 1;
			}
		},
		data() {
			return {
				radio: '', //待办事项 1 跟进事项2
				typeList: [], //专班状态列表
				echarttop: [],
				dirTaskFileSX: [],
				dirTaskFileRW: [],
				dirTaskFile: [], //反馈附件
				//专职专办待评价
				zzzbdpjobj: {
					show: false,
					rowObj: {},
					title: ''
				},
				//专职专办待审批
				zzzbdspobj: {
					title: '',
					show: false,
					id: '',
					task: {},
					approveZt: ''
				},
				//专职专办补充材料
				zzzbBcclobj: {
					show: false,
					rowObj: {}
				},
				// 专案合成待评价
				zahcdpjobj: {
					show: false,
					rowObj: {},
				},
				zaBcclobj: {
					show: false,
					rowObj: {},
				},
				//指令核查待反馈
				zlhcdfkobj: {
					isSignIn: false, //是否显示
					directiveInfo: {
						id: '',
						zlwh: ''
					}
				},
				//指令核查评价
				zlhcpjobj: {
					show: false,
					directiveInfo: {
						zlwh: '',
						id: ''
					}
				},
				//请求协查
				qqxcobj: {
					show: false,
					formValidate: {
						splx: "",
						remark: "",
						taskid: null,
						gzllx: "4",
						busid: null,
					},
					zlObj: {
						title: '',
						ajmc: ''
					},
					iszxqsry: false,
					isneedparent: false,
					spyjObj: [],

				},
				// 请求协查待签收
				qqxcdqsobj: {
					show: false,
					formValidate: {
						id: '',
						sqlx: '1',
						sabjbh: null,
						ajmc: null,
						jyrwnr: null,
						bz: null,
						jqajlx: null,
						parentid: null
					},
					zlObj: {
						id: '',
						ajmc: '',
						jsdwmc: '',
						sqbmmc: '',
						jyrwnr: '',
						sabjbh: '',
						jqajlx: '',
						sqr: '',
						sqrlxdh: '',
						title: ''
					},
					spyjObj: [],
					flag: false,
					title: '',
					states: false,

				},
				//请求协查待反馈、
				qqxcdfkobj: {
					states: false,
					show: false,
					title: '',
					xcObj: {},
					formValidate: {
						fknr: ""
					},
					dirTaskFileSX: [],
					dirTaskFileRW: [],
					dirTaskFile: [], //反馈附件
					resetObj: {
						procedFileArr: [], //上传的反馈附件
					},
				},
				//请求协查待评价
				qqxcdpjobj: {
					show: false,
					title: '',
					formValidate: {
						fksd: 0,
						fktd: 0,
						yyxg: 0,
						zhpjnr: null
					},
					xcObj: {},
					isPj: true,
					pjObj: {},
					dirTaskFileSX: [],
					dirTaskFileRW: [],
					// dirTaskFile: [], //反馈附件
				},
				//日常合成
				obj1: {
					show: false,
					title: '',
					id: '',
					taskObj: {}
				},
				obj2: {
					show: false,
					rowObj: {},
					title: '',
					id: ''
				},
				obj3: {
					show: false,
					title: '',
					id: '',
					taskObj: {}
				},
				directiveInfo: {}, //指令核查评价
				isZlpjmodel: false, //指令核查评价show
				rowObj: {}, //专案评价里面的东西
				show: false,
				addGroupModal: false,
				list: [],
				animate: false,
				srollHeight: null,
				timer: null,
				heightInner: 0,
				loading: true,
				columns: [{
						title: '编号',
						key: 'code',
						align: 'center'
					},
					{
						title: '请求类型',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							if(Number(params.row.ywlx) == api.ywlx.rc) {
								return h('div', '日常合成')
							} else if(Number(params.row.ywlx) == api.ywlx.za) {
								return h('div', '专案合成')
							} else if(Number(params.row.ywlx) == api.ywlx.zb) {
								return h('div', '专班合成')
							} else if(Number(params.row.ywlx) == api.ywlx.qx) {
								return h('div', '请求协查')
							} else if(Number(params.row.ywlx) == api.ywlx.zl) {
								return h('div', '指令核查')
							}
							//							else if(Number(params.row.ywlx) == api.ywlx.rc) {
							//								return h('div', '专班合成')
							//							}
						}
					},
					{
						title: '申请人',
						key: 'sqr',
						align: 'center'
					},
					{
						title: '案事件名称',
						key: 'asjmc',
						align: 'center'
					},
					{
						title: '申请时间',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							return h('div', timestampToTime(params.row.sqsj))
						}
					},

				],
				stateObj: {
					title: '状态',
					align: 'center',
					render: (h, params) => {
						// 0 日常   1专案    2指令    3专职专办     4请求协查

						if(Number(params.row.ywlx) == api.ywlx.rc) { //日常
							let typeList = [{ //参考专案查询的状态
								key: 'a',
								value: '审批中'
							}, {
								key: 1,
								value: '已审批'
							}, {
								key: 2,
								value: '研判中'
							}, {
								key: 4,
								value: '已研判'
							}, {
								key: 5,
								value: '已评价'
							}, {
								key: 6,
								value: '已完成'
							}, {
								key: 7,
								value: '审批不通过'
							}, {
								key: 0,
								value: '发起失败'
							}]
							let currentSt = typeList.filter(item => {
								return item.key == params.row.zt
							})
							return h('div', currentSt[0].value)
						}
						if(Number(params.row.ywlx) == api.ywlx.za) { //专案
							let typeList = [{ //参考专案查询的状态
								key: 'a',
								value: '审批中'
							}, {
								key: 1,
								value: '已审批'
							}, {
								key: 2,
								value: '研判中'
							}, {
								key: 4,
								value: '已研判'
							}, {
								key: 5,
								value: '已评价'
							}, {
								key: 6,
								value: '已完成'
							}, {
								key: 7,
								value: '审批不通过'
							}, {
								key: 0,
								value: '发起失败'
							}]
							let currentSt = typeList.filter(item => {
								return item.key == params.row.zt
							})
							return h('div', currentSt[0].value)
						}
						if(Number(params.row.ywlx) == api.ywlx.zl) { //指令
							let typeList = [{ //参考指令查询的状态
								key: '1',
								value: '待签收'
							}, {
								key: 2,
								value: '已签收'
							}, {
								key: 3,
								value: '已反馈'
							}, {
								key: 4,
								value: '已评价'
							}]
							console.log(params.row.data.zt)
							let currentSt = typeList.filter(item => {
								return item.key == params.row.data.zldwgls[0].zt
							})
							return h('div', currentSt[0].value)
						}
						if(Number(params.row.ywlx) == api.ywlx.zb) { //专职专办
							//专职专办状态是从系统管理配置的
							let currentSt = [];
							currentSt = this.typeList.filter(item => {
								return item.code == params.row.zt
							})
							return h('div', currentSt.length ? currentSt[0].title : '')
						}
						if(Number(params.row.ywlx) == api.ywlx.qx) { //请求协查
							let typeList = [{ //参考请求协查查询的状态
								key: 'a',
								value: '审批中'
							}, {
								key: 0,
								value: '发起失败'
							}, {
								key: 1,
								value: '已审批'
							}, {
								key: 2,
								value: '已签收'
							}, {
								key: 3,
								value: '已反馈'
							}, {
								key: 4,
								value: '已研判'
							}, {
								key: 5,
								value: '已完成'
							}, {
								key: 6,
								value: '出战果'
							}, {
								key: 7,
								value: '审批不通过'
							}, {
								key: 8,
								value: '退回'
							}]
							let currentSt = typeList.filter(item => {
								return item.key == params.row.zt
							})
							return h('div', currentSt[0].value)
						}

					}
				},
				operateObj: {
					title: '操作',
					key: 'zt',
					align: 'center',
					/*
					  关于代办事项表格操作按钮的渲染说明：

					  日常合成：待审批、待签收、研判中、待评价、待总结；（对应日常合成板块：/dailySet/）
					  专案合成：待审批、待签收、研判中、待评价、待总结；（对应专案合成板块：/specialSet/）
					  请求协查：待审批、待签收、待反馈、待评价；（对应请求协查板块：/provincial/）
					  指令核查：待签收、待反馈、待评价；（对应指令核查处理板块：/directiveDispose/）

					  比如：日常合成，后端返回zt字段，当zt返回0时，操作是“待审批”字样
					        点击“待审批”跳转到对应页面，审批完成后在跳转回来，zt字段往后挪一位变成1，操作字样变成“待签收”
					        此次类推，直到最后一步。
					        
					  特别说明：
					        1：点击各个按钮的后续操作有两种，一种是跳转到对应的路由页面
					        2：在当前页面弹窗完成
					*/
					/* 0  日常    zt 1  待签收     2研判中  4待评价  5待总结
					 * 1  专案     zt 1  待签收     2研判中  4待评价  5待总结
					 * 2  指令
					 * 3 专职专办
					 * 4 请求协查
					 */
					render: (h, params) => {
						//日常合成
						if(Number(params.row.ywlx) == api.ywlx.rc) {
							if(params.row.zt == 'a') {
								return h('a', {
									on: {
										click: () => {
											this.obj1.show = true
											this.obj1.taskObj = {
												taskId: params.row.data.taskId,
												busId: params.row.id
											}
											this.obj1.id = params.row.id
											this.obj1.title = '编号：' + params.row.data.sqwh
										}
									}
								}, '待审批')
							}
							if(Number(params.row.zt) == 1) {
								return h('a', {
									on: {
										click: () => {
											this.$router.push({
												path: '/deterStart',
												query: {
													id: params.row.data.id,
													code: params.row.data.sqwh,
													content: params.row.data.ajmc,
													zt: '待签收'
												}
											})
										}
									}
								}, '待签收')
							}
							if(Number(params.row.zt) == 2) {
								return h('a', {
									on: {
										click: () => {
											this.$router.push({
												path: `/deterStart?id=${params.row.id}&code=${params.row.wh}&content=3&zt=研判中`
											})
										}
									}
								}, '研判中')
							}
							if(Number(params.row.zt) == 4) {
								return h('a', {
									on: {
										click: () => {
											this.obj2.show = true
											this.obj2.title = '编号:' + params.row.id;
											this.obj2.rowObj = params.row
										}
									}
								}, '待评价')
							}
							if(Number(params.row.zt) == 5) {
								return h('a', {
									on: {
										click: () => {
											this.$router.push({
												path: `/ueditor?sqid=${params.row.id}&type=1`
											})
										}
									}
								}, '待总结')
							}
						}
						//专案发起
						if(Number(params.row.ywlx) == api.ywlx.za) {
							if(params.row.zt == 'a') {
								return h('a', {
									on: {
										click: () => {
											this.obj3.show = true
											this.obj3.title = '编号：' + params.row.data.sqwh;
											this.obj3.id = params.row.id;
											this.obj3.taskObj = {
												taskId: params.row.data.taskId,
												busId: params.row.data.id
											};
										}
									}
								}, '待审批')
							}
							if(params.row.zt == 'bl') {
								return h('a', {
									on: {
										click: () => {
											this.zaBcclobj.show = true;
											this.zaBcclobj.rowObj = params.row.data;
										}
									}
								}, '补充材料')
							}
							if(Number(params.row.zt) == 1) {
								return h('a', {
									on: {
										click: () => {
											this.$router.push({
												path: '/specialStart',
												query: {
													id: params.row.id,
													code: params.row.data.sqwh,
													content: params.row.data.ajmc,
													zt: '待签收',
													zaid: params.row.data.zaid
												}
											})
										}
									}
								}, '待签收')
							}
							if(Number(params.row.zt) == 2) {
								return h('a', {
									on: {
										click: () => {
											this.$router.push({
												path: '/specialStart',
												query: {
													id: params.row.id,
													code: params.row.data.sqwh,
													content: params.row.data.ajmc,
													zt: '研判中',
													zaid: params.row.data.zaid
												}
											})
										}
									}
								}, '研判中')
							}
							if(Number(params.row.zt) == 4) {
								return h('a', {
									on: {
										click: () => {
											this.zahcdpjobj.show = true;
											this.zahcdpjobj.rowObj = params.row.data
										}
									}

								}, '待评价')
							}
							if(Number(params.row.zt) == 5) {
								return h('a', {
									on: {
										click: () => {
											this.$router.push({
												path: '/ueditor',
												query: {
													sqid: params.row.id,
													type: 1
												}
											})
										}
									}
								}, '待总结')
							}
						}
						//请求协查
						if(Number(params.row.ywlx) == api.ywlx.qx) {
							if(params.row.zt == 'a') {
								return h('a', {
									on: {
										click: () => {
											let val = params.row;
											this.getRWFileSX(val.id);
											this.getRWFileRW(val.data.id);
											this.getSpyj(val.data.id);
											this.getJsInfo(val.data);

											this.qqxcobj.show = true
											this.qqxcobj.formValidate = {}
											console.log(val.data, "))))))")
											this.qqxcobj.zlObj = val.data;
											this.qqxcobj.formValidate.taskid = val.data.taskId;
											this.qqxcobj.formValidate.busid = val.id;

										}
									}
								}, '待审批')
							}
							if(Number(params.row.zt) == 1) {
								return h('a', {
									on: {
										click: () => {
											let val = params.row;
											this.qqxcdqsobj.zlObj = val.data;
											this.qqxcdqsobj.show = true;
											this.qqxcdqsobj.title = '编号：' + val.data.sqwh;
											this.qqxcdqsobj.flag = false;
										}
									}
								}, '待签收')
							}
							if(Number(params.row.zt) == 2) {
								return h('a', {
									on: {
										click: () => {
											let val = params.row
											this.qqxcdfkobj.show = true;
											api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {
												id: val.id
											}).then(res => {
												this.qqxcdfkobj.states = true;
												this.obj = res;
												this.qqxcdfkobj.xcObj = val.data;
												this.qqxcdfkobj.title = "反馈请求";
												console.log(res.sqxx.id, "HHHHH")
												this.getRWFile(res.sqxx.id);
												this.getSXFile(res.sqxx.id);

											})

										}
									}
								}, '待反馈')
							}
							if(Number(params.row.zt) == 3) {
								return h('a', {
									on: {
										click: () => {
											this.qqxcdpjobj.show = true;
											this.qqxcdpjobj.isPj = true;
											this.qqxcdpjobj.title = "反馈评价";
											this.qqxcdpjobj.xcObj = params.row.data;
											this.getFile(params.row.data.id);
											this.getRWFile(params.row.data.id);
											this.getSXFile(params.row.data.id);

										}
									}
								}, '待评价')
							}
						}
						//指令
						if(Number(params.row.ywlx) == api.ywlx.zl) {
							if(Number(params.row.zt) == 1) {
								return h('a', {
									on: {
										click: () => {
											this.zlhcdfkobj.isSignIn = true
											this.zlhcdfkobj.directiveInfo = JSON.parse(JSON.stringify(params.row.data));
										}
									}
								}, '待签收')
							}
							if(Number(params.row.zt) == 2) {
								return h('a', {
									on: {
										click: () => {
											this.zlhcdfkobj.isSignIn = true
											this.zlhcdfkobj.directiveInfo = JSON.parse(JSON.stringify(params.row.data));
										}
									}
								}, '待反馈')
							}
							if(Number(params.row.zt) == 3) {
								return h('a', {
									on: {
										click: () => {
											this.zlhcpjobj.show = true;
											this.zlhcpjobj.directiveInfo = JSON.parse(JSON.stringify(params.row.data));
										}
									}
								}, '待评价')
							}
						}
						//专职专办
						if(Number(params.row.ywlx) == api.ywlx.zb) {
							if(params.row.zt == 'a') {
								return h('a', {
									on: {
										click: () => {
											console.log(params.row.data, "xxxxx")
											this.zzzbdspobj.show = true
											this.zzzbdspobj.title = '编号：' + params.row.data.sqwh;
											this.zzzbdspobj.id = params.row.id;
											this.zzzbdspobj.task = {
												taskId: params.row.data.taskId,
												busId: params.row.id
											};
											this.zzzbdspobj.approveZt = params.row.zt;
										}
									}
								}, '待审批')
							}
							if(params.row.zt == 'bl') {
								return h('a', {
									on: {
										click: () => {
											this.zzzbBcclobj.show = true
											console.log(params.row.data, "OOPP")
											this.zzzbBcclobj.rowObj = params.row.data;
										}
									}
								}, '补充材料')
							}
							if(Number(params.row.zt) == 1) {
								return h('a', {
									on: {
										click: () => {
											this.$router.push({
												path: '/fullTimeDetermineStart',
												query: {
													id: params.row.id,
													code: params.row.data.sqwh,
													content: params.row.data.ajmc,
													zt: '待签收',
													zaid: params.row.data.zaid
												}
											})
										}
									}
								}, '待研判')
							}
							if(Number(params.row.zt) == 4) {
								return h('a', {
									on: {
										click: () => {
											this.zzzbdpjobj.show = true;
											this.zzzbdpjobj.title = '编号:' + params.row.id;
											this.zzzbdpjobj.rowObj = params.row.data;
										}
									}

								}, '待评价')
							}
						}
					}
				},
				data: [],
				dataCopy: [],
				pageArray: [10, 20, 30],
				basePage: {
					pageNumber: 1,
					pageSize: 10,
					current: 1
				},
				total: 0,
				leaderDetail: {},
				classOption: {
					step: 0.5,
					limitMoveNum: 5
				},
				selectShow: false,
				isZz: false //判断是否是组长
			};
		},
		created() {
			this.fackerList();
			this.initInfo();
			this.getLeader2();
			this.renderChart()
		},
		methods: {
			renderChart() {
				api.api('get', api.configUrl + '/hczz/tj/getTotalDataOnYwlx').then(res => {
					// this.totleNumber = res.bqzs.objTotal;
					// this.tagTotal = res.bqzs.tagTotal;
					// this.objectData = res.bqzs.objList;
					// this.rmbqData = res.rmbq;
					this.echarttop = res;

				});
			},
			//
			readerFile(file) {
				return new Promise(reslove => {
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function() {
						reslove(this.result);
					};
				});
			},
			getZbZt() {
				api.api('post', api.systemUrl + '/dict/findDictTreeByType', {
					dictTypeCode: 'HCZHBZT'
				}).then(res => {
					this.typeList = res;
				});
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
			handleProcedFile(e) {
				this.qqxcdfkobj.resetObj.procedFileArr.push(this.handleFileDate(e, "3"));
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
			getRWFileSX(id) {
				api.api('post', api.configUrl + '/hczz/fj/getFjData', {
					glid: id,
					tablename: 'T_HCZZ_SQXX',
					type: '1'
				}).then(res => {
					this.dirTaskFileSX = res;
					console.log(this.dirTaskFileSX,'tttttttttttt')
				})
			},
			getRWFileRW(id) {
				api.api('post', api.configUrl + '/hczz/fj/getFjData', {
					glid: id,
					tablename: 'T_HCZZ_SQXX',
					type: '2'
				}).then(res => {
					this.dirTaskFileRW = res;

				})
			},
			getJsInfo(val) { //获取是否该角色
				api.api("get", api.systemUrl + '/role/getRolesByAccountId?accountId=' + val.id, {}).then(res => {
					this.iszxqsry = false;
					this.isneedparent = false;
					$.each(res, (index, item) => {
						if(item.roleName == "中心签收员") {
							this.iszxqsry = true;
						} else if(item.roleName == "请求上级领导") {
							this.qqxcobj.isneedparent = true;
						}
					})
				})
			},
			getSpyj(id) {
				api.api('post', api.configUrl + '/hczz/za/getSpRemarkList', {
					id: id
				}).then(res => {
					this.spyjObj = res;
					$.each(this.spyjObj, (index, val) => {
						val.src = '';
						api.api('get', api.systemUrl + '/account/info/detail?id=' + val.zxrid).then(res => {
							this.spyjObj[index].src = "http://10.166.116.17/yth/picture/" + res.idCard + ".jpg";
							$('.lcInfo-t img').eq(index).attr('src', "http://10.166.116.17/yth/picture/" + res.idCard + ".jpg")
						})
					})
				})
			},
			handlePrevv(val) {
				api.upload(val);
			},
			//专职专办待评价
			zzzbdpj(value) {
				this.zzzbdpjobj.show = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			//专职专办待审批
			zzzbdspobja(value) {
				this.zzzbdspobj.show = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			//专职专办补充材料
			zzzbBccl() {
				this.zzzbBcclobj.show = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			//请求协查待评价
			qqxcdpjsaveInfo() {
				let pjxx = {
					sqid: this.qqxcdpjobj.xcObj.id,
					fwtd: this.qqxcdpjobj.formValidate.fwtd,
					fksu: this.qqxcdpjobj.formValidate.fksu,
					yyxg: this.qqxcdpjobj.formValidate.yyxg,
					sfpa: this.qqxcdpjobj.formValidate.sfpa,
					sffhzy: this.qqxcdpjobj.formValidate.sffhzy,
					zhrs: this.qqxcdpjobj.formValidate.zhrs,
					zhpjnr: this.qqxcdpjobj.formValidate.zhpjnr
				}
				api.api('post', api.configUrl + '/hczz/hc/pj/addPj', pjxx).then(res => {
					this.$message.success("评价成功");
					this.qqxcdpjcloseModel();
				})
			},
			qqxcdpjcloseModel() {
				this.qqxcdpjobj.show = false;
				this.qqxcdpjobj.formValidate.fwtd = null;
				this.qqxcdpjobj.formValidate.fksu = null;
				this.qqxcdpjobj.formValidate.yyxg = null;
				this.qqxcdpjobj.formValidate.zhpjnr = null;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			qqxcdfkcloseModel(ruleForm, proceUpload) {
				this.qqxcdfkobj.show = false
				this.qqxcdfkobj.formValidate.fknr = null;
				this.qqxcdfkobj.resetObj.procedFileArr = [];

				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			//请求协查待反馈反馈按钮
			qqxcdfksaveInfo() {
				let refk = {
					id: this.qqxcdfkobj.xcObj.id,
					fknr: this.qqxcdfkobj.formValidate.fknr
				}
				let objs = {
					sqxx: refk,
					attach: this.qqxcdfkobj.resetObj.procedFileArr
				}
				api.api('post', api.configUrl + '/hczz/qqxc/sqxxFk', objs).then(res => {
					this.$message.success("恭喜你反馈成功");
					this.qqxcdfkcloseModel();
				})
			},
			//请求协查待签收
			//签收保存
			qqxcdqssaveInfo() {
				let params = {};
				params.id = this.qqxcdqsobj.zlObj.id;
				api.api('post', api.configUrl + '/hczz/qqxc/sqxxQs', {
					id: this.qqxcdqsobj.zlObj.id
				}).then(res => {
					this.$message.success('签收成功')
					this.qqxcdqscloseModel();
				})
			},
			qqxcdqscloseModel() {
				this.qqxcdqsobj.show = false;
				this.qqxcdqsobj.formValidate = {
					sqlx: '1',
					sabjbh: null,
					ajmc: null,
					jyrwnr: null,
					bz: null,
					jqajlx: null,
					parentid: null
				}
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},

			//请求协查待审批
			qqxcspcloseModel() {
				this.qqxcobj.show = false
			},
			qqxcspsaveInfo(element) {
				element.validate(valid => {
					if(valid) {
						api.api('post', api.configUrl + '/hczz/gzl/doApprove', this.qqxcobj.formValidate).then(res => {
							this.$message.success("恭喜你审批成功！");
							this.qqxcobj.show = false;
							this.loading = true
							this.getLeader(this.basePage.pageNum)
						})
					}
				});
			},
			zlhcpjupdate() {},
			zaspupdate(value) {
				this.obj3.show = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},

			update1() {
				this.obj1.show = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			//合成待评价
			updatehcpj(value) {
				this.obj2.show = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			//专案待评价
			updateazpj(value) {
				this.zahcdpjobj.show = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			//专案补充材料
			updateZaBccl() {
				this.zaBcclobj.show = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			handleRole() {
				this.addGroupModal = true;
			},
			initInfo() {},
			fackerList() {
				for(let i = 0; i < 50; i++) {
					this.list.push(Mock.mock({
						text: "@cparagraph(2)"
					}));
				}
			},
			setLeader() {
				this.selectShow = true;
			},
			update() {
				this.selectShow = false;
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			refreshPage() {
				this.loading = true
				this.getLeader(this.basePage.pageNum)
			},
			pageChange(current) {
				this.basePage.pageNum = current;
				this.dataCopy = this.data.slice((current - 1) * 10, (current - 1) * 10 + 10);
			},
			pageSizeChange() {},
			getLeader2() {
				let pforzazxx = {
					zaid: '',
					sqlx: '0'
				}
				api.api('post', api.configUrl + '/hczz/zaz/getZazZzDetail', pforzazxx).then(res => {
					if(res != null) {
						this.leaderDetail = res;
						if(res.userid == window.localStorage.getItem('userId')) {
							this.isZz = true;
						} else {
							this.isZz = false;
						}
					} else {
						this.leaderDetail = {
							xm: '',
							officename: ''
						};
					}
				})
			},
			// 初始化数据（index 代表请求第几页数据）
			getLeader(index) {
				this.loading = true;
				api.api('get', api.configUrl + '/hczz/common/getDbsxList').then(res => {
					this.loading = false;
					this.basePage.current = index;
					this.data = res;
					if(res != null) {
						this.data = res;
						this.total = res.length;
						this.dataCopy = this.data.slice((index - 1) * 10, (index - 1) * 10 + 10);
					} else {
						this.leaderDetail = {
							xm: '',
							officename: ''
						};
					}

				}).catch((error) => {
					this.loading = false
				})
			},
			gjsx(index) { //跟进事项
				this.loading = true;
				api.api('get', api.configUrl + '/hczz/common/getGjsxList').then(res => {
					this.loading = false;
					this.basePage.current = index;
					this.data = res;
					if(res != null) {
						this.data = res;
						this.total = res.length;
						this.dataCopy = this.data.slice((index - 1) * 10, (index - 1) * 10 + 10);
					} else {
						this.leaderDetail = {
							xm: '',
							officename: ''
						};
					}
				})
			}
		},
		mounted() {
			this.$nextTick(() => {
				// 280 的由来是除去 id="workbench-info" 和 需要计算高度的 table 以外
				// 其他元素的所占高度的总和（头部，底部，面包屑等固定值）
				let heightInner = $('#workbench-info').outerHeight(true) + 280
				this.getLeader(1);
				this.getZbZt();
				this.height = $(window).height() - heightInner;
				this.radio = '1';
			})
		}
	}
</script>

<style lang="less">
	.ivu-table:after,
	.ivu-table:before {
		content: "";
		position: absolute;
		background-color: none;
	}
	
	.workbench-page {
		width: 100%;
		height: 100%;
		.el-card__header {
			background-color: #fafafa;
			padding: 14px 16px;
		}
		.work-todo-table {
			height: calc(~"100% - 320px");
			.work-todo-table-card {
				height: 100%;
				position: relative;
				.el-card__body {
					.radio {
						position: absolute;
						right: 18px;
						top: 18px;
					}
					height: calc(~"100% - 50px");
					padding: 0;
					.ivu-table-wrapper {
						border: 0px;
						height: calc(~"100% - 70px");
					}
				}
			}
		}
		.workbench-info {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;
			height: calc(~"26% - 10px");
			.work-role-card {
				width: calc(~"100% - 5px");
				position: relative;
				.el-card__body {
					display: flex;
					justify-content: center;
					// height: calc(~'66% - 50px');
					height: auto;
					box-sizing: border-box;
					.user-panel {
						display: flex;
						align-items: center;
						dt {
							svg {
								font-size: 100px;
								color: #3b7abe;
							}
						}
					}
				}
			}
			.work-info-card {
				width: calc(~"100% - 5px");
				height: 100%;
				.el-card__body {
					height: 100%;
					.interest-panel-ct {
						overflow: hidden;
						height: calc(~"100% - 60px");
						transition: all 0.5s;
						position: relative;
						.interest-panel {
							position: absolute;
							left: 0;
							top: 0;
						}
						// .interest-panel.anim {
						//   transition: all 1s;
						// }
					}
				}
			}
		}
	}
	
	.ivu-table-overflowX {
		overflow-x: hidden;
	}
</style>