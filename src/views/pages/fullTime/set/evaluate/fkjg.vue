<template>
	<el-dialog class="modal-ct workBench-group-modal" title="反馈结果" @close='closeModel' :visible.sync="fkvisible" :modal-append-to-body='false' width="900px">
		<div class="table1 tableStyle" >
			<table border="1" cellspacing="0" v-for="(item,index) in list" class="margin-bottom-20" :key="index">
				<tr>
					<th >
						<h2>{{item.jzjc}}</h2>
					</th>
				</tr>
	

			<table border="1" cellspacing="0"  v-for="(item,index) in item.fkList" :key="index">
					<tr>
						<th >反馈人</th>
						<th  >{{item.zxr}}</th>
						<th >反馈时间</th>
						<th  >{{item.fksj|timestampToTime}}</th>
					</tr>
					<tr>
						<th style="height:80px">反馈内容</th>
						<th :colspan="3">
							<p style="text-overflow: ellipsis;overflow: hidden;" :title="item.fknr">{{item.fknr}}</p>
						</th>
					</tr>
					<tr>
						<th>反馈附件</th>
						<th :colspan="3">
							<span style="color:#1890ff;cursor:pointer;" v-for="(fjItem,index) in item.fjList"  @click="handlePrev(fjItem)" :key="index">{{fjItem.filename}}.{{fjItem.category}}</span>
						</th>
					</tr>
			</table>
			</table>
		
		</div>
		<div slot="footer" class="font-size-0">
			<Button type="primary" class="cancelBtn" @click="cancelBtn">关闭</Button>
		</div>
	</el-dialog>
</template>
<script>
	import { timestampToTime } from '@/libs/common/common'
	import api from '@/fetch/api';

	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			fkjg:{
				type:Promise
			}
		},

		data() {
			return {
				fkvisible: this.show,
                list:[]
			};
		},
		mounted(){
			this.fkjg.then(res=>{
				this.list=res.jzList;
			})
		},
		watch: {
			show() {
				this.fkvisible = this.show;
			}
		},
		methods: {
			handlePrev(val) {
				console.log(val)
				api.upload(val)
			},
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
		/*border: 1px solid #dddee1;*/
		border-collapse: collapse;
		border-spacing: 0;
		/*margin-top:30px;*/
		height: 100%;
		overflow: auto;
	}
	
	.table1 th {
		height: 40px;
		border: 1px solid #dddee1;
		width:auto;
	}
	/*.special .v-modal{
		width:100%;
	}*/
</style>