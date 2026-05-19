import { useState, useEffect } from 'react'
import { Layout, Menu, Card, Row, Col, Input, Button, List, Avatar, Space, Badge, message as antdMessage } from 'antd'
import { 
  HomeOutlined, 
  ShopOutlined, 
  TeamOutlined, 
  MessageOutlined,
  SendOutlined,
  PhoneOutlined,
  WhatsAppOutlined
} from '@ant-design/icons'

const { Header, Content, Footer } = Layout
const { TextArea } = Input

// 模拟房源数据（等姐姐提供真实数据后替换）
const mockProperties = [
  {
    id: 1,
    title: 'DSO 1BHK 出租',
    area: 'DSO',
    type: 'rent',
    price: 65000,
    priceType: '年',
    bedrooms: 1,
    size: 800,
    furnished: true,
    image: 'https://via.placeholder.com/300x200',
    amenities: ['泳池', '健身房', '车位']
  },
  {
    id: 2,
    title: 'JVC 2BHK 出售',
    area: 'JVC',
    type: 'sale',
    price: 1200000,
    priceType: '总价',
    bedrooms: 2,
    size: 1200,
    furnished: false,
    image: 'https://via.placeholder.com/300x200',
    amenities: ['泳池', '儿童乐园', '车位']
  },
  {
    id: 3,
    title: 'IC Studio 出租',
    area: 'International City',
    type: 'rent',
    price: 35000,
    priceType: '年',
    bedrooms: 0,
    size: 500,
    furnished: true,
    image: 'https://via.placeholder.com/300x200',
    amenities: ['车位', '近地铁']
  }
]

// AI 客服对话组件
const ChatWidget = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hi! 有什么可以帮您？😊' }
  ])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = input
    // 添加用户消息
    setMessages([...messages, { type: 'user', text: userMessage }])
    setInput('')
    
    // 调用 AI 客服 API
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      
      const data = await response.json()
      const aiReply = { type: 'ai', text: data.message || '抱歉，我暂时无法回答这个问题。' }
      setMessages(prev => [...prev, aiReply])
    } catch (error) {
      // API 不可用时使用模拟回复
      setTimeout(() => {
        const aiReply = { type: 'ai', text: '好的！DSO 目前有 3 套符合您的房源：\n\n1. Studio, 650 sqft, 55,000 AED/年，带家具\n2. 1BHK, 800 sqft, 58,000 AED/年，不带家具\n3. 1BHK, 750 sqft, 60,000 AED/年，带家具\n\n您想看哪套？我可以安排看房！😊' }
        setMessages(prev => [...prev, aiReply])
      }, 1000)
    }
  }

  if (!open) {
    return (
      <Button 
        type="primary" 
        icon={<MessageOutlined />}
        size="large"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          height: 60,
          borderRadius: 30,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        AI 客服
      </Button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      width: 380,
      height: 500,
      backgroundColor: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* 头部 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar style={{ backgroundColor: '#1E40AF' }}>🤖</Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>Dealzy AI 客服</div>
            <div style={{ fontSize: 12, color: '#666' }}>在线</div>
          </div>
        </div>
        <Button type="text" onClick={() => setOpen(false)}>✕</Button>
      </div>

      {/* 消息列表 */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: 12,
              backgroundColor: msg.type === 'user' ? '#1E40AF' : '#f0f0f0',
              color: msg.type === 'user' ? '#fff' : '#000',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 输入框 */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        gap: 10
      }}>
        <TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={handleSend}
          placeholder="输入消息..."
          rows={2}
          style={{ resize: 'none' }}
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />}
          onClick={handleSend}
        >
          发送
        </Button>
      </div>
    </div>
  )
}

