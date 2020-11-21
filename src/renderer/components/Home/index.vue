<template>
    <div class="home-contain">
        <left>df</left>
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
    }

    
</style>
