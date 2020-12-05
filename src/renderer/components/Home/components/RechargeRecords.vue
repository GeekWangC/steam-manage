<template>
	<div>
		<div v-html='data'>
		
		</div>
		<div class="contain-main">
			<a-spin size="large" v-if='loading' />
		</div>
	</div>
</template>

<script>
	import { Spin,message } from 'ant-design-vue';
	import { getRechargeRecords,getConsumeRecords } from '../../../util/api';

  export default {

  	// 充值记录
    name: 'rechargeRecords',
    props:['accountId'],
    data() {
      return {
        data:'',
        loading:false,
      }
    },
    components: {
    	ASpin:Spin
    },
    mounted(){
    	this.accountId && this.getRechargeRecords();
    },
    methods: {
    	getRechargeRecords(e){
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.loading = true;
    		this.$http.get(
    			getRechargeRecords,
    			{
    				params:{
	    				accountId:self.accountId,
	    			},
    				headers: { 
  						'Content-Type': "application/json", 
  						dataType: "json", 
  						token,
  					}
    			}
    		)
    		.then(function(response){
    			const res = response.data;
    			self.data = res.data;
    			self.loading = false;
    		})
    		.catch(function (error) {
          console.log(error);
          self.loading = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
			    	message.error('网络异常，请稍后再试', [2])
			    }
        });
    	},

    },
  }
</script>
<style scoped>
.contain-main{
	width:100%;height:100%;
  display: -webkit-box;display: -moz-box;       
  display: -ms-flexbox;display: -webkit-flex;display: flex;
  -webkit-box-align: center;-webkit-align-items: center;-moz-align-items: center;
  -ms-align-items: center;-o-align-items: center;align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;-moz-justify-content: center;
  -ms-justify-content: center;-o-justify-content: center;justify-content: center;
}
</style>
