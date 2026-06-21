/* ============================================
   Router - Hash 路由管理
   ============================================ */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = '';
    this.beforeHooks = [];
    this.afterHooks = [];

    window.addEventListener('hashchange', () => this._handle());
    window.addEventListener('load', () => this._handle());
  }

  // 注册路由
  register(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  // 注册多个路由
  registerAll(routeMap) {
    Object.entries(routeMap).forEach(([path, handler]) => {
      this.routes.set(path, handler);
    });
    return this;
  }

  // 导航
  navigate(path) {
    if (path === this.currentRoute) return;
    window.location.hash = path;
  }

  // 获取当前路由
  getCurrent() {
    return this.currentRoute;
  }

  // 前置守卫
  beforeEach(hook) {
    this.beforeHooks.push(hook);
    return this;
  }

  // 后置钩子
  afterEach(hook) {
    this.afterHooks.push(hook);
    return this;
  }

  // 内部：处理路由
  async _handle() {
    const hash = window.location.hash.slice(1) || '/intro';
    const from = this.currentRoute;

    // 执行前置守卫
    for (const hook of this.beforeHooks) {
      const result = await hook(hash, from);
      if (result === false) {
        // 恢复原路由
        if (from) window.location.hash = from;
        return;
      }
    }

    const handler = this.routes.get(hash);
    if (handler) {
      this.currentRoute = hash;
      try {
        await handler();
      } catch (err) {
        console.error(`[Router] Error in route "${hash}":`, err);
      }
    } else {
      console.warn(`[Router] Route not found: ${hash}, redirecting to /intro`);
      this.navigate('/intro');
      return;
    }

    // 执行后置钩子
    for (const hook of this.afterHooks) {
      await hook(hash, from);
    }
  }
}

// 全局实例
const router = new Router();
