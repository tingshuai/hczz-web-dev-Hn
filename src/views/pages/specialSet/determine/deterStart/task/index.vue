<template>
  <div class="taskIndex">
    <task :taskList="setTaskList" @over="over"  :zt="zt" ref="task"></task>
    <div class="btnDiv" v-show="careBtnShow">
      <Button @click="careBtn">关注</Button>
    </div>
    <!--签收-->
    <Modal v-model="deterShow" title="签收" class="modal-ct" :styles="{top: '250px',width:'250px'}" @on-cancel="deterShow=false">
      <div slot="footer" class="font-size-0">
        <Button type="default" class="cancelBtn" @click="deterShow=false">取消</Button>
        <Button type="primary" class="sureBtn" @click="deterBtn">确定</Button>
      </div>
      <div>
        <h3>确认签收</h3>
      </div>
    </Modal>
    <!--反馈-->
    <div v-if="feedbackShow">
      <feedBack :show="feedbackShow" @update="updateFeedback" :params="feedbackParams"></feedBack>
    </div>
    <!--新增下级任务-->
    <div v-if="addTaskShow">
      <addTask :show="addTaskShow" :params="params" ref="addTask" @update="update"></addTask>
    </div>
    <!--结束研判-->
    <Modal v-model="overDeterShow" title="结束研判" class="modal-ct" :styles="{top: '250px',width:'250px'}" @on-cancel="overDeterShow=false">
      <div slot="footer" class="font-size-0">
        <Button type="default" class="cancelBtn" @click="overDeterShow=false">取消</Button>
        <Button type="primary" class="sureBtn" @click="overDeterBtn">确定</Button>
      </div>
      <div>
        <h3>是否结束研判</h3>
      </div>
    </Modal>
    <!--补录分配-->
    <additional :show="additionalShow" @update="additionalShow=false" :additionalParams="additionalParams"></additional>
  </div>

</template>

