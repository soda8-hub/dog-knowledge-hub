// =========================================================
// 全站八大分類知識庫 (masterData)
// 完整收錄 8 個分頁之標題、標籤、分類來源與內文細節
// =========================================================
const masterData = [
    // 1. 品種 (breeds.html)
    { id: 'b1', module: 'breeds', source: '品種', date: '品種 · 大型犬', tags: ['大型犬', '活動需求', '散步', '25-45kg'], content: '大型犬 (25-45kg)：體型壯碩、活動量大，建議每天至少散步 2 次，每次 20-60 分鐘。', url: 'breeds.html?focus=大型犬' },
    { id: 'b2', module: 'breeds', source: '品種', date: '品種 · 黃金獵犬', tags: ['黃金獵犬', '金毛', '大型犬', '溫順', '聰明', '愛游泳'], content: '黃金獵犬：毛色深金、淺金、奶油、黃金，壽命 10-12 年。易患眼瞼內翻、髖關節發育不良，游泳後務必擦乾耳朵。', url: 'breeds.html?focus=黃金獵犬' },
    { id: 'b3', module: 'breeds', source: '品種', date: '品種 · 拉布拉多', tags: ['拉布拉多', '拉不拉多', '大型犬', '短毛', '活潑', '貪吃', 'POMC'], content: '拉布拉多：毛色黑、棕、黃，壽命 10-15 年。具 POMC 基因缺陷天生貪吃，需嚴格控食避免肥胖，3-4 個月為髖關節檢查黃金期。', url: 'breeds.html?focus=拉布拉多' },
    { id: 'b4', module: 'breeds', source: '品種', date: '品種 · 哈士奇', tags: ['哈士奇', '二哈', '雪橇犬', '大型犬', '像狼', '愛嚎叫', '怕熱'], content: '哈士奇：毛色黑白、灰白、紅白、純白，壽命 10-15 年。精力充沛需大量運動，常見遺傳性白內障，眼睛渾濁應立即就醫。', url: 'breeds.html?focus=哈士奇' },
    { id: 'b5', module: 'breeds', source: '品種', date: '品種 · 德國牧羊犬', tags: ['德國牧羊犬', '狼犬', '大型犬', '忠誠', '警犬', '警覺性', '胃扭轉'], content: '德國牧羊犬：壽命 9-13 年。易患髖/肘關節發育不良、退化性脊髓病 (DM) 及極危險的胃扭轉 (GDV)。', url: 'breeds.html?focus=德國牧羊犬' },
    { id: 'b6', module: 'breeds', source: '品種', date: '品種 · 台灣土狗', tags: ['台灣土狗', '台灣犬', '土狗', '米克斯', '大型犬', '立耳', '忠誠', '適應力強'], content: '台灣土狗：壽命 10-13 年。適應台灣氣候，遺傳疾病極少，但需要較大的運動量。', url: 'breeds.html?focus=台灣土狗' },
    { id: 'b7', module: 'breeds', source: '品種', date: '品種 · 中型犬', tags: ['中型犬', '活動需求', '10-25kg'], content: '中型犬 (10-25kg)：空間需求適中，建議每天散步至少 2 次，每次 20-60 分鐘。', url: 'breeds.html?focus=中型犬' },
    { id: 'b8', module: 'breeds', source: '品種', date: '品種 · 柴犬', tags: ['柴犬', '阿柴', '中型犬', '過敏', '青光眼', '膝蓋骨脫臼'], content: '柴犬：壽命 15-18 年。注意易患過敏、青光眼及膝蓋骨脫臼。', url: 'breeds.html?focus=柴犬' },
    { id: 'b9', module: 'breeds', source: '品種', date: '品種 · 法國鬥牛犬', tags: ['法國鬥牛犬', '法鬥', '中型犬', '呼吸', '中暑'], content: '法國鬥牛犬：壽命 8-10 年。呼吸系統脆弱，不耐冷熱，夏天需開冷氣預防中暑。', url: 'breeds.html?focus=法國鬥牛犬' },
    { id: 'b10', module: 'breeds', source: '品種', date: '品種 · 柯基犬', tags: ['柯基犬', '柯基', '短腿', '中型犬', '椎間盤', '脊椎', '結石'], content: '柯基犬：壽命 12-15 年。身軀長易患椎間盤疾病，需足量飲水預防尿道結石。', url: 'breeds.html?focus=柯基犬' },
    { id: 'b11', module: 'breeds', source: '品種', date: '品種 · 邊境牧羊犬', tags: ['邊境牧羊犬', '邊牧', '中型犬', '聰明', '精力旺盛', '癲癇'], content: '邊境牧羊犬：世界最聰明，精力旺盛。注意易有牧羊犬眼異常及癲癇問題，需藥物控制。', url: 'breeds.html?focus=邊境牧羊犬' },
    { id: 'b12', module: 'breeds', source: '品種', date: '品種 · 小型犬', tags: ['小型犬', '公寓', '10kg以下'], content: '小型犬 (10kg 以下)：適合公寓，每天散步 1-2 次，每次 15-30 分鐘。', url: 'breeds.html?focus=小型犬' },
    { id: 'b13', module: 'breeds', source: '品種', date: '品種 · 博美', tags: ['博美', '小型犬', '氣管脆弱', '胸背帶', '牙結石', '口臭'], content: '博美：壽命 12-20 年。注意氣管脆弱（建議用背帶）、老犬易有牙結石與口臭。', url: 'breeds.html?focus=博美' },
    { id: 'b14', module: 'breeds', source: '品種', date: '品種 · 吉娃娃', tags: ['吉娃娃', '小型犬', '代謝快', '怕冷', '保暖'], content: '吉娃娃：壽命 12-20 年。代謝快，建議一天 3-4 餐；耐寒力差，冬天需穿衣保暖。', url: 'breeds.html?focus=吉娃娃' },
    { id: 'b15', module: 'breeds', source: '品種', date: '品種 · 貴賓犬', tags: ['貴賓犬', '紅貴賓', '玩具貴賓', '小型犬', '聰明', '視網膜萎縮', 'PRA'], content: '貴賓犬：聰明易訓練，適合多種家庭。玩具型易有 PRA 漸進性視網膜萎縮。', url: 'breeds.html?focus=貴賓犬' },
    { id: 'b16', module: 'breeds', source: '品種', date: '品種 · 比熊犬', tags: ['比熊犬', '比熊', '小型犬', '毛捲親人', '刷牙', '青光眼'], content: '比熊犬：毛捲親人，適合過敏者。腸胃敏感，易患膀胱感染及青光眼，務必天天刷牙。', url: 'breeds.html?focus=比熊犬' },

    // 2. 醫療與飲食 (medical.html)
    { id: 'm1', module: 'medical', source: '醫療飲食', date: '醫療 · 疫苗接種', tags: ['預防保健', '疫苗接種', '核心疫苗', '犬瘟熱', '狂犬病', '傳染性肝炎'], content: '疫苗接種：幼年需完成核心疫苗（犬瘟熱、犬傳染性肝炎、狂犬病等），年滿一歲後每年需定期補強一次基礎疫苗。', url: 'medical.html?focus=疫苗接種' },
    { id: 'm2', module: 'medical', source: '醫療飲食', date: '醫療 · 寄生蟲預防', tags: ['預防保健', '寄生蟲預防', '心絲蟲', '跳蚤', '壁蝨', '驅蟲'], content: '寄生蟲預防：全年皆須定期進行體內（心絲蟲、腸道寄生蟲）與體外（跳蚤、壁蝨）驅蟲預防。', url: 'medical.html?focus=寄生蟲預防' },
    { id: 'm3', module: 'medical', source: '醫療飲食', date: '醫療 · 牙齒保健', tags: ['預防保健', '牙齒保健', '刷牙', '牙結石', '牙周病', '洗牙', '麻醉'], content: '牙齒保健：建議每日刷牙，預防牙結石、牙周病。洗牙需要在麻醉下進行，且必須由獸醫評估。', url: 'medical.html?focus=牙齒保健' },
    { id: 'm4', module: 'medical', source: '醫療飲食', date: '醫療 · 健康檢查', tags: ['定期健康檢查', '健檢', '血液檢查', 'X光', '超音波', '高齡犬'], content: '定期健康檢查：年輕犬每年 1 次，7 歲以上高齡犬每半年 1 次，包含理學、血液、X光與超音波檢查。', url: 'medical.html?focus=定期健康檢查' },
    { id: 'm5', module: 'medical', source: '醫療飲食', date: '醫療 · 常見疾病須知', tags: ['醫療常見須知', '髖關節', '膝蓋骨異位', '皮膚病', '耳道發炎'], content: '醫療常見須知：注意大型犬髖關節發育不良、小型犬膝蓋骨異位，以及台灣潮濕氣候引發的黴菌皮膚炎與外耳炎。', url: 'medical.html?focus=醫療常見須知' },
    { id: 'm6', module: 'medical', source: '醫療飲食', date: '禁忌 · 巧克力與葡萄', tags: ['劇毒禁忌', '巧克力', '可可鹼', '葡萄', '葡萄乾', '急性腎衰竭', '中毒', '不能吃'], content: '劇毒食物：巧克力含可可鹼影響神經與心臟；葡萄與葡萄乾會引發急性腎衰竭，絕對不可餵食。', url: 'medical.html?focus=葡萄與葡萄乾' },
    { id: 'm7', module: 'medical', source: '醫療飲食', date: '禁忌 · 木糖醇與蔥類', tags: ['劇毒禁忌', '木糖醇', '花生醬', '口香糖', '洋蔥', '大蒜', '韭菜', '蔥類植物', '溶血性貧血'], content: '劇毒食物：木糖醇（常見於花生醬、口香糖）會損傷肝臟；洋蔥、大蒜、韭菜等硫化物會破壞紅血球造成溶血性貧血。', url: 'medical.html?focus=木糖醇' },
    { id: 'm8', module: 'medical', source: '醫療飲食', date: '禁忌 · 高風險食物', tags: ['高風險食物', '熟骨頭', '雞骨頭', '生食', '生肉', '生蛋', '咖啡因', '酒精', '辛辣物'], content: '高風險食物：熟骨頭易碎裂造成窒息或腸胃道刺傷；生食可能含寄生蟲或細菌；咖啡因、酒精、辛辣物會引起嘔吐腹瀉。', url: 'medical.html?focus=熟骨頭' },
    { id: 'm9', module: 'medical', source: '醫療飲食', date: '醫療 · 晶片與日常照護', tags: ['日常照護', '寵物晶片', '寵物登記', '鼻紋', '絕育', '結紮', '子宮蓄膿'], content: '日常照護與晶片：依法植入寵物晶片辦理登記；適齡絕育可預防母犬子宮蓄膿、乳腺腫瘤及公犬攝護腺疾病。', url: 'medical.html?focus=寵物晶片' },

    // 3. 飼料食物 (food.html)
    { id: 'f1', module: 'food', source: '飼料食物', date: '飼料 · 乾糧與主食', tags: ['乾糧', '飼料', '主食', '牙垢', '保存'], content: '乾糧（飼料）：水分含量低易於保存，能提供均衡營養，咀嚼顆粒有助減少牙垢堆積，餵食時需提供充足飲水。', url: 'food.html?focus=乾糧' },
    { id: 'f2', module: 'food', source: '飼料食物', date: '飼料 · 濕糧與罐頭', tags: ['濕糧', '罐頭', '餐包', '補水', '挑嘴', '適口性'], content: '濕糧（主食罐、副食罐、餐包）：水分含量高、適口性極佳，適合不愛喝水、挑嘴或牙口退化的高齡犬。', url: 'food.html?focus=濕糧' },
    { id: 'f3', module: 'food', source: '飼料食物', date: '飼料 · 鮮食與營養挑選', tags: ['鮮食', '飲食', '蛋白質', '換食', '腸胃敏感'], content: '鮮食與換食原則：自製鮮食需注意鈣磷比與營養均衡；更換新飼料時應採「七日漸進換食法」，避免狗狗軟便腹瀉。', url: 'food.html' },

    // 4. 狗狗行為 (behavior.html)
    { id: 'bh1', module: 'behavior', source: '狗狗行為', date: '行為 · 興奮吠叫', tags: ['吠叫語言', '興奮吠叫', '呃汪', '高頻急促', '主人回家', '玩樂'], content: '興奮吠叫「呃...汪！」：特徵高頻急促，常見於主人回家、出門前、玩樂。建議等冷靜後回應，用指令控制。', url: 'behavior.html?focus=興奮吠叫' },
    { id: 'bh2', module: 'behavior', source: '狗狗行為', date: '行為 · 需求吠叫', tags: ['吠叫語言', '需求吠叫', '嗚嗚', '細小哀鳴', '吃飯', '喝水'], content: '需求吠叫「嗚~嗚~」：特徵細小哀鳴，常見於想吃飯、喝水、出門尋求照顧。建議確認需求，延遲回應教導耐心。', url: 'behavior.html?focus=需求吠叫' },
    { id: 'bh3', module: 'behavior', source: '狗狗行為', date: '行為 · 警戒吠叫', tags: ['吠叫語言', '警戒吠叫', '嗚吼', '低沉短促', '陌生人', '防衛'], content: '警戒吠叫「嗚~吼！」：特徵低沉短促，陌生人靠近或領地被侵犯時的防衛警告。建議評估環境，以正向訓練減焦慮。', url: 'behavior.html?focus=警戒吠叫' },
    { id: 'bh4', module: 'behavior', source: '狗狗行為', date: '行為 · 分離焦慮', tags: ['吠叫語言', '分離焦慮', '長嚎', '獨處', '雷聲', '鞭炮', '恐懼', '一直哭'], content: '分離焦慮「嗚嗚嗚~！」：長嚎、急促不規則，獨處或雷聲鞭炮時感到不安恐懼。建議安撫並逐步訓練適應獨處。', url: 'behavior.html?focus=分離焦慮' },
    { id: 'bh5', module: 'behavior', source: '狗狗行為', date: '行為 · 尾巴肢體語言', tags: ['尾巴肢體', '搖尾巴', '大幅快速搖動', '輕輕平穩搖動', '螺旋狀', '高高翹起', '低垂夾在腿間'], content: '尾巴肢體語言：大幅搖動與螺旋旋轉代表極度開心；高高翹起或豎直僵硬代表警戒敵意；低垂夾在腿間代表強烈恐懼不安。', url: 'behavior.html?focus=尾巴肢體語言' },
    { id: 'bh6', module: 'behavior', source: '狗狗行為', date: '行為 · 耳朵與飛機耳', tags: ['耳朵訊號', '飛機耳', '豎耳', '耳朵後貼', '撒嬌', '壓力'], content: '耳朵訊號與飛機耳：耳朵豎起為警覺偵測；飛機耳伴隨搖尾眼神溫柔是撒嬌示好，若伴隨打哈欠、舔鼻則是自我安撫壓力。', url: 'behavior.html?focus=飛機耳' },
    { id: 'bh7', module: 'behavior', source: '狗狗行為', date: '行為 · 身體姿態動作', tags: ['身體姿態', '全身放鬆躺地', '露肚皮', '身體向前傾', '肌肉緊繃', '弓起身體'], content: '身體姿態：全身放鬆躺地露肚皮代表信任；前肢傾前代表邀玩；肌肉緊繃站立為警戒威嚇；弓起身體靠地為害怕臣服。', url: 'behavior.html?focus=身體姿態與動作' },
    { id: 'bh8', module: 'behavior', source: '狗狗行為', date: '行為 · 舔拭的意義', tags: ['舔拭意義', '舔手', '舔臉', '表達愛意', '社交問候', '求饒示弱', '自我安撫'], content: '舔拭的意義：舔主人的臉或手象徵喜愛與信任；面對強勢對象為求饒示弱；過度舔拭自身需注意皮膚問題或心理壓力。', url: 'behavior.html?focus=舔拭的意義' },

    // 5. 年紀狀況 (age.html)
    { id: 'a1', module: 'age', source: '年紀狀況', date: '年紀 · 高齡標準與壽命', tags: ['年紀狀況', '年齡換算', '高齡標準', '壽命', '小型犬', '中型犬', '大型犬'], content: '年紀與高齡標準：小型犬約 7 歲、中型犬約 6 歲、大型犬約 5 歲開始步入高齡期，大型犬老化速度較快需提早保養關節。', url: 'age.html' },
    { id: 'a2', module: 'age', source: '年紀狀況', date: '年紀 · 幼犬至老犬照護', tags: ['幼犬', '成犬', '老犬', '換牙', '社會化', '退化', '失智'], content: '各年齡層照護：幼犬期注重保溫、少量多餐與社會化；成犬期維持充足運動與潔牙；老犬期加強關節止滑、保暖與每半年健檢。', url: 'age.html' },

    // 6. 寵物用品 (supplies.html)
    { id: 's1', module: 'supplies', source: '寵物用品', date: '用品 · 飲食與居家', tags: ['寵物用品', '食碗', '水碗', '慢食碗', '狗床', '睡窩', '圍欄', '尿布墊'], content: '飲食與居家用品：準備好清洗的不鏽鋼或陶瓷碗、防噎慢食碗，以及安靜舒適的睡窩、圍欄與定點如廁尿布墊。', url: 'supplies.html' },
    { id: 's2', module: 'supplies', source: '寵物用品', date: '用品 · 外出與玩具清潔', tags: ['寵物用品', '牽繩', '胸背帶', '項圈', '拾便袋', '玩具', '洗毛精', '指甲剪', '梳子'], content: '外出與美容用品：胸背帶（防暴衝傷氣管）、牽繩、拾便袋，以及狗狗專用洗毛精、梳子、指甲剪與抗憂鬱耐咬玩具。', url: 'supplies.html' },

    // 7. 照顧方法 (care.html)
    { id: 'c1', module: 'care', source: '照顧方法', date: '照顧 · 洗澡與梳毛', tags: ['照顧方法', '洗澡', '吹乾', '洗毛精', '梳毛', '換毛', '皮膚病'], content: '洗澡與梳毛：使用寵物專用洗毛精，洗後務必徹底吹乾毛根預防黴菌皮膚炎；每日梳毛去除廢毛並促進血液循環。', url: 'care.html' },
    { id: 'c2', module: 'care', source: '照顧方法', date: '照顧 · 清耳、剪指甲與刷牙', tags: ['照顧方法', '清耳朵', '潔耳液', '剪指甲', '血線', '腳底毛', '刷牙', '淚痕'], content: '日常清潔細節：定期使用潔耳液清耳朵、修剪指甲（避開粉紅血線）與腳底毛防滑，並養成天天刷牙的好習慣。', url: 'care.html' },

    // 8. 運動 (exercise.html)
    { id: 'e1', module: 'exercise', source: '運動指南', date: '運動 · 散步與放電', tags: ['運動', '散步', '跑步', '飛盤', '拾回遊戲', '游泳', '嗅聞'], content: '散步與運動放電：每日定時散步滿足探索與排泄需求，搭配拾回遊戲、游泳（保護關節）或室內藏食嗅聞遊戲消耗精力。', url: 'exercise.html' },
    { id: 'e2', module: 'exercise', source: '運動指南', date: '運動 · 安全注意事項', tags: ['運動', '中暑', '肉球燙傷', '柏油路', '胃扭轉', '補水'], content: '運動安全注意：夏季避開正午高溫以防中暑與柏油路燙傷腳掌肉球；飯後一小時內禁止劇烈運動，預防致命胃扭轉。', url: 'exercise.html' }
];

