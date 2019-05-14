<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0" v-if="rwly==0">
				<tr>
					<th>事件编号</th>
					<th>{{detailObj.sabjbh}}</th>
					<th>事件名称</th>
					<th>{{detailObj.ajmc}}</th>
				</tr>
				<tr>
					<th>事件类型</th>
					<th>{{detailObj.jqajlx}}</th>
					<th>事件时间</th>
					<th>{{detailObj.sqrq|timestampToTime}}</th>
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
					<th colspan="3" :title="detailObj.jyrwnr" class="breakWord">{{detailObj.jyrwnr}}</th>
				</tr>
				<tr>
					<th>任务附件</th>
					<th colspan="3">
						<a v-for='item in columnsData' @click="handlePrev(item)" :key="index">
							<span class="fjfiles"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
				<tr>
					<th>手续补录附件(包含驳回材料)</th>
					<th colspan="3">
						
							<a v-for='(item,index) in columnsDataone' :key="index" @click="handlePrev(item)">
								<span class="fjfiles"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
						
					</th>
				</tr>
			</table>
			<table border="1" cellspacing="0" v-else>
				<tr>
					<th>事件编号</th>
					<th>{{detailObj.sabjbh}}</th>
					<th>事件名称</th>
					<th>{{detailObj.ajmc}}</th>
				</tr>
				<tr>
					<th>事件类型</th>
					<th>{{detailObj.jqajlx}}</th>
					<th>事件时间</th>
					<th>{{detailObj.slsj|timestampToTime}}</th>
				</tr>
				<tr>
					<th>事件描述</th>
					<th colspan="3" class="breakWord" :title="detailObj.jqajzs">{{detailObj.jqajzs}}</th>
				</tr>
				<tr>
					<th>事件案发地点</th>
					<th colspan="3" class="text-overflow" :title="detailObj.afdz">{{detailObj.afdz}}</th>
				</tr>
				<tr>
					<th>申请人</th>
					<th>{{sqxxObj.sqr}}</th>
					<th>申请部门</th>
					<th>{{sqxxObj.sqbmmc}}</th>
				</tr>
				<tr>
					<th>申请时间</th>
					<th>{{sqxxObj.sqrq|timestampToTime}}</th>
					<th>联系电话</th>
					<th>{{sqxxObj.sqrlxdh}}</th>
				</tr>
				<tr>
					<th>简要任务内容</th>
					<th colspan="3" :title="sqxxObj.jyrwnr" class="breakWord">{{sqxxObj.jyrwnr}}</th>
				</tr>
				<tr>
					<th>任务附件</th>
					<th colspan="3">
						<a v-for='item in columnsData'>
							<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
				<tr>
					<th>手续附件(包含驳回材料)</th>
					<th colspan="3">
						
							<a v-for='item in columnsDataone'>
								<span><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
						
					</th>
				</tr>
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
				detailObj:{},//详情
				columnsData:[],//任务附件
				columnsDataone:[],//手续附件
				rwly:'',//任务来源 0 手动发起  1警情发起  2案件发起
				sqxxObj:{}
			}
		},
		mounted() {
			this.getDetail();
		},
		methods: {
			async getDetail (){
				await this.fncDetail.then(res=>{
					if(res.ajjbxx){
						this.detailObj=res.ajjbxx;
					}else{
						this.detailObj=res.sqxx;
					}
					this.rwly=res.sqxx.rwly;
					this.sqxxObj=res.sqxx;
				})
				this.getAppendix()
			},
			getAppendix(){
			    let objs={
	            	type:1,
	            	tablename:'T_HCZZ_SQXX',
	            	glid:this.sqxxObj.id
	            }
			    api.api('post',api.configUrl+'/hczz/fj/getFjList',objs).then(res=>{
			        this.columnsData=res
			    })
			    let objs2={
	            	type:0,
	            	tablename:'T_HCZZ_SQXX',
	            	glid:this.sqxxObj.id
	            }
			    api.api('post',api.configUrl+'/hczz/fj/getFjList',objs2).then(res=>{
			        this.columnsDataone=res
			    })
			},
			handlePrev(val) {
				api.upload(val)
			}
		}
	};
</script>
<style lang="less">
	.tableStyle{
		table{
			table-layout: fixed;
			th{
				word-break: break-all;
			}
		}
	}
</style>