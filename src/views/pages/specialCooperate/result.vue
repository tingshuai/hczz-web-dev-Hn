<template>
	<div>
		<div class="clearfix tableStyle">
			<table border="1" cellspacing="0">
				<tr>
					<th>反馈人</th>
					<th>{{detailObj.zxr}}</th>
					<th>反馈时间</th>
					<th>{{detailObj.fksj | timestampToTime}}</th>
				</tr>
				<tr>
					<th>反馈内容</th>
					<th colspan="3" :title="detailObj.fknr" class="text-overflow">{{detailObj.fknr}}</th>
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
					if(res.rwfk && res.rwfk.length){
						this.detailObj=res.rwfk[0];
						this.getAppendix(this.detailObj.id);
					}
				})
			},
			getAppendix(id){
			    let objs={
	            	type:0,
	            	tablename:'T_HCZZ_RWFK',
	            	glid:id
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