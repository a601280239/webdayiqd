import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import login from '@/view/login/login'
import shouye from '@/view/shouye/shouye'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import system from '@/view/shouye/system'
import yonghu from '@/view/shouye/yonghu/yonghu'
import juese from '@/view/shouye/juese/juese'
import quanxian from '@/view/shouye/quanxian/quanxian'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require: false
      }
    },
    {
      path: '/shouye',
      name: 'shouye',
      component: shouye,
      meta:{
        require:true//该路径的访问需要登录
      },
      children:[
        {
          path: "/datamain",
          component: datamain,
          children: [
            {path:'/system',component:system,meta:{require:true}},
            {path:'/yonghu',component:yonghu,meta:{require:true}},
            {path:'/juese',component:juese,meta:{require:true}},
            {path:'/quanxian',component:quanxian,meta:{require:true}},
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    }

  ]
})


