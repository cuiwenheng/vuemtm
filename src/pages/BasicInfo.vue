<template>
	<div>
		<x-header :left-options="{showBack: false}">个人信息</x-header>
		<group title="">
			<x-input title="姓名" name="name" v-model="name" placeholder="请输入姓名" is-type=""></x-input>
		</group>
		<!-- <group title="性别">
			<radio :options="radio1" v-model="gender"></radio>
		</group> -->
		<group title="">
			<selector v-model="gender" title="性别" :options="radio1"></selector>
		</group>
		<group title="">
			<datetime
			v-model="birthday"
			title="出生日期" format="YYYY-MM-DD"></datetime>
		</group>
		<group title="">
			<x-button type="primary" action-type="button" @click.native="submitInfo">提交</x-button>
		</group>
	</div>
</template>
<script>
	import { XHeader,Actionsheet, TransferDom, ButtonTab, ButtonTabItem, XInput, Group, XButton, Cell,AlertModule, Alert, XSwitch, Selector, Datetime, Radio } from 'vux'
	export default {
		data () {
			return {
				name: '',
				birthday: '',
				gender:'男',
				radio1:['男','女'],
				error: null,
				canClick:true,
				totalTime:60,
				content:'发送验证码',
				errmessage:''
			}
		},
		mounted () {
			this.getinfo();
		},
		methods: {
			showErrMsg () {
				var errmsg=this.errmessage;
				console.log('eerror')
				AlertModule.show({
					title: '错误',
					content: errmsg
				})
			},
		  	submitInfo() {
		  		var datereg=/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
		  		if(!this.name){
		  			this.errmessage='姓名不能为空';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.birthday){
		  			this.errmessage='出生日期不能为空';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!datereg.test(this.birthday)){
		  			this.errmessage='出生日期格式错误！'
		  			this.showErrMsg()
		  			return;
		  		}
		  		var params={name:this.name,birthday:this.birthday,gender:this.gender};
		  		this.$http.post('/weixin/member/basicinfo',params)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						this.$router.push({path: "healthone"});
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	},
		  	getinfo () {
		  		var params={};
		  		this.$http.get('/weixin/member/info',params)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						if(res.mem){
							var mem=res.mem;
							this.name=mem.name;
							this.birthday=mem.birthday;
							this.gender=mem.gender;
						}
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	}
		},
		directives: {
			TransferDom
		},
		components: {
			XHeader,
		    Actionsheet,
		    ButtonTab,
		    ButtonTabItem,
			XInput,
			XButton,
			Group,
			Cell,
			AlertModule,
			Alert,
			XSwitch,
			Selector,
			Datetime,
			Radio
		}
	}
</script>
<style type="text/css" scoped>
.vux-header{
	background-color: #1c6f6f;
}
</style>