<script>
  import api from '@/fetch/api.js';
  import task from './task';
  import feedBack from '../feedback/index';
  import addTask from '../addTask/index';
  import additional from '../additional/index';
  export default {
      components: {
          task,
          feedBack,
          additional,
          addTask
      },
      data () {
          return {
              taskList: [],
              setTaskList: [],
              deterShow: false, // 签收
              overDeterShow: false, // 结束研判
              feedbackShow: false, // 反馈
              addTaskShow: false, // 新增下级任务
              additionalShow: false, // 补录分配
              flowsheetShow: false, // 处理日志
              feedbackParams: {}, // 反馈信息
              taskItem: {}, // 任务信息
              params: {},
              sqxx: {},
              additionalParams: {},
              arr: [],
              careShow: false,
              idCard: null,
              carNum: null,
              hzNum: null,
              careBtnShow: false,
              obj: {},
              zt: ''
          };
      },
      computed: {
          determineId () {
              return this.$route.query.id;
          }
      },
      mounted () {
          this.myWork();
          this.getIdCard('林芳德 30233212956620120x 男 26岁  ');
      },
      watch: {
          '$store.state.app.ypZt' (val) {
              this.zt = val;
          },
          '$store.state.app.taskItemAdd' (val) {
              this.addTaskShow = true;
              this.params = val;
          },
          '$store.state.app.taskItemFeedback' (val) {
              this.feedbackShow = true;
              this.feedbackParams = val;
              this.taskItem = val;
              //        this.myWork();
          },
          '$store.state.app.taskItemSign' (val) {
              this.deterShow = true;
              this.taskItem = val;
          },
          //      '$store.state.app.taskFeedbackSuccess' (val) {
          //        this.myWork();
          //      },
          '$store.state.app.taskObj' (val) {
              this.obj = val;
              $('.btnDiv').css({
                  left: val.y + 40 + 'px',
                  top: val.x - 20 + 'px'
              });
              this.careBtnShow = true;
          },
          '$store.state.app.taskItemAdditional' (val) {
              this.additionalParams = val;
              this.additionalShow = true;
          }
      },
      methods: {
          myWork () {
              api.api('post', api.configUrl + '/hczz/za/getSqxxXx', {
                  id: this.determineId
              }).then(res => {
                  $.each(res.rwfp, (index, val) => {
                      val.children = [];
                  });
                  this.arr = res.rwfp.filter((v) => {
                      return v.rwjb == 0;
                  });
                  this.taskList = this.addChildren(this.arr, res.rwfp);
                  this.taskList = this.setFeedback(this.taskList);
                  this.setTaskList = this.addFeedback(this.taskList, res.rwfk);
                  this.setTaskList = this.setName(this.setTaskList);
  
                  this.setTaskList = this.setFj(this.setTaskList);
                  this.$store.commit('setYpzt', res.sqxx.zt);
                  this.$store.commit('setFkzt', Math.random());
              });
          },
          setFj (arr) {
              arr.forEach(item => {
                  item.feedback.forEach(t => {
                      this.getFkFj(t.id).then(result => {
                          this.$set(t, 'attach', result);
                      });
                  });
                  if (item.children && item.children.length) {
                      this.setFj(item.children);
                  }
              });
              return arr;
          },
          setName (arr) {
              $.each(arr, (index, value) => {
                  this.$set(value, 'flag', false);
                  if (value.children && value.children.length) {
                      this.setName(value.children);
                  }
              });
              return arr;
          },
          addChildren (arr1, arr2) {
              $.each(arr1, (index, val) => {
                  $.each(arr2, (i, v) => {
                      if (val.rwjb == Number(v.rwjb) - 1 && val.id==v.fjid) {
                          val.children.push(v);
                      }
                  });
                  if (val.children.length) {
                      this.addChildren(val.children, arr2);
                  }
              });
              return arr1;
          },
          addFeedback (arr, brr) {
              $.each(arr, (index, val) => {
                  $.each(brr, (i, v) => {
                      if (val.id == v.rwid) {
                          val.feedback.push(v);
                      }
                  });
                  if (val.children.length) {
                      this.addFeedback(val.children, brr);
                  }
              });
              return arr;
          },
          setFeedback (arr) {
              $.each(arr, (i, v) => {
                  v.feedback = [];
                  if (v.children.length) {
                      this.setFeedback(v.children);
                  }
              });
              return arr;
          },
          over (item) {
              this.overDeterShow = true;
              this.taskItem = item;
          },
          deterBtn () {
              api.api('post', api.configUrl + '/hczz/za/rwQs', {
                  id: this.taskItem.id,
                  rwzt: 2
              }).then(res => {
                  this.deterShow = false;
                  this.$message.success('签收成功');
                  this.myWork();
                  this.$refs.task.signShow = false;
              });
          },
          overDeterBtn () {
              let thczzrwfp = {
                  id: this.taskItem.id,
                  rwzt: '4'
              };
              api.api('post', api.configUrl + '/hczz/za/rwYp', thczzrwfp).then(res => {
                  this.overDeterShow = false;
                  this.myWork();
                  this.$message.success('研判结束成功');
              });
          },
          update () {
              this.addTaskShow = false;
              this.myWork();
          },
          updateFeedback (val) {
              this.feedbackShow = false;
              if (val) {
                  this.myWork();
              }
          },
          getIdCard (string) {
              var reg = /[0-9,X,x]/;
              var num = 0;
              var IDarr = '';
              var arr = string.split('');
              for (var i = 0; i < arr.length; i++) {
                  var item = arr[i];
                  if (reg.test(item)) {
                      num++;
                      IDarr += '' + item;
                      if (num == 18) {
                          return IDarr.toString();
                      }
                  } else {
                      num = 0;
                      IDarr = '';
                  }
              }
          },
          careBtn () {
              let self = this;
              api.api('post', api.configUrl + '/hczz/gz/saveGzxx', {
                  hpph: self.obj.carNum ? self.obj.carNum[0] : '',
                  hzh: self.obj.hzNum ? self.obj.hzNum[0] : '',
                  sfzh: self.obj.idCard ? self.obj.idCard[0] : '',
                  id: self.obj.item.id,
                  ly: 'hczz',
                  xm: 'www',
                  zt: '1'
              }).then(res => {
                  this.$message.success('关注成功');
              });
              this.careBtnShow = false;
          },
          getFkFj (id) {
              return new Promise((resolve, reject) => {
                  let objs = {
                      type: 0,
                      tablename: 'T_HCZZ_RWFK',
                      glid: id
                  };
                  api.api('post', api.configUrl + '/hczz/fj/getFjList', objs).then(res => {
                      resolve(res);
                  });
              });
          }
      }
  };
</script>

<style lang="less">
  .taskIndex {
    /*position: relative;*/
    .btnDiv {
      position: fixed;
      /*top: 0;
      left: 0;*/
    }
  }
</style>