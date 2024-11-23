import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

import IndexFramework from "../framework/IndexFramework.vue"
import Waterfall from "../framework/Waterfall.vue"
import Register from "@/view/Login&Register/Register.vue"
import Login from "@/view/Login&Register/Login.vue"
import ChangePassword from "@/view/Login&Register/ChangePassword.vue"
import ChangeProfile from "@/view/ChangeProfile/ChangeProfile.vue"
import Bill from "@/view/Bill/Bill.vue"
import BankCardList from "@/view/BankCard/BankCardList.vue"
import InvitationList from "@/view/Invitation/InvitationList.vue"
import Share from "@/view/Share/Share.vue"
import Statistics from "@/view/Statistics/StatisticsIndex.vue"

import List from "@/view/DiaryList/List.vue"
import Detail from "@/view/Detail/Detail.vue"
import Edit from "@/view/Edit/Edit.vue"
import NotFound_404 from "../fundation/NotFound_404.vue";
import WaterfallList from "@/view/DiaryListWaterfall/WaterfallList.vue";
import RemoveAllYourDiary from "@/view/Util/RemoveAllYourDiary.vue";
import DestroyAccount from "@/view/Util/DestroyAccount.vue";
import FileManager from "@/view/FileManager/FileManager.vue";
import {getAuthorization, isInMobileMode} from "../utility.ts";
import FetchPassword from "@/view/Login&Register/FetchPassword.vue";
import Calendar from "@/view/Calendar/Calendar.vue";
import CalendarFramework from "@/framework/CalendarFramework.vue";


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
        component: CalendarFramework,
        redirect: "/calendar/calendar",
        children: [
            {name: 'Calendar', path: 'calendar'  ,   component: Calendar}
        ]
    },
    {
        name: 'Waterfall',
        path: '/waterfall',
        redirect: '/waterfall/list',
        component: Waterfall ,
        children: [
            {name: 'WaterfallList'   , path: 'list'      ,        component: WaterfallList},
        ]
    },
    {name: 'Register',             path: '/register',          component: Register},
    {name: 'Share',                path: '/share/:id',         component: Share},
    {name: 'RemoveAllYourDiary',   path: '/clear-diary',       component: RemoveAllYourDiary },
    {name: 'DestroyAccount',       path: '/destroy-account',   component: DestroyAccount },
    {name: 'ChangePassword',       path: '/change-password',   component: ChangePassword },
    {name: 'ChangeProfile',        path: '/change-profile',    component: ChangeProfile },
    {name: 'Login',                path: '/login',             component: Login},
    {name: 'FetchPassword',        path: '/fetch-password',    component: FetchPassword},
    {name: 'Statistics',           path: '/statistics',        component: Statistics},
    {name: 'FileManager',          path: '/file-manager',      component: FileManager},
    {name: 'Bill',                 path: '/bill',              component: Bill},
    {name: 'BankCard',             path: '/bank-card',         component: BankCardList },
    {name: 'Invitation',           path: '/invitation',        component: InvitationList },
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
                    if (isInMobileMode()) {
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
