<template>
	<div>
		<a-table 
			:pagination="false"
	    :loading="loading"
			:columns="columns" :data-source="data">
			<span slot="index" slot-scope="text, record,index">
				{{currentPage*pageSize+parseInt(index)+1}}
			</span>
			<span slot="shareOpen" slot-scope="text, record">
	      <a-switch :default-checked="record.status" @change="handleChangeStatus($event,record.id,!record.status)" />
	    </span>
	    <span slot="action" slot-scope="text, record">
	      <a-button type="primary" @click="interDeleteShareSwitch(record.id)">删除</a-button>
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
	    </a-form>
	    <div class="contain-main">
				<a-spin size="large" v-if='loading2' />
			</div>
	  </a-modal>
	</div>
</template>

<script>
	import { Spin,Table,Button,Modal,Form,Input,Switch,Pagination,message } from 'ant-design-vue';
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
	    scopedSlots: { customRender: 'index' },
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
				loading2: false,
				columns,
				currentPage:1,
				pageSize:10,
				visible:false,
				checkEmailForm: this.$form.createForm(this, { name: 'checkEmailForm' }),
				accountId:'',
				total:1,
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
    	APagination:Pagination,
    	ASpin:Spin,
    },
    mounted(){
    	this.getShareAccountList();
    },
    methods: {
    	handleChange(current){
    		this.currentPage = current;
				this.getShareAccountList();
    	},
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
    			self.total = res.data.totalNum || 1;
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
				if(self.loading2){
					return;
				}
				self.loading2 = true;
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
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
			    	message.error('网络异常，请稍后再试', [2])
			    }
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
    			if(res.data){
    				message.info('删除成功', [2])
    				self.getShareAccountList()
    			}else{
    				message.error('网络异常，请稍后再试', [2])
    			}
    		})
    		.catch(function (error) {
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
