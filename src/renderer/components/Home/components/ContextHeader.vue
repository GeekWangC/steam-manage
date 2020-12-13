<template>
	<div>
		<div class="context-header">
			<div class="context-menu">
				<span 
					v-for="(item,index) in title.split('/')" 
					@click="handleSetRouter($event,item)"
					:key="index">{{item}}/</span>	
			</div>
			
			<div class="context-util">
				<a-select v-show="1==2" default-value="lucy" style="width: 120px" @change="handleChange">
		      <a-select-option value="jack">
		        Jack
		      </a-select-option>
		      <a-select-option value="lucy">
		        Lucy
		      </a-select-option>
		      <a-select-option value="disabled" disabled>
		        Disabled
		      </a-select-option>
		      <a-select-option value="Yiminghe">
		        yiminghe
		      </a-select-option>
		    </a-select>
				<a-button type="primary" 
					:disabled="!admin"
					@click="handleSetLimitToggole">账号分享上限设置</a-button>
				<a-button v-if="title === '主界面'" type="primary" @click="handleAddAccount">+ {{
					'创建'
				}}</a-button>
			</div>

		</div>
		<div>
			<a-modal v-model="visible" title="录入账号" :footer="null">
	      <a-form :form="addConuntForm" @submit="handleSubmit">
	      	<a-form-item label="账号">
			      <a-input
			        v-decorator="['name', { rules: [{ required: true, message: '请输入账号' }] }]"
			      />
			    </a-form-item>
			    <a-form-item label="密码">
			      <a-input
			        v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]"
			      />
			    </a-form-item>
			    <a-form-item v-if="showVartoken" label="令牌验证">
			      <a-input 
			        v-decorator="['vartoken', { rules: [{ required: true, message: '请输入令牌验证' }] }]"
			      />
			    </a-form-item>
			    <a-button type="primary" html-type="submit">
		        提交

		      </a-button>
	      </a-form>
	      <div class="contain-main">
					<a-spin size="large" v-if='loading2' />
				</div>
	    </a-modal>

	    <a-modal v-model="visible2" title="账号使用者上限设置" :footer="null">
	      <a-form :form="setLimitForm" @submit="handleSetLimit">
			    <a-form-item label="使用者人数上限">
			      <a-input
			      	type="number"
			        v-decorator="['limit', { rules: [{ required: true, message: '请输入使用者人数上限' }] }]"
			      />
			    </a-form-item>
			    <a-button type="primary" html-type="submit">
		        提交
		      </a-button>
	      </a-form>
	    </a-modal>
	  </div>
	</div>
</template>

