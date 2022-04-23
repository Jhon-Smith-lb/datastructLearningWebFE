<template>
    <div id="login-container">
        <el-form :ref="form" :rules="rules" :model="form" label-width="60px" class="login-form">
            <h2 class="login-title"></h2>
            <el-form-item label="账号" prop="username">
                <el-input v-model="form.username" placeholder="请输入学号/工号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(form)">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
  import { login, getUserInfo } from '@/api/login'

  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
        },
        rules: {
            username: [
                {required: true, message: '请输入用户名', trigger: 'blur'},
            ],
            password: [
                {required: true, message: '请输入密码', trigger: 'blur'},
                {min: 6, max: 12, message: '密码长度在6到12个字符', trigger: ['blur', 'change']}
            ]
        }
      }
    },
    methods: {
      submitForm(formName) {
          this.$refs[formName].validate(valid => {
              if (valid) {
                  // 登录获取token
                  login(this.form.username, this.form.password).then(response => {
                      if (response.data.msg == "") {
                          const token = response.data.data.token;
                        //   console.log(response, token)
                          localStorage.setItem("user-token", token)
                        // 获取用户信息
                        getUserInfo(token).then(response => {
                             if (response.data.msg == "") {
                                 const userInfo = response.data.data.user
                                //  console.log(userInfo)
                                 localStorage.setItem(
                                     "user-info",
                                     JSON.stringify(userInfo)
                                 );
                                 this.$router.push("./")
                             } else {
                                 // 获取用户信息失败
                                 this.$message({
                                     message: response.data.msg,
                                     type: "warning"
                                 });
                             }
                        })
                      } else {
                          // 认证未通过
                          this.$message({
                                message: response.data.msg,
                                type: "warning"
                            });
                      }
                  })
                  
              } else {
                //   console.log("error submit!!");
                  return false;
              }
          });
      }
    }
  }
</script>

<style>
    .login-form {
        width: 350px;
        background-color: #fff;
        padding: 15px;
        border-radius: 20px;
        height: 250px;
        left: 50%;
        top: 50%;
        margin-left: -175px;
        margin-top: -125px;
        position: absolute;
    }
    #login-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url('../../assets/login-bg.png');
    }
    .login-title {
        color:  #606266;
        text-align: center;
    }
</style>