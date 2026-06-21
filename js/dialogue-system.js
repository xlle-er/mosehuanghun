/* ============================================
   DialogueSystem - 对话系统
   ============================================ */

class DialogueSystem {
  constructor() {
    this.dialogues = {};
    this.current = null;
    this._onClose = null;
    this._typingDone = false;
    this._typewriterResolve = null;
    this._currentFullText = '';
    this._clueAddedUnsubscribe = null;
    this._dialogueUnlockTimer = null;
    this._pendingDialogueUnlocks = [];
  }

  // 初始化
  init(dialoguesData) {
    this.dialogues = dialoguesData || {};
    if (!this._clueAddedUnsubscribe && typeof gameState !== 'undefined') {
      this._clueAddedUnsubscribe = gameState.on('clueAdded', (clueId) => {
        this._checkDialogueUnlocks(clueId);
      });
    }
  }

  // 开始对话
  start(characterId, onClose) {
    var dialogue = this.dialogues[characterId];
    if (!dialogue) {
      console.warn('[Dialogue] No dialogue for:', characterId);
      return;
    }

    this.current = {
      characterId: characterId,
      characterName: dialogue.name,
      characterRole: dialogue.role || '',
      portrait: dialogue.portrait,
      longText: dialogue.longText || null,
      phase: 'longtext', // 'longtext' | 'interactive'
      nodeId: 'start',
      history: [],
      nodeStack: []
    };
    this._onClose = onClose;

    // 先展示长文本
    if (this.current.longText) {
      this._showLongText();
    } else {
      this.current.phase = 'interactive';
      this._renderNode(dialogue.nodes.start);
    }
    this._show();
  }

