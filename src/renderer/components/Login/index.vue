<template>
  <main class="login-contian">
    <button v-if="1 === 2" @click="handleCreate">悄悄注册</button>
    <form class="form">
        <div class="form__cover"></div>
        <div class="form__loader">
            <div class="spinner active">
                <svg class="spinner__circular" viewBox="25 25 50 50">
                    <circle class="spinner__path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"></circle>
                </svg>
            </div>
        </div>
        <div class="form__content">
            <h1>{{type == 1 ? 'sign in to steam' : 'sign up to steam'}}</h1>
            <div class="styled-input">
                <input id="username" type="text" class="styled-input__input" name="nickname" v-model="userName">
                <div class="styled-input__placeholder">
                    <span class="styled-input__placeholder-text">Username</span>
                </div>
                <div class="styled-input__circle"></div>
            </div><div class="styled-input">
                <input id="password" type="text" class="styled-input__input" v-model="password">
                <div class="styled-input__placeholder">
                    <span class="styled-input__placeholder-text">Password</span>
                </div>
                <div class="styled-input__circle"></div>
            </div>
            <div v-show='type==2' class="styled-input">
              <input id="confirmPassword" type="text" class="styled-input__input" v-model="confirmPassword">
              <div class="styled-input__placeholder">
                <span class="styled-input__placeholder-text">confirmPassword</span>
              </div>
              <div class="styled-input__circle"></div>
            </div>
            <button v-show='type != 2' type="button" id="login" class="styled-button" @click="handleLogin">
                <span class="styled-button__real-text-holder">
                    <span class="styled-button__real-text">Sign in(登陆)</span>
                    <span class="styled-button__moving-block face">
                        <span class="styled-button__text-holder">
                            <span class="styled-button__text">Sign in(登陆)</span>
                        </span>
                    </span><span class="styled-button__moving-block back">
                        <span class="styled-button__text-holder">
                            <span class="styled-button__text">Sign in(登陆)</span>
                        </span>
                    </span>
                </span>
            </button>
            <button type="button" id="login" class="styled-button" @click="handleCreate">
                <span class="styled-button__real-text-holder">
                    <span class="styled-button__real-text">Sign up(注册)</span>
                    <span class="styled-button__moving-block face">
                        <span class="styled-button__text-holder">
                            <span class="styled-button__text">Sign up(注册)</span>
                        </span>
                    </span><span class="styled-button__moving-block back">
                        <span class="styled-button__text-holder">
                            <span class="styled-button__text">Sign up(注册)</span>
                        </span>
                    </span>
                </span>
            </button>
        </div>

    </form>
  </main>
</template>

<script>
  import { Table,Button,Modal,Form,Input,Pagination,message
    ,Spin,Popconfirm,Select } from 'ant-design-vue';
    import { loginUser, createUser } from '../../util/api';
    export default {
        name: 'login-page',
        data() {
            return {
              userName: '',
              password: '',
              confirmPassword:'',
              type:'1',//1 登陆 2注册
              title:'     sign in steam     ',
            }
        },
        components: {},
        methods: {
          handleLogin(e) {
              const self = this;
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
                  const res = response.data;
                  sessionStorage.setItem('token', res.data);
                  self.$router.push('/home');
                  //window.location.href = './home.html'
              })
              .catch(function (error) {
                  console.log(error);
              });
          },
          handleCreate() {
            const self = this;
            if(self.type == 1){
              self.type = 2;  
            }else{
              if(self.password.length < 8){
                message.error('密码长度不匹配，请重新输入', [2])
              }else if(self.password !== self.confirmPassword){
                message.error('密码与确认密码不匹配，请重新输入', [2])
              }else{
                this.$http.post(
                  createUser,
                  JSON.stringify({
                      userName: this.userName,
                      password: this.password
                  }),
                  {
                      headers: { 'Content-Type': "application/json", dataType: "json", }
                  }

                )
                .then(function (response) {
                  message.info('注册成功，请登陆', [2]);
                  self.type = 1;
                    //sessionStorage.setItem('token', response.data);
                    //this.$router.push('home');
                    //window.location.href = './home.html'
                })
                .catch(function (error) {
                    console.log(error);
                });
              }
            }
            
            return;
            
              
          }
        },
        mounted() {
            // this.handleCreate();
            var placeholders = document.querySelectorAll('.styled-input__placeholder-text'),
                inputs = document.querySelectorAll('.styled-input__input');

            placeholders.forEach(function (el, i) {
                var value = el.innerText,
                    html = '';
                for (var _iterator = value, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var w = _ref;

                    if (!value) value = '&nbsp;';
                    html += '<span class="letter">' + w + '</span>';
                }
                el.innerHTML = html;
            });

            inputs.forEach(function (el) {
                var parent = el.parentNode;
                el.addEventListener('focus', function () {
                    parent.classList.add('filled');
                    placeholderAnimationIn(parent, true);
                }, false);
                el.addEventListener('blur', function () {
                    if (el.value.length) return;
                    parent.classList.remove('filled');
                    placeholderAnimationIn(parent, false);
                }, false);
            });

            function placeholderAnimationIn(parent, action) {
                var act = action ? 'add' : 'remove';
                var letters = parent.querySelectorAll('.letter');
                letters = [].slice.call(letters, 0);
                if (!action) letters = letters.reverse();
                letters.forEach(function (el, i) {
                    setTimeout(function () {
                        var contains = parent.classList.contains('filled');
                        if (action && !contains || !action && contains) return;
                        el.classList[act]('active');
                    }, 50 * i);
                });
            }

            setTimeout(function () {
                document.body.classList.add('on-start');
            }, 100);

            setTimeout(function () {
                document.body.classList.add('document-loaded');
            }, 1800);



        }
  }
</script>
<style>
  @import url('../../assets/css/style.css');
  main{
    display: -webkit-box; 
    display: -moz-box;    
    display: -ms-flexbox; 
    display: -webkit-flex; 
    display: flex;         
    -webkit-box-align: center;-webkit-align-items: center;-moz-align-items: center;
    -ms-align-items: center;-o-align-items: center;align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;-moz-justify-content: center;
    -ms-justify-content: center;-o-justify-content: center;justify-content: center;
  }
    
</style>