<script>
	import { Button,Modal,Form,Input,Select,message,Spin } from 'ant-design-vue';
	import { addAcconut,setLimit,userMsg
		,checkEmail } from '../../../util/api';
  export default {
    name: 'contextHeader',
    props: ['title'],
    data() {
      return {
      	admin:false,
        visible:false,
        visible2:false,
        addConuntForm: this.$form.createForm(this, { name: 'coordinated' }),
        setLimitForm: this.$form.createForm(this, { name: 'setLimitForm' }),
        name:'',
        password:'',

        limit:'',
        menuTitle:{
          '主界面':'account',
          '接收账号':'user',
          '发送权限':'share',
          '消费记录':'consumeRecords',
          '充值记录':'rechargeRecords',
        },
        vartoken:'',
        showVartoken:false,
        newAccountId:'',
        loading2:false,
      }
    },
    components: {
    	AButton:Button,
    	AModal:Modal,
    	AForm:Form,
    	AInput:Input,
    	AFormItem:Form.Item,
    	ASelect:Select,
    	ASelectOption:Select.Option,
    	ASpin:Spin
    },
    mounted(){
    	this.getUserMsg();
    },
    methods: {
    	interCheckEmail(params){
    		if(this.loading2){
    			return false;
    		}
    		this.loading2 = true;
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.post(
    			checkEmail,
    			JSON.stringify(params),
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
    			// self.data = res.data.data;
    			self.visible = !self.visible;
    			self.loading2 = false;
  				self.name = '',
      		self.password = '',
      		self.vartoken = '',
  				self.$emit('toggleHandleAccount','');
    			
    		})
    		.catch(function (error) {
    			self.loading2 = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
			    	message.error('网络异常，请稍后再试', [2])
			    }
        });
    	},

    	handleSetRouter(e,router){
    		// 事件绑定 - 切换路由
    		e.preventDefault();
    		this.$emit('toggleMenu',this.menuTitle[router]);
    	},
    	handleChange(){

    	},
    	handleAddAccount(){
    		this.visible = !this.visible;
    	},
    	handleSetLimitToggole(){
    		if(this.admin){
    			this.visible2 = !this.visible2;	
    		}
    	},
    	handleSetLimit(e){
    		e.preventDefault();
	      this.setLimitForm.validateFields((err, values) => {
	        if (!err) {
	        	values.limit = parseInt(values.limit)
	          this.setLimit(values);
	        }
	      });
    	},
    	handleSubmit(e) {
	      e.preventDefault();
	      const self = this;
	      this.addConuntForm.validateFields((err, values) => {

	        if (!err) {
	        	if(values.vartoken){
	      			const params = {
	      				emailCode:values.vartoken,
	      				accountId:self.newAccountId
	      			}
	      			this.interCheckEmail(params)
	      		}else{
	      			this.addAcconut(values);	
	      		}
	          
	        }
	      });
	    },
    	addAcconut(param){
    		if(this.loading2){
    			return false;
    		}
    		this.loading2 = true;
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		// self.showVartoken = true;
    		this.$http.post(
    			addAcconut,
    			JSON.stringify(param),
    			{
    				headers: { 
  						'Content-Type': "application/json", 
  						'data-Type': "json", 
  						token,
  					}
    			}
    		)
    		.then(function(response){
    			const res = response.data;
    			if(res && res.data && res.data.accountId){
    				// 等后台接口调整结构
	    			if(res && res.data && res.data.needValidation){
	    				self.newAccountId = res.data.accountId;
	    				self.showVartoken = true;
	    				self.loading2 = false;
	    				return;
	    			}
	    			if(res.data){
	    				self.visible = !self.visible;
	    				self.name = '',
	        		self.password = '',
	    				self.$emit('toggleHandleAccount','');
	    				self.loading2 = false;
	    			};
    			}else{
    				self.loading2 = false;
    				message.error('用户不存在', [2])
    			}
    			
    			
    		})
    		.catch(function (error) {
    			this.loading2 = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
			    	message.error('网络异常，请稍后再试', [2])
			    }
        });
    	},
    	setLimit(param){
    		
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.post(
    			setLimit,
    			JSON.stringify(param),
    			{
    				params:param,
    				headers: { 
  						'Content-Type': "application/json", 
  						'data-Type': "json", 
  						token,
  					}
    			}
    		)
    		.then(function(response){
    			const res = response.data;
    			if(res.data){
    				self.visible2 = !self.visible2;
    				message.info('设置成功', [2])
    			};
    		})
    		.catch(function (error) {
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
			    	message.error('网络异常，请稍后再试', [2])
			    }
        });
    	},
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
    			self.admin = res.data.admin;
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
.context-header{
  display: -webkit-box;display: -moz-box;       
  display: -ms-flexbox;display: -webkit-flex;display: flex;
  -webkit-box-align: center;-webkit-align-items: center;-moz-align-items: center;
  -ms-align-items: center;-o-align-items: center;align-items: center;
  -webkit-box-pack: space-between;
  -webkit-justify-content: space-between;-moz-justify-content: space-between;
 	justify-content: space-between;
  width:100%;
  padding:0 0 19px;
}
.context-menu{
	cursor:pointer;
}
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
