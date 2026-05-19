/**
 * Bayut 房源爬虫
 * 爬取迪拜 DSO/JVC/International City 区域房源
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// 目标区域
const AREAS = [
  'dubai-silicon-oasis',
  'jumeirah-village-circle-jvc',
  'international-city'
];

// 房源类型
const TYPES = ['for-rent', 'for-sale'];

// 爬虫配置
const CONFIG = {
  baseUrl: 'https://www.bayut.com',
  delay: 2000, // 请求间隔（毫秒）
  maxPages: 5, // 每个区域爬取页数
  outputPath: './data/properties.json'
};

// 模拟浏览器 headers
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
};

/**
 * 爬取单个页面
 */
async function scrapePage(area, type, page) {
  const url = `${CONFIG.baseUrl}/${type}/property/${area}/?page=${page}`;
  
  try {
    console.log(`🕷️ 爬取：${url}`);
    
    const response = await axios.get(url, {
      headers: HEADERS,
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const properties = [];
    
    // 查找房源卡片（需要根据 Bayut 实际 HTML 结构调整）
    $('[data-testid="property-card"]').each((i, elem) => {
      try {
        const property = {
          title: $(elem).find('[data-testid="property-title"]').text().trim(),
          area: area,
          type: type === 'for-rent' ? 'rent' : 'sale',
          price: extractPrice($(elem).find('[data-testid="property-price"]').text()),
          bedrooms: extractBedrooms($(elem).text()),
          size: extractSize($(elem).text()),
          furnished: $(elem).text().includes('Furnished'),
          image: $(elem).find('img').attr('src') || '',
          url: CONFIG.baseUrl + $(elem).find('a').attr('href'),
          crawledAt: new Date().toISOString()
        };
        
        if (property.title && property.price) {
          properties.push(property);
        }
      } catch (e) {
        console.error('解析房源失败:', e.message);
      }
    });
    
    console.log(`✅ 找到 ${properties.length} 套房源`);
    return properties;
    
  } catch (error) {
    console.error(`❌ 爬取失败：${error.message}`);
    return [];
  }
}

/**
 * 提取价格
 */
function extractPrice(text) {
  const match = text.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, '')) : 0;
}

/**
 * 提取卧室数量
 */
function extractBedrooms(text) {
  const match = text.match(/(\d+)\s*bed|(\d+)\s*BHK|Studio/i);
  if (!match) return 0;
  if (text.toLowerCase().includes('studio')) return 0;
  return parseInt(match[1] || match[2] || '0');
}

/**
 * 提取面积
 */
function extractSize(text) {
  const match = text.match(/(\d+(?:,\d+)*)\s*sqft|(\d+(?:,\d+)*)\s*sq\.ft/i);
  if (!match) return 0;
  return parseInt((match[1] || match[2]).replace(/,/g, ''));
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始爬取 Bayut 房源...\n');
  
  const allProperties = [];
  
  for (const area of AREAS) {
    for (const type of TYPES) {
      console.log(`\n📍 区域：${area} | 类型：${type}`);
      
      for (let page = 1; page <= CONFIG.maxPages; page++) {
        const properties = await scrapePage(area, type, page);
        allProperties.push(...properties);
        
        // 延迟，避免被封
        if (page < CONFIG.maxPages) {
          await sleep(CONFIG.delay);
        }
      }
      
      // 区域间延迟
      await sleep(CONFIG.delay * 2);
    }
  }
  
  // 保存结果
  const outputDir = path.dirname(CONFIG.outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(CONFIG.outputPath, JSON.stringify(allProperties, null, 2));
  
  console.log(`\n✅ 完成！共爬取 ${allProperties.length} 套房源`);
  console.log(`📁 保存至：${CONFIG.outputPath}`);
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行爬虫
main().catch(console.error);
