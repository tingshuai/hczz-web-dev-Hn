<template>
	<div class="addTask tableStyle">
		<Modal v-model="visible" title="任务详情" class="modal-ct" width="1000" :styles="{top: '250px'}" @on-cancel="cancelBtn">
				<div slot="footer" class="font-size-0">
					<Button type="default" class="cancelBtn" @click="cancelBtn">关闭</Button>
				</div>
				<el-form>
					<el-form-item :label="mbItem.mbmc+':'" label-width="120px" v-for="(mbItem,mbIndex) in list.mbList" :key="item.id" v-if="mbItem.children">
						<div class="tableStyle">
							<table border="1" cellspacing="0">
								<tr>
									<th class="xhTh">序号</th>
									<th class="contentTh" v-for="(thItem,thIndex) in mbItem.children">{{thItem.mbmc}}</th>
								</tr>
								<tr v-for="(item,index) in mbItem.children[0].data">
									<th class="xhTh">{{index+1}}</th>
									<th class="contentTh" v-for="(thItem2,thIndex2) in mbItem.children" :title="thItem2.data[index].value">
										{{thItem2.data[index].value}}
									</th>
								</tr>
						</table>
						</div>
					</el-form-item>
					<el-form-item :label="mbItem.mbmc+':'" label-width="120px" v-else>
						<p style="word-wrap: break-word;">{{mbItem.data[0].value}}</p>
					</el-form-item>
				</el-form>
			</Modal>
		
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import { uniqueArr } from '@/libs/common/common';
	export default {
	    props: {
	        show: {
	            type: Boolean,
	            default: false
	        },
	        params: {
	            type: Object,
	            default: {}
	        }
	    },
	    data () {
	        return {
	            visible: this.show,
	            list: this.params
	        };
	    },
	    watch: {
	        show (val) {
	            this.visible = val;
	        },
	        params (val) {
	            this.list = val;
	        }
	    },
	    methods: {
	        cancelBtn () {
	            this.$emit('update');
	        }
	    }
	
	};
</script>
<style lang="less" scoped>
	table{
		tr{
			display: flex;
			th{
				width: 50%;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			/*.xhTh{
				width: 90px !important;
			}*/
		}
	}
</style>