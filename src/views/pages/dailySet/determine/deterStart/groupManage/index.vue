<template>
	<div>
		<div class="clearfix">
			<Modal v-model="show" title="小组管理" class="modal-ct" width="900" :styles="{top: '20px'}">
				<div>
					<el-tabs v-model="activeName"  @tab-click="handleClick">
						<el-tab-pane label="副组长" name="pendragon">
							<pendragon></pendragon>
						</el-tab-pane>
						<el-tab-pane label="组员" name="member">
							<member></member>
						</el-tab-pane>
					</el-tabs>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
	import pendragon from './pendragon';
	import member from './member';
	export default {
		components: {
			pendragon,
			member
		},
		
		data() {
			return {
				activeName: 'pendragon',
				title:'小组管理',
				show:false
			}
		},
		mounted() {

		},
		methods: {
			handleClick(tab, event) {
				
			}
		}
	};
</script>
<style lang="less">
	.formApprove{
		padding-top: 20px;
		border-top: 1px solid #dddee1;
	}
</style>