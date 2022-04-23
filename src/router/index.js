import Vue from "vue";
import VueRouter from "vue-router"

import Login from "@/views/login/index.vue"
import Layout from "@/components/Layout.vue"
import News from "@/views/news/index.vue"
import Resources from "@/views/resources/index.vue"
import User from "@/views/user/index.vue"

Vue.use(VueRouter)

const routes = [
    // 登录
    {
        path: "/login",
        name: "login",
        component: Login
    },
    // 主页
    {
        path: "/",
        name: "layout",
        component: Layout,
        redirect: '/news',
        children: [
            {
                path: "/news",
                component: News,
                meta: {type:'1'}
            },
            {
                path: "/research",
                component: News,
                meta: {type:'2'}
            },
            {
                path: "/notice",
                component: News,
                meta: {type:'3'}
            },
            {
                path: "/resources",
                component: Resources,
            },
            {
                path: "/user",
                component: User,
            }
        ]
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;