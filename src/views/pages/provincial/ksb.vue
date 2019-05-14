<template>
	<div class="bodyWrap" style="overflow-y: auto;background:#fff">

		<!--上部右侧部分-->
		<div style="clear:both">
			<div class="lcTop">
				<div class="startJ">
					<!--开始标记-->
					<div style="color:#4fbf39">
						开始
					</div>
					<i class="startX" style="margin-left:5px"></i>
				</div>
				<ul class="lcTopUl">
					<li class="sprLi">

						<div class="lcInfo-t cl ks-spr" style="height: 80px; padding:15px 10px 0; border-radius: 8px 8px 0 0;">
							<img src="../../../images/ksh/img_p_two.png" class="fl">
							<div class="fl zdInfo" style="padding-top:5px;">
								<p :title="fqr.zxr" class="whiteColor">{{fqr.zxr}}</p>
								<p :title="fqr.bmmc" class="whiteColor">{{fqr.officeName}}</p>
							</div>
						</div>

						<div class="lcInfo-b lcInfo-c" style="padding:0 10px">
							<p title="发起任务" class="whiteColor">发起请求协查</p>
							<p :title="fqr.czsj" class="whiteColor">{{fqr.czsj | timestampToTime}}</p>
						</div>
						<i class="right-x"></i>
					</li>
				</ul>
			</div>
			<div class="top-right xwbg topright" ref="topright" id="ab" style="margin-top: -17px;position: absolute;left:387px;">
				<!-- <div class="top-rightone path-flow-ct" style="max-width:550px; min-height: 173px;" :style="sprList.length!=2 ? 'padding-right:16px' :((sprList.length === 0)  ? 'min-width: 550px': '') "> -->
				<div class="top-rightone path-flow-ct" style="max-width:550px; min-height: 173px;" :style="sprList.length===0 ? 'min-width:500px' :((sprList.length !=2 )  ? 'padding-right:16px': '') ">

					<el-scrollbar v-if="sprList.length >0" tag="ul" ref="scrollbar" wrap-class="el-scrollbar__wrap" view-class="el-scrollbar__view" :class="{'scrollbar-path-flow':isScrolltop}" class="path-flow">
						<li class="box" v-for="(item,index) in sprList" :key="index" style="background:#f9f8f9;display:block" :style="sprList.length == 1 ?'margin:0 auto':''">
							<div class=" flow-step-ct" style="display: inline-block;" :style="{background:!item.czlx.includes('待审批')?'#fff':'f9f8f9',color:!item.czlx.includes('待审批')?'#5b5b5b':'#5b5b5b'}">
								<div class="newdiv" :style="{background:!item.czlx.includes('待审批')>0?'#5b5b5b':'#fff'}">
									<img src="../../../images/ksh/img_p_two.png" class="fl">
									<div class="fl zdInfo calcWidth">
										<p :style="{color:!item.czlx.includes('待审批')?'#fff':'#5b5b5b'}">{{item.zxr}}</p>
										<p :style="{color:!item.czlx.includes('待审批')?'#fff':'#5b5b5b'}">{{item.officeName}}</p>
									</div>
								</div>
								<div class="newdata lcInfo-c">
									<p :style="{color:!item.czlx.includes('待审批')?'#5b5b5b':'#5b5b5b'}" title="审批">{{item.czlx}}</p>
									<p :style="{color:!item.czlx.includes('待审批')?'#5b5b5b':'#5b5b5b'}" :title="item.czsj">{{item.czsj|timestampToTime}}</p>
								</div>
							</div>
						</li>
					</el-scrollbar>
					<li v-if="sprList.length == 0" class="box" style="margin-left:23%">
						<div class=" flow-step-ct" style="display: inline-block;" >
							<div class="newdiv">
								<img src="../../../images/ksh/img_p_two.png" class="fl">
								<div class="fl zdInfo calcWidth">
									<p >{{bmmcname}}</p>
								</div>
							</div>
							<div class="newdata lcInfo-c">
								<p>待审批</p>
							</div>
						</div>
					</li>
				</div>
				<i class="right-x" style="top: 93px;" v-if="noAgree"></i>
				<span class="noAgree-box" v-if="noAgree">
						<span class="end">结束</span>
				</span>
			</div>
		</div>

		<!--签收反馈-->
		<div>
			<div class="qsDiv " :style="{position:'absolute','left':dvalue+'px'}" v-if="!noAgree">
				<div class="qsdivone path-flow-ct" style="display:block">
					<i class="bottom-x"></i>
					<el-scrollbar tag="ul" v-if="qsList.length == 2" ref="scrollbar" wrap-class="el-scrollbar__wrap" view-class="el-scrollbar__view" :class="{ 'scrollbar-path-flow':isScroll}" class="path-flow">
						<li class="bottom-recive" v-for="(item,index) in qsList" :key="index" :style="sprList.length == 1 ?'margin:0 auto':''">
							<div class="recive flow-step-ct" style="display:block;" :style="{background:item.zxr?'#fff':'f9f8f9',color:item.zxr?'#5b5b5b':'#5b5b5b'}">
								<div class="lcInfo-t qs-spr newdiv" :style="{background:item.zxr?'#fff':'f9f8f9',color:item.zxr?'#5b5b5b':'#5b5b5b'}">
									<img src="../../../images/ksh/img_p_two.png" class="fl">
									<div class="calcWidth fl">
										<p :style="{color:item.zxr?'#5b5b5b':'#5b5b5b'}">{{item.zxr}}</p>
										<p :style="{color:item.zxr?'#5b5b5b':'#5b5b5b'}">{{item.bmmc}}</p>
									</div>
								</div>

								<div class="newdata lcInfo-c">
									<p :style="{color:item.zxr?'#5b5b5b':'#5b5b5b'}" :title="item.czlx">{{item.czlx}}</p>
									<p :style="{color:item.zxr?'#5b5b5b':'#5b5b5b'}" title="item.czsj">{{item.czsj | timestampToTime}}</p>
								</div>
							</div>
						</li>
					</el-scrollbar>
					<el-scrollbar tag="ul" v-if="qsList.length == 1" ref="scrollbar" wrap-class="el-scrollbar__wrap" view-class="el-scrollbar__view" :class="{ 'scrollbar-path-flow':isScroll}" class="path-flow">
						<li class="bottom-recive" v-for="(item,index) in qsList" :key="index">
							<div class="recive flow-step-ct" style="display:block;" :style="{background:item.zxr?'#fff':'f9f8f9',color:item.zxr?'#5b5b5b':'#5b5b5b'}">
								<div class="lcInfo-t qs-spr newdiv" :style="{background:item.zxr?'#fff':'f9f8f9',color:item.zxr?'#5b5b5b':'#5b5b5b'}">
									<img src="../../../images/ksh/img_p_two.png" class="fl">
									<div class="calcWidth fl">
										<p :style="{color:item.zxr?'#5b5b5b':'#5b5b5b'}">{{item.zxr}}</p>
										<p :style="{color:item.zxr?'#5b5b5b':'#5b5b5b'}">{{item.bmmc}}</p>
									</div>
								</div>

								<div class="newdata lcInfo-c">
									<p :style="{color:item.zxr?'#5b5b5b':'#5b5b5b'}" :title="item.czlx">{{item.czlx}}</p>
									<p :style="{color:item.zxr?'#5b5b5b':'#5b5b5b'}" title="item.czsj">{{item.czsj | timestampToTime}}</p>
								</div>
							</div>
						</li>
						<li class="bottom-recive" v-if="qsList.length == 1">
							<div class="recive flow-step-ct" style="display:block;">
								<div class="lcInfo-t qs-spr newdiv" >
									<img src="../../../images/ksh/img_p_two.png" class="fl">
									<div class="calcWidth fl">
										<p>{{bmmcname}}</p>
									</div>
								</div>
								<div class="newdata lcInfo-c">
									<p >待反馈</p>
								</div>
							</div>
						</li>
					</el-scrollbar>
					<li class="bottom-recive" v-if="qsList.length == 0" :style="sprList.length == 1 ?'margin:0 auto':''">
							<div class="recive flow-step-ct" style="display:block;">
								<div class="lcInfo-t qs-spr newdiv" >
									<img src="../../../images/ksh/img_p_two.png" class="fl">
									<div class="calcWidth fl">
										<p>{{bmmcname}}</p>
									</div>
								</div>

								<div class="newdata lcInfo-c">
									<p style="width:208px">待签收</p>
								</div>
							</div>
					</li>
					<li class="bottom-recive" v-if="qsList.length == 0" :style="sprList.length == 1 ?'margin:0 auto':''">
							<div class="recive flow-step-ct" style="display:block;">
								<div class="lcInfo-t qs-spr newdiv" >
									<img src="../../../images/ksh/img_p_two.png" class="fl">
									<div class="calcWidth fl">
										<p>{{bmmcname}}</p>
										
									</div>
								</div>

								<div class="newdata lcInfo-c">
									<p >待反馈</p>
								</div>
							</div>
						</li>
				</div>
			
			</div>
		</div>
		<div>
			<!--评价-->
			<div class="bottom-w clear  pjDiv" :style="{position:'absolute','left':dvalue2+'px'}" v-if="!noAgree">
				<div class="bottom-wone">
					<i class="bottom-x"></i>
					<li v-if="pjList.length == 0">
						<div class="lcInfo-t newdiv">
						<img src="../../../images/ksh/img_p_two.png" class="fl">
						<div class="calcWidth fl zdInfo">
							<p :style="{color:pjList.length?'#5b5b5b':'#5b5b5b'}">{{fqr.zxr}}</p>
							<p :style="{color:pjList.length?'#5b5b5b':'#5b5b5b'}">{{fqr.bmmc}}</p>
						</div>
						</div>
						<div class="newdata lcInfo-c">
							<p :style="{color:pjList.length?'#5b5b5b':'#5b5b5b'}" title="评价">待评价</p>
							<p v-show="pjList!=0" :style="{color:pjList.length?'#5b5b5b':'#5b5b5b'}" title="pjrq.czsj">{{fqr.czsj | timestampToTime}}</p>
						</div>
					
					
						<i class="bottom-x" style="top: 175px;"></i>
						<span class="end-box" :style="{background:pjList.length?'green':'#dcdcdc'}">
							<span class="end">结束</span>
						</span>
					</li>
					<li v-if="pjList.length > 0" v-for="(item,index) in pjList" :key="index">
						<div class="lcInfo-t newdiv">
						<img src="../../../images/ksh/img_p_two.png" class="fl">
						<div class="calcWidth fl zdInfo">
							<p :style="{color:pjList.length?'#5b5b5b':'#5b5b5b'}">{{item.zxr}}</p>
							<p :style="{color:pjList.length?'#5b5b5b':'#5b5b5b'}">{{item.bmmc}}</p>
						</div>
						</div>
						<div class="newdata lcInfo-c">
							<p :style="{color:pjList.length?'#5b5b5b':'#5b5b5b'}" title="评价">评价</p>
							<p :style="{color:pjList.length?'#5b5b5b':'#5b5b5b'}" title="pjrq.czsj">{{item.czsj | timestampToTime}}</p>
						</div>
					
					
						<i class="bottom-x" style="top: 175px;"></i>
						<span class="end-box" :style="{background:pjList.length?'green':'#dcdcdc'}">
							<span class="end">结束</span>
						</span>
					</li>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import api from '@/fetch/api.js';
	import $ from 'jquery';
	export default {
		data() {
			return {
				dvalue: '', //第二层
				dvalue1: '', //第三层
				dvalue2: '', //研判层
				height: 0,
				inputStyWidth: '',
				topright: '',
				leftsize: 0,
				fqr: {}, //发起人
				sprList: [], //审批人数组
				qsList: [], //签收数组
				jsypList: [], //解释呢研判
				pjList: [], //评价数组
				sqxxDetail: [], //整个审批流程数组
				directFlow: [],
				noAgree: false, //不通过
				bmmcname:''//部门名称

			}
		},

		computed: {
			bmmc(){
				return this.$route.query.bmmc
			},
			id() {
				return this.$route.query.id
			},
			isScroll() {
				return this.qsList.length > 2;
			},
			isScrolltop() {
				return this.sprList.length > 2;
			},
			zt() {
				return this.$route.query.zt
			}
		},
		mounted() {
			this.bmmcname=this.$route.query.bmmc 
			console.log(this.$route.query.bmmc,"^^^^^^^")
			console.log(this.bmmcname,"^^^^^^^1")

			this.$nextTick(() => {
				this.getSqxxDetail();
				setTimeout(() => {
					let qsWidth = $('.qsDiv').css('width').split('px')[0] - 0;
					let abWidth = $('#ab').css('width').split('px')[0] - 0;
					if(this.sprList.length == 1) {
						this.dvalue = 346;
						if(this.qsList.length == 1) {
							this.dvalue = 351;
							this.dvalue2 = 478;
						} else {
							this.dvalue = 346;
							this.dvalue2 = 492;
						}
					} else {
						if(this.qsList.length == 1) {
							this.dvalue = 464 + (abWidth - qsWidth) / 4 + 46;
							this.dvalue2 = 464 + (abWidth - qsWidth) / 4 + 146;
						} else {
							this.dvalue = 464;
							this.dvalue2 = 609;
						}
						this.dvalue1 = 464 + (abWidth - qsWidth) / 4 + 46
					}

				}, 500)

			})
		},
		created() {
			this.$nextTick(() => {
				this.height = document.querySelectorAll('.xwbg')[0].clientWidth
			})
		},
		methods: {
			async handleFlowData() {
				await this.directFlowFunc.then(res => {
					this.directFlow = JSON.parse(res.split('/')[0]);
					if(this.directFlow[this.directFlow.length - 1].czlx.includes('待审批')) {
						this.isSp = true;
					} else {
						this.isSp = false;
					}
					this.zt = res.split('/')[1];
				})
				this.handleData()
			},
			getSqxxDetail() {
				api.api('get', api.configUrl + '/hczz/qqxc/getFlow/' + this.id, {
					type: '2'
				}).then(res => {
					this.sqxxDetail = res.clrzList;
					this.fqr = this.sqxxDetail.filter(item => {
						return item.czlx.includes('发起') == true
					})[0];
					this.fqr = this.getOffice(this.fqr);
					this.sprList = this.sqxxDetail.filter(item => {
						return item.czlx.includes('审批') == true
					})
					console.log(this.sprList.length,"POPOPO")
					let brr=[];
				    brr = this.sqxxDetail.filter(item => {
						return item.czlx.includes('审批不同意') == true
					})
				    console.log(brr.length)
					if(brr.length) {
						this.noAgree = true;
					} else {
						this.noAgree = false;
					}
					this.sprList = this.getOffice(this.sprList);
					this.qsList = this.sqxxDetail.filter(item => {
						return item.czlx.includes('签收') == true || item.czlx.includes('反馈') == true
					})
					this.qsList = this.getOffice(this.qsList);
					this.jsypList = this.sqxxDetail.filter(item => {
						return item.czlx.includes('研判结束') == true
					})
					this.jsypList = this.getOffice(this.jsypList);
					this.pjList = this.sqxxDetail.filter(item => {
						return item.czlx.includes('总结') == true
					})
					console.log(this.pjList.length,"HJHJ")
				})
			},
			getOffice(arr) {
				if(arr[0]) {
					arr.forEach(item => {
						api.api('get', api.systemUrl + '/account/info/detail?id=' + item.zxrid).then(result => {
							this.$set(item, 'officeName', result.officeName)
						})
					})
				} else {
					api.api('get', api.systemUrl + '/account/info/detail?id=' + arr.zxrid).then(result => {
						this.$set(arr, 'officeName', result.officeName)
					})
				}
				return arr
			}
		}
	}