const currentModule = 'all';

// 首頁相容輔助函式（維持 setupSearch 結構完整性）
function refreshView() {
    const resultsList = document.getElementById('searchResults') || document.getElementById('searchSuggestions');
    if (resultsList) resultsList.style.display = 'none';
}
function renderSidebarStats(matched) {}
function renderTimeline(matched) {}

// 自動注入搜尋選單與鍵盤反白樣式，確保 li 與 .autocomplete-active 視覺完美呈現
function injectSearchStyles() {
    if (document.getElementById('custom-search-styles')) return;
    const style = document.createElement('style');
    style.id = 'custom-search-styles';
    style.textContent = `
        #searchSuggestions, #searchResults {
            list-style: none;
            padding: 6px 0 !important;
            margin: 0 !important;
        }
        #searchSuggestions li, #searchResults li {
            list-style: none;
            padding: 10px 14px;
            border-bottom: 1px solid #eef5f0;
            cursor: pointer;
            font-size: 14px;
            color: #333333;
            line-height: 1.5;
            text-align: left;
            background-color: #ffffff;
            transition: background-color 0.15s ease;
        }
        #searchSuggestions li:last-child, #searchResults li:last-child {
            border-bottom: none;
        }
        #searchSuggestions li:hover, #searchResults li:hover,
        #searchSuggestions li.autocomplete-active, #searchResults li.autocomplete-active {
            background-color: #e0f0e8 !important;
            font-weight: bold;
        }
        .s-date {
            display: inline-block;
            background-color: #387c59;
            color: #ffffff;
            font-size: 12px;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 12px;
            margin-right: 6px;
        }
    `;
    document.head.appendChild(style);
}

