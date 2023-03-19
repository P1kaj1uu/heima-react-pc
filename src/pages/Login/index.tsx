import React, { useEffect } from 'react';
import { Card, Form, Input, Button, Checkbox, message, notification  } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
import { useNavigate } from 'react-router-dom'

// 使用mobx管理的数据和方法
import { observer } from 'mobx-react-lite'
import useStore from '@/store';

const Login = () => {
  const navigate = useNavigate()
  // 得到store
  const { LoginStore } = useStore();
  const [loginFormRef] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  // 账号密码提示
  useEffect(() => {
    notification.open({
      message: '账号/密码提示',
      description:
        '账号：13811111111；密码：246810',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  }, [])
  // 表单校验成功，点击登录
  const onFinish = (values: any) => {
    const { username, password, remember } = values
    console.log('Success:', username, password, remember);
    // 未勾选复选框时
    if (!remember) {
      messageApi.open({
        type: 'info',
        content: '请勾选同意复选框后再登录',
      });
      return
    }
    console.log(LoginStore)
    // 调用mobx里定义的方法
    LoginStore.login({
      mobile: username,
      code: password
    }).then(res => {
      messageApi.open({
        type: 'success',
        content: '登录成功',
      });
      setTimeout(() => {
        // 跳转到首页
        navigate('/', { replace: true })
      }, 1000)
    }).catch(error => {
      messageApi.open({
        type: 'error',
        content: '账号或密码格式不正确',
      });
    })
  };

  return (
    <div className="login">
      { contextHolder }
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          name="basic"
          form={loginFormRef}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          validateTrigger={['onBlur', 'onChange']}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input placeholder="请输入账号" allowClear />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { len: 6, message: '密码长度是6个字符', validateTrigger: 'onBlur' }
            ]}
          >
            <Input.Password placeholder="请输入密码" maxLength={6} allowClear />
          </Form.Item>

          <Form.Item className='login-checkbox-label' name="remember" valuePropName="checked" wrapperCol={{ offset: 3, span: 24 }}>
            <Checkbox>我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
            <Button htmlType="button" onClick={() => { loginFormRef.resetFields() }}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

// 包裹组件让视图响应数据变化
export default observer(Login)