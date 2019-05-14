<template>
	<el-dialog class="modal-ct workBench-group-modal" title="反馈结果" @close='closeModel' :visible.sync="lcvisible" :modal-append-to-body='false' width="900px">
		<div>
			<div class="clearfix tableStyle">
				<table border="1" cellspacing="0">
					<tr>
						<th>状态</th>
						<th></th>
						<th rowspan="2">下一个处理人</th>
						<th rowspan="2"></th>
					</tr>
					<tr>
						<th>下一个处理部门</th>
						<th></th>
					</tr>
				</table>
				<div class="path-flow-ct">
					
				</div>
			</div>
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
				lcvisible: this.show,

			};
		},
		watch: {
			show() {
				this.lcvisible = this.show;
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

</style>