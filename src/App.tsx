import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// 实现路由懒加载
import { lazy, Suspense } from 'react'
import './App.css';
// 导入antd样式
import 'antd/dist/reset.css';
// 导入封装的路由鉴权高阶组件
import AuthComponent from '@/components/AuthComponent'
// 按需导入路由组件
const Login = lazy(() => import('@/pages/Login'))
const Layout = lazy(() => import('@/pages/Layout'))
const Home = lazy(() => import('@/pages/Home'))
const Article = lazy(() => import('@/pages/Article'))
const Publish = lazy(() => import('@/pages/Publish'))

function App() {
  return (
    // 路由配置
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="loadEffect">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        }
      >
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
