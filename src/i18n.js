/**
 * Dealzy 多语言配置
 * 支持：中文 (zh)、英文 (en)、阿拉伯语 (ar)
 */

export const languages = {
  zh: { name: '中文', flag: '🇨🇳' },
  en: { name: 'English', flag: '🇬🇧' },
  ar: { name: 'العربية', flag: '🇦🇪', dir: 'rtl' }
}

export const translations = {
  zh: {
    // 导航
    nav_home: '首页',
    nav_properties: '房源',
    nav_admin: '管理后台',
    
    // 英雄区
    hero_slogan: 'Close deals faster',
    hero_subtitle: '迪拜房产 AI 客服系统 - 24 小时在线，快速响应，专业服务',
    hero_browse: '浏览房源',
    hero_admin: '管理后台',
    
    // 房源
    section_properties: '🔥 热门房源',
    property_rent: '出租',
    property_sale: '出售',
    property_studio: 'Studio',
    property_bedrooms: '卧室',
    property_sqft: '平方英尺',
    property_furnished: '带家具',
    property_unfurnished: '空房',
    property_contact: '联系销售',
    property_close: '关闭',
    
    // 为什么选择
    section_why: '为什么选择 Dealzy？',
    why_fast_title: '快速响应',
    why_fast_desc: 'AI 客服秒速回复，24 小时在线',
    why_multilang_title: '多语言支持',
    why_multilang_desc: '中文/英文/阿拉伯语，全球客户都能用',
    why_transparent_title: '透明价格',
    why_transparent_desc: '真实房源，真实价格，无隐形费用',
    
    // 页脚
    footer_partnership: 'Dealzy × Well Chosen 房产',
    footer_copyright: '© 2026 迪拜房产 AI 客服系统',
    
    // AI 客服
    chat_button: 'AI 客服',
    chat_title: 'Dealzy AI 客服',
    chat_online: '24 小时在线',
    chat_placeholder: '输入消息...',
    chat_send: '发送',
    
    // 详情弹窗
    detail_price: '价格',
    detail_area: '区域',
    detail_size: '面积',
    detail_type: '户型',
    detail_description: '房源描述',
    detail_amenities: '配套设施',
    detail_agent: '销售顾问',
    
    // 后台
    admin_dashboard: '仪表盘',
    admin_properties: '房源管理',
    admin_deals: '成交管理',
    admin_sales: '销售团队',
    admin_total_properties: '总房源',
    admin_total_deals: '总成交',
    admin_total_sales: '销售顾问',
    admin_conversion_rate: '成交率',
  },
  
  en: {
    // 导航
    nav_home: 'Home',
    nav_properties: 'Properties',
    nav_admin: 'Admin',
    
    // 英雄区
    hero_slogan: 'Close deals faster',
    hero_subtitle: 'Dubai Real Estate AI Assistant - 24/7 Online, Fast Response, Professional Service',
    hero_browse: 'Browse Properties',
    hero_admin: 'Admin Panel',
    
    // 房源
    section_properties: '🔥 Featured Properties',
    property_rent: 'For Rent',
    property_sale: 'For Sale',
    property_studio: 'Studio',
    property_bedrooms: 'Bed',
    property_sqft: 'sqft',
    property_furnished: 'Furnished',
    property_unfurnished: 'Unfurnished',
    property_contact: 'Contact Agent',
    property_close: 'Close',
    
    // 为什么选择
    section_why: 'Why Choose Dealzy?',
    why_fast_title: 'Fast Response',
    why_fast_desc: 'AI assistant replies instantly, 24/7 online',
    why_multilang_title: 'Multi-language',
    why_multilang_desc: 'Chinese/English/Arabic, for global clients',
    why_transparent_title: 'Transparent Pricing',
    why_transparent_desc: 'Real properties, real prices, no hidden fees',
    
    // 页脚
    footer_partnership: 'Dealzy × Well Chosen Real Estate',
    footer_copyright: '© 2026 Dubai Real Estate AI System',
    
    // AI 客服
    chat_button: 'AI Assistant',
    chat_title: 'Dealzy AI Assistant',
    chat_online: '24/7 Online',
    chat_placeholder: 'Type a message...',
    chat_send: 'Send',
    
    // 详情弹窗
    detail_price: 'Price',
    detail_area: 'Area',
    detail_size: 'Size',
    detail_type: 'Type',
    detail_description: 'Description',
    detail_amenities: 'Amenities',
    detail_agent: 'Sales Agent',
    
    // 后台
    admin_dashboard: 'Dashboard',
    admin_properties: 'Properties',
    admin_deals: 'Deals',
    admin_sales: 'Sales Team',
    admin_total_properties: 'Total Properties',
    admin_total_deals: 'Total Deals',
    admin_total_sales: 'Sales Agents',
    admin_conversion_rate: 'Conversion Rate',
  },
  
  ar: {
    // 导航
    nav_home: 'الرئيسية',
    nav_properties: 'العقارات',
    nav_admin: 'الإدارة',
    
    // 英雄区
    hero_slogan: 'أبرم الصفقات بشكل أسرع',
    hero_subtitle: 'نظام الذكاء الاصطناعي للعقارات في دبي - متاح 24/7، استجابة سريعة، خدمة احترافية',
    hero_browse: 'تصفح العقارات',
    hero_admin: 'لوحة الإدارة',
    
    // 房源
    section_properties: '🔥 عقارات مميزة',
    property_rent: 'للإيجار',
    property_sale: 'للبيع',
    property_studio: 'ستوديو',
    property_bedrooms: 'غرفة',
    property_sqft: 'قدم مربع',
    property_furnished: 'مفروش',
    property_unfurnished: 'غير مفروش',
    property_contact: 'تواصل مع الوكيل',
    property_close: 'إغلاق',
    
    // 为什么选择
    section_why: 'لماذا تختار Dealzy؟',
    why_fast_title: 'استجابة سريعة',
    why_fast_desc: 'مساعد الذكاء الاصطناعي يرد فوراً، متاح 24/7',
    why_multilang_title: 'متعدد اللغات',
    why_multilang_desc: 'الصينية/الإنجليزية/العربية، للعملاء العالميين',
    why_transparent_title: 'أسعار شفافة',
    why_transparent_desc: 'عقارات حقيقية، أسعار حقيقية، بدون رسوم خفية',
    
    // 页脚
    footer_partnership: 'Dealzy × Well Chosen للعقارات',
    footer_copyright: '© 2026 نظام الذكاء الاصطناعي للعقارات في دبي',
    
    // AI 客服
    chat_button: 'مساعد الذكاء الاصطناعي',
    chat_title: 'مساعد Dealzy',
    chat_online: 'متاح 24/7',
    chat_placeholder: 'اكتب رسالة...',
    chat_send: 'إرسال',
    
    // 详情弹窗
    detail_price: 'السعر',
    detail_area: 'المنطقة',
    detail_size: 'المساحة',
    detail_type: 'النوع',
    detail_description: 'الوصف',
    detail_amenities: 'وسائل الراحة',
    detail_agent: 'وكيل المبيعات',
    
    // 后台
    admin_dashboard: 'لوحة التحكم',
    admin_properties: 'العقارات',
    admin_deals: 'الصفقات',
    admin_sales: 'فريق المبيعات',
    admin_total_properties: 'إجمالي العقارات',
    admin_total_deals: 'إجمالي الصفقات',
    admin_total_sales: 'وكلاء المبيعات',
    admin_conversion_rate: 'معدل التحويل',
  }
}

// 获取当前语言
export const getCurrentLang = () => {
  return localStorage.getItem('dealzy_lang') || 'zh'
}

// 设置语言
export const setLang = (lang) => {
  localStorage.setItem('dealzy_lang', lang)
  window.location.reload()
}

// 获取翻译
export const t = (key, lang = getCurrentLang()) => {
  return translations[lang]?.[key] || translations.zh[key] || key
}

// 获取当前语言配置
export const getCurrentLangConfig = () => {
  const lang = getCurrentLang()
  return {
    code: lang,
    ...languages[lang]
  }
}
