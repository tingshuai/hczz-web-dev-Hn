<template>
	<el-dialog class="modal-ct workBench-group-modal" title="流程轨迹" @close='closeModel' :visible.sync="lcvisible" :modal-append-to-body='false' width="900px">
		<div>
			<div class="clearfix tableStyle">
				<step :list="directFlow.clrzList"></step>
			</div>
		</div>
		<div slot="footer" class="font-size-0">
			<Button type="primary" class="cancelBtn" @click="cancelBtn">关闭</Button>
		</div>
	</el-dialog>
</template>
<script>
	import api from '@/fetch/api.js';
	import step from '@/views/main-components/step/step.vue';
	export default {
		components:{step},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			lcgjFnc: {
				type: Promise
			}
		},

		data() {
			return {
				lcvisible: this.show,
				directFlow: [],
				isSoon: false,
                officeName:''
			};
		},
		mounted() {
			this.lcgjFnc.then(res => {
				this.directFlow = res;
				this.getInfo(res.nextId);
				this.directFlow.clrzList.forEach(item=>{
					api.api('get',api.systemUrl+'/account/info/detail?id='+item.zxrid).then(result=>{
						this.$set(item,'officeName',result.officeName)
					})
				})
			})
		},
		computed: {
			isScroll() {
				return this.directFlow.length > 3;
			}
		},
		watch: {
			show() {
				this.lcvisible = this.show;
			}
		},
		methods: {
			closeModel() {
				this.$emit("update:show", false);
			},
			cancelBtn() {
				this.show = false;
			},
			getInfo(val){
				api.api('get',api.systemUrl+'/account/info/detail?id='+val).then(res=>{
					this.officeName=res.officeName;
				})
			}
		}
	};
</script>
<style lang="less" scoped>
  .step{
  	height: 370px;
  }
</style>