<template>
	<div>
		<a-table 
			:pagination="pagination"
	    :loading="loading"
			:columns="columns" :data-source="data">
			<span slot="shareOpen" slot-scope="text, record">
	      <a-switch default-checked @change="handleChangeStatus($event,record.id,!record.status)" />
	    </span>
	    <span slot="action" slot-scope="text, record">
	      <a-button type="primary" @click="interDeleteShareSwitch(record.id)">删除</a-button>
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
	import { Table,Button,Modal,Form,Input,Switch } from 'ant-design-vue';
	import { getShareAccount,checkEmail,deleteShareAccount,setShareStatus } from '../../../util/api';

			// "canHandle": true,
   //    "id": 0,
   //    "name": "string",
   //    "ownerUserId": 0,
   //    "status": true,
   //    "userId": 0
	const columns = [
	  {
	  	title: '编号',
	    dataIndex: 'name111',
	    key: 'name111',
	    slots: { title: 'customTitle' },
	    scopedSlots: { customRender: 'name' },
	  },
	  {
	    title: '共享者平台ID',
	    dataIndex: 'userId',
	    key: 'userId',
	  },
	  // {
	  //   title: '需充值金额',
	  //   dataIndex: 'rechargeDemand',
	  //   key: 'rechargeDemand',
	  // },
	  {
	    title: '共享开关',
	    key: 'shareOpen',
	    dataIndex: 'shareOpen',
	    scopedSlots: { customRender: 'shareOpen' },
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
    	ASwitch:Switch,
    },
    mounted(){
    	this.getShareAccountList();
    },
    methods: {
    	getShareAccountList(e){
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.get(
    			getShareAccount,
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
    			self.data = res.data;
    		})
    		.catch(function (error) {
          console.log(error);
        });
    	},
    	handleChangeStatus(e,id,status){
    		this.interSetShareSwitch(id,status)
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
    	},
    	interSetShareSwitch(id,status){

				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.post(
    			setShareStatus,
    			JSON.stringify({
    				id,status
    			}),
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
    		})
    		.catch(function (error) {
          console.log(error);
        });
    	},
    	interDeleteShareSwitch(id){

				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.post(
    			deleteShareAccount+'?id='+id,
    			JSON.stringify({}),
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
    		})
    		.catch(function (error) {
          console.log(error);
        });
    	},

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
