<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0">
				<tr>
					<th>反馈人</th>
					<th>{{detailObj.zxr}}</th>
					<th>反馈时间</th>
					<th>{{detailObj.czsj | timestampToTime}}</th>
				</tr>
				<tr>
					<th>反馈内容</th>
					<th colspan="3">{{detailObj.cznr}}</th>
				</tr>
				<tr>
					<th>反馈附件</th>
					<th colspan="3">
						<a v-for='item in columnsData'>
							<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
						</a>
					</th>
				</tr>
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
				detailObj:{},
				columnsData:[]
			}
		},
		mounted() {
            this.getResult();
		},
		methods:{
			getResult(){
				this.fncResult.then(res=>{
					this.detailObj=res.clrz[0]
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
<style lang="less" scoped>
	.table1{
		border: 0px;
		height: calc(100% - 60px);
		overflow: auto;
	}
</style>