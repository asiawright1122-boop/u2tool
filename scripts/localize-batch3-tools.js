const fs = require('fs');

// 需要本地化的工具翻译
const zhTranslations = {
  "calorie-calculator": {
    "name": "卡路里计算器",
    "description": "根据年龄、体重、身高和活动水平计算每日卡路里需求。",
    "seo_title": "免费在线卡路里计算器 - 每日热量需求",
    "seo_description": "免费在线计算每日卡路里需求。基于 Mifflin-St Jeor 公式，结合活动水平调整。",
    "age": "年龄",
    "weight": "体重",
    "height": "身高",
    "gender": "性别",
    "male": "男性",
    "female": "女性",
    "activityLevel": "活动水平",
    "sedentary": "久坐（很少或不运动）",
    "light": "轻度（每周运动1-3天）",
    "moderate": "中度（每周运动3-5天）",
    "active": "活跃（每周运动6-7天）",
    "veryActive": "非常活跃（每天高强度运动）",
    "bmr": "基础代谢率 (BMR)",
    "tdee": "每日总能量消耗",
    "maintain": "维持体重",
    "mildLoss": "轻度减重",
    "weightLoss": "减重",
    "extremeLoss": "快速减重",
    "mildGain": "轻度增重",
    "weightGain": "增重",
    "caloriesPerDay": "卡路里/天",
    "detailed_description": "卡路里计算器使用 Mifflin-St Jeor 公式帮助您确定每日卡路里需求。",
    "usage_steps": ["输入您的年龄", "输入体重和身高", "选择性别", "选择活动水平", "查看 BMR 和 TDEE"],
    "usage_examples": ["计算减重所需卡路里", "确定维持体重的热量", "规划增肌热量摄入"]
  }
};

console.log('Script created. Run with translations data.');
