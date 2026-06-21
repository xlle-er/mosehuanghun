/* ============================================
   Audio - 音频管理
   ============================================ */

class AudioManager {
  constructor() {
    this.sounds = {};
    this.ambience = null;
    this.currentAmbience = null;
    this.enabled = true;
    this._initialized = false;
  }

  // 预加载所有音频
  init() {
    if (this._initialized) return;
    this._initialized = true;

    // 背景音效（循环）
    this._load('rain-ambient',   'assets/audio/rain-ambient.mp3',   { loop: true, volume: 0.30 });
    this._load('clock-ticking',  'assets/audio/clock-ticking.mp3',  { loop: true, volume: 0.15 });
    this._load('dripping',       'assets/audio/dripping.mp3',       { loop: true, volume: 0.20 });

    // 交互音效（单次）
    this._load('clue-found',     'assets/audio/clue-found.mp3',     { loop: false, volume: 0.22 });
    this._load('suspense-sting', 'assets/audio/suspense-sting.mp3', { loop: false, volume: 0.30 });
    this._load('door-creak',     'assets/audio/door-creak.mp3',     { loop: false, volume: 0.40 });
    this._load('paper-flip',     'assets/audio/paper-flip.mp3',     { loop: false, volume: 0.30 });
    this._load('footsteps',      'assets/audio/footsteps.mp3',      { loop: false, volume: 0.30 });
    this._load('thunder',        'assets/audio/thunder.mp3',        { loop: false, volume: 0.50 });

    // 背景音乐（循环）
    this._load('bgm-mystery',    'assets/audio/bgm-mystery.mp3',    { loop: true, volume: 0.25 });
    this._load('bgm-tension',    'assets/audio/bgm-tension.mp3',    { loop: true, volume: 0.30 });
    this._load('bgm-ending',     'assets/audio/bgm-ending.mp3',     { loop: false, volume: 0.35 });
  }

  // 内部：加载音频
  _load(name, path, opts = {}) {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.loop = !!opts.loop;
      audio.volume = opts.volume !== undefined ? opts.volume : 0.5;
      this.sounds[name] = audio;
    } catch (e) {
      console.warn(`[Audio] Failed to load: ${name}`, e);
    }
  }

  // 播放一次性音效
  play(name) {
    if (!this.enabled) return;
    const src = this.sounds[name];
    if (!src) return;

    try {
      // 克隆节点以支持重叠播放
      const sfx = src.cloneNode();
      sfx.volume = src.volume;
      sfx.play().catch(() => {});
    } catch (e) {
      // 静默处理
    }
  }

  // 播放背景音效（环境音，同一时间只播放一个）
  playAmbience(name) {
    if (!this.enabled) return;
    if (this.currentAmbience === name) return;

    this.stopAmbience();

    const src = this.sounds[name];
    if (!src) return;

    try {
      this.ambience = src.cloneNode();
      this.ambience.loop = true;
      this.ambience.volume = src.volume;
      this.ambience.play().catch(() => {});
      this.currentAmbience = name;
    } catch (e) {
      // 静默处理
    }
  }

  // 停止背景音效
  stopAmbience() {
    if (this.ambience) {
      try {
        this.ambience.pause();
        this.ambience.currentTime = 0;
      } catch (e) {}
      this.ambience = null;
      this.currentAmbience = null;
    }
  }

  // 播放背景音乐（BGM，与环境音独立）
  playBGM(name) {
    if (!this.enabled) return;

    // 检查用户设置
    let userVolume = 0.25;
    try {
      const saved = JSON.parse(localStorage.getItem('twilight-museum-audio') || '{}');
      if (saved.bgmOn === false) return;
      if (saved.bgmVolume !== undefined) userVolume = saved.bgmVolume / 100;
    } catch {}

    this.stopBGM();

    const src = this.sounds[name];
    if (!src) return;

    try {
      this._bgm = src.cloneNode();
      this._bgm.loop = src.loop;
      this._bgm.volume = userVolume;
      this._bgm.play().catch(() => {});
      this._currentBGM = name;
    } catch (e) {
      // 静默处理
    }
  }

  // 停止背景音乐
  stopBGM() {
    if (this._bgm) {
      try {
        this._bgm.pause();
        this._bgm.currentTime = 0;
      } catch (e) {}
      this._bgm = null;
      this._currentBGM = null;
    }
  }

  // 切换静音
  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopAmbience();
      this.stopBGM();
    }
  }
}

// 全局实例
const audioManager = new AudioManager();
