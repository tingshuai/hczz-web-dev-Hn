<template>
	<el-dialog class="modal-ct workBench-group-modal" title="反馈结果" @close='closeModel' :visible.sync="fkvisible" :modal-append-to-body='false' width="900px">
		<div class="table1">
			<table border="1" cellspacing="0">
				<tr>
					<th>反馈人</th>
					<th colspan="2" style="width:286px"></th>
					<th>反馈时间</th>
					<th colspan="2" style="width:286px"></th>
				</tr>
				<tr>
					<th style="height:80px">反馈内容</th>
					<th colspan="5"></th>
				</tr>
				<tr>
					<th>反馈附件</th>
					<th colspan="5"></th>
				</tr>
			</table>
		</div>
		<div slot="footer" class="font-size-0">
			<Button type="primary" class="cancelBtn" @click="cancelBtn">关闭</Button>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				fkvisible: this.show,

			};
		},
		watch: {
			show() {
				this.fkvisible = this.show;
			}
		},
		methods: {
			closeModel() {
				this.$emit("update:show", false);
			},
			cancelBtn() {
				this.show = false;
			},
		}
	};
</script>
<style lang="less">
	.table1 {
		border: 1px solid #dddee1;
		border-collapse: collapse;
		border-spacing: 0;
		margin-top:30px
	}
	
	.table1 th {
		height: 40px;
		border: 1px solid #dddee1;
		width:143px;
	}
	/*.special .v-modal{
		width:100%;
	}*/
</style>