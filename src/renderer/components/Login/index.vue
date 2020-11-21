<template>
    <main>
        <button @click="handleCreate">189346782964978321469823</button>
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
                <h1>Authorization</h1>
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
                <button type="button" id="login" class="styled-button" @click="handleLogin">
                    <span class="styled-button__real-text-holder">
                        <span class="styled-button__real-text">SubmitÍõ</span>
                        <span class="styled-button__moving-block face">
                            <span class="styled-button__text-holder">
                                <span class="styled-button__text">SubmiÍõt</span>
                            </span>
                        </span><span class="styled-button__moving-block back">
                            <span class="styled-button__text-holder">
                                <span class="styled-button__text">SubmitÍõ</span>
                            </span>
                        </span>
                    </span>
                </button>
            </div>

        </form>
    </main>
</template>

<script>
    import { loginUser, createUser } from '../../util/api';
    export default {
        name: 'login-page',
        data() {
            return {
                userName: '',
                password: ''
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
                    sessionStorage.setItem('token', response.data);
                    self.$router.push('/home');
                    //window.location.href = './home.html'
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            handleCreate() {
                this.$http.post(
                    createUser,
                    JSON.stringify({
                        userName: 'test1',
                        password: 'test1'
                    }),
                    {
                        headers: { 'Content-Type': "application/json", dataType: "json", }
                    }

                )
                .then(function (response) {
                    //sessionStorage.setItem('token', response.data);
                    //this.$router.push('home');
                    //window.location.href = './home.html'
                })
                .catch(function (error) {
                    console.log(error);
                });
                
            }
        },
        mounted() {

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

    
</style>
