/**
 * Dealzy AI 客服后端
 * 功能：知识库问答、房源查询、销售后台
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 加载知识库
let knowledgeBase = {};
try {
  const kbPath = path.join(__dirname, 'knowledge-base.json');
  knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
  console.log('✅ 知识库加载成功');
} catch (e) {
  console.error('❌ 知识库加载失败:', e.message);
}

// 模拟房源数据（后续替换为数据库）
let properties = [];
try {
  const dataPath = path.join(__dirname, '../data/properties.json');
  if (fs.existsSync(dataPath)) {
    properties = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`✅ 加载 ${properties.length} 套房源`);
  }
} catch (e) {
  console.log('⚠️ 房源数据未找到，使用空数据');
}

// 模拟成交数据
let deals = [];

/**
 * AI 智能回复
 */
app.post('/api/chat', async (req, res) => {
  const { message, context = {} } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: '消息不能为空' });
  }
  
  const response = await generateAIResponse(message, context);
  res.json(response);
});

/**
 * 获取房源列表
 */
app.get('/api/properties', (req, res) => {
  const { area, type, minPrice, maxPrice, bedrooms } = req.query;
  
  let filtered = [...properties];
  
  if (area) {
    filtered = filtered.filter(p => p.area.includes(area));
  }
  if (type) {
    filtered = filtered.filter(p => p.type === type);
  }
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
  }
  if (bedrooms) {
    filtered = filtered.filter(p => p.bedrooms === parseInt(bedrooms));
  }
  
  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

/**
 * 获取单个房源详情
 */
app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === parseInt(req.params.id));
  
  if (!property) {
    return res.status(404).json({ error: '房源不存在' });
  }
  
  res.json({ success: true, data: property });
});

/**
 * 销售后台 - 获取成交列表
 */
app.get('/api/admin/deals', (req, res) => {
  res.json({
    success: true,
    data: deals
  });
});

/**
 * 销售后台 - 标记成交
 */
app.post('/api/admin/deals', (req, res) => {
  const { propertyId, customerName, customerPhone, dealAmount, notes } = req.body;
  
  const deal = {
    id: deals.length + 1,
    propertyId,
    customerName,
    customerPhone,
    dealAmount,
    status: 'pending', // pending, completed, cancelled
    createdAt: new Date().toISOString(),
    notes
  };
  
  deals.push(deal);
  
  // TODO: 触发通知（短信/邮件/WhatsApp）
  console.log(`🎉 新成交！${customerName} - ${propertyId} - ${dealAmount} AED`);
  
  res.json({
    success: true,
    message: '成交已记录',
    data: deal
  });
});

/**
 * 销售后台 - 更新成交状态
 */
app.patch('/api/admin/deals/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const deal = deals.find(d => d.id === parseInt(id));
  if (!deal) {
    return res.status(404).json({ error: '成交记录不存在' });
  }
  
  deal.status = status;
  deal.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: '状态已更新',
    data: deal
  });
});

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * AI 回复生成逻辑
 */
async function generateAIResponse(message, context) {
  const lowerMessage = message.toLowerCase();
  
  // 匹配知识库问题
  for (const category of Object.values(knowledgeBase.categories)) {
    for (const qa of category.questions) {
      if (isMatch(message, qa.q)) {
        return {
          success: true,
          type: 'answer',
          message: qa.a,
          category: category.name
        };
      }
    }
  }
  
  // 匹配房源查询意图
  if (lowerMessage.includes('rent') || lowerMessage.includes('租') || lowerMessage.includes('出租')) {
    const area = extractArea(message);
    const response = area 
      ? `📍 ${area} 目前有 ${countPropertiesByArea(area)} 套房源在租。\n\n您想看什么户型？Studio/1BHK/2BHK？预算多少？`
      : `🏠 迪拜目前有 ${properties.filter(p => p.type === 'rent').length} 套房源在租。\n\n您想找哪个区域？DSO/JVC/International City？`;
    
    return {
      success: true,
      type: 'property_search',
      message: response,
      suggestions: ['DSO', 'JVC', 'International City']
    };
  }
  
  if (lowerMessage.includes('buy') || lowerMessage.includes('买') || lowerMessage.includes('出售')) {
    const response = `💰 迪拜目前有 ${properties.filter(p => p.type === 'sale').length} 套房源在售。\n\n您是投资还是自住？预算多少？`;
    
    return {
      success: true,
      type: 'property_search',
      message: response,
      suggestions: ['投资', '自住', '50 万以下', '100 万以上']
    };
  }
  
  // 匹配看房请求
  if (lowerMessage.includes('view') || lowerMessage.includes('看房') || lowerMessage.includes('visit')) {
    return {
      success: true,
      type: 'handoff',
      message: '好的！我帮您安排看房。📅\n\n请告诉我：\n1. 您想看哪套房子？\n2. 什么时间方便？\n3. 您的联系电话？\n\n我们的顾问会立刻联系您确认！'
    };
  }
  
  // 匹配价格咨询
  if (lowerMessage.includes('price') || lowerMessage.includes('价格') || lowerMessage.includes('多少钱')) {
    return {
      success: true,
      type: 'answer',
      message: '📊 迪拜当前租金参考：\n\n• DSO Studio: 4.5-6 万 AED/年\n• DSO 1BHK: 6-8 万 AED/年\n• JVC 1BHK: 7-9 万 AED/年\n• JVC 2BHK: 10-14 万 AED/年\n• IC Studio: 3-4 万 AED/年\n\n具体价格看房源位置、装修、楼层等。您想了解哪个区域？'
    };
  }
  
  // 默认回复
  return {
    success: true,
    type: 'unknown',
    message: knowledgeBase.fallback.unknown,
    suggestions: ['租房', '买房', '看房', '价格咨询']
  };
}

/**
 * 简单的意图匹配
 */
function isMatch(userMessage, question) {
  const userWords = userMessage.toLowerCase().split(/[\s,?.!]+/).filter(w => w.length > 2);
  const questionWords = question.toLowerCase().split(/[\s,?.!]+/).filter(w => w.length > 2);
  
  const matches = userWords.filter(w => questionWords.some(qw => qw.includes(w) || w.includes(qw)));
  return matches.length >= 2 || questionWords.some(qw => userMessage.toLowerCase().includes(qw));
}

/**
 * 提取区域名
 */
function extractArea(message) {
  const areas = ['DSO', 'JVC', 'International City', 'Dubai Silicon Oasis', 'Jumeirah Village Circle'];
  for (const area of areas) {
    if (message.toLowerCase().includes(area.toLowerCase())) {
      return area;
    }
  }
  return null;
}

/**
 * 统计区域房源数量
 */
function countPropertiesByArea(area) {
  return properties.filter(p => p.area.toLowerCase().includes(area.toLowerCase())).length;
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Dealzy API 服务启动：http://localhost:${PORT}`);
  console.log(`📍 健康检查：http://localhost:${PORT}/api/health`);
});
