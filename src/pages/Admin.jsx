/**
 * Dealzy 销售后台管理系统
 * 功能：房源管理、成交管理、销售统计
 */

import { useState, useEffect } from 'react'
import { 
  Layout, Menu, Card, Row, Col, Table, Tag, Space, Button, 
  Statistic, Progress, Avatar, Typography, Divider, Select,
  Modal, Form, Input, InputNumber, message as antdMessage,
  Badge, Tooltip, Upload, TextArea
} from 'antd'
import {
  DashboardOutlined,
  HomeOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  UserOutlined,
  WhatsAppOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  UploadOutlined,
  CameraOutlined,
  SaveOutlined
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

// API 基础 URL
const API_BASE = 'http://localhost:3001/api'

/**
 * 销售后台主组件
 */
const Admin = () => {
  const [current, setCurrent] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [properties, setProperties] = useState([])
  const [deals, setDeals] = useState([])
  const [salesTeam, setSalesTeam] = useState([])
  const [loading, setLoading] = useState(false)

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 加载统计
      const statsRes = await fetch(`${API_BASE}/admin/stats`)
      const statsData = await statsRes.json()
      setStats(statsData.data)

      // 加载房源
      const propsRes = await fetch(`${API_BASE}/properties`)
      const propsData = await propsRes.json()
      setProperties(propsData.data)

      // 加载成交
      const dealsRes = await fetch(`${API_BASE}/admin/deals`)
      const dealsData = await dealsRes.json()
      setDeals(dealsData.data)

      // 加载销售团队
      const salesRes = await fetch(`${API_BASE}/sales-team`)
      const salesData = await salesRes.json()
      setSalesTeam(salesData.data)

      antdMessage.success('数据加载成功')
    } catch (error) {
      antdMessage.error('数据加载失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 渲染不同页面
  const renderPage = () => {
    switch (current) {
      case 'dashboard':
        return <Dashboard stats={stats} properties={properties} deals={deals} salesTeam={salesTeam} />
      case 'properties':
        return <PropertyManagement properties={properties} onUpdate={loadData} />
      case 'ai-generator':
        return <AIGenerator onSave={loadData} />
      case 'deals':
        return <DealManagement deals={deals} onUpdate={loadData} />
      case 'sales':
        return <SalesTeam salesTeam={salesTeam} properties={properties} />
      default:
        return <Dashboard stats={stats} />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#001529'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}> Dealzy 后台</Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
            { key: 'properties', icon: <HomeOutlined />, label: '房源管理' },
            { key: 'ai-generator', icon: <ThunderboltOutlined />, label: 'AI 房源生成' },
            { key: 'deals', icon: <CheckCircleOutlined />, label: '成交管理' },
            { key: 'sales', icon: <TeamOutlined />, label: '销售团队' },
          ]}
          onClick={({ key }) => setCurrent(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Title level={4} style={{ margin: 0 }}>
            {current === 'dashboard' && '仪表盘'}
            {current === 'properties' && '房源管理'}
            {current === 'ai-generator' && 'AI 房源生成'}
            {current === 'deals' && '成交管理'}
            {current === 'sales' && '销售团队'}
          </Title>
          <Button type="primary" onClick={loadData} loading={loading}>
            刷新数据
          </Button>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          {renderPage()}
        </Content>
      </Layout>
    </Layout>
  )
}

/**
 * 仪表盘组件
 */
const Dashboard = ({ stats, properties, deals, salesTeam }) => {
  if (!stats) {
    return <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
  }

  return (
    <div>
      {/* 核心指标 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总房源"
              value={stats.totalProperties}
              suffix="套"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总成交"
              value={stats.totalDeals}
              suffix="单"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售顾问"
              value={stats.totalSales}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成交率"
              value={stats.totalProperties > 0 ? ((stats.totalDeals / stats.totalProperties) * 100).toFixed(1) : 0}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 区域分布 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="📍 房源区域分布">
            {Object.entries(stats.propertiesByArea).map(([area, count]) => (
              <div key={area} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>{area}</Text>
                  <Text strong>{count} 套</Text>
                </div>
                <Progress 
                  percent={(count / stats.totalProperties) * 100} 
                  size="small"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            ))}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="🏆 销售排行榜">
            {stats.topSales.map((sales, index) => (
              <div key={sales.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 0',
                borderBottom: index < stats.topSales.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <Badge count={index + 1} style={{ backgroundColor: index === 0 ? '#f5222d' : index === 1 ? '#faad14' : '#722ed1' }} />
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ marginLeft: 12, backgroundColor: '#1890ff' }}
                />
                <div style={{ marginLeft: 12, flex: 1 }}>
                  <Text strong>{sales.name}</Text>
                  <div style={{ fontSize: 12, color: '#999' }}>负责 {sales.propertyCount} 套房源</div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 房源类型 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="📊 房源类型">
            {Object.entries(stats.propertiesByType).map(([type, count]) => (
              <div key={type} style={{ marginBottom: 12 }}>
                <Text>{type === 'rent' ? '出租' : '出售'}: </Text>
                <Text strong>{count} 套</Text>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="💰 成交状态">
            {Object.entries(stats.dealsByStatus).map(([status, count]) => (
              <div key={status} style={{ marginBottom: 12 }}>
                <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
                  {status === 'completed' ? '已完成' : status === 'pending' ? '进行中' : '已取消'}
                </Tag>
                <Text strong>{count} 单</Text>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📈 快速操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block icon={<HomeOutlined />}>添加新房源</Button>
              <Button block icon={<CheckCircleOutlined />}>记录成交</Button>
              <Button block icon={<WhatsAppOutlined />}>发送通知</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

/**
 * 房源管理组件
 */
const PropertyManagement = ({ properties, onUpdate }) => {
  const [filterStatus, setFilterStatus] = useState('all')

  const columns = [
    {
      title: '房源',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary">{record.area} • {record.bedrooms === 0 ? 'Studio' : `${record.bedrooms}BHK`}</Text>
        </div>
      )
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `AED ${price?.toLocaleString()}`
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'rent' ? 'blue' : 'green'}>
          {type === 'rent' ? '出租' : '出售'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'available': { color: 'green', text: '可租/售' },
          'rented': { color: 'orange', text: '已租' },
          'sold': { color: 'red', text: '已售' }
        }
        const s = statusMap[status] || { color: 'default', text: '未知' }
        return <Tag color={s.color}>{s.text}</Tag>
      }
    },
    {
      title: '销售顾问',
      dataIndex: 'agentName',
      key: 'agentName',
      render: (name, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{name || '未分配'}</Text>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleMarkDeal(record)}
          >
            标记成交
          </Button>
        </Space>
      )
    }
  ]

  const handleEdit = (record) => {
    antdMessage.info(`编辑房源：${record.title}`)
  }

  const handleMarkDeal = (record) => {
    Modal.confirm({
      title: '标记成交',
      content: (
        <Form layout="vertical">
          <Form.Item label="客户姓名" name="customerName" rules={[{ required: true }]}>
            <Input placeholder="输入客户姓名" />
          </Form.Item>
          <Form.Item label="客户电话" name="customerPhone" rules={[{ required: true }]}>
            <Input placeholder="输入客户电话" />
          </Form.Item>
          <Form.Item label="成交金额" name="dealAmount" rules={[{ required: true }]}>
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="输入成交金额"
              prefix="AED "
            />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        // TODO: 调用 API 更新状态
        antdMessage.success('成交已记录')
        onUpdate()
      }
    })
  }

  let filteredProperties = properties
  if (filterStatus !== 'all') {
    filteredProperties = properties.filter(p => p.status === filterStatus)
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Text>状态筛选：</Text>
          <Select 
            value={filterStatus} 
            onChange={setFilterStatus}
            style={{ width: 150 }}
          >
            <Option value="all">全部</Option>
            <Option value="available">可租/售</Option>
            <Option value="rented">已租</Option>
            <Option value="sold">已售</Option>
          </Select>
        </Space>
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredProperties} 
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />
    </div>
  )
}

/**
 * 成交管理组件
 */
const DealManagement = ({ deals, onUpdate }) => {
  const columns = [
    {
      title: '房源',
      dataIndex: 'propertyTitle',
      key: 'propertyTitle'
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary">{record.customerPhone}</Text>
        </div>
      )
    },
    {
      title: '销售',
      dataIndex: 'agentName',
      key: 'agentName'
    },
    {
      title: '金额',
      dataIndex: 'dealAmount',
      key: 'dealAmount',
      render: (amount) => `AED ${amount?.toLocaleString()}`
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'rent' ? 'blue' : 'green'}>
          {type === 'rent' ? '租赁' : '买卖'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'pending': { color: 'orange', text: '进行中' },
          'completed': { color: 'green', text: '已完成' },
          'cancelled': { color: 'red', text: '已取消' }
        }
        const s = statusMap[status] || { color: 'default', text: status }
        return <Tag color={s.color}>{s.text}</Tag>
      }
    },
    {
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('zh-CN')
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<WhatsAppOutlined />}
            onClick={() => handleNotify(record)}
          >
            通知
          </Button>
          <Button 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      )
    }
  ]

  const handleNotify = (record) => {
    antdMessage.success(`已发送通知给 ${record.customerName}`)
  }

  const handleEdit = (record) => {
    antdMessage.info(`编辑成交记录：${record.propertyTitle}`)
  }

  return (
    <div>
      <Table 
        columns={columns} 
        dataSource={deals} 
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />
    </div>
  )
}

