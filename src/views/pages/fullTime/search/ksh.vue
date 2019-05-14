<template>
	<div class="bodyWrap" style="background:#fff; overflow-y: scroll;">

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

						<div class="lcInfo-t cl ks-spr" style="height: 80px; background:#fff; padding:15px 10px 0; border-radius: 8px 8px 0 0;">
							<img src="../../../../images/ksh/img_p_two.png" class="fl">
							<div class="fl zdInfo" style="padding-top:5px">
								<p :title="fqr.zxr" class="lancolor">{{fqr.zxr}}</p>
								<p :title="fqr.bmmc">{{fqr.bmmc}}</p>
							</div>
						</div>

						<div class="lcInfo-b lcInfo-c" style="padding:0 10px">
							<p title="发起任务" class="lancolor">发起请求协查</p>
							<p :title="fqr.czsj">{{fqr.czsj | timestampToTime}}</p>
						</div>
						<i class="right-x" v-show="sprList.length>0"></i>
					</li>
				</ul>
			</div>
			<div class="top-right xwbg topright" ref="topright" id="ab" style="margin-top: -17px;">
				<div class="top-rightone" v-show="sprList.length>0">
					<div class="box" v-for="(item,index) in sprList" :key="index" style="background:#f9f8f9">
						<div class="newdiv">
							<img src="../../../../images/ksh/img_p_two.png" class="fl">
							<div class="fl zdInfo calcWidth">
								<p class="lancolor">{{item.zxr}}</p>
								<p>{{item.bmmc}}</p>
							</div>
						</div>
						<div class="newdata lcInfo-c">
							<p style="color: #5b5b5b;" title="审批">审批</p>
							<p :title="item.czsj">{{item.czsj|timestampToTime}}</p>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!--签收反馈-->
		<div>
			<div class="qsDiv" :style="{position:'absolute','left':dvalue+'px'}">
				<div class="qsdivone">
					<i class="bottom-x"></i>
					<div class="bottom-recive" v-for="(item,index) in qsList" :key="index" v-show="qsList.length > 0">

						<div class="recive" style="background:#f9f8f9">
							<div class="lcInfo-t qs-spr newdiv">
								<img src="../../../../images/ksh/img_p_two.png" class="fl">
								<div class="calcWidth">
									<p class="lancolor">{{item.zxr}}</p>
									<p>{{item.bmmc}}</p>
								</div>
							</div>

							<div class="newdata lcInfo-c">
								<p style="color:#5b5b5b" :title="item.czlx">{{item.czlx}}</p>
								<p  title="item.czsj">{{item.czsj | timestampToTime}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<!--结束研判-->
			<div class="bottom-recive jsypDiv" :style="{position:'absolute','left':dvalue2+'px'}">
				<div v-show="jsypList.length > 0">
					<i class="bottom-x"></i>
					<div class="recive" v-for="(item,index) in jsypList" :key="index">
						<div class="lcInfo-t qs-spr newdiv">
							<img src="../../../../images/ksh/img_p_two.png" class="fl">
							<div class="calcWidth">
								<p class="lancolor">{{item.zxr}}</p>
								<p>{{item.bmmc}}</p>

							</div>
						</div>
						<div class="newdata lcInfo-c">
							<p style="color:#5b5b5b" title="结束研判">结束研判</p>
							<p  title="item.czsj">{{item.czsj | timestampToTime}}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<!--评价-->
			<div class="bottom-w clear  pjDiv" v-for="(item,index) in pjList" :key="index" :style="{position:'absolute','left':dvalue2+'px'}">
				<div class="bottom-wone" v-show="pjList.length>0 && jsypList.length > 0">
					<i class="bottom-x"></i>
					<div class="lcInfo-t newdiv">
						<img src="../../../../images/ksh/img_p_two.png" class="fl">
						<div class="calcWidth">
							<p class="lancolor">{{item.zxr}}77</p>
							<p>{{item.bmmc}}</p>
						</div>
					</div>
					<div class="newdata lcInfo-c">
						<p style="color: #5b5b5b;" title="评价">评价</p>
						<p title="pjrq.czsj">{{item.czsj | timestampToTime}}</p>
					</div>
					<i class="bottom-x" style="top: 175px;"></i>
					<span class="end-box">
						<span class="end">结束</span>
					</span>
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
				dvalue2:'',//研判层
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
			}
		},

		computed: {
			ids() {
				return this.$route.query.zbid
			}
		},
		mounted() {

			this.$nextTick(() => {
				this.getSqxxDetail();
				setTimeout(()=>{
					console.log($('.qsDiv').css('width').split('px'))
					console.log($('#ab').css('width').split('px'))
					let qsWidth=$('.qsDiv').css('width').split('px')[0]-0;
					let abWidth=$('#ab').css('width').split('px')[0]-0;
					if(this.sprList.length==1){
						this.dvalue = 464;
						if(this.qsList.length==1){
							this.dvalue = 464;
						}else{
							this.dvalue = 296;
						}
					}else{
						if(this.qsList.length==1){
							this.dvalue = 464+(abWidth-qsWidth)/4+46;
							this.dvalue2=464+(abWidth-qsWidth)/4+146;
						}else{
							this.dvalue = 464;
							this.dvalue2=464+(abWidth-qsWidth)/4+146;
						}
						this.dvalue1 = 464+(abWidth-qsWidth)/4+46
					}
					
					
					
				},300)
				
			})
		},
		created() {
			this.$nextTick(() => {
				this.height = document.querySelectorAll('.xwbg')[0].clientWidth
			})
		},
		methods: {
			getSqxxDetail() {
				api.api('get', api.configUrl + '/hczz/zhb/getFlow/' + this.ids, {
					type: '2'
				}).then(res => {
					this.sqxxDetail = res.clrzList;
					this.fqr = this.sqxxDetail.filter(item => {
						return item.czlx.includes('发起') == true
					})[0]
					this.sprList = this.sqxxDetail.filter(item => {
						return item.czlx.includes('审批同意') == true
					})
					this.qsList = this.sqxxDetail.filter(item => {

						return item.czlx.includes('签收') == true || item.czlx.includes('反馈') == true
					})
					this.jsypList = this.sqxxDetail.filter(item => {
						return item.czlx.includes('研判结束') == true
					})
					this.pjList = this.sqxxDetail.filter(item => {
						return item.czlx.includes('总结') == true
					})
				})
			},

		}
	}
