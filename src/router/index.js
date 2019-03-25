import Vue from 'vue'
import Router from 'vue-router'
import CheckLogin from '@/pages/CheckLogin'
import Login from '@/pages/Login'
import BasicInfo from '@/pages/BasicInfo'
import HealthOne from '@/pages/HealthOne'
import HealthTwo from '@/pages/HealthTwo'
import UsingDrug from '@/pages/UsingDrug'
import PastMedicalHistory from '@/pages/PastMedicalHistory'

Vue.use(Router)

export default new Router({
  routes: [
    {
		path: '/',
		name: 'CheckLogin',
		component: CheckLogin
    },
    {
		path: '/login',
		name: 'Login',
		component: Login
	},
    {
		path: '/basicinfo',
		name: 'BasicInfo',
		component: BasicInfo
	},
    {
		path: '/healthone',
		name: 'HealthOne',
		component: HealthOne
	},
    {
		path: '/healthtwo',
		name: 'HealthTwo',
		component: HealthTwo
	},
	{
		path: '/usingdrug',
		name: 'UsingDrug',
		component: UsingDrug
	},
	{
		path: '/pastmedicalhistory',
		name: 'PastMedicalHistory',
		component: PastMedicalHistory
	}
  ]
})