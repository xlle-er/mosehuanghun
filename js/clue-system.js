/* ============================================
   ClueSystem - 线索管理
   ============================================ */

class ClueSystem {
  constructor() {
    this.clues = {};
    this.combinations = [];
    this._notificationTimer = null;
    this._notificationRenderTimer = null;
    this._pendingNotifications = [];
    this._notificationSoundTimer = null;
    this._queuedNotificationSound = null;
  }

  // 初始化（加载数据）
  init(cluesData, combinationsData) {
    this.clues = cluesData || {};
    this.combinations = combinationsData || [];
    this.updateCounter();
  }

  // 收集线索
  collect(clueId) {
    const clue = this.clues[clueId];
    if (!clue) {
      console.warn(`[ClueSystem] Unknown clue: ${clueId}`);
      return false;
    }

    const isNew = gameState.addClue(clueId);
    if (isNew) {
      this._queueNotification(clue);
      this.updateCounter();
      this._queueNotificationSound(clue);

      // 延迟检查组合，避免同时弹出多个通知
      setTimeout(() => this._checkCombinations(clueId), 2000);
      return true;
    }
    return false;
  }

  // 批量收集
  collectAll(clueIds) {
    clueIds.forEach(id => this.collect(id));
  }

  // 获取线索详情
  getClue(clueId) {
    return this.clues[clueId];
  }

  // 获取所有已收集线索
  getCollected() {
    return gameState.get('collectedClues')
      .map(id => this.clues[id])
      .filter(Boolean);
  }

  // 按等级获取
  getByLevel(level) {
    return this.getCollected().filter(c => c.level === level);
  }

  // 按类别获取
  getByCategory(category) {
    return this.getCollected().filter(c => c.category === category);
  }

  // 更新计数器（不再显示）
  updateCounter() {
    // 已移除进度显示
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 同一批线索统一调度，但每条线索显示为独立提示框
  _queueNotification(clue) {
    this._pendingNotifications.push(clue);

    if (this._notificationRenderTimer) return;

    this._notificationRenderTimer = setTimeout(() => {
      const clues = this._pendingNotifications.slice();
      this._pendingNotifications = [];
      this._notificationRenderTimer = null;
      this._showNotifications(clues);
    }, 100);
  }

  // 显示通知
  _showNotifications(clues) {
    const container = document.getElementById('clue-notification');
    if (!container || clues.length === 0) return;

    // 清除上一个通知
    if (this._notificationTimer) {
      clearTimeout(this._notificationTimer);
    }

    container.innerHTML = clues.map(clue => {
      return `
        <div class="clue-toast">
          <div class="clue-notification-content">
            <div class="clue-icon">🔍</div>
            <div class="clue-info">
              <div class="clue-level">获得线索</div>
              <div class="clue-name">${this._escapeHtml(clue.name)}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.classList.remove('hidden');
    // 触发 reflow 后添加动画类
    container.offsetHeight;
    container.classList.add('show');

    this._notificationTimer = setTimeout(() => {
      container.classList.remove('show');
      setTimeout(() => {
        container.classList.add('hidden');
      }, 300);
    }, 3500);
  }

  // 同一批线索只播放一次提示音
  _queueNotificationSound(clue) {
    if (typeof audioManager === 'undefined') return;

    if (clue.level === 'core') {
      this._queuedNotificationSound = 'suspense-sting';
    } else if (!this._queuedNotificationSound) {
      this._queuedNotificationSound = 'clue-found';
    }

    if (this._notificationSoundTimer) return;

    this._notificationSoundTimer = setTimeout(() => {
      const sound = this._queuedNotificationSound || 'clue-found';
      this._notificationSoundTimer = null;
      this._queuedNotificationSound = null;
      audioManager.play(sound);
    }, 100);
  }

  // 检查线索组合
  _checkCombinations(newClueId) {
    const collected = gameState.get('collectedClues');

    for (const combo of this.combinations) {
      if (
        combo.requires.includes(newClueId) &&
        combo.requires.every(id => collected.includes(id)) &&
        !collected.includes(combo.result)
      ) {
        // 发现新组合
        this._showCombinationDiscovery(combo);
        setTimeout(() => this.collect(combo.result), 1500);
      }
    }
  }

  // 显示组合发现提示
  _showCombinationDiscovery(combo) {
    const container = document.getElementById('clue-notification');
    if (!container) return;

    container.innerHTML = `
      <div class="clue-toast">
        <div class="clue-notification-content">
          <div class="clue-icon">🔗</div>
          <div class="clue-info">
            <div class="clue-level" style="color: var(--color-highlight)">线索组合</div>
            <div class="clue-name">将已有线索关联起来...</div>
          </div>
        </div>
      </div>
    `;

    container.classList.remove('hidden');
    container.offsetHeight;
    container.classList.add('show');

    setTimeout(() => {
      container.classList.remove('show');
    }, 1500);
  }
}

// 全局实例
const clueSystem = new ClueSystem();