  // 展示长文本（直接显示，无打字机效果）
  _showLongText() {
    this.current.phase = 'interactive';
    var dialogue = this.dialogues[this.current.characterId];
    var node = dialogue.nodes.start;

    var box = document.getElementById('dialogue-box');
    if (!box) return;

    this._typingDone = true;
    gameState.recordDialogueNode(this.current.characterId, 'start');

    var portraitHtml = this.current.portrait
      ? '<img class="dialogue-portrait" src="assets/images/' + this.current.portrait + '" alt="' + this.current.characterName + '" onerror="this.style.display=\'none\'">'
      : '';

    var optionsHtml = this._renderOptions(node, 'start', true);
    var hasUnexplored = optionsHtml.length > 0;

    // 如果没有未探索选项，只显示长文本
    var footerHtml = hasUnexplored
      ? '<div class="dialogue-options">' + optionsHtml + '<button class="dialogue-option" onclick="dialogueSystem.close()">（离开）</button></div>'
      : '<div class="dialogue-options"><button class="dialogue-option" onclick="dialogueSystem.close()">（离开）</button></div>';

    box.innerHTML = [
      '<div class="dialogue-header">',
      portraitHtml,
      '  <div>',
      '    <span class="dialogue-character-name">' + this.current.characterName + '</span>',
      '    <span style="color:var(--color-text-muted);font-size:12px;margin-left:8px;">' + this.current.characterRole + '</span>',
      '  </div>',
      '</div>',
      '<div class="dialogue-text" style="max-height:160px;overflow-y:auto;white-space:pre-wrap;font-size:13px;line-height:1.7;color:var(--color-text-secondary);">' + this.current.longText + '</div>',
      footerHtml
    ].join('\n');

    this.current.nodeId = 'start';
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  _isBackOption(option) {
    return option && typeof option.text === 'string' && option.text.indexOf('返回') >= 0;
  }

  _isEndOption(option) {
    return option && !option.next && typeof option.text === 'string' &&
      (option.text.indexOf('结束') >= 0 || option.text.indexOf('离开') >= 0);
  }

  _requirementsMet(option) {
    if (!option) return true;
    var required = [];
    if (option.requiresClue) required.push(option.requiresClue);
    if (Array.isArray(option.requiresClues)) {
      required = required.concat(option.requiresClues);
    }
    return required.every(function (id) { return gameState.hasClue(id); });
  }

  _getRequiredClues(option) {
    var required = [];
    if (!option) return required;
    if (option.requiresClue) required.push(option.requiresClue);
    if (Array.isArray(option.requiresClues)) {
      required = required.concat(option.requiresClues);
    }
    return required;
  }

  _checkDialogueUnlocks(clueId) {
    if (!clueId || typeof gameState === 'undefined') return;

    var notified = gameState.get('dialogueUnlockNotified') || [];
    var nextNotified = notified.slice();
    var unlockedByCharacter = {};

    Object.keys(this.dialogues || {}).forEach((characterId) => {
      var dialogue = this.dialogues[characterId];
      var nodes = dialogue && dialogue.nodes ? dialogue.nodes : {};

      Object.keys(nodes).forEach((nodeId) => {
        var node = nodes[nodeId];
        (node.options || []).forEach((option, optionIndex) => {
          var required = this._getRequiredClues(option);
          if (required.length === 0 || required.indexOf(clueId) < 0) return;
          if (!this._requirementsMet(option)) return;

          var key = characterId + ':' + nodeId + ':' + optionIndex;
          if (nextNotified.indexOf(key) >= 0) return;

          nextNotified.push(key);
          if (!unlockedByCharacter[characterId]) {
            unlockedByCharacter[characterId] = {
              name: dialogue.name || characterId,
              role: dialogue.role || '',
              count: 0
            };
          }
          unlockedByCharacter[characterId].count += 1;
        });
      });
    });

    if (nextNotified.length !== notified.length) {
      gameState.set('dialogueUnlockNotified', nextNotified);
    }

    var unlocked = Object.keys(unlockedByCharacter).map(function (characterId) {
      return unlockedByCharacter[characterId];
    });
    if (unlocked.length > 0) {
      this._queueDialogueUnlockNotifications(unlocked);
    }
  }

  _queueDialogueUnlockNotifications(unlocked) {
    this._pendingDialogueUnlocks = this._pendingDialogueUnlocks.concat(unlocked);
    if (this._dialogueUnlockTimer) return;

    this._dialogueUnlockTimer = setTimeout(() => {
      var pending = this._pendingDialogueUnlocks.slice();
      this._pendingDialogueUnlocks = [];
      this._dialogueUnlockTimer = null;
      this._showDialogueUnlockNotifications(pending);
    }, 150);
  }

  _showDialogueUnlockNotifications(unlocked) {
    var container = document.getElementById('dialogue-unlock-notification');
    if (!container || unlocked.length === 0) return;

    var merged = {};
    unlocked.forEach(function (item) {
      var key = item.name + '|' + item.role;
      if (!merged[key]) {
        merged[key] = { name: item.name, role: item.role, count: 0 };
      }
      merged[key].count += item.count || 1;
    });

    var rows = Object.keys(merged).map((key) => {
      var item = merged[key];
      var countText = item.count > 1 ? '有 ' + item.count + ' 条新追问' : '有新的追问';
      var roleText = item.role ? '<div class="dialogue-unlock-role">' + this._escapeHtml(item.role) + '</div>' : '';
      return [
        '<div class="dialogue-unlock-toast">',
        '  <div class="dialogue-unlock-icon">💬</div>',
        '  <div class="dialogue-unlock-copy">',
        '    <div class="dialogue-unlock-label">问话更新</div>',
        '    <div class="dialogue-unlock-name">' + this._escapeHtml(item.name) + countText + '</div>',
        roleText,
        '  </div>',
        '</div>'
      ].join('\n');
    }).join('');

    container.innerHTML = rows;
    container.classList.remove('hidden');
    container.offsetHeight;
    container.classList.add('show');

    setTimeout(function () {
      container.classList.remove('show');
      setTimeout(function () { container.classList.add('hidden'); }, 300);
    }, 4200);
  }

  _renderOptions(node, nodeId, hideTerminalOptions) {
    var self = this;

    var optionHtml = (node.options || []).map(function (opt, i) {
      if (hideTerminalOptions && !opt.next && !opt.clues) return '';

      var locked = !self._requirementsMet(opt);
      if (locked) {
        return '';
      }

      var selected = gameState.hasDialogueOption(self.current.characterId, nodeId, i);
      var label = selected && !self._isBackOption(opt) ? opt.text + ' ✓' : opt.text;
      return '<button class="dialogue-option" onclick="dialogueSystem.selectOption(' + i + ')">' + self._escapeHtml(label) + '</button>';
    }).filter(Boolean).join('');

    var hasTerminal = (node.options || []).some(function (opt) { return !opt.next; });
    if (!hideTerminalOptions && !hasTerminal) {
      optionHtml += '<button class="dialogue-option" onclick="dialogueSystem.close()">（结束对话）</button>';
    }

    return optionHtml;
  }

  // 选择选项
  selectOption(index) {
    if (!this.current) return;

    var dialogue = this.dialogues[this.current.characterId];
    var node = dialogue.nodes[this.current.nodeId];
    var option = node.options[index];
    if (!option) return;

    // 检查是否锁定
    if (!this._requirementsMet(option)) {
      return;
    }

    var isBack = this._isBackOption(option);

    if (isBack) {
      var previousNodeId = this.current.nodeStack.pop() || option.next || 'start';
      this.current.nodeId = previousNodeId;
      var previousNode = dialogue.nodes[previousNodeId];
      if (previousNode) {
        this._renderNode(previousNode);
      }
      return;
    }

    // 记录选择
    this.current.history.push({
      node: this.current.nodeId,
      option: index
    });
    gameState.recordDialogue(this.current.characterId, this.current.nodeId, index);

    // 获取线索
    if (option.clues) {
      option.clues.forEach(function (id) { clueSystem.collect(id); });
    }

    if (option.authorizeArchive) {
      if (typeof gameState.authorizeArchive === 'function') {
        gameState.authorizeArchive();
      } else {
        gameState.set('archiveAuthorized', true);
        gameState.unlockScene('case-archive');
      }
    }

    // 跳转
    if (option.next) {
      this.current.nodeStack.push(this.current.nodeId);
      this.current.nodeId = option.next;
      var nextNode = dialogue.nodes[option.next];
      if (nextNode) {
        this._renderNode(nextNode);
      }
    } else {
      this.close();
    }
  }

  // 关闭对话
  close() {
    this._hide();
    var callback = this._onClose;
    this.current = null;
    this._onClose = null;
    if (callback) callback();
  }

  // 渲染节点
  _renderNode(node) {
    var box = document.getElementById('dialogue-box');
    if (!box) return;

    this._typingDone = false;
    var self = this;

    var portraitHtml = this.current.portrait
      ? '<img class="dialogue-portrait" src="assets/images/' + this.current.portrait + '" alt="' + this.current.characterName + '" onerror="this.style.display=\'none\'">'
      : '';

    var nodeId = this.current.nodeId;
    var alreadyRead = gameState.hasDialogueNode(this.current.characterId, nodeId);
    gameState.recordDialogueNode(this.current.characterId, nodeId);
    var optionsHtml = this._renderOptions(node, nodeId, false);

    box.innerHTML = [
      '<div class="dialogue-header">',
      portraitHtml,
      '  <span class="dialogue-character-name">' + this.current.characterName + '</span>',
      '</div>',
      '<div class="dialogue-text" id="dialogue-text-target" style="cursor:pointer;"></div>',
      '<div class="dialogue-options" id="dialogue-options">' + optionsHtml + '</div>'
    ].join('\n');

    // 点击文字跳过打字机
    var textEl = document.getElementById('dialogue-text-target');
    textEl.addEventListener('click', function () {
      if (!self._typingDone) {
        self._skipTypewriter();
      }
    });

    var optionsEl = document.getElementById('dialogue-options');

    if (alreadyRead) {
      textEl.textContent = node.text;
      self._typingDone = true;
      optionsEl.style.opacity = '1';
      optionsEl.style.pointerEvents = 'auto';
      return;
    }

    // 打字机效果
    optionsEl.style.opacity = '0.3';
    optionsEl.style.pointerEvents = 'none';

    this._typewrite(textEl, node.text).then(function () {
      self._typingDone = true;
      optionsEl.style.opacity = '1';
      optionsEl.style.pointerEvents = 'auto';
    });
  }

  // 跳过打字机
  _skipTypewriter() {
    if (this._typewriterResolve) {
      this._typewriterResolve();
      this._typewriterResolve = null;
    }
  }

  // 打字机效果
  _typewrite(element, text, speed) {
    speed = speed || 30;
    this._currentFullText = text;
    element.textContent = '';

    var self = this;
    return new Promise(function (resolve) {
      self._typewriterResolve = resolve;
      var i = 0;

      var tick = function () {
        if (!self._typewriterResolve) {
          element.textContent = text;
          resolve();
          return;
        }

        if (i >= text.length) {
          self._typewriterResolve = null;
          resolve();
          return;
        }

        element.textContent += text[i];
        var char = text[i];
        var extra = ('，。！？、；：'.indexOf(char) >= 0) ? 150 : 0;
        i++;
        setTimeout(tick, speed + extra);
      };

      tick();
    });
  }

  // 显示对话框
  _show() {
    var box = document.getElementById('dialogue-box');
    if (box) {
      box.classList.remove('hidden');
      box.offsetHeight;
      box.classList.add('show');
    }
    if (typeof sceneManager !== 'undefined') {
      sceneManager._showOverlay('dialogue');
      sceneManager._setNavDisabled(true);
    }
  }

  // 隐藏对话框
  _hide() {
    var box = document.getElementById('dialogue-box');
    if (box) {
      box.classList.remove('show');
      setTimeout(function () { box.classList.add('hidden'); }, 300);
    }
    if (typeof sceneManager !== 'undefined') {
      sceneManager._hideOverlay();
      sceneManager._setNavDisabled(false);
    }
  }
}

// 全局实例
var dialogueSystem = new DialogueSystem();
