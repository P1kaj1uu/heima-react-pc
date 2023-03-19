import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Home from '@/pages/Home';
import Article from '@/pages/Article';
import Publish from '@/pages/Publish';
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
          } >
            {/* 二级路由默认页面 */}
            <Route index element={<Home />} />
            <Route path="article" element={<Article />} />
            <Route path="publish" element={<Publish />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