// 房源卡片组件
const PropertyCard = ({ property }) => (
  <Card
    hoverable
    cover={<img alt={property.title} src={property.image} style={{ height: 200, objectFit: 'cover' }} />}
    style={{ borderRadius: 12 }}
  >
    <Card.Meta
      title={
        <Space>
          {property.title}
          <Badge color={property.type === 'rent' ? 'blue' : 'green'} 
            text={property.type === 'rent' ? '出租' : '出售'} 
          />
        </Space>
      }
      description={
        <div>
          <div style={{ fontSize: 18, color: '#1E40AF', fontWeight: 600, margin: '8px 0' }}>
            {property.price.toLocaleString()} AED/{property.priceType}
          </div>
          <div style={{ color: '#666', marginBottom: 8 }}>
            📍 {property.area} | 🏠 {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms}BHK`} | 📐 {property.size} sqft
          </div>
          <div style={{ marginBottom: 12 }}>
            {property.furnished ? '🛋️ 带家具' : '🏠 不带家具'}
            {property.amenities.map((item, idx) => (
              <span key={idx} style={{ marginLeft: 8 }}>• {item}</span>
            ))}
          </div>
          <Space>
            <Button type="primary">查看详情</Button>
            <Button icon={<WhatsAppOutlined />}>WhatsApp</Button>
          </Space>
        </div>
      }
    />
  </Card>
)

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 导航栏 */}
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1E40AF' }}>
          🏠 Dealzy
        </div>
        <Menu mode="horizontal" style={{ flex: 1, justifyContent: 'flex-end', border: 'none' }}>
          <Menu.Item key="home" icon={<HomeOutlined />}>首页</Menu.Item>
          <Menu.Item key="rent" icon={<ShopOutlined />}>租赁</Menu.Item>
          <Menu.Item key="sale" icon={<HomeOutlined />}>买卖</Menu.Item>
          <Menu.Item key="contact" icon={<PhoneOutlined />}>联系我们</Menu.Item>
        </Menu>
      </Header>

      {/* 内容区 */}
      <Content>
        {/* Hero 区域 */}
        <div style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
          padding: '80px 24px',
          textAlign: 'center',
          color: '#fff'
        }}>
          <h1 style={{ fontSize: 48, marginBottom: 16 }}>迪拜房产，快速成交</h1>
          <p style={{ fontSize: 20, opacity: 0.9 }}>Close deals faster</p>
        </div>

        {/* AI 客服入口 */}
        <div style={{
          padding: '40px 24px',
          textAlign: 'center',
          background: '#f0f5ff'
        }}>
          <h2 style={{ marginBottom: 24 }}>💬 AI 客服 24 小时在线</h2>
          <p style={{ marginBottom: 24, color: '#666' }}>
            租房？买房？投资？问 AI 就对了！秒速回复，不用等！
          </p>
          <Button type="primary" size="large" icon={<MessageOutlined />}>
            开始咨询
          </Button>
        </div>

        {/* 热门房源 */}
        <div style={{ padding: '40px 24px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40 }}>🔥 热门房源</h2>
          <Row gutter={[24, 24]}>
            {mockProperties.map(property => (
              <Col key={property.id} xs={24} sm={12} lg={8}>
                <PropertyCard property={property} />
              </Col>
            ))}
          </Row>
        </div>

        {/* 为什么选择 Dealzy */}
        <div style={{
          padding: '60px 24px',
          background: '#f9fafb'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40 }}>为什么选择 Dealzy？</h2>
          <Row gutter={[40, 40]}>
            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                <h3>快速响应</h3>
                <p style={{ color: '#666' }}>AI 客服秒速回复，24 小时在线</p>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🌍</div>
                <h3>多语言支持</h3>
                <p style={{ color: '#666' }}>中文/英文/阿拉伯语，全球客户都能用</p>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
                <h3>透明价格</h3>
                <p style={{ color: '#666' }}>真实房源，真实价格，无隐形费用</p>
              </div>
            </Col>
          </Row>
        </div>
      </Content>

      {/* 页脚 */}
      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        <div style={{ marginBottom: 16 }}>
          <strong>Dealzy</strong> × <strong>Well Chosen 房产</strong>
        </div>
        <div style={{ color: '#666' }}>
          © 2026 迪拜房产 AI 客服系统
        </div>
      </Footer>

      {/* AI 客服浮动按钮 */}
      <ChatWidget />
    </Layout>
  )
}

export default App
