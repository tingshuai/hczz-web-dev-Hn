'
<template>
	<div class="task">
		<ul>
			<li v-for="(item,index) in dataList" :key="index">
				<div>
					<div :class="item.rwjb == 0 ? 'top' : item.rwjb ==1 ?'topone' : 'toptwo'" style="width: 100%;">

						<div class="leftTop">
							<i class="el-icon-caret-right" v-show="!item.flag" @click="setFlag(item)"></i>
							<i class="el-icon-caret-bottom" v-show="item.flag" @click="setFlag(item)"></i>
							<span class="roundOne" v-if="item.rwjb==0"></span>
							<span class="roundTwo" v-if="item.rwjb==1"></span>
							<span class="roundThree" v-if="item.rwjb==2"></span>
							<p type="primary" style="display: inline-block;">{{item.rwzt | taskZt}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; </p>
							<!--<p :title="item.rwnr" class="taskOverHidden text-overflow" style="display: inline-block;max-width: 137px;height: 16px;margin-right: 10px;white-space: nowrap;vertical-align: middle;">{{item.rwnr}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</p>-->
							<p class="timeSpan" style="display: inline-block;">派发时间 ：</p>
							<p class="timeSpan" style="display: inline-block;">{{item.cjsj | timestampToTime}}</p>
							<p v-if="item.rwjb!=0" style="display: inline-block;">&nbsp;&nbsp;|&nbsp;&nbsp;执行人:{{item.zxr}}</p>
						</div>
						<div class="right" style="display: inline-block;">
							<Button type="" @click="sign(item)" v-if="item.rwzt==1 && item.zxrid==accountId && zts<4">签收</Button>
							<Button type="" @click="feedback(item)" v-if="item.zxrid==accountId && item.rwzt>=2 && item.rwzt<4 && zts<4">反馈</Button>
							<Button type="" @click="newTask(item)" v-show="(item.rwjb==1 || item.rwjb==0) && item.zxrid==accountId &&  item.rwzt>=2&&item.rwzt<4 && zts<4">新增下级任务</Button>
							<Button type="" @click="over(item)" v-show="item.rwjb==0 && item.zxrid==accountId &&item.rwzt<4">结束研判</Button>
							<Button type="" @click="additionalBtn(item)" v-if="item.zxrid==accountId">补录分配</Button>
						</div>
					</div>
					<div :class="item.rwjb == 0 ? 'content' : item.rwjb ==1 ?'contentone' : 'contenttwo'" v-show="item.flag">
                        <p style="float: left;">任务内容：</p>
						<p style="word-break: break-word;margin-left: 80px;">{{item.rwnr}}</p>
					</div>
					<div class="footer" v-show="item.flag">
						<Form :label-width="80" v-for="(feedItem,feedIndex) in item.feedback" :key="feedIndex">
							<div class="tableStyle">
								<table border="1" cellspacing="0">
									<tr>
										<th :colspan="3">
											<FormItem label="反馈内容：">
												<p class="text-overflow" :title="feedItem.fknr">{{feedItem.fknr}}</p>
											</FormItem>
										</th>
									</tr>
									<tr>
										<th>
											<FormItem label="反馈人：">
												<p>{{feedItem.zxr}}</p>
											</FormItem>
										</th>
										<th>
											<FormItem label="反馈时间：">
												<p>{{feedItem.fksj | timestampToTime}}</p>
											</FormItem>
										</th>
										<th>
											<FormItem label="附件：" style="white-space: initial;">
												<a v-for='(item,index) in feedItem.attach' @click="handlePrev(item)" :key="index">
													<span><svg-icon name='picIcon'></svg-icon>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
												</a>
											</FormItem>
										</th>
									</tr>
								</table>
							</div>
						</Form>
					</div>
				</div>
				<div v-if="item.children && item.children.length>0" v-show="item.flag">
					<my-task :taskList="item.children" :zt="zts"></my-task>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import { timestampToTime } from '@/libs/common/common';
	import api from '@/fetch/api.js';
	export default {
		name: 'my-task',
		props: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
			taskList: {
				type: Array,
				default: () => {
					return []
				}
			},
			zt:{
					type:String,
					default:''
			}
		},
		data() {
			return {
				height:'',
				dataList: this.taskList,
				rwzt: '',
				carNum: null,
				regCp: null,
				hzNum: null,
				zts:this.zt,
				isBoff:false
			}
		},
		computed: {
			accountId() {
				return window.localStorage.getItem('userId')
			}
		},
		mounted(){
			this.height = $(window).height()  - 368 + 'px';
			window.onresize = () => {
				this.height = $(window).height() - 368 + 'px';
     		 }
		},
		watch: {
			taskList(val) {
				this.dataList = val;
				this.dataList[0].flag=this.isBoff;
			},
			zt(val){
				this.zts=val;
			}
		},
		updated(){
			this.dataList=this.dataList;
		},
		methods: {
			//利用store记录每一条的状态，每次先清空，然后保存这一条数据，保证连续点击也会生效
			sign(item) {
				this.$store.commit('setTaskItemSign', '')
				this.$store.commit('setTaskItemSign', item)
			},
			feedback(item) {
				this.$store.commit('setTaskItemFeedback', '')
				this.$store.commit('setTaskItemFeedback', item)
			},
			newTask(item) {
				this.$store.commit('setTaskItemAdd', '')
				this.$store.commit('setTaskItemAdd', item)
			},
			over(item) {
				this.$emit('over', item)
			},
			additionalBtn(item) {
				this.$store.commit('setTaskItemAdditional', '');
				this.$store.commit('setTaskItemAdditional', item);
			},
			careBtn(item, e) {
				let self = this;
				let regSfz = /[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/g;
				let regCp = /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}/g;
				let regHz = /[a-zA-Z0-9]{3,21}/g;
				self.carNum = item.rwnr.match(regCp);
				self.idCard = item.rwnr.match(regSfz);
				self.hzNum = item.rwnr.match(regHz);
				if(self.carNum || self.idCard || self.hzNum) {
					let cc = {
						item: item,
						x: e.clientY,
						y: e.clientX,
						carNum: self.carNum,
						idCard: self.idCard,
						hzNum: self.hzNum
					}
					this.$store.commit('setTaskObj', cc)
				}
			},
			setFlag(item){
				item.flag=!item.flag;
				this.isBoff = item.flag;
			},
			handlePrev(val) {
				api.upload(val)
			}
		}
	}
</script>

<style lang="less" scoped>
	.task {
		height: 100%;
		padding: 10px 0;
		.taskOverHidden {
			display: inherit;
		}
		ul {
			list-style: none;
			margin: 0 16px !important;
			border: 1px solid #e6e6e6;
			overflow: auto;
			height: 100%;			
			li {
				background: white;
				padding: 0 16px 10px 16px !important;
				.top {
					position: relative;
					padding-bottom: 12px;
					display: inline-block !important;
					overflow: hidden;
					padding-top: 10px !important;
					.leftTop {
						display: inline-block !important;
						float: left;
						i {
							font-size: 18px;
						}
						span {
							color: #333333;
						}
						.timeSpan {
							color: #6c6c6c;
						}
						.roundOne {
							width: 16px;
							height: 16px;
							display: inline-block;
							border-radius: 50%;
							background: #3d8cf7;
						    vertical-align: middle;

						}
						.roundTwo {
							width: 16px;
							height: 16px;
							display: inline-block;
							border-radius: 50%;
							background: #95d988;
						}
						.roundThree {
							width: 16px;
							height: 16px;
							display: inline-block;
							border-radius: 50%;
							background: orange;
						}
					}
					.right {
						position:absolute;
						right: 0;
						display: inline-block !important;
						button{
							color:#333333;
							font-weight: 600;
							margin-left: 7px;
						}

					}
				}
				.content {
					margin: 5px 0 10px 0;
					.ivu-form-item {
						margin-bottom: 0px;
						label {
							color: #333333;
						}
						.ivu-form-item-content {
							span {
								color: #333333;
								height: 32px;
								/*display: inline-block;*/
								line-height: 32px;
								font-family: "microsoft yahei";
							}
						}
					}
				}
				.footer {
				// 	overflow-y: auto;
				//    height: calc(100%-200px);

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
		
	.topone{
		display: flex;
		width: 100%;
		padding-top: 10px;
		justify-content: space-between;
		align-items: center;
		.leftTop {
			display: inline-block !important;
			width:calc(~'100% - 180px')
			.roundTwo{
				width: 16px;
				height: 16px;
				display: inline-block;
				border-radius: 50%;
				background: #95d988;
				vertical-align: middle;
			}
			.right{
				width: 150px;
			}
		}
	}
	.toptwo{
		display: inline-block;
		padding-top: 10px !important;
		.leftTop{
			display:inline-block;
			.roundThree{
				width: 16px;
				height: 16px;
				display: inline-block;
				border-radius: 50%;
				background: #d1b4e5;
				vertical-align: middle;
			}
		}
		.right{
			display: inline-block;
		}
	}
	.contentone{
		padding-top: 10px;
		.ivu-form-item{
			margin-bottom: 12px;
		}
	}
	.contenttwo{
		padding-top: 5px;
		.ivu-form-item{
			margin-bottom: 0;
		}
	}
</style>