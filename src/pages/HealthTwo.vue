<template>
	<div>
		<x-header @on-click-back="goback"  :left-options="{preventGoBack: true}">健康数据二</x-header>
		<div class="biankuang1">
			<div class="biankuang2">
				<h4 class="mintip">最近一次测量血压值：<span>{{systolicpressure}}/{{diastolicpressure}}</span></h4>
			</div>
			<div class="flexcenter">
				<div class="flexinline">
					<div class="biankuang3">高压</div>
					<div class="backgd" @click="popupmodal('systolicpressure')">{{systolicpressure}}</div>
				</div>
				<div class="flexinline">
					<div class="backgd" @click="popupmodal('diastolicpressure')">{{diastolicpressure}}</div>
					<div class="biankuang3">低压</div>
				</div>
			</div>
		</div>
		
		<div class="biankuang1">
			<div class="biankuang2">
				<h4 class="mintip">既往血压最高值：<span>{{maxsystolicpressure}}/{{maxdiastolicpressure}}</span></h4>
			</div>
			<div class="flexcenter">
				<div class="flexinline">
					<div class="biankuang3">高压</div>
					<div class="backgd" @click="popupmodal('maxsystolicpressure')">{{maxsystolicpressure}}</div>
				</div>
				<div class="flexinline">
					<div class="backgd" @click="popupmodal('maxdiastolicpressure')">{{maxdiastolicpressure}}</div>
					<div class="biankuang3">低压</div>
				</div>
			</div>
		</div>
		
		<div class="biankuang1">
			<div class="biankuang2">
				<h4 class="mintip">最近一次测量空腹血糖值：<span>{{fastBloodSugar}}</span></h4>
			</div>
			<div class="weui-cell" style="justify-content:center;padding-bottom: 2rem;">
				<!-- <span style="font-weight: bold;">腹围</span> -->
				<x-icon type="ios-minus-outline" @click.native="subfastBloodSugar" size="30" style="padding: 0 1rem;"></x-icon>
				<span style="min-width: 25%;text-align: center;">{{fastBloodSugar}}</span><span>mmol/L</span>
				<x-icon type="ios-plus-outline" @click.native="addfastBloodSugar" size="30" style="padding: 0 1rem;"></x-icon>
				<!-- <x-button mini type="warn" @click.native="restfastBloodSugar" style="margin:0;">清空</x-button> -->
			</div>
			<cell primary="content">
				<range v-model="fastBloodSugar" decimal :min="0" :max="20" :step="0.1" ></range>
			</cell>
		</div>
		<div class="biankuang1">
			<div class="biankuang2">
				<h4 class="mintip">最近一次测量血脂值：<span>{{cholesterol}}/{{triglyceride}}/{{LDLC}}/{{HDLC}}</span></h4>
			</div>
			<button-tab>
				<button-tab-item selected @click.native="setxuezhitype('cholesterol')">总胆固醇</button-tab-item>
				<button-tab-item @click.native="setxuezhitype('triglyceride')">甘油三酯</button-tab-item>
				<button-tab-item @click.native="setxuezhitype('LDLC')">低密度</button-tab-item>
				<button-tab-item @click.native="setxuezhitype('HDLC')">高密度</button-tab-item>
			</button-tab>
			<div class="weui-cell" style="justify-content:center;padding:2rem 0;">
				<!-- <span style="font-weight: bold;">腹围</span> -->
				<x-icon type="ios-minus-outline" @click.native="subxuezhi" size="30" style="padding: 0 1rem;"></x-icon>
				<span style="min-width: 25%;text-align: center;">{{tempxuezhi}}</span><span>mmol/L</span>
				<x-icon type="ios-plus-outline" @click.native="addxuezhi" size="30" style="padding: 0 1rem;"></x-icon>
				<!-- <x-button mini type="warn" @click.native="restxuezhi" style="margin:0;">清空</x-button> -->
			</div>
			<cell primary="content">
				<range v-model="tempxuezhi" decimal :min="0" :max="10" :step="0.01" ></range>
			</cell>
		</div>
		<div v-show="popshow" class="waimodal">
			<div class="neimadal">
				<group>
					<div class="btmsolid">
						<div class="weui-cell weizhi1">
							<x-icon type="ios-minus-outline" @click.native="subpressure" size="30" style="padding: 0 1rem;"></x-icon>
							<span class="valuefont">{{temppressure}}</span><span>mmHg</span>
							<x-icon type="ios-plus-outline" @click.native="addpressure" size="30" style="padding: 0 1rem;"></x-icon>
							<!-- <x-button mini type="warn" @click.native="restpressure" style="margin:0;">清空</x-button> -->
						</div>
						<cell primary="content">
							<range v-model="temppressure" :min="0" :max="280" :step="1"></range>
						</cell>
					</div>
				</group>
				<group>
					<flexbox>
						<flexbox-item>
							<x-button type="warn" @click.native="closemodal">关闭</x-button>
						</flexbox-item>
					</flexbox>
				</group>
			</div>
		</div>
		<group title="">
			<x-button type="primary" action-type="button" @click.native="submitInfo">下一步</x-button>
		</group>
		<br>
	</div>
</template>

