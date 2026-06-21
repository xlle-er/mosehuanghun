/* ============================================
   SceneManager - 场景管理器
   ============================================ */

class SceneManager {
  constructor() {
    this.scenes = {};
    this.current = null;
    this._clickCounts = {};
    this._resetUnsubscribe = null;
    this._sceneUnlockedUnsubscribe = null;
    this._panelHistory = [];
    this._sequenceSelections = {};
    this._matchSelections = {};
    this._inspectSelections = {};
  }

  // 初始化
  init(scenesData) {
    this.scenes = scenesData || {};
    if (!this._resetUnsubscribe && typeof gameState !== 'undefined') {
      this._resetUnsubscribe = gameState.on('reset', () => {
        this._clickCounts = {};
        this._sequenceSelections = {};
        this._matchSelections = {};
        this._inspectSelections = {};
      });
    }
    if (!this._sceneUnlockedUnsubscribe && typeof gameState !== 'undefined') {
      this._sceneUnlockedUnsubscribe = gameState.on('sceneUnlocked', (sceneId) => {
        if (!this.current) return;
        const hasNewConnection = (this.current.connections || [])
          .some(conn => conn.scene === sceneId);
        if (hasNewConnection) {
          this._render(this.current);
        }
      });
    }
  }

  // 加载场景
  load(sceneId) {
    const scene = this.scenes[sceneId];
    if (!scene) {
      console.error(`[SceneManager] Scene not found: ${sceneId}`);
      return;
    }

    // 检查解锁
    if (!gameState.isSceneUnlocked(sceneId)) {
      this._showLockedMessage(scene);
      return;
    }

    this.current = scene;
    gameState.visitScene(sceneId);
    this._render(scene);

    // 播放背景音效
    if (scene.ambience && typeof audioManager !== 'undefined') {
      audioManager.playAmbience(scene.ambience);
    }
  }

  // 渲染场景
  _render(scene) {
    const container = document.getElementById('scene-container');
    if (!container) return;

    const bgStyle = scene.background
      ? `background-image: url('assets/images/${scene.background}')`
      : `background: var(--color-bg-scene)`;

    // 物品网格
    const itemsHtml = (scene.items || []).map(item => {
      const discovered = this._isItemExplored(scene.id, item);
      const discoveredClass = discovered ? ' discovered' : '';
      const icon = item.icon || '🔍';
      return `
        <div class="scene-item${discoveredClass}"
             data-item-id="${item.id}"
             onclick="sceneManager.examineItem('${scene.id}', '${item.id}')">
          <div class="item-icon">${icon}</div>
          <div class="item-name">${item.name}</div>
          ${discovered ? '<div class="item-hint">已探索</div>' : ''}
        </div>
      `;
    }).join('');

    // 嫌疑人列表（客厅专用）
    const suspectsHtml = scene.suspects ? this._renderSuspects(scene.suspects) : '';

    // 导航按钮
    const navHtml = this._renderNav(scene);

    container.innerHTML = `
      <div class="scene scene-transition" style="${bgStyle}">
        <div class="scene-header">
          <button class="btn-back" onclick="sceneManager.goBack()">← 返回</button>
          <h2 class="scene-title">${scene.name}</h2>
        </div>
        <div class="scene-description">${scene.description}</div>
        ${suspectsHtml}
        ${itemsHtml ? `<div class="scene-items">${itemsHtml}</div>` : ''}
        ${navHtml}
      </div>
    `;

    if (typeof notebook !== 'undefined' && notebook.isOpen) {
      notebook.syncLayout();
    }

    // 雨天场景添加雨滴效果
    if (scene.rain) {
      this._addRainEffect(container.querySelector('.scene'));
      this._addLightningEffect(container.querySelector('.scene'));
    }
  }

  // 渲染嫌疑人列表
  _renderSuspects(suspects) {
    const html = suspects.map(s => {
      const portraitSrc = s.portrait ? `assets/images/${s.portrait}` : '';
      return `
        <div class="suspect-card" onclick="sceneManager.talkTo('${s.id}')">
          <img class="suspect-portrait" src="${portraitSrc}" alt="${s.name}"
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect fill=%22%232c1810%22 width=%2280%22 height=%2280%22/><text x=%2240%22 y=%2245%22 text-anchor=%22middle%22 fill=%22%23c9a96e%22 font-size=%2224%22>${s.name[0]}</text></svg>'">
          <div class="suspect-name">${s.name}</div>
          <div class="suspect-role">${s.role}</div>
        </div>
      `;
    }).join('');

    return `<div class="suspect-grid">${html}</div>`;
  }

  // 渲染导航按钮
  _renderNav(scene) {
    if (!scene.connections || scene.connections.length === 0) return '';

    const visibleConnections = scene.connections.filter(conn => {
      const target = this.scenes[conn.scene];
      return target && gameState.isSceneUnlocked(conn.scene);
    });

    if (visibleConnections.length === 0) return '';

    const buttons = visibleConnections.map(conn => {
      const target = this.scenes[conn.scene];
      return `
        <button class="scene-nav-btn"
                onclick="sceneManager.navigate('${conn.scene}')">
          <span class="nav-icon">${conn.icon || '→'}</span>
          <span>${target.name}</span>
        </button>
      `;
    }).join('');

    return `<div class="scene-nav">${buttons}</div>`;
  }

  _requirementsMet(target) {
    if (!target) return true;
    let required = [];
    if (target.requiresClue) required.push(target.requiresClue);
    if (Array.isArray(target.requiresClues)) {
      required = required.concat(target.requiresClues);
    }
    return required.every(id => gameState.hasClue(id));
  }

  _isItemExplored(sceneId, item) {
    if (!item || !this._requirementsMet(item)) return false;
    if (item.clues && item.clues.length > 0) {
      return item.clues.every(id => gameState.hasClue(id));
    }
    if (item.puzzle) {
      return this._isPuzzleSolved(sceneId, item.id);
    }
    return false;
  }

  _isSuspectExplored(suspectId) {
    const testimonyClues = {
      fang: 'A03',
      gao: 'A04',
      chen: 'A05',
      zhao: 'A06',
      qian: 'A07',
      lin: 'A08',
      zhou: 'A09',
      liang: 'A15',
      xu: 'A16'
    };
    const clueId = testimonyClues[suspectId];
    return Boolean((clueId && gameState.hasClue(clueId)) ||
      gameState.hasDialogueNode(suspectId, 'start'));
  }

  isSceneComplete(sceneId) {
    const scene = this.scenes[sceneId];
    if (!scene || !gameState.isSceneUnlocked(sceneId)) return false;

    const items = scene.items || [];
    const suspects = scene.suspects || [];
    if (items.length === 0 && suspects.length === 0) return false;

    const itemsDone = items.every(item => this._isItemExplored(sceneId, item));
    const suspectsDone = suspects.every(suspect => this._isSuspectExplored(suspect.id));
    return itemsDone && suspectsDone;
  }

  // 检查物品
  examineItem(sceneId, itemId) {
    const scene = this.scenes[sceneId];
    if (!scene) return;

    const item = (scene.items || []).find(i => i.id === itemId);
    if (!item) return;

    // 播放翻页/探索音效
    if (typeof audioManager !== 'undefined') {
      audioManager.play('paper-flip');
    }

    // 检查是否需要前置线索
    if (!this._requirementsMet(item)) {
      this._showRequireMessage(item);
      return;
    }

    // 检查是否需要解谜
    if (item.puzzle && !this._isPuzzleSolved(sceneId, itemId)) {
      this._showPuzzle(sceneId, itemId, item);
      return;
    }

    // 获取线索
    if (item.clues) {
      item.clues.forEach(id => clueSystem.collect(id));
    }

    // 显示物品面板
    this._showItemPanel(item);
  }

  // 检查谜题是否已解
  _isPuzzleSolved(sceneId, itemId) {
    const key = `puzzle_${sceneId}_${itemId}`;
    return gameState.get('puzzleSolved')?.[key] === true;
  }

  // 标记谜题已解
  _solvePuzzle(sceneId, itemId) {
    const puzzles = { ...(gameState.get('puzzleSolved') || {}) };
    puzzles[`puzzle_${sceneId}_${itemId}`] = true;
    gameState.set('puzzleSolved', puzzles);
  }

