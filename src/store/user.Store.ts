// 用户模块的mobx管理
import { makeObservable, observable  } from 'mobx'
import Axios from '@/utils/http'

type UserObj = {
  birthday?: string,
  gender?: number,
  id?: string,
  mobile?: string,
  name?: string,
  photo?: string,
}

class UserStore {
  userInfo: UserObj = {}
  constructor() {
    makeObservable(this, {
      userInfo: observable
    })
  }
  // 获取用户信息
  getUserInfo = async () => {
    const res = await Axios.get('/user/profile')
    this.userInfo = res.data.data
    console.log(res)
  }
}

const userStore = new UserStore()

export default userStore