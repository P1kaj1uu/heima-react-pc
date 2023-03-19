// 登录模块的mobx管理
import { makeObservable, observable  } from 'mobx'
import Axios from '@/utils/http'
import { setToken, getToken, delToken } from '@/utils/token'

type LoginInfo = {
  mobile: string,
  code: string
}

class LoginStore {
  token = getToken() || ''
  constructor() {
    makeObservable(this, {
      token: observable
    })
  }
  // 登录
  login = async ({ mobile, code }: LoginInfo) => {
    const res = await Axios.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    console.log(res)
    this.token = res.data.data.token
    setToken(this.token)
  }
  // 退出登录
  quitLogin = () => {
    this.token = ''
    delToken()
  }
}

const loginStore = new LoginStore()

export default loginStore