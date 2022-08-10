import { createRouter, createWebHashHistory } from 'vue-router'
import Index from "@/framework/Index";
import utility from "@/utility";

import Register from "@/page/Register"
import Login from "@/page/Login"
import ChangePassword from "@/page/ChangePassword"
import Bill from "@/page/bill/Bill"
import CardList from "@/page/card/CardList"
import Share from "@/page/Share"
import Statistics from "@/page/statistics/StatisticsMain"

import List from "@/page/list/List"
import Detail from "@/page/Detail"
import Edit from "@/page/edit/Edit"
import NotFound_404 from "@/fundation/NotFound_404";

const routes = [
    {
        name: 'index',
        path: '/',
        component: Index ,
        children: [
            {name: 'list'   , path: 'list'      ,        component: List}, // mobile
            {name: 'detail' , path: 'detail/:id',        component: Detail},
            {name: 'editNew', path: 'edit'      ,        component: Edit},
            {name: 'edit'   , path: 'edit/:id'  ,        component: Edit}
        ]
    },
    {name: 'register',       path: '/register',          component: Register},
    {name: 'share',          path: '/share/:id',         component: Share         },
    {name: 'changePassword', path: '/change-password',   component: ChangePassword },
    {name: 'login',          path: '/login',             component: Login          },
    {name: 'statistics',     path: '/statistics',        component: Statistics   },
    {name: 'bill',           path: '/bill',              component: Bill },
    {name: 'card',           path: '/card',              component: CardList },
    {name: 'notFound',       path: '/:pathMatch(.*)*',   component: NotFound_404}
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

