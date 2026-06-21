/* ============================================
   Utils - 工具函数
   ============================================ */

const Utils = {
  // DOM 操作
  $(selector) {
    return document.querySelector(selector);
  },

  $$(selector) {
    return document.querySelectorAll(selector);
  },

  // 创建元素
  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'innerHTML') {
        el.innerHTML = value;
      } else if (key === 'textContent') {
        el.textContent = value;
      } else if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else {
        el.setAttribute(key, value);
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
    return el;
  },

  // 延迟
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 打字机效果
  async typewrite(element, text, speed = 50) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await this.delay(speed);
    }
  },

  // 格式化时间（秒 -> 分钟）
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}分钟`;
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hours}小时${remainMins}分钟`;
  },

  // 随机整数
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 洗牌
  shuffle(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  // 防抖
  debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  },

  // 节流
  throttle(fn, ms) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn(...args);
      }
    };
  },

  // 深拷贝（不可变）
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  // 安全解析 JSON
  safeParse(json, fallback) {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  },

  // 生成唯一 ID
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
};
