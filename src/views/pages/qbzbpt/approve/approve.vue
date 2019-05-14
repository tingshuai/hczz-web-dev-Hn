<template>
	<div id="cjym">
        <div class="mainCard">
            <div class="title-box">
                <span class="labs" >标题：</span>
				<Input type="text" clearable v-model.trim="basePage.bt" placeholder="请输入名称" style="width:calc((100% - 380px)/4)"></Input>
				<span class="labs" >信息正文：</span>
				<Input type="text" clearable v-model.trim="basePage.xxzw" placeholder="请输入名称" style="width:calc((100% - 380px)/4);"></Input>
				<span class="labs" >紧急程度：</span>
				<Select v-model="basePage.jjcd" placeholder="请选择程度" style="width:calc((100% - 380px)/4)">
					<Option value="1">高</Option>
					<Option value="2">中</Option>
					<Option value="3">低</Option>
				</Select>
				<span class="labs" >关键词：</span>
				<Input type="text" clearable v-model.trim="basePage.gjc" placeholder="请输入名称" style="width:calc((100% - 380px)/4);"></Input>
				<span class="labs" >采集时间：</span>
				<DatePicker type="datetime" placeholder="请选择时间" style="width:calc((100% - 380px)/4)"></DatePicker>
				<span class="labs" >采集单位：</span>
				<Select v-model="basePage.cjdw" placeholder="请选择采集单位" style="width:calc((100% - 380px)/4)">
					<Option value="1">高</Option>
					<Option value="2">中</Option>
					<Option value="3">低</Option>
				</Select>
				<Button style="margin-left:10px;background:#007BBA;vertical-align: middle;" type="primary" @click="initPage">查询</Button>
            </div>
            <div class="addRemove">
                <img @click="dataCj" src="@/images/zbImg/cj.png" alt="">
                <img @clcik="dataDc" src="@/images/zbImg/dc.png" alt="">
            </div>
            <div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<!--<caseStart  ref="caseStart" ></caseStart>-->
        </div>
    </div>
	
</template>

<script>
	import api from '@/fetch/api';
