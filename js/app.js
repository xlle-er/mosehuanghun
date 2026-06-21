/* ============================================
   App - 应用入口
   ============================================ */

(async function () {
  'use strict';

  // ---- 加载数据 ----
  clueSystem.init(window.CLUES_DATA, window.COMBINATIONS_DATA);
  dialogueSystem.init(window.DIALOGUES_DATA);
  sceneManager.init(window.SCENES_DATA);
  audioManager.init();

  // ---- 场景音效映射 ----
  const SCENE_AUDIO = {
    'study':       { ambience: 'rain-ambient',  bgm: null },
    'living-room': { ambience: 'rain-ambient',  bgm: null },
    'gallery':     { ambience: null,            bgm: null },
    'bedrooms':    { ambience: null,            bgm: null },
    'greenhouse':  { ambience: 'rain-ambient',  bgm: null },
    'office':      { ambience: 'clock-ticking', bgm: null },
    'library':     { ambience: null,            bgm: null },
    'garden':      { ambience: 'rain-ambient',  bgm: null },
    'basement':    { ambience: 'dripping',      bgm: null }
  };

  // ---- 注册路由 ----
  router.registerAll({
    // 开场
    '/intro': () => {
      audioManager.stopAmbience();
      audioManager.stopBGM();
      showIntro();
    },

    // 地图
    '/map': () => {
      audioManager.stopAmbience();
      audioManager.playBGM('bgm-mystery');
      audioManager.play('footsteps');
      showMap();
    },

    // 场景
    '/scene/study': () => enterScene('study'),
    '/scene/living-room': () => enterScene('living-room'),
    '/scene/gallery': () => enterScene('gallery'),
    '/scene/bedrooms': () => enterScene('bedrooms'),
    '/scene/greenhouse': () => enterScene('greenhouse'),
    '/scene/office': () => enterScene('office'),
    '/scene/library': () => enterScene('library'),
    '/scene/garden': () => enterScene('garden'),
    '/scene/basement': () => enterScene('basement'),
    '/scene/police-station': () => enterScene('police-station'),
    '/scene/forensic-office': () => enterScene('forensic-office'),
    '/scene/case-archive': () => enterScene('case-archive'),

    // 推理室
    '/reasoning': () => {
      setAppChromeVisible(true);
      audioManager.stopAmbience();
      audioManager.playBGM('bgm-tension');
      reasoning.render();
    },

    // 结局
    '/ending/correct': () => {
      setAppChromeVisible(true);
      audioManager.stopAmbience();
      audioManager.stopBGM();
      audioManager.playBGM('bgm-ending');
      showEnding('correct');
    },
    '/ending/wrong': () => {
      setAppChromeVisible(true);
      audioManager.stopAmbience();
      audioManager.stopBGM();
      showEnding('wrong');
    }
  });

  function setAppChromeVisible(visible) {
    document.body.classList.toggle('app-chrome-hidden', !visible);
  }

  // 进入场景（统一处理音效）
  function enterScene(sceneId) {
    setAppChromeVisible(true);
    const audio = SCENE_AUDIO[sceneId];
    audioManager.stopBGM();

    if (audio) {
      if (audio.ambience) {
        audioManager.playAmbience(audio.ambience);
      } else {
        audioManager.stopAmbience();
      }
      if (audio.bgm) {
        audioManager.playBGM(audio.bgm);
      }
    } else {
      audioManager.stopAmbience();
    }

    sceneManager.load(sceneId);
  }

  // 路由后置钩子：保存当前位置
  router.afterEach((to) => {
    if (to !== '/intro') {
      gameState.set('currentScene', to);
    }
  });

  // ---- 事件监听 ----

  // 地图按钮
  document.getElementById('map-btn')?.addEventListener('click', () => {
    router.navigate('/map');
  });

  // 设置按钮
  document.getElementById('settings-btn')?.addEventListener('click', () => {
    toggleSettingsPanel();
  });

  // 场景解锁通知
  gameState.on('sceneUnlocked', (sceneId) => {
    showUnlockToast(sceneId);
  });

  // ---- 加载完成 ----
  const loadingScreen = document.getElementById('loading-screen');
  const gameContainer = document.getElementById('game-container');

  // 模拟加载
  const loadingBar = document.querySelector('.loading-bar-fill');
  if (loadingBar) {
    for (let i = 0; i <= 100; i += 10) {
      loadingBar.style.width = `${i}%`;
      await Utils.delay(50);
    }
  }

  await Utils.delay(300);

  if (loadingScreen) loadingScreen.classList.add('fade-out');
  if (gameContainer) gameContainer.style.display = 'block';

  await Utils.delay(800);
  if (loadingScreen) loadingScreen.style.display = 'none';

  if (router.getCurrent() === '/intro') {
    showIntro();
  } else {
    router.navigate('/intro');
  }

  // ============================================
  //  页面渲染函数
  // ============================================

  // ---- 开场页面 ----
  function showIntro() {
    const container = document.getElementById('scene-container');
    if (!container) return;

    setAppChromeVisible(false);

    const hasSave = hasSavedGame();
    const continueDisabled = hasSave ? '' : 'disabled';
    const saveText = hasSave
      ? '已检测到调查进度，可以继续上次的位置。'
      : '暂无调查进度，新游戏会从第一现场开始。';

    container.innerHTML = `
      <div class="scene start-screen">
        <div class="start-copy">
          <p class="start-date">2024年11月15日 · 墨白山庄</p>
          <h1 class="intro-title">墨色黄昏</h1>
          <div class="start-brief">
            <p>艺术品收藏家陈墨白死在自己的书房里，现场看似平静。</p>
            <p>警方倾向于心脏病发作，但三天前刚刚修改的遗嘱，让这场雨夜死亡变得不那么简单。</p>
            <p>遗嘱执行人请你重新调查。你要做的，是从山庄里每一处沉默的细节开始。</p>
          </div>
          <div class="start-actions">
            <button class="btn-primary btn-large" onclick="startNewGame()">新游戏</button>
            <button class="btn-large" onclick="continueGame()" ${continueDisabled}>继续游戏</button>
          </div>
          <div class="start-save-note">${saveText}</div>
        </div>
      </div>
    `;
  }

  function hasSavedGame() {
    const savedScene = gameState.get('currentScene');
    const visited = gameState.get('visitedScenes') || [];
    return gameState.clueCount() > 0 || visited.length > 0 ||
      Boolean(savedScene && savedScene !== '/intro');
  }

  function getResumeRoute() {
    const savedScene = gameState.get('currentScene');
    if (!savedScene || savedScene === '/intro') return '/map';
    if (savedScene === '/reasoning' && !gameState.hasAllCoreClues()) return '/map';
    if (savedScene.startsWith('/ending')) return '/map';
    if (savedScene.startsWith('/scene/')) {
      const sceneId = savedScene.replace('/scene/', '');
      if (!gameState.isSceneUnlocked(sceneId)) return '/map';
    }
    return savedScene;
  }

  function collectInitialClues() {
    clueSystem.collect('C08'); // 法医报告
    clueSystem.collect('A01'); // 邀请函
    clueSystem.collect('A10'); // 别墅布局图
  }

  function showCaseBriefing() {
    if (!dialogueSystem.dialogues.commissioner) {
      showNotebookHint();
      return;
    }
    gameState.set('caseBriefed', true);
    dialogueSystem.start('commissioner', () => {
      showNotebookHint();
    });
  }

  window.startNewGame = function () {
    gameState.reset();
    gameState.startTimer();
    collectInitialClues();

    setTimeout(() => {
      router.navigate('/scene/study');
      setTimeout(showCaseBriefing, 700);
    }, 350);
  };

  window.continueGame = function () {
    if (!hasSavedGame()) return;
    gameState.startTimer();
    router.navigate(getResumeRoute());
  };

  window.acceptCase = window.startNewGame;

  function showNotebookHint() {
    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer || document.getElementById('notebook-hint')) return;

    const hint = document.createElement('div');
    hint.id = 'notebook-hint';
    hint.innerHTML = `
      <div class="notebook-hint-icon">📓</div>
      <div class="notebook-hint-copy">
        <div class="notebook-hint-title">线索已收进笔记本</div>
        <div class="notebook-hint-text">点击右下角笔记本，可以查看每条线索的详细信息。</div>
      </div>
      <button class="notebook-hint-close" onclick="closeNotebookHint()">知道了</button>
    `;

    uiLayer.appendChild(hint);
    hint.offsetHeight;
    hint.classList.add('show');

    setTimeout(() => {
      if (document.body.contains(hint)) closeNotebookHint();
    }, 7000);
  }

  window.closeNotebookHint = function () {
    const hint = document.getElementById('notebook-hint');
    if (!hint) return;
    hint.classList.remove('show');
    setTimeout(() => hint.remove(), 300);
  };

  // ---- 地图页面 ----
  function showMap() {
    const container = document.getElementById('scene-container');
    if (!container) return;

    setAppChromeVisible(true);

    const nodes = [
      { id: 'study', name: '书房', icon: '📚', desc: '犯罪现场', x: 62, y: 30 },
      { id: 'living-room', name: '客厅', icon: '🛋️', desc: '嫌疑人访谈', x: 47, y: 54 },
      { id: 'gallery', name: '画廊', icon: '🖼️', desc: '艺术品走廊', x: 34, y: 42 },
      { id: 'bedrooms', name: '客房区', icon: '🛏️', desc: '嫌疑人房间', x: 68, y: 52 },
      { id: 'greenhouse', name: '植物温室', icon: '🌿', desc: '后院温室', x: 20, y: 78 },
      { id: 'office', name: '赵雅琴办公室', icon: '🏢', desc: '馆长室', x: 19, y: 42 },
      { id: 'library', name: '古籍室', icon: '📜', desc: '恒温藏书间', x: 30, y: 26 },
      { id: 'garden', name: '花园', icon: '🌸', desc: '山庄后花园', x: 43, y: 78 },
      { id: 'basement', name: '地下室', icon: '🕯️', desc: '隐藏储藏区', x: 70, y: 78 },
      { id: 'police-station', name: '刑侦支队', icon: '🏛️', desc: '警局协查', x: 14, y: 18 },
      { id: 'forensic-office', name: '法医办公室', icon: '🧬', desc: '毒理复检', x: 86, y: 68 },
      { id: 'case-archive', name: '旧案档案室', icon: '🗃️', desc: '旧案关联', x: 86, y: 86 },
      { id: 'reasoning', name: '推理室', icon: '🔍', desc: '最终推理', x: 84, y: 25 }
    ];

    const routeLines = [
      ['study', 'living-room'],
      ['study', 'gallery'],
      ['study', 'library'],
      ['living-room', 'gallery'],
      ['living-room', 'bedrooms'],
      ['living-room', 'garden'],
      ['living-room', 'basement'],
      ['garden', 'greenhouse'],
      ['gallery', 'office'],
      ['office', 'library'],
      ['library', 'reasoning'],
      ['police-station', 'forensic-office'],
      ['police-station', 'case-archive'],
      ['police-station', 'reasoning']
    ];
    const nodeById = Object.fromEntries(nodes.map(node => [node.id, node]));
    const unlockedNodes = nodes.filter(node => gameState.isSceneUnlocked(node.id));

    const routesHtml = routeLines
      .filter(([from, to]) => gameState.isSceneUnlocked(from) && gameState.isSceneUnlocked(to))
      .map(([from, to]) => {
        const a = nodeById[from];
        const b = nodeById[to];
        return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`;
      }).join('');

    const nodesHtml = unlockedNodes.map(node => {
      const completed = node.id === 'reasoning'
        ? false
        : sceneManager.isSceneComplete(node.id);
      const completedMark = completed ? ' ✓' : '';
      const onClick = node.id === 'reasoning'
        ? `router.navigate('/reasoning')`
        : `router.navigate('/scene/${node.id}')`;

      return `
        <button class="map-node" style="--map-x:${node.x}%;--map-y:${node.y}%;" onclick="${onClick}">
          <div class="map-node-icon">${node.icon}</div>
          <div class="map-node-name">${node.name}${completedMark}</div>
          <div class="map-node-clues">${node.desc}</div>
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="scene map-screen">
        <div class="map-shell">
          <div class="map-header">
            <h2>调查地图</h2>
            <p>在山庄现场与外部协查地点之间推进调查</p>
          </div>
          <div class="estate-map">
            <svg class="map-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              ${routesHtml}
            </svg>
            <div class="map-landmark map-landmark-main">主楼</div>
            <div class="map-landmark map-landmark-yard">雨中花园</div>
            <div class="map-landmark map-landmark-police">外部协查</div>
            ${nodesHtml}
          </div>
          <div class="map-status">已解锁区域 ${unlockedNodes.length} / ${nodes.length}</div>
        </div>
      </div>
    `;
  }

  // ---- 音频设置 ----
  function getAudioSettings() {
    const saved = localStorage.getItem('twilight-museum-audio');
    const defaults = { bgmOn: true, bgmVolume: 25 };
    if (saved) {
      try { return { ...defaults, ...JSON.parse(saved) }; } catch {}
    }
    return defaults;
  }

  function saveAudioSettings(settings) {
    localStorage.setItem('twilight-museum-audio', JSON.stringify(settings));
  }

  window.toggleBGM = function (btn) {
    const settings = getAudioSettings();
    settings.bgmOn = !settings.bgmOn;
    saveAudioSettings(settings);
    btn.textContent = settings.bgmOn ? '开启' : '关闭';
    btn.className = `settings-toggle ${settings.bgmOn ? 'on' : 'off'}`;
    if (settings.bgmOn) {
      audioManager.enabled = true;
      audioManager.playBGM('bgm-mystery');
    } else {
      audioManager.stopBGM();
    }
  };

  window.setBGMVolume = function (val) {
    const settings = getAudioSettings();
    settings.bgmVolume = parseInt(val);
    saveAudioSettings(settings);
    const label = document.querySelector('.volume-label');
    if (label) label.textContent = `${val}%`;
    // 更新当前播放的BGM音量
    if (audioManager._bgm) {
      audioManager._bgm.volume = val / 100;
    }
  };

  window.restartGame = function () {
    if (confirm('确定要重新开始吗？所有进度将丢失。')) {
      gameState.reset();
      audioManager.stopAmbience();
      audioManager.stopBGM();
      router.navigate('/intro');
    }
  };

  // ---- 结局页面 ----
  function showEnding(type) {
    const container = document.getElementById('scene-container');
    if (!container) return;

    const count = gameState.clueCount();
    const total = Object.keys(clueSystem.clues).length;
    const playTime = Utils.formatTime(gameState.getPlayTime());
    const score = type === 'correct' ? 100 : 0;

    if (type === 'correct') {
      container.innerHTML = `
        <div class="scene gradient-bg" style="align-items:center;justify-content:center;">
          <div class="ending-container">
            <h1 class="ending-title">真相大白</h1>
            <div class="ending-text">
              <p>你站在众人面前，目光扫过每一张脸。</p>
              <p>"<strong>我已经知道真相了。</strong>"</p>
              <p>你转向赵雅琴，她的眼神依然平静，但嘴角微微颤抖。</p>
              <p>"凶手就是你，赵雅琴。或者说......<strong>赵小琴</strong>。"</p>
              <p>房间里一片寂静。</p>
              <p>"二十年前，你的父亲赵明远被陈墨白用赝品欺骗，失去了毕生收藏，最终抑郁自杀。陈墨白假惺惺地收养了你，实际上是为了掩盖真相。"</p>
              <p>"你在大学期间主修化学和古籍修复，三年前终于找到了真相。你精心策划了这场复仇——在植物温室培育乌头草，提取乌头碱，研制出毒墨水。"</p>
              <p>"一周前，你以修复古籍为名，在《山居笔记》第四十七页添加了用毒墨水书写的批注。你知道陈墨白有舔手指翻页的习惯......"</p>
              <p>"品鉴会当天，你进入书房整理古籍，实际上是确认毒药已经生效。当陈墨白翻阅到那一页时，乌头碱通过他的口腔黏膜进入血液......"</p>
              <p>"他的死，看起来就像心脏病发作。但你知道，这是<strong>复仇</strong>。"</p>
              <p>赵雅琴闭上眼睛，泪水顺着脸颊滑落。</p>
              <p>"是的，"她轻声说，"我等这一天，等了二十年......"</p>
            </div>
            <div class="ending-stats">
              <div class="stat-item">
                <div class="stat-label">收集线索</div>
                <div class="stat-value">${count}/${total}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">游戏用时</div>
                <div class="stat-value">${playTime}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">推理得分</div>
                <div class="stat-value">${score}分</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">结局</div>
                <div class="stat-value">完美</div>
              </div>
            </div>
            <div style="display:flex;gap:16px;justify-content:center;">
              <button class="btn-primary" onclick="gameState.reset();router.navigate('/intro')">重新开始</button>
            </div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="scene gradient-bg" style="align-items:center;justify-content:center;">
          <div class="ending-container">
            <h1 class="ending-title" style="color:var(--color-danger);">推理失败</h1>
            <div class="ending-text" style="text-align:center;">
              <p>你做出了推理，但......有些地方不对。</p>
              <p>"很遗憾，你的推理有误。"委托人摇了摇头。</p>
              <p>真正的凶手依然隐藏在人群中。</p>
              <p>也许你遗漏了某些关键线索，</p>
              <p>也许你的推理链条有断裂......</p>
              <p>但真相不会消失，它只是在等待下一位侦探的到来。</p>
            </div>
            <div class="ending-stats">
              <div class="stat-item">
                <div class="stat-label">收集线索</div>
                <div class="stat-value">${count}/${total}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">游戏用时</div>
                <div class="stat-value">${playTime}</div>
              </div>
            </div>
            <div style="display:flex;gap:16px;justify-content:center;">
              <button class="btn-primary" onclick="router.navigate('/reasoning')">重新推理</button>
              <button onclick="router.navigate('/map')">返回调查</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ---- 设置面板 ----
  window.toggleSettingsPanel = function () {
    let panel = document.getElementById('settings-panel');
    if (panel && panel.classList.contains('show')) {
      closeSettingsPanel();
      return;
    }
    openSettingsPanel();
  };

  function openSettingsPanel() {
    const settings = getAudioSettings();

    let panel = document.getElementById('settings-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'settings-panel';
      document.getElementById('ui-layer').appendChild(panel);
    }

    panel.innerHTML = `
      <h3 class="settings-title">⚙️ 设置</h3>
      <div class="settings-row">
        <label>背景音乐</label>
        <div class="settings-control">
          <button class="settings-toggle ${settings.bgmOn ? 'on' : 'off'}"
                  onclick="toggleBGM(this)">
            ${settings.bgmOn ? '开启' : '关闭'}
          </button>
        </div>
      </div>
      <div class="settings-row">
        <label>音乐音量</label>
        <div class="settings-control">
          <input type="range" min="0" max="100" value="${settings.bgmVolume}"
                 oninput="setBGMVolume(this.value)">
          <span class="volume-label">${settings.bgmVolume}%</span>
        </div>
      </div>
      <div class="settings-row">
        <label>重新开始</label>
        <div class="settings-control">
          <button class="settings-restart" onclick="restartGame()">
            重置游戏
          </button>
        </div>
      </div>
    `;

    panel.offsetHeight;
    panel.classList.add('show');

    // 点击外部关闭
    setTimeout(() => {
      document.addEventListener('click', closeSettingsOnOutsideClick);
    }, 50);
  }

  function closeSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    if (panel) {
      panel.classList.remove('show');
    }
    document.removeEventListener('click', closeSettingsOnOutsideClick);
  }

  function closeSettingsOnOutsideClick(e) {
    const panel = document.getElementById('settings-panel');
    const btn = document.getElementById('settings-btn');
    if (panel && !panel.contains(e.target) && e.target !== btn) {
      closeSettingsPanel();
    }
  }

  // ---- 场景解锁提示 ----
  function showUnlockToast(sceneId) {
    const names = {
      library: '古籍室',
      greenhouse: '植物温室',
      office: '赵雅琴办公室',
      basement: '地下室',
      'police-station': '市局刑侦支队',
      'forensic-office': '法医办公室',
      'case-archive': '旧案档案室',
      reasoning: '推理室',
      'office-secret': '暗格'
    };

    const toast = document.createElement('div');
    toast.className = 'unlock-toast';
    toast.innerHTML = `
      <span class="toast-icon">🔓</span>
      <span class="toast-text">新区域解锁: ${names[sceneId] || sceneId}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

})();
