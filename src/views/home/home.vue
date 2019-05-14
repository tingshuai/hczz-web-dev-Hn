<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <p style="height: 500px; text-align: center;font-size: 32px;line-height: 500px;"> 欢迎来到中奥火炬平台-合成作战</p>
    </div>
</template>

<script>
    import api from '@/fetch/api';
    import Cookies from 'js-cookie';
//  import layui from 'layui-src';
    export default {
        name: 'home',
        components: {
        },
        data() {
            return {
                userObj:{}
            };
        },
        async created(){
            await this.$store.dispatch("getUserInfo");
            var that = this;
            layui.use('layim', function(layim){
                layimWeb=layim;
                //基础配置
                layim.config({
                    title: "即时通讯"
                    ,min: true
                    ,init: {
                        mine: {
                            "username": that.$store.getters.personal_userInfo.userName //我的昵称
                            ,"id": that.$store.getters.personal_userInfo.id //我的ID
                            ,"status": "online" //在线状态 online：在线、hide：隐身
                            ,"sign": that.$store.getters.personal_userInfo.phone //我的签名
                            ,"avatar":(that.$store.getters.personal_userInfo.img==''?"src/images/logo/tx.png":that.$store.getters.personal_userInfo.img) //我的头像
                        }

                    } //获取主面板列表信息，下文会做进一步介绍

                    //获取群员接口（返回的数据格式见下文）
                    ,members: {
                        url: '' //接口地址（返回的数据格式见下文）
                        ,type: 'get' //默认get，一般可不填
                        ,data: {} //额外参数
                    }

                    //上传图片接口（返回的数据格式见下文），若不开启图片上传，剔除该项即可
                    ,uploadImage: {
                        url: '' //接口地址
                        ,type: 'post' //默认post
                    }

                    //上传文件接口（返回的数据格式见下文），若不开启文件上传，剔除该项即可
                    ,uploadFile: {
                        url: '' //接口地址
                        ,type: 'post' //默认post
                    }
                    //扩展工具栏，下文会做进一步介绍（如果无需扩展，剔除该项即可）
                    ,tool: [{
                        alias: 'code' //工具别名
                        ,title: '代码' //工具名称
                        ,icon: '&#xe64e;' //工具图标，参考图标文档
                    }]

                    ,msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
                    ,find: layui.cache.dir + 'css/modules/layim/html/find.html' //发现页面地址，若不开启，剔除该项即可
                    ,chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html' //聊天记录页面地址，若不开启，剔除该项即可
                });
            });


            var initEventHandle = function () {
                //收到消息后
                socket.onmessage = function(event) {
                    if (event.data instanceof ArrayBuffer){
                        var msg =  proto.Model.deserializeBinary(event.data);      //如果后端发送的是二进制帧（protobuf）会收到前面定义的类型
                        //心跳消息
                        if(msg.getCmd()==2){
                            //发送心跳回应
                            var message1 = new proto.Model();
                            message1.setCmd(1);
                            message1.setMsgtype(4);
                            socket.send(message1.serializeBinary());
                        }else if(msg.getCmd()==3){
                            if(msg.getSender()!=that.$store.getters.personal_userInfo.id){

                                layer.msg("用户"+msg.getSender()+"上线了");

                            }
                        }else if(msg.getCmd()==4){
                            if(msg.getSender()!=that.$store.getters.personal_userInfo.id){
                                layer.msg("用户"+msg.getSender()+"下线了");
                            }
                        }else if(msg.getCmd()==5){
                            //显示非自身消息
                            if(msg.getSender()!=that.$store.getters.personal_userInfo.id){
                                var msgCon =  proto.MessageBody.deserializeBinary(msg.getContent());
                                 that.getDetail(msg.array[3]).then(res=>{
                                 	that.showMessage(msg,msgCon,false,that.userObj);
                                 });
                                
                               
                            }
                        }
                    }else {
                        var data = event.data;                //后端返回的是文本帧时触发
                    }
                };
                //连接后
//              socket.onopen = function(event) {
//                  var message = new proto.Model();
//                  var browser=BrowserUtil.info();
//                  message.setVersion("1.0");
//                  message.setDeviceid("");
//                  message.setCmd(1);
//                  message.setSender(that.$store.getters.personal_userInfo.id);
//                  message.setMsgtype(1);
//                  message.setFlag(1);
//                  message.setPlatform(browser.name);
//                  message.setPlatformversion(browser.version);
//                  message.setToken(Cookies.get('token'));
//                  var bytes = message.serializeBinary();
//                  socket.send(bytes);
//              };
                //连接关闭
//              socket.onclose = function(event) {
//                  if(!logOutSystem){
//                      layer.confirm('您已下线，重新上线?', function(index){
//                          reconnect(websocketurl,initEventHandle);
//                          layer.close(index);
//                      });
//                  }
//              };
//              socket.onerror = function () {
//                  layer.msg("服务器连接出错，请检查websocketconfig.js里面的IP地址");
//                  reconnect(websocketurl,initEventHandle);
//              };

            }
            createWebSocket(websocketurl,initEventHandle);
        },
        computed: {

        },
        methods: {
            getDetail(id){
                return new Promise(resolve=>{
                	api.api('get',api.systemUrl+'/account/info/detail?id='+id).then(res=>{
	                    this.userObj=res;
	                    resolve();
	                })
                })
            },
            showMessage(msg,msgCon,isMine,userObj) {
                return new Promise((resolve,reject)=>{
                	var data={};
	                data.username=userObj.userName;//消息来源用户名
	                data.avatar=userObj.img?userObj.img:"http://tp1.sinaimg.cn/1571889140/180/40030060651/1"; //消息来源用户头像
	                data.id=msg.array[5];//聊天窗口来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
	                if(msg.array[6]!=null&&(msg.array[6]).toString().length==1){
	                    data.type="group";//聊天窗口来源类型，从发送消息传递的to里面获取
	                    data.fromid=msg.array[3];
	                }
	                else{
	                    data.type="friend";//聊天窗口来源类型，从发送消息传递的to里面获取
	                }
	                data.content=msgCon.getContent();//消息内容
	                data.mine=isMine;//是否我发送的消息，如果为true，则会显示在右方
	                data.timestamp=msg.array[13]; //服务端动态时间戳
	                layimWeb.getMessage(data);
	                resolve('1111')
                })
            }
        }
    };

    /*
    //推送消息方法
    function showMessage(msg,msgCon,isMine) {
        var data={};
        data.username=msg.array[4];//消息来源用户名
        console.log(msg.array[4]);
        data.avatar="http://tp1.sinaimg.cn/1571889140/180/40030060651/1"; //消息来源用户头像
        data.id=msg.array[5];//聊天窗口来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
        if(msg.array[6]!=null&&(msg.array[6]).toString().length==1){
            data.type="group";//聊天窗口来源类型，从发送消息传递的to里面获取
        }
        else{
            data.type="friend";//聊天窗口来源类型，从发送消息传递的to里面获取
            data.fromid=msg.array[4];
        }
        data.content=msgCon.getContent();//消息内容
        data.mine=isMine;//是否我发送的消息，如果为true，则会显示在右方
        data.timestamp=msg.array[4],msg.array[13]; //服务端动态时间戳
        layimWeb.getMessage(data);
    }
    */
</script>