</script>

<style lang="less" scoped>
	.main .single-page-con .single-page.reset-page {
		margin: 10px;
		margin-left: 30px;
		margin-right: 30px;
		height: auto !important;
		overflow-y: hidden;
		overflow-x: hidden;
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
	
	.bodyWrap {
		padding: 20px;
		background: #fff;
		height: 100%;
		min-width: 1110px;
	}
	.bodyWrap>div{
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
		border: 1px solid #88d47a;
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
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		display: inline-block;
	}
	
	.lcTopUl {
		margin-left: 97px;
		float: left;
	}
	
	.lcTopUl>li {
		border-radius: 4px;
		border: 1px solid #7aca6e;
	}
	.lcTopUl .sprLi{
		margin-left:37px;width:250px;height:140px;background:#f9f8f9
	}
	.lcTopUl>li,
	.top-right {
		float: left;
		margin-left: 80px;
		position: relative;
	}
	
	.top-rightone {
		float: left;
		border: 1px solid #7aca6e;
		padding: 16px 8px 16px 16px;
		position: relative;
		border-radius: 4px;
	}
	
	.top-right>p {
		position: absolute;
		top: -22px;
		text-align: center;
		width: 100%;
		color: white;
		font-size: 14px;
	}
	
	.top-right .box {
		position: relative;
		margin-right: 10px;
		height: 140px;
		border: 1px solid #7aca6e;
		border-radius: 4px;
		float: left;
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
		border: 1px solid #7aca6e;
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
		background: #f9f8f9;
		height: 140px;
		border: 1px solid #7aca6e;
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
		width: calc(100% - 50px);
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
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		right: -80px;
		top: 74px;
	}
	
	.bottom-x {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
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
		background: url(../../../../images/ksh/lcx.png) no-repeat;
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
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 138% 100%;
		left: 0;
		top: -55px;
	}
	
	.end-line {
		width: 109px;
		position: absolute;
		display: inline-block;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 138% 100%;
		left: 0;
		top: -55px;
	}
	
	.top-x {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
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
	
	.end {
		color: #fff;
	}
	
	.qsDiv {
		position: absolute;
		top: 233px;
		min-width: 520px;
	}
	
	.qsdivone {
		border-radius: 4px;
		border: 1px solid #7aca6e;
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
		top: 482px;
		left: 442px;
	}
	
	.jsypDiv i {
		bottom: 0;
		top: -49px;
		left: 35%;
	}
	
	.pjDiv {
		position: absolute;
		left: 434px;
		top: 698px;
	}
	
	.pjDiv i {
		bottom: 0;
		top: -49px;
		left: 36%;
	}
	.newdiv {
		width: 250px;
		height: 80px;
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
	.calcWidth{
		width:calc(100% - 50px) !important;margin-left: 10px;
	}
</style>