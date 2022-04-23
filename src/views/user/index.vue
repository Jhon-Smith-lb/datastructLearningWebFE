<template>
    <div>
        <el-form :inline="true" :model="searchWhere" class="demo-form-inline" style="margin-top:20px">
        
        <el-form-item label="">
            <el-input v-model="searchWhere.username" placeholder="名称" style="width:300px"></el-input>
        </el-form-item>

        <el-form-item label="">
            <el-input v-model="searchWhere.number" placeholder="学号/工号" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary"  icon="el-icon-search" @click="fetchData">查询</el-button>
        </el-form-item>

        <el-form-item style="float:right">
            <el-button type="primary"  @click="showAddUserForm()">添加</el-button>
        </el-form-item>
        </el-form>

        <el-table
            :data="userList"
            style="width: 100%">
            <el-table-column
                prop="username"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="number"
                label="账号">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        disabled>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                prop="create_news"
                label="能否创建文章">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.create_news"
                        disabled>
                    </el-switch>
                </template>
            </el-table-column>
             <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="showUserWithId(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="confirmAndDelete(scope.row)">删除</el-button>
                </template>
                </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        

        <!-- 添加用户 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAddUser">
        <el-form 
        :model="addUserForm" 
        :rules="addUserRules"
        :ref="addUserForm"
        >
            <el-form-item label="账号名称" :label-width="formLabelWidth" prop="number">
                <el-input v-model="addUserForm.username" autocomplete="off" placeholder="账号名称"></el-input>
            </el-form-item>
            <el-form-item label="学号/工号" :label-width="formLabelWidth" prop="number">
                <el-input v-model="addUserForm.number" autocomplete="off" placeholder="学号/工号"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
                <el-input v-model="addUserForm.password" autocomplete="off" placeholder="用户密码" show-password></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="cancelAddUserForm()">取 消</el-button>
            <el-button type="primary" @click="addUser(addUserForm)">确 定</el-button>
        </div>
        </el-dialog>

        <!-- 编辑用户 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleUpdateUser">
        <el-form 
        :model="updateUserForm" 
        :rules="updateUserRules"
        :ref="updateUserForm"
        >
            <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
                <el-input v-model="updateUserForm.username" autocomplete="off" placeholder="用户名称"></el-input>
            </el-form-item>
            <el-form-item label="学号/工号" :label-width="formLabelWidth" prop="number">
                <el-input v-model="updateUserForm.number" autocomplete="off" placeholder="学号/工号"></el-input>
            </el-form-item>
            <el-form-item label="重置密码" :label-width="formLabelWidth" prop="password">
                <el-input v-model="updateUserForm.password" autocomplete="off" placeholder="新密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="用户状态" :label-width="formLabelWidth" prop="status">
                <el-switch
                    v-model="updateUserForm.status"
                    >
                </el-switch>
            </el-form-item>
            <el-form-item label="能否创建文章" :label-width="formLabelWidth" prop="create_news">
                <el-switch
                    v-model="updateUserForm.create_news"
                    >
                </el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="cancelUpdateUserForm()">取 消</el-button>
            <el-button type="primary" @click="updateUser(updateUserForm)">确 定</el-button>
        </div>
        </el-dialog>

    </div>
</template>

