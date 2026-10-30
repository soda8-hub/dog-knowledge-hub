window.addEventListener('pageshow', function () {
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');
    if (searchInput) searchInput.value = '';
    if (suggestionsBox) suggestionsBox.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsBox = document.getElementById('searchSuggestions');

    let currentFocus = -1;
    let isKeyboardNav = false; 

    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
    }

    // 靜態知識庫（涵蓋八大分頁所有細項詞語，說明文字極簡化）
    const searchDatabase = [
        // ================= 1. 品種 (breeds.html) =================
        { category: "品種", label: "品種總覽", desc: "大型、中型、小型犬特點", keywords: "犬種 狗種 品種", url: "breeds.html" },
        { category: "品種", label: "大型犬 (25-45kg)", desc: "黃金、拉布拉多、哈士奇、德牧、土狗", keywords: "大型狗 大狗 活動需求", url: "breeds.html?focus=大型犬" },
        { category: "品種", label: "中型犬 (10-25kg)", desc: "柴犬、法鬥、柯基、邊牧", keywords: "中型狗 中狗", url: "breeds.html?focus=中型犬" },
        { category: "品種", label: "小型犬 (10kg以下)", desc: "博美、吉娃娃、貴賓、比熊", keywords: "小型狗 小狗 公寓", url: "breeds.html?focus=小型犬" },
        { category: "品種", label: "黃金獵犬", desc: "溫順聰明、愛游泳、注意髖關節", keywords: "金毛 深金 淺金 奶油 眼瞼內翻 髖關節發育不良 擦乾耳朵", url: "breeds.html?focus=黃金獵犬" },
        { category: "品種", label: "拉布拉多", desc: "短毛活潑、POMC基因貪吃", keywords: "拉不拉多 導盲犬 控食 肥胖 髖關節檢查", url: "breeds.html?focus=拉布拉多" },
        { category: "品種", label: "哈士奇", desc: "像狼、愛嚎叫、怕熱、注意白內障", keywords: "二哈 雪橇犬 拆家 遺傳性白內障 眼睛渾濁", url: "breeds.html?focus=哈士奇" },
        { category: "品種", label: "德國牧羊犬", desc: "忠誠警犬、注意關節與胃扭轉", keywords: "狼犬 德牧 警覺性 肘關節 退化性脊髓病 DM 胃扭轉 GDV", url: "breeds.html?focus=德國牧羊犬" },
        { category: "品種", label: "台灣土狗", desc: "立耳忠誠、適應力強、遺傳病少", keywords: "台灣犬 土狗 米克斯 台灣氣候", url: "breeds.html?focus=台灣土狗" },
        { category: "品種", label: "柴犬", desc: "注意過敏、青光眼與膝蓋骨脫臼", keywords: "阿柴 柴柴 固執 換毛 膝蓋骨", url: "breeds.html?focus=柴犬" },
        { category: "品種", label: "法國鬥牛犬", desc: "呼吸系統脆弱、不耐冷熱防中暑", keywords: "法鬥 鬥牛犬 短吻 開冷氣 中暑", url: "breeds.html?focus=法國鬥牛犬" },
        { category: "品種", label: "柯基犬", desc: "身軀長易患椎間盤疾病、防結石", keywords: "柯基 科基 短腿 脊椎 椎間盤 尿道結石", url: "breeds.html?focus=柯基犬" },
        { category: "品種", label: "邊境牧羊犬", desc: "世界最聰明、注意眼異常與癲癇", keywords: "邊牧 牧羊犬 精力旺盛 牧羊犬眼異常 癲癇", url: "breeds.html?focus=邊境牧羊犬" },
        { category: "品種", label: "博美", desc: "氣管脆弱建議用背帶、注意牙結石", keywords: "薄美 博美犬 氣管 口臭 牙結石", url: "breeds.html?focus=博美" },
        { category: "品種", label: "吉娃娃", desc: "代謝快少量多餐、耐寒差需保暖", keywords: "吉娃 怕冷 穿衣保暖", url: "breeds.html?focus=吉娃娃" },
        { category: "品種", label: "貴賓犬", desc: "聰明易訓練、注意視網膜萎縮", keywords: "紅貴賓 玩具貴賓 貴兵 捲毛 PRA 漸進性視網膜萎縮", url: "breeds.html?focus=貴賓犬" },
        { category: "品種", label: "比熊犬", desc: "毛捲親人、腸胃敏感需天天刷牙", keywords: "比熊 棉花糖 過敏 膀胱感染 青光眼", url: "breeds.html?focus=比熊犬" },

        // ================= 2. 醫療與飲食禁忌 (medical.html) =================
        { category: "醫療", label: "醫療與飲食總覽", desc: "疫苗、健檢、症狀與中毒禁忌", keywords: "看醫生 醫院 生病", url: "medical.html" },
        { category: "醫療", label: "疫苗接種", desc: "核心疫苗、犬瘟熱、狂犬病補強", keywords: "預防保健 打針 預防針 基礎疫苗 小病毒腸炎 傳染性肝炎 副流行性感冒", url: "medical.html?focus=疫苗接種" },
        { category: "醫療", label: "寄生蟲預防", desc: "體內外驅蟲、心絲蟲、跳蚤壁蝨", keywords: "驅蟲 蛔蟲 鉤蟲 鞭蟲 絛蟲", url: "medical.html?focus=寄生蟲預防" },
        { category: "醫療", label: "牙齒保健與洗牙", desc: "每日刷牙預防牙周病與牙結石", keywords: "麻醉洗牙 口臭 牙齦", url: "medical.html?focus=牙齒保健" },
        { category: "醫療", label: "定期健康檢查", desc: "理學、血液、糞便尿液與X光超音波", keywords: "健檢 聽診 觸診 血檢 肝腎功能 內臟", url: "medical.html?focus=定期健康檢查" },
        { category: "醫療", label: "醫療警訊與症狀", desc: "食慾改變、嘔吐腹瀉、呼吸困難", keywords: "精神萎靡 暴飲暴食 體重減輕 咳嗽 抽搐 步態不穩 舔咬 脫毛 紅腫 頻尿 血尿", url: "medical.html?focus=醫療警訊" },
        { category: "禁忌", label: "巧克力 (絕對禁食)", desc: "含可可鹼與茶鹼，致心律不整死亡", keywords: "中毒 不能吃 劇毒 嘔吐 腹瀉 癲癇", url: "medical.html?focus=巧克力" },
        { category: "禁忌", label: "葡萄與葡萄乾 (禁食)", desc: "引發急性腎衰竭、無尿休克", keywords: "中毒 不能吃 水果 腎臟", url: "medical.html?focus=葡萄與葡萄乾" },
        { category: "禁忌", label: "木糖醇 (絕對禁食)", desc: "常見於口香糖花生醬，致肝衰竭", keywords: "中毒 不能吃 胰島素 低血糖 抽搐", url: "medical.html?focus=木糖醇" },
        { category: "禁忌", label: "蔥類植物 (絕對禁食)", desc: "洋蔥、大蒜、韭菜，致溶血性貧血", keywords: "中毒 不能吃 青蔥 硫化物 紅血球", url: "medical.html?focus=蔥類植物" },
        { category: "禁忌", label: "熟骨頭 (高風險)", desc: "煮熟雞豬牛骨易碎裂刺傷腸胃", keywords: "不能吃 雞骨頭 豬骨 窒息", url: "medical.html?focus=熟骨頭" },
        { category: "禁忌", label: "生食：生肉與生蛋", desc: "沙門氏菌、大腸桿菌與寄生蟲風險", keywords: "高風險 生雞蛋 細菌", url: "medical.html?focus=生食" },
        { category: "禁忌", label: "咖啡因、酒精、辛辣物", desc: "影響神經心臟或引起腸胃嘔吐", keywords: "茶 咖啡 酒 辣椒 高風險", url: "medical.html?focus=咖啡因" },
        { category: "醫療", label: "寵物晶片與寵物登記", desc: "法定身分證明，防走失協尋", keywords: "打晶片 鼻紋 身分識別", url: "medical.html?focus=寵物晶片" },
        { category: "醫療", label: "結紮與絕育手術", desc: "預防生殖系統疾病與發情行為", keywords: "子宮蓄膿 乳腺腫瘤 睪丸癌 攝護腺 騎乘 標記", url: "medical.html?focus=結紮" },
        { category: "醫療", label: "寵物保險", desc: "分擔門診、住院與手術醫療費用", keywords: "保險 醫藥費 理賠", url: "medical.html?focus=寵物保險" },
        { category: "醫療", label: "日常環境安全", desc: "收妥清潔劑、電線、小物件與藥物", keywords: "居家安全 誤食 百合 萬年青", url: "medical.html?focus=環境安全" },

        // ================= 3. 飼料食物 (food.html) =================
        { category: "飲食", label: "飼料與食物總覽", desc: "乾糧、罐頭、年齡與機能挑選", keywords: "飼料 食物 主食 吃什麼", url: "food.html" },
        { category: "飲食", label: "乾飼料 vs 濕食罐頭", desc: "磨牙便利 vs 補水適口性高", keywords: "乾糧 主食罐 副食罐 鮮食包 肉泥 水分 潔牙", url: "food.html?focus=乾飼料" },
        { category: "飲食", label: "各年齡飼料挑選", desc: "離乳期、幼犬、成犬、高齡老犬", keywords: "離乳慕斯 飼料泡軟 高蛋白 低脂 低卡 關節保健", url: "food.html?focus=年齡階段" },
        { category: "飲食", label: "機能型飼料挑選", desc: "腸胃敏感、皮膚過敏、減肥、關節", keywords: "益生菌 水解蛋白 無穀 單一肉源 鮭魚 羊肉 鹿肉 綠唇貝 葡萄糖胺 軟骨素", url: "food.html?focus=特殊健康需求" },
        { category: "飲食", label: "無穀 vs 含穀飼料", desc: "低碳水防敏 vs 高纖穩定血糖", keywords: "糙米 燕麥 大麥 玉米 小麥 大豆 豌豆 馬鈴薯 鷹嘴豆", url: "food.html?focus=無穀" },
        { category: "飲食", label: "認識飼料成分表", desc: "優質肉類蛋白、脂肪與避開副產品", keywords: "雞肉 牛肉 火雞肉 肉粉 魚油 亞麻籽 BHA BHT 防腐劑 人工色素", url: "food.html?focus=成分表" },
        { category: "飲食", label: "飼料品牌推薦", desc: "皇家、希爾思、渴望、愛肯拿、原點等", keywords: "Royal Canin Hill's Orijen Acana Instinct 柏萊富 Blackwood 優格 莫比 自然本色 倍力 瑞威 怪獸部落 汪喵星球 西莎 惜時", url: "food.html?focus=品牌" },
        { category: "飲食", label: "換食七日法與保存", desc: "漸進式換糧防軟便、密封防潮", keywords: "換飼料 拉肚子 軟便 密封桶 保存期限", url: "food.html?focus=換食" },

        // ================= 4. 狗狗行為 (behavior.html) =================
        { category: "行為", label: "狗狗行為解讀總覽", desc: "叫聲、尾巴、耳朵、姿勢與舔拭", keywords: "肢體語言 動作 心理 情緒", url: "behavior.html" },
        { category: "行為", label: "興奮吠叫 (呃...汪！)", desc: "高頻急促，歡迎主人或想玩", keywords: "一直叫 亂叫 叫聲 聲音", url: "behavior.html?focus=興奮吠叫" },
        { category: "行為", label: "需求吠叫 (嗚~嗚~)", desc: "細小哀鳴，想吃飯喝水或出門", keywords: "嬰兒哭 哼哼叫 討食", url: "behavior.html?focus=需求吠叫" },
        { category: "行為", label: "警戒吠叫 (嗚~吼！)", desc: "低沉短促，陌生人靠近或領地防衛", keywords: "低吼 兇 護地盤 看門", url: "behavior.html?focus=警戒吠叫" },
        { category: "行為", label: "分離焦慮吠叫 (嗚嗚~)", desc: "長嚎急促，獨處、雷聲或鞭炮恐懼", keywords: "半夜哭 孤單 害怕 拆家", url: "behavior.html?focus=分離焦慮" },
        { category: "行為", label: "尾巴：大幅搖動 / 旋轉", desc: "興奮、極度開心、強烈互動欲", keywords: "搖尾巴 螺旋 扭屁股 開心", url: "behavior.html?focus=大幅快速搖動" },
        { category: "行為", label: "尾巴：高翹 / 僵硬豎直", desc: "自信主導或警戒敵意、攻擊傾向", keywords: "尾巴豎起 生氣 宣示主權", url: "behavior.html?focus=高高翹起" },
        { category: "行為", label: "尾巴：低垂夾在腿間", desc: "害怕、強烈恐懼不安與服從", keywords: "夾尾巴 發抖 蜷縮", url: "behavior.html?focus=低垂夾在腿間" },
        { category: "行為", label: "耳朵：豎耳 / 往後貼", desc: "警覺偵測環境、準備玩耍或恐懼", keywords: "耳朵訊號 吐舌", url: "behavior.html?focus=警覺偵測" },
        { category: "行為", label: "飛機耳 (耳朵外展)", desc: "撒嬌示好，或伴隨哈欠的壓力安撫", keywords: "開飛機 打哈欠 舔鼻", url: "behavior.html?focus=飛機耳" },
        { category: "行為", label: "翻肚皮 / 身體前傾", desc: "全身放鬆信任、邀玩互動", keywords: "露出肚皮 躺地 邀玩 翹屁股", url: "behavior.html?focus=全身放鬆躺地" },
        { category: "行為", label: "肌肉緊繃 / 弓背靠地", desc: "警戒威嚇準備攻擊，或害怕臣服", keywords: "炸毛 毛髮豎立 駝背 逃跑", url: "behavior.html?focus=肌肉緊繃站立" },
        { category: "行為", label: "舔拭行為意義", desc: "表達愛意、社交問候、求饒或焦慮", keywords: "舔手 舔臉 過度舔拭 舔腳", url: "behavior.html?focus=表達愛意" },

        // ================= 5. 年紀狀況 (age.html) =================
        { category: "年紀", label: "年紀與人類年齡換算", desc: "幼犬、成犬、老犬標準與換算表", keywords: "幾歲 壽命 年齡對照", url: "age.html" },
        { category: "年紀", label: "幼犬期照護與社會化", desc: "換牙期亂咬、少量多餐、核心疫苗", keywords: "小狗 奶狗 3-6個月 換牙 口腔期 磨牙 社會化", url: "age.html?focus=幼犬" },
        { category: "年紀", label: "幼犬常見疾病", desc: "犬小病毒、犬瘟熱、寄生蟲與低血糖", keywords: "幼犬生病 拉血 抽搐", url: "age.html?focus=幼犬常見疾病" },
        { category: "年紀", label: "成犬期照護與保健", desc: "體重管理、定期洗牙與年度健檢", keywords: "1-7歲 成犬 肥胖", url: "age.html?focus=成犬" },
        { category: "年紀", label: "老犬期照護與失智", desc: "關節保暖、防滑墊、白內障與失智症", keywords: "高齡犬 熟齡犬 老狗 7歲 8歲 認知障礙 關節炎 心臟病 腎衰竭 失禁", url: "age.html?focus=老犬" },

        // ================= 6. 寵物用品 (supplies.html) =================
        { category: "用品", label: "寵物用品必備清單", desc: "飲食、睡眠、外出、清潔與玩具", keywords: "新手準備 買什麼 用品", url: "supplies.html" },
        { category: "用品", label: "胸背帶、項圈與牽繩", desc: "H型/Y型防暴衝胸背帶、外出牽繩", keywords: "溜狗 散步 氣管壓迫 伸縮牽繩", url: "supplies.html?focus=胸背帶" },
        { category: "用品", label: "外出籠、推車與安全帶", desc: "航空運輸籠、老犬推車、車用安全扣", keywords: "提籠 背包 坐車 搭車 拾便袋 外出水壺", url: "supplies.html?focus=外出籠" },
        { category: "用品", label: "食碗、慢食碗與飲水機", desc: "陶瓷不鏽鋼碗、防狼吞虎嚥慢食碗", keywords: "水碗 飯碗 脹氣 黑下巴 濾水", url: "supplies.html?focus=飲食器具" },
        { category: "用品", label: "睡窩、床墊與圍欄籠具", desc: "關節支撐記憶床墊、安全感籠內訓練", keywords: "狗床 睡墊 狗屋 狗籠 涼墊 保暖毯", url: "supplies.html?focus=睡眠與休息" },
        { category: "用品", label: "尿布墊、便盆與除臭噴霧", desc: "室內定點大小便訓練與酵素除臭", keywords: "尿墊 廁所 尿味 消毒", url: "supplies.html?focus=如廁與環境清潔" },
        { category: "用品", label: "洗毛精、梳子、牙刷與指甲剪", desc: "狗狗專用洗劑、針梳排梳、潔耳液", keywords: "美容用品 止血粉 剃毛刀 電剪 指套 牙膏", url: "supplies.html?focus=美容與日常護理" },
        { category: "用品", label: "嗅聞墊、益智與磨牙玩具", desc: "KONG藏食玩具、繩結拔河、發聲玩具", keywords: "玩具 抗憂鬱 消耗精力 潔牙繩", url: "supplies.html?focus=娛樂與益智玩具" },

        // ================= 7. 照顧方法 (care.html) =================
        { category: "照顧", label: "日常照顧方法總覽", desc: "梳毛、洗澡、耳朵、指甲與刷牙", keywords: "美容 清潔 護理", url: "care.html" },
        { category: "照顧", label: "梳毛技巧與頻率", desc: "去除廢毛防打結、促進血液循環", keywords: "掉毛 換毛期 針梳 排梳 毛球", url: "care.html?focus=梳毛" },
        { category: "照顧", label: "洗澡頻率與吹乾步驟", desc: "2-4週洗一次、35-38度水溫、徹底吹乾", keywords: "洗澡 吹毛 擠肛門腺 磨屁股 指間炎 濕疹", url: "care.html?focus=洗澡" },
        { category: "照顧", label: "清耳朵步驟 (潔耳液)", desc: "倒入潔耳液按摩耳根，切勿用棉花棒", keywords: "耳道清潔 耳垢 耳蟎 發炎 甩頭 垂耳", url: "care.html?focus=耳朵" },
        { category: "照顧", label: "剪指甲與剃腳底毛", desc: "避開粉紅血管(血線)、防滑與肉球保養", keywords: "修剪指甲 流血 止血粉 磨甲機 腳掌 肉墊", url: "care.html?focus=指甲" },
        { category: "照顧", label: "刷牙步驟與口腔清潔", desc: "每天刷牙、酵素牙膏、翻開嘴唇刷牙齦", keywords: "牙刷 牙結石 口臭 潔牙骨", url: "care.html?focus=刷牙" },

        // ================= 8. 運動 (exercise.html) =================
        { category: "運動", label: "運動與放電指南總覽", desc: "各體型運動量、遊戲項目與安全", keywords: "散步 放電 體力", url: "exercise.html" },
        { category: "運動", label: "每日建議運動時間", desc: "小型犬30分、中大型犬60-120分鐘", keywords: "運動量 散步時間 幾次", url: "exercise.html?focus=運動量" },
        { category: "運動", label: "散步與嗅聞探索", desc: "基礎有氧運動，聞氣味可舒緩壓力", keywords: "溜狗 嗅聞散步 動腦", url: "exercise.html?focus=散步" },
        { category: "運動", label: "你丟我撿與接飛盤", desc: "高強度奔跑放電，注意關節緩衝", keywords: "丟球 撿球 飛盤 衝刺", url: "exercise.html?focus=你丟我撿" },
        { category: "運動", label: "游泳與水療運動", desc: "零關節負擔全身運動，適合老犬與大犬", keywords: "玩水 救生衣 髖關節", url: "exercise.html?focus=游泳" },
        { category: "運動", label: "室內遊戲與雨天放電", desc: "拔河遊戲、嗅聞墊、捉迷藏與指令訓練", keywords: "下雨天 在家玩 藏食", url: "exercise.html?focus=室內" },
        { category: "運動", label: "運動安全：防中暑與防燙傷", desc: "手背測柏油路溫度、飯後勿劇烈運動", keywords: "夏天散步 肉球燙傷 喝水 胃扭轉 熱衰竭", url: "exercise.html?focus=安全" }
    ];

    function getHistory() {
        try {
            const raw = JSON.parse(localStorage.getItem('dogSearchHistory') || '[]');
            const valid = raw
                .map(item => ({
                    label: item.label || item.title || '',
                    url: item.url || ''
                }))
                .filter(item => item.label && item.label !== 'undefined' && item.url);
            localStorage.setItem('dogSearchHistory', JSON.stringify(valid));
            return valid;
        } catch (e) {
            return [];
        }
    }

    function saveHistory(label, url) {
        if (!label || label === 'undefined') return;
        let history = getHistory().filter(item => item.label !== label);
        history.unshift({ label, url });
        if (history.length > 5) history = history.slice(0, 5);
        localStorage.setItem('dogSearchHistory', JSON.stringify(history));
    }

    if (searchBtn && searchInput && suggestionsBox) {

        suggestionsBox.addEventListener('mousemove', () => {
            isKeyboardNav = false;
        });

        searchInput.addEventListener('input', () => {
            handleInput();
        });

        searchInput.addEventListener('focus', () => {
            handleInput();
        });

        function handleInput() {
            const rawValue = searchInput.value.trim().toLowerCase();
            const cleanQuery = rawValue.replace(/[\u3105-\u3129\u02CA\u02C7\u02CB\u02D9]/g, '').trim();

            if (rawValue !== '' && cleanQuery === '') {
                return;
            }

            suggestionsBox.innerHTML = '';
            currentFocus = -1;

            if (cleanQuery === '') {
                const history = getHistory();
                if (history.length > 0) {
                    const header = document.createElement('div');
                    header.style.cssText = 'padding: 6px 12px; font-size: 12px; color: #888; background: #f8fbf9; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; user-select: none;';
                    header.innerHTML = `<span>🕒 最近搜尋</span><span id="clearHistory" style="cursor:pointer; color:#d9534f; font-weight:bold;">清除</span>`;
                    suggestionsBox.appendChild(header);

                    const clearBtn = header.querySelector('#clearHistory');
                    if (clearBtn) {
                        clearBtn.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            localStorage.removeItem('dogSearchHistory');
                            suggestionsBox.style.display = 'none';
                        });
                    }

                    history.forEach((item, index) => {
                        createSuggestionItem({
                            category: "歷史",
                            label: item.label,
                            desc: "",
                            url: item.url
                        }, index);
                    });
                    suggestionsBox.style.display = 'block';
                } else {
                    suggestionsBox.style.display = 'none';
                }
                return;
            }

            // 智慧排序：標題直接命中優先排在最上方，其次為關鍵字與描述命中
            const matched = searchDatabase
                .filter(item =>
                    item.label.toLowerCase().includes(cleanQuery) ||
                    item.keywords.toLowerCase().includes(cleanQuery) ||
                    item.desc.toLowerCase().includes(cleanQuery) ||
                    item.category.toLowerCase().includes(cleanQuery)
                )
                .sort((a, b) => {
                    const aLabelMatch = a.label.toLowerCase().includes(cleanQuery) ? 0 : 1;
                    const bLabelMatch = b.label.toLowerCase().includes(cleanQuery) ? 0 : 1;
                    return aLabelMatch - bLabelMatch;
                });

            if (matched.length > 0) {
                matched.slice(0, 8).forEach((item, index) => createSuggestionItem(item, index));
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        }

        // 極簡單行排版：讓使用者一眼看到最接近的選項，不顯示冗長文字
        function createSuggestionItem(itemData, itemIndex) {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.dataset.url = itemData.url;
            div.dataset.label = itemData.label;
            div.style.cssText = 'padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f4f1; background-color: #ffffff; border-left: 4px solid transparent; transition: all 0.12s ease; text-align: left; display: flex; align-items: center; justify-content: space-between; gap: 8px;';

            let tagBg = '#24b657';
            if (itemData.category === '禁忌' || itemData.category === '醫療') tagBg = '#e74c3c';
            else if (itemData.category === '行為') tagBg = '#f39c12';
            else if (itemData.category === '歷史') tagBg = '#7f8c8d';
            else if (itemData.category === '品種') tagBg = '#2980b9';

            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; min-width:0; flex:1;">
                    <span style="background:${tagBg}; color:white; padding:2px 7px; border-radius:10px; font-size:11px; font-weight:bold; white-space:nowrap; flex-shrink:0;">${itemData.category}</span>
                    <strong class="item-title-text" style="color:#2b4a3b; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${itemData.label}</strong>
                </div>
                ${itemData.desc ? `<span style="font-size:12px; color:#888; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:45%;">${itemData.desc}</span>` : ''}
            `;

            div.addEventListener('mouseenter', () => {
                if (isKeyboardNav) return; 
                currentFocus = itemIndex;
                addActive(suggestionsBox.querySelectorAll('.suggestion-item'));
            });

            div.addEventListener('mousedown', (e) => {
                e.preventDefault(); 
                saveHistory(itemData.label, itemData.url);
                searchInput.value = '';
                suggestionsBox.style.display = 'none';
                window.location.href = itemData.url;
            });

            suggestionsBox.appendChild(div);
        }

        searchInput.addEventListener('keydown', function (e) {
            const items = suggestionsBox.querySelectorAll('.suggestion-item');
            const isMenuOpen = suggestionsBox.style.display === 'block' && items.length > 0;

            if (e.key === 'ArrowDown') {
                if (!isMenuOpen) {
                    handleInput();
                    return;
                }
                e.preventDefault();
                isKeyboardNav = true;
                currentFocus++;
                addActive(items);
            } else if (e.key === 'ArrowUp') {
                if (!isMenuOpen) return;
                e.preventDefault();
                isKeyboardNav = true;
                currentFocus--;
                addActive(items);
            } else if (e.key === 'Enter') {
                if (isMenuOpen && currentFocus > -1 && items[currentFocus]) {
                    e.preventDefault();
                    items[currentFocus].dispatchEvent(new Event('mousedown'));
                } else if (!e.isComposing) {
                    e.preventDefault();
                    if (isMenuOpen && items.length > 0) {
                        items[0].dispatchEvent(new Event('mousedown'));
                    } else {
                        searchBtn.click();
                    }
                }
            } else if (e.key === 'Escape') {
                suggestionsBox.style.display = 'none';
            }
        });

        function addActive(items) {
            if (!items || items.length === 0) return;
            for (let i = 0; i < items.length; i++) {
                items[i].classList.remove('autocomplete-active');
                items[i].style.backgroundColor = '#ffffff';
                items[i].style.borderLeftColor = 'transparent';
            }
            if (currentFocus >= items.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = items.length - 1;

            const activeItem = items[currentFocus];
            activeItem.classList.add('autocomplete-active');
            activeItem.style.backgroundColor = '#e0f0e8';
            activeItem.style.borderLeftColor = '#24b657';
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // 🌟 關鍵修復：加入真人驗證過濾，徹底封殺輪播圖引發的幽靈點擊！
        document.addEventListener('click', (e) => {
            if (!e.isTrusted) return; // 如果是程式碼自動觸發的（例如輪播圖跳轉），直接忽略

            if (!e.target.closest('.searchBar')) {
                suggestionsBox.style.display = 'none';
            }
        });

        searchBtn.addEventListener('click', function () {
            const rawValue = searchInput.value.trim().toLowerCase();
            const cleanQuery = rawValue.replace(/[\u3105-\u3129\u02CA\u02C7\u02CB\u02D9]/g, '').trim();
            if (cleanQuery === "") return alert("請輸入搜尋內容");

            const match = searchDatabase.find(item =>
                item.label.toLowerCase().includes(cleanQuery) ||
                item.keywords.toLowerCase().includes(cleanQuery) ||
                item.desc.toLowerCase().includes(cleanQuery)
            );

            if (match) {
                saveHistory(match.label, match.url);
                searchInput.value = '';
                suggestionsBox.style.display = 'none';
                window.location.href = match.url;
            } else {
                alert("找不到相關網頁，請嘗試其他關鍵字（例如：柯基、疫苗、巧克力）");
            }
        });
    }
});
