/**
 * Bayut 房源爬虫 v2.0
 * 爬取迪拜 DSO/JVC/International City 区域房源
 * 功能：自动爬取 + 数据清洗 + 去重 + 导出
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== 配置 ====================

const CONFIG = {
  // 目标区域（Bayut URL slug）
  areas: [
    { slug: 'dubai-silicon-oasis', name: 'DSO', nameZh: '迪拜硅谷' },
    { slug: 'jumeirah-village-circle-jvc', name: 'JVC', nameZh: '朱美拉村庄' },
    { slug: 'international-city', name: 'International City', nameZh: '国际城' }
  ],
  
  // 房源类型
  types: [
    { slug: 'for-rent', name: 'rent', nameZh: '出租' },
    { slug: 'for-sale', name: 'sale', nameZh: '出售' }
  ],
  
  // 爬虫配置
  baseUrl: 'https://www.bayut.com',
  delay: 3000, // 请求间隔（毫秒）
  maxPages: 10, // 每个区域爬取页数
  timeout: 15000, // 请求超时
  
  // 输出路径
  outputPath: path.join(__dirname, '../data/bayut-properties.json'),
  logPath: path.join(__dirname, '../data/crawler-log.json')
};

// 模拟浏览器 headers
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
};

// ==================== 工具函数 ====================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractPrice(text) {
  if (!text) return 0;
  // 匹配 AED 价格
  const match = text.match(/AED\s*([\d,]+)/i) || text.match(/([\d,]+)/);
  if (!match) return 0;
  return parseInt(match[1].replace(/,/g, ''));
}

function extractBedrooms(text) {
  if (!text) return 0;
  if (text.toLowerCase().includes('studio')) return 0;
  const match = text.match(/(\d+)\s*(?:bed|bhk|bedroom)/i);
  return match ? parseInt(match[1]) : 0;
}

function extractSize(text) {
  if (!text) return 0;
  const match = text.match(/(\d+(?:,\d+)*)\s*(?:sqft|sq\.ft|sq\.?ft\.?)/i);
  if (!match) return 0;
  return parseInt(match[1].replace(/,/g, ''));
}

function generatePropertyId(property) {
  // 生成唯一 ID：区域 - 类型 - 价格 - 卧室 - 时间戳
  const hash = `${property.area}-${property.type}-${property.price}-${property.bedrooms}`;
  return Buffer.from(hash).toString('base64').substring(0, 16);
}

// ==================== 爬虫核心 ====================

async function scrapePage(area, type, page) {
  const url = `${CONFIG.baseUrl}/${type.slug}/property/${area.slug}/?page=${page}`;
  
  try {
    console.log(`🕷️  [${area.name}] 第 ${page} 页：${url}`);
    
    const response = await axios.get(url, {
      headers: HEADERS,
      timeout: CONFIG.timeout,
      maxRedirects: 3
    });
    
    if (response.status !== 200) {
      console.error(`❌ HTTP ${response.status}`);
      return [];
    }
    
    const $ = cheerio.load(response.data);
    const properties = [];
    
    // 查找房源卡片（多种选择器，提高鲁棒性）
    const selectors = [
      '[data-testid="property-card"]',
      '.PropertyCard__Wrapper',
      '[class*="property-card"]',
      '[class*="PropertyCard"]',
      'article[class*="card"]'
    ];
    
    let propertyElements = [];
    for (const selector of selectors) {
      propertyElements = $(selector);
      if (propertyElements.length > 0) break;
    }
    
    if (propertyElements.length === 0) {
      console.log(`⚠️  未找到房源卡片，尝试其他选择器...`);
      // 尝试查找所有链接
      $('a[href*="/property/"]').each((i, elem) => {
        if (i < 20) { // 限制数量
          propertyElements.push(elem);
        }
      });
    }
    
    console.log(`📦 找到 ${propertyElements.length} 个房源元素`);
    
    propertyElements.each((i, elem) => {
      try {
        const $elem = $(elem);
        
        // 提取标题
        let title = $elem.find('[data-testid="property-title"]').text().trim();
        if (!title) title = $elem.find('h3').text().trim() || $elem.find('[class*="title"]').text().trim();
        
        // 提取价格
        let priceText = $elem.find('[data-testid="property-price"]').text();
        if (!priceText) priceText = $elem.find('[class*="price"]').text();
        const price = extractPrice(priceText);
        
        // 提取卧室
        let text = $elem.text();
        const bedrooms = extractBedrooms(text);
        
        // 提取面积
        const size = extractSize(text);
        
        // 提取图片
        let image = $elem.find('img').attr('src') || $elem.find('img').attr('data-src') || '';
        if (image && !image.startsWith('http')) {
          image = CONFIG.baseUrl + image;
        }
        
        // 提取链接
        let link = $elem.find('a').attr('href');
        if (link && !link.startsWith('http')) {
          link = CONFIG.baseUrl + link;
        }
        
        // 提取位置
        let location = $elem.find('[data-testid="property-location"]').text().trim();
        if (!location) location = $elem.find('[class*="location"]').text().trim();
        
        // 提取电话
        let phone = $elem.find('[data-testid="phone-number"]').text().trim();
        if (!phone) phone = '';
        
        // 构建房源对象
        const property = {
          id: '', // 稍后生成
          title: title || '未命名房源',
          area: area.slug,
          areaName: area.name,
          areaNameZh: area.nameZh,
          type: type.name,
          typeName: type.nameZh,
          price: price,
          priceFormatted: price > 0 ? `AED ${price.toLocaleString()}` : '面议',
          bedrooms: bedrooms,
          bedroomLabel: bedrooms === 0 ? 'Studio' : `${bedrooms} Bedroom${bedrooms > 1 ? 's' : ''}`,
          size: size,
          sizeFormatted: size > 0 ? `${size.toLocaleString()} sqft` : '未知',
          location: location,
          phone: phone,
          image: image,
          url: link || '',
          agent: '', // 待填充
          furnished: text.toLowerCase().includes('furnished'),
          crawledAt: new Date().toISOString(),
          source: 'bayut'
        };
        
        // 数据验证
        if (property.title && property.price > 0) {
          property.id = generatePropertyId(property);
          properties.push(property);
        }
        
      } catch (e) {
        console.error(`  ⚠️  解析房源 #${i} 失败：${e.message}`);
      }
    });
    
    console.log(`✅ 成功解析 ${properties.length} 套房源\n`);
    return properties;
    
  } catch (error) {
    console.error(`❌ 爬取失败：${error.message}`);
    if (error.response) {
      console.error(`   HTTP ${error.response.status}`);
    }
    return [];
  }
}

async function loadExistingProperties() {
  try {
    if (fs.existsSync(CONFIG.outputPath)) {
      const data = fs.readFileSync(CONFIG.outputPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('读取现有数据失败:', e.message);
  }
  return [];
}

function deduplicateProperties(newProps, existingProps) {
  const existingIds = new Set(existingProps.map(p => p.id));
  const unique = [];
  let duplicates = 0;
  
  for (const prop of newProps) {
    if (!existingIds.has(prop.id)) {
      unique.push(prop);
      existingIds.add(prop.id);
    } else {
      duplicates++;
    }
  }
  
  console.log(`📊 新增 ${unique.length} 套，重复 ${duplicates} 套`);
  return unique;
}

// ==================== 主函数 ====================

async function main() {
  console.log('='.repeat(60));
  console.log('🚀 Bayut 房源爬虫 v2.0');
  console.log('📍 区域：DSO, JVC, International City');
  console.log(' 时间:', new Date().toLocaleString('zh-CN'));
  console.log('='.repeat(60));
  console.log();
  
  const startTime = Date.now();
  
  // 加载现有数据
  const existingProperties = await loadExistingProperties();
  console.log(`📁 现有房源：${existingProperties.length} 套\n`);
  
  const allNewProperties = [];
  const stats = {
    areas: {},
    types: {},
    totalPages: 0,
    totalProperties: 0,
    errors: 0
  };
  
  // 爬取所有区域和类型
  for (const area of CONFIG.areas) {
    stats.areas[area.slug] = 0;
    
    for (const type of CONFIG.types) {
      stats.types[type.slug] = 0;
      
      console.log(`\n${'='.repeat(40)}`);
      console.log(`📍 区域：${area.nameZh} (${area.name})`);
      console.log(`️  类型：${type.nameZh} (${type.name})`);
      console.log('='.repeat(40));
      
      for (let page = 1; page <= CONFIG.maxPages; page++) {
        stats.totalPages++;
        
        const properties = await scrapePage(area, type, page);
        
        for (const prop of properties) {
          prop.area = area.slug;
          prop.areaName = area.name;
          prop.areaNameZh = area.nameZh;
          prop.type = type.name;
          prop.typeName = type.nameZh;
        }
        
        allNewProperties.push(...properties);
        stats.areas[area.slug] += properties.length;
        stats.types[type.slug] += properties.length;
        
        // 延迟，避免被封
        if (page < CONFIG.maxPages) {
          await sleep(CONFIG.delay);
        }
      }
      
      // 区域间延迟
      await sleep(CONFIG.delay * 2);
    }
  }
  
  // 去重
  console.log('\n' + '='.repeat(60));
  console.log('🔄 数据去重...');
  const uniqueProperties = deduplicateProperties(allNewProperties, existingProperties);
  
  // 合并数据
  const allProperties = [...existingProperties, ...uniqueProperties];
  
  // 保存结果
  const outputDir = path.dirname(CONFIG.outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(CONFIG.outputPath, JSON.stringify(allProperties, null, 2));
  console.log(`💾 保存至：${CONFIG.outputPath}`);
  
  // 保存日志
  const log = {
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime,
    stats,
    newCount: uniqueProperties.length,
    totalCount: allProperties.length
  };
  
  const logPath = CONFIG.logPath.replace('.json', `-${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  
  // 输出统计
  console.log('\n' + '='.repeat(60));
  console.log('📊 爬取统计');
  console.log('='.repeat(60));
  console.log(`⏱️  耗时：${Math.round((Date.now() - startTime) / 1000)} 秒`);
  console.log(`📄 页数：${stats.totalPages} 页`);
  console.log(`🏠 新增：${uniqueProperties.length} 套`);
  console.log(` 总计：${allProperties.length} 套`);
  console.log();
  console.log('按区域统计:');
  for (const [area, count] of Object.entries(stats.areas)) {
    console.log(`  ${area}: ${count} 套`);
  }
  console.log();
  console.log('按类型统计:');
  for (const [type, count] of Object.entries(stats.types)) {
    console.log(`  ${type}: ${count} 套`);
  }
  console.log('='.repeat(60));
  console.log('✅ 完成！');
}

// 运行爬虫
main().catch(error => {
  console.error('\n 爬虫崩溃:', error);
  process.exit(1);
});