<script>
    import userApi from '@/api/user'

    export default {
        data() {
            return {
                userList: [],
                total: 0,
                currentPage: 1,
                pageSize: 8,
                searchWhere: {
                    username: '',
                    number: '',
                },
                dialogFormVisibleAddUser: false,
                dialogFormVisibleUpdateUser: false,
                addUserForm: {
                    username: "",
                    number: "",
                    password: ""
                },
                formLabelWidth: '120px',
                addUserRules: {
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' }
                    ],
                    number: [
                        { required: true, message: '请输入学号/工号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                updateUserRules: {
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' }
                    ],
                    number: [
                        { required: true, message: '请输入学号/工号', trigger: 'blur' }
                    ]
                },
                updateUserForm: {
                    id: 0,
                    username: '',
                    number: '',
                    password: '',
                    status: 0,
                    create_news: 0,
                    is_del: 0
                }
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                var queryOption = this.searchWhere
                if (this.currentPage == 1) {
                    queryOption.offset = 0
                } else {
                    queryOption.offset = (this.currentPage - 1) * this.pageSize + 1
                }
                queryOption.limit = this.pageSize
                // console.log(queryOption)
                userApi.query(queryOption).then(response => {
                    // console.log(response.data)
                    if (response.data.msg == "") {
                        const data = response.data.data
                        var userList = data.user_list
                        for (let i=0;i<userList.length;i++) {
                            userList[i].status = !userList[i].status
                            userList[i].create_news = (userList[i].create_news != 0)
                        }
                        this.userList = data.user_list
                        this.total = data.total
                    } else {
                        this.$message({
                            message: response.msg,
                            type: "warning"
                        });
                    }
                })
            },
            showUserDetails(user) {
                this.userDetails.username = user.username
                this.userDetails.number = user.number
                this.userDetails.status = user.status
                this.userDetails.is_admin = user.is_admin
                this.dialogFormVisibleUserDetails = true
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.fetchData();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.fetchData();
            },
            addUser(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var addUserFormReq = JSON.parse(JSON.stringify(this.addUserForm))
                        // addUserFormReq.status = this.addUserForm.status == true ? 0 : 1;
                        // console.log(addUserFormReq)
                        userApi.addUser(addUserFormReq).then(response => {
                            const resp = response.data;
                            if (resp.msg == "") {
                                this.fetchData();
                                this.dialogFormVisibleAddUser = false;
                            } else {
                                this.$message({
                                    message: resp.msg,
                                    type: 'warning'
                                })
                            }
                        })
                    } else {
                        // console.log('error submit!');
                        this.dialogFormVisibleAddUser = true;
                    }
                })
            },
            showUserWithId(user) {
                // console.log(user);
                this.updateUserForm.id = user.id
                this.updateUserForm.username = user.username;
                this.updateUserForm.number = user.number;
                this.updateUserForm.password = '';
                this.updateUserForm.status = user.status;
                this.updateUserForm.is_admin = user.is_admin;
                this.updateUserForm.create_news = user.create_news;
                this.dialogFormVisibleUpdateUser = true;
            },
            updateUser(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        var updateUserFormReq = JSON.parse(JSON.stringify(this.updateUserForm))
                        updateUserFormReq.status = this.updateUserForm.status == true ? 0 : 1;
                        updateUserFormReq.create_news = this.updateUserForm.create_news == true ? 1 : 0;
                        // console.log(updateUserFormReq)
                        userApi.updateUser(updateUserFormReq).then(response => {
                            const resp = response.data;
                            if (resp.msg == "") {
                                this.fetchData();
                                this.dialogFormVisibleUpdateUser = false;
                            } else {
                                this.$message({
                                    message: resp.msg,
                                    type: 'warning'
                                })
                            }
                        })
                    } else {
                        // console.log('error update!');
                        this.dialogFormVisibleUpdateUser = true;
                    }
                })
            },
            showAddUserForm() {
                this.addUserForm = {
                    username: "",
                    number: "",
                    password: ""
                }
                this.dialogFormVisibleAddUser = true;
            },
            showUpdateUserForm() {
                this.updateUserForm = {
                    id: 0,
                    username: '',
                    number: '',
                    password: '',
                    status: '',
                    is_del: 0
                }
                this.dialogFormVisibleUpdateUser = true;
            },
            cancelUpdateUserForm() {
                this.dialogFormVisibleUpdateUser = false;
            },
            cancelAddUserForm() {
                this.dialogFormVisibleAddUser = false;
            },
            confirmAndDelete(user) {
                this.$confirm('确认删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var updateUserFormReq = {
                        id: user.id,
                        username: user.username,
                        number: user.number,
                        status: user.status == true ? 0 : 1,
                        is_del: 1
                    }
                    // console.log(updateUserFormReq)
                    userApi.updateUser(updateUserFormReq).then(response => {
                        const resp = response.data;
                        if (resp.msg == "") {
                            this.fetchData();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            // console.log("cannel")
                            this.$message({
                                message: resp.msg,
                                type: 'warning'
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        }
    }
</script>


<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
  }

  .ql-container {
    height: 400px;
  }

  #userNumber:hover {
      cursor: pointer;
      color: #409EFF;
  }

</style>