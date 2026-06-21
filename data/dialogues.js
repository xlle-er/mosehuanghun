/* ============================================
   Dialogues Data - 对话数据
   ============================================ */

window.DIALOGUES_DATA = {

  // ==========================================
  //  委托人 - 开场任务布置
  // ==========================================
  'commissioner': {
    id: 'commissioner',
    name: '遗嘱执行人',
    portrait: '',
    role: '委托人',
    nodes: {
      'start': {
        text: '你终于到了。陈墨白先生昨晚死在这间书房，这里就是第一现场。警方初步按心脏病处理，但我不相信一切这么简单。三天前，他刚刚改过遗嘱；今晚在场的人，每个人都有自己的理由隐瞒。',
        options: [
          { text: '我要先确认死亡现场。', next: 'scene-task' },
          { text: '哪些信息可以先给我？', next: 'known-info' },
          { text: '（开始调查）', next: null }
        ]
      },
      'scene-task': {
        text: '先从第一现场开始。书桌、古籍、茶杯、药瓶、文件柜，任何看似平常的东西都不要放过。等你有了现场依据，再去问人；没有证据的追问只会让嫌疑人提前警觉。',
        options: [
          { text: '明白，从书房开始。', next: null }
        ]
      },
      'known-info': {
        text: '你已经拿到三份基础材料：法医初检、品鉴会邀请函、山庄布局图。它们已经放进你的线索笔记本。右下角的笔记本可以随时查看每条线索的详细内容。',
        options: [
          { text: '我会随时整理线索。', next: 'scene-task' },
          { text: '（开始调查）', next: null }
        ]
      }
    }
  },

  // ==========================================
  //  方志远 - 商业合伙人
  // ==========================================
  'fang': {
    id: 'fang',
    name: '方志远',
    portrait: 'portrait-fang.jpg',
    role: '商业合伙人',
    longText: '方志远，58岁，陈墨白的商业合伙人，共同经营「墨白文化投资公司」。品鉴会当天下午三点十分进入书房讨论公司事务，约三点二十五分离开。\n\n他看起来很紧张，不停擦拭额头的汗水，手指无意识地敲打着膝盖。谈到公司事务时，他明显变得更加谨慎。',
    nodes: {
      'start': {
        text: '方志远看起来很紧张，不停地擦拭额头的汗水。他坐在沙发左侧，手指无意识地敲打着膝盖。',
        options: [
          { text: '请描述一下品鉴会当天的活动。', clues: ['A03'], next: 'activity' },
          { text: '你和陈墨白的公司最近情况如何？', next: 'company' },
          { text: '（结束对话）', next: null }
        ]
      },
      'activity': {
        text: '品鉴会从下午两点开始，陈先生展示了几件新收藏品。三点左右他回了书房，我三点十分左右去找他讨论公司事务，大概待了十五分钟。',
        options: [
          { text: '在书房讨论了什么？', next: 'discussion' },
          { text: '你注意到书房里有什么异常吗？', next: 'study-observation' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'discussion': {
        text: '主要是公司最近的一些项目安排。陈先生想核对几份文件，我跟他说流程都在推进，让他放心。他最近变得很多疑。',
        options: [
          { text: '我看到你的赌博记录，你似乎急需用钱。（出示证据）', next: 'gambling', requiresClue: 'I01' },
          { text: '我看到公司账目上有800万去向不明。（出示证据）', next: 'finance', requiresClue: 'I02' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'gambling': {
        text: '（方志远的手指停了一下）那只是我自己的问题。我确实输了钱，但我没有动公司的账，更没有理由杀陈先生。',
        options: [
          { text: '可是公司账目上也有800万去向不明。（出示证据）', next: 'confront', requiresClue: 'I02' },
          { text: '我会继续核实。（结束）', next: null }
        ]
      },
      'finance': {
        text: '（方志远的脸色变了变）那只是暂时周转。你知道的，做生意难免会有波动。陈先生年纪大了，有时候会过度担心。',
        options: [
          { text: '我看到公司账目上有800万去向不明。（出示证据）', next: 'confront', requiresClue: 'I02' },
          { text: '好吧，我理解。（结束）', next: null }
        ]
      },
      'confront': {
        text: '（方志远沉默了很久）......好吧，我承认。那笔钱是我拿的。我赌博输了一些钱，需要填补窟窿。但我没有杀陈先生！他活着对我更有利——如果他死了，账目的问题就会暴露！',
        options: [
          { text: '我需要时间核实你说的话。（结束）', next: null }
        ]
      },
      'study-observation': {
        text: '没什么特别的。桌上摊着一本古籍，茶杯里的茶还是满的。陈先生看起来心情不太好，可能是公司的事让他烦心。',
        options: [
          { text: '（返回）', next: 'start' }
        ]
      },
      'company': {
        text: '公司？一切都好，一切都好。我们合作了很多年了，陈先生是个很好的合伙人。',
        options: [
          { text: '我看到你的赌博记录，你似乎急需用钱。（出示证据）', next: 'gambling', requiresClue: 'I01' },
          { text: '我看到公司账目上有800万去向不明。（出示证据）', next: 'finance', requiresClue: 'I02' },
          { text: '（返回）', next: 'start' }
        ]
      }
    }
  },

  // ==========================================
  //  高远航 - 艺术品鉴定师
  // ==========================================
  'gao': {
    id: 'gao',
    name: '高远航',
    portrait: 'portrait-gao.jpg',
    role: '艺术品鉴定师',
    longText: '高远航，45岁，陈墨白的私人艺术品鉴定师。品鉴会当天下午三点半进入书房鉴定一幅画作，约三点四十分离开。\n\n他戴着金丝眼镜，神情镇定，说话条理清晰。据称与陈墨白合作五年，关系良好，但业内对他的某些鉴定结论评价并不一致。',
    nodes: {
      'start': {
        text: '高远航站在窗边，望着窗外的雨。他转过身来，推了推眼镜，神情镇定。',
        options: [
          { text: '请描述一下你在品鉴会当天做了什么。', clues: ['A04'], next: 'activity' },
          { text: '你和陈墨白是什么关系？', next: 'relationship' },
          { text: '（结束对话）', next: null }
        ]
      },
      'activity': {
        text: '品鉴会上我帮陈先生鉴定了几件新收的画作。三点半左右，我去书房找他确认一幅画的鉴定结果。大概待了十分钟。',
        options: [
          { text: '鉴定结果如何？', next: 'appraisal' },
          { text: '你在书房注意到什么吗？', next: 'study-observation' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'appraisal': {
        text: '那幅画是真品，明代的山水画，价值不菲。陈先生很高兴。',
        options: [
          { text: '我看到你之前出过一些"可疑"的鉴定证书。（出示证据）', next: 'confront', requiresClue: 'I03' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'confront': {
        text: '（高远航的表情僵了一下）那是......误会。有些古董的鉴定本来就存在争议，不同专家有不同看法。我承认有些判断可能不够准确，但我绝没有故意造假。',
        options: [
          { text: '这张名片是怎么回事？（出示证据）', next: 'smuggling', requiresClue: 'I04' },
          { text: '好吧。（结束）', next: null }
        ]
      },
      'smuggling': {
        text: '（高远航的脸色变得苍白）这......这是我一个朋友给我的。我只是帮忙介绍了一些生意，不知道他们是干什么的。我和他们没有深层关系。',
        options: [
          { text: '我会继续调查的。（结束）', next: null }
        ]
      },
      'relationship': {
        text: '我是陈先生的私人鉴定师，帮他鉴定艺术品的真伪。合作五年了，关系一直不错。他信任我的专业判断。',
        options: [
          { text: '（返回）', next: 'start' }
        ]
      },
      'study-observation': {
        text: '书房里一切正常。陈先生坐在书桌旁，桌上摊着一本古籍。我注意到他翻书的时候有个习惯——舔手指。不过这没什么奇怪的，很多老先生都这样。',
        options: [
          { text: '（返回）', next: 'start' }
        ]
      }
    }
  },

  // ==========================================
  //  陈子轩 - 侄子
  // ==========================================
  'chen': {
    id: 'chen',
    name: '陈子轩',
    portrait: 'portrait-chen.jpg',
    role: '侄子',
    longText: '陈子轩，28岁，陈墨白的侄子，法定继承人之一。品鉴会当天下午两点四十五分进入书房借书，约三点离开。\n\n他缩在角落里，眼神闪烁，看起来很不自在。他似乎在回避关于钱和继承的话题。',
    nodes: {
      'start': {
        text: '陈子轩缩在角落里，眼神闪烁，看起来很不自在。他不停地看手机，似乎在等什么消息。',
        options: [
          { text: '请描述一下你当天的活动。', clues: ['A05'], next: 'activity' },
          { text: '你和叔叔的关系怎么样？', next: 'relationship' },
          { text: '（结束对话）', next: null }
        ]
      },
      'activity': {
        text: '品鉴会两点开始，我三点左右去书房找叔叔借一本书。待了大概十五分钟就出来了。',
        options: [
          { text: '借了什么书？', next: 'book' },
          { text: '书房里有什么特别的吗？', next: 'study-observation' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'book': {
        text: '一本关于古代瓷器的书。我对收藏也有兴趣，想学习学习。',
        options: [
          { text: '你知道叔叔最近改了遗嘱吗？（出示证据）', next: 'will', requiresClue: 'I05' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'will': {
        text: '改遗嘱？我不知道。他为什么要改？（看起来很惊讶）我一直以为我是主要继承人......',
        options: [
          { text: '我看到你欠了200万的赌债。（出示证据）', next: 'debt', requiresClue: 'I06' },
          { text: '也许你应该问问律师。（结束）', next: null }
        ]
      },
      'debt': {
        text: '（陈子轩的脸色变得苍白）那......那是我自己的事。我叔叔不知道这些。我确实需要钱，但我没有杀他！我不知道遗嘱改了，我以为他死了我就能继承遗产......等等，这听起来不太好。',
        options: [
          { text: '确实不太好。（结束）', next: null }
        ]
      },
      'relationship': {
        text: '还行吧。叔叔没有孩子，一直把我当儿子看。不过最近他变得很多疑，不太信任任何人。',
        options: [
          { text: '书房的钥匙有几把？', clues: ['C13'], next: 'keys' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'keys': {
        text: '三把。叔叔一把，周叔同一把，赵雅琴一把。赵雅琴是博物馆馆长，叔叔给了她一把钥匙，方便她整理古籍。',
        options: [
          { text: '（返回）', next: 'start' }
        ]
      },
      'study-observation': {
        text: '没什么特别的。叔叔坐在书桌旁看书，桌上有一杯茶。对了，保险箱的密码是叔叔的生日——19520315。如果你需要的话。',
        options: [
          { text: '谢谢，这很有用。（结束）', next: null }
        ]
      }
    }
  },

  // ==========================================
  //  赵雅琴 - 博物馆馆长（真凶）
  // ==========================================
  'zhao': {
    id: 'zhao',
    name: '赵雅琴',
    portrait: 'portrait-zhao.jpg',
    role: '博物馆馆长',
    longText: '赵雅琴，30岁，墨白山庄博物馆馆长。品鉴会当天下午四点进入书房整理古籍，约四点二十分钟离开。\n\n她表情平静得近乎冷漠，眼神深邃而难以捉摸。据她自称是陈墨白的养女，十岁时被收养。她主修化学和古籍修复专业，在博物馆工作两年，并拥有书房钥匙。',
    nodes: {
      'start': {
        text: '赵雅琴靠着书架，表情平静得近乎冷漠。她看着你，眼神深邃而难以捉摸。',
        options: [
          { text: '请描述一下你的工作。', next: 'work' },
          { text: '品鉴会当天你做了什么？', clues: ['A06'], next: 'activity' },
          { text: '你和陈墨白是什么关系？', next: 'relationship' },
          { text: '（结束对话）', next: null }
        ]
      },
      'work': {
        text: '我是博物馆的馆长，负责藏品的管理、保养和修复。我学的是化学和古籍修复专业，这份工作正好用上了。',
        options: [
          { text: '古籍修复是什么意思？', next: 'repair' },
          { text: '证书墙显示你还学过分析化学。（出示证据）', next: 'chemistry', requiresClue: 'B18' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'chemistry': {
        text: '文物保护本来就离不开材料学和化学。纸张酸化、颜料稳定、墨迹固定，都需要这些知识。你如果把它理解成"会配毒药"，那就太武断了。',
        options: [
          { text: '我只是确认你的专业能力。（返回）', next: 'work' }
        ]
      },
      'repair': {
        text: '就是对破损、老化的古籍进行修复，包括修补纸张、还原字迹、补充缺失内容等。这是一门需要耐心和技术的工作。',
        options: [
          { text: '最近修复过什么古籍吗？', next: 'recent-repair' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'recent-repair': {
        text: '上周修复了《山居笔记》的第47页，有一些批注因为年代久远已经模糊了。我根据相关文献进行了补充。',
        options: [
          { text: '修复记录上写着用了传统墨汁，具体是什么墨水？（出示证据）', next: 'ink', requiresClue: 'C05' },
          { text: '墨水柜里为什么有无水乙醇和防腐剂？（出示证据）', next: 'solvent', requiresClue: 'I18' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'ink': {
        text: '传统墨汁，我专门调配过颜色以匹配原书。这是修复工作的基本要求。',
        options: [
          { text: '（记下这个信息）', next: 'start' }
        ]
      },
      'solvent': {
        text: '无水乙醇可以清洁修复工具，也能帮助某些旧墨层稳定。防腐剂是为了防止修复墨水变质。这些材料在修复室里并不罕见。',
        options: [
          { text: '乌头碱资料显示它也可能作为溶剂使用。（出示证据）', next: 'toxin-solvent', requiresClue: 'C09' },
          { text: '（返回）', next: 'recent-repair' }
        ]
      },
      'toxin-solvent': {
        text: '（赵雅琴沉默了两秒）你已经开始把所有普通材料都往毒物上联想了。侦探先生，推理需要证据，不需要想象力。',
        options: [
          { text: '我会继续找证据。（结束）', next: null }
        ]
      },
      'activity': {
        text: '品鉴会两点开始，我四点左右去书房整理古籍。大概待了二十分钟。',
        options: [
          { text: '为什么选择那个时候去？', next: 'timing' },
          { text: '书房里有什么特别的吗？', next: 'study-observation' },
          { text: '花园里有一组通向温室的雨靴印。（出示证据）', next: 'garden-footprints', requiresClue: 'I17' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'garden-footprints': {
        text: '温室本来就有公用雨靴。雨这么大，任何负责维护植物的人都可能穿过。你不能凭一组脚印就说那是我。',
        options: [
          { text: '脚印尺码偏小，时间也很接近你进入书房前后。', next: 'garden-pressure' },
          { text: '（返回）', next: 'activity' }
        ]
      },
      'garden-pressure': {
        text: '（她的眼神冷了一点）我说过，我那天的工作包括检查藏品和环境。至于温室，我没有义务记住每一次经过花园的时间。',
        options: [
          { text: '（结束对话）', next: null }
        ]
      },
      'timing': {
        text: '陈先生下午三点回书房后，我不想打扰他。等到四点左右，我想他应该休息过了，就去整理古籍。这是我的日常工作。',
        options: [
          { text: '你有书房的钥匙？', clues: ['C13'], next: 'keys' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'keys': {
        text: '是的，陈先生给了我一把。作为馆长，我需要随时进入书房和古籍室。',
        options: [
          { text: '（返回）', next: 'start' }
        ]
      },
      'study-observation': {
        text: '一切正常。陈先生在看书，桌上有一杯茶。我整理完古籍就离开了。',
        options: [
          { text: '（返回）', next: 'start' }
        ]
      },
      'relationship': {
        text: '陈先生是我的养父。我十岁的时候父母双亡，是他收养了我，供我上学，给了我这份工作。我很感激他。',
        options: [
          { text: '你的父母是怎么去世的？', next: 'parents' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'parents': {
        text: '（赵雅琴的眼神微微闪烁）父亲是......自杀。他是个收藏家，被人骗了，失去了所有藏品，承受不住打击。母亲在他去世后不久也病逝了。',
        options: [
          { text: '你知道是谁骗了你父亲吗？', next: 'truth-hint' },
          { text: '我很抱歉。（结束）', next: null }
        ]
      },
      'truth-hint': {
        text: '（赵雅琴沉默了很久）......我不知道。那是很久以前的事了。陈先生收养了我，对我很好。这就够了。',
        options: [
          { text: '（我需要更多证据才能继续追问）', next: null }
        ]
      }
    }
  },

  // ==========================================
  //  钱伯年 - 古董商
  // ==========================================
  'qian': {
    id: 'qian',
    name: '钱伯年',
    portrait: 'portrait-qian.jpg',
    role: '古董商',
    longText: '钱伯年，55岁，陈墨白的长期古董供应商。品鉴会当天下午四点半进入书房讨论生意纠纷，约四点四十五分离开。\n\n他焦虑不安，额头上有细密的汗珠。提到近期交易时，他明显不愿多谈。',
    nodes: {
      'start': {
        text: '钱伯年坐在茶几旁，手指不停地敲打着桌面。他看起来焦虑不安，额头上有细密的汗珠。',
        options: [
          { text: '请描述一下品鉴会当天的活动。', clues: ['A07'], next: 'activity' },
          { text: '你和陈墨白最近有什么纠纷吗？', next: 'dispute' },
          { text: '（结束对话）', next: null }
        ]
      },
      'activity': {
        text: '品鉴会上我看了陈先生的新收藏。四点半左右，我去书房找他讨论一些生意上的事。大概待了十五分钟。',
        options: [
          { text: '讨论了什么？', next: 'discussion' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'discussion': {
        text: '就是一些......古董交易的事。最近市场不太好，有些价格需要调整。',
        options: [
          { text: '我看到有一批古董被鉴定为赝品。（出示证据）', next: 'fake', requiresClue: 'I07' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'fake': {
        text: '（钱伯年的脸抽搐了一下）那是......误会。古董市场本来就有很多争议，真假有时候很难界定。我和陈先生合作多年，信誉是有的。',
        options: [
          { text: '这份赔偿协议是怎么回事？（出示证据）', next: 'compensation', requiresClue: 'I08' },
          { text: '好吧。（结束）', next: null }
        ]
      },
      'compensation': {
        text: '（钱伯年叹了口气）陈先生要求我赔偿3000万。这对我来说是天文数字。但我没有杀他！如果他死了，这笔账就更难算清了！',
        options: [
          { text: '我会继续调查的。（结束）', next: null }
        ]
      },
      'dispute': {
        text: '没什么大纠纷，就是一些生意上的小事。我和陈先生合作很多年了，偶尔有分歧很正常。',
        options: [
          { text: '（返回）', next: 'start' }
        ]
      }
    }
  },

  // ==========================================
  //  林婉清 - 妻子
  // ==========================================
  'lin': {
    id: 'lin',
    name: '林婉清',
    portrait: 'portrait-lin.jpg',
    role: '妻子',
    longText: '林婉清，42岁，陈墨白的第二任妻子。品鉴会当天下午五点进入书房送药，约五点十分离开。\n\n她眼圈微红，手里攥着一块手帕，看起来很悲伤。但她谈到婚姻时语气闪躲，似乎还有隐情。',
    nodes: {
      'start': {
        text: '林婉清坐在沙发右侧，眼圈微红，手里攥着一块手帕。她看起来很悲伤，但你总觉得那悲伤里少了些什么。',
        options: [
          { text: '请描述一下你当天的活动。', clues: ['A08'], next: 'activity' },
          { text: '你和陈墨白的婚姻幸福吗？', next: 'marriage' },
          { text: '（结束对话）', next: null }
        ]
      },
      'activity': {
        text: '品鉴会的时候我一直在客厅招待客人。五点左右，我给墨白送了一次药。他有心脏病，需要按时吃药。',
        options: [
          { text: '送药的时候他怎么样？', next: 'medicine' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'medicine': {
        text: '他看起来还好，正在看书。我把药放在桌上就出来了。没想到那是我最后一次见到他活着......',
        options: [
          { text: '药瓶检查显示药物没有异常。（出示证据）', next: 'medicine-cleared', requiresClue: 'I13' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'medicine-cleared': {
        text: '（林婉清低下头）所以至少能证明不是我在药里动手脚，对吗？我知道你们都会怀疑我，年轻妻子、婚前协议、外遇......这些听起来都很难看。但我没有杀他。',
        options: [
          { text: '我还需要继续核实你的时间线。（返回）', next: 'activity' }
        ]
      },
      'marriage': {
        text: '我们......还行吧。墨白年纪大了，有时候脾气不太好。但他对我还是不错的。',
        options: [
          { text: '我看到了这份婚前协议。（出示证据）', next: 'prenup', requiresClue: 'I10' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'prenup': {
        text: '（林婉清的表情微微变化）是的，我们签了婚前协议。这是墨白的意思，我理解。他不想让人觉得我是为了钱才嫁给他的。',
        options: [
          { text: '按照协议，你只能得到500万。', next: 'inheritance' },
          { text: '我注意到你最近和某人走得很近。（出示证据）', next: 'affair', requiresClue: 'I09' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'inheritance': {
        text: '是的。500万对我来说已经足够了。我没有杀他的动机......我的意思是，我爱他，不是为了钱。',
        options: [
          { text: '（返回）', next: 'start' }
        ]
      },
      'affair': {
        text: '（林婉清的脸色变得苍白）你......你怎么知道的？是的，我认识了一个人。但那是在墨白......我们之间已经没有感情了。我没有杀他。',
        options: [
          { text: '我会继续调查的。（结束）', next: null }
        ]
      }
    }
  },

  // ==========================================
  //  周叔同 - 秘书
  // ==========================================
  'zhou': {
    id: 'zhou',
    name: '周叔同',
    portrait: 'portrait-zhou.jpg',
    role: '秘书',
    longText: '周叔同，50岁，陈墨白的私人秘书，服务20年。他是当天下午五点半发现尸体的人。\n\n他神情憔悴，对主人的死显然非常悲痛。作为跟随陈墨白最久的人，他显然知道不少陈年旧事，却不愿主动提起。',
    nodes: {
      'start': {
        text: '周叔同站在门口，神情憔悴。他跟了陈墨白二十年，对主人的死显然非常悲痛。',
        options: [
          { text: '请描述一下你发现尸体的经过。', clues: ['A09'], next: 'discovery' },
          { text: '你和陈墨白是什么关系？', clues: ['I12'], next: 'relationship' },
          { text: '（结束对话）', next: null }
        ]
      },
      'discovery': {
        text: '五点半的时候，我像往常一样去给陈先生送茶。推开门，就看到他趴在书桌上，一动不动。我以为他睡着了，走近一看......他已经没有呼吸了。',
        options: [
          { text: '你注意到书房里有什么异常吗？', next: 'observation' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'observation': {
        text: '一切看起来都很正常。桌上的茶杯还是满的，古籍摊开着。只是那把椅子倒了，可能是陈先生倒下的时候碰倒的。',
        options: [
          { text: '旧摹本显示第47页多了一行批注。（出示证据）', next: 'old-rubbing-comment', requiresClue: 'B16' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'old-rubbing-comment': {
        text: '多了一行？（周叔同皱起眉）陈先生对那本书很在意，平时连翻页都很小心。如果有人在上面补了字，他不一定立刻发现，因为他相信赵馆长的修复手艺。',
        options: [
          { text: '他经常舔手指翻页吗？', next: 'page-habit' },
          { text: '（返回）', next: 'discovery' }
        ]
      },
      'page-habit': {
        text: '是的。老习惯了。陈先生总说古籍纸张太薄，手指沾一点湿气更好翻。我们劝过他，他不听。',
        options: [
          { text: '（记下这个细节）', next: null }
        ]
      },
      'relationship': {
        text: '我跟了陈先生二十年。当年我落魄的时候，是他收留了我，给了我工作，让我有了尊严。我这条命都是他的。',
        options: [
          { text: '你知道陈先生二十年前做过什么吗？', next: 'past' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'past': {
        text: '（周叔同的表情变得复杂）陈先生是个好人，但他......做过一些不太光彩的事。不过那都是过去的事了。',
        options: [
          { text: '你指的是赵明远的事吗？（出示证据）', next: 'zhao-mingyuan', requiresClue: 'I11' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'zhao-mingyuan': {
        text: '（周叔同惊讶地看着你）你......你怎么知道？那件事陈先生让我保密。赵明远的藏品确实被......调换了。但那是商业行为，不是谋杀。',
        options: [
          { text: '赵雅琴知道这件事吗？', next: 'zhao-yaqin' },
          { text: '（记下这个信息）', next: null }
        ]
      },
      'zhao-yaqin': {
        text: '她应该不知道。陈先生收养她的时候，她才十岁。我们一直瞒着她。但......有时候我看到她的眼神，总觉得她知道些什么。',
        options: [
          { text: '地下室有个保险箱，你知道密码吗？', next: 'basement-safe' },
          { text: '谢谢你的坦诚。（结束）', next: null }
        ]
      },
      'basement-safe': {
        text: '那个保险箱是赵明远当年留下的。陈先生一直没换密码......好像是赵明远的出生年份，1974年。陈先生说留着做纪念。',
        options: [
          { text: '谢谢。（结束）', next: null }
        ]
      }
    }
  },

  // ==========================================
  //  梁若岚 - 协查警员
  // ==========================================
  'liang': {
    id: 'liang',
    name: '梁若岚',
    portrait: 'portrait-liang.jpg',
    role: '协查警员',
    longText: '梁若岚，市局刑侦支队警员，负责陈墨白案的外部协查。她不在山庄现场长期驻守，而是在警局整理系统检索、调证申请和旧案关联。\n\n她说话利落，习惯把复杂案情拆成现场线、人物线和旧案线三张表。',
    nodes: {
      'start': {
        text: '梁若岚站在白板前，手里拿着记号笔。她看了一眼你带来的线索清单，把几张便签重新贴到"物证优先"那一栏。',
        options: [
          { text: '现在警局能提供什么协助？', clues: ['A15'], next: 'support' },
          { text: '探案系统能直接指出凶手吗？', next: 'system-limits' },
          { text: '旧案关联检索有结果了吗？（出示证据）', next: 'archive-result', requiresClue: 'I19' },
          { text: '（结束对话）', next: null }
        ]
      },
      'support': {
        text: '我们分三条线支援你：警局系统负责旧案检索，法医办公室负责复检方向，档案室负责调卷。你继续盯现场，尤其是能解释"怎么死"的物证。',
        options: [
          { text: '为什么强调"怎么死"？', next: 'method-first' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'method-first': {
        text: '这个案子动机太多了：钱、遗产、赝品、旧怨、婚姻。动机多到会干扰判断。能缩小范围的，是作案手法和机会。',
        options: [
          { text: '明白了，现场物证优先。（返回）', next: 'support' }
        ]
      },
      'system-limits': {
        text: '不能。系统只会告诉你"哪些材料可能有关"。如果机器能直接破案，我们早就失业了。它擅长翻旧账，但不擅长判断人为什么撒谎。',
        options: [
          { text: '那旧案线该怎么用？', next: 'old-case-use' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'old-case-use': {
        text: '旧案线用来解释长期动机和隐瞒，不要拿它替代现场证据。一个人二十年前有仇，不代表他今天一定动手；但它能解释他为什么准备这么久。',
        options: [
          { text: '（返回）', next: 'system-limits' }
        ]
      },
      'archive-result': {
        text: '检索结果已经把赵明远旧案和南城赝品案拉出来了。档案室入口我给你开了权限，去找马承安，他会调卷。',
        options: [
          { text: '旧案档案室现在可以进入了？', next: 'archive-unlocked' },
          { text: '（结束对话）', next: null }
        ]
      },
      'archive-unlocked': {
        text: '可以。记住，看旧案时别急着下结论。旧案能解释动机，但要和山庄里的墨迹、毒理、时间线合在一起才算证据链。',
        options: [
          { text: '我会回到证据链上。（结束）', next: null }
        ]
      }
    }
  },

  // ==========================================
  //  许明澈 - 法医
  // ==========================================
  'xu': {
    id: 'xu',
    name: '许明澈',
    portrait: 'portrait-xu.jpg',
    role: '法医',
    longText: '许明澈，市局法医办公室负责人。开场的法医初检报告由他签发，但他一直强调：初检只能告诉你"看起来像什么"，不能替你排除所有罕见可能。\n\n他性格冷静，习惯把判断拆成"已排除"和"还不能排除"两列。',
    nodes: {
      'start': {
        text: '许明澈把初检报告翻到第二页，指尖停在"建议进一步毒理学检测"那一行。',
        options: [
          { text: '初检为什么没有直接发现毒物？', next: 'initial-limit' },
          { text: '我需要追加哪些复检？', clues: ['A16'], next: 'recheck', requiresClues: ['I13', 'I14', 'C06', 'C07'] },
          { text: '乌头碱筛查方向成立吗？（出示证据）', next: 'aconitine', requiresClue: 'I20' },
          { text: '（结束对话）', next: null }
        ]
      },
      'initial-limit': {
        text: '因为尸表无外伤，常规毒检没有命中，死因表现又像心脏骤停。法医不是巫师，不能在没有方向时把所有罕见毒物全筛一遍。',
        options: [
          { text: '所以需要现场给方向。', next: 'scene-direction' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'scene-direction': {
        text: '对。法医只能告诉你"看起来像什么"，不能替你猜现场。你需要先把现场里能排除的入口、不能排除的载体和死者最后接触过的东西带回来。',
        options: [
          { text: '我已经排除茶水和药物路线。（出示证据）', next: 'cleared-routes', requiresClues: ['I13', 'I14'] },
          { text: '异常墨迹和翻页习惯可以构成方向吗？（出示证据）', next: 'book-route', requiresClues: ['C06', 'C07'] },
          { text: '（返回）', next: 'initial-limit' }
        ]
      },
      'cleared-routes': {
        text: '茶水和药物都没有异常，就说明最直观的入口不成立。下一步要找的是更隐蔽的载体：他摸过什么、习惯性接触过什么、有没有把什么东西带入口腔。',
        options: [
          { text: '我会继续找载体证据。', next: 'scene-direction' }
        ]
      },
      'book-route': {
        text: '可以作为复检方向。异常墨迹本身还不能定案，但如果死者确实有翻页前舔手指的习惯，那就值得采集指尖残留和口腔拭子。',
        options: [
          { text: '那我需要正式复检。', clues: ['A16'], next: 'recheck' }
        ]
      },
      'recheck': {
        text: '三类样本：口腔拭子、右手指尖残留、古籍第47页墨迹。尤其是墨迹，别只看颜色，要看残留物。',
        options: [
          { text: '如果发现黏膜刺激痕迹呢？', next: 'mucosa' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'mucosa': {
        text: '那就说明入口不一定是吞咽，可能是口腔黏膜接触。它不会单独定案，但会把古籍投毒这个路径变得非常合理。',
        options: [
          { text: '（返回）', next: 'recheck' }
        ]
      },
      'aconitine': {
        text: '成立，但还需要样本支持。乌头碱中毒可以伪装成心脏问题，这就是它危险的地方。若墨迹样本和口腔拭子都能对上，作案路径就闭合了。',
        options: [
          { text: '（结束对话）', next: null }
        ]
      }
    }
  },

  // ==========================================
  //  马承安 - 档案管理员
  // ==========================================
  'ma': {
    id: 'ma',
    name: '马承安',
    portrait: 'portrait-ma.jpg',
    role: '档案管理员',
    longText: '马承安，旧案档案室管理员。警局里很少有人喜欢下地下二层调卷，但他能准确说出每个尘封档案柜的位置。\n\n他对"未立案材料"格外敏感，因为很多旧案不是没有故事，只是当年没有足够证据。',
    nodes: {
      'start': {
        text: '马承安推了推眼镜，从柜子里抽出两只档案盒："你要找的，不止一件旧事。"',
        options: [
          { text: '赵明远案当年为什么没继续查？', next: 'zhao-case' },
          { text: '南城赝品案和本案有什么关系？', next: 'forgery-case' },
          { text: '旧案可以作为定案证据吗？', next: 'evidence-value' },
          { text: '（结束对话）', next: null }
        ]
      },
      'zhao-case': {
        text: '当年赵明远一直说藏品被调换，但他说不出调换发生在哪个环节，也拿不出原始鉴定。陈墨白那边文件齐全，所以最后只能按经济纠纷备查。',
        options: [
          { text: '卷宗里提到赵小琴吗？', next: 'xiaoqin' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'xiaoqin': {
        text: '提到过。赵明远遗书里写的是"小琴吾女"。后来陈墨白收养的女孩改名赵雅琴。这个名字变化，你应该比我更清楚意味着什么。',
        options: [
          { text: '（返回）', next: 'zhao-case' }
        ]
      },
      'forgery-case': {
        text: '南城赝品案不是命案，但它让你看到这群人的利益网。钱伯年、高远航、陈墨白都在这个圈子里转过，只是站的位置不同。',
        options: [
          { text: '所以它更像动机网。', next: 'motive-web' },
          { text: '（返回）', next: 'start' }
        ]
      },
      'motive-web': {
        text: '对。动机网会告诉你谁有理由恨谁，但不会告诉你毒是怎么进身体的。别让旧案替你做最后一步推理。',
        options: [
          { text: '（返回）', next: 'forgery-case' }
        ]
      },
      'evidence-value': {
        text: '可以作为背景和动机证据，但通常不能单独证明当前犯罪。二十年前的恨，要和今天的准备、今天的机会、今天的物证连起来。',
        options: [
          { text: '（结束对话）', next: null }
        ]
      }
    }
  }
};
