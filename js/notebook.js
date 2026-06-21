/* ============================================
   Notebook - 笔记本系统
   ============================================ */

class Notebook {
  constructor() {
    this.isOpen = false;
    this.activeTab = 'all';
    this.panel = null;
    this._clueUnsubscribe = null;

    if (typeof gameState !== 'undefined') {
      this._clueUnsubscribe = gameState.on('clueAdded', () => this.refresh());
    }
  }

  _panelWidthCss() {
    return 'min(380px, 40vw)';
  }

  _sceneCenterCss() {
    return 'calc((100% - ' + this._panelWidthCss() + ') / 2)';
  }

  syncLayout() {
    if (!this.isOpen) return;

    var sceneCenter = this._sceneCenterCss();
    document.querySelectorAll('.scene-nav').forEach(function (nav) {
      nav.style.left = sceneCenter;
      nav.style.transition = 'left 0.35s ease';
    });
  }

  // 初始化（创建面板 DOM）
  init() {
    // 如果已存在则跳过
    if (this.panel) return;

    // 创建面板元素
    this.panel = document.createElement('div');
    this.panel.id = 'notebook-panel';
    this.panel.style.cssText = [
      'position: fixed',
      'top: 0',
      'right: 0',
      'width: 380px',
      'max-width: 40vw',
      'height: 100vh',
      'background: #1a1209',
      'border-left: 1px solid #8b7340',
      'z-index: 9999',
      'transform: translateX(100%)',
      'transition: transform 0.35s ease',
      'display: flex',
      'flex-direction: column',
      'box-shadow: -4px 0 20px rgba(0,0,0,0.5)',
      'overflow-y: auto',
      'font-family: serif',
      'color: #e8dcc8'
    ].join(';');

    document.body.appendChild(this.panel);
    console.log('[Notebook] panel created');
  }

  // 切换笔记本
  toggle() {
    console.log('[Notebook] toggle called, isOpen:', this.isOpen);
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // 打开笔记本
  open() {
    console.log('[Notebook] open() called, this.isOpen:', this.isOpen);
    if (this.isOpen) {
      console.log('[Notebook] open() early return - already open');
      return;
    }

    // 先设状态，再做其他
    this.isOpen = true;
    this.activeTab = 'all';

    // 确保面板已创建
    try {
      this.init();
    } catch (e) {
      console.error('[Notebook] init error:', e);
    }

    // 渲染内容
    try {
      this._render();
    } catch (e) {
      console.error('[Notebook] render error:', e);
      // 渲染失败也要显示面板
      if (this.panel) {
        this.panel.innerHTML = '<div style="padding:20px;color:#e8dcc8;">加载中...</div>';
      }
    }

    // 显示面板
    if (this.panel) {
      this.panel.style.transform = 'translateX(0)';
      console.log('[Notebook] panel shown');
    }

    var panelWidth = this._panelWidthCss();
    var sceneCenter = this._sceneCenterCss();

    // 场景压缩让出空间
    var scene = document.getElementById('scene-container');
    if (scene) {
      scene.style.width = 'calc(100% - ' + panelWidth + ')';
      scene.style.transition = 'width 0.35s ease';
    }

    // 右侧按钮左移
    var nb = document.getElementById('notebook-btn');
    if (nb) nb.style.right = 'calc(' + panelWidth + ' + 24px)';
    var header = document.getElementById('header');
    if (header) header.style.right = panelWidth;

    // 物品/线索面板左移
    var itemPanel = document.getElementById('item-panel');
    if (itemPanel) {
      itemPanel.style.left = sceneCenter;
      itemPanel.style.transition = 'left 0.35s ease';
    }

    // 对话框左移
    var dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox) {
      dialogueBox.style.right = panelWidth;
      dialogueBox.style.transition = 'right 0.35s ease';
    }

    // 底部场景导航保持在可视场景区域中央
    this.syncLayout();

    console.log('[Notebook] open() done, isOpen:', this.isOpen);
  }

  // 关闭笔记本
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    if (this.panel) {
      this.panel.style.transform = 'translateX(100%)';
    }

    var scene = document.getElementById('scene-container');
    if (scene) {
      scene.style.width = '100%';
    }

    // 恢复按钮位置
    var nb = document.getElementById('notebook-btn');
    if (nb) nb.style.right = '24px';
    var header = document.getElementById('header');
    if (header) header.style.right = '0';

    // 恢复物品面板位置
    var itemPanel = document.getElementById('item-panel');
    if (itemPanel) {
      itemPanel.style.left = '50%';
    }

