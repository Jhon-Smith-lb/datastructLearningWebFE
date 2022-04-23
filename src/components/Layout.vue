<template>
    <div>
        <el-container>
            <app-header></app-header>
            <app-navbar></app-navbar>
            <app-main></app-main>
        </el-container>
    </div>
</template>

<script>
import AppHeader from './AppHeader/index.vue'
import AppNavbar from './AppNavbar/index.vue'
import AppMain from './AppMain/index.vue'
export default {
    components:{
        AppHeader,
        AppNavbar,
        AppMain
    }
}
</script>


<style scoped>
.header{
    position: absolute;
    line-height: 65px;
    top:0px;
    left:0px;
    right:0px;
    background-color: #fff;
    border-bottom: 1px solid #DCDFE6;
}
.navbar{
    position: absolute;
    width:200px;
    left:0px;
    top:66px;
    bottom: 0px;
    background-color: #fff;
    overflow-y: auto;
    border-right: 1px solid #DCDFE6;
}
.main{
    position: absolute;
    /* background-color: #1e2020; */
    left:200px;
    right: 0px;
    bottom: 0px;
    top:50px;
    padding: 5px;
    overflow-y: auto;
}
</style>