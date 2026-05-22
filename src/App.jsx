import { useState, useEffect } from 'react'
import { Layout, Menu, Card, Row, Col, Input, Button, List, Avatar, Space, Badge, message as antdMessage, Tooltip, Modal, Tag, Divider, Popover } from 'antd'
import { t, setLang, getCurrentLang, getCurrentLangConfig, languages } from './i18n.js'
import { 
  HomeOutlined, 
  ShopOutlined, 
  TeamOutlined, 
  MessageOutlined,
  SendOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  DashboardOutlined
} from '@ant-design/icons'
import Admin from './pages/Admin.jsx'

const { Header, Content, Footer } = Layout
const { TextArea } = Input

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

// 真实房源数据
import propertiesData from '../data/properties.json' assert { type: 'json' }
const mockProperties = propertiesData.slice(0, 50)

/**
 * 房源卡片组件
 */
const PropertyCard = ({ property }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const currentLang = getCurrentLang()
  
  const getPropertyImage = () => {
    if (imageError || !property.image) {
      const colors = ['667eea', '764ba2', 'f093fb', 'f5576c', '4facfe', '43e97b']
      const colorIndex = (property.id || 0) % colors.length
      const text = encodeURIComponent(`${property.area}\n${property.bedrooms === 0 ? 'Studio' : `${property.bedrooms}BHK`}`)
      return `https://placehold.co/400x200/${colors[colorIndex]}/ffffff?text=${text}`
    }
    return property.image
  }
  
  return (
    <>
      <Card
        cover={
          <div style={{ 
            height: 220, 
            overflow: 'hidden', 
            background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
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
              background: property.type === 'rent' ? 'rgba(24,144,255,0.95)' : 'rgba(82,196,26,0.95)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              backdropFilter: 'blur(8px)'
            }}>
              {property.type === 'rent' ? '🏠 出租' : '💰 出售'}
            </div>
          </div>
        }
        hoverable
        onClick={() => setModalOpen(true)}
        style={{ 
          cursor: 'pointer', 
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 17, lineHeight: 1.4 }}>{property.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#666', background: '#f5f5f5', padding: '4px 10px', borderRadius: 12 }}>📍 {property.area}</span>
          </div>
          <div style={{ color: '#f5222d', fontWeight: 800, fontSize: 22 }}>
            AED {property.price?.toLocaleString()}
            <span style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>/{property.priceType || '年'}</span>
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
            <span style={{ marginRight: 12 }}>🏠 {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms}卧室`}</span>
            <span style={{ marginRight: 12 }}>📐 {property.size} 尺</span>
            <span>{property.furnished ? '🛋️ 带家具' : '🏢 空房'}</span>
          </div>
        </div>
      </Card>

      <Modal
        title={property.title}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>{t('property_close', currentLang)}</Button>,
          <Button 
            key="contact" 
            type="primary" 
            icon={<WhatsAppOutlined />}
            onClick={() => {
              const msg = `Hi, 我对这套房源感兴趣：${property.title} - AED ${property.price}`
              window.open(`https://wa.me/${property.agentWhatsapp}?text=${encodeURIComponent(msg)}`)
            }}
          >
            {t('property_contact', currentLang)}
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
              <div style={{ color: '#999', fontSize: 12 }}>{t('detail_price', currentLang)}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f5222d' }}>AED {property.price?.toLocaleString()}</div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#999', fontSize: 12 }}>{t('detail_area', currentLang)}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{property.areaName || property.area}</div>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
              <div style={{ fontSize: 24 }}>🏠</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{property.bedrooms === 0 ? t('property_studio', currentLang) : `${property.bedrooms}BHK`}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
              <div style={{ fontSize: 24 }}>📐</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{property.size} {t('property_sqft', currentLang)}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
              <div style={{ fontSize: 24 }}>{property.furnished ? '🛋️' : '🏢'}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{property.furnished ? t('property_furnished', currentLang) : t('property_unfurnished', currentLang)}</div>
            </div>
          </Col>
        </Row>

        {property.description && (
          <>
            <Divider />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{t('detail_description', currentLang)}</div>
              <div style={{ color: '#666', lineHeight: 1.6 }}>{property.description}</div>
            </div>
          </>
        )}

        {property.amenities && property.amenities.length > 0 && (
          <>
            <Divider />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{t('detail_amenities', currentLang)}</div>
              <Space wrap>
                {property.amenities.map((item, i) => (<Tag key={i} color="blue">{item}</Tag>))}
              </Space>
            </div>
          </>
        )}

        <Divider />
        
        <div style={{ background: '#fafafa', padding: 16, borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{t('detail_agent', currentLang)}</div>
          <Space>
            <Avatar size={40} style={{ backgroundColor: '#1890ff' }}>{property.agentName?.charAt(0) || 'S'}</Avatar>
            <div>
              <div style={{ fontWeight: 600 }}>{property.agentName || t('detail_agent', currentLang)}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{property.agentWhatsapp || ''}</div>
            </div>
          </Space>
        </div>
      </Modal>
    </>
  )
}

