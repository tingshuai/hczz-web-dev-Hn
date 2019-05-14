<template>
	<div class="chart-wrapper">
		<caseCaketypesoild :echarttop="objectChartData" class="pieCharts"></caseCaketypesoild>
		<columneChart  :echarttop="objectChartData" class="entityCharts"></columneChart>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';

	import caseCaketypesoild from '../common/CaseCaketypesoild.vue'
	import columneChart from '../common/ColumneChart.vue'

	export default {
		props: {
			echarttop: {
				type: Array
			}
		},
		components: {
			caseCaketypesoild,
			columneChart
		},
		data() {
			return {
				objectChartData: []
			}
		},
		watch: {
			echarttop() {
				this.objectChartData = this.echarttop;
			},
		},
		mounted() {
			
		},
		created() {
			
		},
		methods: {

		}

	}
</script>

<style lang="less">
	.chart-wrapper {
		width: 100%;
		display: flex;
		/*height: 80%;*/
	}
</style>