</script>

<style lang="less" scoped>
	.is-horizontal {
		border: 1px solid #b8e5af !important;
	}
	
	.el-scrollbar__bar.is-horizontal {
		border: 1px solid #b8e5af !important;
	}
	
	.path-flow-ct .scrollbar-path-flow .el-scrollbar__bar .is-horizontal {
		border: 1px solid red !important;
		height: 15px;
		opacity: 1 !important;
		padding-top: 4px;
		padding-right: 4px;
		padding-left: 4px;
	}
	
	.main .single-page-con .single-page.reset-page {
		margin: 10px;
		margin-left: 30px;
		margin-right: 30px;
		overflow:hidden;
	}
	
	.lcInfo-c {
		height: 60px;
		line-height: 60px;
		display: flex;
		justify-content: space-between;
		align-content: center;
		p {
			height: 60px;
			line-height: 60px;
		}
	}
	
	ul,
	li {
		list-style: none;
	}
	
	p {
		margin: 0;
	}
	
	.fl {
		float: left;
	}
	
	.cl:before {
		content: '';
		display: inline-block;
		clear: both;
	}
	
	.lancolor {
		color: #5b5b5b;
	}
	
	.whiteColor {
		// color: white;
		color:#3e3e3e;
	}
	
	.bodyWrap {
		padding: 20px;
		// background: #fff;
		height: 100%;
		min-width: 1110px;
	}
	
	.bodyWrap>div {
		position: relative;
		background: #fff;
	}
	
	.lcTop {
		display: inline-block;
		position: relative;
		float: left;
	}
	
	.startJ {
		width: 70px;
		display: inline-block;
		position: absolute;
		top: 50px;
		left: 20px;
	}
	
	.startJ>div {
		height: 60px;
		width: 60px;
		border: 1px solid #b8e5af;
		border-radius: 50%;
		line-height: 60px;
		text-align: center;
		box-sizing: border-box;
		position: absolute;
		top: 0px;
		left: -20px;
	}
	
	.startX {
		position: absolute;
		top: 25px;
		left: 37px;
		width: 70px;
		height: 16px;
		background: url(../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		display: inline-block;
	}
	
	.lcTopUl {
		margin-left: 97px;
		float: left;
	}
	
	.lcTopUl>li {
		border-radius: 4px;
		border: 1Px solid #b8e5af;
	}
	
	.lcTopUl .sprLi {
		margin-left: 37px;
		width: 250px;
		height: 140px;
		// background: #fff;
	}
	
	.lcTopUl>li,
	.top-right {
		float: left;
		margin-left: 80px;
		position: relative;
	}
	
	.top-rightone {
		float: left;
		border: 1Px solid #b8e5af;
		padding: 16px 8px 16px 16px;
		position: relative;
		border-radius: 4px;
	}
	
	.top-right>p {
		position: absolute;
		top: -22px;
		text-align: center;
		width: 100%;
		color: #5b5b5b;
		font-size: 14px;
	}
	
	.top-right .box {
		position: relative;
		margin-right: 10px;
		height: 140px;
		border: 1px solid #b8e5af;
		border-radius: 4px;
		float: left !important;
		/* color: #fff; */
	}
	
	.top-right .bottom-x {
		left: 37%;
	}
	
	.bottom-recive {
		float: left;
		position: relative;
	}
	
	.bottom-recive .recive {
		position: relative;
		margin-right: 10px;
		height: 140px;
		border: 1px solid #b8e5af;
		border-radius: 4px;
		background: #f9f8f9;
	}
	
	.bottom-w {
		position: relative;
		margin-right: 10px;
		margin-bottom: 82px;
		clear: both;
	}
	
	.bottom-wone {
		width:250px;
		height: 140px;
		background: #f9f8f9;
		height: 140px;
		border: 1px solid #b8e5af;
		border-radius: 4px;
		top: 80px;
		clear: both;
	}
	
	.bottom-recive .recive:nth-child(2) {
		margin-bottom: 0 !important;
	}
	
	.bottom-recive>.bottom-x {
		left: 37%;
	}
	
	.lcTopUl>li:nth-child(2) {
		margin: 0 80px;
	}
	
	.zdInfo {
		width: 70%;
		p {
			height: 20px;
			line-height: 20px;
		}
	}
	
	.zdInfo>p:nth-child(2) {
		font-size: 12px;
		height: 20px;
		line-height: 20px;
	}
	
	.lcInfo-t>img {
		position: relative;
		top: 5px;
		padding-right: 10px;
	}
	
	.lcInfo-b {
		p {
			height: 60px !important;
			line-height: 60px!important;
		}
	}
	
	.right-x {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		right: -80px;
		top: 74px;
	}
	
	.bottom-x {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		left: 36%;
		bottom: -49px;
		transform: rotate(90deg);
	}
	
	.line-x {
		position: absolute;
		display: inline-block;
		width: 260px;
		height: 16px;
		background: url(../../../images/ksh/lcx.png) no-repeat;
		background-size: 138% 100%;
		left: 0;
		top: -55px;
	}
	
	.first-line {
		width: 156px;
		transform: translate(104px);
		position: absolute;
		display: inline-block;
		height: 16px;
		background: url(../../../images/ksh/lcx.png) no-repeat;
		background-size: 138% 100%;
		left: 0;
		top: -55px;
	}
	
	.end-line {
		width: 109px;
		position: absolute;
		display: inline-block;
		height: 16px;
		background: url(../../../images/ksh/lcx.png) no-repeat;
		background-size: 138% 100%;
		left: 0;
		top: -55px;
	}
	
	.top-x {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../images/ksh/lcx.png) no-repeat;
		background-size: 50% 100%;
		left: 66px;
		top: -13px;
		transform: rotate(-270deg);
	}
	
	.bottom-approve {
		position: relative;
		display: inline-block;
		text-align: left;
		margin-left: 0;
	}
	
	.end-box {
		position: absolute;
		bottom: -142px;
		left: 95px;
		width: 60px;
		height: 60px;
		display: inline-block;
		background: #dcdcdc;
		border-radius: 50%;
		text-align: center;
		line-height: 50px;
	}
	
	.noAgree-box {
		position: absolute;
		bottom: 71px;
		right: -142px;
		width: 60px;
		height: 60px;
		display: inline-block;
		background: #dcdcdc;
		border-radius: 50%;
		text-align: center;
		line-height: 50px;
	}
	
	.end {
		color: #fff;
	}
	
	.qsDiv {
		position: absolute;
		top: 265px;
		min-width: 520px;
		max-width: 550px;
	}
	
	.qsdivone {
		border-radius: 4px;
		border: 1px solid #b8e5af;
		display: flex;
		min-height: 173px;
		justify-content: space-around;
		padding: 16px 8px 16px 16px;
	}
	
	.qsDiv i {
		bottom: 0;
		top: -49px;
		left: 43.2%;
	}
	
	.jsypDiv {
		position: absolute;
		top: 545px;
		left: 41%;
	}
	
	.jsypDiv i {
		bottom: 0;
		top: -49px;
		left: 35%;
	}
	
	.pjDiv {
		position: absolute;
		left: 434px;
		top: 551px;
		;
	}
	
	.pjDiv i {
		bottom: 0;
		top: -49px;
		left: 36%;
	}
	
	.newdiv {
		width: 248px;
		height: 78px;
		background: #fff;
		padding: 10px 5px 5px 10px;
		border-radius: 8px 8px 0 0;
	}
	
	.newdata {
		padding: 0 10px;
		p {
			height: 60px;
			line-height: 60px;
		}
	}
	
	.single-page {
		height: auto !important;
	}
	
	.calcWidth {
		width: 70%;
		margin-left: 10px;
		white-space: normal;
	}
	
	.path-flow {
		li:nth-child(2) {
			.and-so-on {
				&::after {
					content: " 等····";
				}
			}
		}
	}
	
	.el-scrollbar__bar .is-vertical {
		display: none;
	}
</style>