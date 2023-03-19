import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import './App.css';
// 导入antd样式
import 'antd/dist/reset.css';
// 导入封装的路由鉴权高阶组件
import AuthComponent from '@/components/AuthComponent'

function App() {
  return (
    // 路由配置
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* 创建路由path和组件之间的对应关系 */}
          <Route path='/login' element={<Login />}></Route>
          {/* 需要鉴权的路由 */}
          <Route path="/*" element={
            <AuthComponent>
              <Layout />
            </AuthComponent>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
