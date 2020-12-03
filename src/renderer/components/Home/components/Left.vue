<template>
    <div class="left-menu">
        <header>
            <img class="header-img" src="../image/home.png"/>
            STEAM
        </header>
        <span class="left-menu-title">System Menu</span>
        <ul>
            <li v-for="(item,idx) in menuList" 
                :key="idx"
                @click='handleMenuClick(idx,item.menu)'
                :class="[selIdx === idx ? 'sel' :'']">
                <img class="menu-img" :src="item.src" />
                {{item.title}}
            </li>
        </ul>
        <footer @click='handleBack' class="back-home">
          <img class="header-img" src="../image/icon-tc@2x.png" height="44" width="38"/>
          退出</footer>
    </div>
</template>

<script>
    export default {
        name: 'loading-page',
        data() {
            return {
                userName: '',
                password: '',
                selIdx:0,
                menuList:[
                    {
                        src:require('../image/icon-account.png'),
                        title:'账号管理',
                        menu:'account'
                    },
                    {
                        src:require('../image/icon-user management@2x.png'),
                        title:'用户管理',
                        menu:'user'
                    }
                ]
            }
        },
        components: {},
        methods: {
            handleMenuClick:function(idx,menu){
              this.selIdx = idx;
              this.$emit('toggleMenu',menu);
            }, 
            handleBack() {
                this.$router.replace('/');
                sessionStorage.removeItem('token');
            },
        },
    }
</script>
<style scoped>
    .left-menu{
        width:300px;height:100%;
        display:flex;
        -webkit-box-orient: vertical;
        -webkit-flex-direction: column;-moz-flex-direction: column;
        -ms-flex-direction: column;-o-flex-direction: column;flex-direction: column;
        padding-top:46px;
        padding-bottom:67px;
    }
    header {
        padding-left: 40px;
        font-size: 28px;
        font-family: Helvetica-Bold, Helvetica;
        font-weight: bold;
        color: #183B56;
    }
    .header-img {
        width:46px;height:46px;
        margin-right:20px;
    }
    .left-menu-title {
        padding:34px 0 37px 40px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6C6C6C;
    }
    ul{
        flex:1;
    }
    li {
        display:flex;
        align-items:center;
        width: 100%;
        height: 54px;
        background: #fff;
        padding-left:42px;
        cursor:pointer;
        border-left: 3px solid #fff;
    }
    .menu-img {
        width:20px;height:20px;margin-right:20px;
    }

    .sel {
        background: #F4F3FA;
        border-left: 3px solid #364FF0;
    }
    footer {
      padding-left:40px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0D0E10;
      line-height: 22px;
      display: -webkit-box;display: -moz-box;       
      display: -ms-flexbox;display: -webkit-flex;display: flex;
      -webkit-box-align: center;-webkit-align-items: center;-moz-align-items: center;
      -ms-align-items: center;-o-align-items: center;align-items: center;
    }
    .back-home img{
      width:19px;height:22px;
      margin-right:22px;
    }
</style>
