<template>
  <div class="home-contain">
    <left @toggleMenu="toggleMenu">df</left>
    <div class="context">
      <context-user></context-user>
      <context-header :title="menuTitle[menu]"></context-header>
      <account-list @toggleMenu="toggleMenu" v-show="menu == 'account'"></account-list>
      <user-list v-show="menu == 'user'"></user-list>
      <share-account-list v-show="menu == 'share'"></share-account-list>
    </div>
  </div>
</template>

<script>
  import Left from './components/Left.vue';
  import AccountList from './components/AccountList.vue';
  import ContextHeader from './components/ContextHeader.vue'
  import ContextUser from './components/ContextUser.vue';
  import UserList from './components/UserList.vue';
  import ShareAccountList from './components/ShareAccountList.vue';
  import { loginUser } from '../../util/api';
    export default {
        name: 'loading-page',
        data: function () {
          return {
            userName: '',
            password: '',
            menu:'account',
            menuTitle:{
              'account':'账号管理',
              'user':'用户管理',
              'share':'账号管理/共享账号'
            }
          }
        },
        components: {
          Left
          ,AccountList
          ,ContextHeader
          ,ContextUser
          ,UserList
          ,ShareAccountList
        },
        methods: {
          toggleMenu(menu){
            this.menu = menu;
          },
            handleLogin(e) {
                this.$http.post(
                    loginUser,
                    JSON.stringify({
                        userName: this.userName,
                        password: this.password
                    }),
                    {
                        headers: { 'Content-Type': "application/json", dataType: "json", }
                    }

                )
                .then(function (response) {
                    sessionStorage.setItem('token', response.data);
                    //window.location.href = './home.html'
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
        },
       
  }
</script>
<style>
.home-contain{
  width:100%;height:100%;
  display: -webkit-box;display: -moz-box;       
  display: -ms-flexbox;display: -webkit-flex;display: flex;
}
.context{
  -webkit-box-flex: 1; -moz-box-flex: 1; 
  -webkit-flex: 1; -ms-flex: 1; flex: 1; 
  overflow: auto;
  -webkit-overflow-scrolling:touch;
  width:100%;
  padding:40px 40px 40px 10px;
}
</style>
