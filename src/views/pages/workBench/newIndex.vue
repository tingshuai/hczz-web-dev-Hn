<template>
	<div>
		<el-row type="flex" class="row-bg">
		  <el-col :span="8">
		  	<div class="grid-content bg-purple" style="background-color:#fff;width: 95%;">
		  	    <div id="street" style="width: 100%;height: 370px;"></div>
		    </div>
		  </el-col>
		  <el-col :span="8">
		  	<div class="grid-content bg-purple-light">
		  	  <el-container>
					<el-header style="height:200px;background-color:#fff">
						<el-carousel indicator-position="outside" :autoplay="false" height="150px">
						    <el-carousel-item v-for="item in 4" :key="item">
						      <h3>{{ item }}</h3>
						    </el-carousel-item>
						</el-carousel>
					</el-header>
					<el-footer height="200px" style="padding-top:30px">
						<el-row type="flex" class="row-bg">
						  <el-col :span="12">
						  	<div class="grid-content bg-purple" style="width:95%;background-color:#fff;text-align:center;line-height:60px">
						  		<el-button :circle="true" @click="buttonone">
									<i class="el-icon-plus"></i>
								</el-button><br>
								<span>添加合成</span>
						  	</div>
						  </el-col>
						  <el-col :span="12">
						  	<div class="grid-content bg-purple-light" style="width:95%;background-color:#fff;text-align:center;line-height:60px;float:right">
						  		<el-button :circle="true" @click="buttontwo">
									<i class="el-icon-plus"></i>
								</el-button><br>
								<span>下发指令</span>
						  	</div>
						  </el-col>
						</el-row>
					</el-footer>
				</el-container>
		    </div>
		  </el-col>
		  <el-col :span="8">
		  	<div class="grid-content bg-purple" style="width:95%;height:370px;background-color:#fff;float:right">
		  		<el-steps direction="vertical">
					<el-step :title="item.status" v-for="(item,index) in list2" :key="index">
						<div slot="title">
							{{item.czsj | timestampToTime}}
						</div>
						<div slot="description">
							<span>{{item.zxr}}</span>
							<span>{{item.czlx}}</span>
						</div>
					</el-step>
			    </el-steps>
		  	</div>
		  </el-col>
		</el-row>
		<el-row type="flex" class="row-bg">
		    <el-col :span="8">
		    	<div class="grid-content bg-purple" style="background-color:#fff;width: 95%;">
		    		 <div id="cc" style="width: 100%;height: 400px;"></div>
		    	</div>
		    </el-col>
		    <el-col :span="16">
		  	    <div class="grid-content bg-purple">
		  	    	<div>
			            <Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
		            </div>
		            <div class="pagination-ct">
				        <Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			        </div>
		  	    </div>
		    </el-col>
		</el-row>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		data() {
			return {
				formDynamic: {
					id: '',
					zt: '',
					sqrxm:'',
					time: '',
				},
				list: ['张三', '李四', '王二', '麻子'],
				list2: [],
				loading: false,
				height:0,
				columnsData: [],
				columns: [{
						title: '编号',
						align: 'center',
						key: 'id',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '申请人',
						align: 'center',
						key: 'sqr',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '案事件名称',
						align: 'center',
						key: 'ajmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '申请时间',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.sqrq))
						}
					},
					{
						title: '当前状态',
						align: 'center',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							let ztList=this.typeList.filter((value)=>{
								return value.code==params.row.zt
							})
							return h('div',ztList[0].title)
						}
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
											this.show=true;
                                            this.title=params.row.rolePname;
                                            this.$store.commit('setMaterialId',params.row.id);
                                            this.$refs.modal.resets();
										}
									}
								}, '处理 ')
							])
						}
					}
				],
				pageArray: [10, 20, 30],
				total:0,
				typeList:{},
				basePage: {
					current: 1,
					pageNumber: 1,
					pageSize: 10
				},
			}
		},
		computed: {
			determineId() {
				return this.$route.query.determineId
			}
		},
		mounted() {
			var echarts = require('echarts');
			let self = this;
			self.getDetail();
			this.render();
			this.$nextTick(() => {
				this.height = $(window).height() - 610;
				var myChart1 = echarts.init(document.getElementById('cc'));
				var option = {
					title: {
						text: 'ECharts 入门示例'
					},
					tooltip: {
						trigger: 'axis',
						backgroundColor: 'red',
						formatter: function(params, ticket, callback) {
							var htmlStr = '';
							for(var i = 0; i < self.list.length; i++) {
								var param = self.list[i];
								var xName = param; //x轴的名称
								var seriesName = param; //图例名称
								var value = param; //y轴值
								var color = 'green'; //图例颜色

								if(i === 0) {
									htmlStr += xName + '<br/>'; //x轴的名称
								}
								htmlStr += '<div>';
								//为了保证和原来的效果一样，这里自己实现了一个点的效果
								//htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
								//圆点后面显示的文本
								htmlStr += seriesName + '：' + value + '笔';

								htmlStr += '</div>';
							}
							return htmlStr;
						}

					},
					legend: {
						data: ['销量']
					},
					xAxis: {
						type: 'category',
						data: [{
							value: '哈哈',
				//							textStyle: {
				//								color: 'red'
				//							}
						}, 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						data: [820, 932, 901, 934, 1290, 1330, 1320],
						type: 'line',
						smooth: true
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart1.setOption(option);
				var myChart = echarts.init(document.getElementById('street'));
				var option = {
					title: {
						text: 'ECharts 入门示例'
					},
					tooltip: {},
					legend: {
						data: ['销量']
					},
					xAxis: {
						data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
					},
					yAxis: {},
					series: [{
						name: '销量',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			})
		},
		created(){
			api.api('post', api.systemUrl + '/dict/findDictTreeByType?dictTypeCode=RCHCZT').then(res => {
                this.typeList = res;
            });
		},
		methods: {
			render() {
                let obj={};
				this.loading=true;
				if(this.formDynamic.time!=null && this.formDynamic.time!=''){
					obj={
		              	pagesize:this.basePage.pageSize,
		              	pageindex:this.basePage.pageNumber,
		              	ajmc:this.formDynamic.ajmc,
		              	sqrxm:this.formDynamic.sqrxm,
		              	zt:this.formDynamic.zt,
		              	starttime:this.formDynamic.time[0].getTime(),
		              	endtime:this.formDynamic.time[1].getTime()
		              }
				}else{
					obj={
		              	pagesize:this.basePage.pageSize,
		              	pageindex:this.basePage.pageNumber,
		              	ajmc:this.formDynamic.ajmc,
		              	sqrxm:this.formDynamic.sqrxm,
		              	zt:this.formDynamic.zt,
		              	starttime:'',
		              	endtime:''
		              }
				}
				api.api('post',api.configUrl+'/hczz/za/querySqxxList',obj).then(res=>{
					this.loading=false;
					if(res.list){
						this.columnsData=res.list;
						this.total
					}else{
						this.columnsData=[];
					}
					this.total=res.total;
				})
			},
			getDetail() {
				api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {
					id: this.determineId
				}).then(res => {
					this.list2 = res.clrz;
				})
			},
			buttonone(){
				this.$router.push({
            		path:'/dailyStart/request'
            	})
			},
			buttontwo(){
				this.$router.push({
            		path:'/directivePublish/publish'
            	})
			},
			buttonthree(){
				this.$router.push({
            		path:'/workindex'
            	})
			},
			pageChange(current) {
                this.basePage.current=current;
                this.basePage.pageNumber=current;
                this.render();
			},
			pageSizeChange(current) {
				this.basePage.pageSize=current;
                this.render();
			}
		}
	}
</script>

<style>

</style>