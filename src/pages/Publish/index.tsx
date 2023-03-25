import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  RadioChangeEvent,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import Axios from '@/utils/http'
import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const { Option } = Select

const Publish = () => {
  const [formRef] = Form.useForm()
  const navigate = useNavigate()
  // 存储频道列表
  const [chanelList, setChanelList] = useState([])
  // 存放上传图片的列表
  const [fileList, setFileList] = useState([])
  // 存储切换显示图片数量
  const [imgCount, setImgCount] = useState(1)
  // 声明一个暂存仓库
  const fileListRef = useRef([])

  const [params] = useSearchParams()
  const articleId: string | null = params.get('id')

  useEffect(() => {
    async function getChannels() {
      const res = await Axios.get('/channels')
      console.log(res.data.data.channels)
      setChanelList(res.data.data.channels)
    }
    getChannels()
  }, [])

  // 编辑-回显数据
  useEffect(() => {
    async function getOutData () {
      const res = await Axios.get(`/mp/articles/${articleId}`)
      const { cover, ...formValue } = res.data.data
      console.log(cover, formValue)
      // 动态设置表单数据
      formRef.setFieldsValue({ ...formValue, type: cover.type })
      // 格式化封面图片数据
      const imageList = cover.images.map((url: ImagesListType) => ({ url }))
      setFileList(imageList)
      setImgCount(cover.type)
      fileListRef.current = imageList
    }
    if (articleId) {
      // 获取回显数据
      getOutData()
    } else {
      // 切换发布，清空数据
      formRef.resetFields()
      setFileList([])
      fileListRef.current = []
    }
  }, [articleId, formRef])

  type ChanelType = {
    id: number,
    name: string,
  }

  // 上传图片成功的回调
  const onUploadChange = (res: any) => {
    console.log(res)
    const fileList = res.fileList.map((file: any) => {
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      return file
    })
    setFileList(fileList)
    // 上传图片时，将所有图片存储到ref中
    fileListRef.current = fileList
  }

  // 切换图片显示数量
  const changeType = (e: RadioChangeEvent) => {
    console.log(e.target.value)
    let count: number = e.target.value
    setImgCount(count)
    if (count === 1) {
      // 单图，只展示第一张
      const firstImg = fileListRef.current[0]
      setFileList(!firstImg ? [] : [firstImg])
    } else if (count === 3) {
      // 三图，展示所有图片
      setFileList(fileListRef.current)
    }
  }

  type ImagesListType = {
    url: string,
    uid: string,
  }

  // 发布
  const pushData = async (data: any) => {
    await Axios.post('/mp/articles?draft=false', data).then(res => {
      message.success('发布文章成功')
      navigate('/article')
      console.log(res)
    }).catch(error => {
      message.error('发布文章失败，请重试')
      console.log(error)
    })
  }

  // 编辑
  const editData = async (data: any) => {
    await Axios.put(`/mp/articles/${articleId}?draft=false`, data).then(res => {
      message.success('编辑文章成功')
      navigate('/article')
      console.log(res)
    }).catch(error => {
      message.error('编辑文章失败，请重试')
      console.log(error)
    })
  }

  // 发布文章/编辑文章
  const onFinish = (values: any) => {
    values = {
      ...values,
      cover: {
        type: imgCount,
        images: fileList.map((item: ImagesListType) => item.url)
      }
    }
    console.log(values)
    if (articleId) {
      // 编辑
      editData(values)
    } else {
      // 发布
      pushData(values)
    }
  }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {articleId ? '编辑文章' : '发布文章'}
            </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          // 注意：此处需要为富文本编辑表示的 content 文章内容设置默认值
          initialValues={{ type: 1, content: '' }}
          onFinish={onFinish}
          form={formRef}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} allowClear />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {
                chanelList.map((item: ChanelType) => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))
              }
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {
              imgCount > 0 ? (
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList
                  action="http://geek.itheima.net/v1_0/upload"
                  fileList={fileList}
                  multiple={imgCount > 1}
                  maxCount={imgCount}
                  onChange={onUploadChange}
                >
                  <div style={{ marginTop: 8 }}>
                    <PlusOutlined />
                  </div>
                </Upload>
              )
                :
                null
            }
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? '更新文章' : '发布文章'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish