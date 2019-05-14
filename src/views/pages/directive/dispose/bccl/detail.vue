<template>
	<div>
		<div class="clearfix tableStyle approval-detail-ct">
			<table border="1" cellspacing="0">
				<tr>
					<th>指令核查编号</th>
					<th>{{dirInfo.zlwh}}</th>
					<th>指令核查名称</th>
					<th>{{dirInfo.zlmc}}</th>
				</tr>
				<tr>
					<th>指令类型</th>
					<th>{{dirInfo.zllxmc}}</th>
					<th>指令级别</th>
					<th>{{dirInfo.zljb}}</th>
				</tr>
				<tr>
					<th>签收时限</th>
					<th>{{dirInfo.qssx}}小时</th>
					<th>反馈时限</th>
					<th>{{dirInfo.fksx}}小时</th>
				</tr>
				<tr>
					<th>指令内容</th>
					<th colspan="3">{{dirInfo.zlnr}}</th>
				</tr>
				<tr>
					<th>接收部门</th>
					<th><span v-for='item in dirRecOffice'>{{item.jsdwmc}}</span></th>
					<th>抄送部门</th>
					<th><span v-for='item in dirCopyOffice'>{{item.jsdwmc}}  </span></th>
				</tr>
				<tr>
					<th>下发人</th>
					<th>{{dirInfo.czrxm}}</th>
					<th>下发部门</th>
					<th>{{dirInfo.czrdwmc}}</th>
				</tr>
				<tr>
					<th>下发时间</th>
					<th>{{dirInfo.czsj}}</th>
					<!-- <th>联系电话</th>
					<th>13200000000</th> -->
				</tr>
				<tr>
					<th>任务附件</th>
					<th colspan="3">
						<p>
							<a v-for='item in dirProcFile'>
								<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename}}&nbsp;&nbsp;&nbsp;&nbsp;</span></a>
						</p>
					</th>
				</tr>
				<tr>
					<th>补充附件</th>
					<th colspan="3">
						<p>
						<a v-for='item in dirTaskFile'>
							<span @click="handlePrev(item)"><svg-icon name='picIcon'></svg-icon>{{item.filename}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
							</a>
						</p>
					</th>
				</tr>
			</table>
			<img :src="imgInfo">
		</div>
		
	</div>
</template>

<script>
import api from "@/fetch/api.js"
	export default {
		props: {
			directDetailFunc:{
				type:Promise
			}
		},
		data() {
			return {
				dirInfo:{},
				dirCopyOffice:[],
				dirRecOffice:[],
				dirTaskFile:[],
				dirProcFile:[],
				zljbselect:[],
				imgInfo:null
			}
		},
		created(){
			this.handleDetailData();
			
		},
		methods: {
			async handleDetailData(){
				await this.initSelect()
				await this.directDetailFunc.then(res=>{
					this.handleData(JSON.parse(JSON.stringify(res)))
				})
			},
			initSelect(){
				return new Promise(reslove=>{
					api.api("post", api.configUrl + "/hczz/xtpz/zlsxpz/queryZlsxpzAll").then(res => {
						this.zljbselect = res;
						reslove()
					})
				})
			},
			handleData(val){
				this.dirInfo = val.zlxx;
				var res = this.zljbselect.filter(item=>{return item.id === this.dirInfo.zljb})
				this.dirInfo.zljb = !!res.length?res[0].zljblxmc:null
				this.dirRecOffice = this.handleFilter(val.zldwgl,'lx','1')
				this.dirCopyOffice = this.handleFilter(val.zldwgl,'lx','2')
				this.dirProcFile = this.handleFilter(val.attach,'type','1')
				this.dirTaskFile = this.handleFilter(val.attach,'type','2')
			},
			handleFilter(arr,key,value){
				return arr.filter(item=>{
					return item[key] == value
				})
			},
			handlePrev(val){
				api.upload(val)
			}
		}
	};
</script>
<style lang="less">
	.approval-detail-ct {
		th {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow:hidden;
			max-width: 165px;
		}
	}
</style>