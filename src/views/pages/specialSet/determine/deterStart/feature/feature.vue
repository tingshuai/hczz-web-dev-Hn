<template>
	<div class="feature">
	<Form ref="feature" :model="formDynamic" :rules="ruleValidate" :label-width="120" class="featureForm">
		<Row>
			<Col span="12">
				<FormItem label="作案地域" prop="zady">
			        <Input v-model.trim="formDynamic.zady" clearable  placeholder="请输入作案地域" :maxlength="30"></Input>
			    </FormItem>
			</Col>
			<Col span="12">
				<FormItem label="作案选择住所" prop="zaxzcs">
			        <Select v-model="formDynamic.zaxzcs">
						<Option v-for="item in zazsList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
			   </FormItem>
			</Col>
		</Row>
		<Row>
			<Col span="12">
				<FormItem label="作案选择时机">
			        <Select v-model="formDynamic.zaxzsj">
						<Option v-for="item in zasjList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
			    </FormItem>
			</Col>
			<Col span="12">
				<FormItem label="作案选择对象">
			        <Select v-model="formDynamic.zaxzdx">
						<Option v-for="item in zadxList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
			   </FormItem>
			</Col>
		</Row>
		<Row>
			<Col span="12">
				<FormItem label="作案动机" prop="zadj">
			        <Input v-model.trim="formDynamic.zadj" clearable  placeholder="请输入作案动机" :maxlength="40"></Input>
			    </FormItem>
			</Col>
			<Col span="12">
				<FormItem label="作案手段" prop="zasd">
			        <Select v-model="formDynamic.zasd">
						<Option v-for="item in zasdList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
			   </FormItem>
			</Col>
		</Row>
		<Row>
			<Col span="12">
				<FormItem label="作案特点" prop="zatd">
			        <Select v-model="formDynamic.zatd">
						<Option v-for="item in zatdList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
			    </FormItem>
			</Col>
			<Col span="12">
				<FormItem label="作案工具">
			        <Select v-model="formDynamic.zagj">
						<Option v-for="item in zagjList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
			   </FormItem>
			</Col>
		</Row>
		<Row>
			<Col span="12">
				<FormItem label="作案类别" prop="ajlb">
			        <Select v-model="formDynamic.ajlb">
						<Option v-for="item in zalbList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
			    </FormItem>
			</Col>
			<Col span="12">
				<FormItem label="申请时间" prop="starttime">
				    <DatePicker type="daterange" clearable   clearable placement="bottom-end" placeholder="请选择申请时间" style="width: 100%" @on-change="handleDate"></DatePicker>
			    </FormItem>
			</Col>
		</Row>
		<Row>
			<Col span="12">
				<FormItem label="作案入口">
			        <Input v-model.trim="formDynamic.zark" clearable  placeholder="请输入作案入口" :maxlength="40"></Input>
			    </FormItem>
			</Col>
			<Col span="12">
				<FormItem label="作案出口">
			        <Input v-model.trim="formDynamic.zack" clearable  placeholder="请输入作案出口" :maxlength="40"></Input>
			   </FormItem>
			</Col>
		</Row>
		<Row>
			<Col span="12">
				<FormItem label="涉案物品">
			        <Select v-model="formDynamic.sawp">
						<Option v-for="item in sawpList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
			    </FormItem>
			</Col>
			<Col span="12">
				<FormItem label="作案详址" prop="zaxz">
			        <Input v-model.trim="formDynamic.zaxz" clearable  placeholder="请输入作案详细地址" readonly="readonly" @on-focus="mapFocus" :maxlength="40"></Input>
			   </FormItem>
			</Col>
		</Row>
		<Row>
			<Col span="12">
				<FormItem label="涉案金额" prop="saje" style="position: relative;">
			        <Input v-model.trim="formDynamic.saje" clearable  placeholder="请输入涉案金额" :maxlength="7" class="inputspecial"></Input>
			        <h3>万元</h3>
			    </FormItem>
			</Col>
		</Row>
		<Row>
			<Col span="24">
				<FormItem label="作案原因">
			        <Input v-model.trim="formDynamic.zayy" type="textarea" :rows="5" placeholder="请输入作案原因" :maxlength="40"></Input>
			    </FormItem>
			</Col>
		</Row>
    </Form>
    <div class="text-align-right">
		<Button type="default" @click="cancelBtn">重置</Button>
		<Button type="primary" @click="sure">提交</Button>
	</div>
	<div>
		<hczzMap @updateMap="updateMap" :show="show"></hczzMap>
	</div>
   </div>
