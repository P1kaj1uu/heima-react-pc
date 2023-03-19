// 封装存取移除token的方法

const TOKEN_KEY: string = 'geek_pc'

const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token)
const delToken = (): void => localStorage.removeItem(TOKEN_KEY)

export {
  getToken,
  setToken,
  delToken
}