// =========================================================
// 核心搜尋邏輯 (完全依照指定 setupSearch 架構撰寫)
// =========================================================
function setupSearch() { 
    const input = document.getElementById('searchInput'); 
    // 自動相容 #searchResults 與首頁現有的 #searchSuggestions
    const resultsList = document.getElementById('searchResults') || document.getElementById('searchSuggestions'); 
    const searchBtn = document.getElementById('searchBtn');
    let currentFocus = -1; 

    if (!input || !resultsList) return;
    injectSearchStyles();
    
    input.addEventListener('input', function() { 
        const val = this.value.toLowerCase().trim(); 
        resultsList.innerHTML = ''; 
        currentFocus = -1; 
        
        if (!val) { 
            refreshView(); 
            return; 
        } 
        
        // 搜尋也必須針對 masterData 進行過濾 
        const searchScope = masterData.filter(item => currentModule === 'all' || item.module === currentModule); 
        const matched = searchScope.filter(item => 
            item.content.toLowerCase().includes(val) || 
            item.tags.join('').toLowerCase().includes(val) || 
            item.source.toLowerCase().includes(val) ||
            item.date.toLowerCase().includes(val)
        ); 
        
        renderSidebarStats(matched); 
        renderTimeline(matched); 

        if (matched.length === 0) {
            resultsList.style.display = 'none';
            return;
        }
        
        matched.forEach(item => { 
            const li = document.createElement('li'); 
            li.innerHTML = `<span class="s-date">${item.date}</span> ${item.content.substring(0, 22)}...`; 
            
            li.addEventListener('click', () => { 
                input.value = ''; 
                resultsList.innerHTML = ''; 
                resultsList.style.display = 'none';

                // 若同頁面有對應卡片則直接滾動，否則跳轉至對應八大分頁區塊
                const targetCard = document.getElementById(`post-${item.id}`); 
                if (targetCard) { 
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
                    targetCard.style.boxShadow = '0 0 0 3px var(--mint-green)'; 
                    setTimeout(() => targetCard.style.boxShadow = '', 2000); 
                } else if (item.url) {
                    window.location.href = item.url;
                }
            }); 
            resultsList.appendChild(li); 
        }); 

        resultsList.style.display = 'block';
    }); 
    
    input.addEventListener('keydown', function(e) { 
        const items = resultsList.getElementsByTagName('li'); 
        if (e.key === 'ArrowDown') { 
            e.preventDefault();
            currentFocus++; 
            addActive(items); 
        } else if (e.key === 'ArrowUp') { 
            e.preventDefault();
            currentFocus--; 
            addActive(items); 
        } else if (e.key === 'Enter') { 
            e.preventDefault(); 
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click(); 
            } else if (items.length > 0) {
                items[0].click();
            } else if (searchBtn) {
                searchBtn.click();
            }
        } 
    }); 
    
    function addActive(items) { 
        if (!items || items.length === 0) return; 
        for (let i = 0; i < items.length; i++) items[i].classList.remove('autocomplete-active'); 
        if (currentFocus >= items.length) currentFocus = 0; 
        if (currentFocus < 0) currentFocus = (items.length - 1); 
        items[currentFocus].classList.add('autocomplete-active'); 
        items[currentFocus].scrollIntoView({ block: 'nearest' }); 
    } 
    
    document.addEventListener('click', (e) => { 
        if (e.target !== input) {
            resultsList.innerHTML = ''; 
            resultsList.style.display = 'none';
        }
    }); 

    // 支援點擊旁邊的「搜尋」按鈕
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const items = resultsList.getElementsByTagName('li');
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            } else if (items.length > 0) {
                items[0].click();
            } else {
                const val = input.value.toLowerCase().trim();
                if (!val) return alert('請輸入搜尋內容');
                const matched = masterData.find(item =>
                    item.content.toLowerCase().includes(val) ||
                    item.tags.join('').toLowerCase().includes(val) ||
                    item.source.toLowerCase().includes(val)
                );
                if (matched) window.location.href = matched.url;
                else alert('找不到相關知識，請嘗試其他關鍵字（如：柯基、疫苗、巧克力）');
            }
        });
    }
}

// 頁面載入與按上一頁返回時初始化
document.addEventListener('DOMContentLoaded', setupSearch);
window.addEventListener('pageshow', () => {
    const input = document.getElementById('searchInput');
    const resultsList = document.getElementById('searchResults') || document.getElementById('searchSuggestions');
    if (input) input.value = '';
    if (resultsList) {
        resultsList.innerHTML = '';
        resultsList.style.display = 'none';
    }
});
