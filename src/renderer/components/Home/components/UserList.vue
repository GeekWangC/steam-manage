<template>
	<div>
		<a-table 
			:pagination="false"
	    :loading="loading"
			:columns="columns" :data-source="data">
			<span slot="index" slot-scope="text, record,index">
				{{currentPage*pageSize+parseInt(index)+1}}
			</span>
	    <!-- <a slot="name" slot-scope="text">{{ text }}</a>
	    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
	    <span slot="tags" slot-scope="tags">
	      <a-tag
	        v-for="tag in tags"
	        :key="tag"
	        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
	      >
	        {{ tag.toUpperCase() }}
	      </a-tag>
	    </span>
	    <span slot="action" slot-scope="text, record">
	      <a>Invite 一 {{ record.name }}</a>
	      <a-divider type="vertical" />
	      <a>Delete</a>
	      <a-divider type="vertical" />
	      <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
	    </span> -->
	    <span slot="action" slot-scope="text, record">
	      <a-button v-if="record.verify" type="primary" 
	      	@click="handleCheckEmail(record.accountId)">
	      	邮箱验证码
	      </a-button>
	    </span>
		</a-table>
		<div class="pagination">
			<a-pagination
	      :total="total"
	      :page-size="10"
	      :default-current="1"
	      @change="handleChange"
	    />
	  </div>
		<a-modal v-model="visible" title="充值" :footer="null">
	    <a-form :form="checkEmailForm" @submit="checkEmail">
		    <a-form-item label="验证码">
		      <a-input
		        v-decorator="['emailCode', { rules: [{ required: true, message: '请输入验证码' }] }]"
		      />
		    </a-form-item>
		    <a-button type="primary" html-type="submit">
	        提交
	      </a-button>
	      <div class="contain-main">
					<a-spin size="large" v-if='loading2' />
				</div>
	    </a-form>
	    
	  </a-modal>
	</div>
</template>

<script>
	import { Spin,Table,Button,Modal,Form,Input,Pagination,message } from 'ant-design-vue';
	import { getUserList,checkEmail } from '../../../util/api';
	const columns = [
	  {
	  	title: '编号',
	    dataIndex: 'name111',
	    key: 'name111',
	    slots: { title: 'customTitle' },
	    scopedSlots: { customRender: 'index' },
	  },
	  {
	    title: 'steam账号',
	    dataIndex: 'accountName',
	    key: 'accountName',
	    slots: { title: 'accountName' },
	  },
	  {
	    title: 'steam密码',
	    key: 'password',
	    dataIndex: 'password',
	  },
	  {
	    title: '需充值金额',
	    key: 'rechargeDemand',
	    dataIndex: 'rechargeDemand',
	  },
	  {
	    title: '操作',
	    key: 'action',
	    scopedSlots: { customRender: 'action' },
	  },
	];
  export default {
    name: 'userList',
    data() {
      return {
        data:[],
				pagination: {},
				loading: false,
				loading2:false,
				columns,
				currentPage:0,
				pageSize:10,
				visible:false,
				total:1,
				checkEmailForm: this.$form.createForm(this, { name: 'checkEmailForm' }),
				accountId:'',
      }
    },
    components: {
    	ATable:Table,
    	AButton:Button,
    	AModal:Modal,
    	AForm:Form,
    	AInput:Input,
    	AFormItem:Form.Item,
    	APagination:Pagination,
    	ASpin:Spin,
    },
    mounted(){
    	this.getUserList();
    },
    methods: {
    	handleChange(current){
    		this.currentPage = current - 1;
				this.getUserList();
    	},
    	getUserList(e){
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.get(
    			getUserList,
    			{
    				params:{
	    				pageSize:self.pageSize,
	    				currentPage:self.currentPage
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
    	handleCheckEmail(accountId){
    		this.accountId = accountId;
    		this.visible = !this.visible;
    	},
    	checkEmail(e){
    		e.preventDefault();
    		const self = this;
	      this.checkEmailForm.validateFields((err, values) => {
	        if (!err) {
	        	values.accountId = self.accountId;
	          this.interCheckEmail(values);
	        }
	      });
    	},
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
    			self.data = res.data.data;
    			self.loading2 = false;
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
    	

    },
  }
</script>
<style scoped>
  .pagination{
  	width:100%;
  	padding-top:20px;
    display: -webkit-box;display: -moz-box;       
    display: -ms-flexbox;display: -webkit-flex;display: flex;
    -webkit-justify-content: flex-end;
    -moz-justify-content: flex-end;
    -ms-justify-content: flex-end;
    -o-justify-content: flex-end;
    justify-content: flex-end;
  }
</style>
