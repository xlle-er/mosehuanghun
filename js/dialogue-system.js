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
  }

  // 初始化
  init(dialoguesData) {
    this.dialogues = dialoguesData || {};
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

  _renderOptions(node, nodeId, hideTerminalOptions) {
    var self = this;
    var lockedHintShown = false;

    var optionHtml = (node.options || []).map(function (opt, i) {
      if (hideTerminalOptions && !opt.next && !opt.clues) return '';

      var locked = !self._requirementsMet(opt);
      if (locked) {
        if (lockedHintShown) return '';
        lockedHintShown = true;
        return '<button class="dialogue-option" disabled style="opacity:0.35;cursor:not-allowed;">🔒 找到相关证据后可继续追问</button>';
      }

      var selected = gameState.hasDialogueOption(self.current.characterId, nodeId, i);
      var label = selected && !self._isBackOption(opt) ? opt.text + ' ✓' : opt.text;
      return '<button class="dialogue-option" onclick="dialogueSystem.selectOption(' + i + ')">' + self._escapeHtml(label) + '</button>';
    }).filter(Boolean).join('');

    var hasEnd = (node.options || []).some(function (opt) { return self._isEndOption(opt); });
    if (!hideTerminalOptions && !hasEnd) {
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
