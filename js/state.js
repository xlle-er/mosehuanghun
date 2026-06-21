/* ============================================
   State - 游戏状态管理（不可变模式）
   ============================================ */

class GameState {
  constructor() {
    this._listeners = new Map();
    // 清除存档，确保每次都是新游戏
    localStorage.removeItem('twilight-museum-save');
    this._state = this._defaults();
    this._checkUnlocks();
  }

  // 默认状态
  _defaults() {
    return {
      currentScene: '/intro',
      collectedClues: [],
      unlockedScenes: ['intro', 'study', 'living-room', 'gallery', 'bedrooms', 'garden', 'police-station', 'forensic-office'],
      visitedScenes: [],
      dialogueHistory: {},
      puzzleSolved: {},
      caseBriefed: false,
      gameStartTime: null,
      totalPlayTime: 0,
      endings: { correct: false, wrong: false }
    };
  }

  // 从 localStorage 加载（禁用：每次都是新游戏）
  _load() {
    return this._defaults();
  }

  // 保存到 localStorage（禁用：每次都是新游戏）
  _save() {
    // 不保存到localStorage，确保每次都是新游戏
  }

  // 获取值
  get(key) {
    return this._state[key];
  }

  // 设置值（不可变）
  set(key, value) {
    const prev = this._state[key];
    if (prev === value) return;
    this._state = { ...this._state, [key]: value };
    this._save();
    this._emit('change', { key, value, prev });
  }

  // 添加线索
  addClue(clueId) {
    if (this._state.collectedClues.includes(clueId)) return false;
    this._state = {
      ...this._state,
      collectedClues: [...this._state.collectedClues, clueId]
    };
    this._save();
    this._checkUnlocks();
    this._emit('clueAdded', clueId);
    return true;
  }

  // 是否拥有某线索
  hasClue(clueId) {
    return this._state.collectedClues.includes(clueId);
  }

  // 已收集线索数
  clueCount() {
    return this._state.collectedClues.length;
  }

  // 是否拥有全部核心线索
  hasAllCoreClues() {
    const core = [
      'C01','C02','C03','C04','C05','C06','C07','C08',
      'C09','C10','C11','C12','C13','C14','C15','C16','C17','C18'
    ];
    return core.every(id => this._state.collectedClues.includes(id));
  }

  // 标记场景已访问
  visitScene(sceneId) {
    if (!this._state.visitedScenes.includes(sceneId)) {
      this._state = {
        ...this._state,
        visitedScenes: [...this._state.visitedScenes, sceneId]
      };
      this._save();
    }
  }

  // 场景是否已解锁
  isSceneUnlocked(sceneId) {
    return this._state.unlockedScenes.includes(sceneId);
  }

  // 记录对话
  recordDialogue(characterId, nodeId, optionIndex) {
    if (optionIndex === undefined) {
      optionIndex = nodeId;
      nodeId = 'start';
    }

    const history = { ...this._state.dialogueHistory };
    const characterHistory = Array.isArray(history[characterId])
      ? { start: history[characterId] }
      : { ...(history[characterId] || {}) };
    const nodeHistory = Array.isArray(characterHistory[nodeId])
      ? characterHistory[nodeId]
      : [];

    if (!nodeHistory.includes(optionIndex)) {
      characterHistory[nodeId] = [...nodeHistory, optionIndex];
    }

    history[characterId] = characterHistory;
    this._state = { ...this._state, dialogueHistory: history };
    this._save();
  }

  // 记录对话节点已读，用于二次进入时跳过打字机
  recordDialogueNode(characterId, nodeId) {
    const history = { ...this._state.dialogueHistory };
    const characterHistory = Array.isArray(history[characterId])
      ? { start: history[characterId] }
      : { ...(history[characterId] || {}) };
    const visitedNodes = Array.isArray(characterHistory.__visitedNodes)
      ? characterHistory.__visitedNodes
      : [];

    if (!visitedNodes.includes(nodeId)) {
      characterHistory.__visitedNodes = [...visitedNodes, nodeId];
      history[characterId] = characterHistory;
      this._state = { ...this._state, dialogueHistory: history };
      this._save();
    }
  }

  // 是否已经看过某对话节点
  hasDialogueNode(characterId, nodeId) {
    const h = this._state.dialogueHistory[characterId];
    if (!h || Array.isArray(h)) return false;
    return Array.isArray(h.__visitedNodes) && h.__visitedNodes.includes(nodeId);
  }

  // 是否已选过某对话选项
  hasDialogueOption(characterId, nodeId, optionIndex) {
    if (optionIndex === undefined) {
      optionIndex = nodeId;
      nodeId = 'start';
    }

    const h = this._state.dialogueHistory[characterId];
    if (!h) return false;
    if (Array.isArray(h)) return nodeId === 'start' && h.includes(optionIndex);
    const nodeHistory = h[nodeId];
    return Array.isArray(nodeHistory) && nodeHistory.includes(optionIndex);
  }

  // 开始游戏计时
  startTimer() {
    if (!this._state.gameStartTime) {
      this.set('gameStartTime', Date.now());
    }
  }

  // 获取游戏用时（秒）
  getPlayTime() {
    if (!this._state.gameStartTime) return 0;
    return Math.floor((Date.now() - this._state.gameStartTime) / 1000);
  }

  // 解锁场景
  unlockScene(sceneId) {
    if (!this._state.unlockedScenes.includes(sceneId)) {
      this._state = {
        ...this._state,
        unlockedScenes: [...this._state.unlockedScenes, sceneId]
      };
      this._save();
      this._emit('sceneUnlocked', sceneId);
      return true;
    }
    return false;
  }

  // 检查解锁条件
  _checkUnlocks() {
    const count = this._state.collectedClues.length;

    if (this.hasClue('B02') && !this._state.unlockedScenes.includes('greenhouse')) {
      this.unlockScene('greenhouse');
    }

    if ((this.hasClue('C06') || this.hasClue('C07')) && !this._state.unlockedScenes.includes('library')) {
      this.unlockScene('library');
    }

    if (this.hasClue('C05') && !this._state.unlockedScenes.includes('office')) {
      this.unlockScene('office');
    }

    if (count >= 12 && !this._state.unlockedScenes.includes('basement')) {
      this.unlockScene('basement');
    }

    if (this.hasClue('I19') && !this._state.unlockedScenes.includes('case-archive')) {
      this.unlockScene('case-archive');
    }

    if (this.hasAllCoreClues() && !this._state.unlockedScenes.includes('reasoning')) {
      this.unlockScene('reasoning');
    }

    // 检查暗格解锁
    const hasIdentity = this.hasClue('C02');
    if (hasIdentity && !this._state.unlockedScenes.includes('office-secret')) {
      this.unlockScene('office-secret');
    }
  }

  // 重置游戏
  reset() {
    this._state = this._defaults();
    // 不保存到localStorage
    this._emit('reset');
  }

  // 事件：监听
  on(event, fn) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(fn);
    return () => this.off(event, fn);
  }

  // 事件：移除
  off(event, fn) {
    const list = this._listeners.get(event);
    if (list) {
      const idx = list.indexOf(fn);
      if (idx > -1) list.splice(idx, 1);
    }
  }

  // 事件：触发
  _emit(event, data) {
    const list = this._listeners.get(event);
    if (list) list.forEach(fn => fn(data));
  }
}

// 全局实例
const gameState = new GameState();
