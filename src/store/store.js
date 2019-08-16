//引入VUEX
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const store=new Vuex.Store({
  state:localStorage.getItem("state") ? JSON.parse(sessionStorage.getItem("state")) : {
    token:"",
    userInfo:{}
  }




})

export default store

