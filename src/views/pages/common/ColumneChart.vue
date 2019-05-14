<template>
	<div class="bar">
		<p class="op">
			<img src="../../../images/home/office.png" alt="" />
			<span>部门数据</span>
		</p>
		<div class="ColumneChart" ref="ColumneChart"></div>
	</div>
</template>

<script>
	import $ from 'jquery';
	import { debounce } from '@/libs/util'
	import echarts from 'echarts' //引入echarts
	export default {
		props: {
			echarttop: {
				type: Array
			}
		},
		name: 'eCharts',
		computed: {

		},
		data() {
			return {
				name: [],
				chartData: [],
				xAxisTitle: [],
				chartData: [],
				myChart: null,
			};
		},
		watch: {
			echarttop() {
				this.chartData = this.echarttop[1].childrenList.map(item => {
					return {
						value: item.name,
						name: item.code,
						dat: item.childrenList
					}
				})
				console.log(this.chartData)
				this.name = this.chartData.map(item => {
					return {
						value: item.dat,
					}
				})
				this.initEcharts();
			}
		},
		mounted() {
			this.__resizeHanlder = debounce(() => {
				if(this.myChart) {
					this.myChart.resize()
				}
			}, 100)
			window.addEventListener('resize', this.__resizeHanlder);
		},
		methods: {
			initEcharts() {
				this.myChart = this.$echarts.init(this.$refs.ColumneChart);
				let dagendData = [];
				let series = [];
				this.chartData[0].dat.forEach(item => {
					dagendData.push(item.name)
				})
				dagendData.forEach((item, i) => {
					let dats = [];
					this.chartData.forEach((n, m) => {

						dats.push(n.dat[i].count)

					})
					series.push({
						name: item,
						type: 'bar',
						data: dats
					})
				})
				var option = {
					backgroundColor: '#fff',
					color: ['#5eb2ed', '#c8b7e9'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						data: dagendData,
						left: 'right'
					},
					toolbox: {
						show: false
					},
					calculable: true,
					xAxis: [{
						type: 'category',
						axisTick: {
							show: false
						},
						boundaryGap: ['50%', '80%'],
						data: this.chartData,
						axisLine: {
							lineStyle: {
								color: '#ddd'
							}
						},
						axisLabel: {
							color: '#333',
							fontSize: 14
						}
					}],
					yAxis: [{
						type: 'value',
						splitLine: {
							show: false
						},
						minInterval: 1,
						boundaryGap: [0, 0.1],
						axisLine: {
							lineStyle: {
								color: '#ddd'
							}
						},
						axisLabel: {
							color: '#333',
							fontSize: 14
						}
					}],
					series: series
				};
				this.myChart.setOption(option);
				//              this.myChart.group = 'mygroup';

			}

		}
	}
</script>

<style lang="less">
	.bar {
		background: #e6e6e6;
		width: 53%;
		height: 300px;
		box-shadow: #999 0 0 5px;
		border-radius: 8px;
		margin-left: 2%;
		.op {
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid #eee;
			background: rgb(250, 250, 250);
			img {
				margin-left: 18px;
				margin-right: 10px;
			}
		}
	}
</style>