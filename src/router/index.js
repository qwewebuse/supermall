import Vue from 'vue'
import Router from 'vue-router'

const Home= () => import('views/home/Home')
const Category= () => import('views/category/Category')
const Profile= () => import('views/profile/Profile')
const Shopcart= () => import('views/shopcart/Shopcart')
const Detail= () => import('views/detail/Detail')

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
//在项目目录下运行 npm i vue-router@3.0 -S
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes=[
  {
    path:'',
    redirect: '/home'
  },
  {
    path:'/home',
    component:Home
  },
  {
    path:'/shopcart',
    component:Shopcart
  },
  {
    path:'/category',
    component:Category
  },
  {
    path:'/profile',
    component:Profile
  },
  {
    path:'/detail/:iid',
    component:Detail
  }

]

export default new Router({
  routes,
  mode:'history'
})
