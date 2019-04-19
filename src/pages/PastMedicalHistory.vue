<template>
    <div>
        <x-header @on-click-back="goback" :left-options="{preventGoBack: true}">既往病史</x-header>
        <div style="padding: 1rem;">
            <flexbox>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['15'] }" @click.native="changebigdis('15')">高血压</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['11'] }" @click.native="changebigdis('11')">糖尿病</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div style="padding: 1rem;">
            <flexbox>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: subdisease['2']['E78.501'] }" @click.native="changesubdis('2','E78.501')">高脂血症</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: subdisease['9']['I25.101'] }" @click.native="changesubdis('9','I25.101')">冠心病</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div style="padding: 1rem;">
            <flexbox>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['3'] }" @click.native="changebigdis('3')">左心室肥厚</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['6'] }" @click.native="changebigdis('6')">脑血管疾病</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div style="padding: 1rem;">
            <flexbox>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['10'] }" @click.native="changebigdis('10')">肾脏疾病</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['8'] }" @click.native="changebigdis('8')">视网膜病</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div style="padding: 1rem;">
            <flexbox>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['4'] }" @click.native="changebigdis('4')">颈动脉内膜增厚或斑块</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['5'] }" @click.native="changebigdis('5')">血肌酐升高</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div style="padding: 1rem;">
            <flexbox>
                <flexbox-item>
                    <x-button action-type="button" v-bind:class="{ itemselected: bigdisease['7'] }" @click.native="changebigdis('7')">周围血管疾病</x-button>
                </flexbox-item>
                <flexbox-item>

                </flexbox-item>
            </flexbox>
        </div>
        <group title="">
            <x-button type="primary" action-type="button" @click.native="SubmitInfo">完 成</x-button>
        </group>
    </div>
</template>
<script>

    import {Flexbox, FlexboxItem, XHeader,TransferDom, Group,Checker,CheckerItem,XButton } from 'vux'

    export default {
        directives: {
            TransferDom
        },
        components: {
            XHeader,
            Group,
            Flexbox, 
            FlexboxItem,
            Checker,
            CheckerItem,
            XButton
        },
        data () {
            return {
                // disease : {
                //         "1" : "no",
                //         "2" : "no",
                //         "3" : "no",
                //         "4" : "no",
                //         "5" : "no",
                //         "6" : "no",
                //         "7" : "no",
                //         "8" : "no",
                //         "9" : "no",
                //         "10" : "no",
                //         "11" : "no",
                //         "15" : "no"
                // },
                  // bigdisease:{
                    //   '15':'高血压',
                    //   '11': '糖尿病',
                    //   '3': '左心室肥厚',
                    //   '6': '脑血管疾病',
                    //   '10': '肾脏疾病',
                    //   '8': '视网膜病',
                    //   '4': '颈动脉内膜增厚或斑块',
                    //   '5': '血肌酐升高',
                    //   '7': '周围血管疾病'
                    // },
                    // subdisease: {
                    //   'E78.501':'高脂血症',
                    //   'I25.101':'冠心病'
                    // },
                mid:'',
                bigdisease:{
                    '15':false,
                    '11':false,
                    '3':false,
                    '6':false,
                    '10':false,
                    '8':false,
                    '4':false,
                    '5':false,
                    '7':false
                },
                subdisease: {
                    "2":{
                        'E78.501':false,
                    },
                    "9":{
                        'I25.101':false
                    }
                }
            }
        },
        mounted () {
            this.getinfo();
        },
        methods:{
            goback(){
                this.$router.push({path: "usingdrug"});
            },
            changebigdis(keid){
                this.bigdisease[keid]=!this.bigdisease[keid];
            },
            changesubdis(id,key){
                this.subdisease[id][key]=!this.subdisease[id][key];
            },
            SubmitInfo:function(){
                var params={
                    mid:this.mid,
                    bigdisease:this.bigdisease,
                    subdisease:this.subdisease
                };
                this.$http.post('/weixin/member/finishdise',params)
                .then((response) => {
                    let res = response.data;
                    console.log(res)
                    if(res.nologin){
                        window.location.href='/wxview';
                    }else{
                        window.location.href="/wechat/member/analysisresult?mid="+this.mid;
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
                            this.mid=mem.mid;
                            for(var keid in this.bigdisease){
                                if(mem.disease[keid]==='yes'){
                                    this.bigdisease[keid]=true;
                                }
                            }
                            for(var key in mem['icd10']){
                                if(key=="2"){
                                    if(mem['icd10'][key].indexOf('E78.501')!=-1){
                                        this.subdisease['2']['E78.501']=true;
                                    }
                                }
                                if(key=="9"){
                                    if(mem['icd10'][key].indexOf('I25.101')!=-1){
                                        this.subdisease[key]['I25.101']=true;
                                    }
                                }
                            }
                        }
                    }
                })
                .catch((reject) => {
                    this.error = reject
                    console.log(reject)
                })
            }
        }
    }
</script>
<style type="text/css" scoped>
.vux-header{
    background-color: #1c6f6f;
}

.itemnormal {
    width: calc(48% - 2px);
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin:6px 1%
}
.itemselected {
    background:#00CED1 no-repeat right bottom;
    border-color: #ff4a00;
    font-weight:bolder
}
</style>