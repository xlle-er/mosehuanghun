/* ============================================
   Scenes Data - 场景数据
   ============================================ */

window.SCENES_DATA = {

  // ==========================================
  //  书房 - 犯罪现场
  // ==========================================
  'study': {
    id: 'study',
    name: '犯罪现场 - 书房',
    description: '书房位于别墅二楼东侧，面积约40平方米。推开厚重的木门，一股陈旧的书香扑面而来。书架从地面延伸到天花板，密密麻麻地摆满了各类古籍和艺术品。房间中央是一张红木书桌，桌面上摊开着一本泛黄的古籍。一把椅子翻倒在地，旁边是一杯已经凉透的茶。',
    background: 'scene-study.jpg',
    ambience: 'rain-ambient',
    rain: true,
    connections: [
      { scene: 'living-room', icon: '🛋️' },
      { scene: 'gallery', icon: '🖼️' },
      { scene: 'library', icon: '📜' }
    ],
    suspects: [
      { id: 'fang', name: '方志远', role: '商业合伙人', portrait: 'portrait-fang.jpg' }
    ],
    items: [
      {
        id: 'desk',
        name: '书桌',
        icon: '📚',
        description: '红木书桌上摊开着一本古籍《山居笔记》，旁边是一支毛笔和砚台。桌面上还有几份文件和一个药瓶。抽屉里似乎有什么东西。',
        clueDetail: '你拉开抽屉，里面有一把小钥匙，上面贴着标签写着"文件柜"。',
        clues: ['B11', 'A02']
      },
      {
        id: 'ancient-book',
        name: '古籍《山居笔记》',
        icon: '📜',
        image: 'item-ancient-book.jpg',
        description: '一本明代的古籍，纸张泛黄但保存完好。书页上有许多批注，仔细看看...',
        puzzle: {
          type: 'multi-click',
          required: 3,
          stages: [
            '翻开古籍，书页泛黄，上面有许多批注。看起来都是同一种墨迹......',
            '你仔细对比了不同页面的批注。第47页的墨迹似乎和其他页面略有不同，颜色稍浅，微微泛着光泽......',
            '你用手指轻轻触摸第47页的批注，感觉略有黏性。这绝不是普通的墨水。而且多位证人提到，陈墨白有舔手指翻页的习惯......'
          ]
        },
        clueDetail: '第47页的批注墨迹与其他页面不同，且陈墨白有舔手指翻页的习惯。这可能是毒药进入体内的途径......',
        clues: ['C06', 'C07']
      },
      {
        id: 'teacup',
        name: '茶杯',
        icon: '🍵',
        description: '一个精致的青花瓷茶杯，里面还有半杯茶水。茶水已经凉透，表面漂浮着几片茶叶。',
        clueDetail: '茶杯中的茶水看起来很正常，是普通的龙井茶。如果毒药是下在茶里，应该早就被发现了......',
        clues: ['I14']
      },
      {
        id: 'file-cabinet',
        name: '文件柜',
        icon: '🗄️',
        description: '书架旁的铁质文件柜，上面挂着一把锁。需要找到钥匙才能打开。',
        requiresClue: 'B11',
        requiresClueHint: '文件柜上了锁，你需要先找到钥匙。',
        clueDetail: '用钥匙打开文件柜，里面堆满了公司文件。翻看最近的财务报表，你发现公司账目上有800万资金去向不明......',
        clues: ['I02']
      },
      {
        id: 'safe',
        name: '保险箱',
        icon: '🔐',
        image: 'item-safe.jpg',
        description: '书架后面的墙角，隐藏着一个小型保险箱。转盘上有0-9的数字。',
        puzzle: {
          type: 'password',
          hint: '请输入保险箱密码（8位数字）',
          placeholder: '输入8位数字密码',
          answer: '19520315'
        },
        clueDetail: '保险箱里有一份遗嘱，日期是三天前的。遗嘱中，陈墨白将大部分遗产留给了博物馆和慈善机构......',
        clues: ['I05']
      },
      {
        id: 'medicine',
        name: '药瓶',
        icon: '💊',
        image: 'item-medicine.jpg',
        description: '书桌抽屉里的一个棕色药瓶，标签上写着"硝酸甘油片"，是心脏病急救药。',
        puzzle: {
          type: 'inspect',
          hint: '逐项检查药瓶细节，判断是否存在替换药物的可能。',
          required: 4,
          points: [
            { label: '瓶身标签', note: '标签完整，批号与陈墨白私人医生处方记录一致。' },
            { label: '药片数量', note: '药片剩余数量与每日服用记录能对上，没有突然减少或替换的迹象。' },
            { label: '瓶口残留', note: '瓶口没有异常粉末或刺鼻气味，也没有重新封装痕迹。' },
            { label: '药片外观', note: '药片颜色、刻痕和溶解反应均符合硝酸甘油片特征。' }
          ],
          success: '药瓶检查完成，可以排除替换药物投毒。'
        },
        clueDetail: '药瓶里的药片数量与处方记录一致，没有被替换的迹象。排除了通过替换药物投毒的可能性......',
        clues: ['I13']
      },
      {
        id: 'coat',
        name: '方志远的外套',
        icon: '🧥',
        description: '衣架上挂着一件深色西装外套，口袋里似乎有东西。',
        clueDetail: '外套口袋里有一部手机，屏幕上有赌博APP的通知。最近的转账记录显示，他输了一大笔钱......',
        clues: ['I01']
      },
      {
        id: 'wall-quote',
        name: '墙上书法',
        icon: '🖼️',
        description: '墙上挂着一幅书法："藏天下之珍，品岁月之味"。',
        clues: ['B06']
      }
    ]
  },

  // ==========================================
  //  客厅 - 嫌疑人访谈
  // ==========================================
  'living-room': {
    id: 'living-room',
    name: '客厅',
    description: '宽敞的客厅里，七位嫌疑人坐在不同的位置。吊灯发出昏黄的光，照在每个人凝重的脸上。窗外，雨点敲打着玻璃，发出细碎的声响。',
    background: 'scene-living-room.jpg',
    rain: true,
    connections: [
      { scene: 'study', icon: '📚' },
      { scene: 'gallery', icon: '🖼️' },
      { scene: 'bedrooms', icon: '🛏️' }
    ],
    suspects: [
      { id: 'zhou', name: '周叔同', role: '秘书', portrait: 'portrait-zhou.jpg' },
      { id: 'lin', name: '林婉清', role: '妻子', portrait: 'portrait-lin.jpg' }
    ],
    items: [
      {
        id: 'guest-list',
        name: '品鉴会记录',
        icon: '📋',
        description: '品鉴会的签到记录，详细记录了每位客人的活动时间。',
        puzzle: {
          type: 'sequence',
          hint: '签到表和佣人记录混在一起。按时间顺序整理关键活动，确认赵雅琴的动线。',
          choices: [
            { label: '16:00-16:20 赵雅琴进入书房整理古籍', detail: '馆长钥匙记录与佣人目击一致。' },
            { label: '15:00 陈墨白回到书房', detail: '品鉴会中途离席，称要核对藏品资料。' },
            { label: '14:00 品鉴会开始', detail: '七位客人全部到场。' },
            { label: '17:00 林婉清送药', detail: '她端着药和温水进入书房。' },
            { label: '17:30 周叔同发现尸体', detail: '他按惯例送茶时发现陈墨白倒在书桌上。' }
          ],
          answer: [2, 1, 0, 3, 4],
          success: '时间线整理完成：赵雅琴在案发前一小时有明确接触古籍的机会。'
        },
        clueDetail: '赵雅琴16:00-16:20在书房整理古籍......',
        clues: ['C12']
      },
      {
        id: 'photo-wall',
        name: '照片墙',
        icon: '📷',
        description: '墙上挂着许多照片，记录了陈墨白的收藏生涯和品鉴会的合影。',
        clues: ['A12']
      },
      {
        id: 'portrait',
        name: '陈墨白画像',
        icon: '🖼️',
        description: '一幅陈墨白的油画肖像，画中的他神情威严。',
        clues: ['B01']
      },
      {
        id: 'medicine-tray',
        name: '送药托盘',
        icon: '🥛',
        description: '茶几旁放着一个银质托盘，上面有水杯留下的圆形印痕，旁边压着一张便签。',
        puzzle: {
          type: 'inspect',
          hint: '检查托盘上的细节，确认林婉清送药这条线是否可靠。',
          required: 3,
          points: [
            { label: '水杯印痕', note: '水杯底部留下的湿痕很新，符合五点左右送药的时间。' },
            { label: '药瓶压痕', note: '托盘边缘有药瓶压出的圆形痕迹，但没有药粉洒落。' },
            { label: '便签字迹', note: '便签写着"17:00 心脏药、温水、毛巾。婉清送入书房。"字迹像周叔同。' }
          ],
          success: '托盘记录可以成立：林婉清确实送过药，但药物线仍未显示异常。'
        },
        clueDetail: '托盘上的记录显示，林婉清在17:00左右给陈墨白送过心脏病药和温水。',
        clues: ['A13']
      },
      {
        id: 'security-room',
        name: '安保室',
        icon: '📹',
        description: '客厅角落的安保室，里面有监控录像设备。',
        puzzle: {
          type: 'sequence',
          hint: '监控系统导出的记录顺序混乱。按真实时间顺序整理，才能看出盲区出现在哪里。',
          choices: [
            { label: '16:20 赵雅琴离开书房', detail: '二楼走廊画面恢复后，记录到她从书房方向出来。' },
            { label: '16:00 走廊监控中断', detail: '系统日志显示信号丢失，画面变成雪花。' },
            { label: '15:57 雷阵雨增强', detail: '山庄外墙摄像头记录到强闪电和瞬时电压波动。' },
            { label: '16:05 走廊监控恢复', detail: '画面恢复，走廊无人。' },
            { label: '17:30 周叔同进入书房', detail: '周叔同端着茶盘进入书房，随后发出呼喊。' }
          ],
          answer: [2, 1, 3, 0, 4],
          success: '时间线成立：16:00-16:05 的走廊监控确实留下短暂盲区。'
        },
        clueDetail: '安保日志显示，二楼走廊监控在16:00-16:05期间出现故障......',
        clues: ['C15', 'A11', 'B09']
      }
    ]
  },

  // ==========================================
  //  画廊
  // ==========================================
  'gallery': {
    id: 'gallery',
    name: '画廊',
    description: '画廊连接客厅和书房，长约20米。墙上挂满了陈墨白收藏的画作，从油画到国画，风格各异。玻璃展柜中陈列着各种小型艺术品。',
    background: 'scene-gallery.jpg',
    connections: [
      { scene: 'living-room', icon: '🛋️' },
      { scene: 'study', icon: '📚' }
    ],
    suspects: [
      { id: 'gao', name: '高远航', role: '艺术品鉴定师', portrait: 'portrait-gao.jpg' },
      { id: 'qian', name: '钱伯年', role: '古董商', portrait: 'portrait-qian.jpg' }
    ],
    items: [
      {
        id: 'gallery-safe',
        name: '保险柜',
        icon: '🔐',
        description: '画廊尽头的保险柜，里面存放着鉴定证书。',
        clueDetail: '保险柜中有多份鉴定证书，其中三份被标记为"可疑"......',
        clues: ['I03']
      },
      {
        id: 'account-book',
        name: '账本',
        icon: '📒',
        description: '一本隐秘的账本，记录着古董交易。',
        clueDetail: '账本记录了钱伯年多年来卖给陈墨白的赝品，总金额超过500万......',
        clues: ['I07', 'I08']
      },
      {
        id: 'gao-coat',
        name: '高远航的外套',
        icon: '🧥',
        description: '挂在画廊衣架上的外套。',
        clueDetail: '外套口袋里有一张名片，来自一个地下文物走私集团......',
        clues: ['I04']
      },
      {
        id: 'shipping-crate',
        name: '运输箱',
        icon: '📦',
        description: '画廊角落堆着几个木质运输箱，上面贴满了藏品流转标签。',
        clueDetail: '运输标签显示，《山居笔记》在11月8日被送去修复，11月14日才重新送回书房。',
        clues: ['B14']
      }
    ]
  },

  // ==========================================
  //  客房区
  // ==========================================
  'bedrooms': {
    id: 'bedrooms',
    name: '客房区',
    description: '别墅二楼有四间客房，走廊铺着厚厚的地毯，墙上挂着风景画。每间客房门口都放着一个小牌子。',
    background: 'scene-bedrooms.jpg',
    connections: [
      { scene: 'living-room', icon: '🛋️' }
    ],
    suspects: [
      { id: 'chen', name: '陈子轩', role: '侄子', portrait: 'portrait-chen.jpg' }
    ],
    items: [
      {
        id: 'chen-room',
        name: '陈子轩的房间',
        icon: '🛏️',
        description: '陈子轩的客房，桌上放着一些个人物品。',
        clueDetail: '抽屉里有一封催债信，陈子轩欠下200万赌债......',
        clues: ['I06']
      },
      {
        id: 'lin-room',
        name: '林婉清的房间',
        icon: '🛏️',
        description: '林婉清的客房，床头放着一个手提包。',
        clueDetail: '手提包里有酒店收据和暧昧短信，她显然有外遇......',
        clues: ['I09', 'I10']
      },
      {
        id: 'corridor-board',
        name: '走廊记录板',
        icon: '📝',
        description: '客房区走廊尽头挂着一块小白板，上面记录着佣人临时排班和客人出入情况。',
        clueDetail: '记录板补充了陈子轩、林婉清在下午的移动时间，但并没有直接指向凶手。',
        clues: ['A14']
      }
    ]
  },

  // ==========================================
  //  植物温室
  // ==========================================
  'greenhouse': {
    id: 'greenhouse',
    name: '植物温室',
    description: '别墅后方的玻璃温室，在雨中显得格外明亮。推开门，一股温暖潮湿的空气扑面而来，混合着泥土和植物的气息。温室内整齐地排列着植物架。',
    background: 'scene-greenhouse.jpg',
    connections: [
      { scene: 'garden', icon: '🌸' },
      { scene: 'living-room', icon: '🛋️' }
    ],
    items: [
      {
        id: 'wolfsbane',
        name: '乌头草',
        icon: '🌿',
        image: 'item-wolfsbane.jpg',
        description: '温室最里面的一排植物架上，有一株开着紫色小花的植物，标签上写着"乌头草（Aconitum）- 实验样本"。',
        puzzle: {
          type: 'multi-click',
          required: 3,
          stages: [
            '一株开着紫色小花的植物，标签上写着"乌头草（Aconitum）- 实验样本"。花盆看起来很普通......',
            '你注意到花盆底部的泥土似乎被人动过，比其他花盆的泥土更松散。也许可以挖开看看......',
            '你拨开花盆底部的泥土，发现了一个隐藏的隔间！里面放着一本小笔记本，详细记录了乌头草的培育过程和乌头碱的提取方法......'
          ]
        },
        clueDetail: '花盆底部有一个隐藏的隔间，里面放着一本小笔记本，详细记录了乌头草的培育过程和乌头碱的提取方法......',
        clues: ['C03']
      },
      {
        id: 'greenhouse-info',
        name: '温室介绍',
        icon: '📋',
        description: '温室入口的告示牌，介绍了温室中培育的各种植物。',
        clues: ['B05']
      },
      {
        id: 'greenhouse-workbench',
        name: '温室工作台',
        icon: '🧪',
        description: '工作台上摆着园艺剪、营养液和一本防水记录册。乌头草区域的记录被单独夹在最下面。',
        puzzle: {
          type: 'match',
          hint: '将维护记录与调查含义对应，判断乌头草是否只是普通展品。',
          leftTitle: '维护记录',
          rightTitle: '调查含义',
          pairs: [
            { left: '独立滴灌：2024年10月1日起', right: '乌头草区域被单独维护。' },
            { left: '夜间手动维护：11月1日起', right: '有人避开白天巡查照料样本。' },
            { left: '维护人签名：Z.Y.Q.', right: '记录指向赵雅琴的姓名缩写。' },
            { left: '停止公共营养液供应', right: '样本用途与普通温室展示不同。' }
          ],
          rightOrder: [3, 0, 2, 1],
          success: '维护记录对上了：乌头草被长期、隐蔽、单独管理。'
        },
        clueDetail: '温室灌溉记录显示，乌头草区域被赵雅琴长期单独维护，不像普通观赏植物。',
        clues: ['I16', 'B13']
      }
    ]
  },

  // ==========================================
  //  赵雅琴办公室
  // ==========================================
  'office': {
    id: 'office',
    name: '赵雅琴办公室',
    description: '博物馆馆长办公室位于别墅一楼西侧，门上挂着"馆长办公室"的铜牌。推开门，房间整洁而有序。书架上摆满了古籍修复和化学方面的书籍。办公桌上放着一台笔记本电脑和一些文件。',
    background: 'scene-office.jpg',
    connections: [
      { scene: 'gallery', icon: '🖼️' },
      { scene: 'library', icon: '📜' }
    ],
    suspects: [
      { id: 'zhao', name: '赵雅琴', role: '博物馆馆长', portrait: 'portrait-zhao.jpg' }
    ],
    items: [
      {
        id: 'office-bookshelf',
        name: '书架',
        icon: '📚',
        description: '书架上整齐地排列着各种书籍，主要是古籍修复、化学、植物学方面的专业书籍。',
        clueDetail: '在书架的最下层，你发现了一本旧笔记本，是一份详细的收藏清单，记录着各种珍贵古籍的名称、年代和来源......',
        clues: ['C18', 'B03']
      },
      {
        id: 'office-computer',
        name: '笔记本电脑',
        icon: '💻',
        description: '办公桌上的笔记本电脑处于待机状态。桌上的便签纸上有密码提示："父亲的生日"。',
        clueDetail: '电脑里的门禁记录显示，赵雅琴在案发前一周多次在深夜进入古籍室......',
        clues: ['C14']
      },
      {
        id: 'office-drawer',
        name: '抽屉',
        icon: '🗄️',
        description: '办公桌的抽屉，没有上锁。',
        clueDetail: '抽屉里有一个文件夹，里面是赵雅琴的个人文件。身份证复印件显示，她原名赵小琴，父亲赵明远......',
        clues: ['C02']
      },
      {
        id: 'office-photo',
        name: '照片',
        icon: '📷',
        description: '桌角有一个小小的相框，照片里是一个中年男人抱着一个小女孩。',
        clues: ['B07']
      },
      {
        id: 'certificate-wall',
        name: '证书墙',
        icon: '🎓',
        description: '办公室墙上挂着几张课程证书，内容涉及古籍修复、文物保护材料学和分析化学。',
        clueDetail: '这些证书说明赵雅琴具备古籍修复和化学材料方面的专业知识。',
        clues: ['B18']
      },
      {
        id: 'office-secret',
        name: '暗格',
        icon: '🔒',
        image: 'item-letter.jpg',
        description: '书架上有一本《古籍修复技术》，书脊上有明显的折痕。也许可以试试？',
        requiresClue: 'C02',
        requiresClueHint: '这本书看起来很普通，但书脊的折痕说明经常被抽出。你需要了解更多关于赵雅琴的背景，才能理解为什么这本书如此重要。',
        puzzle: {
          type: 'multi-click',
          required: 3,
          stages: [
            '你试着抽出这本书，书架纹丝不动。也许需要找到正确的机关......',
            '你仔细观察书架，发现这本书旁边的木板有一个不太明显的缝隙。你用力按了一下，听到"咔哒"一声......',
            '书架缓缓移开，露出了一个暗格！里面放着一个旧铁盒。打开铁盒，里面是一封泛黄的遗书和一本日记本......'
          ]
        },
        clueDetail: '书架移开后，露出了一个暗格。里面放着一个旧铁盒，铁盒里是一封泛黄的遗书......',
        clues: ['C01']
      }
    ]
  },

  // ==========================================
  //  古籍室
  // ==========================================
  'library': {
    id: 'library',
    name: '古籍室',
    description: '古籍室位于别墅一楼东侧，门上有恒温恒湿系统的控制面板。推开门，一股陈旧的书香扑面而来。房间中央是一个大型阅读台，上面摊开着一本古籍。',
    background: 'scene-library.jpg',
    connections: [
      { scene: 'office', icon: '🏢' },
      { scene: 'study', icon: '📚' }
    ],
    items: [
      {
        id: 'ancient-book-main',
        name: '《山居笔记》',
        icon: '📜',
        image: 'item-ancient-book.jpg',
        description: '阅读台上摊开的古籍，正是陈墨白死前正在研究的那本。第47页的批注墨迹略有不同。',
        clueDetail: '古籍上检测出了两个人的指纹：陈墨白的和赵雅琴的。赵雅琴的指纹主要集中在第47页附近......',
        clues: ['C06', 'I15']
      },
      {
        id: 'repair-archive',
        name: '修复档案柜',
        icon: '🗄️',
        description: '修复工作台旁的档案柜，里面存放着所有的修复记录。',
        puzzle: {
          type: 'match',
          hint: '档案柜里的记录被拆成了几页。将左侧记录与右侧含义对应起来，确认这次修复真正可疑的地方。',
          leftTitle: '修复记录',
          rightTitle: '调查含义',
          pairs: [
            { left: '修复日期：2024年11月8日', right: '案发前一周刚刚动过这本古籍。' },
            { left: '修复内容：补充缺失批注', right: '第47页新增文字不是原书旧墨。' },
            { left: '执行人：赵雅琴', right: '她直接接触过关键书页。' },
            { left: '墨水说明：传统墨汁，手工调色', right: '墨水来源和配方需要进一步追查。' }
          ],
          rightOrder: [2, 0, 3, 1],
          success: '记录对应完成：赵雅琴在案发前一周处理过《山居笔记》第47页。'
        },
        clueDetail: '档案柜里有一份《山居笔记》的修复记录，日期是一周前。修复内容是"补充缺失批注"，执行人是赵雅琴......',
        clues: ['C05']
      },
      {
        id: 'library-bookshelf',
        name: '藏书',
        icon: '📚',
        description: '四周的书架上整齐地排列着各种珍贵的古籍。',
        clues: ['B04']
      },
      {
        id: 'ink-cabinet',
        name: '墨水柜',
        icon: '🧴',
        description: '修复台旁的小柜子里分门别类放着墨汁、植物胶、溶剂和防腐剂。',
        puzzle: {
          type: 'inspect',
          hint: '检查墨水柜里的材料，判断它们是否能解释异常墨迹。',
          required: 4,
          points: [
            { label: '松烟墨汁', note: '墨色接近《山居笔记》的旧批注，可以用于伪装修复。' },
            { label: '植物胶增稠剂', note: '能让墨迹干后略带黏性，与第47页触感一致。' },
            { label: '无水乙醇', note: '可作为某些毒物的溶剂，不是普通补墨必需品。' },
            { label: '防腐剂', note: '可以让混合墨水保持稳定，避免短时间变质。' }
          ],
          success: '墨水柜检查完成：这些材料足以支持毒墨水的制作可能。'
        },
        clueDetail: '采购单和柜中材料显示，古籍室近期购入过增稠剂、防腐剂和无水乙醇。',
        clues: ['I18']
      },
      {
        id: 'environment-log',
        name: '环境记录仪',
        icon: '🌡️',
        description: '墙上的恒温恒湿记录仪保存着最近两周的环境曲线。',
        clueDetail: '记录仪显示11月8日凌晨曾降低湿度两小时，备注是"第47页补墨后延长干燥"。',
        clues: ['B15']
      },
      {
        id: 'old-rubbing',
        name: '旧摹本',
        icon: '📖',
        description: '书架下层放着十年前制作的《山居笔记》影印摹本。',
        clueDetail: '旧摹本显示，第47页原本没有现本上那行新批注。',
        clues: ['B16']
      }
    ]
  },

  // ==========================================
  //  花园
  // ==========================================
  'garden': {
    id: 'garden',
    name: '花园',
    description: '别墅的花园占地约一亩，虽然已是深秋，但仍有不少常绿植物。一条石子小路从正门通向后方的温室，路边是修剪整齐的灌木。',
    background: 'scene-garden.jpg',
    rain: true,
    connections: [
      { scene: 'greenhouse', icon: '🌿' },
      { scene: 'living-room', icon: '🛋️' }
    ],
    items: [
      {
        id: 'stone-monument',
        name: '石碑',
        icon: '🪨',
        description: '花园中央有一座石碑，上面刻着别墅的历史。',
        clues: ['B02', 'B17']
      },
      {
        id: 'muddy-path',
        name: '泥泞小路',
        icon: '👣',
        description: '通往温室的小路被雨水冲得泥泞，几处脚印还没有被完全冲散。',
        puzzle: {
          type: 'inspect',
          hint: '检查泥路上的痕迹，判断是否有人在雷雨中往返温室。',
          required: 4,
          points: [
            { label: '鞋底纹路', note: '纹路细密，像温室常用防滑雨靴。' },
            { label: '脚印大小', note: '尺码偏小，与几位男性嫌疑人的鞋码不符。' },
            { label: '泥土颜色', note: '浅黄色细砂泥，和主楼门厅深色泥痕不同。' },
            { label: '折返方向', note: '脚印从主楼侧门通向温室，又沿原路返回。' }
          ],
          success: '脚印观察完成：关键时间段有人往返过温室。'
        },
        clueDetail: '泥路上有一组尺码偏小的雨靴印，从主楼通向温室又折返回来。',
        clues: ['I17', 'B12']
      }
    ]
  },

  // ==========================================
  //  地下室
  // ==========================================
  'basement': {
    id: 'basement',
    name: '地下室',
    description: '地下室的入口隐藏在厨房后面的储物间里。沿着狭窄的楼梯走下去，一股霉味扑面而来。地下室被改造成了储藏室，角落里堆放着各种杂物。',
    background: 'scene-basement.jpg',
    ambience: 'dripping',
    connections: [
      { scene: 'living-room', icon: '🛋️' }
    ],
    items: [
      {
        id: 'basement-bookshelf',
        name: '旧书架',
        icon: '📚',
        description: '角落里的旧书架，上面落满了灰尘，放着一些旧书。',
        puzzle: {
          type: 'multi-click',
          required: 2,
          stages: [
            '书架上落满了灰尘，放着各种旧书。你随手翻了几本，都是些普通的藏书。但角落里有一本《毒物学手册》，书脊上有经常翻阅的痕迹......',
            '你翻开《毒物学手册》，里面详细记载了各种毒物的特性。其中关于乌头碱的章节引起了你的注意："中毒症状与心脏病发作极为相似，常被误诊。在体内迅速代谢，常规毒理学检测难以发现......"'
          ]
        },
        clueDetail: '一本《毒物学手册》中详细记载了乌头碱的特性和中毒症状......',
        clues: ['C09']
      },
      {
        id: 'medicine-cabinet',
        name: '药材柜',
        icon: '🗄️',
        description: '柜门上贴着"药材储藏"的标签。里面放着各种中药材。',
        puzzle: {
          type: 'multi-click',
          required: 2,
          stages: [
            '柜子里放着各种中药材，有枸杞、黄芪、当归......看起来都是普通的药材。但角落里有一些附子，标签上写着"附子-乌头炮制品"。等等，乌头？',
            '你仔细查看了柜子里的购买记录本。记录显示，一年前购买了500克附子。附子是乌头的炮制品，如果掌握了提取技术，可以从中提取出乌头碱......'
          ]
        },
        clueDetail: '药材柜的购买记录显示，一年前购买了500克附子（乌头的炮制品）......',
        clues: ['C10']
      },
      {
        id: 'basement-safe',
        name: '保险箱',
        icon: '🔐',
        image: 'item-safe.jpg',
        description: '地下室角落的旧保险箱，上面有一个四位数的机械密码锁。锁旁边刻着"明远"二字。',
        puzzle: {
          type: 'password',
          hint: '请输入四位数密码（提示：锁旁刻着的名字可能有关）',
          placeholder: '输入4位数字',
          answer: '1974'
        },
        clueDetail: '保险箱里有20年前的交易合同和鉴定报告，证明陈墨白确实欺诈了赵明远......',
        clues: ['C16']
      },
      {
        id: 'basement-info',
        name: '告示牌',
        icon: '📋',
        description: '墙上挂着的告示牌，说明地下室的用途。',
        clues: ['B08']
      }
    ]
  },

  // ==========================================
  //  警局 - 协查中心
  // ==========================================
  'police-station': {
    id: 'police-station',
    name: '市局刑侦支队',
    description: '夜色已经压下来，刑侦支队办公室里依旧灯火通明。白板上贴满了照片、时间线和红线标记。这里不是案发现场，却能把山庄里散落的证据连接成一张更大的网。',
    background: 'scene-police-station.jpg',
    connections: [],
    suspects: [
      { id: 'liang', name: '梁若岚', role: '协查警员', portrait: 'portrait-liang.jpg' }
    ],
    items: [
      {
        id: 'case-terminal',
        name: '探案系统终端',
        icon: '🖥️',
        image: 'item-case-terminal.jpg',
        description: '警局内网终端接入了现场记录、旧案库和法医复检申请。屏幕上提示你先建立证据矩阵。',
        puzzle: {
          type: 'match',
          hint: '将左侧证据现象与右侧协查方向对应，生成系统建议。',
          leftTitle: '证据现象',
          rightTitle: '协查方向',
          pairs: [
            { left: '心脏骤停但心肌无明显病变', right: '申请罕见毒物专项筛查。' },
            { left: '第47页墨迹颜色和触感异常', right: '送检古籍墨迹和纸张残留。' },
            { left: '赵明远、陈墨白、周叔同反复出现', right: '调取2004年赵明远旧案卷宗。' },
            { left: '赝品交易牵涉多名嫌疑人', right: '检索南城赝品案与资金路径。' }
          ],
          rightOrder: [2, 0, 3, 1],
          success: '探案系统生成了外部协查建议：调取旧案档案，并进行法医专项复检。'
        },
        clueDetail: '探案系统将陈墨白案与赵明远旧案、南城赝品案建立了关联，并建议调取旧案卷宗。',
        clues: ['I19', 'B19']
      },
      {
        id: 'police-whiteboard',
        name: '协查白板',
        icon: '🧷',
        image: 'item-police-whiteboard.jpg',
        description: '白板上贴着现场照片、嫌疑人照片和几张写满字的便签。不同颜色的线把现场、人物和旧案连在一起。',
        clueDetail: '白板明确了协查分工：你负责现场调查，梁若岚负责系统检索和调证，许明澈负责法医复检，马承安负责旧案档案。',
        clues: ['B22']
      },
      {
        id: 'evidence-table',
        name: '证物整理桌',
        icon: '🗂️',
        image: 'item-evidence-table.jpg',
        description: '桌上放着几只证物袋，分别装有药瓶照片、茶杯检测报告、古籍页样本申请单和嫌疑人时间线。',
        puzzle: {
          type: 'sequence',
          hint: '按调查优先级整理证物，避免被经济动机和感情纠纷带偏。',
          choices: [
            { label: '茶水与药物检测', detail: '先排除最明显的下毒方式。' },
            { label: '古籍第47页异常', detail: '唯一与死者动作习惯直接相关的物证。' },
            { label: '嫌疑人经济动机', detail: '可以解释冲突，但不能直接证明作案。' },
            { label: '旧案关联检索', detail: '用于解释长期动机和人物隐瞒。' }
          ],
          answer: [0, 1, 2, 3],
          success: '证物优先级整理完成：现场物证优先，旧案用于补全动机。'
        },
        clueDetail: '证物整理桌上的记录提醒你：经济动机很多，但真正能指向作案手法的是古籍与毒理证据。',
        clues: ['A15']
      }
    ]
  },

  // ==========================================
  //  法医办公室
  // ==========================================
  'forensic-office': {
    id: 'forensic-office',
    name: '法医办公室',
    description: '法医办公室里弥漫着消毒水和冷金属的气味。许明澈把初检报告、口腔拭子申请和毒理筛查表并排摊开，等待你带来更明确的现场方向。',
    background: 'scene-forensic-office.jpg',
    connections: [],
    suspects: [
      { id: 'xu', name: '许明澈', role: '法医', portrait: 'portrait-xu.jpg' }
    ],
    items: [
      {
        id: 'toxicology-bench',
        name: '毒理实验台',
        icon: '🧬',
        image: 'item-toxicology-bench.jpg',
        description: '实验台上放着几张筛查表。常见毒物项目已经打勾，剩下的是需要侦查方向支持的专项检测。',
        requiresClues: ['I13', 'I14', 'C06', 'C07'],
        requiresClueHint: '法医需要你先完成第一现场的基础排查，带来足够的现场依据后才能开专项筛查。',
        puzzle: {
          type: 'match',
          hint: '将尸检或现场现象与最合适的毒理方向对应。',
          leftTitle: '现象',
          rightTitle: '检测方向',
          pairs: [
            { left: '心律异常、心肌无明显病变', right: '二萜类生物碱筛查。' },
            { left: '茶杯和药瓶均无异常', right: '排除常规入口，寻找接触性载体。' },
            { left: '手指可能接触异常墨迹', right: '采集指尖残留和墨迹样本。' },
            { left: '翻页前舔手指的习惯', right: '关注口腔黏膜吸收路径。' }
          ],
          rightOrder: [1, 3, 0, 2],
          success: '毒理方向明确：重点筛查乌头碱类毒物和墨迹残留。'
        },
        clueDetail: '法医办公室建议追加乌头碱等罕见生物碱筛查，并采集古籍墨迹样本。',
        clues: ['I20']
      },
      {
        id: 'recheck-table',
        name: '复检台',
        icon: '🧫',
        image: 'item-recheck-table.jpg',
        description: '复检台上放着死者口腔拭子申请、手指残留采样单和一份重新标注过的尸检图。',
        requiresClue: 'I20',
        requiresClueHint: '需要先明确专项毒理筛查方向，法医才会调出复检样本。',
        puzzle: {
          type: 'inspect',
          hint: '检查复检记录里的细节，寻找"心脏病发作"之外的微弱异常。',
          required: 3,
          points: [
            { label: '口腔右侧黏膜', note: '有轻微刺激反应，初检时容易被忽略。' },
            { label: '右手食指残留', note: '采样申请写着"需与古籍墨迹比对"。' },
            { label: '胃内容物', note: '没有明显毒物入口迹象，降低食物投毒可能。' }
          ],
          success: '复检记录支持接触性毒物经口腔黏膜进入体内的可能。'
        },
        clueDetail: '法医复检发现死者口腔内侧有轻微刺激痕迹，符合接触性毒物摄入。',
        clues: ['I21']
      },
      {
        id: 'forensic-flow',
        name: '流程板',
        icon: '📋',
        image: 'item-forensic-flow.jpg',
        description: '墙上的流程板写着从初检到专项复检的条件和步骤。',
        clues: ['B20']
      }
    ]
  },

  // ==========================================
  //  旧案档案室
  // ==========================================
  'case-archive': {
    id: 'case-archive',
    name: '旧案档案室',
    description: '档案室在警局地下二层，空气里有纸张和灰尘的味道。许多没有结论的旧案都沉在这里，直到新证据让它们重新发声。',
    background: 'scene-case-archive.jpg',
    connections: [],
    suspects: [
      { id: 'ma', name: '马承安', role: '档案管理员', portrait: 'portrait-ma.jpg' }
    ],
    items: [
      {
        id: 'archive-index',
        name: '索引柜',
        icon: '🗃️',
        image: 'item-archive-index.jpg',
        description: '索引柜里按年份排列着旧案卡片，赵明远案和南城赝品案被探案系统标成同一批调阅建议。',
        clues: ['B21']
      },
      {
        id: 'zhao-old-case',
        name: '赵明远案卷',
        icon: '📁',
        image: 'item-zhao-old-case.jpg',
        description: '2004年的旧案卷宗纸张已经发黄，封面上写着"赵明远自杀案，未发现刑事犯罪证据"。',
        puzzle: {
          type: 'sequence',
          hint: '按旧案记录恢复赵明远事件的时间线。',
          choices: [
            { label: '赵明远指控藏品被调换', detail: '他多次向朋友和警方提到交易异常。' },
            { label: '与陈墨白完成藏品交易', detail: '交易合同由周叔同协助整理。' },
            { label: '警方因证据不足未立案', detail: '当时缺少直接物证。' },
            { label: '赵明远自杀', detail: '留下写给女儿小琴的信件。' }
          ],
          answer: [1, 0, 2, 3],
          success: '旧案时间线恢复：赵明远不是凭空崩溃，他曾持续指控藏品被调换。'
        },
        clueDetail: '赵明远旧案卷宗显示，死前曾多次指控陈墨白调换藏品，但当年因缺少直接证据未能立案。',
        clues: ['I22']
      },
      {
        id: 'forgery-case',
        name: '南城赝品案',
        icon: '🧾',
        image: 'item-forgery-case.jpg',
        description: '2019年的南城赝品案卷宗厚得多，里面夹着资金流、鉴定意见和几张被涂黑的联系人名单。',
        puzzle: {
          type: 'match',
          hint: '将旧案人物或机构与当前案件中的对应嫌疑点匹配。',
          leftTitle: '旧案材料',
          rightTitle: '当前案件对应点',
          pairs: [
            { left: '空壳交易公司', right: '钱伯年账本里的中间人。' },
            { left: '外聘鉴定意见', right: '高远航的可疑鉴定证书。' },
            { left: '私人藏家圈流转', right: '陈墨白多年收藏来源。' },
            { left: '未结资金路径', right: '公司账目异常和赝品赔偿压力。' }
          ],
          rightOrder: [2, 0, 3, 1],
          success: '旧案网络已关联：多名嫌疑人有利益纠葛，但这仍只是动机网。'
        },
        clueDetail: '南城赝品案显示，钱伯年、高远航和陈墨白的收藏网络曾在旧案里间接交叉。',
        clues: ['I23']
      }
    ]
  }
};
