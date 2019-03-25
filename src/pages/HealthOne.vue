<template>
	<div>
		<x-header @on-click-back="goback"  :left-options="{preventGoBack: true}">健康数据一</x-header>
		<group title="身高">
			<div style="border-bottom: 1px solid #D9D9D9;padding-bottom:2rem;">
				<div class="weui-cell" style="justify-content:center;padding-bottom: 2rem;">
					<!-- <span style="font-weight: bold;">身高</span> -->
					<x-icon type="ios-minus-outline" @click.native="subheight" size="30" style="padding: 0 1rem;"></x-icon>		
						<span style="min-width: 25%;text-align: center;">{{height}}</span><span>cm</span>
					<x-icon type="ios-plus-outline" @click.native="addheight" size="30" style="padding: 0 1rem;"></x-icon>
					<!-- <x-button mini type="warn" @click.native="restheight" style="margin:0;">清空</x-button> -->
				</div>
				<cell primary="content">
					<range v-model="height" decimal :min="0" :max="220" :step="1"></range>
				</cell>
			</div>
		</group>
		<group title="体重">
			<div style="border-bottom: 1px solid #D9D9D9;padding-bottom:2rem;">
				<div class="weui-cell" style="justify-content:center;padding-bottom: 2rem;">
					<!-- <span style="font-weight: bold;">体重</span> -->
					<x-icon type="ios-minus-outline" @click.native="subweight" size="30" style="padding: 0 1rem;"></x-icon>
						<span style="min-width: 25%;text-align: center;">{{weight}}</span><span>kg</span>
					<x-icon type="ios-plus-outline" @click.native="addweight" size="30" style="padding: 0 1rem;"></x-icon>
					<!-- <x-button mini type="warn" @click.native="restweight" style="margin:0;">清空</x-button> -->
				</div>
				<cell primary="content">
					<range v-model="weight" decimal :min="0" :max="200" :step="0.5"></range>
				</cell>
			</div>
		</group>
		<group title="腹围">
			<div style="border-bottom: 1px solid #D9D9D9;padding-bottom:2rem;">
				<div class="weui-cell" style="justify-content:center;padding-bottom: 2rem;">
					<!-- <span style="font-weight: bold;">腹围</span> -->
					<x-icon type="ios-minus-outline" @click.native="subwaist" size="30" style="padding: 0 1rem;"></x-icon>
					<!-- <div style="display: flex;align-content: center;min-width: 40%;text-align: center;">
						<span style="min-width: 60%;text-align: center;">{{waist}}</span><span>cm</span>
					</div> -->
					<span style="min-width: 25%;text-align: center;">{{waist}}</span><span>cm</span>
					<x-icon type="ios-plus-outline" @click.native="addwaist" size="30" style="padding: 0 1rem;"></x-icon>
					<!-- <x-button mini type="warn" @click.native="restwaist" style="margin:0;">清空</x-button> -->
				</div>
				<cell primary="content">
					<range v-model="waist" decimal :min="0" :max="180" :step="1"></range>
				</cell>
			</div>
		</group>
		<group title="吸烟">
			<div style="padding:15px;text-align: center;">
				<check-icon :value.sync="smoking"> 吸烟</check-icon>
				<check-icon :value.sync="nosmoking"> 不吸烟</check-icon>
				<!-- <check-icon :value.sync="{{smoking?false:true}}"> 不吸烟</check-icon> -->
			</div>
		</group>
		<group title="">
			<x-button type="primary" action-type="button"  @click.native="submitInfo">下一步</x-button>
		</group>
		<br>
	</div>
</template>

<script>
	import {XHeader, XButton, Range, Group, GroupTitle, Cell, AlertModule, CheckIcon } from 'vux'

	export default {
		components: {
			XHeader,
			Range,
			Group,
			GroupTitle,
			Cell,
			XButton,
			AlertModule,
			CheckIcon
		},
		mounted () {
			this.getinfo();
		},
		data () {
			return {
				mid:'',
				height: 0,
				weight:0,
				waist:0,
				smoking:false,
				nosmoking:true
			}
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
			goback(){
				this.$router.push({path: "basicinfo"});
			},
			addheight(){
				if(this.height<220){
					this.height+=1;
				}
			},
			subheight(){
				if(this.height>0){
					this.height-=1;
				}
			},
			restheight(){
				this.height=0;
			},
			addweight(){
				if(this.weight<200){
					this.weight+=0.5;
				}
			},
			subweight(){
				if(this.weight>0){
					this.weight-=0.5;
				}
			},
			restweight(){
				this.weight=0;
			},
			addwaist(){
				if(this.waist<180){
					this.waist+=1;
				}
			},
			subwaist(){
				if(this.waist>0){
					this.waist-=1;
				}
			},
			restwaist(){
				this.waist=0;
			},
			smokingfan(){
				this.nosmoking=!this.smoking
			},
			nosmokingfan(){
				this.smoking=!this.nosmoking
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
							this.mid=mem.mid;
							this.height=mem.health.height||0;
							this.weight=mem.health.weight||0;
							this.waist=mem.health.waist||0;
							this.smoking=mem.lifestyle.smoking=="yes"?true:false;
						}
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	},
		  	submitInfo() {
		  		if(!this.height){
		  			this.errmessage='请填写身高';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.weight){
		  			this.errmessage='请填写体重';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.waist){
		  			this.errmessage='请填写腹围';
		  			this.showErrMsg()
		  			return;
		  		}
		  		var params={mid:this.mid,height:this.height,weight:this.weight,waist:this.waist,smoking:this.smoking};
		  		this.$http.post('/weixin/member/healthone',params)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						this.$router.push({path: "healthtwo"});
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	}
		},
		watch:{
			smoking:"smokingfan",
			nosmoking:"nosmokingfan"
		}
	}
</script>
<style type="text/css" scoped>
.weui-cell:before{
	border-top:none;
}
.vux-x-icon {
	fill: #F70968;
}
</style>