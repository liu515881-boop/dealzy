import { useState, useEffect } from 'react'
import { Layout, Card, Row, Col, Button, Space, Tooltip, Modal, Divider, Avatar } from 'antd'
import { DashboardOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons'
import Admin from './pages/Admin.jsx'
import propertiesData from '../data/properties.json'

const { Header, Content, Footer } = Layout
const { TextArea } = Input || {}

const mockProperties = propertiesData.slice(0, 50)

// 简单的 hash 路由
const useHashRoute = () => {
  const [route, setRoute] = useState(window.location.hash || '#/')
  
  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  
  const navigate = (newHash) => {
    window.location.hash = newHash
  }
  
  return { route, navigate }
}

/**
 * 房源卡片组件
 */
const PropertyCard = ({ property }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const getPropertyImage = () => {
    if (imageError || !property.image) {
      const colorIndex = (property.id || 0) % 6
      const colors = ['e2e8f0', 'cbd5e0', 'a0aec0', '718096', '4a5568', '2d3748']
      const text = encodeURIComponent(`${property.area} | ${property.bedrooms === 0 ? 'Studio' : `${property.bedrooms}BHK`}`)
      return `https://placehold.co/400x200/${colors[colorIndex]}/ffffff?text=${text}`
    }
    return property.image
  }
  
  return (
    <>
      <Card
        cover={
          <div style={{ 
            height: 200, 
            overflow: 'hidden', 
            background: '#f7f7f7',
            position: 'relative'
          }}>
            <img 
              alt={property.title} 
              src={getPropertyImage()} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12
            }}>
              AI 生成
            </div>
          </div>
        }
        onClick={() => setModalOpen(true)}
        style={{ 
          cursor: 'pointer', 
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          transition: 'box-shadow 200ms ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ padding: '16px' }}>
          <div style={{ color: '#1a365d', fontWeight: 700, marginBottom: 8, fontSize: 22 }}>
            AED {property.price?.toLocaleString()}
            <span style={{ fontSize: 14, color: '#718096', fontWeight: 400, marginLeft: 4 }}>/{property.priceType || '年'}</span>
          </div>
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16, color: '#1a202c' }}>{property.title}</div>
          <div style={{ fontSize: 14, color: '#718096', marginBottom: 12 }}>📍 {property.area}</div>
          <div style={{ fontSize: 14, color: '#718096', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
            <span style={{ marginRight: 16 }}>{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms}卧室`}</span>
            <span style={{ marginRight: 16 }}>{property.size} 尺</span>
            <span>{property.furnished ? '带家具' : '空房'}</span>
          </div>
          <Button 
            block 
            style={{ 
              marginTop: 12, 
              height: 40, 
              borderRadius: 8,
              background: '#1a365d',
              border: 'none',
              fontWeight: 600
            }}
            onClick={(e) => {
              e.stopPropagation()
              setModalOpen(true)
            }}
          >
            联系销售
          </Button>
        </div>
      </Card>

      <Modal
        title={property.title}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>关闭</Button>,
          <Button 
            key="contact" 
            type="primary" 
            onClick={() => {
              const msg = `Hi，我对这套房源感兴趣：${property.title} - AED ${property.price}`
              window.open(`https://wa.me/${property.agentWhatsapp}?text=${encodeURIComponent(msg)}`)
            }}
            style={{ background: '#1a365d', border: 'none', borderRadius: 8 }}
          >
            联系销售
          </Button>
        ]}
        width={600}
      >
        <div style={{ marginBottom: 20, borderRadius: 8, overflow: 'hidden' }}>
          <img src={getPropertyImage()} alt={property.title} style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} onError={() => setImageError(true)} />
        </div>
        
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#999', fontSize: 12 }}>价格</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1a365d' }}>AED {property.price?.toLocaleString()}</div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#999', fontSize: 12 }}>区域</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{property.areaFull || property.area}</div>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 12, background: '#f7f7f7', borderRadius: 8 }}>
              <div style={{ fontSize: 24 }}>🏠</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms}BHK`}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 12, background: '#f7f7f7', borderRadius: 8 }}>
              <div style={{ fontSize: 24 }}>📐</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{property.size} 尺</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 12, background: '#f7f7f7', borderRadius: 8 }}>
              <div style={{ fontSize: 24 }}>{property.furnished ? '🛋️' : '🏢'}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{property.furnished ? '带家具' : '空房'}</div>
            </div>
          </Col>
        </Row>

        {property.description && (
          <>
            <Divider />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>房源描述</div>
              <div style={{ color: '#666', lineHeight: 1.6 }}>{property.description}</div>
            </div>
          </>
        )}

        <Divider />
        
        <div style={{ background: '#f7f7f7', padding: 16, borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>销售顾问</div>
          <Space>
            <Avatar size={40} style={{ backgroundColor: '#1a365d' }}>{property.agentName?.charAt(0) || 'S'}</Avatar>
            <div>
              <div style={{ fontWeight: 600 }}>{property.agentName || '销售顾问'}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{property.agentWhatsapp || ''}</div>
            </div>
          </Space>
        </div>
      </Modal>
    </>
  )
}

/**
 * AI 客服组件
 */
const ChatWidget = () => {
  const [open, setOpen] = useState(false)

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
          height: 56,
          borderRadius: 28,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 1000,
          background: '#1a365d',
          border: 'none'
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
      width: 360,
      height: 480,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        padding: '16px 20px',
        background: '#1a365d',
        color: '#fff',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontWeight: 600 }}>AI 助手</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>在线</div>
        </div>
        <Button type="text" size="small" onClick={() => setOpen(false)} style={{ color: '#fff' }}>✕</Button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f7f7f7' }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ 
            maxWidth: '80%', 
            padding: '12px 16px', 
            borderRadius: 12, 
            background: '#fff',
            border: '1px solid #e2e8f0',
            fontSize: 15
          }}>
            您好！我是 Dealzy AI 助手，有什么可以帮您？😊
          </div>
        </div>
      </div>

      <div style={{ padding: 16, background: '#fff', borderRadius: '0 0 16px 16px', borderTop: '1px solid #e2e8f0' }}>
        <TextArea
          placeholder="输入消息..."
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{ resize: 'none', borderRadius: 8, marginBottom: 8 }}
          onPressEnter={() => {}}
        />
        <Button type="primary" icon={<SendOutlined />} block style={{ background: '#1a365d', border: 'none', borderRadius: 8 }}>发送</Button>
        <div style={{ fontSize: 12, color: '#a0aec0', marginTop: 8, textAlign: 'center' }}>
          AI 为您提供建议，最终请以销售确认
        </div>
      </div>
    </div>
  )
}

/**
 * 主应用
 */
function App() {
  const { route, navigate } = useHashRoute()
  
  if (route === '#/admin' || route.startsWith('#/admin?')) {
    return <Admin />
  }
  
  return (
    <Layout style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 40px',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 999
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>🏠</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#1a365d' }}>Dealzy</div>
            <div style={{ fontSize: 12, color: '#718096' }}>迪拜房产 AI 客服</div>
          </div>
        </div>
        
        <Space size="large">
          <Button type="link" href="#/" style={{ fontSize: 15, color: '#1a202c' }}>首页</Button>
          <Button type="link" href="#/properties" style={{ fontSize: 15, color: '#1a202c' }}>房源</Button>
          <Tooltip title="销售后台">
            <Button 
              type="primary" 
              onClick={() => navigate('#/admin')} 
              icon={<DashboardOutlined />} 
              style={{ 
                background: '#1a365d',
                border: 'none',
                borderRadius: 8,
                padding: '0 16px'
              }}
            >
              后台
            </Button>
          </Tooltip>
        </Space>
      </Header>

      <Content>
        {/* Hero 区域 */}
        <div style={{
          background: '#F8F9FA',
          padding: '80px 40px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ 
              fontSize: 36, 
              marginBottom: 16, 
              fontWeight: 700,
              color: '#1a202c'
            }}>找到您在迪拜的理想家园</div>
            <p style={{ 
              fontSize: 18, 
              marginBottom: 32, 
              color: '#718096',
              lineHeight: 1.6
            }}>AI 智能匹配，专业房产顾问，让交易更简单</p>
            <Space size="medium">
              <Button 
                type="primary" 
                size="large" 
                href="#/properties" 
                style={{ 
                  height: 48, 
                  padding: '0 32px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 8,
                  background: '#1a365d',
                  border: 'none'
                }}
              >
                浏览房源
              </Button>
              <Button 
                size="large" 
                onClick={() => navigate('#/admin')} 
                style={{ 
                  height: 48, 
                  padding: '0 32px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 8,
                  background: '#fff',
                  color: '#1a365d',
                  border: '1px solid #1a365d'
                }}
              >
                销售后台
              </Button>
            </Space>
          </div>
        </div>

        {/* 房源列表 */}
        <div style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, marginBottom: 8, fontWeight: 700, color: '#1a202c' }}>精选房源</h2>
            <p style={{ fontSize: 16, color: '#718096' }}>迪拜热门区域优质房源</p>
          </div>
          <Row gutter={[24, 24]}>
            {mockProperties.map(property => (
              <Col key={property.id} xs={24} sm={12} lg={8}>
                <PropertyCard property={property} />
              </Col>
            ))}
          </Row>
        </div>

        {/* 特色区域 */}
        <div style={{ padding: '80px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 28, marginBottom: 8, fontWeight: 700, color: '#1a202c' }}>为什么选择 Dealzy</h2>
              <p style={{ fontSize: 16, color: '#718096' }}>专业、透明、高效的房产服务</p>
            </div>
            <Row gutter={[48, 48]}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16, color: '#1a365d' }}>⚡</div>
                  <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 600, color: '#1a202c' }}>快速响应</h3>
                  <p style={{ color: '#718096', lineHeight: 1.6, fontSize: 15 }}>AI 客服 24/7 在线，销售顾问 5 分钟内回复</p>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16, color: '#1a365d' }}>🌍</div>
                  <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 600, color: '#1a202c' }}>多语言支持</h3>
                  <p style={{ color: '#718096', lineHeight: 1.6, fontSize: 15 }}>中文、英文、阿拉伯语，沟通无障碍</p>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16, color: '#1a365d' }}>💰</div>
                  <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 600, color: '#1a202c' }}>价格透明</h3>
                  <p style={{ color: '#718096', lineHeight: 1.6, fontSize: 15 }}>真实房源，真实价格，无隐藏费用</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Content>

      <Footer style={{ 
        textAlign: 'center', 
        background: '#F8F9FA',
        padding: '40px 24px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1a365d' }}>Dealzy</span>
          <span style={{ color: '#cbd5e0', margin: '0 12px' }}>×</span>
          <span style={{ fontWeight: 600, color: '#1a202c' }}>Well Chosen 房产</span>
        </div>
        <div style={{ color: '#718096', fontSize: 13, marginBottom: 8 }}>© 2026 Dealzy. All rights reserved.</div>
        <div style={{ color: '#a0aec0', fontSize: 12 }}>Powered by AI · Made with ❤️ in Dubai</div>
      </Footer>

      <ChatWidget />
    </Layout>
  )
}

export default App
