import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

import IndexFramework from "./framework/IndexFramework.vue"
import Login from "@/view/Login&Register/Login.vue"
import List from "@/view/DiaryList/List.vue"
import Detail from "@/view/Detail/Detail.vue"
import Edit from "@/view/Edit/Edit.vue"
import NotFound_404 from "./components/NotFound_404.vue";
import {getAuthorization} from "./utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";


const routes: RouteRecordRaw[] = [
    {
        name: 'Index',
        path: '/',
        component: IndexFramework,
        redirect: "/list",
        children: [
            {name: 'List'   , path: 'list'      ,        component: List}, // mobile
            {name: 'Detail' , path: 'detail/:id',        component: Detail},
            {name: 'EditNew', path: 'edit'      ,        component: Edit},
            {name: 'Edit'   , path: 'edit/:id'  ,        component: Edit},
        ]
    },
    {
        name: 'CalendarFramework',
        path: '/calendar',
        component: () => import('@/framework/CalendarFramework.vue'),
        redirect: "/calendar/calendar",
        children: [
            {name: 'Calendar',          path: 'calendar'  ,                 component: () => import('@/view/Calendar/CalendarDiary.vue')},

            {name: 'CalendarEditNew',   path: 'calendar'  ,                 component: () => import('@/view/Calendar/CalendarDiary.vue')},
            {name: 'CalendarEdit',      path: 'calendar/:id'  ,             component: () => import('@/view/Calendar/CalendarDiary.vue')},

            {name: 'CalendarPeriod',    path: 'calendar-period'  ,          component: () => import('@/view/Calendar/CalendarPeriod.vue')},
            {name: 'CalendarPeriodEdit',path: 'calendar-period/:id'  ,      component: () => import('@/view/Calendar/CalendarPeriod.vue')},
        ]
    },
    {
        name: 'Waterfall',
        path: '/waterfall',
        redirect: '/waterfall/list',
        component: () => import('@/framework/WaterfallFramework.vue'),
        children: [
            {name: 'WaterfallList'   , path: 'list'      ,     component: () => import('@/view/DiaryListWaterfall/WaterfallList.vue')},
        ]
    },
    {name: 'Register',             path: '/register',          component: () => import('@/view/Login&Register/Register.vue')},
    {name: 'Share',                path: '/share/:id',         component: () => import('@/view/Share/Share.vue')},
    {name: 'RemoveAllYourDiary',   path: '/clear-diary',       component: () => import('@/view/Util/RemoveAllYourDiary.vue') },
    {name: 'DestroyAccount',       path: '/destroy-account',   component: () => import('@/view/Util/DestroyAccount.vue') },
    {name: 'ChangePassword',       path: '/change-password',   component: () => import('@/view/Login&Register/ChangePassword.vue') },
    {name: 'ChangeProfile',        path: '/change-profile',    component: () => import('@/view/ChangeProfile/ChangeProfile.vue') },
    {name: 'Login',                path: '/login',             component: Login},
    {name: 'FetchPassword',        path: '/fetch-password',    component: () => import('@/view/Login&Register/FetchPassword.vue') },
    {name: 'Statistics',           path: '/statistics',        component: () => import('@/view/Statistics/StatisticsIndex.vue') },
    {name: 'FileManager',          path: '/file-manager',      component: () => import('@/view/FileManager/FileManager.vue') },
    {name: 'Bill',                 path: '/bill',              component: () => import('@/view/Bill/Bill.vue') },
    {name: 'BillCandidateList',    path: '/bill/candidates',   component: () => import('@/view/Bill/BillCandidateList.vue') },
    {name: 'BankCard',             path: '/bank-card',         component: () => import('@/view/BankCard/BankCardList.vue')  },
    {name: 'Invitation',           path: '/invitation',        component: () => import('@/view/Invitation/InvitationList.vue')  },
    {name: 'NotFound',             path: '/:pathMatch(.*)*',   component: NotFound_404}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, _) => {
    switch (to.name) {
        case 'Login':
        case 'Register':
        case 'Share':
        case 'FetchPassword':
        case 'Invitation':
            return true
        default:
            if (getAuthorization() && getAuthorization()!.email) {
                if (to.name === 'List') {
                    if (useProjectStore().isInMobileMode) {
                        return true
                    } else {
                        return {name: 'EditNew'}
                    }
                } else {
                    return true
                }
            } else {
                return {name: 'Login'}
            }
    }
})



export  {
    router
}
