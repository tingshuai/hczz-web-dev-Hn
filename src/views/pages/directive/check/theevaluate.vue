<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0">
				<tr>
					<th>服务态度</th>
					<th colspan="2">
						<el-rate v-model="value1"></el-rate>
					</th>
				</tr>
				<tr>
					<th>反馈速度</th>
					<th colspan="2">
						<el-rate v-model="value2"></el-rate>
					</th>
				</tr>
				<tr>
					<th>应用效果</th>
					<th colspan="2">
						<el-rate v-model="value3"></el-rate>
					</th>
				</tr>
				<tr>
					<th>评价内容</th>
					<th colspan="2"></th>
				</tr>
			</table>
		</div>
		<br>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0">
				<tr>
					<th>反馈结果</th>
					<th colspan="2"></th>
				</tr>
				<tr>
					<th>反馈人</th>
					<th colspan="2"></th>
				</tr>
				<tr>
					<th>反馈时间</th>
					<th colspan="2"></th>
				</tr>
				<tr>
					<th>反馈内容</th>
					<th colspan="2"></th>
				</tr>
				<tr>
					<th>反馈附件</th>
					<th colspan="2"></th>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>export default {
	data() {
		return {
			value1: null,
			value2: null,
			value3: null
		}
	}
}</script>

<style>
	/*th {
		width: 84px !important;
		height:60px !important;
	}*/
</style>