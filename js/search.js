document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsBox = document.getElementById('searchSuggestions');

    let currentFocus = -1;
    let isKeyboardNav = false;

    // =========================================================
    // 🌟 關鍵修復 1：從上一頁返回時，重置輸入框與輸入法 (IME) 狀態
    // =========================================================
    window.addEventListener('pageshow', function () {
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
            // 強制刷新輸入框狀態，徹底解除 Windows 新注音卡在英文/數字的問題
            searchInput.readOnly = true;
            setTimeout(() => {
                searchInput.readOnly = false;
            }, 30);
        }
        if (suggestionsBox) {
            suggestionsBox.style.display = 'none';
        }
        currentFocus = -1;
    });

    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
    }

    // =========================================================
    // 🌟 靜態知識庫：涵蓋八大分頁「導覽列」、「大區塊」、「中區塊」與「小卡片」
    // 畫面顯示保持最單純的文字，底層 keywords 涵蓋網站詞語與使用者常用搜尋詞
    // =========================================================
    const searchDatabase = [
        // --- 1. 品種 (breeds.html) ---
        { label: "品種", keywords: "品種百科 常見犬種特點與養護資訊 狗種 犬種 尋找命定狗狗", url: "breeds.html" },
        // 導覽列大區塊
        { label: "大型犬", keywords: "大型犬 25-45kg 體型壯碩 活動量大", url: "breeds.html?focus=大型犬 (25-45kg)" },
        { label: "中型犬", keywords: "中型犬 10-25kg 空間需求適中", url: "breeds.html?focus=中型犬 (10-25kg)" },
        { label: "小型犬", keywords: "小型犬 10kg以下 適合公寓", url: "breeds.html?focus=小型犬 (10kg 以下)" },
        // 個別犬種小區塊
        { label: "黃金獵犬", keywords: "黃金獵犬 金毛 大型犬 長毛 溫順 聰明 愛游泳 深金 淺金 奶油 眼瞼內翻 髖關節發育不良 擦乾耳朵", url: "breeds.html?focus=黃金獵犬" },
        { label: "拉布拉多", keywords: "拉布拉多 拉不拉多 大型犬 短毛 活潑 貪吃 POMC 基因缺陷 控食避免肥胖 導盲犬 髖關節檢查", url: "breeds.html?focus=拉布拉多" },
        { label: "哈士奇", keywords: "哈士奇 二哈 雪橇犬 大型犬 短毛 像狼 愛嚎叫 怕熱 精力充沛 遺傳性白內障 眼睛渾濁", url: "breeds.html?focus=哈士奇" },
        { label: "德國牧羊犬", keywords: "德國牧羊犬 狼犬 大型犬 短毛 忠誠 警犬 警覺性 髖關節 肘關節 退化性脊髓病 DM 胃扭轉 GDV", url: "breeds.html?focus=德國牧羊犬" },
        { label: "台灣土狗", keywords: "台灣土狗 台灣犬 土狗 米克斯 大型犬 短毛 立耳 忠誠 適應力強 適應台灣氣候 遺傳疾病極少", url: "breeds.html?focus=台灣土狗" },
        { label: "柴犬", keywords: "柴犬 阿柴 柴柴 中型犬 短毛 活潑 固執 過敏 青光眼 膝蓋骨脫臼", url: "breeds.html?focus=柴犬" },
        { label: "法國鬥牛犬", keywords: "法國鬥牛犬 法鬥 中型犬 短毛 溫順 呼吸系統脆弱 不耐冷熱 夏天開冷氣 預防中暑", url: "breeds.html?focus=法國鬥牛犬" },
        { label: "柯基犬", keywords: "柯基犬 柯基 短腿 中型犬 短毛 活潑 身軀長 脊椎 椎間盤疾病 飲水 尿道結石", url: "breeds.html?focus=柯基犬" },
        { label: "邊境牧羊犬", keywords: "邊境牧羊犬 邊牧 中型犬 長毛 活潑 世界最聰明 精力旺盛 牧羊犬眼異常 癲癇", url: "breeds.html?focus=邊境牧羊犬" },
        { label: "博美", keywords: "博美 博美犬 小型犬 長毛 活潑 氣管脆弱 建議用背帶 老犬 牙結石 口臭", url: "breeds.html?focus=博美" },
        { label: "吉娃娃", keywords: "吉娃娃 吉娃 小型犬 短毛 活潑 代謝快 一天3-4餐 耐寒力差 怕冷 冬天穿衣保暖", url: "breeds.html?focus=吉娃娃" },
        { label: "貴賓犬", keywords: "貴賓犬 紅貴賓 玩具貴賓 小型犬 長毛 捲毛 溫順 聰明易訓練 PRA 漸進性視網膜萎縮", url: "breeds.html?focus=貴賓犬" },
        { label: "比熊犬", keywords: "比熊犬 比熊 棉花糖 小型犬 長毛 毛捲親人 溫順 適合過敏者 腸胃敏感 膀胱感染 青光眼 天天刷牙", url: "breeds.html?focus=比熊犬" },

        // --- 2. 醫療與飲食 (medical.html) ---
        { label: "醫療與飲食", keywords: "醫療 飲食 注意誤食 看醫生 動物醫院 獸醫", url: "medical.html" },
        // 導覽列大區塊
        { label: "預防保健", keywords: "預防保健 疫苗 驅蟲 牙齒", url: "medical.html?focus=預防保健" },
        { label: "健康檢查", keywords: "定期健康檢查 健檢 成年犬 老年犬 血檢 理學檢查", url: "medical.html?focus=定期健康檢查" },
        { label: "醫療服務須知", keywords: "選擇醫療服務注意事項 醫療服務須知 看診 獸醫院", url: "medical.html?focus=選擇醫療服務注意事項" },
        { label: "飲食與禁忌", keywords: "飲食安全與禁忌 飲食與禁忌 不能吃的東西 誤食 中毒", url: "medical.html?focus=飲食安全與禁忌" },
        { label: "日常照護", keywords: "日常照護 社會化 晶片 保險", url: "medical.html?focus=日常照護" },
        // 中區塊與小區塊
        { label: "疫苗接種", keywords: "疫苗接種 基礎疫苗 核心疫苗 打針 預防針 犬出血性腸炎 犬瘟熱 犬傳染性支氣管炎 狂犬病 年度補強", url: "medical.html?focus=疫苗接種" },
        { label: "寄生蟲預防", keywords: "寄生蟲預防 體內外寄生蟲 驅蟲藥 心絲蟲 跳蚤 壁蝨", url: "medical.html?focus=寄生蟲預防" },
        { label: "牙齒保健", keywords: "牙齒保健 每日刷牙 預防牙結石 牙周病 洗牙 麻醉評估", url: "medical.html?focus=牙齒保健" },
        { label: "基礎理學檢查", keywords: "基礎理學檢查 基礎檢查 理學檢查 體溫 體重 呼吸 心跳 黏膜 視診 聽診 觸診 淋巴結", url: "medical.html?focus=基礎檢查" },
        { label: "實驗室檢查 (血檢/尿檢)", keywords: "實驗室檢查 血液學檢查 尿檢與傳染病 全血球計數 貧血 血液生化 肝腎功能 糖尿病 傳染病篩檢 細小病毒", url: "medical.html?focus=血液學檢查" },
        { label: "影像學與專科檢查", keywords: "影像學與其他檢查 無需麻醉項目 需麻醉項目 其他專科檢查 X光 超音波 內視鏡 CT MRI 眼科 眼壓 細胞學", url: "medical.html?focus=無需麻醉項目" },
        { label: "資格與病歷透明", keywords: "資格與病歷透明 獸醫師執業執照 開業執照 用藥紀錄 收據明細", url: "medical.html?focus=資格與病歷透明" },
        { label: "專業諮詢與知情同意", keywords: "專業諮詢與知情同意 治療方案 費用預估 手術 輸血 同意書", url: "medical.html?focus=專業諮詢與知情同意" },
        { label: "劇毒食物 (絕對不可餵食)", keywords: "劇毒食物 絕對不可餵食 中毒 致命 禁忌食物", url: "medical.html?focus=劇毒食物" },
        { label: "巧克力", keywords: "巧克力 可可鹼 咖啡因 中樞神經 心臟 中毒 不能吃", url: "medical.html?focus=巧克力" },
        { label: "葡萄與葡萄乾", keywords: "葡萄與葡萄乾 葡萄 葡萄乾 急性腎衰竭 腎臟 中毒 不能吃", url: "medical.html?focus=葡萄與葡萄乾" },
        { label: "木糖醇", keywords: "木糖醇 花生醬 口香糖 損壞肝臟 肝衰竭 低血糖 不能吃", url: "medical.html?focus=木糖醇" },
        { label: "蔥類植物 (洋蔥/大蒜/韭菜)", keywords: "蔥類植物 洋蔥 大蒜 韭菜 蔥 硫化物 破壞紅血球 溶血性貧血 不能吃", url: "medical.html?focus=蔥類植物" },
        { label: "高風險食物", keywords: "高風險食物 危險食物 注意誤食", url: "medical.html?focus=高風險食物" },
        { label: "熟骨頭", keywords: "熟骨頭 雞骨頭 骨頭 碎裂 窒息 腸胃道刺傷 不能吃", url: "medical.html?focus=熟骨頭" },
        { label: "生食 (肉/蛋)", keywords: "生食 生肉 生雞蛋 寄生蟲 細菌 沙門氏菌", url: "medical.html?focus=生食 (肉/蛋)" },
        { label: "咖啡因、酒精、辛辣物", keywords: "咖啡因 酒精 辛辣物 茶 咖啡 酒 辣椒 嘔吐腹瀉", url: "medical.html?focus=咖啡因、酒精、辛辣物" },
        { label: "堅果與酪梨", keywords: "堅果與酪梨 夏威夷豆 胰臟炎 酪梨 Persin 毒素", url: "medical.html?focus=堅果與酪梨" },
        { label: "其他飲食注意事項", keywords: "其他注意事項 生發酵麵團 未熟番茄 茄鹼 水果種子 氰化物 不明菇類 野菇", url: "medical.html?focus=其他注意事項" },
        { label: "社會化訓練", keywords: "社會化訓練 與人及動物相處 幼犬社會化", url: "medical.html?focus=社會化訓練" },
        { label: "寵物晶片", keywords: "寵物晶片 晶片登記 身分識別 鼻紋 走失", url: "medical.html?focus=寵物晶片" },
        { label: "寵物保險", keywords: "寵物保險 醫療險 減輕突發醫療支出負擔", url: "medical.html?focus=寵物保險" },

        // --- 3. 飼料食物 (food.html) ---
        { label: "飼料食物", keywords: "飼料 食物 狗糧 主食 飲食指南 吃什麼", url: "food.html" },
        { label: "乾飼料", keywords: "乾飼料 乾糧 顆粒 潔牙 保存方便", url: "food.html?focus=乾" },
        { label: "濕食與罐頭", keywords: "濕食 罐頭 主食罐 副食罐 鮮食包 補充水分 挑嘴狗", url: "food.html?focus=濕" },
        { label: "自製鮮食", keywords: "自製鮮食 鮮食 水煮 營養均衡 鈣磷比", url: "food.html?focus=鮮食" },
        { label: "安全的人類食物", keywords: "安全的人類食物 雞胸肉 牛肉 鮭魚 熟蛋黃 無糖優格 南瓜 地瓜 紅蘿蔔 花椰菜 小黃瓜 蘋果 藍莓 香蕉 西瓜 水果 蔬菜", url: "food.html?focus=安全" },
        { label: "飼料挑選與保存", keywords: "挑選與保存 AAFCO 無穀飼料 換食 七日換食法 密封桶 受潮", url: "food.html?focus=挑選" },

        // --- 4. 狗狗行為 (behavior.html) ---
        { label: "狗狗行為", keywords: "狗狗行為 行為解讀百科 聲音 肢體 動作 情緒 心理", url: "behavior.html" },
        // 導覽列大區塊
        { label: "吠叫語言", keywords: "吠叫語言 一、吠叫語言 一直叫 亂叫 叫聲 哭", url: "behavior.html?focus=一、吠叫語言" },
        { label: "尾巴肢體", keywords: "尾巴肢體 二、尾巴肢體語言 搖尾巴 尾巴擺動", url: "behavior.html?focus=二、尾巴肢體語言" },
        { label: "耳朵訊號", keywords: "耳朵訊號 三、耳朵的訊號 耳朵位置 豎耳", url: "behavior.html?focus=三、耳朵的訊號" },
        { label: "身體姿態", keywords: "身體姿態 四、身體姿態與動作 動作 解讀", url: "behavior.html?focus=四、身體姿態與動作" },
        { label: "舔拭意義", keywords: "舔拭意義 五、舔拭的意義 舔人 舔手 舔臉", url: "behavior.html?focus=五、舔拭的意義" },
        // 個別行為小區塊
        { label: "興奮吠叫", keywords: "興奮吠叫 呃汪 高頻急促 主人回家 出門前 玩樂 歡迎", url: "behavior.html?focus=興奮吠叫" },
        { label: "需求吠叫", keywords: "需求吠叫 嗚嗚 細小哀鳴 想吃飯 喝水 出門 求助", url: "behavior.html?focus=需求吠叫" },
        { label: "警戒吠叫", keywords: "警戒吠叫 嗚吼 低沉短促 陌生人靠近 領地 防衛 警告", url: "behavior.html?focus=警戒吠叫" },
        { label: "分離焦慮", keywords: "分離焦慮 嗚嗚嗚 長嚎 急促不規則 獨處 雷聲 鞭炮 恐懼 不安 半夜一直哭", url: "behavior.html?focus=分離焦慮" },
        { label: "大幅快速搖動 (尾巴)", keywords: "大幅快速搖動 搖尾巴 身體搖擺 興奮 極度開心", url: "behavior.html?focus=大幅快速搖動" },
        { label: "輕輕平穩搖動 (尾巴)", keywords: "輕輕平穩搖動 放鬆 友善 心情良好", url: "behavior.html?focus=輕輕平穩搖動" },
        { label: "螺旋狀快速旋轉 (尾巴)", keywords: "螺旋狀快速旋轉 旋轉尾巴 全身扭動 無比歡樂", url: "behavior.html?focus=螺旋狀快速旋轉" },
        { label: "高高翹起 (尾巴)", keywords: "高高翹起 尾巴翹高 自信 主導 宣示主權", url: "behavior.html?focus=高高翹起" },
        { label: "快速豎直且僵硬 (尾巴)", keywords: "快速豎直且僵硬 尾巴僵硬 低吼 皺鼻 攻擊傾向", url: "behavior.html?focus=快速豎直且僵硬" },
        { label: "低垂夾在腿間 (夾尾巴)", keywords: "低垂夾在腿間 夾尾巴 害怕 不安 恐懼 服從", url: "behavior.html?focus=低垂夾在腿間" },
        { label: "警覺偵測 (豎耳)", keywords: "警覺偵測 耳朵豎起 偵測環境", url: "behavior.html?focus=警覺偵測" },
        { label: "準備玩耍 (耳朵)", keywords: "準備玩耍 耳朵豎起嘴巴微張吐舌", url: "behavior.html?focus=準備玩耍" },
        { label: "愉快社交 (耳朵)", keywords: "愉快社交 耳朵後貼搖尾巴", url: "behavior.html?focus=愉快社交" },
        { label: "恐懼不安 (耳朵)", keywords: "恐懼不安 耳朵後貼身體縮起夾尾巴", url: "behavior.html?focus=恐懼不安" },
        { label: "飛機耳", keywords: "飛機耳 耳朵外展 撒嬌示好 打哈欠 舔鼻 安定訊號", url: "behavior.html?focus=飛機耳" },
        { label: "全身放鬆躺地 (翻肚皮)", keywords: "全身放鬆躺地 露出肚皮 翻肚子 翻肚皮 信任 親近", url: "behavior.html?focus=全身放鬆躺地" },
        { label: "身體向前傾 (邀玩)", keywords: "身體向前傾 前肢傾前 邀玩 想要遊戲", url: "behavior.html?focus=身體向前傾" },
        { label: "肌肉緊繃站立", keywords: "肌肉緊繃站立 毛髮豎立 炸毛 威嚇 準備攻擊", url: "behavior.html?focus=肌肉緊繃站立" },
        { label: "弓起身體靠地 (臣服)", keywords: "弓起身體靠地 低頭 害怕 臣服", url: "behavior.html?focus=弓起身體靠地" },
        { label: "表達愛意 (舔拭)", keywords: "表達愛意 舔主人的臉或手 喜愛 信任", url: "behavior.html?focus=表達愛意" },
        { label: "社交問候 (互舔)", keywords: "社交問候 狗狗間互舔 維持友誼", url: "behavior.html?focus=社交問候" },
        { label: "求饒示弱 (舔拭)", keywords: "求饒示弱 安撫對方 避免衝突", url: "behavior.html?focus=求饒示弱" },
        { label: "自我安撫 (過度舔拭)", keywords: "自我安撫 過度舔拭 舔腳 放鬆壓力 皮膚或心理健康", url: "behavior.html?focus=自我安撫" },

        // --- 5. 年紀狀況 (age.html) ---
        { label: "年紀狀況", keywords: "年紀 狀況 年齡 換算 壽命 幾歲", url: "age.html" },
        // 導覽列大區塊
        { label: "老犬界定", keywords: "老犬界定 高齡犬界定 幾歲算老狗 小型犬10歲 中型犬8-9歲 大型犬6-7歲", url: "age.html?focus=老犬" },
        { label: "幼犬期", keywords: "幼犬期 二、幼犬期 0-1歲 奶狗 小狗 免疫系統 換牙", url: "age.html?focus=二、幼犬期" },
        { label: "成犬期", keywords: "成犬期 三、成犬期 1-7歲 青壯年 體態維持", url: "age.html?focus=成犬" },
        { label: "老犬變化", keywords: "老犬變化 四、 生理與行為變化 退化 感官 認知 失智 骨骼 關節", url: "age.html?focus=退化" },
        { label: "高齡照護", keywords: "高齡照護 五、高齡犬照護重點 老狗照顧 老年犬", url: "age.html?focus=五、高齡犬照護重點" },
        // 個別階段小區塊
        { label: "哺乳期 (0-6週)", keywords: "哺乳期 0-6週 母乳 雙眼未開 保溫", url: "age.html?focus=哺乳期" },
        { label: "斷奶期 (約3-8週)", keywords: "斷奶期 3-8週 離乳 乳齒長出 探索環境 泡軟飼料", url: "age.html?focus=斷奶期" },
        { label: "成長期 (2-6個月)", keywords: "成長期 2-6個月 快速生長 幼犬專用飼料 疫苗", url: "age.html?focus=成長期" },
        { label: "高齡犬飲食與生活環境", keywords: "飲食與健康 生活環境 低熱量 易消化 關節保健 斜坡 防滑 止滑墊 半年健檢", url: "age.html?focus=飲食與健康" },
        { label: "大型犬老化留意", keywords: "體型差異 特殊風險留意 大型犬老化 6歲 心血管 關節病變", url: "age.html?focus=體型差異" },

        // --- 6. 寵物用品 (supplies.html) ---
        { label: "寵物用品", keywords: "寵物 用品 寵物用品清單指南 新手準備 第一次養狗 買什麼 裝備", url: "supplies.html" },
        // 導覽列大區塊
        { label: "基本用品", keywords: "基本用品 一、基本用品 必備裝備", url: "supplies.html?focus=一、基本用品" },
        { label: "飲食相關用品", keywords: "飲食相關 二、 飲食用品 飼料碗 飲水", url: "supplies.html?focus=飲食" },
        { label: "衣物與美容用品", keywords: "衣物與美容 三、 清潔美容用品 梳子 尿布墊", url: "supplies.html?focus=美容" },
        { label: "健康醫療與玩具", keywords: "健康醫療與玩具 四、 玩具 醫療用品", url: "supplies.html?focus=玩具" },
        // 個別用品小區塊
        { label: "狗碗、水碗", keywords: "狗碗、水碗 食碗 水碗 不鏽鋼 陶瓷 防滑 慢食碗", url: "supplies.html?focus=狗碗、水碗" },
        { label: "狗繩、胸背帶", keywords: "狗繩、胸背帶 牽繩 胸背帶 項圈 外出散步 分散拉力 減少窒息風險", url: "supplies.html?focus=狗繩、胸背帶" },
        { label: "狗床、睡窩", keywords: "狗床、睡窩 睡墊 記憶棉 保護關節 保暖支撐", url: "supplies.html?focus=狗床、睡窩" },
        { label: "狗籠、圍欄与外出籠", keywords: "狗籠 圍欄 外出籠 運輸籠 安全感 獨立空間", url: "supplies.html?focus=籠" },
        { label: "尿布墊與拾便袋", keywords: "尿布墊 拾便袋 撿便袋 定點大小便 如廁訓練", url: "supplies.html?focus=尿布" },

        // --- 7. 照顧方法 (care.html) ---
        { label: "照顧方法", keywords: "照顧 方法 日常照顧 居家護理 清潔 美容", url: "care.html" },
        { label: "洗澡與吹毛", keywords: "洗澡 吹毛 洗毛精 水溫 洗澡頻率 吹乾 皮膚病", url: "care.html?focus=洗澡" },
        { label: "梳毛與毛髮整理", keywords: "梳毛 毛髮 梳理 換毛期 打結 廢毛", url: "care.html?focus=毛" },
        { label: "清耳朵與耳道護理", keywords: "清耳朵 耳道 潔耳液 棉花棒 甩頭 抓耳朵 耳垢 發炎", url: "care.html?focus=耳" },
        { label: "剪指甲與腳底毛", keywords: "剪指甲 修剪指甲 血線 止血粉 腳底毛 肉球 防滑", url: "care.html?focus=指甲" },
        { label: "刷牙與口腔清潔", keywords: "刷牙 牙刷 牙膏 牙結石 口臭 口腔 潔牙", url: "care.html?focus=牙" },

        // --- 8. 運動 (exercise.html) ---
        { label: "運動", keywords: "運動 放電 體力 散步 運動指南", url: "exercise.html" },
        { label: "每日運動量與時間", keywords: "運動量 散步時間 每天散步 幾次 幾分鐘 小型犬 中型犬 大型犬", url: "exercise.html?focus=運動" },
        { label: "散步與慢跑", keywords: "散步 慢跑 外出 探索 社交", url: "exercise.html?focus=散步" },
        { label: "嗅聞與室內放電遊戲", keywords: "嗅聞 嗅聞墊 藏食 益智 拔河 你丟我撿 室內運動 雨天", url: "exercise.html?focus=嗅聞" },
        { label: "游泳與飛盤", keywords: "游泳 飛盤 水上運動 保護關節 消耗體力", url: "exercise.html?focus=游泳" },
        { label: "運動安全與注意事項", keywords: "安全 注意事項 柏油路 燙傷 中暑 補水 飯後運動 胃扭轉", url: "exercise.html?focus=注意" }
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

    // 統一安全跳轉函數：先釋放輸入法焦點 (blur)，再跳轉頁面
    function navigateSafely(label, url) {
        saveHistory(label, url);
        searchInput.value = '';
        suggestionsBox.style.display = 'none';
        searchInput.blur(); // 關鍵：釋放 Windows 中文輸入法焦點
        setTimeout(() => {
            window.location.href = url;
        }, 15);
    }

    if (searchBtn && searchInput && suggestionsBox) {

        suggestionsBox.addEventListener('mousemove', () => {
            isKeyboardNav = false;
        });

        // 監聽打字與點擊事件（過濾未完成組字的注音符號，讓選單穩定停駐不閃退）
        searchInput.addEventListener('input', () => {
            handleInput();
        });

        searchInput.addEventListener('focus', () => {
            handleInput();
        });

        function handleInput() {
            const rawValue = searchInput.value.trim().toLowerCase();
            // 移除尚未選字完成的注音符號 (ㄅ~ㄩ 與聲調)，保留國字與英數
            const cleanQuery = rawValue.replace(/[\u3105-\u3129\u02CA\u02C7\u02CB\u02D9]/g, '').trim();

            // 若目前只打了注音符號還沒變成國字，維持原畫面不閃退
            if (rawValue !== '' && cleanQuery === '') {
                return;
            }

            suggestionsBox.innerHTML = '';
            currentFocus = -1;

            if (cleanQuery === '') {
                const history = getHistory();
                if (history.length > 0) {
                    const header = document.createElement('div');
                    header.style.cssText = 'padding: 8px 14px; font-size: 12px; color: #888; background: #f8fbf9; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; user-select: none;';
                    header.innerHTML = `<span>🕒 最近搜尋</span><span id="clearHistory" style="cursor:pointer; color:#d9534f; font-weight:bold;">清除</span>`;
                    suggestionsBox.appendChild(header);

                    const clearBtn = header.querySelector('#clearHistory');
                    if (clearBtn) {
                        clearBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            localStorage.removeItem('dogSearchHistory');
                            suggestionsBox.style.display = 'none';
                        });
                    }

                    history.forEach((item, index) => {
                        createSuggestionItem({
                            label: item.label,
                            url: item.url
                        }, index);
                    });
                    suggestionsBox.style.display = 'block';
                } else {
                    suggestionsBox.style.display = 'none';
                }
                return;
            }

            // 搜尋比對：優先顯示標題包含該字詞的項目，其次為關鍵字包含該字詞的項目
            const labelMatches = [];
            const keywordMatches = [];

            searchDatabase.forEach(item => {
                if (item.label.toLowerCase().includes(cleanQuery)) {
                    labelMatches.push(item);
                } else if (item.keywords.toLowerCase().includes(cleanQuery)) {
                    keywordMatches.push(item);
                }
            });

            const matched = [...labelMatches, ...keywordMatches];

            if (matched.length > 0) {
                matched.slice(0, 10).forEach((item, index) => createSuggestionItem(item, index));
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        }

        // 建立最單純乾淨的下拉選項
        function createSuggestionItem(itemData, itemIndex) {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.dataset.url = itemData.url;
            div.dataset.label = itemData.label;

            div.style.cssText = 'padding: 9px 14px; cursor: pointer; color: #333333; font-size: 15px; text-align: left; border-bottom: 1px solid #f0f4f1; background-color: #ffffff;';
            div.textContent = itemData.label;

            div.addEventListener('mouseenter', () => {
                if (isKeyboardNav) return;
                currentFocus = itemIndex;
                addActive(suggestionsBox.querySelectorAll('.suggestion-item'));
            });

            // 🌟 關鍵修復 2：改回標準 click 事件，不再用 mousedown 鎖死輸入法焦點
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateSafely(itemData.label, itemData.url);
            });

            suggestionsBox.appendChild(div);
        }

        // 鍵盤上下方向鍵反白與 Enter 送出
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
                return;
            }

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
                // 若正在注音選字中，讓 Enter 優先完成微軟注音選字，不直接跳轉
                if (e.isComposing || e.keyCode === 229) return;

                e.preventDefault();
                if (isMenuOpen && currentFocus > -1 && items[currentFocus]) {
                    items[currentFocus].click();
                } else if (isMenuOpen && items.length > 0) {
                    items[0].click();
                } else {
                    searchBtn.click();
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
                items[i].style.fontWeight = 'normal';
            }
            if (currentFocus >= items.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = items.length - 1;

            const activeItem = items[currentFocus];
            activeItem.classList.add('autocomplete-active');
            activeItem.style.backgroundColor = '#e0f0e8';
            activeItem.style.fontWeight = 'bold';
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // 點擊外部空白處收起選單（忽略輪播圖自動觸發的非真人點擊）
        document.addEventListener('click', (e) => {
            if (!e.isTrusted) return;
            if (!e.target.closest('.searchBar')) {
                suggestionsBox.style.display = 'none';
            }
        });

        searchBtn.addEventListener('click', function () {
            const rawValue = searchInput.value.trim().toLowerCase();
            const cleanQuery = rawValue.replace(/[\u3105-\u3129\u02CA\u02C7\u02CB\u02D9]/g, '').trim();
            if (cleanQuery === "") return alert("請輸入搜尋內容");

            const exactMatch = searchDatabase.find(item => item.label.toLowerCase() === cleanQuery);
            const labelMatch = searchDatabase.find(item => item.label.toLowerCase().includes(cleanQuery));
            const kwMatch = searchDatabase.find(item => item.keywords.toLowerCase().includes(cleanQuery));
            const match = exactMatch || labelMatch || kwMatch;

            if (match) {
                navigateSafely(match.label, match.url);
            } else {
                alert("找不到相關網頁，請嘗試其他關鍵字（例如：柯基、疫苗、巧克力）");
            }
        });
    }
});