  _getItem(sceneId, itemId) {
    const scene = this.scenes[sceneId];
    if (!scene) return null;
    return (scene.items || []).find(i => i.id === itemId) || null;
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  _puzzleKey(type, sceneId, itemId) {
    return `${type}_${sceneId}_${itemId}`;
  }

  _completePuzzle(sceneId, itemId, item) {
    this._solvePuzzle(sceneId, itemId);
    if (item.clues) {
      item.clues.forEach(id => clueSystem.collect(id));
    }
    this._showItemPanel(item);
  }

  // 显示谜题界面
  _showPuzzle(sceneId, itemId, item) {
    const panel = document.getElementById('item-panel');
    if (!panel) return;

    this._clearPanelHistory();
    const puzzle = item.puzzle;

    if (puzzle.type === 'password') {
      panel.innerHTML = `
        <div class="panel-header">
          <h3 class="panel-title">${item.icon || '🔐'} ${item.name}</h3>
          <button class="panel-close" onclick="sceneManager.closePanel()">✕</button>
        </div>
        <div class="panel-body">
          <div class="item-description">${item.description}</div>
          <div class="puzzle-password">
            <p class="puzzle-hint">${puzzle.hint || '请输入密码'}</p>
            <div class="password-input-row">
              <input type="text" id="password-input" class="password-input"
                     placeholder="${puzzle.placeholder || '输入密码'}"
                     maxlength="20" autocomplete="off"
                     onkeydown="if(event.key==='Enter')sceneManager._checkPassword('${sceneId}','${itemId}','${puzzle.answer}')">
              <button class="btn-primary" onclick="sceneManager._checkPassword('${sceneId}', '${itemId}', '${puzzle.answer}')">确认</button>
            </div>
            <div id="password-feedback" class="password-feedback"></div>
          </div>
        </div>
      `;
      setTimeout(() => document.getElementById('password-input')?.focus(), 100);

    } else if (puzzle.type === 'multi-click') {
      const clickKey = `clicks_${sceneId}_${itemId}`;
      const currentClicks = this._clickCounts[clickKey] || 0;

      // 显示当前阶段文本
      const stageText = puzzle.stages?.[currentClicks] || item.description;
      const isLast = currentClicks >= (puzzle.required || 3) - 1;

      if (isLast) {
        // 最后一阶段：解锁谜题，收集线索
        this._solvePuzzle(sceneId, itemId);
        if (item.clues) {
          item.clues.forEach(id => clueSystem.collect(id));
        }
        this._showItemPanel(item);
        return;
      }

      // 显示当前阶段，带"继续探索"按钮
      const nextStage = currentClicks + 1;
      panel.innerHTML = `
        <div class="panel-header">
          <h3 class="panel-title">${item.icon || ''} ${item.name}</h3>
          <button class="panel-close" onclick="sceneManager.closePanel()">✕</button>
        </div>
        <div class="panel-body">
          <div class="item-description">${stageText}</div>
          <div style="margin-top:16px;text-align:center;">
            <button class="btn-primary" onclick="sceneManager._nextPuzzleStage('${sceneId}','${itemId}')">
              继续探索
            </button>
          </div>
        </div>
      `;

      // 递增点击计数
      this._clickCounts[clickKey] = currentClicks + 1;
    } else if (puzzle.type === 'sequence') {
      this._renderSequencePuzzle(sceneId, itemId, item, puzzle);
    } else if (puzzle.type === 'match') {
      this._renderMatchPuzzle(sceneId, itemId, item, puzzle);
    } else if (puzzle.type === 'inspect') {
      this._renderInspectPuzzle(sceneId, itemId, item, puzzle);
    } else {
      this._completePuzzle(sceneId, itemId, item);
      return;
    }

    this._showOverlay();
    panel.classList.remove('hidden');
    panel.offsetHeight;
    panel.classList.add('show');
  }

  // 多阶段谜题：进入下一阶段（点击计数已在_showPuzzle中递增）
  _nextPuzzleStage(sceneId, itemId) {
    var scene = this.scenes[sceneId];
    if (!scene) return;
    var item = scene.items.find(function (i) { return i.id === itemId; });
    if (!item) return;
    this._showPuzzle(sceneId, itemId, item);
  }

  _renderSequencePuzzle(sceneId, itemId, item, puzzle) {
    const panel = document.getElementById('item-panel');
    if (!panel) return;

    const key = this._puzzleKey('sequence', sceneId, itemId);
    const selected = this._sequenceSelections[key] || [];
    const selectedSet = new Set(selected);
    const choices = puzzle.choices || [];

    const selectedHtml = selected.length
      ? selected.map((idx, order) => {
        const choice = choices[idx] || {};
        return `
          <button class="puzzle-order-chip" onclick="sceneManager._removeSequenceChoice('${sceneId}', '${itemId}', ${idx})">
            <span>${order + 1}</span>${this._escapeHtml(choice.label || '')}
          </button>
        `;
      }).join('')
      : '<div class="puzzle-empty">按你认为正确的顺序点击下方记录。</div>';

    const choicesHtml = choices.map((choice, idx) => {
      const disabled = selectedSet.has(idx) ? 'disabled' : '';
      return `
        <button class="puzzle-choice" ${disabled}
                onclick="sceneManager._selectSequenceChoice('${sceneId}', '${itemId}', ${idx})">
          <span class="puzzle-choice-label">${this._escapeHtml(choice.label || '')}</span>
          ${choice.detail ? `<span class="puzzle-choice-detail">${this._escapeHtml(choice.detail)}</span>` : ''}
        </button>
      `;
    }).join('');

    panel.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">${item.icon || '🧩'} ${item.name}</h3>
        <button class="panel-close" onclick="sceneManager.closePanel()">✕</button>
      </div>
      <div class="panel-body">
        <div class="item-description">${item.description}</div>
        <div class="puzzle-card">
          <p class="puzzle-hint">${this._escapeHtml(puzzle.hint || '整理记录，恢复正确顺序。')}</p>
          <div class="puzzle-order-track">${selectedHtml}</div>
          <div class="puzzle-choice-grid">${choicesHtml}</div>
          <div class="puzzle-actions">
            <button onclick="sceneManager._clearSequencePuzzle('${sceneId}', '${itemId}')">重排</button>
            <button class="btn-primary" onclick="sceneManager._checkSequencePuzzle('${sceneId}', '${itemId}')">确认顺序</button>
          </div>
          <div id="puzzle-feedback" class="password-feedback"></div>
        </div>
      </div>
    `;
  }

  _selectSequenceChoice(sceneId, itemId, choiceIndex) {
    const key = this._puzzleKey('sequence', sceneId, itemId);
    const selected = this._sequenceSelections[key] || [];
    if (!selected.includes(choiceIndex)) {
      this._sequenceSelections[key] = [...selected, choiceIndex];
    }
    const item = this._getItem(sceneId, itemId);
    if (item) this._showPuzzle(sceneId, itemId, item);
  }

  _removeSequenceChoice(sceneId, itemId, choiceIndex) {
    const key = this._puzzleKey('sequence', sceneId, itemId);
    this._sequenceSelections[key] = (this._sequenceSelections[key] || [])
      .filter(idx => idx !== choiceIndex);
    const item = this._getItem(sceneId, itemId);
    if (item) this._showPuzzle(sceneId, itemId, item);
  }

  _clearSequencePuzzle(sceneId, itemId) {
    const key = this._puzzleKey('sequence', sceneId, itemId);
    this._sequenceSelections[key] = [];
    const item = this._getItem(sceneId, itemId);
    if (item) this._showPuzzle(sceneId, itemId, item);
  }

  _checkSequencePuzzle(sceneId, itemId) {
    const item = this._getItem(sceneId, itemId);
    if (!item || !item.puzzle) return;

    const key = this._puzzleKey('sequence', sceneId, itemId);
    const selected = this._sequenceSelections[key] || [];
    const answer = item.puzzle.answer || [];
    const feedback = document.getElementById('puzzle-feedback');
    const correct = answer.length === selected.length &&
      answer.every((idx, order) => selected[order] === idx);

    if (!feedback) return;
    if (correct) {
      feedback.textContent = item.puzzle.success || '顺序正确。';
      feedback.style.color = 'var(--color-success)';
      setTimeout(() => this._completePuzzle(sceneId, itemId, item), 500);
    } else {
      feedback.textContent = item.puzzle.failure || '顺序还有问题，再检查时间和因果。';
      feedback.style.color = 'var(--color-danger)';
    }
  }

  _renderMatchPuzzle(sceneId, itemId, item, puzzle) {
    const panel = document.getElementById('item-panel');
    if (!panel) return;

    const key = this._puzzleKey('match', sceneId, itemId);
    const state = this._matchSelections[key] || { selectedLeft: null, matches: {} };
    const pairs = puzzle.pairs || [];
    const matchedRights = new Set(Object.values(state.matches).map(Number));
    const rightOrder = puzzle.rightOrder || pairs.map((_, idx) => idx);

    const leftHtml = pairs.map((pair, idx) => {
      const matchedRight = state.matches[idx];
      const matchedLabel = matchedRight !== undefined && pairs[matchedRight]
        ? pairs[matchedRight].right
        : '';
      const selectedClass = state.selectedLeft === idx ? ' selected' : '';
      const matchedClass = matchedRight !== undefined ? ' matched' : '';
      return `
        <button class="match-cell${selectedClass}${matchedClass}"
                onclick="sceneManager._selectMatchLeft('${sceneId}', '${itemId}', ${idx})">
          <span>${this._escapeHtml(pair.left || '')}</span>
          ${matchedLabel ? `<small>已匹配：${this._escapeHtml(matchedLabel)}</small>` : ''}
        </button>
      `;
    }).join('');

    const rightHtml = rightOrder.map((rightIndex) => {
      const pair = pairs[rightIndex] || {};
      const used = matchedRights.has(rightIndex);
      return `
        <button class="match-cell${used ? ' matched' : ''}"
                onclick="sceneManager._selectMatchRight('${sceneId}', '${itemId}', ${rightIndex})">
          <span>${this._escapeHtml(pair.right || '')}</span>
        </button>
      `;
    }).join('');

    panel.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">${item.icon || '🧩'} ${item.name}</h3>
        <button class="panel-close" onclick="sceneManager.closePanel()">✕</button>
      </div>
      <div class="panel-body">
        <div class="item-description">${item.description}</div>
        <div class="puzzle-card">
          <p class="puzzle-hint">${this._escapeHtml(puzzle.hint || '先选择左侧记录，再选择右侧含义。')}</p>
          <div class="match-board">
            <div class="match-column">
              <div class="match-title">${this._escapeHtml(puzzle.leftTitle || '记录')}</div>
              ${leftHtml}
            </div>
            <div class="match-column">
              <div class="match-title">${this._escapeHtml(puzzle.rightTitle || '含义')}</div>
              ${rightHtml}
            </div>
          </div>
          <div class="puzzle-actions">
            <button onclick="sceneManager._clearMatchPuzzle('${sceneId}', '${itemId}')">清空</button>
            <button class="btn-primary" onclick="sceneManager._checkMatchPuzzle('${sceneId}', '${itemId}')">提交匹配</button>
          </div>
          <div id="puzzle-feedback" class="password-feedback"></div>
        </div>
      </div>
    `;
  }

  _selectMatchLeft(sceneId, itemId, leftIndex) {
    const key = this._puzzleKey('match', sceneId, itemId);
    const state = this._matchSelections[key] || { selectedLeft: null, matches: {} };
    state.selectedLeft = state.selectedLeft === leftIndex ? null : leftIndex;
    this._matchSelections[key] = state;
    const item = this._getItem(sceneId, itemId);
    if (item) this._showPuzzle(sceneId, itemId, item);
  }

  _selectMatchRight(sceneId, itemId, rightIndex) {
    const key = this._puzzleKey('match', sceneId, itemId);
    const state = this._matchSelections[key] || { selectedLeft: null, matches: {} };
    if (state.selectedLeft === null || state.selectedLeft === undefined) return;

    Object.keys(state.matches).forEach(left => {
      if (Number(state.matches[left]) === rightIndex) {
        delete state.matches[left];
      }
    });
    state.matches[state.selectedLeft] = rightIndex;
    state.selectedLeft = null;
    this._matchSelections[key] = state;
    const item = this._getItem(sceneId, itemId);
    if (item) this._showPuzzle(sceneId, itemId, item);
  }

  _clearMatchPuzzle(sceneId, itemId) {
    const key = this._puzzleKey('match', sceneId, itemId);
    this._matchSelections[key] = { selectedLeft: null, matches: {} };
    const item = this._getItem(sceneId, itemId);
    if (item) this._showPuzzle(sceneId, itemId, item);
  }

  _checkMatchPuzzle(sceneId, itemId) {
    const item = this._getItem(sceneId, itemId);
    if (!item || !item.puzzle) return;

    const key = this._puzzleKey('match', sceneId, itemId);
    const state = this._matchSelections[key] || { matches: {} };
    const pairs = item.puzzle.pairs || [];
    const feedback = document.getElementById('puzzle-feedback');
    const correct = pairs.length > 0 &&
      pairs.every((_, idx) => Number(state.matches[idx]) === idx);

    if (!feedback) return;
    if (correct) {
      feedback.textContent = item.puzzle.success || '匹配正确。';
      feedback.style.color = 'var(--color-success)';
      setTimeout(() => this._completePuzzle(sceneId, itemId, item), 500);
    } else {
      feedback.textContent = item.puzzle.failure || '还有记录没有对上，重新核对左侧原文和右侧含义。';
      feedback.style.color = 'var(--color-danger)';
    }
  }

  _renderInspectPuzzle(sceneId, itemId, item, puzzle) {
    const panel = document.getElementById('item-panel');
    if (!panel) return;

    const key = this._puzzleKey('inspect', sceneId, itemId);
    const found = this._inspectSelections[key] || [];
    const foundSet = new Set(found);
    const points = puzzle.points || [];
    const required = puzzle.required || points.length;

    const pointsHtml = points.map((point, idx) => {
      const active = foundSet.has(idx);
      return `
        <button class="inspect-point${active ? ' found' : ''}"
                onclick="sceneManager._selectInspectPoint('${sceneId}', '${itemId}', ${idx})">
          <span>${this._escapeHtml(point.label || '')}</span>
        </button>
      `;
    }).join('');

    const notesHtml = found.length
      ? found.map(idx => {
        const point = points[idx] || {};
        return `<li>${this._escapeHtml(point.note || point.label || '')}</li>`;
      }).join('')
      : '<li>还没有形成有效观察。</li>';

    panel.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">${item.icon || '🔎'} ${item.name}</h3>
        <button class="panel-close" onclick="sceneManager.closePanel()">✕</button>
      </div>
      <div class="panel-body">
        <div class="item-description">${item.description}</div>
        <div class="puzzle-card">
          <p class="puzzle-hint">${this._escapeHtml(puzzle.hint || '点击可疑细节，补全观察。')}</p>
          <div class="inspect-board">${pointsHtml}</div>
          <div class="inspect-notes">
            <div class="match-title">观察记录 ${found.length}/${required}</div>
            <ul>${notesHtml}</ul>
          </div>
          <div class="puzzle-actions">
            <button onclick="sceneManager._clearInspectPuzzle('${sceneId}', '${itemId}')">重看</button>
            <button class="btn-primary" onclick="sceneManager._checkInspectPuzzle('${sceneId}', '${itemId}')">形成判断</button>
          </div>
          <div id="puzzle-feedback" class="password-feedback"></div>
        </div>
      </div>
    `;
  }

  _selectInspectPoint(sceneId, itemId, pointIndex) {
    const key = this._puzzleKey('inspect', sceneId, itemId);
    const found = this._inspectSelections[key] || [];
    if (!found.includes(pointIndex)) {
      this._inspectSelections[key] = [...found, pointIndex];
    }
    const item = this._getItem(sceneId, itemId);
    if (item) this._showPuzzle(sceneId, itemId, item);
  }

  _clearInspectPuzzle(sceneId, itemId) {
    const key = this._puzzleKey('inspect', sceneId, itemId);
    this._inspectSelections[key] = [];
    const item = this._getItem(sceneId, itemId);
    if (item) this._showPuzzle(sceneId, itemId, item);
  }

  _checkInspectPuzzle(sceneId, itemId) {
    const item = this._getItem(sceneId, itemId);
    if (!item || !item.puzzle) return;

    const key = this._puzzleKey('inspect', sceneId, itemId);
    const found = this._inspectSelections[key] || [];
    const required = item.puzzle.required || (item.puzzle.points || []).length;
    const feedback = document.getElementById('puzzle-feedback');

    if (!feedback) return;
    if (found.length >= required) {
      feedback.textContent = item.puzzle.success || '观察足够，可以形成判断。';
      feedback.style.color = 'var(--color-success)';
      setTimeout(() => this._completePuzzle(sceneId, itemId, item), 500);
    } else {
      feedback.textContent = item.puzzle.failure || '观察还不够，继续检查细节。';
      feedback.style.color = 'var(--color-danger)';
    }
  }

  // 验证密码
  _checkPassword(sceneId, itemId, answer) {
    const input = document.getElementById('password-input');
    const feedback = document.getElementById('password-feedback');
    if (!input || !feedback) return;

    if (input.value.trim() === answer) {
      feedback.textContent = '密码正确！';
      feedback.style.color = 'var(--color-success)';
      this._solvePuzzle(sceneId, itemId);
      // 延迟后直接显示结果
      var self = this;
      setTimeout(function () {
        self.closePanel();
        setTimeout(function () { self.examineItem(sceneId, itemId); }, 350);
      }, 800);
    } else {
      feedback.textContent = '密码错误，请重试。';
      feedback.style.color = 'var(--color-danger)';
      input.value = '';
      input.focus();
    }
  }

  // 显示需要前置线索的提示
  _showRequireMessage(item) {
    const panel = document.getElementById('item-panel');
    if (!panel) return;

    this._clearPanelHistory();

    panel.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">${item.icon || ''} ${item.name}</h3>
        <button class="panel-close" onclick="sceneManager.closePanel()">✕</button>
      </div>
      <div class="panel-body">
        <div class="item-description">${item.description}</div>
        <div class="puzzle-hint" style="margin-top:16px;color:var(--color-warning);">
          ${item.requiresClueHint || '似乎还需要更多信息才能继续...'}
        </div>
      </div>
    `;

    this._showOverlay();
    panel.classList.remove('hidden');
    panel.offsetHeight;
    panel.classList.add('show');
  }

  // 与嫌疑人对话
  talkTo(characterId) {
    dialogueSystem.start(characterId);
  }

  // 导航到场景
  navigate(sceneId) {
    if (!gameState.isSceneUnlocked(sceneId)) {
      this._showLockedMessage(this.scenes[sceneId] || { name: sceneId });
      return;
    }
    router.navigate(`/scene/${sceneId}`);
  }

  // 返回地图
  goBack() {
    router.navigate('/map');
  }

  // 显示物品面板
  _showItemPanel(item) {
    const panel = document.getElementById('item-panel');
    if (!panel) return;

    this._clearPanelHistory();

    const imageHtml = item.image
      ? `<img class="item-image" src="assets/images/${item.image}" alt="${item.name}" onerror="this.style.display='none'">`
      : '';

    // 生成线索按钮列表
    const clueButtonsHtml = (item.clues && item.clues.length > 0)
      ? '<div class="item-clue-buttons">' +
        item.clues.map(function (clueId) {
          var clue = clueSystem.getClue(clueId);
          if (!clue) return '';
          return '<button class="clue-view-btn" onclick="notebook.showDetail(\'' + clueId + '\', true)">🔍 ' + clue.name + '</button>';
        }).join('') +
        '</div>'
      : '';

    const clueDetailHtml = item.clueDetail
      ? '<div class="item-clue"><div>' + item.clueDetail + '</div></div>'
      : '';

    panel.innerHTML = `
      <div class="panel-header">
        <h3 class="panel-title">${item.name}</h3>
        <button class="panel-close" onclick="sceneManager.closePanel()">✕</button>
      </div>
      <div class="panel-body">
        ${imageHtml}
        <div class="item-description">${item.description}</div>
        ${clueDetailHtml}
        ${clueButtonsHtml}
      </div>
    `;

    this._showOverlay();
    this._setNavDisabled(true);

    panel.classList.remove('hidden');
    panel.offsetHeight;
    panel.classList.add('show');
  }

  // 保存当前面板内容，用于从物品内查看线索后返回上一层
  pushPanelState() {
    const panel = document.getElementById('item-panel');
    if (!panel || !panel.classList.contains('show')) return false;

    this._panelHistory.push({
      html: panel.innerHTML,
      scrollTop: panel.scrollTop
    });
    return true;
  }

  _restorePanelState(state) {
    const panel = document.getElementById('item-panel');
    if (!panel || !state) return;

    panel.innerHTML = state.html;
    panel.classList.remove('hidden');
    panel.offsetHeight;
    panel.classList.add('show');
    panel.scrollTop = state.scrollTop || 0;

    this._showOverlay();
    this._setNavDisabled(true);
  }

  _clearPanelHistory() {
    this._panelHistory = [];
  }

  // 关闭面板
  closePanel() {
    if (this._panelHistory.length > 0) {
      this._restorePanelState(this._panelHistory.pop());
      return;
    }

    const panel = document.getElementById('item-panel');
    if (panel) {
      panel.classList.remove('show');
      setTimeout(() => panel.classList.add('hidden'), 300);
    }
    this._clearPanelHistory();
    this._hideOverlay();
    this._setNavDisabled(false);
  }

  // 显示遮罩层（点击可关闭）
  _showOverlay(source) {
    let overlay = document.getElementById('panel-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'panel-overlay';
      overlay.className = 'panel-overlay';
      // 放入 ui-layer 以保持正确的层叠上下文
      const uiLayer = document.getElementById('ui-layer');
      if (uiLayer) {
        uiLayer.insertBefore(overlay, uiLayer.firstChild);
      } else {
        document.body.appendChild(overlay);
      }
    }
    // 根据来源决定点击关闭行为
    overlay.onclick = (e) => {
      // 只在点击遮罩本身时关闭，不拦截面板内的点击
      if (e.target !== overlay) return;
      if (source === 'dialogue') {
        dialogueSystem.close();
      } else {
        this.closePanel();
      }
    };
    overlay.classList.remove('hidden');
    overlay.offsetHeight;
    overlay.classList.add('show');
  }

  // 隐藏遮罩层
  _hideOverlay() {
    const overlay = document.getElementById('panel-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => overlay.classList.add('hidden'), 300);
    }
  }

  // 设置导航按钮禁用状态
  _setNavDisabled(disabled) {
    const mapBtn = document.getElementById('map-btn');
    const backBtn = document.querySelector('.btn-back');
    if (mapBtn) {
      mapBtn.disabled = disabled;
      mapBtn.style.opacity = disabled ? '0.4' : '';
      mapBtn.style.pointerEvents = disabled ? 'none' : '';
    }
    if (backBtn) {
      backBtn.disabled = disabled;
      backBtn.style.opacity = disabled ? '0.4' : '';
      backBtn.style.pointerEvents = disabled ? 'none' : '';
    }
  }

  // 显示锁定消息
  _showLockedMessage(scene) {
    const container = document.getElementById('clue-notification');
    if (!container) return;

    container.innerHTML = `
      <div class="clue-toast">
        <div class="clue-notification-content">
          <div class="clue-icon">🔒</div>
          <div class="clue-info">
            <div class="clue-name">区域未解锁</div>
            <div class="clue-desc">需要收集更多线索才能进入此区域</div>
          </div>
        </div>
      </div>
    `;
    container.classList.remove('hidden');
    container.offsetHeight;
    container.classList.add('show');

    setTimeout(() => {
      container.classList.remove('show');
      setTimeout(() => container.classList.add('hidden'), 300);
    }, 2500);
  }

  // 添加雨滴效果
  _addRainEffect(container) {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';

    for (let i = 0; i < 50; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      drop.style.animationDelay = `${Math.random() * 2}s`;
      rainContainer.appendChild(drop);
    }

    container.appendChild(rainContainer);
  }

  // 添加闪电效果
  _addLightningEffect(container) {
    const flash = document.createElement('div');
    flash.className = 'lightning-overlay';
    container.appendChild(flash);

    // 随机触发雷声
    const triggerThunder = () => {
      if (!document.body.contains(flash)) return;
      if (typeof audioManager !== 'undefined') {
        audioManager.play('thunder');
      }
      setTimeout(triggerThunder, 8000 + Math.random() * 15000);
    };
    setTimeout(triggerThunder, 3000 + Math.random() * 5000);
  }
}

// 全局实例
const sceneManager = new SceneManager();