/**
 * AI 客服对话组件
 */
const ChatWidget = () => {
  const [messages, setMessages] = useState([{ type: 'ai', text: t('chat_button', getCurrentLang()) }])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const currentLang = getCurrentLang()

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = input
    setMessages([...messages, { type: 'user', text: userMessage }])
    setInput('')
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await response.json()
      const aiReply = { type: 'ai', text: data.message || t('chat_placeholder', currentLang) }
      setMessages(prev => [...prev, aiReply])
    } catch (error) {
      setTimeout(() => {
        const aiReply = { type: 'ai', text: '好的！DSO 目前有 3 套符合您的房源...\n\n您想看哪套？我可以安排看房！😊' }
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
      >
        {t('chat_button', currentLang)}
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
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{
        padding: '16px 20px',
        background: '#722ed1',
        color: '#fff',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontWeight: 600 }}>{t('chat_title', currentLang)}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{t('chat_online', currentLang)}</div>
        </div>
        <Button type="text" size="small" onClick={() => setOpen(false)} style={{ color: '#fff' }}>✕</Button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f5f5f5' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 16, display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: 12, background: msg.type === 'user' ? '#722ed1' : '#fff', color: msg.type === 'user' ? '#fff' : '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, background: '#fff', borderRadius: '0 0 12px 12px', borderTop: '1px solid #e8e8e8' }}>
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleSend}
            placeholder={t('chat_placeholder', currentLang)}
            autoSize={{ minRows: 1, maxRows: 3 }}
            style={{ resize: 'none' }}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>{t('chat_send', currentLang)}</Button>
        </Space.Compact>
      </div>
    </div>
  )
}

/**
 * 主应用组件
 */
