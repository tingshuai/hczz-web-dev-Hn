<template>
	<!-- <div > -->
		
		<div id="xscj" class="box-cj" >
			<Form :model="formItem" :label-width="125" :rules="ruleValidate">
				
				<table class="tab-box">
					<tr>
						<td>
							<FormItem label="情报线索类别" prop="qbxslb" class="middle">
								<Select v-model="formItem.qbxslb" placeholder="请选择类别" style="width:246px">
									<Option value="beijing">情报线索类别1</Option>
									<Option value="shanghai">情报线索类别2</Option>
									<Option value="shenzhen">情报线索类别3</Option>
								</Select>
							</FormItem>
						</td>
						<td>
							<FormItem label="线索等级" prop="xsdj" class="middle">
								<Select v-model="formItem.xsdj" placeholder="请选择线索等级" style="width:246px;text-align:left">
									<Option value="beijing">线索等级1</Option>
									<Option value="shanghai">线索等级2</Option>
									<Option value="shenzhen">线索等级3</Option>
								</Select>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="紧急程度" prop="jjcd" class="middle">
								<Select v-model="formItem.jjcd" placeholder="请选择紧急程度" style="width:246px">
									<Option value="beijing">紧急程度1</Option>
									<Option value="shanghai">紧急程度2</Option>
									<Option value="shenzhen">紧急程度3</Option>
								</Select>
							</FormItem>
						</td>
						<td>
							<FormItem label="按事件标识" prop="asjbs" class="middle">
								<Select v-model="formItem.asjbs" placeholder="请选择标识" style="width:246px;text-align:left">
									<Option value="beijing">标识1</Option>
									<Option value="shanghai">标识2</Option>
									<Option value="shenzhen">标识3</Option>
								</Select>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="标题" prop="bt">
								<Input v-model="formItem.bt" placeholder="请输入标题" style="width:300px">
								</Input>
							</FormItem>
						</td>
						<td>
							<FormItem label="关键词" prop="gjc" class="middle">
								<Input v-model="formItem.gjc" placeholder="请输入标题" style="width:246px">
								</Input>
								<Button type="default" @click="changeGjc">选择</Button>
								<Button type="default" @click="emptyGjc">清空</Button>
							</FormItem>
						</td>
					</tr>
					<tr><td colspan="2">
						<FormItem label="信息正文" prop="desc">
							<Input v-model="formItem.desc" type="textarea" :autosize="{minRows: 3}" placeholder="请输入信息正文(最多200字)!" style="width:90%"></Input>
							<span class="lenSpan">{{formItem.desc.length}}/200</span>
						</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="采集人" prop="cjr">
								<Input v-model="formItem.cjr" placeholder="请输入采集人" style="width:246px">
								</Input>
							</FormItem>
						</td>
						<td>
							<FormItem label="采集单位" prop="cjdw">
								<Input v-model="formItem.cjdw" placeholder="请输入采单位" style="width:246px">
								</Input>
							</FormItem>
						</td>
					</tr>

					<tr><td><FormItem label="填报人" prop="tbr">
								<Input v-model="formItem.tbr" placeholder="请输入填报人" style="width:246px">
								</Input>
							</FormItem></td>
						<td><FormItem label="附件">
								<Upload ref="upload" multiple action="//jsonplaceholder.typicode.com/posts/">
									<Button style="width: 246px;">&#x3000;&#x3000;&#x3000;&#x3000;</Button>
									<Button type="default" @click="getFjFiles">浏览</Button>
								</Upload>
						<!-- <loadFile @on-change="getFjFiles" ref="fj"></loadFile> -->
							</FormItem></td></tr>
					<tr>
						<td>
							<FormItem label="涉事主体" prop="sszt" class="middle">
								<Select v-model="formItem.sszt" placeholder="请选择涉事主体" style="width:246px">
									<Option value="beijing">涉事主体1</Option>
									<Option value="shanghai">涉事主体2</Option>
									<Option value="shenzhen">涉事主体3</Option>
								</Select>
							</FormItem>
						</td>
						<td>
							<FormItem label="涉及损失" prop="sjss" class="middle">
								<Select v-model="formItem.sjss" placeholder="请选择涉及损失" style="width:246px">
									<Option value="beijing">涉及损失1</Option>
									<Option value="shanghai">涉及损失2</Option>
									<Option value="shenzhen">涉及损失3</Option>
								</Select>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="涉事类别" prop="sslb" class="middle">
								<Input v-model="formItem.sslb" placeholder="请输入涉事类别" style="width:246px">
								</Input>
								<Button type="default" @click="changeGjc">选择</Button>
								<Button type="default" @click="emptyGjc">清空</Button>
							</FormItem>
						</td>
						<td>
							<FormItem label="表现形式" prop="bxxs" class="middle">
								<Select v-model="formItem.bxxs" placeholder="请选择表现形式" style="width:246px">
									<Option value="beijing">表现形式1</Option>
									<Option value="shanghai">表现形式2</Option>
									<Option value="shenzhen">表现形式3</Option>
								</Select>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="涉事人数" prop="ssrs" class="middle">
								<Select v-model="formItem.ssrs" placeholder="请选择涉事人数" style="width:246px">
									<Option value="beijing">涉事人数1</Option>
									<Option value="shanghai">涉事人数2</Option>
									<Option value="shenzhen">涉事人数3</Option>
								</Select>
							</FormItem>
						</td>
						<td>
							<FormItem label="涉案地点类别" prop="saddlb" class="middle">
								<Select v-model="formItem.saddlb" placeholder="请选择涉案地点类别" style="width:246px">
									<Option value="beijing">涉案地点类别1</Option>
									<Option value="shanghai">涉案地点类别2</Option>
									<Option value="shenzhen">涉案地点类别3</Option>
								</Select>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="涉事诱因" prop="ssyy" class="middle">
								<Select v-model="formItem.ssyy" placeholder="请选择涉事诱因" style="width:246px">
									<Option value="beijing">涉事诱因1</Option>
									<Option value="shanghai">涉事诱因2</Option>
									<Option value="shenzhen">涉事诱因3</Option>
								</Select>
							</FormItem>
						</td>
						<td>
							<FormItem label="涉案发生地省市" prop="safsd" class="middle">
								<Input v-model="formItem.safsd" placeholder="请输入涉案发生地" style="width:246px">
								</Input>
								<Button type="default" @click="changeGjc">选择</Button>
								<Button type="default" @click="emptyGjc">清空</Button>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="涉案时间" prop="sasj" class="middle">
								<DatePicker type="date" placeholder="请填入涉案时间" style="width: 246px"></DatePicker>	
							</FormItem>
						</td>
						<td>
							<FormItem label="发生部位" prop="fsbw" class="middle">
								<Select v-model="formItem.fsbw" placeholder="请选择涉事诱因" style="width:246px">
									<Option value="beijing">头部1</Option>
									<Option value="shanghai">中间2</Option>
									<Option value="shenzhen">底部3</Option>
								</Select>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<FormItem label="发生地详址" prop="fsdxz">
								<Input v-model="formItem.fsdxz" placeholder="请输入发生地" style="width:90%">
								</Input>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="事发敏感时期" prop="sfmgsq" class="middle">
								<Select v-model="formItem.sfmgsq" placeholder="请选择事发敏感时期" style="width:246px">
									<Option value="beijing">事发敏感时期1</Option>
									<Option value="shanghai">事发敏感时期2</Option>
									<Option value="shenzhen">事发敏感时期3</Option>
								</Select>
							</FormItem>
						</td>
						<td>
							<FormItem label="涉及重大安保活动" :label-width="125" prop="sjzdabhd" class="middle">
								<Select v-model="formItem.sjzdabhd" placeholder="请选择" style="width:246px">
									<Option value="beijing">活动1</Option>
									<Option value="shanghai">活动2</Option>
									<Option value="shenzhen">活动3</Option>
								</Select>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td>
							<FormItem label="涉及物品" prop="sjwp" class="middle">
								<Input v-model="formItem.sjwp" placeholder="请输入涉及物品" style="width:246px">
								</Input>
								<Button type="default" @click="changeGjc">选择</Button>
								<Button type="default" @click="emptyGjc">清空</Button>
							</FormItem>
						</td>
						<td>
							<FormItem label="插手迹象" prop="csjx">
								<Input v-model="formItem.csjx" placeholder="请输入" style="width:246px">
								</Input>
							</FormItem>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<FormItem label="网络媒体互动情况" :label-width="125" prop="wlmt">
								<Input v-model="formItem.wlmt" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入" style="width:90%"></Input>
							</FormItem>
						</td>
					</tr>					
				</table>	
				<!--<div >
					<Button type="primary" @click="send">转到导出页面</Button>
					<router-link to="/checkMange">转到</router-link>	
					<router-link to="export">123</router-link>
				</div>-->
			</Form>
		</div>
		<!--</Scroll >-->
	<!-- </div> -->
