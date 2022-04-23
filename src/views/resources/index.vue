<template>
    <div>
        <el-form :inline="true" :model="searchWhere" class="demo-form-inline" style="margin-top:20px">
        <el-form-item label="">
            <el-input v-model="searchWhere.prefix" placeholder="资源名称(前缀匹配)" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form-item>
        </el-form>

        <el-card class="box-card" shadow="hover"  v-for="resources in resourcesList" :data="resourcesList">
            <div class="text item">
                <a :href="resources.url" target="_blank" class="url">{{ resources.name }}</a>
            </div>
        </el-card>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import resourcesApi from '@/api/resources'

    export default {
        data() {
            return {
                resourcesList: [],
                total: 0,
                currentPage: 1,
                pageSize: 8,
                searchWhere: {
                    prefix: '',
                }
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                var queryOption = this.searchWhere
                queryOption.token = localStorage.getItem("user-token")
                if (this.currentPage == 1) {
                    queryOption.offset = 0
                } else {
                    queryOption.offset = (this.currentPage - 1) * this.pageSize + 1
                }
                queryOption.limit = 100
                // console.log(queryOption)
                resourcesApi.query(queryOption).then(response => {
                    // console.log(response.data)
                    if (response.data.msg == "") {
                        const data = response.data.data
                        this.resourcesList = data.resources_list
                        this.total = this.resourcesList.length
                    } else {
                        this.$message({
                            message: response.data.msg,
                            type: "warning"
                        });
                    }
                    
                })
            },
            handleSizeChange(size) {
                this.pageSize = size
                this.fetchData()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage
                this.fetchData()
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

  .item {
      cursor:pointer;
  }

  .url {
       text-decoration:none; color: #303133
  }

  .url:hover {
      color: #409EFF;
  }
</style>