<template>
	<div class="pie">
		<p class="op">
			<img src="@/images/home/person.png" alt="" />
			<span>个人数据</span>
			<img src="@/images/home/back.png" @click="back" class="backImg"/>
		</p>
		<div class="CaseCaketypesoild" ref="CaseCaketypesoild"></div>
		<ul>
			<li v-for="(item,index) in rightCont" :key="index">
				<img :src='item.img' alt="" />
				<div>
					<span>{{item.name}}</span>
					<span class="numbers">{{item.value}}</span>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			echarttop: {
				type: Array
			}
		},
		computed: {

		},
		data() {
			return {
				name: [],
				chartData: [],
				xAxisTitle: [],
				myChart: null,
				rightCont: [], //右侧数据展示
				rightContCopy:[]//点击回退时，回到初始数据
			};
		},
		watch: {
			echarttop(val) {
				console.log(val)
				this.chartData = val[0].childrenList.map(item => {
					return {
						value: item.count,
						name: item.name,
						dat: item.childrenList
					}
				})
				this.rightContCopy=this.rightCont=this.chartData;
				this.rightCont.map((item,i)=>{
					this.$set(item,'img',require('@/images/home/top'+(i+1)+'.png'))
				})
				this.name = this.chartData.map(item => {
					return {
						value: item.dat,
					}
				})
				this.initEcharts();
			}
		},
		created() {

		},
		mounted() {},
		methods: {
			back(){
				this.rightCont=this.rightContCopy;
			},
			initEcharts() {
				this.myChart = this.$echarts.init(this.$refs.CaseCaketypesoild);
				// 基于准备好的dom，初始化echarts实例
				var option = {
					backgroundColor:'#fff',
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					series: [{
						name: '',
						type: 'pie',
						radius: '80%',
						center: ['40%', '50%'],
						type: 'pie',
						color: ['#37a2da', '#67e0e3', '#ffdb5c', '#ff9f7f'],
						data: this.chartData,
						roseType: 'radius',
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						},
						animationType: 'scale',
			            animationEasing: 'elasticOut',
			            animationDelay: function (idx) {
			                return Math.random() * 200;
			            }
					}]
				};
				let self=this;
				self.myChart.setOption(option);
				self.myChart.on('click', function(params) {
					console.log(params.data.dat)
					self.rightCont=[];
					params.data.dat.forEach((item,i)=>{
						self.rightCont.push({
							name:item.name,
							value:item.count,
							img:require('@/images/home/top'+(i+1)+'.png')
						})
					})
				})
			}
		}
	}
</script>

<style lang="less">
	.pie {
		width: 45%;
		height: 300px;
		border:none;
		box-shadow: 0 0 5px #999;
		border-radius: 8px;
		position: relative;
		.op{
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid #eee;
			background: rgb(250,250,250);
			img{
				margin-left: 18px;
				margin-right: 10px;
			}
			.backImg{
				float: right;
			    width: 26px;
			    margin-top: 5px;
			}
		}
		.CaseCaketypesoild {
			width: 100%;
			height: 260px;
			background: #fff;
		}
		ul{
			position: absolute;
			top: 65px;
			right: 90px;
			li{
				padding: 5px 18px;
				border: 1px solid #ccc;
				margin-bottom: 10px;
				border-radius: 4px;
				/*line-height: 32px;*/
				list-style: none;
				img{
					/*margin-top: 5px;*/
					/*margin-left: 18px;*/
				}
				div{
					float: right;
					/*margin-right:18px ;*/
					.numbers{
						font-size: 16px;
						color: #333;
					}
				}
			}
		}
	}
</style>