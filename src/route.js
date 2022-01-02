import Login from "@/page/Login";
import Register from "@/page/Register";
import Index from "@/page/Index";
import List from "@/page/List";
import IndexMobile from "@/page/IndexMobile";
import Detail from "@/page/Detail";
import Edit from '@/page/Edit'
import ChangePassword from '@/page/ChangePassword'
import Share from '@/page/Share'
import notFound_404 from "@/fundation/NotFound_404";
import YearSelector from "@/components/YearSelector";

const pcRoutes = [
    {
        name: 'index',
        path: '/',
        component: Index,
        redirect: '/edit',
        children: [
            {name: 'detail', path: 'detail/:id', component: Detail,},
            {name: 'editNew', path: 'edit', component: Edit,},
            {name: 'edit', path: 'edit/:id', component: Edit,},]
    },
    {name: 'register',       path: '/register',        component: Register,       },
    {name: 'share',          path: '/share/:id',       component: Share,          },
    {name: 'changePassword', path: '/change-password', component: ChangePassword, },
    {name: 'login',          path: '/login',           component: Login,          },
    {name: 'test',           path: '/test',            component: YearSelector,   },
    {path: '*',              component: notFound_404}
]

const mobileRoutes = [
    {
        name: 'index',
        path: '/',
        component: IndexMobile,
        redirect: '/list',
        children: [
            {name: 'list', path: 'list', component: List,},
            {name: 'detail', path: 'detail/:id', component: Detail,},
            {name: 'editNew', path: 'edit', component: Edit,},
            {name: 'edit', path: 'edit/:id', component: Edit,},]
    },
    {name: 'register',       path: '/register',        component: Register,       },
    {name: 'share',          path: '/share/:id',       component: Share,          },
    {name: 'changePassword', path: '/change-password', component: ChangePassword, },
    {name: 'login',          path: '/login',           component: Login,          },
    {name: 'test',           path: '/test',            component: YearSelector,   },
    {path: '*',              component: notFound_404}
]

export {
    pcRoutes, mobileRoutes
}