//	import caseStart from './modal';
	import $ from 'jquery';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		components:{
//			caseStart
		},
		data() {
			return {
				columns: [{
						title: '标题',
						align: 'left',
						key: 'bt',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '信息正文',
						align: 'left',
						key: 'xxzw',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '紧急程度',
						align: 'left',
						key: 'jjcd',
						ellipsis: true,
						minWidth: 100,
						render: (h, params) => {
							return h("div", [
								h(
									"span", {
										style: {
											color:(params.row.jjcd == '重要')?'#FF7500':'',
											display: "inline-block",
											width: "100%"
										},
										domProps: {
											title: params.row.jjcd
										}
									},
									params.row.jjcd
								)
							]);
						}
					},{
						title: '采集时间',
						align: 'left',
						key: 'cjsj',
						ellipsis: true,
						minWidth: 100,
					},
					{
						title: '采集单位',
						align: 'left',
						key: 'cjdw',
						ellipsis: true,
						minWidth: 100,
					},
					{
						title: '状态',
						align: 'left',
						key: 'zt',
						ellipsis: true,
						minWidth: 100,
						
					},
					{
						title: '操作',
						key: 'operate',
						align: 'center',
						width: 100,
						render: (h, params) => {
							return h('div', [
								h('a', {
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											
										}
									}
								}, '详情')
							])
						}
					}
				],
				columnsData: [],
				obj:{},
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10,
					bt: '',
					xxzw: '',
					jjcd: '',
					gjc:'',
					cjsj:'',
					cjdw:'',
					time:''
				},
				total: 0,
				loading: false,
				height: 0,
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
				},
				ajbh:'',//涉案编号
			}
		},
		mounted() {
			this.queryPage();
			this.$nextTick(() => {
				this.changeData();
				this.render();
				this.height = $(window).height() - 385;
			})
		},
		methods: {
			queryPage(){
				let _this = this;
			      _this.loading = true;
			      _this.columnsData = [
			        {
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          xxzw: "银行系统切入信息银行系统切入信息银行系统切入信息",
			          jjcd: "重要",
			          cjsj: "2018-11-17 00:00:00",
			          cjdw: "网安",
			          zt: "已提交"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          xxzw: "银行系统切入信息银行系统切入信息银行系统切入信息",
			          jjcd: "一般",
			          cjsj: "2018-11-17 00:00:00",
			          cjdw: "网安",
			          zt: "已提交"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          xxzw: "银行系统切入信息银行系统切入信息银行系统切入信息",
			          jjcd: "一般",
			          cjsj: "2018-11-17 00:00:00",
			          cjdw: "网安",
			          zt: "已提交"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          xxzw: "银行系统切入信息银行系统切入信息银行系统切入信息",
			          jjcd: "一般",
			          cjsj: "2018-11-17 00:00:00",
			          cjdw: "网安",
			          zt: "已提交"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          xxzw: "银行系统切入信息银行系统切入信息银行系统切入信息",
			          jjcd: "一般",
			          cjsj: "2018-11-17 00:00:00",
			          cjdw: "网安",
			          zt: "已提交"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          xxzw: "银行系统切入信息银行系统切入信息银行系统切入信息",
			          jjcd: "一般",
			          cjsj: "2018-11-17 00:00:00",
			          cjdw: "网安",
			          zt: "已提交"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          xxzw: "银行系统切入信息银行系统切入信息银行系统切入信息",
			          jjcd: "一般",
			          cjsj: "2018-11-17 00:00:00",
			          cjdw: "网安",
			          zt: "已提交"
			        },
			      ];
			      _this.loading = false;
			},
			initPage(){

            },
			render() {
				
			},
			search() {
				this.basePage.pageindex=1;
				this.basePage.current=1;
                this.render();
			},
			pageChange(current) {
                this.basePage.current=current;
                this.basePage.pageindex=current;
                this.render();
			},
			pageSizeChange(current) {
                this.basePage.pagesize=current;
                this.render();
			},
			update(value){
				this.$refs.caseStart.show=false;
				if(value){
					this.render();
				}
			},
			timeChange(val){
				if(val){
					this.basePage.starttime=new Date(val[0]).getTime();
					this.basePage.endtime=new Date(val[1]).getTime()+24*3600000;
				}else{
					this.basePage.starttime='';
					this.basePage.endtime='';
				}
			},
			dataCj(){
				
			},
			dataDc(){
				
			}
		}
	}
</script>
<style lang="less">
	#cjym{
        .mainCard{
            border:1px solid #E2E2E2;
            border-radius:5px;
            background:#FFFFFF;
            .title-box{
                height: 96px;
                line-height: 48px;
                border-bottom: 1px solid #d9d9d9;
                text-align: left;
                font-size: 12px;
                .labs{
                	display:inline-block;
                	width: 80px;
                	text-align: right;
                }
            }
            .addRemove{
                height: 68px;
                line-height: 68px;
                text-align: right;
                margin-right: 10px;
                img{
                    cursor: pointer;
                }
            }
            .ivu-table-overflowY{
            	overflow-y: hidden;
            }
            .ivu-table-overflowX{
            	overflow-x: hidden;
            }
           
           	.ivu-table {
           		font-size: 14px !important;
           	}
            .ivu-table-cell span{
            	font-size: 14px;
            	font-family: "microsoft yahei";
            	color:#333333;
            }
            
        }
    }
    .ivu-table {
   		font-size: 14px !important;
   	}
    .ivu-table-cell span{
    	font-size: 14px;
    	font-family: "microsoft yahei";
    	color:#333333;
    }
  	.el-date-editor{
  		height: 34px !important;
  	}
  	.el-date-editor .el-range__icon{
  		line-height: 28px;
  	}
  	.el-date-editor .el-range-separator{
  		line-height: 28px;
  	}
  	.el-range-editor.el-input__inner{
  		padding: 3px 0 3px 5px;
  	}
</style>