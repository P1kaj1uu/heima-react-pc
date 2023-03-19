import React, { useEffect } from 'react'
import { Layout, Menu, Popconfirm, message } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite'
import useStore from '@/store';

const { Header, Sider } = Layout

type LocationObj = {
  hash?: string,
  key?: string,
  pathname: string,
  search?: string,
  state?: null
}

const GeekLayout = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const { UserStore, LoginStore } = useStore()
  // 侧边栏反向高亮显示
  const location: LocationObj = useLocation()
  // 这里是当前浏览器上的路径地址
  const selectedKey: string = location.pathname

  useEffect(() => {
    UserStore.getUserInfo()
  }, [UserStore])

  // 退出登录
  const onLogout = () => {
    LoginStore.quitLogin()
    messageApi.open({
      type: 'success',
      content: '退出成功',
    });
    setTimeout(() => {
      navigate('/login')
    }, 1100)
  }

  return (
    <Layout>
      <Header className="header">
        { contextHolder }
        <div className="logo" />
        <div className="user-info">
          <img className='user-img' src={UserStore.userInfo.photo} alt="" />
          <span className="user-name">{UserStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onLogout}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to="/">数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/article">
              <Link to="/article">内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/publish">
              <Link to="/publish">发布文章</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        {/* 二级路由对应显示 */}
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由默认页面 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)