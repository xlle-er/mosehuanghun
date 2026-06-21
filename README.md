# 墨色黄昏 - 在线解密游戏

一款本格推理网页解密游戏。调查陈墨白的死亡真相，收集线索，推理破案。

![游戏截图](assets/images/scene-study.jpg)

## 🎮 游戏简介

《墨色黄昏》是一款沉浸式网页解密游戏，玩家将扮演侦探，调查企业家陈墨白在别墅书房中离奇死亡的案件。通过探索不同场景、收集线索、与嫌疑人对话，最终推理出案件真相。

## ✨ 游戏特色

- **本格推理**：严谨的推理逻辑，多条线索相互印证
- **沉浸式体验**：丰富的场景描述、音效和背景音乐
- **多场景探索**：书房、客厅、画廊、图书馆等多个可探索区域
- **物品互动**：与环境中的物品进行深度互动，发现隐藏线索
- **笔记本系统**：自动记录收集到的线索，方便推理分析
- **嫌疑人对话**：与多位嫌疑人对话，获取关键信息
- **多结局设计**：根据推理结果，有不同的结局走向

## 🕹️ 游戏玩法

### 基本操作
- **点击探索**：点击场景中的物品进行互动
- **移动导航**：通过场景连接点移动到其他区域
- **查看地图**：点击右上角地图按钮查看整体布局
- **打开笔记本**：点击右下角笔记本按钮查看已收集线索

### 游戏目标
1. 探索所有场景，收集足够线索
2. 与嫌疑人对话，获取关键信息
3. 分析线索，推理出案件真相
4. 揭露真凶，完成案件破解

## 🛠️ 技术栈

- **前端**：纯HTML5 + CSS3 + JavaScript（无框架依赖）
- **音效**：Web Audio API
- **样式**：CSS变量、Flexbox、Grid布局
- **动画**：CSS动画与过渡效果

## 📁 项目结构

```
mosehuanghun/
├── index.html          # 游戏入口
├── css/
│   ├── variables.css   # CSS变量定义
│   ├── main.css        # 主样式
│   ├── components.css  # 组件样式
│   ├── scenes.css      # 场景样式
│   └── animations.css  # 动画效果
├── js/
│   ├── app.js          # 应用主逻辑
│   ├── state.js        # 游戏状态管理
│   ├── scene-manager.js # 场景管理
│   ├── dialogue-system.js # 对话系统
│   ├── clue-system.js  # 线索系统
│   ├── notebook.js     # 笔记本功能
│   ├── audio.js        # 音频管理
│   ├── router.js       # 路由控制
│   ├── reasoning.js    # 推理系统
│   └── utils.js        # 工具函数
├── data/
│   ├── scenes.js       # 场景数据
│   ├── dialogues.js    # 对话数据
│   └── clues.js        # 线索数据
├── assets/
│   ├── images/         # 游戏图片资源
│   ├── audio/          # 音效文件
│   └── fonts/          # 字体文件
└── README.md
```

## 🚀 本地运行

由于是纯静态项目，无需安装依赖，直接打开即可：

### 方法一：直接打开
```bash
# 在浏览器中打开index.html
open index.html
# 或
start index.html  # Windows
```

### 方法二：使用本地服务器（推荐）
```bash
# 使用Python内置服务器
python -m http.server 8000

# 或使用Node.js（需安装）
npx serve .

# 或使用PHP
php -S localhost:8000
```

然后在浏览器中访问：`http://localhost:8000`

## 🎨 游戏场景

| 场景 | 描述 |
|------|------|
| 📚 书房 | 犯罪现场，陈墨白的死亡地点 |
| 🛋️ 客厅 | 别墅的主要社交区域 |
| 🖼️ 画廊 | 展示珍贵艺术品的走廊 |
| 📜 图书馆 | 收藏大量古籍的房间 |
| 🌿 花园 | 别墅后方的庭院 |
| 🏠 底层储藏室 | 存放杂物的地下室 |

## 👥 角色介绍

- **陈墨白** - 死者，著名企业家和收藏家
- **方志远** - 商业合伙人
- **林婉清** - 陈墨白的妹妹
- **赵文博** - 陈墨白的助手
- **高志明** - 陈墨白的学生
- **周明轩** - 陈墨白的邻居
- **许晴** - 别墅管家
- **钱浩然** - 医生朋友
- **马丽华** - 陈墨白的前妻
- **陈雪** - 陈墨白的女儿

## 📝 开发说明

### 添加新场景
在 `data/scenes.js` 中添加场景数据：

```javascript
'scene-id': {
  id: 'scene-id',
  name: '场景名称',
  description: '场景描述',
  background: '背景图片.jpg',
  connections: [/* 连接的场景 */],
  suspects: [/* 场景中的嫌疑人 */],
  items: [/* 可交互物品 */]
}
```

### 添加新线索
在 `data/clues.js` 中添加线索数据：

```javascript
'clue-id': {
  id: 'clue-id',
  name: '线索名称',
  description: '线索描述',
  category: '类型',
  importance: '重要性'
}
```

### 添加新对话
在 `data/dialogues.js` 中添加对话数据。

## 🔧 自定义配置

### 音频配置
编辑 `data/scenes.js` 中的 `ambience` 字段设置场景背景音：

```javascript
ambience: 'rain-ambient'  // 雨声背景
```

### 动画效果
在 `css/animations.css` 中自定义动画效果。

## 📄 许可证

MIT License

## 🙏 致谢

- 感谢所有参与游戏测试和反馈的朋友
- 字体：思源宋体 (Noto Serif SC)、思源黑体 (Noto Sans SC)
- 音效素材来源：[列出音效来源]

---

**作者**: Xiaolele_er  
**制作时间**: 2026年6月  
**游戏类型**: 本格推理解密游戏
