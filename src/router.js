import { createRouter, createWebHashHistory } from 'vue-router'
import Index from "@/framework/Index";
import utility from "@/utility";

import Register from "@/page/register/Register"
import Login from "@/page/register/Login.vue"
import ChangePassword from "@/page/register/ChangePassword.vue"
import Bill from "@/page/bill/Bill"
import BankCardList from "@/page/bankCard/BankCardList"
import Share from "@/page/share/Share"
import Statistics from "@/page/statistics/StatisticsMain"

import List from "@/page/list/List"
import Detail from "@/page/detail/Detail"
import Edit from "@/page/edit/Edit"
import NotFound_404 from "@/fundation/NotFound_404";

const routes = [
    {
        name: 'Index',
        path: '/',
        component: Index ,
        children: [
            {name: 'List'   , path: 'list'      ,        component: List}, // mobile
            {name: 'Detail' , path: 'detail/:id',        component: Detail},
            {name: 'EditNew', path: 'edit'      ,        component: Edit},
            {name: 'Edit'   , path: 'edit/:id'  ,        component: Edit}
        ]
    },
    {name: 'Register',       path: '/register',          component: Register},
    {name: 'Share',          path: '/share/:id',         component: Share         },
    {name: 'ChangePassword', path: '/change-password',   component: ChangePassword },
    {name: 'ChangeProfile',  path: '/change-profile',    component: ChangeProfile },
    {name: 'Login',          path: '/login',             component: Login          },
    {name: 'Statistics',     path: '/statistics',        component: Statistics   },
    {name: 'Bill',           path: '/bill',              component: Bill },
    {name: 'BankCard',       path: '/bank-card',         component: BankCardList },
    {name: 'NotFound',       path: '/:pathMatch(.*)*',   component: NotFound_404}
]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})



router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && to.name !== 'register' && to.name !== 'share'){
        if (utility.getAuthorization() && utility.getAuthorization().email){
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})


export default router

