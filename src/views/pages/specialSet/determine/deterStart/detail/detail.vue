<template>
	<div :style="{height:height}" style="overflow-y: auto;">
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0" v-if="rwly==0">
				<tr>
					<th class="oddTh">事件名称</th>
					<th colspan="3">{{sqObj.ajmc}}</th>
				</tr>
				<tr>
					<th class="oddTh">事件类型</th>
					<th :colspan="3">{{sqObj.jqajlx}}</th>
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
					<th colspan="3" :title="sqObj.jyrwnr" class="breakWord">{{sqObj.jyrwnr}}</th>
				</tr>
				<tr>
					<th class="oddTh">任务附件</th>
					<th colspan="3">
						<a v-for='item in columnsData' @click="handlePrev(item)">
							<span><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
				<tr>
					<th class="oddTh">手续补录附件(包含驳回材料)</th>
					<th colspan="3">
						<a v-for='item in columnsDataone' @click="handlePrev(item)">
							<span><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
			</table>
			<table border="1" cellspacing="0" v-else>
				<tr v-if="rwly==2">
					<th class="oddTh">案件编号</th>
					<th>{{sqObj.sabjbh}}</th>
					<th class="oddTh">事件名称</th>
					<th>{{sqObj.ajmc}}</th>
				</tr>
				<tr v-else>
					<th class="oddTh">案件编号</th>
					<th colspan="3">{{sqObj.sabjbh}}</th>
				</tr>
				<tr>
					<th class="oddTh">事件类型</th>
					<th>{{sqObj.jqajlx}}</th>
					<th class="oddTh">事件时间</th>
					<th>{{sqObj.slsj | timestampToTime}}</th>
				</tr>
				<tr>
					<th class="oddTh">事件描述</th>
					<th colspan="3" :title="sqObj.jyaq" class="breakWord">{{sqObj.jqajzs}}</th>
				</tr>
				<tr>
					<th class="oddTh">事件案发地点</th>
					<th colspan="3">{{sqObj.afdz}}</th>
				</tr>
				<tr>
					<th class="oddTh">申请人</th>
					<th>{{sqxxObj.sqr}}</th>
					<th class="oddTh">申请部门</th>
					<th>{{sqxxObj.sqbmmc}}</th>
				</tr>
				<tr>
					<th class="oddTh">申请时间</th>
					<th>{{sqxxObj.sqrq | timestampToTime}}</th>
					<th class="oddTh">联系电话</th>
					<th>{{sqxxObj.sqrlxdh}}</th>
				</tr>
				<tr>
					<th class="oddTh">简要内容</th>
					<th colspan="3" :title="sqxxObj.jyrwnr" class="breakWord">{{sqxxObj.jyrwnr}}</th>
				</tr>
				<tr>
					<th class="oddTh">任务附件</th>
					<th colspan="3">
						<a v-for='item in columnsData' @click="handlePrev(item)">
							<span><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
				<tr>
					<th class="oddTh">手续补录附件(包含驳回材料)</th>
					<th colspan="3">
						<a v-for='item in columnsDataone' @click="handlePrev(item)">
							<span><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
				sqxxObj:{},
				id:'',//id
				rwly:'',//任务来源  0 手动发起 1 警情发起  2 案件发起
			}
		},
		mounted() {
			this.height = $(window).height()  - 368 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - 368 + 'px';
     		 }
			this.getDetail();
		},
		methods: {
			 myWork(){
				return api.api('post',api.configUrl+'/hczz/za/getSqxxXx',{id:this.determineId}).then(res=>{
					if(res.ajjbxx){
						this.sqObj=res.ajjbxx;
					}else{
						this.sqObj=res.sqxx;
					}
					this.id=res.sqxx.id;
					this.rwly=res.sqxx.rwly;
					this.sqxxObj=res.sqxx;
				})
			},
			getAppendix(){
			    	let objs={
		            	type:1,
		            	tablename:'T_HCZZ_SQXX',
		            	glid:this.id
		            }
				    api.api('post',api.configUrl+'/hczz/fj/getFjList',objs).then(res=>{
				        this.columnsData=res;
				    })
			},
			getAppendixone(){
			    let objs={
	            	type:0,
	            	tablename:'T_HCZZ_SQXX',
	            	glid:this.id
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
			handlePrev(val) {
				api.upload(val)
			}
		}
	};
</script>
<style lang="less">
	.tableStyle{
		background: white;
		padding: 10px 20px;
	}
</style>