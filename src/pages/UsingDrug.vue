<template>
	<div>
		<x-header @on-click-back="goback"  :left-options="{preventGoBack: true}">服用药品</x-header>
		<label style="font-weight: bold;font-size: 1.3rem;">正在服用药品：</label>
		<x-button mini @click.native="showdrug = true">录入</x-button>
		<div v-transfer-dom>
			<popup v-model="showdrug" height="100%">
				<div class="popup1">
					<div>
						<div style="height: 3rem;">
							<search @result-click="resultClick" @on-change="getResult" :results="medicines" v-model="value" ref="search"></search>
						</div>
						<group>
							<cell title="药品名称">{{ drugname }}</cell>
						</group>
						<checklist ref="dgtypeObject" title="药品类型" :options="drugtypeobjs" label-position="left" v-model="drugtype" @on-change="change"></checklist>
						<checklist  ref="useallways" title="是否一直使用" label-position="left" :options="longterm_useobj" v-model="checkedlonguse" @on-change="longusechange"></checklist>
						<group title="">
							<datetime
							v-model="start"
							title="起始日期" format="YYYY-MM-DD"></datetime>
						</group>
						<group title="">
							<datetime
							v-model="end"
							title="结束日期" v-if="longterm_use!='yes'" format="YYYY-MM-DD"></datetime>
						</group>
						<!-- <div>{{fullValues}}</div>
						<div style="padding:15px;">
							<x-button type="primary" @click.native="fullValues = $refs.dgtypeObject.getFullValue()">getFullValue()</x-button>
						</div> -->
						<div style="text-align: center;">
							<div style="width: 48%;display: inline-block;box-sizing:border-box;">
								<x-button style="box-sizing:border-box;" @click.native="adddrug" type="primary">确定</x-button>
							</div>
							<div  style="width: 48%;display: inline-block;">
								<x-button style="box-sizing:border-box;" @click.native="cancledrug" type="warn">取消</x-button>
							</div>
						</div>
					</div>
				</div>
			</popup>
		</div>
		<div ref='divwd' style="width: 100%;display: block;padding:2rem 0rem;">
			<div v-for="(item,index) in usedrugs" style="text-align:center;width: 50%;box-sizing: border-box;padding:0.2rem;float:left;">
				<div ref='imgdiv' style="position: relative;width: 100%;border: 1px solid grey" v-bind:style="{ height: imgheight + 'px' }">
					<x-img style="width: 100%;"  default-src="/resources/images/new/haha.jpg" :src="'/resources/images/drug/'+item.imageURL"  @on-success="imgsuccess" @on-error="imgerror" class="ximg-demo" error-class="ximg-error"></x-img>
					<div style="position: absolute;right: 1rem;bottom: 0rem;">
						<x-button type="warn" @click.native="deldrug(index)" mini>删除</x-button>
					</div>
				</div>
				<p style="font-weight: bold;">药品名称：
					<span v-if='!item.name' style="font-weight: normal;">{{item.commonname}}</span> <span v-else style="font-weight: normal;">{{item.commonname}}({{item.name}})</span>
				</p>
				<p v-if="item.longterm_use!='yes'" style="font-weight: bold;">日期:
					<span style="font-weight: normal;">{{item.start}}</span>至
					<span style="font-weight: normal;">{{item.end}}</span>
				</p>
				<p v-else style="font-weight: bold;">日期:
					<span style="font-weight: normal;">{{item.start}}</span>至今
				</p>
			</div>
		</div>
		<div style="padding:15px;">
			<x-button type="primary" @click.native="finished">完成</x-button>
		</div>
	</div>
