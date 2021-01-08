import Login from "./page/login";
import Register from "./page/register";
import Index from "./page/index";
import Detail from "./page/detail";
import Edit from './page/edit'
import ChangePassword from './page/changePassword'
import Share from './page/share'
import notFound_404 from "@/fundation/notFound_404";

export default [
  {
    name: 'index',
    path: '/',
    component: Index,
    children: [
      {
        name: 'detail',
        path: 'detail/:id',
        component: Detail,
      },
      {
        name: 'share',
        path: 'share/:id',
        component: Share,
      },
      {
        name: 'edit',
        path: 'edit/:id',
        component: Edit,
      },
      {
        name: 'login',
        path: 'login',
        component: Login,
      },
      {
        name: 'register',
        path: 'register',
        component: Register,
      },
      {
        name: 'changePassword',
        path: 'change-password',
        component: ChangePassword,
      },
    ]
  },
  {
    path: '*',
    component: notFound_404
  }

]