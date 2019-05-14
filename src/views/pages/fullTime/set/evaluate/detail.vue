<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0">
				<tr v-if="detailObj.rwly==2">
					<th>事件编号</th>
					<th>{{detailObj.sabjbh}}</th>
					<th>事件名称</th>
					<th>{{detailObj.ajmc}}</th>
				</tr>
				<tr v-if="detailObj.rwly==1">
					<th>事件编号</th>
					<th :col="3">{{detailObj.sabjbh}}</th>
				</tr>
				<tr v-if="detailObj.rwly==0">
					<th>事件名称</th>
					<th :colspan="3">{{detailObj.ajmc}}</th>
				</tr>
				<tr>
					<th>事件类型</th>
					<th>{{detailObj.jqajlx}}</th>
					<th>事件时间</th>
					<th>{{detailObj.sqrq|timestampToTime}}</th>
				</tr>
				<tr>
					<th>简要案情</th>
					<th colspan="3">{{detailObj.jqajzs}}</th>
				</tr>
				<tr>
					<th>事件案发地点</th>
					<th colspan="3">{{detailObj.zaxzcs}}</th>
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
					<th colspan="3">{{detailObj.jyrwnr}}</th>
				</tr>
				<tr>
					<th>任务附件</th>
					<th colspan="3">
						<a v-for='item in columnsData'>
							<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
				<!--<tr>
					<th>手续补录附件(包含驳回材料)</th>
					<th colspan="3">
						
							<a v-for='item in columnsDataone'>
								<span><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
						
					</th>
				</tr>-->
			</table>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		components: {
			
		},
		props:{
			fncDetail:{
				type:Promise
			}
		},
		data() {
			return {
				detailObj:{},
				columnsData:[]
			}
		},
		mounted() {
			this.getDetail();
		},
		methods: {
			async getDetail (){
				await this.fncDetail.then(res=>{
					this.detailObj=res.sqxx;
					this.columnsData=res.attach.filter(item=>{
			        	return item.type==1
			        })
				})
//				this.getAppendix()
			},
			getAppendix(){
			    let objs={
	            	type:1,
	            	tablename:'T_HCZZ_SQXX',
	            	glid:this.detailObj.id
	            }
			    api.api('post',api.configUrl+'/hczz/fj/getFjList',objs).then(res=>{
			        this.columnsData=res.filter(item=>{
			        	return item.type==1
			        })
			    })
			},
			handlePrev(val) {
				api.upload(val)
			}
		}
	};
</script>
<style lang="less" scoped>
	.tableStyle2{
		width: 100%;
		table{
			width: 100%;
			table-layout: fixed;
			th{
				height: 46px;
				word-break: break-all;
				width: auto;
			}
		}
	}
</style>