</template>
<script>
	import {Datetime,Checklist, Search,TransferDom,Popup,XSwitch,XHeader, XButton, Range, Group, GroupTitle, Cell, AlertModule, CheckIcon, XImg } from 'vux'
	// function getResult (val) {
	// 	let rs = []
	// 	for (let i = 0; i < 20; i++) {
	// 		rs.push({
	// 			title: `${val} result: ${i + 1} `,
	// 			other: i
	// 		})
	// 	}
	// 	return rs
	// }
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
			AlertModule,
			CheckIcon,
			Popup,
			XSwitch,
			XImg,
			Search,
			Checklist,
			Datetime
		},
		mounted () {
			this.getdruginfo();
			this.getimgdiv();
		},
		data () {
			return {
				mid:'',
				imgheight:0,
				// fullValues:[],
				medicines: [],
				usedrugs:[],
				longterm_useobj:[{key:'yes',value:'是'}],
				checkedlonguse:[],
				longterm_use:'',
				drugname:'',
				thedrug:{},
				drugtypeobjs:[],
				drugtype:[],
				start:'',
				end:'',
      			value: '',
				showdrug:false
			}
		},
		methods: {
			getimgdiv(){
				// if(this.$refs.imgdiv[0]){
				// 	var width=this.$refs.imgdiv[0].clientWidth;
				// 	this.imgheight=width;
				// }
				this.imgheight=this.$refs.divwd.clientWidth*0.5;
			},
			resultClick (item) {
				// window.alert('you click the result item: ' + JSON.stringify(item))
				this.drugname=item.title;
				this.thedrug=item;
				this.automatchdrugtype(item.drug_code);
			},
			getResult (val) {
				var params={keyword:val};
				var theurl='/weixin/member/searchmedicines?keyword='+val;
				var that=this;
				// this.$http.get('/weixin/member/searchmedicines',params)
				this.$http.get(theurl)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						var lists=res.data.lists;
						var medicines=[]
						var obj={};
						for(var i=0;i<lists.length;i++){
							var title=lists[i].name?(lists[i].common_name+'('+lists[i].name+')'):lists[i].common_name
							if(obj[title]){
								lists.splice(i,1);
							}else{
								lists[i].title=title;
								// obj[title]=lists[i];
								// medicines.push(title);
							}
						}
						that.medicines=lists;
					}
		  		})
		  		.catch((reject) => {
		  			that.error = reject
		  			console.log(reject)
		  		})
			},
			automatchdrugtype(drugcode){
				if (drugcode){
					var atc=drugcode.split("-")[1];
					var drugstype={
						"stepdown"				:{name:"降压药",			reg:/^((C08CA)|(C09A)|(C09C)|(C03)|(C07A)|(C02CA)).*/},
						"Fat"					:{name:"降脂药",			reg:/^(C10).*/},
						"Hypoglycemic"			:{name:"降糖药",			reg:/^(A10B).*/},
						"antiplatelet"			:{name:"抗血小板",			reg:/^(B01AC).*/},
						"calcium"				:{name:"补钙",				reg:/^((A12AA)|(A11CC)).*/},
						"urineProteinReduction"	:{name:"减少尿蛋白",		reg:/^((C09A)|(C09C)).*/},
						"anticoagulation"		:{name:"抗凝",				reg:""},
						"antianemia"			:{name:"抗贫血",			reg:/^(B03).*/},
						"angina"				:{name:"抗心绞痛",			reg:/(^((C01DA).*)|((C08D)|(C07A)).*)/},
						"antiHeartFailure"		:{name:"抗心衰",			reg:/^((C09A)|(C09C)|(C03)|(C07A)).*/},
						"vasorelant"			:{name:"扩血管改善循环",	reg:/^((A01XA).*)|((B01AC23)|(C04AF01).*)/},
						"myocardialNutrition"	:{name:"心肌营养代谢",		reg:/^(C07EB07)|(A12CXXX)|(C01EB15).*/},
						"insulin"				:{name:"胰岛素",			reg:/^(A10A).*/},
						"nutritionalSupplements":{name:"营养补充剂",		reg:/^((A11)|(A16AA))/},
			            "antigout"              :{name:"抗痛风药",		    reg:/^(M04)/},
			            "alkalizationAgent"     :{name:"碱化尿液剂",		reg:/(A02AHXX)/},
			            "analgesic"             :{name:"镇痛剂",		    reg:/^((M02)|(M01)|(N02))/},
						"other"					:{name:"未分类",			reg:""}
					};

					var number=0,drugtype=[];
					for(var key in drugstype){
						var dt=drugstype[key];
						if (dt.reg && dt.reg.test(atc)){
							number++;
			                drugtype.push(key);			
						}
					} 
					//抗凝，以“B01”开头且不包含“B01AC”,例如:蚓激酶肠溶胶囊(百奥)
					var knreg=/^(B01).*/;
					if(knreg.test(atc) && atc.indexOf("B01AC")==-1){
			            drugtype.push("anticoagulation");
						number++;
					};
					if(number==0){
			            drugtype.push("other");
					}
					var drugtypeobjs=[]
					for(var j=0;j<drugtype.length;j++){
						drugtypeobjs.push({key:drugtype[j],value:drugstype[drugtype[j]].name})
					}
					this.drugtype=drugtype;
					this.drugtypeobjs=drugtypeobjs;
				}
			},
			longusechange(){
				this.longterm_use = this.checkedlonguse.length>0?'yes':'no';
			},
			cleardrug(){
				this.value='';
				this.drugname='';
				this.thedrug={};
				this.drugtype=[];
				this.start='';
				this.end='';
				this.checkedlonguse=[];
				this.longterm_use='';
				this.medicines=[];
				this.drugtypeobjs=[];
			},
			adddrug(){
				if(!this.thedrug.drug_code){
		  			this.errmessage='请填写药品';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(this.drugtype.length==0){
		  			this.errmessage='请确定药品类型';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.start){
		  			this.errmessage='请填写起始日期';
		  			this.showErrMsg()
		  			return;
		  		}
		  		if(!this.end&&this.longterm_use=='no'){
		  			this.errmessage='不是一直使用的药品，请填写结束日期';
		  			this.showErrMsg()
		  			return;
		  		}
				var drug={
					mid:this.mid,
					drugstype:this.drugtype,
					drug_code:this.thedrug.drug_code,
					commonname:this.thedrug.common_name,
					name:this.thedrug.name,
					longterm_use:this.longterm_use,
					start:this.start,
					end:this.end
				}
				this.$http.post('/weixin/member/savedrug',drug)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						// this.$router.push({path: "healthtwo"});
						this.showdrug=false;
						this.cleardrug();
						this.getdruginfo();
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
			},
			cancledrug(){
				this.showdrug=false;
				this.cleardrug();
			},
			deldrug(index){
				var drug={
					mid:this.usedrugs[index].mid,
					did:this.usedrugs[index].did
				}
				this.$http.post('/weixin/member/deldrug',drug)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						// this.$router.push({path: "healthtwo"});
						this.getdruginfo();
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
			},
			showErrMsg (title,msg) {
				var errmsg=msg||this.errmessage;
				var title=title||'错误'
				console.log('eerror')
				AlertModule.show({
					title: title,
					content: errmsg
				})
			},
			goback(){
				this.$router.push({path: "healthtwo"});
			},
			imgsuccess (src, ele) {
				console.log('success load', src)
				
			},
			imgerror (src, ele, msg) {
				console.log('error load', msg, src)

			},
			getdruginfo () {
		  		var params={};
		  		this.$http.get('/weixin/member/druginfo',params)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						if(res.mem){
							var mem=res.mem;
							this.mid=mem.mid;
						}
						if(res.drugs.length>0){
							this.usedrugs=res.drugs;
						}
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	},
		  	finished(){
		  		// this.showErrMsg('完成','采集完成')
		  		this.submitInfo();
		  	},
		  	submitInfo() {
		  		var params={};
		  		this.$http.post('/weixin/member/finishdrug',params)
		  		.then((response) => {
		  			let res = response.data;
		  			console.log(res)
		  			if(res.nologin){
						window.location.href='/wxview';
					}else{
						this.$router.push({path: "pastmedicalhistory"});
					}
		  		})
		  		.catch((reject) => {
		  			this.error = reject
		  			console.log(reject)
		  		})
		  	},
		  	change(){}
		},
		watch:{
			longterm_use:function(){
				if(this.longterm_use==="yes"){
					this.end="";
				}
			},
			drugtype:function(){

			},
			checkeddrugtype:function(){

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
.ximg-demo {
  width: 100%;
  height: auto;
}
.ximg-error {
  /*background-color: yellow;*/
}
.ximg-error:after {
  content: '加载失败';
  color: red;
}
.popup1 {
  width:100%;
  /*height:100%;*/
  height: 100px;
}
</style>