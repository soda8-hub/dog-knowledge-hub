// =========================================================
// 🔍 全站知識點深度檢索系統 (Deep-Link Search Engine)
// 結合 UI/UX 智慧建議清單、區塊精準跳轉與 XSS 資安防護
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const legacyItemList = document.getElementById('itemList');

    // 隱藏舊版用來佔位的靜態 ul 清單，保持畫面乾淨
    if (legacyItemList) {
        legacyItemList.style.display = 'none';
    }

    if (!searchInput || !searchBtn || !searchSuggestions) return;

    // 1. 建立全站「區塊級」知識索引資料庫 (綁定 #:~:text= 實現跨頁區塊直達)
    const knowledgeIndex = [
        // --- 品種百科 (breeds.html) ---
        { title: "黃金獵犬", category: "品種百科", keywords: "黃金獵犬 大型犬 溫順 聰明 愛游泳 耳朵 髖關節", summary: "大型犬｜溫順聰明愛游泳，游泳後務必擦乾耳朵", url: "breeds.html#:~:text=黃金獵犬" },
        { title: "拉布拉多", category: "品種百科", keywords: "拉布拉多 拉不拉多 大型犬 短毛 貪吃 POMC 肥胖 導盲犬", summary: "大型犬｜具 POMC 基因天生貪吃，需嚴格控食避免肥胖", url: "breeds.html#:~:text=拉布拉多" },
        { title: "哈士奇", category: "品種百科", keywords: "哈士奇 二哈 雪橇犬 大型犬 像狼 愛嚎叫 怕熱 拆家", summary: "大型犬｜外型像狼、愛嚎叫且怕熱，需充足運動量", url: "breeds.html#:~:text=哈士奇" },
        { title: "德國牧羊犬", category: "品種百科", keywords: "德國牧羊犬 狼犬 大型犬 忠誠 警犬 警覺性 胃扭轉", summary: "大型犬｜忠誠警覺性高，需注意髖關節與胃扭轉風險", url: "breeds.html#:~:text=德國牧羊犬" },
        { title: "台灣土狗", category: "品種百科", keywords: "台灣土狗 台灣犬 大型犬 中型犬 立耳 忠誠 適應力 護主", summary: "大型犬｜適應台灣氣候、遺傳疾病少，需較大運動量", url: "breeds.html#:~:text=台灣土狗" },
        { title: "柴犬、法鬥、柯基、邊牧", category: "品種百科", keywords: "柴犬 法國鬥牛犬 法鬥 柯基犬 邊境牧羊犬 邊牧 中型犬 固執 掉毛", summary: "中型犬專區｜10-25kg 常見中型犬性格與照護要點", url: "breeds.html#:~:text=中型犬" },
        { title: "吉娃娃", category: "品種百科", keywords: "吉娃娃 小型犬 代謝快 怕冷 保暖 氣管", summary: "小型犬｜壽命長達 12-20 年，代謝快、冬天需穿衣保暖", url: "breeds.html#:~:text=吉娃娃" },
        { title: "貴賓犬與比熊犬", category: "品種百科", keywords: "貴賓犬 紅貴賓 比熊犬 博美 小型犬 捲毛 過敏 刷牙 視網膜", summary: "小型犬｜聰明毛捲親人適合過敏者，務必天天刷牙", url: "breeds.html#:~:text=貴賓犬" },

        // --- 醫療與飲食禁忌 (medical.html) ---
        { title: "核心疫苗接種", category: "醫療飲食", keywords: "疫苗接種 預防針 狂犬病 犬瘟熱 幼犬 補強 預防保健", summary: "預防保健｜幼犬核心疫苗與每年定期補強時程", url: "medical.html#:~:text=疫苗接種" },
        { title: "內外寄生蟲預防", category: "醫療飲食", keywords: "寄生蟲預防 心絲蟲 跳蚤 壁蝨 驅蟲 預防藥", summary: "預防保健｜全年皆需定期進行體內、外寄生蟲預防", url: "medical.html#:~:text=寄生蟲預防" },
        { title: "血液與實驗室健康檢查", category: "醫療飲食", keywords: "健康檢查 血液學檢查 血檢 生化 尿檢 傳染病 貧血 肝腎", summary: "健康檢查｜透過全血球計數、生化與尿檢評估內臟健康", url: "medical.html#:~:text=血液學檢查" },
        { title: "劇毒禁忌：巧克力、葡萄、木糖醇、蔥類", category: "醫療飲食", keywords: "中毒 禁忌 不能吃 巧克力 可可鹼 咖啡因 葡萄 腎衰竭 木糖醇 花生醬 洋蔥 大蒜 韭菜 貧血", summary: "致命誤食警告｜巧克力、葡萄、木糖醇與洋蔥的毒性解析", url: "medical.html#:~:text=葡萄與葡萄乾" },
        { title: "高風險食物：熟骨頭", category: "醫療飲食", keywords: "高風險食物 熟骨頭 雞骨頭 刺傷 腸胃 誤食", summary: "高風險警告｜煮熟骨頭易碎裂刺傷消化道，切勿餵食", url: "medical.html#:~:text=熟骨頭" },
        { title: "日常照護：社會化、寵物晶片與保險", category: "醫療飲食", keywords: "日常照護 社會化訓練 寵物晶片 登記 寵物保險 醫療費", summary: "日常照護｜保障毛孩身分安全與減輕突發醫療負擔", url: "medical.html#:~:text=寵物晶片" },

        // --- 狗狗行為解讀 (behavior.html) ---
        { title: "吠叫語言解讀（興奮／警戒／焦慮）", category: "狗狗行為", keywords: "吠叫語言 一直叫 興奮吠叫 聲音 亂叫 溝通 哭", summary: "聲音解讀｜透過吠叫頻率與節奏，聽懂愛犬的情緒需求", url: "behavior.html#:~:text=吠叫語言" },
        { title: "尾巴肢體訊號", category: "狗狗行為", keywords: "尾巴肢體 搖尾巴 夾尾巴 情緒 肢體語言", summary: "肢體解讀｜搖尾巴不一定代表開心！從擺動高低看心情", url: "behavior.html#:~:text=尾巴肢體" },
        { title: "耳朵與身體訊號", category: "狗狗行為", keywords: "耳朵訊號 飛機耳 身體 趴下 打哈欠 安定訊號 行為", summary: "訊號解讀｜觀察耳朵方向與身體動作，讀懂狗狗的緊張與放鬆", url: "behavior.html#:~:text=耳朵訊號" },

        // --- 其他五大核心分頁 (飼料、年紀、用品、照顧、運動) ---
        { title: "飼料挑選與鮮食營養指南", category: "飼料食物", keywords: "飼料食物 乾糧 罐頭 主食 換食 營養 挑嘴 狗糧", summary: "飲食指南｜各年齡層飼料挑選原則與營養攝取重點", url: "food.html" },
        { title: "幼犬、成犬與老犬年紀照護", category: "年紀狀況", keywords: "年紀狀況 幼犬 成犬 老犬 高齡犬 壽命 年齡 退化", summary: "全齡照護｜從幼犬成長期到高齡老犬的階段性特別照顧", url: "age.html" },
        { title: "新手必備寵物用品清單", category: "寵物用品", keywords: "寵物用品 牽繩 胸背帶 項圈 睡床 尿布墊 玩具 水碗 準備", summary: "用品採購｜第一次養狗必備的生活、外出與訓練用品", url: "supplies.html" },
        { title: "日常美容與清潔照顧方法", category: "照顧方法", keywords: "照顧方法 洗澡 剪指甲 刷牙 清耳朵 梳毛 護理 清潔", summary: "居家護理｜洗澡頻率、清耳朵、刷牙與毛髮日常整理教學", url: "care.html" },
        { title: "狗狗每日運動與放電指南", category: "運動指南", keywords: "運動 散步 跑步 飛盤 放電 嗅聞 時間 體力", summary: "運動計畫｜依體型規劃每日散步時間與室內外放電遊戲", url: "exercise.html" }
    ];

    // 2. 資安防護：防止 XSS 惡意標籤注入
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
    }

    // 3. 搜尋比對演算法（同時比對標題、分類、關鍵字與摘要）
    function getMatchedResults(query) {
        const cleanQuery = query.trim().toLowerCase();
        if (!cleanQuery) return [];

        return knowledgeIndex.filter(item => {
            return (
                item.title.toLowerCase().includes(cleanQuery) ||
                item.category.toLowerCase().includes(cleanQuery) ||
                item.keywords.toLowerCase().includes(cleanQuery) ||
                item.summary.toLowerCase().includes(cleanQuery)
            );
        });
    }

    // 4. 渲染下拉建議選單 UI
    function renderSuggestions(results, query) {
        searchSuggestions.innerHTML = '';

        if (results.length === 0) {
            searchSuggestions.innerHTML = `
                <div style="padding: 14px 16px; color: #666; font-size: 14px; text-align: left;">
                    🐶 找不到與「<strong>${escapeHTML(query)}</strong>」相關的知識，試試搜尋「葡萄」、「疫苗」、「柴犬」或「散步」吧！
                </div>
            `;
            searchSuggestions.style.display = 'block';
            return;
        }

        results.forEach(item => {
            const option = document.createElement('a');
            option.href = item.url;
            option.style.cssText = `
                display: block;
                padding: 10px 14px;
                border-bottom: 1px solid #eef5f0;
                text-decoration: none;
                color: #333;
                text-align: left;
                transition: background-color 0.2s ease;
            `;

            option.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-weight: bold; color: #2b4a3b; font-size: 14px;">🔍 ${item.title}</span>
                    <span style="background: #e8f5ee; color: #387c59; font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: bold; white-space: nowrap;">${item.category}</span>
                </div>
                <div style="font-size: 12px; color: #666; line-height: 1.4;">${item.summary}</div>
            `;

            option.addEventListener('mouseenter', () => {
                option.style.backgroundColor = '#f2faf5';
            });
            option.addEventListener('mouseleave', () => {
                option.style.backgroundColor = '#ffffff';
            });

            searchSuggestions.appendChild(option);
        });

        searchSuggestions.style.display = 'block';
    }

    // 5. 監聽輸入框打字事件 (即時顯示深度連結建議)
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (!query.trim()) {
            searchSuggestions.style.display = 'none';
            return;
        }
        const results = getMatchedResults(query);
        renderSuggestions(results, query);
    });

    // 6. 點擊「搜尋」按鈕或按下 Enter 鍵：直接跳轉至第一筆最符合的知識區塊
    function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            searchInput.focus();
            return;
        }
        const results = getMatchedResults(query);
        if (results.length > 0) {
            window.location.href = results[0].url;
        } else {
            renderSuggestions([], query);
        }
    }

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch();
        }
    });

    // 7. 點擊畫面其他空白處時，自動收起搜尋建議選單
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.searchBar')) {
            searchSuggestions.style.display = 'none';
        }
    });
});
