<style lang="less">
    @import './login.less';
</style>
<template>
    <div class="login" @keydown.enter="handleSubmit">
        <img src="../images/chinaoly-bg.png" class="logo-left">
        <div class="login-con">
            <Tabs value="namepki" class="bg-color" @on-click="statusBtnFun($event)">
                <TabPane label="PKI登录" name="namepki">
                    <div class="con-style pki-position">
                        <img src="../images/pki.png">
                        <div class="loginDiv" @click="pkiLogin()"></div>
                    </div>
                </TabPane>
                <TabPane label="账号密码登录 " name="nameaccount">
                    <div class="con-style">
                        <Form ref="loginForm" :model="form" :rules="rules">
                            <FormItem prop="userName">
                                <Input v-model="form.userName" placeholder="请输入用户名" :maxlength= 18>
                                    <span slot="prepend">
                                        <Icon :size="16" type="ios-person" color='#57a3f3'></Icon>
                                    </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="form.password" placeholder="请输入密码">
                                    <span slot="prepend">
                                        <Icon :size="14" type="ios-lock" color='#57a3f3'></Icon>
                                    </span>
                                </Input>
                            </FormItem>
                            <!-- <FormItem prop="identicode">
                                <Input v-model="form.identicode" placeholder="请输入验证码">
                                <span slot="prepend">
                                       <Icon :size="14" type="checkmark-round" color='#57a3f3'></Icon>
                                    </span>
                                </Input>
                                <img style="position: absolute;right:2px;top:3px;width: 100px;height: 30px;z-index: 7;" @click="editCaptcha" :src="captcha" />
                            </FormItem> -->
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
            <div class="submit-style">
                <Button @click="handleSubmit" v-show="statusBtn" type="primary" long>登录</Button>
            </div>
        </div>
        <div class="copr-info">
            <img src="../images/chinaoly-bg.png">
            <span> &nbsp; © 2018  海南省公安厅版权所有</span>
        </div>
    </div>
</template>
<script>
    import api from '@/fetch/api';
    import Cookies from 'js-cookie';
    import bcryptjs from 'bcryptjs';
    export default {
        data () {
            return {
                statusBtn: false,
                form: {
                    userName: '',
                    password: '',
                    identicode: ''
                },
                rules: {
                    userName: [{
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }],
                    identicode: [{
                        required: true,
                        message: '验证码不能为空',
                        trigger: 'blur'
                    }]
                },
                imgs: 'https://file.iviewui.com/iview-admin/login_bg.jpg',
                kpi: 'block',
                pass: 'none',
                pkicolor: 'white',
                passcolor: '#57a3f3',
                captcha: ''
            };
        },
        created () {

        },
        mounted () {
            this.editCaptcha();
            this.captcha = api.loginUrl + '/login/check';
        },
        methods: {
            statusBtnFun ($event) {
                if ($event == 'namepki') {
                    this.statusBtn = false;
                } else {
                    this.statusBtn = true;
                }
            },
            pkiLogin () {},
            editCaptcha () {
                this.captcha = api.loginUrl + '/login/check?t=' + Math.random();
            },
            handleSubmit () {
                let that = this;
                that.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        let salt = bcryptjs.genSaltSync(10);
                        let hashPwd = bcryptjs.hashSync(that.form.password, salt);
                        // api.api('post', api.loginUrl + '/login/auth?username=' + that.form.userName + '&password=' + hashPwd + '&checkCode=' + that.form.identicode).then(res => {
                        api.api('post', api.loginUrl + '/login/authOrEncry?username=' + that.form.userName + '&password=' + hashPwd).then(res => {
                            Cookies.set('token', res);
                            Cookies.set('user', this.form.userName);
                            // Cookies.set('password', this.form.password);
                            this.$router.push({
                            	name: 'home_index'
                            });
                        //                          SetToken.rewriteToken(res).then(res => {
                        //                              this.$router.push({
                        //                                  name: 'wdrw'
                        //                              });
                        //                          });
                            // this.editCaptcha();
                        }).catch(() => {
                            // this.editCaptcha();
                        });
                    }
                });
            }
        }
    };
</script>

<style>
    #pkilogin,
    #passwordlogin {
        /*display: none;*/
        clear: both;
    }

    .login {
        box-sizing: border-box;
        border-top: 1px solid transparent;
    }

    #loginwrap {
        width: 340px;
        height: 340px;
        border: 1px solid gray;
        margin: 0 auto;
        margin-top: 200px;
    }

    #kpibtn {
        float: left;
        width: 48%;
        text-align: center;
        border-bottom: 1px solid #57a3f3;
        margin-bottom: 20px;
        line-height: 30px;
        z-index: 2;
        cursor: pointer;
    }

    #passbtn {
        float: right;
        width: 48%;
        line-height: 30px;
        text-align: center;
        border-bottom: 1px solid #57a3f3;
        z-index: 2;
        cursor: pointer;
    }

    .pkipass {
        clear: both;
        width: 100%;
    }

    #user,
    #password,
    #validate {
        display: block;
        width: 100%;
        line-height: 30px;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .login-con {
        right: 50%;
        margin-right: -150px;
    }

    /*.ivu-card-head {
        display: none;
    }*/

    .login-con .form-con {
        padding-top: 0;
    }

    #login .ivu-form-item-content {
        margin-left: 15px;
    }

    #login .ivu-form-item {
        height: 37px
    }
</style>

