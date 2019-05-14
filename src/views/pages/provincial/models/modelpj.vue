<template>
    <div>
        <el-dialog class="modal-ct workBench-group-modal evaluate" :title="'编号：'+xcObj.sqwh" @close='closeModel' :visible.sync="show" :modal-append-to-body='false' width="900px">
			<el-form :model="formValidate" ref="ruleForm" label-width="120px" class="demo-ruleForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="反馈人：">
							<span :title="xcObj.fkrxm" class="oSpan">{{xcObj.fkrxm}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="反馈单位：">
							<span :title="xcObj.jsdwmc" class="oSpan">{{xcObj.jsdwmc}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="联系电话：">
							<span :title="xcObj.sqrlxdh" class="oSpan">{{xcObj.sqrlxdh}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="案件编号：">
							<span :title="xcObj.sabjbh" class="oSpan">{{xcObj.sabjbh}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="案件名称：">
							<span :title="xcObj.ajmc" class="oSpan">{{xcObj.ajmc}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="案件类型：">
							<span :title="xcObj.jqajlx" class="oSpan">{{xcObj.jqajlx}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="案件简介：">
							<span :title="xcObj.bz" class="oSpan">{{xcObj.bz}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="简要任务内容：">
							<span :title="xcObj.jyrwnr" class="oSpan">{{xcObj.jyrwnr}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="手续附件：">
							<a v-for='(item,index) in dirTaskFileSX' :key="index">
								<div style="margin: 0;color:#409eff" @click="handlePrev(item)" class="tastFile" :title="item.filename"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
							</a>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务附件：">
							<a v-for='(item,index) in dirTaskFileRW' :key="index">
								<div style="margin: 0;color:#409eff" @click="handlePrev(item)" class="tastFile" :title="item.filename"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
							</a>
						</el-form-item>
					</el-col>
				</el-row>				
				<br/>
				<el-row>
					<el-col :span="24">
						<el-form-item label="反馈结果：">
							<span :title="xcObj.fknr" class="oSpan">{{xcObj.fknr}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="反馈附件：" class="oSpan">
							<a v-for='(item,index) in dirTaskFile' :key="index"> <span @click="handlePrev(item)" style="margin: 0;color:#409eff"><i class="el-icon-document"></i>{{item.filename+"."+item.category}}&nbsp;&nbsp;&nbsp;&nbsp;</span> </a>
						</el-form-item>
					</el-col>
				</el-row>
				<br/>
				<el-row v-if="isPj">
					<el-col :span="24">
						<el-form-item label="反馈态度：">
							<el-rate v-model="formValidate.fwtd" text-color="#ff9900" style="line-height:50px"></el-rate>
						</el-form-item>
						<el-form-item label="反馈速度：">
							<el-rate v-model="formValidate.fksu" text-color="#ff9900" style="line-height:50px"></el-rate>
						</el-form-item>
						<el-form-item label="反馈效果：">
							<el-rate v-model="formValidate.yyxg" text-color="#ff9900" style="line-height:50px"></el-rate>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="综合评价内容：" prop="zhpjnr">
							<el-input :rows="4" type="textarea" v-model="formValidate.zhpjnr" :maxlength="300"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="!isPj">
					<el-col :span="12">
						<el-form-item label="评价人：">
							<span :title="pjObj.pjr">{{pjObj.pjr}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="!isPj">
					<el-col :span="24">
						<el-form-item label="评价单位：">
							<span :title="pjObj.sqbmmc">{{pjObj.pjbmmc}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="!isPj">
					<el-col :span="24">
						<el-form-item label="评价时间：">
							<span :title="pjObj.pjrq">{{pjObj.pjrq | timestampToTime}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="!isPj">
					<el-col :span="24">
						<el-form-item label="综合评价内容：">
							<span :title="pjObj.zhpjnr" class="oSpan">{{pjObj.zhpjnr}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="!isPj">
					<el-col :span="24">
						<el-form-item label="反馈态度">
							<el-rate v-model="pjObj.fwtd" disabled text-color="#ff9900" style="line-height:50px"></el-rate>
						</el-form-item>
						<el-form-item label="反馈速度">
							<el-rate v-model="pjObj.fksu" disabled text-color="#ff9900" style="line-height:50px"></el-rate>
						</el-form-item>
						<el-form-item label="反馈效果">
							<el-rate v-model="pjObj.yyxg" disabled text-color="#ff9900" style="line-height:50px"></el-rate>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer">
				<el-button type="primary" v-show="isPj" @click="closeModel" class="cancelBtn" size="small">取消</el-button>
				<el-button type="primary" v-show="isPj" class="sureBtn successBtn" @click="saveInfo" size="small">评价</el-button>
				<el-button type="primary" v-show="!isPj" @click="closeModel" class="cancelBtn" size="small">关闭</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>

export default {
    props:{
        visible:{
            type:Boolean,
            default:false,
        },
        formValidate:{
            type: Object,
            default: ()=>{
            	return {
	                fksd: 0, 
	                fktd: 0,
	                yyxg: 0,
	                zhpjnr:null
	            }
            },
            required: true

        },
        xcObj:{
            type:Object,
            default:()=>{
            	return {}
            },
            required: true
        },
        dirTaskFileSX:{
            type:Array,
            default:()=>{
            	return []
            },
            require:true
        },
        dirTaskFileRW:{
            type:Array,
            default:()=>{
            	return []
            },
            require:true
        },
        dirTaskFile:{
             type:Array,
            default:()=>{
            	return []
            },
            require:true
        },
        isPj:{
            type:Boolean,
            default:true
        },
        pjObj:{
            type:Object,
            default:()=>{
            	return {}
            },
            require:true
		},
		title:{
			type: String,
			default: '',
			required: true
		},
    },
    data(){
    	return {
    		show:this.visible
    	}
    },
    watch:{
    	visible(val){
    		this.show=val;
    	}
    },
  methods:{
	  handlePrev(item) {
			this.$emit('handlePrev', item)
			this.$emit('handlePrevv', item)
     },
      closeModel(){
		  this.$emit('closeModel')
		  this.$emit('qqxcdpjcloseModel')
		  
      },
      saveInfo(){
		  this.$emit('saveInfo')
		  this.$emit('qqxcdpjsaveInfo')

		  
      }
  }
}
</script>

<style>

</style>
