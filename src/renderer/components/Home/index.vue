<template>
  <div class="home-contain">
    <left @toggleMenu="toggleMenu">df</left>
    <div class="context">
      <context-user></context-user>
      <context-header 
        :title="menuTitle[menu]" 
        @toggleHandleAccount="toggleHandleAccount"
        @toggleMenu="toggleMenu"></context-header>
      <account-list 
        @toggleMenu="toggleMenu" 
        :key="handleAccount" v-if="menu == 'account'"></account-list>
      <user-list 
        :key="handleAccount"
        v-if="menu == 'user'"></user-list>
      <share-account-list v-if="menu == 'share'"></share-account-list>
      <recharge-records :accountId='accountId' v-if="menu == 'rechargeRecords'"></recharge-records>
      <consume-records :accountId='accountId' v-if="menu == 'consumeRecords'"></consume-records>
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
  import ConsumeRecords from './components/ConsumeRecords.vue';
  import RechargeRecords from './components/RechargeRecords.vue';
  import { loginUser } from '../../util/api';
    export default {
        name: 'loading-page',
        data: function () {
          return {
            userName: '',
            password: '',
            menu:'account',
            menuTitle:{
              'account':'主界面',
              'user':'接收账号',
              'share':'主界面/发送权限',
              'consumeRecords':'主界面/消费记录',
              'rechargeRecords':'主界面/充值记录',
            },
            accountId:'',
            handleAccount:false,
          }
        },
        components: {
          Left
          ,AccountList
          ,ContextHeader
          ,ContextUser
          ,UserList
          ,ShareAccountList
          ,ConsumeRecords
          ,RechargeRecords
        },
        methods: {
          toggleHandleAccount(){
            this.handleAccount = !this.handleAccount;
          },
          toggleMenu(menu,id){
            this.menu = menu;
            this.accountId = id;
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
