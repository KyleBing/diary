import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

import Index from "../framework/Index.vue"
import Hole from "../framework/Hole.vue"
import Register from "../page/login&register/Register.vue"
import Login from "../page/login&register/Login.vue"
import ChangePassword from "../page/login&register/ChangePassword.vue"
import ChangeProfile from "../page/changeProfile/ChangeProfile.vue"
import Bill from "../page/bill/Bill.vue"
import BankCardList from "../page/bankCard/BankCardList.vue"
import InvitationList from "../page/invitation/InvitationList.vue"
import Share from "../page/share/Share.vue"
import Statistics from "../page/statistics/StatisticsIndex.vue"

import List from "../page/list/List.vue"
import Detail from "../page/detail/Detail.vue"
import Edit from "../page/edit/Edit.vue"
import NotFound_404 from "../fundation/NotFound_404.vue";
import ListHole from "../page/listHole/ListHole.vue";
import RemoveAllYourDiary from "../page/others/RemoveAllYourDiary.vue";
import DestroyAccount from "../page/others/DestroyAccount.vue";
import FileManager from "../page/fileManager/FileManager.vue";
import {getAuthorization, isInMobileMode} from "../utility.ts";
import FetchPassword from "../page/login&register/FetchPassword.vue";


const routes: RouteRecordRaw[] = [
    {
        name: 'Index',
        path: '/',
        component: Index,
        redirect: "/list",
        children: [
            {name: 'List'   , path: 'list'      ,        component: List}, // mobile
            {name: 'Detail' , path: 'detail/:id',        component: Detail},
            {name: 'EditNew', path: 'edit'      ,        component: Edit},
            {name: 'Edit'   , path: 'edit/:id'  ,        component: Edit}
        ]
    },
    {
        name: 'Hole',
        path: '/hole',
        component: Hole ,
        children: [
            {name: 'ListHole'   , path: 'list'      ,        component: ListHole}, // mobile
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
