<template>
	<div class="zgzjDiv">
		<h3 class="text-align">战果总结</h3>
		<p class="text-align" style="margin-top: 20px;">总结时间：{{zgzj.czsj|timestampToTime}}</p>
		<div style="word-wrap: break-word;margin-top: 20px;" v-html="zgzj.zgnr"></div>
		<div class="text-align-right margin-right-20 btn">
			<Button @click="cancel">关闭</Button>
			<Button @click="edit" type="primary" v-if="type==2">编辑</Button>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api.js';
	export default {
		data() {
			return {
				columnsDataone: [],
				zgzj: {}
			}
		},
		computed: {
			ids() {
				return this.$route.query.id
			},
			type(){
				return this.$route.query.type
			}
		},
		mounted() {
			this.getZgzjContent();
		},
		methods: {
			getZgzjContent() {
				let obj = {
					sqid: this.ids,
				}
				api.api('post', api.configUrl + '/hczz/hc/zg/getZgzj', obj).then(res => {
					this.zgzj = res;
					//					UE.getEditor('ccc').setContent(res.zgnr)
				})
			},
			cancel() {
				this.$router.back(-1);
			},
			edit() {
				this.$router.push({
					path: '/ueditor',
					query: {
						sqid: this.ids,
						type:'2',
						id:this.zgzj.id,
						content:this.zgzj.zgnr
					}
				})
			}
		}
	};
</script>

<style lang="less">
	.zgzjDiv {
		padding: 20px;
		background: #fff;
		height: 100%;
		position: relative;
		.btn {
			position: absolute;
			bottom: 20px;
			right: 0;
		}
	}
</style>