<template>
	<el-dialog class="modal-ct workBench-group-modal" title="详细信息" @close='closeModel' :visible.sync="xxvisible" :modal-append-to-body='false' width="900px">
		<div>
			<div class="clearfix tableStyle thexxxx">
				<table border="1" cellspacing="0">
					<tr v-if="detailObj.rwly==2">
						<th>事件编号</th>
						<th>{{detailObj.sabjbh}}</th>
						<th>事件名称</th>
						<th>{{detailObj.ajmc}}</th>
					</tr>
					<tr v-if="detailObj.rwly==1">
						<th>事件编号</th>
						<th :colspan="3">{{detailObj.sabjbh}}</th>
					</tr>
					<tr v-if="detailObj.rwly==0">
						<th>事件名称</th>
						<th :colspan="3">{{detailObj.ajmc}}</th>
					</tr>
					<tr v-if="detailObj.rwly!=0">
						<th>事件类型</th>
						<th>{{detailObj.jqajlx}}</th>
						<th>事件时间</th>
						<th>{{detailObj.slsj|timestampToTime}}</th>
					</tr>
					<tr v-if="detailObj.rwly==0">
						<th>事件类型</th>
						<th :colspan="3">{{detailObj.jqajlx}}</th>
					</tr>
					<tr v-if="detailObj.rwly!=0">
						<th>简要案情</th>
						<th colspan="3">{{detailObj.jqajzs}}</th>
					</tr>
					<tr v-if="detailObj.rwly!=0">
						<th>事件案发地点</th>
						<th colspan="3">{{detailObj.afdz}}</th>
					</tr>
					<tr>
						<th>申请人</th>
						<th>{{detailObj.sqr}}</th>
						<th>申请部门</th>
						<th>{{detailObj.sqbmmc}}</th>
					</tr>
					<tr>
						<th>申请时间</th>
						<th>{{detailObj.sqrq|timestampToTime}}</th>
						<th>联系电话</th>
						<th>{{detailObj.sqrlxdh}}</th>
					</tr>
					<tr>
						<th>简要任务内容</th>
						<th colspan="3">
							<p style="overflow: hidden;text-overflow: ellipsis;" :title="detailObj.jyrwnr">{{detailObj.jyrwnr}}</p>
						</th>
					</tr>
					<tr>
						<th>任务附件</th>
						<th colspan="3">
							<a v-for='(item,index) in columnsData' :key="index">
								<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
							</a>
						</th>
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
	import api from '@/fetch/api';
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			xxFnc: {
				type: Promise
			}
		},

		data() {
			return {
				xxvisible: this.show,
				detailObj: {},
				columnsData: []
			};
		},
		watch: {
			show() {
				this.xxvisible = this.show;
			}
		},
		mounted() {
			this.xxFnc.then(res => {
				this.detailObj = res.sqxx;
				this.columnsData = res.attach.filter(item => {
					return item.type == 1
				});
			})
		},
		methods: {
			closeModel() {
				this.$emit("update:show", false);
			},
			cancelBtn() {
				this.show = false;
			},
			handlePrev(val) {
				api.upload(val)
			}
		}
	};
</script>
<style scoped>
	.thexxxx th {
		width: auto !important;
	}
</style>