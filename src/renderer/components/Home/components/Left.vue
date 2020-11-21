<template>
    <div class="left-menu">
        <header>
            <img class="header-img" src="" />
            STEAM
        </header>
        <span class="left-menu-title">System Menu</span>
        <ul>
            <li>
                <img class="menu-img" src="../image/icon-account.png" />
                账号管理
            </li>
            <li>用户管理</li>
        </ul>
        <footer>退出</footer>
    </div>
</template>

<script>
    export default {
        name: 'loading-page',
        data() {
            return {
                userName: '',
                password: ''
            }
        },
        components: {},
        methods: {
            
        },
    }
</script>
<style scoped>
    .left-menu{
        width:300px;height:100%;
        display:flex;
        padding-top:46px;
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
        border-left:3px solid #364FF0;
        padding-left:42px;
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
    }
</style>
