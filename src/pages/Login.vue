<template>
	<div>
	    <x-header :left-options="{showBack: false}">手机号登录验证</x-header>
		<group title="">
			<x-input title="手机号码" name="phone" v-model="phone" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile">
				
			</x-input>
		</group>
		<group title="">
			<x-input title="验证码" placeholder="请输入验证码" name="code" v-model="code" :min="6" :max="6" class="weui-vcode">
				<x-button slot="right" type="primary" :class="{disabled: !this.canClick}" @click.native="getcode" mini>{{content}}</x-button>
			</x-input>
		</group>
		<group title="">
			<x-button type="primary" action-type="button" @click.native="checkphone">登录</x-button>
		</group>
	</div>
</template>
<script>
	import { XHeader,Actionsheet, TransferDom, ButtonTab, ButtonTabItem, XInput, Group, XButton, Cell,AlertModule, Alert, XSwitch } from 'vux'
	export default {
		data () {
			return {
				phone: '',
				code: '',
				error: null,
				canClick:true,
				totalTime:60,
				content:'发送验证码',
				errmessage:''
			}
		},
		mounted () {
			this.checklogin();
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
			checklogin () {
				var params={};
				this.$http.post('/weixin/member/islogin',params)
				.then((response) => {
					let res = response.data;
					console.log(res)
					if(res.nologin){
						this.getauthorurl()
					}else{
						var open=res.open;
						if(open==="0"){
							this.$router.push({path: "healthone"});
						}else if(open==='1'){
							window.location.href="/wechat/member/da"
						}else if(open==="2"){
							this.$router.push({path: "usingdrug"});
						}else if(open==="3"){
							this.$router.push({path: "pastmedicalhistory"});
						}else{
							if(res.phone){
								this.$router.push({path: "basicinfo"});
							}else{
								//this.$router.push({path: "login"});
							}
						}
						// window.location.href=res.url;
					}
					// this.$router.push({//你需要接受路由的参数再跳转
					//   path: res.url
					// });
				})
				.catch((reject) => {
					this.error = reject
					console.log(reject)
				})
			},
		  	getcode () {
		  		var phonereg=/^[1][3,4,5,7,8][0-9]{9}$/;
		  		if(!this.phone){
		  			this.errmessage='手机号不能为空';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!phonereg.test(this.phone)){
		  			this.errmessage='手机号码错误';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if (!this.canClick) return
		  		this.canClick = false
		  		this.content = this.totalTime + 's后重新发送'
		  		let clock = window.setInterval(() => {
		  			this.totalTime--
		  			this.content = this.totalTime + 's后重新发送'
		  			if (this.totalTime < 0) {
		  				window.clearInterval(clock)
		  				this.content = '重新发送验证码'
		  				this.totalTime = 60
   						this.canClick = true
					}
				},1000)
		  		var params={phone:this.phone};
		  		this.$http.post('/weixin/member/getsmscode',params)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	},
		  	checkphone () {
		  		var phonereg=/^[1][3,4,5,7,8][0-9]{9}$/;
		  		if(!this.phone){
		  			this.errmessage='手机号不能为空';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!phonereg.test(this.phone)){
		  			this.errmessage='手机号码错误';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.code){
		  			this.errmessage='验证码不能为空';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(this.code.length<6){
		  			this.errmessage='验证码错误！'
		  			this.showErrMsg()
		  			return;
		  		}
		  		var params={phone:this.phone,code:this.code};
		  		this.$http.post('/weixin/member/checkphone',params)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						if(res.error){
							this.errmessage=res.msg;
				  			this.showErrMsg()
				  			return;
						}else{
							if(res.open){
								var open=res.open;
								if(open==="0"){
									this.$router.push({path: "healthone"});
								}else if(open==='1'){
									window.location.href="/wechat/member/da"
								}else if(open==="2"){
									this.$router.push({path: "usingdrug"});
								}else if(open==="3"){
									this.$router.push({path: "pastmedicalhistory"});
								}
							}else{
								this.$router.push({path: "basicinfo"});
							}
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
			XSwitch
		}
	}
</script>
<style type="text/css" scoped>
.vux-header{
	background-color: #1c6f6f;
}
</style>