</template>

<script>
	import api from '@/fetch/api';
	import hczzMap from './hczzmap';
	import {timestampToTime} from '@/libs/common/common';
	import {isNumber} from '@/libs/common/check.js';
	export default{
		components:{
			hczzMap
		},
		data(){
			return {
				formDynamic:{
					zady:'',
					zaxzcs:'',
					zaxzsj:'',
					zaxzdx:'',
					zadj:'',
					zasd:'',
					zatd:'',
					zagj:'',
					ajlb:'',
//					a:null,
					starttime: null,
					endtime: null,
					zark:'',
					zack:'',
					zayy:'',
					zaxz:'',
					jd:'',
					wd:'',
					sawp:'',
					saje:''
				},
				defaultValve:new Date(),
				ruleValidate:{
					zady:[{
						required:true,
						message:'作案地域不能为空',
						trigger:'change'
					}],
					zaxzcs:[{
						required:true,
						message:'作案选择住所不能为空',
						trigger:'change'
					}],
					zadj:[{
						required:true,
						message:'作案动机不能为空',
						trigger:'change'
					}],
					zasd:[{
						required:true,
						message:'作案手段不能为空',
						trigger:'change'
					}],
					zatd:[{
						required:true,
						message:'作案特点不能为空',
						trigger:'change'
					}],
					ajlb:[{
						required:true,
						message:'案件类别不能为空',
						trigger:'change'
					}],
					starttime:[{
						type:'date',
						required:true,
						message:'时间维度不能为空',
						trigger:'change'
					}],
					zaxz:[{
						required:true,
						message:'作案详址不能为空',
						trigger:'change'
					}],
					saje:[{
						validator:isNumber
					}]
				},
				list:[1,2],
				zazsList:[],//作案住所
				zasjList:[],//作案时机
				zadxList:[],//作案对象
				zasdList:[],//作案手段
				zatdList:[],//作案特点
				zagjList:[],//作案工具
				zalbList:[],//作案类别
				sjwd:[],//时间维度
				sawpList:[],//涉案物品
				sqid:'',
				show:false,//地图显示隐藏
			}
		},
		mounted(){
			this.getZazs();
			this.getZasj();
			this.getZadx();
			this.getZasd();
			this.getZatd();
			this.getZagj();
			this.getZalb();
			this.getSawp();
			this.myWork();
		},
		computed:{
			determineId(){
				return this.$route.query.id
			}
		},
		methods:{
			myWork(){
				api.api('post',api.configUrl+'/hczz/za/getSqxxXx',{id:this.determineId}).then(res=>{
					this.sqid=res.sqxx.id;
					if(res.ypxx){
						this.formDynamic=res.ypxx;
//						this.formDynamic.time=[timestampToTime(res.ypxx.sjwdq),timestampToTime(res.ypxx.sjwdz)];
					}
				})
			},
			sure(){
				this.$refs.feature.validate((valid)=>{
					if(valid){
						let ypxx={
							sqid:this.sqid,
							zady:this.formDynamic.zady,
							zaxzcs:this.formDynamic.zaxzcs,
							zaxzsj:this.formDynamic.zaxzsj,
							zaxzdx:this.formDynamic.zaxzdx,
							zadj:this.formDynamic.zadj,
							zasd:this.formDynamic.zasd,
							zatd:this.formDynamic.zatd,
							zagj:this.formDynamic.zagj,
							ajlb:this.formDynamic.ajlb,
							zark:this.formDynamic.zark,
							zack:this.formDynamic.zack,
							zayy:this.formDynamic.zayy,
							zaxz:this.formDynamic.zaxz,
							jd:this.formDynamic.jd,
							wd:this.formDynamic.wd,
							sawp:this.formDynamic.sawp,
							saje:this.formDynamic.saje,
							id:this.formDynamic.id,
							sjwdq:this.formDynamic.starttime,
							sjwdz:this.formDynamic.endtime
						}
//						if(this.formDynamic.time!=null && this.formDynamic.time!=''){
//							ypxx.sjwdq=new Date(this.formDynamic.time[0]).getTime();
//							ypxx.sjwdz=new Date(this.formDynamic.time[1]).getTime();
//						}else{
//							ypxx.sjwdq='';
//							ypxx.sjwdz='';
//						}
						if(this.formDynamic.id){
							api.api('post',api.configUrl+'/hczz/za/updateYpxx',ypxx).then(res=>{
								this.$message.success("修改成功");
							})
						}else{
							api.api('post',api.configUrl+'/hczz/za/insertYpxx',ypxx).then(res=>{
								this.$message.success("提交成功");
							})
						}
					}
				})
			},
			cancelBtn(){
//				this.resets();
				this.$refs.feature.resetFields();
				this.formDynamic={};
			},
			getZazs(){//获取作案住所
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00043').then(res=>{
			        this.zazsList=res;
			     })
            },
            getZasj(){//获取作案时机
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00042').then(res=>{
			        this.zasjList=res;
			     })
            },
            getZadx(){//获取作案对象 暂时没有
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00043').then(res=>{
			        this.zadxList=res;
			     })
            },
            getZasd(){//获取作案手段
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=ZASDDM').then(res=>{
			        this.zasdList=res;
			     })
            },
            getZatd(){//获取作案特点
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00041').then(res=>{
			        this.zatdList=res;
			     })
            },
            getZagj(){//获取作案工具  暂时没有
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00043').then(res=>{
			        this.zagjList=res;
			     })
            },
            getZalb(){//获取作案类别 暂时没有
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00043').then(res=>{
			        this.zalbList=res;
			     })
            },
            getSawp(){//获取涉案物品
            	api.api('post',api.systemUrl+'/dict/findDictTreeByType?dictTypeCode=DM00040').then(res=>{
			        this.sawpList=res;
			     })
            },
            updateMap(data){
            	if(data){
            		this.formDynamic.zaxz=data.allRegion+data.address;
	            	this.formDynamic.jd=data.postion.split(',')[0];
	            	this.formDynamic.wd=data.postion.split(',')[1];
            	}
            	this.show=false;
            },
            mapFocus(){
            	this.show=true;
            },
            //搜索日期处理
			handleDate(val) {
				this.formDynamic.starttime = new Date(`${val[0]} 00:00:00`);
				this.formDynamic.endtime = new Date(`${val[1]} 23:59:59`);
			},
//          resets(){
//          	this.$refs.feature.resetFields();
//				this.formDynamic={
//					zady:'',
//					zaxzcs:'',
//					zaxzsj:'',
//					zaxzdx:'',
//					zadj:'',
//					zasd:'',
//					zatd:'',
//					zagj:'',
//					ajlb:'',
//					sjwdq:'',
//					sjwdz:'',
//					zark:'',
//					zack:'',
//					zayy:'',
//					zaxz:'',
//					jd:'',
//					wd:'',
//					sawp:'',
//					saje:''
//				}
//          }
		}
	}
</script>

<style lang="less">
	.feature{
		padding: 10px 20px;
		h3{
	    	position: absolute;
		    right: 20px;
		    top: 1px;
	    }
	    .inputspecial{
	    	/*width:90%;*/
	    }
	}
    
</style>