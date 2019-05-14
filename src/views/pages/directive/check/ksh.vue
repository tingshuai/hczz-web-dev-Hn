<template>
	<div>
		<div class="bodyWrap" style="overflow-y: auto;background:#fff">
			<div class="lcTop">
				<div class="startJ">
					<!--开始标记-->
					<div style="color:#4fbf39">
						开始
					</div>
					<i class="startX"></i>
				</div>
				<ul class="lcTopUl">
					<li :class="{'bg-green':isfq,'bg-blue':!isfq}">
						<!-- 是否有border-bottom ：：:style="{borderBottom : isfq===false? '1px solid #004672' : '1px solid #0c8f35'}" -->
						<div class="lcInfo-t cl fq-spr" style="height: 80px; background:#fff; padding:15px 10px 0">
							<img  src="../../../../images/ksh/img_p_two.png" style="width: 40px;height: 40px;" class="fl">
							<div class="ml10 fl zdInfo">
								<p :title="fqr.zxr" class="lancolor elli">{{zlObj.czrxm}}</p>
								<p :title="fqr.bmmc" class="elli">{{zlObj.czrdwmc}}</p>
							</div>
						</div>
						<!-- 新加class-c flex布局 -->
						<div class="lcInfo-b lcInfo-c" style="padding:0 10px">
							<p title="发起任务"  >发起指令</p>
							<p :title="fqr.czsj" class="font12 elli">{{zlObj.slsj | timestampToTime}}</p>
						</div>
						<i class="bottom-x"></i>
					</li>
				</ul>
			</div>

			<div v-show="iszf" class="lcMiddle cl center-div " style="border:0;height: 142px;margin-top: 47px;margin-left: 60px;position: relative;">
				<!--中间部分 转发内容显示-->
				<div class="fl ptop17 directive" :class="{'bg-green':iszf,'bg-blue':!iszf}">
					<div class="lcInfo-t cl" style="height: 80px;  padding:15px 10px 0;background:#fff;">
						<img src="../../../../images/ksh/img_p_two.png" class="fl" style="width: 40px;height: 40px;">
						<div class="ml10 fl zdInfo" style="width:calc(100% - 50px);">
							<p title="zzObj.xm" class="lancolor elli">{{zfinfo.czrxm}}</p>
							<p title="zzObj.officename" class="elli">{{zfinfo.czrdwmc}}</p>
						</div>
					</div>
					<div class="lcInfo-b lcInfo-c">
						<span title="研判" class="lancolor">任务分配</span>
						<span title="zzObj.cjsj" class="font12 elli">{{zfinfo.slsj | timestampToTime}}</span>
						
					</div>
					<i v-if="jsbmList.length!=1" class="bottom-x" style="left: 37px;background-size: 50% 100%;"></i>
					<i v-else class="bottom-x" style="left: 50px;"></i>
				</div>
			</div>
			<!--签收反馈评价-->
			<div style="text-align: center;position: relative;top: 78px;" class="bottom-div">
				<ul style="display: inline-block;display: flex;justify-content: center;width: 100%;margin-left: 40px;" class="bottom-ul">
					<li class="bottom-approve" v-for="(item,index) in jsbmList" :key="index">
						<!--虚线框内-->
						<div class="bottom-recive xwbg" style="border-radius:8px">
							<div class="recive" :class="{'bg-green':item.qsrxm!=null,'bg-blue':item.qsrxm==null}">
								<div class="lcInfo-t cl  qs-spr" style="height: 80px; padding:15px 10px 0;background:#fff;" :class="{'border-b-green':item.qsrxm!=null,'border-b-blue':item.qsrxm==null}">
									<img style="float:left;width: 40px;height: 40px;" src="../../../../images/ksh/img_p_two.png">
									<div style="width:calc(100% - 50px);float:left;margin-left: 10px;">
										<p title="item.qsrxm" class="lancolor elli">{{item.qsrxm}}</p>
										<p title="item.jsdwmc" style="font-size: 12px;" class="elli">{{item.jsdwmc}}</p>
									</div>
								</div>

								<div class="lcInfo-c" style="padding:0 10px">
									<p style="color: #717271;" title="签收">签收</p>
									<p style="font-size: 12px;color: #717271;" title="item.qssj elli">{{item.qssj | timestampToTime}}</p>
								</div>
								<i class="bottom-x"></i>
							</div>
							<div class="recive" :class="{'bg-green':item.fkrxm!=null,'bg-blue':item.fkrxm==null}">
								<div class="lcInfo-t cl fk-spr" style="height: 80px; padding:15px 10px 0;background:#fff" :class="{'border-b-green':item.fkrxm!=null,'border-b-blue':item.fkrxm==null}">
									<img style="float:left;width: 40px;height: 40px;" src="../../../../images/ksh/img_p_two.png">
									<div style="width:calc(100% - 50px);float:left;margin-left: 10px;">
										<p title="item.zxr" class="lancolor elli">{{item.fkrxm}}</p>
										<p title="item.fkrxm" style="font-size: 12px;" class="elli">{{item.jsdwmc}}</p>
									</div>
								</div>

								<div class="lcInfo-c" style="padding:0 10px">
									<p style="color: #717171;" title="反馈" >反馈</p>
									<p style="font-size: 12px;" title="item.fksj" class="elli">{{item.fksj | timestampToTime}}</p>

								</div>
							</div>
							<i class="bottom-x"></i>
						</div>
						<!--虚线框外-->
						<div class="bottom-w clear" v-if="index==0" :style="{left: left+'px',top:top+'px'}" :class="{'bg-green':item.pjzt!='0','bg-blue':item.pjzt=='0'}">
							<i class="top-x-bottom" v-show="jsbmList.length!=1"></i>
							<div class="lcInfo-t cl pj-spr" style="height: 80px; padding:15px 10px 0;background:#fff;">
								<img style="float:left;width: 40px;height: 40px;" src="../../../../images/ksh/img_p_two.png">
								<div style="width:calc(100% - 50px);float:left;margin-left: 10px;">
									<p title="item.zxr" class="lancolor elli">{{item.pjr}}</p>
									<p title="item.bmmc" style="font-size: 12px;" class="elli">{{item.xfbmmc}}</p>
								</div>
							</div>
							<div class="lcInfo-c" style="padding:0 10px">
								<span style="color: #717271;" title="评价">评价</span>
								<span style="font-size: 12px;" title="item.czsj" class="elli">{{item.pjsj | timestampToTime}}</span>
							</div>
							<i class="bottom-x-bottom"></i>
							<span class="end-box">
							<span class="end">结束</span>
							</span>
						</div>
						<i class="top-x" v-show="jsbmList.length!=1"></i>
						<i class="line-x" v-show="index!=0 && index!=jsbmList.length-1 && jsbmList.length!=1"></i>
						<i class="first-line" v-show="index==0 && jsbmList.length!=1"></i>
						<i class="end-line" v-show="index==jsbmList.length-1 && jsbmList.length!=1"></i>
						<i class="bottom-left-line" v-show="index==0 && jsbmList.length!=1"></i>
						<i class="bottom-right-line" v-show="index==jsbmList.length-1 && jsbmList.length!=1"></i>
						<i class="line-x bottom-all-line" v-show="index!=0 && index!=jsbmList.length-1"></i>
					</li>

				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api.js';
	export default {
	    data () {
	        return {
	            isqs: false,
	            isfq: false, // 发起
	            issp: false, // 审批
	            iszf: false, // 转发
	            spr: [], // 审批人集合
	            fqr: [], // 发起人
	            zlObj: {},
	            list: [1],
	            gzlList: [],
	            jsbmList: [],
	            zfinfo: {},
	            zlcgpj: [],
	            iszxqsry: false,
	            left: 0,
	            top: 0
	        };
	    },
	    mounted () {
	        this.getZlDetail();
	    },
	    computed: {
	        zlid () {
	            return this.$route.query.zlid;
	        }
	    },
	    methods: {
	        getZlDetail () {
	            api.api('post', api.configUrl + '/hczz/zl/getZlxxDetail', {
	                id: this.zlid
	            }).then(res => {
	                this.zlObj = res;
	                if (this.zlObj.parentid) {
	                    this.zfinfo = res;
	                    this.iszf = true;
	                    this.getZlDetailAgain(this.zlObj.parentid); // 获取上级指令id
	                } else {
	                    this.getGzl(this.zlObj.id); //
	                }
	                this.getJSBM(this.zlObj.id); // 获取接收的单位
	            });
	        },
	        getZlDetailAgain (id) {
	            api.api('post', api.configUrl + '/hczz/zl/getZlxxDetail', {
	                id: id
	            }).then(res => {
	                this.zlObj = res;
	                this.getGzl(this.zlObj.id); //
	            });
	        },
	        getGzl (id) {
	            api.api('get', api.configUrl + '/hczz/common/clrz/getClrzList', {
	                glid: id
	            }).then(res => {
	                this.gzlList = res;
	                this.spr = [];
	                this.fqr = [];

	                $.each(res, (index, value) => {
	                    if (value.cznr != null && value.cznr.indexOf('新增') > -1) {
	                        this.isfq = true;
	                        this.fqr = value; // 发起人数组
	                    } else if (value.cznr != null && value.cznr.indexOf('审批') > -1) {
	                        this.issp = true;
	                        this.spr.push(value); // 审批人
	                        this.spr = [];
	                        if (index < 2) {
	                            this.getJsInfo(value.czrid);
	                        }
	                    }
	                });
	                if (this.spr.length == 1 || this.spr.length == 0) {
	                    this.$nextTick(() => {
	                        $('.top-right .move-x').css('left', '98px');
	                    });
	                } else {
	                    this.$nextTick(() => {
	                        $('.top-right .move-x').css('left', '242px');
	                    });
	                }
	                if (this.spr.length == 1 || this.spr.length == 0) {
	                    $('.center-div').css({
	                        left: '-199px'
	                    });
	                    $('.bottom-div').css({
	                        left: '-552px'
	                    });
	                } else {
	                    $('.center-div').css({
	                        left: '-46px'
	                    });
	                    $('.bottom-div').css({
	                        left: '-552px'
	                    });
	                }
	            });
	        },
	        getJSBM (id) {
	            api.api('post', api.configUrl + '/hczz/zl/getDetailZlxx', {
	                id: id
	            }).then(res => {
	                this.getZlcgpjList(id, res.zldwgl);
	            });
	        },
	        getJsInfo (id) { // 获取是否该角色
	            api.api('get', api.systemUrl + '/role/getRolesByAccountId?accountId=' + id, {}).then(res => {
	                this.iszxqsry = false;
	                $.each(res, (index, item) => {
	                    if (item.roleName == '中心签收员') {
	                        this.iszxqsry = true;
	                    }
	                });
	            });
	        },
	        getZlcgpjList (id, zldwgl) {
	            api.api('post', api.configUrl + '/hczz/zl/getZlcgpjList', {
	                id: id
	            }).then(res => {
	                this.jsbmList = zldwgl.filter(item => {
	                    return item.lx == 1;
	                });
	                $.each(zldwgl, (index, jsbm) => {
	                    $.each(res, (nindex, cgpj) => {
	                        if (cgpj.zldwglid == jsbm.id) {
	                            this.jsbmList[index].pjzt = cgpj.zt;
	                            this.jsbmList[index].pjr = cgpj.xfrxm;
	                            this.jsbmList[index].pjsj = cgpj.czsj;
	                            // this.jsbmList[index].pjrdw=cgpj.jsdwmc;
	                        }
	                    });
	                });
	                if (this.jsbmList.length > 1) {
	                    $('.bottom-ul').css('margin-left', '-66px');
	                    $('.bottom-div').css('top', '130px');
	                } else {
	                    $('.bottom-ul').css('margin-left', '37px');
	                    $('.bottom-div').css('top', '100px');
	                }
	                if (this.iszf) {
	                    $('.bottom-div').css('top', '100px');
	                } else {
	                    $('.bottom-div').css('top', '130px');
	                }
	                if (this.jsbmList.length == 1) {
	                    $('.bottom-div').css('top', '80px');
	                    this.top = 80;
	                } else {
	                    $('.bottom-div').css('top', '130px');
	                    this.top = 120;
	                }
	                this.left = ((this.jsbmList.length - 1) * 260 + 192) / 2 - 86;
	            });
	        }

	    }
	};
