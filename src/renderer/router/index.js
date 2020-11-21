import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        

    
        {
            path: '/',
            name: 'login-page',
            component: require('@/components/Login').default
        },
        {
            path: '/home',
            name: 'home-page',
            component: require('@/components/Home').default
        },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