<script>
	import {TransferDom, XHeader, XButton, Range, Group, GroupTitle, Cell, CheckIcon , Popup, Flexbox, FlexboxItem, ButtonTab, AlertModule, ButtonTabItem} from 'vux'
	export default {
		directives: {
			TransferDom
		},
		components: {
			XHeader,
			Range,
			Group,
			GroupTitle,
			Cell,
			XButton,
			CheckIcon,
			Popup,
			Flexbox,
			FlexboxItem,
			ButtonTab,
			AlertModule,
			ButtonTabItem
		},
		mounted () {
			this.showflag=false;
			this.getinfo();
		},
		data () {
			return {
				mid:'',
				show:true,
				showflag:true,
				height: 0,
				popshow:true,
				presstype:'',
				temppressure:0,
				maxsystolicpressure: 0,
				maxdiastolicpressure:0,
				systolicpressure: 0,
				diastolicpressure:0,
				fastBloodSugar:0,//空腹血糖值
				xuezhitype:'cholesterol',
				tempxuezhi:0,
				cholesterol:0,
				triglyceride:0,
				LDLC:0,
				HDLC:0
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
				this.$router.push({path: "healthone"});
			},
			addpressure(){
				if(this.temppressure<280){
					this.temppressure+=1;
				}
			},
			subpressure(){
				if(this.temppressure>0){
					this.temppressure-=1;
				}
			},
			restpressure(){
				this.temppressure=0;
			},
			popupmodal(type){
				this.presstype=type;
				this.temppressure=this[type]
				this.popshow=true;
			},
			closemodal(){
				this.presstype='';
				this.popshow=false;
			},
			addfastBloodSugar(){
				if(this.fastBloodSugar<20){
					this.fastBloodSugar+=0.1;
				}
			},
			subfastBloodSugar(){
				if(this.fastBloodSugar>0){
					this.fastBloodSugar-=0.1;
				}
			},
			restfastBloodSugar(){
				this.fastBloodSugar=0;
			},
			setxuezhitype(type){
				this.xuezhitype=type;
				this.tempxuezhi=this[type]
			},
			addxuezhi(){
				if(this.tempxuezhi<10){
					this.tempxuezhi+=0.01;
				}
			},
			subxuezhi(){
				if(this.tempxuezhi>0){
					this.tempxuezhi-=0.01;
				}
			},
			restxuezhi(){
				this.tempxuezhi=0;
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
							this.systolicpressure=mem.health.systolicpressure||0;
							this.diastolicpressure=mem.health.diastolicpressure||0;
							this.fastBloodSugar=mem.health.fastBloodSugar||0;
							this.cholesterol=mem.health.cholesterol||0;
							this.tempxuezhi=this.cholesterol;
							this.triglyceride=mem.health.triglyceride||0;
							this.LDLC=mem.health.LDLC||0;
							this.HDLC=mem.health.HDLC||0;
							this.maxsystolicpressure=mem.agobloodpressure.systolicpressure||0;
							this.maxdiastolicpressure=mem.agobloodpressure.systolicpressure||0;
						}
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	},
		  	submitInfo() {
		  		if(!this.systolicpressure){
		  			this.errmessage='请填写最近一次测量的血压高压值';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.diastolicpressure){
		  			this.errmessage='请填写最近一次测量的血压低压值';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.maxsystolicpressure){
		  			this.errmessage='请填写既往测量血压最高高压值';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.maxdiastolicpressure){
		  			this.errmessage='请填写既往测量血压最高低压值';
		  			this.showErrMsg()
		  			return;
		  		}
		  		var params={
		  			mid:this.mid,
		  			maxsystolicpressure:this.maxsystolicpressure,
		  			maxdiastolicpressure:this.maxdiastolicpressure,
		  			systolicpressure:this.systolicpressure,
		  			diastolicpressure:this.diastolicpressure,
		  			fastBloodSugar:this.fastBloodSugar,
		  			cholesterol:this.cholesterol,
		  			triglyceride:this.triglyceride,
		  			LDLC:this.LDLC,
		  			HDLC:this.HDLC
		  		};
		  		this.$http.post('/weixin/member/healthtwo',params)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						this.$router.push({path: "usingdrug"});
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	}
		},
		watch:{
			// "showflag":"changepop"
			showflag:function(){
 
				 this.$nextTick(function(){
				  //////方法
				  	this.popshow=false;
				 });
			},
			temppressure:function(){
				this[this.presstype]=this.temppressure;
			},
			tempxuezhi:function(){
				this[this.xuezhitype]=this.tempxuezhi;
			}
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
.mintip{
	color: #666;
	font-weight: normal;
	/*margin-left: 2rem;*/
	width: 100%;
	text-align: center;
}
.biankuang1{
	padding: 1rem 1rem;
	margin-bottom: 1rem;
}
.biankuang2{
	padding: 1rem 2rem;
}
.flexcenter{
	display: flex;
	justify-content:center;
}
.flexinline{
	display: inline-flex;
}
.biankuang3{
	padding: 0.2rem 1rem;
	width: 2rem;
}
.backgd{
	padding: 0.2rem 1rem;
	height:1.5rem;border: 1px solid black;
	background-color: yellow;
	width: 4rem;
	text-align: center
}
.waimodal{
	position: fixed;
	top:0;
	bottom: 0;
	left: 0;
	right: 0; 
	/*height: 100%;
	width: 100%;*/
	z-index: 100;
	background: rgba(0, 0, 0, 0.5);
}
.neimadal{
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0; 
	width: 100%;
	background-color: #fff;
	padding: 2rem 0;
}
.btmsolid{
	border-bottom: 1px solid #D9D9D9;
	padding-bottom:2rem;
}
.weizhi1{
	justify-content:center;
	padding-bottom: 2rem;
}
.valuefont{
	min-width: 25%;
	text-align: center;
}
</style>