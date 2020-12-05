<template>
	<div v-html='data'>
		
	</div>
</template>

<script>
	import { getConsumeRecords } from '../../../util/api';

  export default {

  	// 消费记录
    name: 'consumeRecords',
    props:['accountId'],
    data() {
      return {
        data:'',
      }
    },
    components: {
    	
    },
    mounted(){
    	this.accountId && this.getConsumeRecords();
    },
    methods: {
    	getConsumeRecords(e){
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.get(
    			getConsumeRecords,
    			{
    				params:{
	    				accountId:self.accountId
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
    			self.data = res.data.data;
    		})
    		.catch(function (error) {
          console.log(error);
        });
    	},

    },
  }
</script>
<style scoped>

</style>
