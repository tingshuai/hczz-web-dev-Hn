<template>
	<div class="workFlow">
		<el-table :data="zahcstatuslist" border style="width: 100%">
			<el-table-column prop="mkmc" label="业务模块">
			</el-table-column>
			<el-table-column prop="ywmc" label="业务名称">
			</el-table-column>
			<el-table-column fixed="right" label="操作" min-width="300px">
				<template slot-scope="scope">
          <el-radio-group v-model="scope.row.czzt">
            <el-radio :name="scope.row.ywzt" label="0">默认组长</el-radio>
            <el-radio :name="scope.row.ywzt" label="1">委派组长</el-radio>
          </el-radio-group>
        </template>
			</el-table-column>
		</el-table>
		<div class="btn margin-top-20">
			<el-button size="small" @click="sbmit">保存</el-button>
		</div>
	</div>
</template>

<script>
import api from "@/fetch/api.js";

	export default {
		data() {
			return {
				basePage: {
				pageindex: 1,
				pagesize: 10
        		},
				zahcstatuslist:[],
			}
		},
		created(){
			 api.api("get", api.configUrl + "/hczz/xtpz/ywlcgl/queryYwlcglList",this.basePage)
				.then(res => {
					this.zahcstatuslist = res.list
				});
		},
		methods:{
			sbmit(){
				api.api("post", api.configUrl + "/hczz/xtpz/ywlcgl/updateYwlcgl",this.zahcstatuslist)
				.then(res => {
						this.$message.success('保存成功')
				});
			}
		}
	}
</script>
<style type="text/css">
	.workFlow{
		height: 100%;
		background: #fff;
		padding: 20px;
	}
</style>



