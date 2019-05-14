<template>
	<el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none;padding-bottom:10px;background:#fff;">
			<Form ref="formDynamic" inline class="search-ct">
				<FormItem label="涉案编号：" :label-width="84">
					<Input type="text"  clearable v-model.trim="basePage.ajbh" placeholder="请输入涉案编号"></Input>
				</FormItem>
				<FormItem label="案件名称：" :label-width="84">
					<Input type="text"  clearable v-model.trim="basePage.ajmc" placeholder="请输入案件名称"></Input>
				</FormItem>
				<FormItem label="简要案情：" :label-width="84">
					<Input type="text"  clearable v-model.trim="basePage.jyaq" placeholder="请输入简要案情"></Input>
				</FormItem>
				<FormItem label="受理时间：" :label-width="84">
					<el-date-picker v-model="basePage.time" @change="handleDate" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
					</el-date-picker>
					<!-- <el-date-picker type="daterange" :default-value="new Date(new Date()-30*24*3600000)" :picker-options="pickerOptions2" v-model="basePage.time" start-placeholder="开始日期" end-placeholder="结束日期"  @change="handleDate"></el-date-picker> -->
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
				<!--<Button @click="hhh" id="contents">导出</Button>-->
			</Form>
			<div class="table-ct" :style="{height:height}">
				<Table style="height:100%"
					   v-loading="loading"
					   element-loading-text="正在加载中，请稍后"
					   element-loading-spinner="el-icon-loading"
					   stripe :columns="columns" :data="columnsData" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<!-- <div class="fyDiv magin-top-20">
				<Button type="primary" class="magin-top-20" @click="prePage" :disabled="preDisabled">上一页</Button>
				<Button type="primary" class="magin-top-20" @click="nextPage">下一页</Button>
				下行需要注释
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div> -->
	</el-card>
</template>

<script>
	import $ from 'jquery';
	import api from '@/fetch/api';
	import { timestampToTime } from '@/libs/common/common';
	import html2canvas from 'html2canvas';
	import jsPDF from 'jspdf'
	export default {
		data() {
			return {
				columns: [{
						title: '涉案编号',
						align: 'center',
						key: 'ajbh',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '案件名称',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '受理时间',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('p',timestampToTime(params.row.slsj))
						}
					},
					{
						title: '简要案情',
						align: 'center',
						key: 'jyaq',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '案件类型',
						align: 'center',
						key:'ajlbMc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '操作',
						key: 'operate',
						align: 'center',
						width: 150,
						render: (h, params) => {
							return h('div', [
								h('a', {
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
                                            let tHczzSqxx={
                                                sabjbh: params.row.ajbh,
                                                ywlx:api.ywlx.zb
                                            }
                                            api.api('post',api.configUrl+'/hczz/hc/isHandling',tHczzSqxx).then(res=>{
                                                if(!res){
                                                    this.obj=params.row;
                                                    this.$router.push({
                                                        path: '/fullTimeStart',
                                                        query:{
                                                            obj:params.row,
                                                            rwly:2,
                                                            active:'caseList'
                                                        }
                                                    })
                                                }else{
                                                    this.$message.error('该案件已发起过，请不要重复发起')
                                                }
                                            })
										}
									}
								}, '发起55')
							])

						}
					}
				],
				columnsData: [],
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10,
					ajmc: '',
					sqrxm: '',
					starttime: '',
					endtime: '',
					zt: '',
					time:''
				},
				preDisabled:true,
				loading:false,
				total: 0,
				height: 0,
				typeList: [{
					key: 0,
					value: '未审核'
				}, {
					key: 1,
					value: '已审核'
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
					value: '已评价'
				}, {
					key: 6,
					value: '出战果'
				}, {
					key: 'a',
					value: '审批中'
				}],
				list: [],
				pickerOptions2: {
					shortcuts: [{
						text: '最近三天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近十天',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 10);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}]
				}
			}
		},
		mounted() {
			this.height = $(window).height() - $('.search-ct').height() - 312 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - $('.search-ct').height() - 312 + 'px';
			}
			this.render();
			this.changeData();
			//获取table的height
		},
		methods: {
			timeChange(){
				if(val){
					this.basePage.starttime=new Date(val[0]).getTime();
					this.basePage.endtime=new Date(val[1]).getTime()+24*3600000;
				}else{
					this.basePage.starttime='';
					this.basePage.endtime='';
				}
			},
			//生成pdf方法
			hhh() {
				var target = document.getElementsByClassName("wholeContent")[0];
				target.style.background = "#f0f0f0";

				html2canvas(target, {
					onrendered:function(canvas) {
						var contentWidth = canvas.width;
						var contentHeight = canvas.height;

						//一页pdf显示html页面生成的canvas高度;
						var pageHeight = contentWidth / 592.28 * 841.89;
						//未生成pdf的html页面高度
						var leftHeight = contentHeight;
						//页面偏移
						var position = 0;
						//a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
						var imgWidth = 595.28;
						var imgHeight = 592.28/contentWidth * contentHeight;

						var pageData = canvas.toDataURL('image/jpeg', 1.0);

						var pdf = new jsPDF('', 'pt', 'a4');

						//有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
						//当内容未超过pdf一页显示的范围，无需分页
						if (leftHeight < pageHeight) {
						pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
						} else {
							while(leftHeight > 0) {
								pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
								leftHeight -= pageHeight;
								position -= 841.89;
								//避免添加空白页
								if(leftHeight > 0) {
								pdf.addPage();
								}
							}
						}

						pdf.save("content.pdf");
					}
				})

			},
			render() {
				this.loading=true;
				this.columnsData=[];
				api.api('post',api.configUrl+'/hczz/ajjbxx/queryAjjbxxList',this.basePage).then(res=>{
               	if(res.list){
               		this.columnsData=res.list;
               	}
               	 this.total=res.total;
               	 this.loading=false;
                })
			},
			handleDate(val) {
				if(val){
					this.basePage.starttime=new Date(val[0]).getTime();
					this.basePage.endtime=new Date(val[1]).getTime()+24*3600000;
				}else{
					this.basePage.starttime='';
					this.basePage.endtime='';
				}
			},
			search() {
				this.basePage.current = 1;
				this.basePage.pageindex = 1;
				this.render();
			},
			pageChange(current) {
				this.basePage.current = current;
				this.basePage.pageindex = current;
				this.render();
			},
			pageSizeChange(current) {
				this.basePage.pagesize = current;
				this.render();
			},
			nextPage(){
				this.preDisabled=false;
				this.basePage.pageindex++;
				this.render();
			},
			prePage(){
				if(this.basePage.pageindex==2){
					this.preDisabled=true;
				}
				this.basePage.pageindex--;
				this.render();
			}
		}
	}
</script>
<style lang="less">
	
	.dailyCooperate {
		.ivu-form-item-content {
			width: auto;
		}
		.el-date-editor {
			height: 34px !important;
		}
		.el-date-editor .el-range__icon {
			line-height: 28px;
		}
		.el-date-editor .el-range-separator {
			line-height: 28px;
		}
		.wholeContent {
			padding-top: 20px;
		}
		.fyDiv{
			margin-top: 20px;
		}
		.fyDiv .nextSpan{
			padding: 5px 20px;
		    display: inline-block;
		    border: 1px solid;
		    border-radius: 5px;
		}
	}
</style>