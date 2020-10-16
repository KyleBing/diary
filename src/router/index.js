import Login from "../page/login";
import Register from "../page/register";
import Index from "../page/index";
import detail from "../page/detail";

export default [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/detail',
    component: detail,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
]