    // 恢复对话框位置
    var dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox) {
      dialogueBox.style.right = '0';
    }

    document.querySelectorAll('.scene-nav').forEach(function (nav) {
      nav.style.left = '50%';
    });
  }

  // 刷新笔记本内容（线索变化时调用）
  refresh() {
    if (!this.isOpen) return;
    this._render();
  }

  // 切换标签
  switchTab(tab) {
    this.activeTab = tab;
    var list = document.getElementById('notebook-clues-list');
    if (list) list.innerHTML = this._renderCluesList();
    document.querySelectorAll('.notebook-tab').forEach(function (el) {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
  }

  // 判断是否为重要线索
  _isImportant(level) {
    return level === 'core' || level === 'important';
  }

  // 渲染
  _render() {
    if (!this.panel) return;

    var collected = gameState.get('collectedClues');
    var all = collected.map(function (id) { return clueSystem.clues[id]; }).filter(Boolean);
    var self = this;
    var importantCount = all.filter(function (c) { return self._isImportant(c.level); }).length;
    var otherCount = all.length - importantCount;

    this.panel.innerHTML = [
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:20px;border-bottom:1px solid #8b7340;">',
      '  <h2 style="font-size:20px;color:#c9a96e;margin:0;">📓 线索笔记本</h2>',
      '  <button onclick="notebook.close()" style="background:#2c1f12 !important;border:1px solid #8b7340 !important;color:#e8dcc8 !important;width:32px !important;height:32px !important;border-radius:50% !important;cursor:pointer !important;font-size:16px !important;padding:0 !important;display:flex !important;align-items:center !important;justify-content:center !important;">✕</button>',
      '</div>',
      '<div style="display:flex;border-bottom:1px solid #8b7340;">',
      '  <button class="notebook-tab ' + (this.activeTab === 'all' ? 'active' : '') + '" data-tab="all" onclick="notebook.switchTab(\'all\')" style="flex:1;padding:8px;font-size:12px;text-align:center;border:none;border-bottom:2px solid transparent;background:transparent;color:' + (this.activeTab === 'all' ? '#c9a96e' : '#6b5c47') + ';cursor:pointer;' + (this.activeTab === 'all' ? 'border-bottom-color:#c9a96e;background:#2c1f12;' : '') + '">全部 (' + all.length + ')</button>',
      '  <button class="notebook-tab ' + (this.activeTab === 'important' ? 'active' : '') + '" data-tab="important" onclick="notebook.switchTab(\'important\')" style="flex:1;padding:8px;font-size:12px;text-align:center;border:none;border-bottom:2px solid transparent;background:transparent;color:' + (this.activeTab === 'important' ? '#c9a96e' : '#6b5c47') + ';cursor:pointer;' + (this.activeTab === 'important' ? 'border-bottom-color:#c9a96e;background:#2c1f12;' : '') + '">重要 (' + importantCount + ')</button>',
      '  <button class="notebook-tab ' + (this.activeTab === 'other' ? 'active' : '') + '" data-tab="other" onclick="notebook.switchTab(\'other\')" style="flex:1;padding:8px;font-size:12px;text-align:center;border:none;border-bottom:2px solid transparent;background:transparent;color:' + (this.activeTab === 'other' ? '#c9a96e' : '#6b5c47') + ';cursor:pointer;' + (this.activeTab === 'other' ? 'border-bottom-color:#c9a96e;background:#2c1f12;' : '') + '">其他 (' + otherCount + ')</button>',
      '</div>',
      '<div style="flex:1;overflow-y:auto;padding:12px;" id="notebook-clues-list">',
      this._renderCluesList(),
      '</div>'
    ].join('\n');
  }

  // 渲染线索列表
  _renderCluesList() {
    var collected = gameState.get('collectedClues');
    var self = this;
    var clues = collected.map(function (id) { return clueSystem.clues[id]; }).filter(Boolean);

    if (this.activeTab === 'important') {
      clues = clues.filter(function (c) { return self._isImportant(c.level); });
    } else if (this.activeTab === 'other') {
      clues = clues.filter(function (c) { return !self._isImportant(c.level); });
    }

    if (clues.length === 0) {
      return '<div style="text-align:center;color:#6b5c47;padding:40px 0;">' +
        (this.activeTab === 'all' ? '尚未收集到任何线索' : '该类别暂无线索') +
        '</div>';
    }

    return clues.map(function (clue) {
      var isImp = self._isImportant(clue.level);
      var badgeColor = isImp ? 'rgba(255,215,0,0.15)' : 'rgba(128,128,128,0.1)';
      var badgeBorder = isImp ? 'rgba(255,215,0,0.3)' : 'rgba(128,128,128,0.2)';
      var badgeText = isImp ? '#ffd700' : '#6b5c47';
      var badgeLabel = isImp ? '重要' : '其他';

      return '<div onclick="notebook.showDetail(\'' + clue.id + '\')" style="background:#231a0e;border:1px solid #8b7340;border-radius:8px;padding:12px;margin-bottom:8px;cursor:pointer;">' +
        '<div style="margin-bottom:4px;"><span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:999px;background:' + badgeColor + ';color:' + badgeText + ';border:1px solid ' + badgeBorder + ';">' + badgeLabel + '</span></div>' +
        '<div style="font-size:14px;color:#f5f0e8;margin-bottom:4px;">' + clue.name + '</div>' +
        '<div style="font-size:12px;color:#a08b6e;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + clue.description + '</div>' +
        '</div>';
    }).join('');
  }

  // 证词线索 → 角色ID映射
  _getTestimonyCharacter(clueId) {
    var map = {
      'A03': 'fang',
      'A04': 'gao',
      'A05': 'chen',
      'A06': 'zhao',
      'A07': 'qian',
      'A08': 'lin',
      'A09': 'zhou'
    };
    return map[clueId] || null;
  }

  _getDialogueTranscript(characterId, clue) {
    var dialogue = dialogueSystem.dialogues[characterId];
    if (!dialogue) return clue.detail || clue.description || '';

    var history = gameState.get('dialogueHistory') || {};
    var characterHistory = history[characterId];
    var visitedNodes = [];
    if (characterHistory && !Array.isArray(characterHistory)) {
      visitedNodes = Array.isArray(characterHistory.__visitedNodes)
        ? characterHistory.__visitedNodes
        : [];
    }

    var sections = [];
    if (dialogue.longText) {
      sections.push('【人物背景】\n' + dialogue.longText);
    }

    visitedNodes.forEach(function (nodeId) {
      var node = dialogue.nodes && dialogue.nodes[nodeId];
      if (!node) return;

      var block = ['【已对话记录】', node.text];
      var selected = characterHistory && !Array.isArray(characterHistory) && Array.isArray(characterHistory[nodeId])
        ? characterHistory[nodeId]
        : [];

      selected.forEach(function (optionIndex) {
        var option = node.options && node.options[optionIndex];
        if (!option) return;
        block.push('你问：' + option.text);
      });

      sections.push(block.join('\n'));
    });

    if (sections.length === 0) {
      sections.push(clue.detail || clue.description || '尚未展开完整问话。');
    }

    return sections.join('\n\n');
  }

  // 线索对应的图片映射
  _getClueImage(clueId) {
    var map = {
      'C01': 'item-letter.jpg',
      'C03': 'item-wolfsbane.jpg',
      'C04': 'item-recipe.jpg',
      'C06': 'item-ancient-book.jpg',
      'C17': 'item-diary.jpg',
      'I05': 'item-safe.jpg',
      'I13': 'item-medicine.jpg',
      'I15': 'item-ancient-book.jpg',
      'C16': 'item-safe.jpg',
      'I19': 'item-case-terminal.jpg',
      'I20': 'item-toxicology-bench.jpg',
      'I21': 'item-recheck-table.jpg',
      'I22': 'item-zhao-old-case.jpg',
      'I23': 'item-forgery-case.jpg',
      'A15': 'item-evidence-table.jpg',
      'A16': 'item-toxicology-bench.jpg',
      'B19': 'item-case-terminal.jpg',
      'B20': 'item-forensic-flow.jpg',
      'B21': 'item-archive-index.jpg',
      'B22': 'item-police-whiteboard.jpg'
    };
    return map[clueId] || null;
  }

  // 显示文本总结（证词用）
  _showTextDetail(clue, longText, charName, charRole, returnToPanel) {
    var panel = document.getElementById('item-panel');
    if (!panel) return;

    if (returnToPanel && typeof sceneManager !== 'undefined') {
      sceneManager.pushPanelState();
    }

    var isImp = this._isImportant(clue.level);
    var badge = isImp
      ? '<span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:999px;background:rgba(255,215,0,0.15);color:#ffd700;border:1px solid rgba(255,215,0,0.3);">重要</span>'
      : '<span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:999px;background:rgba(128,128,128,0.1);color:#6b5c47;border:1px solid rgba(128,128,128,0.2);">其他</span>';

    panel.innerHTML = [
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #8b7340;">',
      '  <h3 style="font-size:18px;color:#c9a96e;margin:0;">' + badge + ' ' + clue.name + '</h3>',
      '  <button onclick="sceneManager.closePanel()" style="background:#2c1f12 !important;border:1px solid #8b7340 !important;color:#e8dcc8 !important;width:32px !important;height:32px !important;border-radius:50% !important;cursor:pointer !important;font-size:16px !important;padding:0 !important;display:flex !important;align-items:center !important;justify-content:center !important;">✕</button>',
      '</div>',
      '<div style="padding:20px;overflow-y:auto;">',
      '  <div style="margin-bottom:12px;"><span style="color:#c9a96e;font-size:14px;">' + charName + '</span>',
      '  <span style="color:#6b5c47;font-size:12px;margin-left:8px;">' + (charRole || '') + '</span></div>',
      '  <div style="color:#e8dcc8;line-height:1.8;white-space:pre-wrap;">' + longText + '</div>',
      '</div>'
    ].join('\n');

    if (typeof sceneManager !== 'undefined') {
      sceneManager._showOverlay();
      sceneManager._setNavDisabled(true);
    }
    panel.classList.remove('hidden');
    panel.offsetHeight;
    panel.classList.add('show');
  }

  // 显示线索详情
  showDetail(clueId, returnToPanel) {
    var clue = clueSystem.getClue(clueId);
    if (!clue) return;

    // 证词线索：显示已实际对话过的全部记录
    var characterId = this._getTestimonyCharacter(clueId);
    if (characterId && typeof dialogueSystem !== 'undefined') {
      var dialogue = dialogueSystem.dialogues[characterId];
      if (dialogue) {
        var transcript = this._getDialogueTranscript(characterId, clue);
        this._showTextDetail(clue, transcript, dialogue.name, dialogue.role, returnToPanel);
        return;
      }
    }

    var panel = document.getElementById('item-panel');
    if (!panel) return;

    if (returnToPanel && typeof sceneManager !== 'undefined') {
      sceneManager.pushPanelState();
    }

    var imageFile = this._getClueImage(clueId);
    var imageHtml = imageFile
      ? '<img src="assets/images/' + imageFile + '" alt="' + clue.name + '" style="width:100%;max-height:300px;object-fit:contain;border-radius:8px;margin-bottom:12px;background:#231a0e;" onerror="this.style.display=\'none\'">'
      : '';

    var isImp = this._isImportant(clue.level);
    var badge = isImp
      ? '<span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:999px;background:rgba(255,215,0,0.15);color:#ffd700;border:1px solid rgba(255,215,0,0.3);">重要</span>'
      : '<span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:999px;background:rgba(128,128,128,0.1);color:#6b5c47;border:1px solid rgba(128,128,128,0.2);">其他</span>';

    panel.innerHTML = [
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #8b7340;">',
      '  <h3 style="font-size:18px;color:#c9a96e;margin:0;">' + badge + ' ' + clue.name + '</h3>',
      '  <button onclick="sceneManager.closePanel()" style="background:#2c1f12 !important;border:1px solid #8b7340 !important;color:#e8dcc8 !important;width:32px !important;height:32px !important;border-radius:50% !important;cursor:pointer !important;font-size:16px !important;padding:0 !important;display:flex !important;align-items:center !important;justify-content:center !important;">✕</button>',
      '</div>',
      '<div style="padding:20px;overflow-y:auto;">',
      imageHtml,
      '<div style="margin-bottom:12px;"><span style="color:#6b5c47;font-size:12px;">发现于: ' + (clue.location || '未知') + '</span></div>',
      '<div style="color:#e8dcc8;line-height:1.8;white-space:pre-wrap;">' + (clue.detail || clue.description) + '</div>',
      '</div>'
    ].join('\n');

    if (typeof sceneManager !== 'undefined') {
      sceneManager._showOverlay();
      sceneManager._setNavDisabled(true);
    }
    panel.classList.remove('hidden');
    panel.offsetHeight;
    panel.classList.add('show');
  }
}

// 全局实例
var notebook = new Notebook();

// 绑定按钮事件
(function () {
  function bind() {
    var btn = document.getElementById('notebook-btn');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        notebook.toggle();
      });
      console.log('[Notebook] button event bound');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
