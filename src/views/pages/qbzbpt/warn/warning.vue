<template>
    <div id="khgl">
        <div class="mainCard">
            <div class="title-box">
                <span style="margin-left:10px">考核统计时间：</span>
				<DatePicker :value="sj" type="datetimerange" placement="top-start" placeholder="请选择时间" style="width: 325px"></DatePicker>
				<Button type="primary" style="margin-left:10px;background:#007BBA;vertical-align: middle;" @click="initPage">查询</Button>
            </div>
            <div class="addRemove">
                <img @click="addFen" src="@/images/zbImg/add.png" alt="">
                <img @click="removeFen" src="@/images/zbImg/unadd.png" alt="">
            </div>
            <div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<ModalWarn  ref="warnModal" ></ModalWarn>
			<ModalWarnReduce ref="warnModalReduce"></ModalWarnReduce>
        </div>
    </div>
</template>

<script>
	import api from '@/fetch/api';
	import ModalWarn from './warningStart';
	import ModalWarnReduce from './warningEnd';
	import $ from 'jquery';
	//import {timestampToTime} from '@/libs/common/common';
	export default{
		components:{
			ModalWarn,
			ModalWarnReduce
		},
		data(){
			return {
                sj:'',
                loading:false,
                columns: [{
						title: '合成作战成员单位',
						align: 'center',
						key: 'dw',
						ellipsis: true,
						minWidth: 140,
						render: (h, params) => {
							return h("div", [
								h(
									"span", {
										style: {
											fontSize:'14px',
											display: "inline-block",
											width: "100%",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
											verticalAlign: "bottom"
										},
										domProps: {
											title: params.row.dw
										}
									},
									params.row.dw
								)
							]);
						}
					},
					{
						title: '考核评分',
						align: 'center',
						key: 'khpf',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '日研判',
						align: 'center',
						key: 'ryp',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '周会商',
						align: 'center',
						key: 'zhs',
						ellipsis: true,
						minWidth: 100,
					},
					{
						title: '月调度',
						align: 'center',
						key: 'ydd',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '战合成',
						align: 'center',
						key: 'zhc',
						ellipsis: true,
						minWidth: 100,
						
					},
					{
						title: '奖励',
						align: 'center',
						key: 'jl',
						ellipsis: true,
						minWidth: 100,
					},
					{
						title: '操作',
//						key: 'operate',
						align: 'center',
						width: 200,
						render: (h, params) => {
				            return h("div", [
				              h(
				                "a",
				                {
				                  style: {
									marginRight: "8px",
									color: "#57a3f3",
								},
				                  on: {
				                    click: () => {
				                      this.$router.push('/qbzbpt/warnDetailsManager');
				                      // this.$router.push({
															// 			path:'/qbzbpt/warnDetails',
															// 			query:{
															// 				id:1
															// 			}
															// })
				                    }
				                  }
				                },
				                "详情"
				              ),
				              h(
				                "a",
				                {
				                  style: {
									marginRight: "8px",
									color: "#57a3f3",
								},
				                  on: {
				                    click: () => {
				                      //   this.remove(params.index);
				                    }
				                  }
				                },
				                "查看"
				              ),
				              h(
				                "a",
				                {
				                  style: {
									marginRight: "8px",
									color: "#57a3f3",
								},
				                  on: {
				                    click: () => {
				                      
				                    }
				                  }
				                },
				                "导出"
				              )
				            ]);
				         }
					}
				],
				height: 0,
				columnsData: [],
				basePage: {
					current: 1,
					pageindex: 1,
					pagesize: 10,
//					jjdbh: '',
//					bjnr: '',
//					starttime:'',
//					endtime:'',
//					time:''
				},
				total: 0,
				pageArray: [10, 20, 30],
			}
		},
		mounted() {
			this.queryPage();
			this.$nextTick(() => {
				this.changeData();
				this.height = $(window).height() - 380;
			})
		},
		methods:{
			queryPage(){
				let _this = this;
			      _this.loading = true;
			      _this.columnsData = [
			        {
			          dw: "临河临河",
			          khpf: "99",
			          ryp: "99",
			          zhs: "99",
			          ydd:"99",
			          zhc: "99",
			          jl: "99",
			         
			        },
			        {
			          dw: "临河临河",
			          khpf: "99",
			          ryp: "99",
			          zhs: "99",
			          ydd:"99",
			          zhc: "99",
			          jl: "99",
			         
			        },{
			          dw: "临河临河",
			          khpf: "99",
			          ryp: "99",
			          zhs: "99",
			          ydd:"99",
			          zhc: "99",
			          jl: "99",
			         
			        },{
			          dw: "临河临河",
			          khpf: "99",
			          ryp: "99",
			          zhs: "99",
			          ydd:"99",
			          zhc: "99",
			          jl: "99",
			         
			        },{
			          dw: "临河临河",
			          khpf: "99",
			          ryp: "99",
			          zhs: "99",
			          ydd:"99",
			          zhc: "99",
			          jl: "99",
			         
			        }
			      ];
			      _this.loading = false;
			},
            initPage(){

            },
            addFen(){
            	console.log(11)
            	this.$refs.warnModal.show=true;
//          	this.$refs.warnModal.resets();
            },
            removeFen(){
              	this.$refs.warnModalReduce.show=true;
//          	this.$refs.warnModal.resets();
            },
            pageChange(current) {
                this.basePage.current=current;
               
			},
			pageSizeChange(current) {
                this.basePage.pagesize=current;
			},
			
		}
	}
</script>

<style  lang="less" >
    #khgl{
        .mainCard{
            overflow-y:auto;
            border:1px solid #E2E2E2;
            border-radius:5px;
            background:#FFFFFF;
            .title-box{
                height: 68px;
                line-height: 68px;
                border-bottom: 1px solid #d9d9d9;
                text-align: left;
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
            /*.ivu-table td{
            	font-size: 14px;
            }*/
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

</style>