import api from '@/fetch/api.js'
const personal = {
	state: {
		personal: {
			userInfo: {},
			roleInfo: {}
		}
	},
	getters: {
		personal_userInfo: state => state.personal.userInfo,
		personal_roleInfo: state => state.personal.roleInfo
	},
	mutations: {
		USER_INFO(state, res) {
			state.personal.userInfo = res
		},
		ROLE_INFO(state, res) {
			state.personal.roleInfo = res
		}
	},
	actions: {
		getUserInfo({
			commit
		}) {
			return new Promise(resolve => {
				api.api('post', api.loginUrl + '/login/getAccount').then(res => {
					commit('USER_INFO', res)
					window.localStorage.setItem('userId', res.id)
					window.localStorage.setItem('userInfo', JSON.stringify(res))
					resolve()
				})
			})
		},
		getDbList({
			commit
		}){
			return new Promise(resolve=>{
				api.api('get', api.configUrl + '/hczz/common/getDbsxList').then(res => {
					resolve(res)
				})
			})
		},
		getRoleInfo({
			commit
		}) {
			return new Promise(resolve => {
				api.api('post', api.loginUrl + '/login/getRoles').then(res => {
					commit('ROLE_INFO', res)
					resolve()
				})
			})
		}
	}
}
export default personal;