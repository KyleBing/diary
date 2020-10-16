import Login from "../page/login";
import Register from "../page/register";
import Index from "../page/index";
import Detail from "../page/detail";
import Edit from '../page/edit'
import ChangePassword from '../page/changePassword'

export default [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/detail',
    component: Detail,
  },
  {
    path: '/edit',
    component: Edit,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/change-password',
    component: ChangePassword,
  },
]