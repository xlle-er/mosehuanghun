/* ============================================
   Reasoning - 推理系统
   ============================================ */

class ReasoningSystem {
  constructor() {
    this.answers = {};
    this.submitted = false;
  }

  // 渲染推理页面
  render() {
    const container = document.getElementById('scene-container');
    if (!container) return;

    if (!gameState.hasAllCoreClues()) {
      container.innerHTML = `
        <div class="scene" style="background:var(--color-bg-scene);">
          <div class="scene-header">
            <button onclick="router.navigate('/map')">← 返回</button>
            <h2 class="scene-title">推理室</h2>
          </div>
          <div class="scene-description" style="text-align:center;max-width:500px;">
            <p style="font-size:48px;margin-bottom:24px;">🔒</p>
            <p>推理室尚未完全解锁。</p>
            <p style="color:var(--color-text-muted);">你需要收集所有 18 条核心线索才能进行最终推理。</p>
            <p style="color:var(--color-text-muted);margin-top:12px;">
              当前已收集: ${gameState.get('collectedClues').filter(id => id.startsWith('C')).length} / 18 条核心线索
            </p>
            <button class="btn-primary" style="margin-top:24px;" onclick="router.navigate('/map')">
              返回继续调查
            </button>
          </div>
        </div>
      `;
      return;
    }

    this.answers = {};
    this.submitted = false;

    const questions = this._getQuestions();

    container.innerHTML = `
      <div class="scene" style="background:var(--color-bg-scene);">
        <div class="scene-header">
          <button onclick="router.navigate('/map')">← 返回</button>
          <h2 class="scene-title">推理室</h2>
        </div>
        <div class="scene-description" style="text-align:center;">
          <p>请根据你收集的所有线索，回答以下问题。</p>
          <p style="color:var(--color-text-muted);">你的推理将决定案件的结局。</p>
        </div>
        <div class="reasoning-container">
          ${questions.map((q, qi) => this._renderQuestion(q, qi)).join('')}
          <div style="text-align:center;margin-top:32px;">
            <button class="btn-primary btn-large" onclick="reasoning.submit()" id="submit-btn">
              提交推理
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染问题
  _renderQuestion(question, index) {
    const optionsHtml = question.options.map((opt, oi) => `
      <div class="reasoning-option" id="q${index}-o${oi}" onclick="reasoning.select(${index}, ${oi})">
        <div class="option-radio"></div>
        <div class="option-text">${opt.label}</div>
      </div>
    `).join('');

    const hint = question.multiSelect
      ? `<p style="color:var(--color-text-muted);font-size:12px;margin-top:8px;">（可多选，选择${question.selectCount || question.correctOptions.length}个）</p>`
      : '';

    return `
      <div class="reasoning-question">
        <h3>问题${index + 1}：${question.text}</h3>
        ${hint}
        <div class="reasoning-options">${optionsHtml}</div>
      </div>
    `;
  }

  // 选择答案
  select(questionIndex, optionIndex) {
    if (this.submitted) return;

    const question = this._getQuestions()[questionIndex];

    if (question.multiSelect) {
      // 多选题：切换选中状态
      if (!this.answers[questionIndex]) {
        this.answers[questionIndex] = [];
      }
      const arr = this.answers[questionIndex];
      const idx = arr.indexOf(optionIndex);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        arr.push(optionIndex);
      }
      // 更新 UI
      question.options.forEach((_, oi) => {
        const el = document.getElementById(`q${questionIndex}-o${oi}`);
        if (el) {
          el.classList.toggle('selected', arr.includes(oi));
        }
      });
    } else {
      // 单选题
      this.answers[questionIndex] = optionIndex;
      // 更新 UI
      question.options.forEach((_, oi) => {
        const el = document.getElementById(`q${questionIndex}-o${oi}`);
        if (el) {
          el.classList.toggle('selected', oi === optionIndex);
        }
      });
    }
  }

  // 提交推理
  submit() {
    if (this.submitted) return;

    const questions = this._getQuestions();

    // 检查是否回答了所有问题
    for (let i = 0; i < questions.length; i++) {
      const ans = this.answers[i];
      if (ans === undefined || (Array.isArray(ans) && ans.length === 0)) {
        alert(`请回答问题${i + 1}`);
        return;
      }
    }

    this.submitted = true;

    // 计算得分
    let score = 0;
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    questions.forEach((q, i) => {
      const ans = this.answers[i];
      if (q.multiSelect) {
        // 多选题：比较数组
        const correct = q.correctOptions.slice().sort();
        const selected = ans.slice().sort();
        if (correct.length === selected.length &&
            correct.every((v, idx) => v === selected[idx])) {
          score += q.points;
        }
      } else {
        // 单选题
        if (ans === q.correct) {
          score += q.points;
        }
      }
    });

    // 禁用提交按钮
    const btn = document.getElementById('submit-btn');
    if (btn) btn.disabled = true;

    // 显示结果
    setTimeout(() => {
      if (score >= maxScore * 0.8) {
        gameState.set('endings', { ...gameState.get('endings'), correct: true });
        router.navigate('/ending/correct');
      } else if (score >= maxScore * 0.5) {
        this._showPartialResult(score, questions, maxScore);
      } else {
        gameState.set('endings', { ...gameState.get('endings'), wrong: true });
        router.navigate('/ending/wrong');
      }
    }, 1000);
  }

  // 显示部分正确结果
  _showPartialResult(score, questions, maxScore) {
    const container = document.getElementById('scene-container');
    if (!container) return;

    const self = this;
    const results = questions.map((q, i) => {
      let correct;
      if (q.multiSelect) {
        const c = q.correctOptions.slice().sort();
        const s = self.answers[i].slice().sort();
        correct = c.length === s.length && c.every((v, idx) => v === s[idx]);
      } else {
        correct = self.answers[i] === q.correct;
      }
      return `<p style="color:${correct ? 'var(--color-success)' : 'var(--color-danger)'}">
        ${correct ? '✓' : '✗'} 问题${i + 1}：${correct ? '正确' : '错误'}
      </p>`;
    }).join('');

    container.innerHTML = `
      <div class="scene" style="background:var(--color-bg-scene);">
        <div class="reasoning-container" style="text-align:center;padding-top:100px;">
          <h2 style="color:var(--color-warning);margin-bottom:24px;">推理部分正确</h2>
          <p style="margin-bottom:16px;">得分: ${score}/${maxScore}</p>
          ${results}
          <p style="color:var(--color-text-muted);margin-top:24px;">你的推理方向基本正确，但某些细节还需要重新思考。</p>
          <div style="margin-top:32px;display:flex;gap:16px;justify-content:center;">
            <button class="btn-primary" onclick="reasoning.render()">重新推理</button>
            <button onclick="router.navigate('/map')">返回调查</button>
          </div>
        </div>
      </div>
    `;
  }

  // 获取问题
  _getQuestions() {
    return [
      {
        text: '谁是凶手？',
        points: 30,
        correct: 3,
        options: [
          { label: '方志远 — 商业合伙人' },
          { label: '高远航 — 艺术品鉴定师' },
          { label: '陈子轩 — 侄子' },
          { label: '赵雅琴 — 博物馆馆长' },
          { label: '钱伯年 — 古董商' },
          { label: '林婉清 — 妻子' },
          { label: '周叔同 — 秘书' }
        ]
      },
      {
        text: '作案手法是什么？',
        points: 25,
        correct: 2,
        options: [
          { label: '在茶水中下毒' },
          { label: '替换心脏病药物' },
          { label: '在古籍上涂抹毒药，通过舔手指摄入' },
          { label: '在食物中下毒' }
        ]
      },
      {
        text: '作案动机是什么？',
        points: 25,
        correct: 2,
        options: [
          { label: '经济利益 — 遗产或债务' },
          { label: '掩盖犯罪 — 造假或走私' },
          { label: '为父复仇 — 赵明远事件' },
          { label: '情感纠纷 — 外遇或婚姻' }
        ]
      },
      {
        text: '以下哪三个是关键证据？',
        points: 20,
        multiSelect: true,
        correctOptions: [0, 1, 2],
        options: [
          { label: '赵明远的遗书' },
          { label: '乌头草培育日志' },
          { label: '古籍修复记录' },
          { label: '方志远的赌博记录' },
          { label: '高远航的假证书' },
          { label: '监控录像' }
        ]
      },
      {
        text: '警局外部协查最关键的作用是什么？',
        points: 15,
        correct: 1,
        options: [
          { label: '直接证明所有经济纠纷都是假的' },
          { label: '将赵明远旧案、赝品案和毒理复检方向串联起来' },
          { label: '证明方志远一定不是凶手' },
          { label: '替代现场调查，直接给出凶手姓名' }
        ]
      },
      {
        text: '以下哪两项最能排除常规投毒路径？',
        points: 15,
        multiSelect: true,
        correctOptions: [0, 1],
        options: [
          { label: '茶杯检测正常' },
          { label: '心脏病药检查正常' },
          { label: '钱伯年面临赔偿' },
          { label: '林婉清有外遇' },
          { label: '画廊有可疑鉴定证书' }
        ]
      }
    ];
  }
}

// 全局实例
var reasoning = new ReasoningSystem();