/**
 * 销售团队组件
 */
const SalesTeam = ({ salesTeam, properties }) => {
  const columns = [
    {
      title: '销售顾问',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div><Text strong>{name}</Text></div>
            <div><Text type="secondary">{record.nameZh}</Text></div>
          </div>
        </Space>
      )
    },
    {
      title: '职位',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: '负责区域',
      dataIndex: 'specialties',
      key: 'specialties',
      render: (specialties) => (
        <Space wrap>
          {specialties.map(area => (
            <Tag key={area} color="blue">{area}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '负责房源',
      key: 'propertyCount',
      render: (_, record) => {
        const count = properties.filter(p => p.agentId === record.id).length
        return <Text strong>{count} 套</Text>
      }
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <WhatsAppOutlined style={{ color: '#25D366' }} />
            <Text>{record.whatsapp}</Text>
          </Space>
          <Space>
            <MailOutlined style={{ color: '#1890ff' }} />
            <Text>{record.email}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'active',
      key: 'active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? '在职' : '离职'}
        </Tag>
      )
    }
  ]

  return (
    <div>
      <Table 
        columns={columns} 
        dataSource={salesTeam} 
        rowKey="id"
        pagination={false}
      />
    </div>
  )
}

/**
 * AI 房源生成组件
 */
const AIGenerator = ({ onSave }) => {
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [images, setImages] = useState([])
  const [aiResult, setAiResult] = useState(null)
  const [form] = Form.useForm()

  // 处理图片上传
  const handleImageUpload = ({ file, fileList }) => {
    setImages(fileList)
  }

  // 调用 AI 生成
  const handleGenerate = async () => {
    const values = await form.validateFields().catch(() => null)
    if (!values) return
    
    if (images.length === 0) {
      antdMessage.warning('请上传至少 1 张房源照片')
      return
    }

    setGenerating(true)
    
    // 模拟 API 调用（后续接真实 API）
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/ai/generate-property`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: images.map(img => img.name),
            area: values.area,
            unitType: values.unitType,
            sqft: values.sqft,
            price: values.price
          })
        })
        
        const data = await response.json()
        if (data.success) {
          setAiResult(data.data)
          antdMessage.success('AI 生成成功！')
        }
      } catch (error) {
        antdMessage.error('生成失败：' + error.message)
      } finally {
        setGenerating(false)
      }
    }, 2000)
  }

  // 保存到房源库
  const handleSave = async () => {
    if (!aiResult) return
    
    const values = form.getFieldsValue()
    
    try {
      const response = await fetch(`${API_BASE}/ai/save-property`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${values.area} ${values.unitType} for ${values.type === 'rent' ? 'Rent' : 'Sale'}`,
          area: values.area,
          unitType: values.unitType,
          sqft: values.sqft,
          price: values.price,
          type: values.type,
          description: aiResult.description,
          furnished: aiResult.furnished,
          images: images.map(img => img.name)
        })
      })
      
      const data = await response.json()
      if (data.success) {
        antdMessage.success('房源已保存到房源库！')
        setAiResult(null)
        setImages([])
        form.resetFields()
        onSave()
      }
    } catch (error) {
      antdMessage.error('保存失败：' + error.message)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CameraOutlined style={{ fontSize: 24, color: '#722ed1' }} />
            <span>AI 房源生成器</span>
          </div>
        }
        extra={<ThunderboltOutlined style={{ color: '#722ed1' }} />}
      >
        <p style={{ color: '#666', marginBottom: 20 }}>
          上传房源照片，AI 自动识别装修风格、是否带家具，并生成专业英文 + 阿拉伯语描述。
        </p>

        <Form form={form} layout="vertical">
          {/* 图片上传 */}
          <Form.Item label="房源照片">
            <Upload
              listType="picture-card"
              multiple
              maxCount={10}
              fileList={images}
              onChange={handleImageUpload}
              beforeUpload={() => false}
            >
              {images.length < 10 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传照片</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Divider />

          {/* 房源信息 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="区域"
                name="area"
                rules={[{ required: true, message: '请选择区域' }]}
              >
                <Select placeholder="选择区域" showSearch>
                  <Option value="Dubai Silicon Oasis (DSO)">DSO</Option>
                  <Option value="Jumeirah Village Circle (JVC)">JVC</Option>
                  <Option value="International City">International City</Option>
                  <Option value="Dubai Marina">Dubai Marina</Option>
                  <Option value="Downtown Dubai">Downtown Dubai</Option>
                  <Option value="Business Bay">Business Bay</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="户型"
                name="unitType"
                rules={[{ required: true, message: '请选择户型' }]}
              >
                <Select placeholder="选择户型">
                  <Option value="Studio">Studio</Option>
                  <Option value="1BR">1BR</Option>
                  <Option value="2BR">2BR</Option>
                  <Option value="3BR">3BR</Option>
                  <Option value="4BR">4BR</Option>
                  <Option value="Villa">Villa</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="面积 (sqft)"
                name="sqft"
                rules={[{ required: true, message: '请输入面积' }]}
              >
                <InputNumber
                  min={100}
                  max={10000}
                  style={{ width: '100%' }}
                  placeholder="例如：1200"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="价格 (AED)"
                name="price"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <InputNumber
                  min={10000}
                  max={10000000}
                  style={{ width: '100%' }}
                  placeholder="例如：80000"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="类型"
                name="type"
                initialValue="rent"
              >
                <Select>
                  <Option value="rent">出租</Option>
                  <Option value="sale">出售</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleGenerate}
              loading={generating}
              icon={<ThunderboltOutlined />}
            >
              {generating ? 'AI 分析中...' : '生成 AI 房源描述'}
            </Button>
          </Form.Item>
        </Form>

        {/* AI 生成结果 */}
        {aiResult && (
          <>
            <Divider>AI 生成结果</Divider>
            
            <Card type="inner" title="📝 房源描述（英文）" style={{ marginBottom: 16 }}>
              <TextArea
                value={aiResult.description}
                rows={4}
                readOnly
              />
            </Card>

            <Card type="inner" title="📝 房源描述（阿拉伯语）" style={{ marginBottom: 16 }}>
              <TextArea
                value={aiResult.arabicDescription}
                rows={4}
                readOnly
                style={{ direction: 'rtl' }}
              />
            </Card>

            <Row gutter={16}>
              <Col span={12}>
                <Card type="inner" title="🏠 AI 识别结果">
                  <div><Text strong>是否带家具：</Text>{aiResult.furnished ? '✅ 带家具' : '❌ 不带家具'}</div>
                  <div><Text strong>装修风格：</Text>{aiResult.style}</div>
                  <div><Text strong>识别房间：</Text>{aiResult.rooms.join(', ')}</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card type="inner" title="💡 AI 洞察">
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {aiResult.insights.map((insight, i) => (
                      <li key={i} style={{ marginBottom: 8, fontSize: 13 }}>{insight}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            </Row>

            <Button
              type="primary"
              size="large"
              block
              style={{ marginTop: 16 }}
              onClick={handleSave}
              icon={<SaveOutlined />}
            >
              保存到房源库
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}

export default Admin