</script>

<style lang="less" scoped>
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
	
	.ptop17 {
		position: relative;
		top: 17px
	}
	
	.ml10 {
		margin-left: 10px;
	}
	
	.font12 {
		font-size: 12px;
	}
	
	.lancolor {
		color: #88d47a;
	}
	
	.bodyWrap {
		padding: 20px 20px 200px 100px;
		width: 1571px;
		background: #ffffff;
	}
	
	.lcTop {
		/*width: 100%;*/
		display: inline-block;
		position: relative;
		float: left;
	}
	
	.startJ {
		width: 80px;
		/*display: inline-block;*/
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
		top: -10px;
		left: -67px;
	}
	
	.startX {
		position: absolute;
		top: 9px;
		left: -4px;
		width: 70px;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		display: inline-block;
	}
	
	.lcTopUl {
		margin-left: 97px;
		/* color: green; */
		float: left;
	}
	
	.lcTopUl>li,
	.lcMiddle>div,
	.lcMiddle ul li {
		position: relative;
		width: 250px;
		height: 140px;
		border: 1Px solid #b8e5af;
		border-radius: 8px;
		float: left;
		background: #f9f8f9;
	}
	
	.lcMiddle .directive {
		left: 560px;
		top: 80px;
	}
	
	.top-right {
		float: left;
		margin-left: 80px;
		border: 1Px solid #b8e5af;
		padding: 16px;
		position: relative;
		border-radius: 8px;
	}
	
	.top-right>p {
		position: absolute;
		top: -22px;
		text-align: center;
		width: 100%;
		font-size: 14px;
	}
	
	.top-right .box {
		margin-right: 5px;
		position: relative;
		width: 250px;
		height: 140px;
		border: 1Px solid #b8e5af;
		border-radius: 8px;
		float: left;
		background:#f9f8f9;
	}
	
	.top-right .bottom-x {
		left: 300px;
	}
	
	.bottom-recive {
		float: left;
		border: 1Px solid #b8e5af;
		padding: 10px 0 10px 10px;
		position: relative;
		background: #f9f8f9;
	}
	
	.bottom-recive .recive {
		position: relative;
		margin-right: 10px;
		width: 250px;
		height: 140px;
		border: 1px solid #b8e5af;
		border-radius: 8px;
		margin-bottom: 82px;
	}
	
	.bottom-w {
		background: #f9f8f9;
		position: relative;
		width: 250px;
		height: 140px;
		border: 1Px solid #b8e5af;
		margin-bottom: 122px;
		clear: both;
		border-radius: 8px;
	}
	
	.bottom-recive .recive:nth-child(2) {
		margin-bottom: 0 !important;
	}
	
	// .bottom-recive>.bottom-x {
	// 	// left: 56px;
	// }
	
	.lcTopUl>li:nth-child(2) {
		margin: 0 80px;
	}
	
	.zdInfo {
		width: calc(100% - 50px);
	}
	
	.zdInfo>p:nth-child(2) {
		font-size: 12px;
	}
	.lcInfo-t{
			border-radius: 8px 8px 0 0;
	}
	
	.lcInfo-t>img {
		position: relative;
		top: 5px;
		border-radius: 8px 8px 0 0;
	}
	
	.lcInfo-b {
		
		color:#717271;
		
	}
	.lcInfo-c{
		height: 60px;
		line-height: 60px;
		display: flex;
		justify-content: space-between;
		align-content: center;
	}
	
	.right-x {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		right: -80px;
		top: 59px;
	}
	
	.bottom-x {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		margin-left: 34%;
		bottom: -49px;
		transform: rotate(90deg);
	}
	
	.move-x {
		position: absolute;
		display: inline-block;
		width:70px;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 100% 100%;
		/*left: 66px;*/
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
	
	.bottom-left-line {
		width: 155px;
		transform: translate(104px);
		position: absolute;
		display: inline-block;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 138% 100%;
		left: -7px;
		bottom: 177px;
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
	
	.bottom-right-line {
		width: 104px;
		position: absolute;
		display: inline-block;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 138% 100%;
		left: -8px;
		bottom: 177px;
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
	
	.top-x-bottom {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 50% 100%;
		left: 38%;
		top: -9px;
		transform: rotate(-270deg);
	}
	
	.bottom-x-bottom {
		position: absolute;
		display: inline-block;
		width: 70px;
		height: 16px;
		background: url(../../../../images/ksh/lcx.png) no-repeat;
		background-size: 80% 100%;
		left: 38%;
		bottom: -49px;
		transform: rotate(-270deg);
	}
	
	.lcMiddle {
		margin-top: 77px;
		margin-left: 72px;
		border: 1Px dotted #b8e5af;
		width: 925px;
		clear: both;
		padding: 0 20px 30px;
	}
	
	.lcMiddle>ul>li {
		float: left;
		margin-left: 70px;
		margin-top: 17px;
	}
	
	.lcMiddle>ul>li:last-child {
		margin-right: 0;
	}
	
	.lcMiddle>div,
	.lcMiddle ul li {
		width: 250px;
	}
	
	.lcMiddle>div .zdInfo,
	.lcMiddle ul li .zdInfo {
		width: 70%;
	}
	
	.bottom-approve {
		position: relative;
		display: inline-block;
		width: 260px;
		text-align: left;
	}
	
	/* .xwbg {
		background-image: url(../../../../images/ksh/bg_xw.png);
	}
	 */
	.bg-green {
		background: linear-gradient(to bottom, #046517, #02440d);
	}
	
	.bg-blue {
		background: linear-gradient(to bottom, #012142, #02132c);
	}
	
	.end-box {
		position: absolute;
		top: 202px;
		left: 38%;
		width: 70px;
		height: 70px;
		display: inline-block;
		background:#dcdcdc;
		border-radius:50%;
		text-align: center;
		line-height: 72px;
	}
	
	.end {
		color:#fff;
	}
	
	.bottom-all-line {
		top: 453px;
		left: -8px;
	}
	.elli {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>