</template>

<script>
	import Upload from '@/views/main-components/file-upload/loadFile.vue';
	import $ from 'jquery';
	import api from '@/fetch/api';
	export default{
		name:'login',
		data(){
			return {
				formItem: {
					qbxslb: "",
					xsdj:'',
					jjcd:'',
					asjbs:'',
					bt:'',
					gjc:'',
					desc:'',
					cjr:'',
					cjdw:'',
					tbr:'',
					sszt:'',
					sjss:'',
					sslb:'',
					bxxs:'',
					ssrs:'',
					saddlb:'',
					ssyy:'',
					safsd:'',
					fsbw:'',
					fsdxz:'',
					sfmgsq:'',
					sjzdabhd:'',
					sjwp:'',
					csjx:'',
					wlmt:'1'
				},
				ruleValidate: {
                    xsdj: [{ required: true, message: '线索等级不能为空', trigger: 'change' }],
					jjcd:[{ required: true, message: '紧急程度不能为空', trigger: 'change' }],
					bt: [{required: true,message: "标题不能为空",trigger: "blur"}],
					desc: [
                        { required: true, message: '请填入信息正文', trigger: 'blur' },
                        { type: 'string', max: 200, message: '最多输入200字!', trigger: 'blur' }
                    ],
					cjr:[{required: true,message: "采集人不能为空",trigger: "blur"}],
					cjdw:[{required: true,message: "采集单位不能为空",trigger: "blur"}],
                }
			}
		},
		methods:{
			changeGjc(){
				console.log('gjc')
			},
			emptyGjc(){
				this.formItem.gjc = '';
			},
			getFjFiles(){

			},
			send(){
				this.$router.push('/export')
			}
		}
	}
</script>

<style lang="less">
	.ivu-form .ivu-form-item-label{
		font-size: 14px;
	}
	.ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
		font-size: 14px;
	}
	.ivu-form-item{
		margin-bottom: 0;
	}
	#xscj.box-cj{
		font-size: 14px;
		padding: 18px;
		overflow-y:auto;
		background: #FFFFFF;
		.tab-box{
			width: 100%;
			border-collapse:collapse;
			td {
				border: 1px solid lightgray;
				padding:17px 0;
				text-align: left;
			}
			.lenSpan{
				position: absolute;
				color: #6c6c6c;
				bottom: 0;
				right:calc(~"30px + 10%") ;
			}
		}
	}	
	

</style>