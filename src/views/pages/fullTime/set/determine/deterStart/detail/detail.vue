<template>
	<div :style="{height:height}" style="overflow-y: auto;">
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0" v-if="!isFlag">
				<tr v-if="sqObj.rwly==2">
					<th class="oddTh">涉案编号</th>
					<th>{{sqObj.sabjbh}}</th>
					<th class="oddTh">案件名称</th>
					<th>{{sqObj.ajmc}}</th>
				</tr>
				<tr v-if="sqObj.rwly==1">
					<th class="oddTh">接警单编号</th>
					<th>{{sqObj.sabjbh}}</th>
					<th class="oddTh">案件名称</th>
					<th>{{sqObj.ajmc}}</th>
				</tr>
				<!-- <tr v-if="sqObj.rwly==1">
					<th class="oddTh">案件编号</th>
					<th :colspan="3">{{sqObj.sabjbh}}</th>
				</tr> -->
				<tr v-if="sqObj.rwly==0">
					<th class="oddTh">案件名称</th>
					<th :colspan="3">{{sqObj.ajmc}}</th>
				</tr>
				<tr v-if="sqObj.rwly==1">
					<th class="oddTh">事件类型</th>
					<th>{{sqObj.jqajlx}}</th>
					<th class="oddTh">报警时间</th>
					<th>{{sqObj.slsj | timestampToTime}}</th>
				</tr>
				<tr v-if="sqObj.rwly==2">
					<th class="oddTh">事件类型</th>
					<th>{{sqObj.jqajlx}}</th>
					<th class="oddTh">受理时间</th>
					<th>{{sqObj.slsj | timestampToTime}}</th>
				</tr>
				<tr v-if="sqObj.rwly==0">
					<th class="oddTh">事件类型</th>
					<th :colspan="3">{{sqObj.jqajlx}}</th>
				</tr>
				<tr v-if="sqObj.rwly==2">
					<th class="oddTh">简要案情</th>
					<th :colspan="3">{{sqObj.jqajzs}}</th>
				</tr>
				<tr v-if="sqObj.rwly==1">
					<th class="oddTh">报警内容</th>
					<th :colspan="3">{{sqObj.jqajzs}}</th>
				</tr>
				<!-- <tr v-if="sqObj.rwly!=0">
					<th class="oddTh">简要案情</th>
					<th colspan="3">{{detailObj1.jqajzs}}</th>
				</tr> -->
				<tr v-if="sqObj.rwly!=0">
					<th class="oddTh">事件案发地点</th>
					<th colspan="3">{{sqObj.afdz}}</th>
				</tr>
				<tr>
					<th class="oddTh">申请人</th>
					<th>{{sqObj.sqr}}</th>
					<th class="oddTh">申请部门</th>
					<th>{{sqObj.sqbmmc}}</th>
				</tr>
				<tr>
					<th class="oddTh">申请时间</th>
					<th>{{sqObj.sqrq | timestampToTime}}</th>
					<th class="oddTh">联系电话</th>
					<th>{{sqObj.sqrlxdh}}</th>
				</tr>
				<tr>
					<th class="oddTh">简要内容</th>
					<th colspan="3" class="breakWord">{{sqObj.jyrwnr}}</th>
				</tr>
				<tr>
					<th class="oddTh">任务附件</th>
					<th colspan="3">
						<a v-for='(item,index) in columnsData' :key="index" @click="handlePrev(item)">
							<span class="fjfiles" ><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
				<tr>
					<th class="oddTh">手续补录附件(包含驳回材料)</th>
					<th colspan="3">
						<a v-for='(item,index) in columnsDataone' :key="index">
							<span class="fjfiles" @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
			</table>
			<table border="1" cellspacing="0" v-else>
				<tr>
					<th class="oddTh">案件编号</th>
					<th>{{sqObj.ajbh}}</th>
					<th class="oddTh">事件名称</th>
					<th>{{sqObj.ajmc}}</th>
				</tr>
				<tr>
					<th class="oddTh">事件类型</th>
					<th>{{sqObj.ajlbMc}}</th>
					<th class="oddTh">事件时间</th>
					<th>{{sqObj.sqrq | timestampToTime}}</th>
				</tr>
				<tr>
					<th class="oddTh">事件描述</th>
					<th colspan="3" class="breakWord">{{sqObj.jyaq}}</th>
				</tr>
				<tr>
					<th class="oddTh">事件案发地点</th>
					<th colspan="3">{{sqObj.afdz}}</th>
				</tr>
				<tr>
					<th class="oddTh">申请人</th>
					<th>{{sqObj.sqr}}</th>
					<th class="oddTh">申请部门</th>
					<th>{{sqObj.sqbmmc}}</th>
				</tr>
				<tr>
					<th class="oddTh">申请时间</th>
					<th>{{sqObj.slsj | timestampToTime}}</th>
					<th class="oddTh">联系电话</th>
					<th>{{sqObj.sqrlxdh}}</th>
				</tr>
				<tr>
					<th class="oddTh">简要内容</th>
					<th colspan="3" class="breakWord">{{sqObj.jyrwnr}}</th>
				</tr>
				<tr>
					<th class="oddTh">任务附件</th>
					<th colspan="3">
						<a v-for='(item,index) in columnsData' :key="index" @click="handlePrev(item)">
							<span class="fjfiles" ><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
				<tr>
					<th class="oddTh">手续补录附件(包含驳回材料)</th>
					<th colspan="3">
						<a v-for='(item,index) in columnsDataone' :key="index">
							<span class="fjfiles" @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api.js';
	import {timestampToTime} from '@/libs/common/common';
	export default {
		computed:{
			determineId(){
				return this.$route.query.id
			}
		},
		data() {
			return {
				height:'',
				sqObj:{},
				columnsData:[],
				columnsDataone:[],
				isFlag:false
			}
		},
		mounted() {
			this.height = $(window).height()  - 368 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - 368 + 'px';
     		 }
			this.getDetail();
			// this.getAppendix();
			// this.getAppendixone();
		},
		methods: {
			handlePrev(val) {
				api.upload(val)
			},
			 myWork(){
				return api.api('get', api.configUrl + '/hczz/zhb/queryDetail/'+this.determineId).then(res=>{
					if(res.ajjbxx){
						this.sqObj=res.ajjbxx;
						this.isFlag=true;
					}else{
						this.sqObj=res.sqxx;
						this.isFlag=false;
					}
				})
			},
			getAppendix(){
			    	let objs={
		            	type:1,
		            	tablename:'T_HCZZ_SQXX',
		            	glid:this.sqObj.id
		            }
				    api.api('post',api.configUrl+'/hczz/fj/getFjList',objs).then(res=>{
				        this.columnsData=res;
				    })
			},
			getAppendixone(){
			    let objs={
	            	type:0,
	            	tablename:'T_HCZZ_SQXX',
	            	glid:this.sqObj.id
	            }
			    api.api('post',api.configUrl+'/hczz/fj/getFjList',objs).then(res=>{
			        this.columnsDataone=res
			    })
			},
			async getDetail() {
				await this.myWork();
				this.getAppendix();
				this.getAppendixone();
			},
			
		}
	};
</script>
<style lang="less" scoped>
	.tableStyle{
		background: white;
		padding: 10px 20px;
		th{
			width: auto;
		}
	}
</style>