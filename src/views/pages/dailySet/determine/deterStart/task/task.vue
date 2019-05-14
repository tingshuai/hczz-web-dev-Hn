'
<template>
	<div class="task">
		<ul>
			<li v-for="(item,index) in dataList" :key="index">
				<div>
					<!-- <div :class="'top'+ item.rwjb"> -->
					<div :class="item.rwjb == 0 ? 'top' : item.rwjb ==1 ?'topone' : 'toptwo'" style="width: 100%;">
						<div class="leftTop">
							<i class="el-icon-caret-right" v-if="!item.flag" @click="setFlag(item)"></i>
							<i class="el-icon-caret-bottom" v-if="item.flag" @click="setFlag(item)"></i>
							<!--<span class="roundOne" v-if="item.rwjb==0"></span>
							<span class="roundTwo" v-if="item.rwjb==1"></span>
							<span class="roundThree" v-if="item.rwjb==2"></span>-->
							<p type="primary" style="display: inline-block;">{{item.rwzt | taskZt}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; </p>
							<!--<p :title="item.rwnr" class="taskOverHidden text-overflow" style="display: inline-block;max-width: 137px;height: 16px;margin-right: 10px;white-space: nowrap;vertical-align: middle;">{{item.rwnr}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</p>-->
							<p class="timeSpan" style="display: inline-block;">1 ：</p>
							<p class="timeSpan" style="display: inline-block;">{{item.cjsj | timestampToTime}}</p>
							<p v-if="item.rwjb!=0" style="display: inline-block;">&nbsp;&nbsp;|&nbsp;&nbsp;执行人:{{item.zxr}}</p>
						</div>
						<div class="right" style="display: inline-block;">
							<Button type="" @click="sign(item)" v-if="item.rwzt==1 && item.zxrid==accountId && zts<4">签收2</Button>
							<Button type="" @click="feedback(item)" v-if="item.zxrid==accountId && item.rwzt>=2 && item.rwzt<4 && zts<4">反馈2</Button>
							<Button type="" @click="newTask(item)" v-show="(item.rwjb==1 || item.rwjb==0) && item.zxrid==accountId &&  item.rwzt>=2&&item.rwzt<4 && zts<4">新增下级任务</Button>
							<Button type="" @click="over(item)" v-show="item.rwjb==0 && item.zxrid==accountId &&item.rwzt<4">结束研判</Button>
							<Button type="" @click="additionalBtn(item)" v-if="item.zxrid==accountId">补录分配</Button>
						</div>
					</div>
					<!-- <div :class="'content' +item.rwjb" v-show="item.flag"> -->
					<div :class="item.rwjb == 0 ? 'content' : item.rwjb ==1 ?'contentone' : 'contenttwo'" v-show="item.flag">
						<p style="float: left; padding-left:17px;">任务内容：</p>
						<p style="word-break: break-word;margin-left: 80px;">{{item.rwnr}}</p>
						<!--<Form :label-width="80">
							<FormItem label="任务内容：">
								<span @contextmenu.prevent="careBtn(item,$event)" class="taskOverHidden text-overflow" :title="item.rwnr">{{item.rwnr}}</span>
							</FormItem>
						</Form>-->
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
												<a v-for='(items,indexs) in feedItem.attach' @click="handlePrev(items)" :key="indexs">
													<span><svg-icon name='picIcon'></svg-icon>{{items.filename+"."+items.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
				dataList: this.taskList,
				rwzt: '',
				carNum: null,
				regCp: null,
				hzNum: null,
				isBoff: null,
				zts:this.zt
			}
		},
		computed: {
			accountId() {
				return window.localStorage.getItem('userId')
			}
		},
		watch: {
			taskList(val) {
				
				/*
				  由于每次点击 反馈、新增下级任务这两个按钮导致这个函数每次都执行7次
				  所以出现 this.dataList = val 多次赋值
				  导致待反馈本来的展开状态被破坏
				  所以通过声明 isBoff 变量保存待反馈展开状态，并重新赋值
				*/
				this.dataList = val;
				this.dataList[0].flag=this.isBoff;
			},
			zt(val){
				this.zts=val;
			}
		},
		mounted() {},
		methods: {
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
				this.$emit('additionalBtn', item)
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
			setFlag(item) {
				item.flag = !item.flag
				this.isBoff = item.flag
			},
			handlePrev(val) {
				api.upload(val)
			}
		}
	}
</script>

<style lang="less" scoped>
	.task {
		.taskOverHidden {
			display: inherit;
		}
		ul {
			list-style: none;
			margin: 0 16px !important;
			border: 1px solid #e6e6e6;
			li {
				background: white;
				// margin-bottom: 18px;
				padding: 0 16px 10px 16px !important;
				.top {
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
						float: right;
						width: 356px;
						display: inline-block !important;
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
					table {
						width: 100%;
						margin-bottom: 20px;
						.ivu-form-item {
							margin-bottom: 0;
						}
					}
				}
			}
		}
	}
	
	.topone {
		display: inline-block !important;
		width: 100%;
		padding-top: 10px;
		.leftTop {
			display: inline-block !important;
			width:calc(~'100% - 180px') .roundTwo {
				width: 16px;
				height: 16px;
				display: inline-block;
				border-radius: 50%;
				background: #95d988;
				vertical-align: middle;
			}
			.right {
				width: 150px;
			}
		}
	}
	
	.toptwo {
		display: inline-block;
		padding-top: 10px !important;
		.leftTop {
			display: inline-block;
			.roundThree {
				width: 16px;
				height: 16px;
				display: inline-block;
				border-radius: 50%;
				background: #d1b4e5;
				vertical-align: middle;
			}
		}
		.right {
			display: inline-block;
		}
	}
	
	.contentone {
		padding-top: 10px;
		padding-bottom: 5px;
		.ivu-form-item {
			margin-bottom: 12px;
		}
	}
	
	.contenttwo {
		padding-top: 5px;
		.ivu-form-item {
			margin-bottom: 0;
		}
	}
</style>