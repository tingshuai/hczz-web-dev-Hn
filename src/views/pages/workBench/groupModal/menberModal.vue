<template>
	<div class="role-select-ct">
		<div>
			<Form ref="leaderForm" :model="leaderForm" inline :label-width="40">
				<FormItem label="名称">
					<Input type="text" v-model="leaderForm.name" placeholder="请输入名称" clearable></Input>
				</FormItem>
				<FormItem label="部门">
					<Input type="text" v-model="leaderForm.dep" placeholder="请输入部门" clearable></Input>
				</FormItem>
				<Button type="primary" @click="search">查询</Button>
			</Form>
		</div>
		<div class="select-btn-ct">
			<Button type="primary" @click="addMenber">添加组员</Button>
		</div>
		<div>
			<Table :columns="columns" :data="data" height="200"></Table>
		</div>
	</div>
</template>
<script>
	import api from '@/fetch/api';
	export default {
		props:{
			zaid:{
				type:String,
				default:null
			}
		},
		data() {
			return {
				data: [],
				leaderForm: {
					name: null,
					dep: null
				},
				menberForm: {
					name: null,
					dep: null
				},
				columns: [
					{
						title: "头像",
//						key: "zp",
						align: "center",
						render: (h, params) => {
							if(params.row.zp){
								return h('div', [
									h('img', {
										attrs: {
											src: api.systemUrl + "/imageManage/findImageByImgPath?imgPath=" + params.row.zp +"&login=admin",
											width:'45',
											height:'45'
										}
									})
								])
							}else{
								return h('div', [
									h('img', {
										attrs: {
											src: require("@/images/icon_user.png"),
											width:'45',
											height:'45'
										}
									})
								])
							}
						}
					},
					{
						title: "名称",
						align: "center",
						key: "xm"
					},
					{
						title: "部门",
						align: "center",
						key: "officename"
					},
					{
						title: '操作',
						key: 'operate',
						align: 'center',
						width: 160,
						render: (h, params) => {
							return h('div', [
								h('a', {
									on: {
										click: () => {
											this.cancelBtn(params.row)
										}
									}
								}, '删除  ')
							])
						}
					}
				]
			};
		},
		mounted() {
			this.initTable();
		},
		methods: {
			addMenber() {
				this.$emit('addMenber')
			},
			cancelBtn(row) {
				let thczzzazxx = {
					zaid: row.zaid,
					userid: row.userid,
					zylx: '2'
				}
				api.api('post', api.configUrl + '/hczz/zaz/deleteZazxx', thczzzazxx).then(res => {
					this.initTable()
				})
			},
			initTable() {
				let obj = {
					zaid: this.zaid,
					xm: this.leaderForm.name,
					officename: this.leaderForm.dep
				}
				api.api('post', api.configUrl + '/hczz/zaz/getZazZyDetail', obj).then(res => {
					this.data = res;
				})
			},
			search() {
				this.initTable()
			}
		}
	};
</script>
<style lang="less" scoped>
	.role-select-ct {
		.ivu-form {
			padding-bottom: 0px;
			.button-ct {
				float: right;
			}
			.ivu-form-item {
				margin-left: 0px;
				padding-bottom: 0px;
			}
		}
		.select-btn-ct {
			padding-bottom: 14px;
			button {
				margin-right: 16px;
			}
		}
	}
</style>