/**
 * 销售后台 Dashboard
 * 功能：房源管理、成交记录、客户跟进
 */

import { useState, useEffect } from 'react'
import { Layout, Menu, Table, Card, Row, Col, Button, Tag, Input, Modal, Form, Select, Space, Statistic, Badge } from 'antd'
import {
  DashboardOutlined,
  PropertySafetyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { TextArea } = Input

// 模拟数据（实际从 API 获取）
const mockDeals = [
  {
    id: 1,
    propertyTitle: 'DSO 1BHK 出租',
    customerName: '张先生',
    customerPhone: '+971 50 123 4567',
    dealAmount: 65000,
    status: 'pending',
    createdAt: '2026-05-18'
  },
  {
    id: 2,
    propertyTitle: 'JVC 2BHK 出售',
    customerName: '李女士',
    customerPhone: '+971 55 987 6543',
    dealAmount: 1200000,
    status: 'completed',
    createdAt: '2026-05-17'
  }
]

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [deals, setDeals] = useState(mockDeals)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  // 统计数据
  const stats = {
    totalDeals: deals.length,
    pendingDeals: deals.filter(d => d.status === 'pending').length,
    completedDeals: deals.filter(d => d.status === 'completed').length,
    totalAmount: deals.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.dealAmount, 0)
  }

  // 新增成交
  const handleAddDeal = async (values) => {
    const newDeal = {
      id: deals.length + 1,
      propertyTitle: values.propertyTitle,
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      dealAmount: parseInt(values.dealAmount),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      notes: values.notes
    }
    
    setDeals([...deals, newDeal])
    setIsModalOpen(false)
    form.resetFields()
    
    // TODO: 调用 API
    console.log('新成交:', newDeal)
  }

  // 更新状态
  const handleUpdateStatus = (id, status) => {
    setDeals(deals.map(d => 
      d.id === id ? { ...d, status } : d
    ))
    
    // TODO: 调用 API
    console.log(`更新成交 ${id} 状态为 ${status}`)
  }

  // 成交表格列
  const dealColumns = [
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
          <div>{name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.customerPhone}</div>
        </div>
      )
    },
    {
      title: '成交金额',
      dataIndex: 'dealAmount',
      key: 'dealAmount',
      render: (amount) => `${amount.toLocaleString()} AED`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          pending: { color: 'orange', text: '待跟进' },
          completed: { color: 'green', text: '已成交' },
          cancelled: { color: 'red', text: '已取消' }
        }
        return <Badge color={config[status].color} text={config[status].text} />
      }
    },
    {
      title: '日期',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button size="small" onClick={() => handleUpdateStatus(record.id, 'completed')}>
                成交
              </Button>
              <Button size="small" danger onClick={() => handleUpdateStatus(record.id, 'cancelled')}>
                取消
              </Button>
            </>
          )}
          <Button size="small">详情</Button>
        </Space>
      )
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 600
        }}>
          {collapsed ? '🏠' : 'Dealzy 后台'}
        </div>
        <Menu theme="dark" selectedKeys={[activeTab]} mode="inline">
          <Menu.Item key="overview" icon={<DashboardOutlined />} onClick={() => setActiveTab('overview')}>
            总览
          </Menu.Item>
          <Menu.Item key="deals" icon={<CheckCircleOutlined />} onClick={() => setActiveTab('deals')}>
            成交记录
          </Menu.Item>
          <Menu.Item key="properties" icon={<PropertySafetyOutlined />} onClick={() => setActiveTab('properties')}>
            房源管理
          </Menu.Item>
          <Menu.Item key="customers" icon={<TeamOutlined />} onClick={() => setActiveTab('customers')}>
            客户管理
          </Menu.Item>
        </Menu>
      </Sider>
      
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>销售后台</div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            新增成交
          </Button>
        </Header>
        
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          {activeTab === 'overview' && (
            <>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic title="总成交数" value={stats.totalDeals} suffix="单" />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic title="待跟进" value={stats.pendingDeals} suffix="单" valueStyle={{ color: '#fa8c16' }} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic title="已成交" value={stats.completedDeals} suffix="单" valueStyle={{ color: '#52c41a' }} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic title="成交总额" value={stats.totalAmount.toLocaleString()} suffix="AED" precision={0} />
                  </Card>
                </Col>
              </Row>
              
              <Card title="最近成交" style={{ marginTop: 24 }}>
                <Table columns={dealColumns} dataSource={deals.slice(0, 5)} rowKey="id" pagination={false} />
              </Card>
            </>
          )}
          
          {activeTab === 'deals' && (
            <Card title="成交记录">
              <Table columns={dealColumns} dataSource={deals} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>
          )}
          
          {activeTab === 'properties' && (
            <Card title="房源管理">
              <p>房源管理功能开发中...</p>
            </Card>
          )}
          
          {activeTab === 'customers' && (
            <Card title="客户管理">
              <p>客户管理功能开发中...</p>
            </Card>
          )}
        </Content>
      </Layout>

      {/* 新增成交弹窗 */}
      <Modal
        title="新增成交记录"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDeal}>
          <Form.Item name="propertyTitle" label="房源" rules={[{ required: true }]}>
            <Input placeholder="例如：DSO 1BHK 出租" />
          </Form.Item>
          <Form.Item name="customerName" label="客户姓名" rules={[{ required: true }]}>
            <Input placeholder="客户姓名" />
          </Form.Item>
          <Form.Item name="customerPhone" label="联系电话" rules={[{ required: true }]}>
            <Input placeholder="+971 XX XXX XXXX" />
          </Form.Item>
          <Form.Item name="dealAmount" label="成交金额 (AED)" rules={[{ required: true }]}>
            <Input type="number" placeholder="例如：65000" />
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <TextArea rows={3} placeholder="备注信息..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}

export default AdminDashboard
