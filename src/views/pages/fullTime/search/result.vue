<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0" v-for="(item,index) in detailObj" :key="index">
				<tr>
					<th>
						<h2>{{item.jzjc}}</h2>
					</th>
				</tr>
				<table border="1" cellspacing="0"  v-for="(item,index) in item.fkList" :key="index">
					<tr>
						<th>反馈人</th>
						<th>{{item.zxr}}</th>
						<th>反馈时间</th>
						<th>{{item.fksj|timestampToTime}}</th>
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
							<span v-for="(fjItem,index) in item.fjList"  @click="handlePrev(fjItem)" :key="index">{{fjItem.filename}}.{{fjItem.category}}</span>
						</th>
					</tr>
				</table>
			</table>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	export default {
		components: {
			
		},
		props: {
			fncResult:{
				type:Promise
			}
		},
		data() {
			return {
				detailObj:[],
				columnsData:[]
			}
		},
		mounted() {
            this.getResult();
		},
		methods:{
			getResult(){
				this.fncResult.then(res=>{
					this.detailObj=res.jzList;
					console.log(this.detailObj,"ccc")
				})
			},
			getAppendix(){
			    let objs={
	            	type:1,
	            	tablename:'T_HCZZ_SQXX',
	            	glid:this.detailObj.id
	            }
			    api.api('post',api.configUrl+'/hczz/fj/getFjList',objs).then(res=>{
			        this.columnsData=res
			    })
			},
			handlePrev(val) {
				api.upload(val)
			}
		}
	};
</script>
<style lang="less">
	
</style>