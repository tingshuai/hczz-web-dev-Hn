<template>
  <div class="taskIndex">
    <task :taskList="setTaskList" @sign="sign" :sqxx="sqxx" @feedback="feedback" @lookDetail="lookDetail" ref="task"></task>
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
      <feedBack :show="feedbackShow" @update="updateFeedback" @fkSuccess="fkSuccess" :sqid="fkSqid" :jzidFk="jzidFk" :params="feedbackParams"></feedBack>
    </div>
    <!--任务详情-->
    <addTask :show="addTaskShow" :params="params" ref="addTask" @update="update"></addTask>

  </div>

</template>

<script>
  import api from '@/fetch/api.js';
  import task from './task';
  import feedBack from '../feedback/index';
  import addTask from '../addTask/index';
  export default {
      components: {
          task,
          feedBack,
          addTask
      },
      data () {
          return {
              setTaskList: [], // 警钟列表
              deterShow: false, // 签收
              feedbackShow: false, // 反馈
              addTaskShow: false, // 查看任务详情
              flowsheetShow: false, // 处理日志
              feedbackParams: {}, // 反馈信息
              params: {}, // 该条的反馈内容
              signId: '', // 该条的签收id
              signSqid: '', // 签收申请id
              jzid: '',
              sqxx: {}, // 申请信息
              fkSqid: '', // 反馈时传的sqid
              jzidFk: '' // 警钟id
          };
      },
      computed: {
          determineId () {
              return this.$route.query.id;
          }
      },
      mounted () {
          this.myWork();
      },
      methods: {
          myWork () {
              api.api('get', api.configUrl + '/hczz/zhb/queryDetail/' + this.determineId).then(res => {
                  this.setTaskList = res.jzList;
                  this.setTaskList.forEach(item => {
                      // 获取该警钟下所属的部门
                      api.api('get', api.configUrl + '/hczz/jzpz/queryDetail/' + item.jzpzid).then(result => {
                          let arr = result.jzbmList.filter(i => {
                              // 如果登陆用户的部门code和该警钟下某个部门的额bmbh相等，则该用户可以签收
                              return i.bmbh == JSON.parse(window.localStorage.getItem('userInfo')).officeCode;
                          });
                          // 如果arr的长度大于0，说明登陆用户的code和该警钟下的部门匹配上，则可以签收
                          if (arr.length) {
                              this.$set(item, 'isJz', true);
                          } else {
                              this.$set(item, 'isJz', false);
                          }
                      });
                      // 只有当前登陆用户和该警钟签收人属于同一个部门，才可以进行反馈
                      if (item.jsdw == JSON.parse(window.localStorage.getItem('userInfo')).officeCode) {
                          this.$set(item, 'isFk', true);
                      }else {
                          this.$set(item, 'isFk', false);
                      }
                  });
                  this.sqxx = res.sqxx;
                  this.fkSqid = res.sqxx.id;
                  this.feedbackParams = res.sqxx;
                  this.$set(this.feedbackParams, 'sqxx', res.sqxx);
                  this.$set(this.feedbackParams, 'attach', res.attach);
              });
          },
          feedback (item) {
              // console.log(item,"HHHHH",item.id)
              this.jzidFk = item.id;
              this.feedbackShow = true;
          },
          lookDetail (item) {
              this.params = item;
              this.addTaskShow = true;
          },
          deterBtn () {
              api.api('get', api.configUrl + '/hczz/zhb/receiveAsk/' + this.signId, {
                  sqid: this.signSqid,
                  jzid: this.jzid
              }).then(res => {
                  this.deterShow = false;
                  this.$message.success('签收成功');
                  this.myWork();
                  this.$refs.task.signShow = false;
                  // this.$emit('qsSuccess','aaa')
              });
          },
          sign (item) {
              // console.log(item,"ssssss")
              this.jzid = item.jzpzid;
              this.deterShow = true;
              this.signId = item.id;
              this.signSqid = item.sqid;
          },
          update () {
              this.addTaskShow = false;
              this.myWork();
          },
          updateFeedback () {
              this.feedbackShow = false;
              this.myWork();
          },
          fkSuccess (val) { // 反馈成功回调
              console.log('bbbbb');
              this.$emit('fkSuccess');
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