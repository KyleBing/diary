import Login from "../page/login";
import Register from "../page/register";
import Index from "../page/index";

export default [
  {
    path: '/',
    component: Index,
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