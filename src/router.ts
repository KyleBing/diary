import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

import IndexFramework from "./framework/IndexFramework.vue"
import Login from "@/view/Login&Register/Login.vue"
import List from "@/view/DiaryList/List.vue"
import Detail from "@/view/Detail/Detail.vue"
import Edit from "@/view/Edit/Edit.vue"
import NotFound_404 from "./components/NotFound_404.vue";
import {getAuthorization} from "./utility.ts";
import {useProjectStore} from "@/pinia/useProjectStore.ts";
import {applySeo, RouteSeoMeta} from "@/utility/seo.ts";

/** 默认：登录后业务页不索引；公开页在各自 meta.seo 中声明 */
const privateSeo: RouteSeoMeta = {index: false}

const routes: RouteRecordRaw[] = [
    {
        name: 'Index',
        path: '/',
        component: IndexFramework,
        redirect: "/list",
        meta: {seo: privateSeo},
        children: [
            {name: 'List'   , path: 'list'      ,        component: List, meta: {seo: {title: '列表', index: false}}},
            {name: 'Detail' , path: 'detail/:id',        component: Detail, meta: {seo: {title: '详情', index: false}}},
            {name: 'EditNew', path: 'edit'      ,        component: Edit, meta: {seo: {title: '编辑', index: false}}},
            {name: 'Edit'   , path: 'edit/:id'  ,        component: Edit, meta: {seo: {title: '编辑', index: false}}},
        ]
    },
    {
        name: 'CalendarFramework',
        path: '/calendar',
        component: () => import('@/framework/CalendarFramework.vue'),
        redirect: "/calendar/calendar",
        meta: {seo: privateSeo},
        children: [
            {name: 'Calendar',          path: 'calendar'  ,                 component: () => import('@/view/Calendar/CalendarDiary.vue'), meta: {seo: {title: '日历', index: false}}},
            {name: 'CalendarEditNew',   path: 'calendar'  ,                 component: () => import('@/view/Calendar/CalendarDiary.vue'), meta: {seo: {title: '日历', index: false}}},
            // 先查看再编辑，避免与 calendar/:id 抢路径
            {name: 'CalendarDetail',    path: 'view/:id'  ,                 component: () => import('@/view/Calendar/CalendarDiary.vue'), meta: {seo: {title: '日历', index: false}}},
            {name: 'CalendarEdit',      path: 'calendar/:id'  ,             component: () => import('@/view/Calendar/CalendarDiary.vue'), meta: {seo: {title: '日历', index: false}}},

            {name: 'CalendarPeriod',    path: 'calendar-period'  ,          component: () => import('@/view/Calendar/CalendarPeriod.vue'), meta: {seo: {title: '经期', index: false}}},
            {name: 'CalendarPeriodEdit',path: 'calendar-period/:id'  ,      component: () => import('@/view/Calendar/CalendarPeriod.vue'), meta: {seo: {title: '经期', index: false}}},
        ]
    },
    {
        name: 'Waterfall',
        path: '/waterfall',
        redirect: '/waterfall/list',
        component: () => import('@/framework/WaterfallFramework.vue'),
        meta: {seo: privateSeo},
        children: [
            {name: 'WaterfallList'   , path: 'list'      ,     component: () => import('@/view/DiaryListWaterfall/WaterfallList.vue'), meta: {seo: {title: '瀑布流', index: false}}},
        ]
    },
    {name: 'Setup',                path: '/setup',             component: () => import('@/view/Setup/SetupWizard.vue'), meta: {seo: {title: '安装引导', path: 'setup', index: false}}},
    {name: 'Register',             path: '/register',          component: () => import('@/view/Login&Register/Register.vue'), meta: {seo: {title: '注册', path: 'register', description: '注册标题日记账号，开始用一句话记录每一天。', index: true}}},
    {name: 'RegisterApply',        path: '/register-apply',    component: () => import('@/view/Login&Register/RegisterApply.vue'), meta: {seo: {title: '申请注册', path: 'register-apply', description: '申请注册标题日记账号。', index: true}}},
    {name: 'Share',                path: '/share/:id',         component: () => import('@/view/Share/Share.vue'), meta: {seo: {title: '分享', path: 'share', description: '标题日记公开分享。', index: true}}},
    {name: 'Privacy',              path: '/privacy',           component: () => import('@/view/About/Privacy.vue'), meta: {seo: {title: '隐私说明', path: 'privacy', description: '标题日记隐私说明：账号、日记、权限与第三方服务如何处理你的数据。', index: true}}},
    {name: 'RemoveAllYourDiary',   path: '/clear-diary',       component: () => import('@/view/Util/RemoveAllYourDiary.vue'), meta: {seo: {title: '清空日记', path: 'clear-diary', index: false}} },
    {name: 'DestroyAccount',       path: '/destroy-account',   component: () => import('@/view/Util/DestroyAccount.vue'), meta: {seo: {title: '注销账号', path: 'destroy-account', index: false}} },
    {name: 'ChangePassword',       path: '/change-password',   component: () => import('@/view/Login&Register/ChangePassword.vue'), meta: {seo: {title: '修改密码', path: 'change-password', index: false}} },
    {name: 'ChangeProfile',        path: '/change-profile',    component: () => import('@/view/ChangeProfile/ChangeProfile.vue'), meta: {seo: {title: '资料修改', path: 'change-profile', index: false}} },
    {name: 'Login',                path: '/login',             component: Login, meta: {seo: {title: '登录', path: 'login', description: '登录标题日记，继续记录与回顾你的每一天。', index: true}}},
    {name: 'FetchPassword',        path: '/fetch-password',    component: () => import('@/view/Login&Register/FetchPassword.vue'), meta: {seo: {title: '找回密码', path: 'fetch-password', description: '找回标题日记账号密码。', index: true}} },
    {name: 'Statistics',           path: '/statistics',        component: () => import('@/view/Statistics/StatisticsIndex.vue'), meta: {seo: {title: '统计', path: 'statistics', index: false}} },
    {name: 'SystemConfig',         path: '/system-config',     component: () => import('@/view/SystemConfig/SystemConfigPage.vue'), meta: {requiresAdmin: true, seo: {title: '系统配置', path: 'system-config', index: false}} },
    {name: 'FileManager',          path: '/file-manager',      component: () => import('@/view/FileManager/FileManager.vue'), meta: {seo: {title: '文件库', path: 'file-manager', index: false}} },
    {name: 'Bill',                 path: '/bill',              component: () => import('@/view/Bill/Bill.vue'), meta: {seo: {title: '账单', path: 'bill', index: false}} },
    {name: 'BillImport',           path: '/bill/import',       redirect: {name: 'Bill', query: {view: 'import'}} },
    {name: 'BillExpenseCalendar',  path: '/bill/calendar',     redirect: {name: 'Bill', query: {view: 'calendar'}} },
    {name: 'BillYearTop5',         path: '/bill/year-top5',    redirect: {name: 'Bill', query: {view: 'top5'}} },
    {name: 'BillCandidateList',    path: '/bill/candidates',   component: () => import('@/view/Bill/BillCandidateList.vue'), meta: {seo: {title: '账单候选', index: false}} },
    {name: 'BankCard',             path: '/bank-card',         component: () => import('@/view/BankCard/BankCardList.vue'), meta: {seo: {title: '银行卡', path: 'bank-card', index: false}}  },
    {name: 'Invitation',           path: '/invitation',        component: () => import('@/view/Invitation/InvitationList.vue'), meta: {seo: {title: '邀请', path: 'invitation', index: false}}  },
    {name: 'NotFound',             path: '/:pathMatch(.*)*',   component: NotFound_404, meta: {seo: {title: '页面不存在', index: false}}}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, _) => {
    switch (to.name) {
        case 'Login':
            if (getAuthorization()?.email) {
                return {name: 'Index'}
            }
            return true
        case 'Setup':
        case 'Register':
        case 'RegisterApply':
        case 'Share':
        case 'Privacy':
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
                } else if (to.meta.requiresAdmin && !useProjectStore().isAdminUser) {
                    return {name: 'Index'}
                } else {
                    return true
                }
            } else {
                return {name: 'Login'}
            }
    }
})

router.afterEach((to) => {
    const seo = (to.meta.seo || {}) as RouteSeoMeta
    const path =
        seo.path ??
        (typeof to.name === 'string' && to.name === 'Share'
            ? `share/${String(to.params.id || '')}`
            : to.path.replace(/^\//, ''))
    applySeo({
        title: seo.title,
        description: seo.description,
        path,
        index: seo.index,
    })
})

export  {
    router
}
