<template>
	<div>
		<div class="clearfix">
			<Modal v-model="visible" title="选择人员" class="modal-ct deparmentModal" width="900" :styles="{top: '20px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">取消</Button>
					<Button type="primary" class="sureBtn" @click="sure">确定</Button>
				</div>
				<Form ref="formDynamic" :model="formDynamic" :rules="ruleValidate" inline class="margin-top-10">
					<ul class="oUl">
						<li>
							<FormItem label="警种简称：" :label-width="84" prop="jzbh">
								<el-select v-model="formDynamic.jzbh" :disabled="disabled" filterable>
									<el-option v-for="item in jzList" :key="item.value" :value="item.value" :label="item.dictName"></el-option>
								</el-select>
							</FormItem>
							<div class="selected">
								<h4>已配置处理部门：</h4>
								<div>
									<p class="selectSpan" v-for="(item,index) in selectList" :key="index">
										{{item.bmqc}}
										<i class="el-icon-circle-close-outline" @click="del(index)"></i>
									</p>
								</div>
							</div>
						</li>
						<li class="firstLi">
							<FormItem label="处理部门：" :label-width="84" prop="time">
								<el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
							</FormItem>
							<el-tree style="display:block" class="filter-tree" :data="officeTree" :props="defaultProps" @node-click="nodeClick" :filter-node-method="filterNode" ref="tree2">
							</el-tree>

						</li>
					</ul>
				</Form>

			</Modal>
		</div>
	</div>
</template>
<script>
	import api from "@/fetch/api.js"
	export default {
		props: {
           show:{type:Boolean,default:false},
		},
		data() {
			return {
				visible: this.show,
				formDynamic: {
					jzjc:null,
					jzbh:null
				},
				ruleValidate: {
					jzbh:[{
						required:true,
						message:'警种编号为必填项',
						trigger:'blur'
					}]
				},
				jzList: [],
				selectList: [],
				officeTree: [],
				defaultProps: {
					children: 'children',
					label: 'title'
				},
				filterText: '',
				id:'',
				disabled:false
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree2.filter(val);
			},
			show(val){
				this.visible=val;
			},
			'formDynamic.jzbh'(val){
				console.log(val)
				if(val){
					this.getTree(val);
					this.formDynamic.jzjc=this.jzList.filter(value=>{
						return value.value==val
					})[0].dictName
					if(!this.id){
						this.selectList=[];
					}
				}
			}
		},
		created() {
            this.getJz();
            this.getTree();
		},
		methods: {
			cancelBtn() {
               this.$refs.formDynamic.resetFields();
               this.selectList=[];
               this.disabled=false;
               this.$emit('closeModal');
			},
			sure() {
               let obj={
               	jzbh:this.formDynamic.jzbh,
               	jzjc:this.formDynamic.jzjc,
               	jzbmList:this.selectList,
               	id:this.id
               };
//             this.selectList.forEach(item=>{
//             	 obj.jzbmList.push({
//             	 	bmbh:item.code,
//             	 	bmjc:item.simpleName,
//             	 	bmqc:item.title
//             	 })
//             })
               let urls=this.id ? '/hczz/jzpz/updateJzpz' : '/hczz/jzpz/insertJzpz';
               api.api('post',api.configUrl+urls,obj).then(res=>{
               	this.$message.success('保存成功')
               	this.cancelBtn();
               })
			},
			editModal(val){
				this.selectList=$.extend(true,[],val.jzbmList);
				this.id=val.id;
				this.formDynamic.jzbh=val.jzbh;
				this.disabled=true;
			},
			getJz(){
				api.api('post',api.systemUrl+'/dict/findDictValidCondition?dictType=BMLX').then(res=>{
					this.jzList=res;
				})
			},
			filterNode(value, data) {
				if(!value) return true;
				return data.title.indexOf(value) !== -1;
			},
			nodeClick(val){
				let hash={};
				this.selectList.push({
					bmbh:val.code,
					bmjc:val.simpleName,
					bmqc:val.title
				});
				this.selectList=this.selectList.reduce((item,next)=>{
					hash[next.bmbh]?'': hash[next.bmbh]=true && item.push(next)
					return item
				},[])
			},
			del(index){
				this.selectList.splice(index,1);
			},
			getTree(val){
				api.api('post',api.systemUrl+'/office/findOfficeTreeOneByOne',{
					type:val
				}).then(res=>{
					this.officeTree=res;
					this.officeTree.map(item=>{
						if(item.children.length==1 && !item.children[0].id){
							item.children=[];
						}
					});
				})
			}
		}
	}
</script>
<style lang="less">
	.deparmentModal {
		.oUl {
			display: flex;
			justify-content: flex-start;
			padding: 20px 20px 0 20px;
			border: 1px solid #ececec;
			li {
				width: 49%;
				.selected {
					h4 {
						margin-bottom: 20px;
					}
					.selectSpan {
						padding: 10px 10px;
						border: 1px solid #ECECEC;
						border-radius: 5px;
						position: relative;
						margin-right: 15px;
						float: left;
						margin-right: 20px;
						margin-bottom: 20px;
						i {
							position: absolute;
							right: -5px;
							top: -5px;
							font-size: 20px;
						}
					}
				}
			}
			.firstLi {
				border-left: 1px solid #ECECEC;
				padding-bottom: 20px;
				.el-tree{
					height: 500px;
					overflow: auto;
				}
			}
		}
	}
</style>