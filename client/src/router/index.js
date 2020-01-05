import Vue from 'vue'
import Router from 'vue-router'
// @ 表示src這個資料夾
import PostComponent from '@/components/PostComponent'
import GameComponent from '@/components/GameComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: PostComponent
    },
    {
      path: '/game',
      component: GameComponent
    }
  ]
})