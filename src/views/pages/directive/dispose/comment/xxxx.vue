<template>
	<el-dialog class="modal-ct workBench-group-modal" title="反馈结果" @close='closeModel' :visible.sync="xxvisible" :modal-append-to-body='false' width="900px">
		<div>
			<div class="clearfix tableStyle thexxxx">
				<table border="1" cellspacing="0">
					<tr>
						<th>指令核查编号</th>
						<th></th>
						<th>指令核查名称</th>
						<th></th>
						<th>指令类型</th>
						<th></th>
					</tr>
					<tr>
						<th>指令级别</th>
						<th></th>
						<th>签收时限</th>
						<th></th>
						<th>反馈时限</th>
						<th></th>
					</tr>
					<tr>
						<th>指令内容</th>
						<th colspan="5" class="breakWord"></th>
					</tr>
					<tr>
						<th>接收部门</th>
						<th></th>
						<th>抄送部门</th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th>下发人</th>
						<th></th>
						<th>下发部门</th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th>下发时间</th>
						<th></th>
						<th>联系电话</th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th>任务附件</th>
						<th colspan="5"></th>
					</tr>
					<tr>
						<th>补充附件</th>
						<th colspan="5"></th>
					</tr>
				</table>
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
				xxvisible: this.show,

			};
		},
		watch: {
			show() {
				this.xxvisible = this.show;
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
<style lang="less" >
    .thexxxx th{
    	width:143px !important;
    }
</style>