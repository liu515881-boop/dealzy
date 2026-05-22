/**
 * 房源 - 销售分配脚本
 * 根据区域和语言偏好自动分配销售顾问
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取数据
const propertiesPath = path.join(__dirname, '../data/properties.json');
const salesPath = path.join(__dirname, '../data/sales-team.json');

const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
const salesData = JSON.parse(fs.readFileSync(salesPath, 'utf-8'));

// 轮询计数器（存储在文件中）
const counterPath = path.join(__dirname, '../data/sales-assignment-counter.json');
let counter = { current: 0 };
if (fs.existsSync(counterPath)) {
  counter = JSON.parse(fs.readFileSync(counterPath, 'utf-8'));
}

/**
 * 根据规则分配销售
 */
function assignSales(property) {
  const { assignmentRules } = salesData;
  const activeSales = salesData.team.filter(s => s.active);
  
  // 1. 优先按区域分配
  if (assignmentRules.byArea[property.area]) {
    const areaSalesIds = assignmentRules.byArea[property.area];
    const areaSales = activeSales.filter(s => areaSalesIds.includes(s.id));
    
    if (areaSales.length > 0) {
      // 轮询选择
      const index = counter.current % areaSales.length;
      counter.current = (counter.current + 1) % areaSales.length;
      return areaSales[index];
    }
  }
  
  // 2. 默认轮询
  const index = counter.current % activeSales.length;
  counter.current = (counter.current + 1) % activeSales.length;
  return activeSales[index];
}

// 分配销售
console.log('🔄 开始分配销售顾问...\n');

let assigned = 0;
let updated = 0;

for (const property of properties) {
  if (!property.agentId) {
    const sales = assignSales(property);
    property.agentId = sales.id;
    property.agentName = sales.name;
    property.agentNameZh = sales.nameZh;
    property.agentPhone = sales.phone;
    property.agentWhatsapp = sales.whatsapp;
    property.agentEmail = sales.email;
    property.assignedAt = new Date().toISOString();
    updated++;
  }
  assigned++;
}

// 保存更新
fs.writeFileSync(propertiesPath, JSON.stringify(properties, null, 2));
fs.writeFileSync(counterPath, JSON.stringify(counter, null, 2));

console.log(`✅ 完成！`);
console.log(`   总房源：${assigned} 套`);
console.log(`   新分配：${updated} 套`);
console.log(`\n📊 销售分配统计:`);

// 统计每个销售的房源数
const salesCount = {};
for (const property of properties) {
  const agentId = property.agentId || 'unassigned';
  salesCount[agentId] = (salesCount[agentId] || 0) + 1;
}

for (const [agentId, count] of Object.entries(salesCount)) {
  const sales = salesData.team.find(s => s.id === agentId);
  const name = sales ? sales.name : agentId;
  console.log(`   ${name}: ${count} 套`);
}

console.log(`\n💾 已保存至：${propertiesPath}`);
