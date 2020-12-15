<template>
	<div>
		<a-table 
			key="accountList"
			:pagination="false"
	    :loading="loading"
	    :rowKey='record=>record.accountId'
	    :scroll="{ x: 1400 }"
			:columns="columns" :data-source="data">
			<span slot="index" slot-scope="text, record,index">
				{{currentPage*pageSize+parseInt(index)+1}}
			</span>
			<span slot="recharge" slot-scope="text, record,index">
				<a-input :value='record.recharge'
					@pressEnter='handleEditAccount($event,record.accountId,"recharge")'
					@change='handleEditAccount($event,record.accountId,"recharge")'
					/>
			</span>
			<span slot="handler" slot-scope="text, record,index">
				<a-input :value='record.handler'
					@pressEnter='handleEditAccount($event,record.accountId,"handler")'
					@change='handleEditAccount($event,record.accountId,"handler")'
					/>
			</span>
			<span slot="backcode" slot-scope="text, record,index">
				<a-input :value='record.backcode'
					@pressEnter='handleEditAccount($event,record.accountId,"backcode")'
					@change='handleEditAccount($event,record.accountId,"backcode")'
					/>
			</span>
			<span slot="status" slot-scope="text, record,index">
				<a-select :default-value="!!record.status ? record.status+'' :'false'" style="width: 100px" @change="handleChangeStatus($event,record.accountId)">
		      <a-select-option value="true">
		        已完成
		      </a-select-option>
		      <a-select-option value="false">
		        未完成
		      </a-select-option>
		    </a-select>
			</span>
			
			
	    <span slot="action" class="action-contain" slot-scope="text, record">
	      <a-button type="primary" @click="handleRechargeToggle(record.accountId)">充值</a-button>
	      <a-button type="primary" @click="handleRechargeRecords($event,record.accountId)">充值记录</a-button>
	      <a-button type="primary" @click="handleShareAccount">发送权限</a-button>
	      <a-button type="primary" @click="handleConsumeRecords($event,record.accountId)">消费记录</a-button>
	      <a-button type="primary" @click="handleRefreshAccount($event,record.accountId)">刷新</a-button>
	      <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="showDeleteConfirm($event,record.accountId)">
	      	<template slot="title">
	          <p>确定要删除吗？</p>
	        </template>
	      	<a-button type="danger">删除</a-button>
	      </a-popconfirm>
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
	    <a-form :form="rechargeForm" @submit="handleRecharge">
		    <a-form-item label="礼品卡代码">
		      <a-input
		        v-decorator="['walletCode', { rules: [{ required: true, message: '请输入礼品卡代码' }] }]"
		      />
		    </a-form-item>
		    <a-button type="primary" html-type="submit">
	        提交
	      </a-button>
	      <div class="contain-main">
					<a-spin size="large" v-if='dispath' />
				</div>
	    </a-form>
	  </a-modal>
	  <a-modal v-model="visible2" title="验证码" :footer="null">
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
				<a-spin size="large" v-if='dispath' />
			</div>
	  </a-modal>
	</div>
</template>

<script>
	import { Table,Button,Modal,Form,Input,Pagination,message
		,Spin,Popconfirm,Select } from 'ant-design-vue';
	import { getRelations,recharge,
		getRechargeRecords,getConsumeRecords
		,refreshAccount,checkEmail
		,deleteAccount,editAccount
		,editAccountBackcode,editAccountRecharge
		,editAccountRechargeStatus,editAccountRechargeHandler
	} from '../../../util/api';
	const emptyColumes = (text, row, index) => {
    	return text || '暂空'
    }
	const columns = [
	  {
	  	title: '编号',
	    dataIndex: 'index',
	    key: 'index',
	    scopedSlots: { customRender: 'index' },
	  },
	  {
	    title: '备注',
	    dataIndex: 'remark',
	    key: 'remark',
	    customRender: emptyColumes,
	  },
	  {
	    title: 'steam账号',
	    dataIndex: 'name',
	    key: 'name',
	  },
	  {
	    title: 'steam密码',
	    key: 'password',
	    dataIndex: 'password',
	    scopedSlots: { customRender: 'tags' },
	  },
	  {
	    title: '备用码',
	    key: 'backcode',
	    dataIndex: 'backcode',
	    scopedSlots: { customRender: 'backcode' },
	  },
	  {
	    title: '账号地区',
	    key: 'zone',
	    dataIndex: 'zone',
	    customRender: emptyColumes,
	  },
	  {
	    title: '需充值金额',
	    key: 'recharge',
	    scopedSlots: { customRender: 'recharge' },
	  },
	  {
	    title: '已充值金额参考',
	    key: 'rechargeTotal',
	    dataIndex: 'rechargeTotal',
	    customRender: emptyColumes,
	  },
	  {
	    title: '充值前余额',
	    key: 'remainder',
	    dataIndex: 'remainder',
	    customRender: emptyColumes,
	  },
	  {
	    title: '状态',
	    key: 'status',
	    scopedSlots: { customRender: 'status' },
	  },
	  {
	    title: '操作人',
	    key: 'handler',
	    scopedSlots: { customRender: 'handler' },
	  },
	  {
	    title: '创建时间',
	    key: 'createDate',
	  },
	  {
	    title: '操作',
	    key: 'action',
	    fixed: 'right',
	    width:'200',
	    scopedSlots: { customRender: 'action' },
	  },
	];
// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     tags: ['loser'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
// ];
  export default {
    name: 'contextList',
    props:['handleAccount'],
    data() {
      return {
        data:[],
        localeData:{
					emptyText:"暂空"
				},
				pagination: {
					change:(current)=>{
						this.currentPage = page - 1;
						this.getRelations();
					},
					total:this.total,
				},
				loading: false,
				columns,
				currentPage:0,
				pageSize:10,
				total:3,
				rechargeForm: this.$form.createForm(this, { name: 'rechargeForm' }),
				checkEmailForm: this.$form.createForm(this, { name: 'checkEmailForm' }),
				visible:false,
				visible2:false,
				accountId:'',
				dispath:false,

				recharge:'',// 需充值金额
				handler:'',// 操作人
				backcode:'',// 备用吗
				status:'',// 状态
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
    	APopconfirm:Popconfirm,
    	ASelect:Select,
    	ASelectOption:Select.Option
    },
    mounted(){
    	this.getRelations();
    },
    methods: {
    	handleChangeStatus(value,id){
    		this.status = value;
    		// this.interEdit(id);
    		this.interEditAccountRechargeStatus(id);

    		console.log(`selected ${value}`);
    	},
    	onDelete(accountId) {

    		// 前端删除表格行
	      const dataSource = [...this.data];
	      this.data = dataSource.filter(item => item.accountId !== accountId);
	    },
	    showDeleteConfirm(e,accountId) {

	    	// 事件绑定，删除
	    	this.loading = true;
	    	this.interDelete(accountId)
	    },
	    interDelete(accountId){

    		// 接口请求-删除账号
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		
    		this.$http.post(
    			deleteAccount+'?id='+accountId,
    			{},
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
    				self.loading = false;	
    				self.onDelete(accountId);
    			}else{
    				message.error('删除失败，请重试', [2])
    			}
    			
    		})
    		.catch(function (error) {
          console.log(error);
          self.loading = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
          	message.error('删除失败，请重试', [2])
        	}
        });
	      
    	},
    	handleEditAccount(e,accountId,type){

    		// 事件绑定，备用编码，需充值金额，操作人编辑
    		this[type] = e.target.value;
    		if(type === 'backcode'){
    			this.interEditAccountBackcode(accountId);
    		}else if(type === 'recharge'){
    			this.interEditAccountRecharge(accountId);
    		}else if(type === 'handler'){
    			this.interEditAccountRechargeHandler(accountId);
    		}
    		// this.interEdit(accountId);

    	},
    	interEdit(accountId){

    		// 接口请求-修改账号
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		const { recharge,handler,backcode,status } = self;//record;
    		
    		this.$http.post(
    			editAccount+'?accountId='+accountId,
    			JSON.stringify({accountInfo:{
    				recharge
    				,handler
    				,backcode
    				,status
    			}}),
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
    			const code = res && res.data && res.data.code;
    			self.loading = false;
    			if(code !== '4'){
    				self.visible2 = true;	
    			}
    		})
    		.catch(function (error) {
          console.log(error);
          self.loading = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
          	// message.error('编辑失败，请重试', [2])
        	}
        });
	      
    	},
    	
    	interEditAccountBackcode(accountId){
    		
    		// 接口请求-修改账号备用码
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		const { recharge,handler,backcode,status } = self;//record;
    		
    		this.$http.post(
    			editAccountBackcode,//+'?accountId='+accountId,
    			JSON.stringify({
    				accountId
    				,backcode
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
    			const code = res && res.data && res.data.code;
    			self.loading = false;
    		})
    		.catch(function (error) {
          console.log(error);
          self.loading = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
          	// message.error('编辑失败，请重试', [2])
        	}
        });
    	},
    	interEditAccountRecharge(accountId){
    		
    		// 接口请求-修改需充值金额和操作人
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		const { recharge,handler,backcode,status } = self;//record;
    		
    		this.$http.post(
    			editAccountRecharge,//+'?accountId='+accountId,
    			JSON.stringify({
    				accountId
    				,rechargeDemand:recharge
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
    			const code = res && res.data && res.data.code;
    			self.loading = false;
    		})
    		.catch(function (error) {
          console.log(error);
          self.loading = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
          	// message.error('编辑失败，请重试', [2])
        	}
        });
    	},

    	
    	interEditAccountRechargeHandler(accountId){
    		
    		// 接口请求-修改需充值金额和操作人
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		const { recharge,handler,backcode,status } = self;//record;
    		
    		this.$http.post(
    			editAccountRechargeHandler,//+'?accountId='+accountId,
    			JSON.stringify({
    				accountId
    				,handler
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
    			const code = res && res.data && res.data.code;
    			self.loading = false;
    		})
    		.catch(function (error) {
          console.log(error);
          self.loading = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
          	// message.error('编辑失败，请重试', [2])
        	}
        });
    	},
    	
    	interEditAccountRechargeStatus(accountId){
    		
    		// 接口请求-修改状态
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		const { recharge,handler,backcode,status } = self;//record;
    		
    		this.$http.post(
    			editAccountRechargeStatus,//+'?accountId='+accountId,
    			JSON.stringify({
    				accountId
    				,rechargeStatus:status
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
    			const code = res && res.data && res.data.code;
    			self.loading = false;
    		})
    		.catch(function (error) {
          console.log(error);
          self.loading = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
          	// message.error('编辑失败，请重试', [2])
        	}
        });
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
    	handleChange(current){
    		this.currentPage = current - 1;
				this.getRelations();
    	},
    	getRelations(e){
    		const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		this.$http.get(
    			getRelations,
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
    			self.total = res.data.totalNum || 1;
    		})
    		.catch(function (error) {
          console.log(error);
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
			    	message.error('网络异常，请稍后再试', [2])
			    }
        });
    	},
    	handleRechargeToggle(accountId){
    		this.accountId = accountId;
    		this.visible = !this.visible;
    	},
    	handleRecharge(e){
    		if(this.dispath){
    			return false;
    		}
    		this.dispath = true;
    		// 事件绑定 - 充值
    		e.preventDefault();
    		const self = this;
	      this.rechargeForm.validateFields((err, values) => {
	        if (!err) {
	        	values.accountId = self.accountId;
	          this.interRecharge(values);
	        }
	      });
    	},
    	interRecharge(params){

    		// 接口请求-充值
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		
    		this.$http.post(
    			recharge,
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
    			self.dispath = false;
    			self.visible = false;
    		})
    		.catch(function (error) {
          console.log(error);
          self.dispath = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
          	message.error('充值失败，请重试', [2])
        	}
        });
	      
    	},
    	handleRefreshAccount(e,accountId){
    		if(this.dispath){
    			return false;
    		}
    		this.dispath = true;
    		this.loading = true;
    		// 事件绑定，刷新
    		e.preventDefault();
    		this.accountId = parseInt(accountId);
    		this.interRefresh(accountId)
    	},
    	interRefresh(accountId){

    		// 接口请求-刷新账号
				const self = this;
    		const token = sessionStorage.getItem('token');
    		if(!token){
    			this.$router.replace('/');
    		}
    		
    		this.$http.post(
    			refreshAccount+'?accountId='+accountId,
    			{},
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
    			const code = res && res.data && res.data.code;
    			// 0 未知错误
    			// 1 多次登录失败，禁止登陆
    			// 2 用户名或密码错误
    			// 3 需要邮箱验证码、手机验证码或图形验证码
    			// 4 功能调用失败
    			// 5 功能调用成功
    			self.dispath = false;
    			self.loading = false;
    			if(code != '5'){
    				self.visible2 = true;	
    			}
    			
    		})
    		.catch(function (error) {
          console.log(error);
          self.dispath = false;
          self.loading = false;
          if (error.response.status === 401) {
		      	self.$router.replace('/');
			    }else{
          	message.error('刷新失败，请重试', [2])
        	}
        });
	      
    	},
    	handleRechargeRecords(e,id){
    		// 事件绑定 - 充值记录
    		e.preventDefault();
    		this.$emit('toggleMenu','rechargeRecords',id);
    	},
    	handleConsumeRecords(e,id){
    		// 事件绑定 - 消费记录
    		e.preventDefault();
    		this.$emit('toggleMenu','consumeRecords',id);
    	},
    	handleShareAccount(e){
    		// 事件绑定 - 共享账号
    		e.preventDefault();
    		this.$emit('toggleMenu','share');
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
  .action-contain{
  	display: -webkit-box;display: -moz-box;       
    display: -ms-flexbox;display: -webkit-flex;display: flex;
    -webkit-box-lines: multiple;-webkit-flex-wrap: wrap;-moz-flex-wrap: wrap;
    -ms-flex-wrap: wrap;-o-flex-wrap: wrap;flex-wrap: wrap;
    width:150px;
  }
  .action-contain button{
  	width: 70px;
  	padding:0;
    margin-right: 3%;
    margin-bottom: 5px;
  }
</style>
