<template>
	<div class="my-interest-ct">
			<!-- <Form ref="formDynamic" :model="formDynamic" inline>
				<FormItem label="姓名/所属人：" :label-width="90">
					<Input type="text" clearable v-model.trim="formDynamic.name" placeholder="请输入姓名/所属人"></Input>
				</FormItem>
				<FormItem label="身份证：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.persons" placeholder="请输入身份证"></Input>
				</FormItem>
                <FormItem label="车牌号：" :label-width="84">
					<Input type="text" clearable v-model.trim="formDynamic.persons" placeholder="请输入车牌号"></Input>
				</FormItem>
				<FormItem label="类型：" :label-width="84">
					<Select v-model.trim="formDynamic.status" filterable>
						<Option v-for="item in typeList" :value="item.code" :key="item.code">{{item.title}}</Option>
					</Select>
				</FormItem>
				<Button type="primary" class="searchBtn" @click="search">查询</Button>
			</Form> -->
            <div>
                <Button type="primary" class="searchBtn" @click="handleaddModal">添加</Button>
                <Button type="text" class="cancelBtn" @click="search">关注</Button>
                <Button type="text" class="cancelBtn" @click="search">不关注</Button>
            </div>
			<div class="table-ct">
				<el-table :data='data' :stripe="true" height='100%'>
					<el-table-column label="编号" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.actKey">{{scope.row.actKey}}</span>
						</template>
					</el-table-column>
					<el-table-column label="姓名/所属人" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.startUserName">{{scope.row.startUserName}}</span>
						</template>
					</el-table-column>
					<el-table-column label="类型" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.productName">{{scope.row.productName}}</span>
						</template>
					</el-table-column>
					<el-table-column label="身份证" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.taskName">{{scope.row.taskName}}</span>
						</template>
					</el-table-column>
					<el-table-column label="车牌号" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.busName">{{scope.row.busName}}</span>
						</template>
					</el-table-column>
					<el-table-column label="添加来源" align="center">
						<template slot-scope="scope">
							<span :title="scope.row.createTime">{{scope.row.createTime|timestampToTime}}</span>
						</template>
					</el-table-column>
					<el-table-column label="状态" align="center">
						<template slot-scope="scope">
							<span>待审批</span>
						</template>
					</el-table-column>
          <el-table-column label="添加时间" align="center">
						<template slot-scope="scope">
							<span>待审批</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope" >
							<a href="javascript:void(0)" @click="handleRow(scope.row)">处理</a>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination-ct">
                <Page class="clientPage"
                    :total="total" show-sizer placement="top"
                    :current.sync="basePage.pageNum"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange"
                    :page-size.sync="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total>
                </Page>
			</div>
        <div>
            <add-modal :show.sync="isaddModal"></add-modal>
        </div>
	</div>
</template>
<script>
import api from "@/fetch/api";
import addModal from "./addModal.vue";
export default {
  components: {
    addModal
  },
  data() {
    return {
      isaddModal: false,
      data:[],
      pageArray: [10, 20, 30],
      basePage: {
        current: 1,
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      height: 0,
      typeList: []
    };
  },
  mounted() {
   
  },
  methods: {
    render() {},
    search() {},
    pageChange() {},
    pageSizeChange() {},
    handleaddModal(){
        this.isaddModal = true;
    }
  }
};
</script>
<style lang="less">
    .my-interest-ct {
        height: 100%;
        .table-ct {
            height:calc(~'100% - 150px');
        }
        .ivu-table-wrapper {
            height:100%;
        }
    }
</style>