<template>
  <el-card shadow="always" class="directive-ct directive-check-ct" style="background: #f0f0f0;border:none">  
    <!-- <div class="top">
      <el-form :inline="true" class="demo-form-inline theinput">
        <el-form-item label="案件名称：">
          <el-input v-model="basePage.ajmc" size="small" placeholder="请输入案件名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人：">
          <el-input v-model="basePage.sqrxm" size="small" placeholder="请输入申请人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <Form inline :label-width="75" class="search-ct">
      <FormItem label="案事件名称：">
        <Input type="text" v-model="basePage.ajmc"  placeholder="请输入案事件名称" clearable style="width: 180px"></Input>
      </FormItem>
      <FormItem label="申请人：">
        <Input type="text" v-model.trim="basePage.sqrxm" placeholder="请输入申请人" clearable style="width: 180px"></Input>
      </FormItem>
      <FormItem label="申请时间：">
        <DatePicker type="daterange"   clearable placement="bottom-end" placeholder="请选择申请时间" style="width: 180px" @on-change="handleDate"></DatePicker>
      </FormItem>
      <Button type="primary" class="searchBtn" @click="search" style="margin-right:8px;">查询</Button>
    </Form>
    <Modeldqs
      :visible="visible"
      :formValidate="formValidate"
      :zlObj="zlObj"
      :title="title"
      :spyjObj="spyjObj"
      :dirTaskFileSX="dirTaskFileSX"
      :dirTaskFileRW="dirTaskFileRW"
      :flag="flag"
      @closeModel="closeModel"
      @saveInfo="saveInfo"
      @handlePrev="handlePrev"
      >

    </Modeldqs>
    <div class="table-ct myTable" :style="{height:height}">
      <el-table :data='list' :stripe="true" height="100%" :row-class-name="tableRowClassName">
        <el-table-column label="编号" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :title="scope.row.sqwh">{{scope.row.sqwh}}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :title="scope.row.sqr">{{scope.row.sqr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请单位" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :title="scope.row.sqbmmc">{{scope.row.sqbmmc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="案事件名称" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :title="scope.row.ajmc">{{scope.row.ajmc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="简要任务内容" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :title="scope.row.jyrwnr" class="sl">{{scope.row.jyrwnr}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="联系电话" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :title="scope.row.sqrlxdh">{{scope.row.sqrlxdh}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="申请时间" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="span-dqzt" :title="scope.row.sqrq">{{scope.row.sqrq|timestampToTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="span-dqzt" :title="scope.row.zt">{{scope.row.zt|ztFilter}}</span>
						<Icon v-if="scope.row.zt == 1 || scope.row.zt == 2" type="ios-alarm-outline" />						
						<span style="font-size:12px;" v-if="scope.row.zt == 1">{{ scope.row.showTimeQs || "00:00:00" }}</span>
						<span style="font-size:12px;" v-if="scope.row.zt == 2">{{ scope.row.showTimeFk || "00:00:00" }}</span>            
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <a class="a-czl" href="javascript:void(0)" v-if="scope.row.zt < 2" @click="handleRow(scope.row)">签收</a>
            <a class="a-czl" href="javascript:void(0)" v-if="scope.row.zt < 2" @click="goOut(scope.row)">退回</a>
            <a class="a-czl" href="javascript:void(0)" @click="lookData(scope.row)">查看</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-ct">
      <Page class="clientPage" style="display: inline-block;" :total="total" :current.sync="basePage.pageindex" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pagesizeChange" :page-size.sync="basePage.pagesize" :page-size-opts="pageArray" show-elevator show-total></Page>

      <!-- <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="basePage.pageindex" :page-sizes="pageArray" :page-size="10" :total="total">
      </el-pagination> -->
    </div>
    <!--退回弹窗-->
    <Modal v-model="deterShow" title="退回" class="modal-ct" :styles="{top: '350px',width:'280px'}" @on-cancel="deterShow=false">
      <div slot="footer" class="font-size-0">
        <Button type="default" class="cancelBtn" @click="deterShow=false">取消</Button>
        <Button type="primary" class="sureBtn" @click="deterBtn">确定</Button>
      </div>
      <div>
        <el-form>
          <el-form-item label="退回原因:">
            <el-input type="textarea"  :maxlength="100" v-model.trim="jsdwbz" ></el-input>
          </el-form-item>
        </el-form>

      </div>
    </Modal>
    <!--<look ref="look"></look>-->
  </el-card>
</template>

<script>
  import $ from 'jquery';
  import api from '@/fetch/api.js';
  import Modeldqs from './models/modeldqs.vue';
  export default {
      data () {
          return {
              gabackid: '', // 退回id
              jsdwbz: '', // 退回原因
              deterShow: false, // 退回

              basePage: {
                  pageindex: 1,
                  pagesize: 10,
                  ajmc: null,
                  sqrxm: null,
                  ywlx: api.ywlx.qx,
                  tszt: '1',
                  zt: '1',
                  starttime: '',
                  endtime: ''
              },
              title: '',
              officeList: [],
              pageArray: [10, 20, 30, 40],
              total: 0,
              list: [],
              listOffice: [],
              height: 0,
              formValidate: {
                  sqlx: '1',
                  sabjbh: null,
                  ajmc: null,
                  jyrwnr: null,
                  bz: null,
                  jqajlx: null,
                  parentid: null
              },
              // rules: {
              //   remark: [{
              //     required: true,
              //     message: "请填写审批意见",
              //     trigger: "blur"
              //   }]
              // },
              resetObj: {
                  attach: [],
                  dwgl: [],
                  procedFileArr: [], // 手续附件
                  TaskFileArr: [] // 任务附件
              },
              visible: false,
              zlObj: {},
              flag: false, // 编辑or新增
              dirTaskFileSX: [], // 编辑时获取的手续附件列表
              dirTaskFileRW: [], // 编辑时获取任务附件列表
              spyjObj: []
          };
      },
      components: {
          Modeldqs
      },
      computed: {
          userInfo () {
              return JSON.parse($.cookie('user'));
          }
      },
      mounted () {
          this.$nextTick(() => {
              this.render();
              this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
              window.onresize = () => {
                  this.height = $(window).height() - $('.search-ct').height() - 260 + 'px';
              };
          });
      },
      methods: {
          timeDown(){
            clearInterval( this.interval );
            this.interval = setInterval(() => {
              this.list.forEach((row,i,arr) => {
                let _qs = new Date(row.sqrq + row.qssx*60000).getTime() - Date.now();
                let _fk = new Date(row.sqrq + row.fksx*60000).getTime() - Date.now()
                _qs < 1000 ? this.$set(arr[i],"showTimeQs","00:00:00") : this.$set(arr[i],"showTimeQs",this.formatDuring(_qs) );
                _fk < 1000 ? this.$set(arr[i],"showTimeFs","00:00:00") : this.$set(arr[i],"showTimeFk",this.formatDuring(_fk) );
              });
            }, 1000);
          },
          tableRowClassName({row, rowIndex}) {
            let _timefksj = new Date(row.sqrq + row.fksx*60000).getTime() - Date.now()
            let _timeqssj = new Date(row.sqrq + row.qssx*60000).getTime() - Date.now();
            if (( row.zt === "1" && _timeqssj < 3600*1000 && _timeqssj > 1000 )||( row.zt === "2" && _timefksj < 3600*1000 && _timefksj > 1000 )) {//待签收待反馈低于1小时...
              return 'nearly'
            }else if( ( row.zt === "1" && _timeqssj < 1000 )||( row.zt === "2" && _timefksj < 1000 )){//代签收待反馈超时....
              return "chaoshi"
            }else{
              return 'white';
            }
          },
          formatDuring(mss) {
            var hours = parseInt(mss / (1000 * 60 * 60) );
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (mss % (1000 * 60)) / 1000;
            return ( hours<10 ? `0${hours}` : hours ) + ":" + (parseInt(minutes)<10 ? `0${minutes}` : minutes) + ":" + (parseInt(seconds)<10 ? `0${parseInt(seconds)}` : parseInt(seconds) );
          },        
          pageChange (val) {
              this.basePage.pageindex = val;
              this.render();
          },
          pagesizeChange () {
              this.basePage.pagesize = val;
              this.render();
          },
          deterBtn () {
              if (this.jsdwbz == '') {
                  this.$message.error('请输入退回原因');
              } else {
                  let params = {};
                  params.id = this.zlObj.id;
                  api.api('get', api.configUrl + '/hczz/qqxc/refuse/' + this.zlObj.id, {
                      jsdwbz: this.jsdwbz
                  }).then(res => {
                      this.$message.success('请求已退回');
                      this.render();
                      this.deterShow = false;
                  });
              }
          },
          // 点击退回弹窗显示
          goOut (row) {
              this.jsdwbz = '';
              //        this.getSpyj(row.id);
              this.zlObj = row;
              this.getRWFile(row.id);
              this.getSXFile(row.id);

              this.gabackid = row.id;
              this.deterShow = true;
          },
          render () {
              this.list = [];
              api.api('post', api.configUrl + '/hczz/qqxc/querySqxxList', this.basePage).then(res => {
                  this.list = res.list;
                  this.total = res.total;
                  this.timeDown();
              });
          },
          closeModel () {
              this.visible = false;
              this.officeList = [];
              this.resetObj.dwgl = [];
              this.formValidate = {
                  sqlx: '1',
                  sabjbh: null,
                  ajmc: null,
                  jyrwnr: null,
                  bz: null,
                  jqajlx: null,
                  parentid: null
              };
          },
          saveInfo () {
              let params = {};
              params.id = this.zlObj.id;
              api.api('post', api.configUrl + '/hczz/qqxc/sqxxQs', {
                  id: this.zlObj.id
                  //    rwzt: 2
              }).then(res => {
                  this.$message.success('签收成功');
                  this.closeModel();
                  this.render();
              });
          },
          handleRow (val) {
              this.visible = true;
              //        this.getSpyj(val.id);
              this.title = '编号：' + val.sqwh;
              this.flag = false;
              this.zlObj = val;
              this.getRWFile(val.id);
              this.getSXFile(val.id);
              this.visible = true;
          },
          lookData (val) {
              this.zlObj = val;
              //        this.getSpyj(val.id);
              this.title = '编号：' + val.sqwh;
              this.flag = true;
              this.getRWFile(val.id);
              this.getSXFile(val.id);
              this.visible = true;
          },
          search () {
              this.basePage.pageindex = 1;
              this.render();
          },
          handleSizeChange (val) {
              this.basePage.pagesize = val;
              this.render();
          },
          handleCurrentChange (val) {
              this.basePage.pageindex = val;
              this.render();
          },
          getRWFile (id) {
              api.api('post', api.configUrl + '/hczz/fj/getFjData', {
                  glid: id,
                  tablename: 'T_HCZZ_SQXX',
                  type: '2'
              }).then(res => {
                  this.dirTaskFileRW = res;
              });
          },
          getSXFile (id) {
              api.api('post', api.configUrl + '/hczz/fj/getFjData', {
                  glid: id,
                  tablename: 'T_HCZZ_SQXX',
                  type: '1'
              }).then(res => {
                  this.dirTaskFileSX = res;
              });
          },
          handlePrev (val) {
              api.upload(val);
          },
          handleDate (val) {
              if (val[0] != '') {
                  this.basePage.starttime = new Date(`${val[0]} 00:00:00`);
                  this.basePage.endtime = new Date(`${val[1]} 23:59:59`);
              } else {
                  this.basePage.starttime = '';
                  this.basePage.endtime = '';
              }
          }
          //      getSpyj(id) {
          //        api.api('get', api.configUrl + '/hczz/common/clrz/getSpClrzList', {
          //                    glid:id
          //        }).then(res => {
          //          this.spyjObj = res;
          //          $.each(this.spyjObj, (index, val) => {
          //            val.src = '';
          //            api.api('get', api.systemUrl + '/account/info/detail?id=' + val.zxrid).then(res => {
          //              this.spyjObj[index].src = "http://10.166.116.17/yth/picture/" + res.idCard + ".jpg";
          //              $('.lcInfo-t img').eq(index).attr('src', "http://10.166.116.17/yth/picture/" + res.idCard + ".jpg")
          //            })
          //          })
          //        })
          //      }
      }
  };
</script>

<style scoped lang="less">
	.myTable{
		/deep/ .chaoshi {
			background: #faa6a7;
		}
		/deep/ .nearly {
			background: #ffddab;
		}
		/deep/ .over{
			background:white;
		}
		.orSpan {
			color: orange;
		}
		.blSpan {
			color: #333333;
		}
	}
  .searchTree {
    position: absolute;
    z-index: 99;
    width: 100%;
    height: 240px;
    background: #002448;
    overflow: auto;
  }
  .modal-ct .el-form-item{
    margin-bottom: 0;
  }
  .searchTree .el-form--inline .el-form-item__content {
    width: 150px;
  }
  
  .el-form-item__content .oSpan {
    word-break: break-all;
  }
  
  .file .el-form-item__content {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .sl {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  
  .el-dialog .el-form-item__content .tastFile {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .bg-green {
    background: linear-gradient(to bottom, #046517, #02440d);
  }
  
  .bg-blue {
    background: linear-gradient(to bottom, #012142, #02132c);
  }
  
  .triangle-up {
    width: 0;
    height: 0;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #046517;
    position: absolute;
    top: 35px;
    left: 100px;
  }
  
  .border-b-green {
    border-bottom: 1px solid #0c8f35;
  }
  
  .border-b-blue {
    border-bottom: 1px solid #004672;
  }
  
</style>