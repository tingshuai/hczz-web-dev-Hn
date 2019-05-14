<template>
    <div id="khgl-detail">
        <div class="mainCard">
            <div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			
        </div>
    </div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	import {timestampToTime} from '@/libs/common/common';
	export default{
		components:{
			
		},
		data(){
			return {
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
						title: '考核内容明细',
						align: 'center',
						key: 'khnrmx',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '分值',
						align: 'center',
						key: 'fz',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '录入时间',
						align: 'center',
						key: 'lrsj',
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
				                      
				                    }
				                  }
				                },
				                "附件"
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
				this.height = $(window).height() - 240;
			})
		},
		methods:{
			queryPage(){
				let _this = this;
			      _this.loading = true;
			      _this.columnsData = [
			        {
			          dw: "临河临河",
			          khnrmx: "99",
			          fz: "99",
			          lrsj: "2018-11-17 00:00:00"
			        },
			        {
			          dw: "临河临河",
			          khnrmx: "99",
			          fz: "99",
			          lrsj: "2018-11-17 00:00:00"
			        },{
			          dw: "临河临河",
			          khnrmx: "99",
			          fz: "99",
			          lrsj: "2018-11-17 00:00:00"
			        },{
			          dw: "临河临河",
			          khnrmx: "99",
			          fz: "99",
			          lrsj: "2018-11-17 00:00:00"
			        },{
			          dw: "临河临河",
			          khnrmx: "99",
			          fz: "99",
			          lrsj: "2018-11-17 00:00:00"
			        },{
			          dw: "临河临河",
			          khnrmx: "99",
			          fz: "99",
			          lrsj: "2018-11-17 00:00:00"
			        },{
			          dw: "临河临河",
			          khnrmx: "99",
			          fz: "99",
			          lrsj: "2018-11-17 00:00:00"
			        }
			      ];
			      _this.loading = false;
			},
            initPage(){

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
    #khgl-detail{
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