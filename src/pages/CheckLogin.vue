<template>
	<div></div>
</template>
<script>
	export default {
		data () {
			return {
				loading: null,
				post: null,
				error: null
			}
		},
		created () {
	      // 组件创建完后获取数据，
	      // 此时 data 已经被 observed 了
	      this.checklogin()
	    },
	    methods: {
			checklogin () {
				var params={};
				this.$http.get('/weixin/member/islogin',params)
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
								this.$router.push({path: "login"});
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
			getauthorurl () {
				var params={};
				this.$http.get('/wechat/member/authorizeurl',params)
				.then((response) => {
					let res = response.data;
					console.log(res)
					alert(res.msg)
					window.location.href=res.authorizeurl;
				})
				.catch((reject) => {
					this.error = reject
					console.log(reject)
				})
			}
    	}
	}
 </script>