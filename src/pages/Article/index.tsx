// 内容管理页面
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Table, Tag, Space, Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import 'dayjs/locale/zh-cn';
import Axios from '@/utils/http'
import moment from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker

// 封面
type coverArray = {
  images: Array<String>,
  type?: number
}

// 操作
type operateObj = {
  comment_count: number,
  cover: coverArray,
  id: string,
  like_count: number,
  pubdate: string,
  read_count: number,
  status: number,
  title: string
}

// 筛选类型
type findType = {
  channel_id: string,
  date: Array<Object>
  status: number
}

// 频道列表每一项
type channelItemType = {
  id: number,
  name: string
}

const Article = () => {
  const navigate = useNavigate()
  // 频道下拉框
  const [channels, setChannels] = useState([])
  // 表格数据
  const [articleData, setArticleData] = useState([])
  // 表格总条数
  const [total, setTotal] = useState(0)

  // 获取频道下拉框数据
  useEffect(() => {
    async function getChannels() {
      const res = await Axios.get('/channels')
      console.log(res.data.data.channels)
      setChannels(res.data.data.channels)
    }
    getChannels()
  }, [])

  // 参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })
  // 获取表格数据
  useEffect(() => {
    async function getArticleList() {
      const res = await Axios.get('/mp/articles', { params })
      setArticleData(res.data.data.results)
      setTotal(res.data.data.total_count)
      console.log(res)
    }
    getArticleList()
  }, [params])

  // 编辑跳转
  const edit = (id: string): void => {
    console.log(id)
    navigate(`/publish?id=${id}`)
  }
  
  // 删除
  const del = async (id: string): Promise<void> => {
    console.log(id)
    await Axios.delete(`/mp/articles/${id}`)
    // 更新列表
    setParams({
      page: 1,
      per_page: 10
    })
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: (cover: any) => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (data: number) => {
        return <Tag color="green">审核通过</Tag>
      }
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: (data: operateObj) => {
        console.log(data)
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => edit(data.id)} shape="circle" icon={<EditOutlined />} />
            <Button
              type="primary"
              danger
              shape="circle"
              onClick={() => del(data.id)}
              icon={<DeleteOutlined />}
            />
          </Space>
        )
      }
    }
  ]

  // 筛选表单参数类型
  type paramsType = {
    status?: number,
    channel_id?: string,
    begin_pubdate?: string,
    end_pubdate?: string
  }

  // 点击筛选按钮
  const onSearch = (values: findType) => {
    const { channel_id, date, status } = values
    console.log('筛选', values)
    // 格式化表单数据
    const _params: paramsType = {}
    // 格式化status
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = moment(date[0]).format('YYYY-MM-DD')
      _params.end_pubdate = moment(date[1]).format('YYYY-MM-DD')
    }
    // 修改params参数 触发接口再次发起
    setParams({
      ...params,
      ..._params
    })
  }

  // 改变页面
  const pageChange = (page: number): void => {
    console.log(page)
    // 拿到当前页参数 修改params 引起接口更新
    setParams({
      ...params,
      page
    })
  }

  return (
    <div>
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: null }} onFinish={onSearch}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              defaultValue="请选择"
              style={{ width: 120 }}
            >
              {
                channels.map((item: channelItemType) => <Option key={item.id} value={item.name}>{item.name}</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${total} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData}
          pagination={{
            position: ['bottomCenter'],
            current: params.page,
            pageSize: params.per_page,
            total: total,
            onChange: pageChange
          }}
        />
      </Card>
    </div>
  )
}

export default Article