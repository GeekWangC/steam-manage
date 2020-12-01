<template>
	<div class="context-header">
		<span>{{title}}</span>
		<div class="context-util">
			<a-select default-value="lucy" style="width: 120px" @change="handleChange">
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
			<a-button type="primary" @click="handleSetLimitToggole">账号使用者上限设置</a-button>
			<a-button type="primary" @click="handleAddAccount">+ 创建账号</a-button>
		</div>

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
		    <a-button type="primary" html-type="submit">
	        提交
	      </a-button>
      </a-form>
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
</template>

<script>
	import { Button,Modal,Form,Input,Select } from 'ant-design-vue';
	import { addAcconut,setLimit } from '../../../util/api';
  export default {
    name: 'contextHeader',
    props: ['title'],
    data() {
      return {
        visible:false,
        visible2:false,
        addConuntForm: this.$form.createForm(this, { name: 'coordinated' }),
        setLimitForm: this.$form.createForm(this, { name: 'setLimitForm' }),
        name:'',
        password:'',
        limit:'',
      }
    },
    components: {
    	AButton:Button,
    	AModal:Modal,
    	AForm:Form,
    	AInput:Input,
    	AFormItem:Form.Item,
    	ASelect:Select,
    	ASelectOption:Select.Option
    },
    mounted(){
    },
    methods: {
    	handleChange(){

    	},
    	handleAddAccount(){
    		this.visible = !this.visible;
    	},
    	handleSetLimitToggole(){
    		this.visible2 = !this.visible2;
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
	      this.addConuntForm.validateFields((err, values) => {
	        if (!err) {
	          this.addAcconut(values);
	        }
	      });
	    },
    	addAcconut(param){
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
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
    			if(res.data){
    				self.visible = !self.visible;
    			};
    		})
    		.catch(function (error) {
          console.log(error);
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
    			};
    		})
    		.catch(function (error) {
          console.log(error);
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
</style>
