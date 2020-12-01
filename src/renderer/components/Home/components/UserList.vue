<template>
	<div>
		<a-table 
			:pagination="pagination"
	    :loading="loading"
			:columns="columns" :data-source="data">
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
	    </a-form>
	  </a-modal>
	</div>
</template>

<script>
	import { Table,Button,Modal,Form,Input, } from 'ant-design-vue';
	import { getUserList,checkEmail } from '../../../util/api';
	const columns = [
	  {
	  	title: '编号',
	    dataIndex: 'name111',
	    key: 'name111',
	    slots: { title: 'customTitle' },
	    scopedSlots: { customRender: 'name' },
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
				columns,
				currentPage:0,
				pageSize:10,
				visible:false,
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
    },
    mounted(){
    	this.getUserList();
    },
    methods: {
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
    		})
    		.catch(function (error) {
          console.log(error);
        });
    	}

    },
  }
</script>
<style scoped>
    .left-menu{
        width:300px;height:100%;
        display:flex;
        -webkit-box-orient: vertical;
        -webkit-flex-direction: column;-moz-flex-direction: column;
        -ms-flex-direction: column;-o-flex-direction: column;flex-direction: column;
        padding-top:46px;
    }
    header {
        padding-left: 40px;
        font-size: 28px;
        font-family: Helvetica-Bold, Helvetica;
        font-weight: bold;
        color: #183B56;
    }
    .header-img {
        width:46px;height:46px;
        margin-right:20px;
    }
    .left-menu-title {
        padding:34px 0 37px 40px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6C6C6C;
    }
    ul{
        flex:1;
    }
    li {
        display:flex;
        align-items:center;
        width: 100%;
        height: 54px;
        background: #fff;
        padding-left:42px;
        cursor:pointer;
        border-left: 3px solid #fff;
    }
    .menu-img {
        width:20px;height:20px;margin-right:20px;
    }

    .sel {
        background: #F4F3FA;
        border-left: 3px solid #364FF0;
    }
    footer {
        padding-left:40px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0D0E10;
        line-height: 22px;
    }
</style>
