<template>
  <div class="header">
    <a href="/" style="padding-left:30px">
      <img class="logo" src="@/assets/logo5.png" />
      <span class="title">数据结构教学网站</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        欢迎您，{{ user.username }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisibleResetPwd">
      <el-form 
      :model="ruleForm" 
      :rules="rules"
      :ref="ruleForm"
      status-icon
      >
          <el-form-item label="旧密码" :label-width="formLabelWidth" prop="old_pwd">
              <el-input v-model="ruleForm.old_pwd" autocomplete="off" placeholder="旧密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="new_pwd">
              <el-input v-model="ruleForm.new_pwd" autocomplete="off" placeholder="新密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="check_pwd">
              <el-input v-model="ruleForm.check_pwd" autocomplete="off" placeholder="确认密码" show-password></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="cancelForm(ruleForm)">取 消</el-button>
          <el-button type="primary" @click="submitForm(ruleForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import pwdApi from "@/api/password"
  export default {
    data() {
      const validateOldPwd = (rule, value, callback) => {
        pwdApi.checkPwd(value).then(response => {
          const resp = response.data
          if (resp.msg == "") {
            callback()
          } else {
            callback(new Error(resp.msg))
          }
        })
      };
      const validateCheckPwd = (rule, value, callback) => {
        if (value !== this.ruleForm.new_pwd) {
          callback(new Error("两次输入的密码不一致"))
        } else {
          callback()
        }
      };
      return {
        formLabelWidth: '120px',
        dialogFormVisibleResetPwd: false,
        ruleForm: {
          old_pwd: "",
          new_pwd: "",
          check_pwd: ""
        },
        rules: {
            old_pwd: [
                { required: true, message: '旧密码不能为空', trigger: 'blur' },
                { validator: validateOldPwd, trigger: 'blur' }
            ],
            new_pwd: [
                { required: true, message: '新密码不能为空', trigger: 'blur' }
            ],
            check_pwd: [
                { required: true, message: '确认密码不能为空', trigger: 'blur' },
                { validator: validateCheckPwd, trigger: 'blur' }
            ]
        },
        user: JSON.parse(localStorage.getItem('user-info'))
      }
    },
    methods: {
      handleCommand(cmd) {
        switch(cmd) {
          case 'a':
            // 修改密码
            this.resetPwd()
            break;
          case 'b':
            // 退出系统
            this.logoutSystem()
            break;
        }
      },
      resetPwd() {
        this.dialogFormVisibleResetPwd = true;
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
                // console.log(this.ruleForm)
                pwdApi.updatePwd(this.ruleForm).then(response => {
                    const resp = response.data;
                    if (resp.msg == "") {
                        this.$message({
                            message: "修改成功",
                            type: 'success'
                        })
                        this.logoutSystem()
                        this.dialogFormVisibleResetPwd = false;
                    } else {
                        this.$message({
                            message: resp.msg,
                            type: 'warning'
                        })
                    }
                })
            } else {
                // console.log('error submit!');
                this.dialogFormVisibleResetPwd = true;
            }
        })
      },
      logoutSystem() {
        localStorage.removeItem("user-token")
        localStorage.removeItem("user-info")
        this.$router.push('/login')
      },
      cancelForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisibleResetPwd = false;
      }
    }
  }
</script>


<style scoped>
.logo {
  width: 25px;
  vertical-align: middle;
  border-radius: 5px;
}
.title {
  position: absolute;
  color: #409EFF;
  padding-left: 5px;
  font-size: 20px;
  font-weight:600;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-dropdown {
  float: right;
  margin-right: 30px;
}
</style>