function App() {
  const { route, navigate } = useHashRoute()
  const [currentLang, setCurrentLang] = useState(getCurrentLang())
  
  if (route === '#/admin' || route.startsWith('#/admin?')) {
    return <Admin />
  }
  
  const langConfig = getCurrentLangConfig()
  const isRTL = currentLang === 'ar'
  
  const langContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {Object.entries(languages).map(([code, config]) => (
        <Button
          key={code}
          size="small"
          onClick={() => { setCurrentLang(code); setLang(code) }}
          style={{ textAlign: 'left', minWidth: 120 }}
          icon={<span>{config.flag}</span>}
        >
          {config.name}
        </Button>
      ))}
    </div>
  )
  
  return (
    <Layout style={{ minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 40px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 999
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            fontSize: 28, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800
          }}>🏠</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dealzy</div>
            <div style={{ fontSize: 11, color: '#999', letterSpacing: '0.5px' }}>
              {currentLang === 'zh' && '迪拜房产 AI 客服 · Close deals faster'}
              {currentLang === 'en' && 'Dubai Real Estate AI · Close deals faster'}
              {currentLang === 'ar' && 'نظام الذكاء الاصطناعي للعقارات · Close deals faster'}
            </div>
          </div>
        </div>
        
        <Space size="large">
          <Button type="link" href="#/" style={{ fontSize: 15, fontWeight: 500 }}>{t('nav_home', currentLang)}</Button>
          <Button type="link" href="#/properties" style={{ fontSize: 15, fontWeight: 500 }}>{t('nav_properties', currentLang)}</Button>
          <Popover content={langContent} trigger="click" placement="bottomRight">
            <Button icon={<span>{langConfig.flag}</span>} style={{ borderRadius: 20 }}>{langConfig.name}</Button>
          </Popover>
          <Tooltip title={t('nav_admin', currentLang)}>
            <Button 
              type="primary" 
              onClick={() => navigate('#/admin')} 
              icon={<DashboardOutlined />} 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: 20,
                padding: '0 20px'
              }}
            >
              {t('nav_admin', currentLang)}
            </Button>
          </Tooltip>
        </Space>
      </Header>

      <Content>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '100px 40px 80px',
          textAlign: 'center',
          color: '#fff',
          direction: 'ltr',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 装饰背景 */}
          <div style={{
            position: 'absolute',
            top: -50,
            left: -50,
            width: 300,
            height: 300,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 400,
            height: 400,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: 64, 
              marginBottom: 24, 
              fontWeight: 800,
              textShadow: '0 2px 20px rgba(0,0,0,0.2)'
            }}>{t('hero_slogan', currentLang)}</div>
            <p style={{ 
              fontSize: 22, 
              marginBottom: 48, 
              opacity: 0.95,
              maxWidth: 600,
              margin: '0 auto 48px',
              lineHeight: 1.6
            }}>{t('hero_subtitle', currentLang)}</p>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                href="#/properties" 
                style={{ 
                  height: 56, 
                  padding: '0 48px',
                  fontSize: 18,
                  fontWeight: 600,
                  borderRadius: 28,
                  background: '#fff',
                  color: '#667eea',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}
              >
                {t('hero_browse', currentLang)}
              </Button>
              <Button 
                size="large" 
                onClick={() => navigate('#/admin')} 
                style={{ 
                  height: 56, 
                  padding: '0 48px',
                  fontSize: 18,
                  fontWeight: 600,
                  borderRadius: 28,
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.5)'
                }}
              >
                {t('hero_admin', currentLang)}
              </Button>
            </Space>
          </div>
        </div>

        <div style={{ padding: '60px 24px', maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, marginBottom: 12, fontWeight: 700 }}>{t('section_properties', currentLang)}</h2>
            <p style={{ fontSize: 16, color: '#999' }}>精选迪拜优质房源，AI 智能匹配您的需求</p>
          </div>
          <Row gutter={[32, 32]}>
            {mockProperties.map(property => (
              <Col key={property.id} xs={24} sm={12} lg={8} xl={6}>
                <PropertyCard property={property} />
              </Col>
            ))}
          </Row>
        </div>

        <div style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #f9fafb 0%, #fff 100%)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <h2 style={{ fontSize: 36, marginBottom: 12, fontWeight: 700 }}>{t('section_why', currentLang)}</h2>
              <p style={{ fontSize: 16, color: '#999' }}>为什么选择 Dealzy？我们让房产交易更简单</p>
            </div>
            <Row gutter={[48, 48]}>
              <Col xs={24} sm={8}>
                <div style={{ 
                  textAlign: 'center', 
                  padding: 40,
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{ 
                    fontSize: 56, 
                    marginBottom: 20,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>⚡</div>
                  <h3 style={{ fontSize: 20, marginBottom: 12, fontWeight: 600 }}>{t('why_fast_title', currentLang)}</h3>
                  <p style={{ color: '#666', lineHeight: 1.8, fontSize: 15 }}>{t('why_fast_desc', currentLang)}</p>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ 
                  textAlign: 'center', 
                  padding: 40,
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{ 
                    fontSize: 56, 
                    marginBottom: 20,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>🌍</div>
                  <h3 style={{ fontSize: 20, marginBottom: 12, fontWeight: 600 }}>{t('why_multilang_title', currentLang)}</h3>
                  <p style={{ color: '#666', lineHeight: 1.8, fontSize: 15 }}>{t('why_multilang_desc', currentLang)}</p>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ 
                  textAlign: 'center', 
                  padding: 40,
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{ 
                    fontSize: 56, 
                    marginBottom: 20,
                    background: 'linear-gradient(135deg, #4facfe 0%, #43e97b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>💰</div>
                  <h3 style={{ fontSize: 20, marginBottom: 12, fontWeight: 600 }}>{t('why_transparent_title', currentLang)}</h3>
                  <p style={{ color: '#666', lineHeight: 1.8, fontSize: 15 }}>{t('why_transparent_desc', currentLang)}</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Content>

      <Footer style={{ 
        textAlign: 'center', 
        background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)',
        padding: '40px 24px',
        borderTop: '1px solid #e8e8e8'
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ 
            fontSize: 20, 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Dealzy</span>
          <span style={{ color: '#999', margin: '0 12px' }}>×</span>
          <span style={{ fontWeight: 600, color: '#333' }}>Well Chosen 房产</span>
        </div>
        <div style={{ color: '#999', fontSize: 13, marginBottom: 8 }}>{t('footer_copyright', currentLang)}</div>
        <div style={{ color: '#ccc', fontSize: 12 }}>Powered by AI · Made with ❤️ in Dubai</div>
      </Footer>

      <ChatWidget />
    </Layout>
  )
}

export default App
