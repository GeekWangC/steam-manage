<template>
	<div class="context-user">
		<div></div>
		<div class="user">
			<img src="../image/icon-head portrait@2x.png" height="80" width="80">
			<div class="user-msg">
				<span>welcome back</span>
				<span>{{ userName }}</span>
			</div>
		</div>	
	</div>
</template>

<script>
	import { Button,Modal,Form,Input,Select } from 'ant-design-vue';
	import { addAcconut,userMsg } from '../../../util/api';
  export default {
    name: 'contextUser',
    data() {
      return {
        userName:'1',
      }
    },
    components: {
    	
    },
    mounted(){
    	this.getUserMsg();
    },
    methods: {
    	getUserMsg(e){
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.get(
    			userMsg,
    			{
    				headers: { 
  						'Content-Type': "application/json", 
  						dataType: "json", 
  						token,
  					}
    			}
    		)
    		.then(function(response){
    			const res = response.data;
    			self.userName = res.data.name;
    			self.admin = res.data.admin;
    			self.total = res.data.total || 1;
    		})
    		.catch(function (error) {
          console.log(error);
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
			    	message.error('网络异常，请稍后再试', [2])
			    }
        });
    	}
    },
  }
</script>
<style scoped>
.context-user{
  display: -webkit-box;display: -moz-box;       
  display: -ms-flexbox;display: -webkit-flex;display: flex;
  -webkit-box-align: center;-webkit-align-items: center;-moz-align-items: center;
  -ms-align-items: center;-o-align-items: center;align-items: center;
  -webkit-box-pack: space-between;
  -webkit-justify-content: space-between;-moz-justify-content: space-between;
 	justify-content: space-between;
  width:100%;
  padding-bottom:42px;
}
.context-user .user{
	display: -webkit-box;display: -moz-box;       
  display: -ms-flexbox;display: -webkit-flex;display: flex;
  -webkit-justify-content: center;-moz-justify-content: center;
  -ms-justify-content: center;-o-justify-content: center;justify-content: center;
}
.context-user .user img{
	width:40px;height:40px;margin-right:22px;
}
.context-user .user .user-msg{
	display: -webkit-box;display: -moz-box;       
  display: -ms-flexbox;display: -webkit-flex;display: flex;
  -webkit-box-orient: vertical;-webkit-flex-direction: column;-moz-flex-direction: column;
  -ms-flex-direction: column;-o-flex-direction: column;flex-direction: column;
	font-size: 13px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #6C6C6C;
	line-height: 18px;
}
</style>
