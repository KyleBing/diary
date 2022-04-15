import Vue from "vue";
import VueRouter from "vue-router";

import Index from "@/page/Index";
import utility from "@/utility";

Vue.use(VueRouter)

const routes = [
    {
        name: 'index',
        path: '/',
        component: Index ,
        children: [
            {name: 'list'   , path: 'list'      , component: resolve => require(['@/page/List'], resolve)}, // mobile
            {name: 'detail' , path: 'detail/:id', component: resolve => require(['@/page/Detail'], resolve)},
            {name: 'editNew', path: 'edit'      , component: resolve => require(['@/page/Edit'], resolve)},
            {name: 'edit'   , path: 'edit/:id'  , component: resolve => require(['@/page/Edit'], resolve)}
        ]
    },
    {name: 'register',       path: '/register',        component: resolve => require(['@/page/Register'], resolve)},
    {name: 'share',          path: '/share/:id',       component: resolve => require(['@/page/Share'], resolve),          },
    {name: 'changePassword', path: '/change-password', component: resolve => require(['@/page/ChangePassword'], resolve), },
    {name: 'login',          path: '/login',           component: resolve => require(['@/page/Login'], resolve),          },
    {name: 'test',           path: '/test',            component: resolve => require(['@/components/YearSelector'], resolve),   },
    {path: '*',                                        component: resolve => require(['@/fundation/NotFound_404'], resolve)}
]


const router = new VueRouter({
    // mode: 'history', // 由于该项目是二级目录，使用 history 会导致开发与布署的地址不一
    routes
})


router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && to.name !== 'register' && to.name !== 'share'){
        if (utility.getAuthorization().email){
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})


export default router
