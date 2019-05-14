<template>
	<div id="ypbg">
        <div class="mainCard">
            <div class="title-box">
                <span style="margin-left:10px">研判报告名称：</span>
				<Input type="text" clearable v-model.trim="basePage.ypbgmc" placeholder="请输入名称" style="width:150px;"></Input>
				<span style="margin-left:10px">研判报告生成时间：</span>
				<DatePicker type="datetime" v-model="basePage.time1" placeholder="请选择时间" style="width:160px"></DatePicker>
				<span style="margin-left:10px">研判报告生成时间：</span>
				<el-date-picker  style="width: 360px;" v-model="basePage.time" @change="timeChange" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
					</el-date-picker>
				<Button style="margin-left:10px;vertical-align: middle;background:#007BBA;" type="primary" @click="initPage">查询</Button>
				<!--<Button style="margin-left:10px;background:#007BBA;vertical-align: middle;" type="primary" @click="initPage">查询</Button>-->
            </div>
            <div class="addRemove">
            	<Button type="primary" style="background:#007BBA;" shape="circle" @click="addYpbg">生成研判报告</Button>
                <!--<img @click="addYpbg" src="@/images/zbImg/ypbg1.png" alt="">-->
            </div>
            <div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage"
					 :current="basePage.current" 
					 :total="total" 
					 show-sizer 
					 placement="top" 
					 @on-change="pageChange" 
					 @on-page-size-change="pageSizeChange" 
					 :page-size="basePage.pageSize" 
					 :page-size-opts="pageArray" 
					 show-elevator 
					 show-total></Page>
			</div>
			<caseStart ref="caseStart"  ></caseStart>
        </div>
    </div>
</template>

<script>
	import api from '@/fetch/api';
	import caseStart from './caseStart';
	import $ from 'jquery';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		components:{
			caseStart
		},
		data() {
			return {
				columns: [{
						title: '标题',
						align: 'left',
						key: 'bt',
						ellipsis: true,
						minWidth: 100,
						render:(h,params) =>{
							let texts = '';//表格列显示文字
					        if (params.row.bt !== null) {
					              if (params.row.bt.length > 18) {//进行截取列显示字数
					                  texts = params.row.bt.substring(0, 18) + "...";
					               } else {
					                   texts = params.row.bt;
					               }
					        }
							return h('Tooltip',{
	                                props: { placement: 'top' }
	                           	},
                           		[
	                                texts,//表格文本
	                                h('span', { slot: 'content', 
	                                style: {  whiteSpace: 'normal', 
	                                		  wordBreak: 'break-all',
	                                		  color:'#ffffff'
										}
	                                },params.row.bt
	                               )
	                            ]
							)
						}
					},
					{
						title: '研判报告生成时间',
						align: 'left',
						key: 'scsj1',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '研判报告生成时间',
						align: 'left',
						key: 'scsj2',
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
								}, '查看 ')
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
					ajbh: '',
					ajmc: '',
					jyaq: '',
					starttime:'',
					endtime:'',
					
					time:'',
					time1:'',
					ypbgmc:''
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
				this.height = $(window).height() - 380;
			})
		},
		methods: {
			queryPage(){
				let _this = this;
			      _this.loading = true;
			      _this.columnsData = [
			        {
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河临河v",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "临河临河临河临河临河临河临河临河临河临河",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "临河临河1临河临河1临河临河1临河临河1",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },{
			          bt: "11",
			          scsj1: "2018-11-17 00:00:00—2018-11-17 00:00:00",
			          scsj2: "2018-11-17 00:00:00"
			        },
			      ];
			      _this.total = _this.columnsData.length;
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
                this.queryPage();
                //this.render();
			},
			pageSizeChange(current) {
                this.basePage.pagesize=current;
                this.queryPage();
                //this.render();
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
			addYpbg(){
				this.$refs.caseStart.show=true;
			}
		}
	}
</script>
<style lang="less" >
	#ypbg{
        .mainCard{
            border:1px solid #E2E2E2;
            border-radius:5px;
            background:#FFFFFF;
            .title-box{
                height: 68px;
                line-height: 68px;
                border-bottom: 1px solid #d9d9d9;
                text-align: left;
                font-size: 12px;
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