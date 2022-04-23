<template>
  <div class="navbar">
     <el-menu
     :router="true"
      default-active="/news"
      class="el-menu-vertical-demo"
      >
      <el-menu-item index="/news">
        <template slot="title">
          <i class="el-icon-postcard"></i>
          <span>新闻动态</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/research">
        <template slot="title">
          <i class="el-icon-s-opportunity"></i>
          <span>最新进展</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/notice">
        <template slot="title">
            <i class="el-icon-chat-line-round"></i>
            <span>通知公告</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/resources">
        <template slot="title">
            <i class="el-icon-download"></i>
          <span>资源下载</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/user" v-if="user.is_admin">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>用户管理</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user-info'))
    }
  },
  computed: {
    show () {
      return this.user.is_admin == 1
    }
  }
}
</script>


<style scoped>
.el-menu{
    border-right: none;
}
</style>