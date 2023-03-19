import React from 'react';
import loginStore from './login.Store';

class RootStore {
  LoginStore
  // 组合store
  constructor() {
    this.LoginStore = loginStore
  }
}

// 实例化根store注入context中
const rootStore = new RootStore()
const context = React.createContext(rootStore)

// 导出useStore方法
const useStore = () => React.useContext(context)
export default useStore