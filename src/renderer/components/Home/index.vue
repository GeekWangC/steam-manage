<template>
    <div>
        <left>df</left>
        <button @click="handleBack">bufdsufbsduibf</button>
    </div>
</template>

<script>
    import Left from './components/Left.vue';
    import { loginUser } from '../../util/api';
    export default {
        name: 'loading-page',
        data: function () {
            return {
                userName: '',
                password: ''
            }
        },
        components: {
            Left
        },
        methods: {
            handleBack() {
                this.$router.go(-1);
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
    @import url('../../assets/css/style.css');

    
</style>
