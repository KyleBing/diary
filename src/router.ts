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
        component: () => import('@/framework/Waterfall.vue'),
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
    {name: 'BankCard',             path: '/bank-card',         component: () => import('@/view/BankCard/BankCardList.vue')  },
    {name: 'Invitation',           path: '/invitation',        component: () => import('@/view/Invitation/InvitationList.vue')  },
    {name: 'NotFound',             path: '/:pathMatch(.*)*',   component: NotFound_404}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, _) => {

    let loadingDom = document.createElement('div')
    let wrapper = document.createElement('div')
    let block1 = document.createElement('div')
    let block2 = document.createElement('div')
    let block3 = document.createElement('div')
    let block4 = document.createElement('div')

    loadingDom.className = 'pre-loading'
    wrapper.className = 'pre-loading-wrapper'
    block1.classList.add('pre-loading-1')
    block1.classList.add('pre-loading-item')
    block2.classList.add('pre-loading-2')
    block2.classList.add('pre-loading-item')
    block3.classList.add('pre-loading-3')
    block3.classList.add('pre-loading-item')
    block4.classList.add('pre-loading-4')
    block4.classList.add('pre-loading-item')

    wrapper.appendChild(block1)
    wrapper.appendChild(block2)
    wrapper.appendChild(block3)
    wrapper.appendChild(block4)
    loadingDom.appendChild(wrapper)

    document.body.appendChild(loadingDom)

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


router.afterEach((from, _) => {
    document.querySelector('.pre-loading')?.remove()  // 进入大屏后，去除载入的 loading
})


export  {
    router
}
