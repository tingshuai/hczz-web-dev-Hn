<template>
	<div class="person">
		<div class="wholeContent padding-left-20 padding-right-20 clearfix">
			<Form ref="formDynamic" :model="formDynamic" inline class="searchForm">
				<FormItem label="视频名称：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.spmc" placeholder="请输入视频名称"></Input>
				</FormItem>
				<FormItem label="视频唯一名称：" :label-width="114">
					<Input type="text" clearable v-model.trim="formDynamic.yspwjmc" placeholder="请输入视频唯一名称"></Input>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
				<Button type="primary" class="searchBtn" @click="addModal">增加</Button>
			</Form>
			<div>
				<Table :loading="loading" stripe :columns="columns" :data="columnsData" :height="height" ref="table"></Table>
			</div>
			<div class="pagination-ct">
				<Page class="clientPage" :current="basePage.current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</div>
			<add-video :show="show" :sqid="sqid" :isStore="isStore" :formMore="formMore"  @update="update" @closeModalHandle="closeModalHandle" :videoId="videoId"></add-video>
			<Modal v-model="overDeterShow" title="确认删除" class="modal-ct"  :styles="{top: '250px',width:'250px'}" @on-cancel="overDeterShow=false">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="overDeterShow=false">取消</Button>
					<Button type="primary" class="sureBtn" @click="closeModal">确定</Button>
				</div>
				<div>
	                <h3>是否确认删除？</h3>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import addVideo from './addVideo';
	import {timestampToTime} from '@/libs/common/common';

	export default {
		components:{
			addVideo
		},
		data() {
			return {
				formMore: {		// 点击查看需要传入给弹窗的值
					spmc: '',	// 视频名称
					bz: '',		// 备注
				},
				formDynamic: {
					spmc: '',		// 视频名称
					yspwjmc: '',	// 视频唯一名称
				},
				isStore: false,	// 判断弹窗是查看状态还是编辑状态
				sqid: '',	// 新增、查询都需要的id值
				videoId: '',	// 视频ID值
				columns: [
					{
						title: '序号',
						align: 'center',
						type: 'index',
						minWidth: 100
					},
					{
						title: '视频名称',
						align: 'center',
						key: 'spmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '视频唯一名称',
						align: 'center',
						key: 'yspwjmc',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '备注',
						align: 'center',
						key: 'bz',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '创建人',
						align: 'center',
						key: 'cjr',
						ellipsis: true,
						minWidth: 100
					},
					{
						title: '创建时间',
						align: 'center',
						key: 'cjsj',
						ellipsis: true,
						minWidth: 100,
						render:(h,params)=>{
							return h('div',timestampToTime(params.row.cjsj))
						}
					},
					{
						title: '操作',
						key: 'operate',
						align: 'center',
						width: 100,
						render: (h, params) => {
							return h('div', [
								h('a', {
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.checkMore(params.row)
										}
									}
								}, '查看 '),
								h('a', {
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.checkDelet(params.row)
										}
									}
								}, '删除 ')
							])
						}
					}
				],
				columnsData: [],
				pageArray: [10, 20, 30],
				basePage: {
					current: 1,
					pageNumber: 1,
					pageSize: 10
				},
				total: 0,
				loading: false,
				height: 0,
				show: false,
				overDeterShow: false,
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.sqid = this.$route.query.id
				this.height = $(window).height() -$('.searchForm').height() - 400;
				this.render();
			})
		},
		methods: {
			// 数据初始化
			render() {
				this.loading = true;
				let pageraj = {};
				pageraj = {
					pagesize: this.basePage.pageSize,
					pageindex: this.basePage.pageNumber,
					spmc: this.formDynamic.spmc,
					yspwjmc: this.formDynamic.yspwjmc,
					sqid: this.sqid
				}
               	api.api('post', api.configUrl + '/hczz/gl/glsp/queryGlspList', pageraj).then(res=>{
				   	this.columnsData = res.list || [];
					
					// start 这是模拟的数据，需要去掉
					this.columnsData = [
						{
							id: '1',
							spmc: '模拟视频名称1',
							yspwjmc: '模拟视频唯一名称1',
							bz: '模拟备注1',
							cjr: '模拟创建人1',
							cjsj: 1544061771000
						},
						{
							id: '2',
							spmc: '模拟视频名称2',
							yspwjmc: '模拟视频唯一名称2',
							bz: '模拟备注2',
							cjr: '模拟创建人2',
							cjsj: 1544061771000
						}
					]
					// end 这是模拟的数据，需要去掉

               		this.total = res.total;
               		this.loading = false;
               	})
			},
			// 点击搜索按钮
			search() {
               this.render();
			},
			// 点击分页按钮
			pageChange(current) {
               this.basePage.current = current;
               this.basePage.pageNumber = current;
               this.render();
			},
			// 改变数据显示条数
			pageSizeChange(current) {
                this.basePage.pageSize = current;
                this.render();
			},
			// 更新 table 数据
			update(){
				this.closeModalHandle()
				this.render();
			},
			// 弹窗消失执行函数
			closeModalHandle() {
				this.show = false;
				this.videoId = '';
			},
			// 点击增加按钮
			addModal(){
				this.show = true;
				this.isStore = false;
				this.videoId = '';
			},
			// 点击查看按钮
			checkMore(data) {
				this.show = true;
				this.isStore = true;
				this.videoId = data.id;
				this.formMore = data;
			},
			// 点击删除
			checkDelet(data) {
				this.overDeterShow = true
				this.videoId = data.id
			},
			// 点击删除弹窗确定
			closeModal(){
				let that = this
				let videoId = this.videoId
				let columnsDatas = this.columnsData
				
				let asyncData = {
					dellst: [videoId]
				}

				api.api('post', api.configUrl + '/hczz/gl/glsp/deleteGlsp', asyncData, (error)=>{
					that.overDeterShow =  false;
				}).then(res=>{
					that.update()
					that.$Message.success('删除成功');
					that.overDeterShow =  false;
               	})
			}
		}
	}
</script>

<style lang="less" scoped>
	.ivu-modal-confirm-footer {
		text-align: center;
	}
	.ivu-table-tip {
		overflow-x: hidden;
	}
	.ivu-table-overflowX {
		overflow-x: hidden;
	}
</style>

