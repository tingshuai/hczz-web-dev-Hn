'
<template>
	<div class="task" :style="{height:height}">
		<ul>
			<li v-for="(item,index) in dataList" :key="index">
				<div>
					<div>
						<div class="leftTop" style="width: calc(100% - 220px);display: inline-block;">
							<el-button size="small" style="background: orange;" v-if="item.zt==1">待签收</el-button>
							<el-button size="small" style="background: orange;" v-else-if="item.zt==2">待反馈</el-button>
							<el-button size="small" style="background: green;" v-else>已反馈</el-button>
							<span>{{item.jzjc}}协查</span>
						</div>
						<div class="right" style="display: inline-block;width: 200px;" v-if="sqxx.zt<4">
							<Button type="" @click="sign(item)" v-if="item.zt==1 && item.isJz">签收</Button>
							<Button type="" @click="feedback(item)" v-if="item.zt != 1 && item.isFk">反馈</Button>
						</div>
					</div>
					<div>

						<Form :label-width="80">
							<FormItem label="任务内容：">
								<p @click="lookDetail(item)">点击查看任务详情</p>
							</FormItem>
							<FormItem label="派发时间：">
								<p>{{sqxx.sqrq | timestampToTime}}</p>
							</FormItem>
						</Form>
					</div>
					<div class="footer">
						<Form :label-width="80" v-for="(item,index) in item.fkList" :key="index">
							<div class="tableStyle">
								<table border="1" cellspacing="0">
									<tr>
										<th :colspan="3">
											<FormItem label="反馈内容：">
												<p style="word-break: break-all;overflow: hidden;text-overflow: ellipsis;">{{item.fknr}}</p>
											</FormItem>
										</th>
									</tr>
									<tr>
										<th>
											<FormItem label="反馈人：">
												<p>{{item.zxr}}</p>
											</FormItem>
										</th>
										<th>
											<FormItem label="反馈时间：">
												<p>{{item.fksj | timestampToTime}}</p>
											</FormItem>
										</th>
										<th>
											<FormItem label="附件：">
												<i class="el-icon-document" v-show="item.fjList.length>0" style="color:#1890ff;"></i>
												<span style="color:#1890ff;cursor:pointer;" v-for="(fjItem,index) in item.fjList" @click="handlePrev(fjItem)" :key="index">{{fjItem.filename}}.{{fjItem.category}}</span>
											</FormItem>
										</th>
									</tr>
								</table>
							</div>
						</Form>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import { timestampToTime } from '@/libs/common/common'
	export default {
		name: 'my-task',
		props: {
			taskList: {
				type: Array,
				default: () => {
					return []
				}
			},
			sqxx:{
				type:Object
			}
		},
		data() {
			return {
				height:'',
				dataList: this.taskList,//研判list
			}
		},
		computed: {
			accountId() {
				return window.localStorage.getItem('userId')
			}
		},
		watch: {
			taskList(val) {
				this.dataList = val;
			}
		},
		mounted(){
			this.height = $(window).height()  - 368 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - 368 + 'px';
     		 }
		},
		updated(){
			this.dataList=this.dataList;
		},
		methods: {
			lookDetail(item){
				this.$emit('lookDetail',item)
			},
			sign(item) {
				this.$emit('sign',item)
			},
			feedback(item) {
				this.$emit('feedback',item)
			},
			handlePrev(val) {
				api.upload(val)
			}
		}
	}
</script>

<style lang="less" scoped>
	.task {
		overflow-y: auto;
		ul {
			list-style: none;
			margin: 0 16px !important;
			border: 1px solid #e6e6e6;
			li {
				background: white;
				padding: 20px 16px 10px 16px !important;
				.leftTop{
					button{
						color: white;
						border-radius: 20px;
					}
				}
				.right{
					button{
						color: #333333;
						font-weight: 600;
					}
					
				}
				.ivu-form-item{
					margin-bottom: 0;
				}
				.footer {
					table {
						width: 100%;
						margin-bottom: 20px;
						.ivu-form-item{
							margin-bottom: 0;
						}
					}
				}
			}
		
		}
		
		
	}
</style>