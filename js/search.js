// =========================================================
// 🔍 全站智慧搜尋引擎 2.0 (防閃爍、動態片段擷取、優雅卡片定位)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const legacyItemList = document.getElementById('itemList');

    if (legacyItemList) {
        legacyItemList.style.display = 'none';
    }

    if (!searchInput || !searchBtn || !searchSuggestions) return;

    // 1. 精細化全站知識點索引庫（每一個品種與知識點皆獨立成項，不再固定一整包！）
    const knowledgeIndex = [
        // --- 品種百科 (breeds.html) ---
        { title: "黃金獵犬", category: "品種百科", keywords: "大型犬 溫順 聰明 愛游泳 耳朵 髖關節 導盲犬", summary: "大型犬｜溫順聰明愛游泳，游泳後務必徹底擦乾耳朵", url: "breeds.html?focus=黃金獵犬" },
        { title: "拉布拉多", category: "品種百科", keywords: "拉不拉多 大型犬 短毛 活潑 貪吃 POMC 肥胖", summary: "大型犬｜具 POMC 基因缺陷天生貪吃，需嚴格控食避免肥胖", url: "breeds.html?focus=拉布拉多" },
        { title: "哈士奇", category: "品種百科", keywords: "二哈 雪橇犬 大型犬 像狼 愛嚎叫 怕熱 拆家", summary: "大型犬｜外型像狼、愛嚎叫且怕熱，需極大運動量", url: "breeds.html?focus=哈士奇" },
        { title: "德國牧羊犬", category: "品種百科", keywords: "狼犬 大型犬 忠誠 警犬 警覺性 胃扭轉", summary: "大型犬｜忠誠警覺性高，留意髖關節與急性胃扭轉", url: "breeds.html?focus=德國牧羊犬" },
        { title: "台灣土狗", category: "品種百科", keywords: "台灣犬 大型犬 立耳 忠誠 適應力 護主", summary: "大型犬｜適應台灣氣候、遺傳疾病極少，需較大運動量", url: "breeds.html?focus=台灣土狗" },
        { title: "柴犬", category: "品種百科", keywords: "中型犬 日本犬 固執 獨立 換毛 皮膚過敏 青光眼", summary: "中型犬｜獨立固執，需留意換毛期皮膚過敏與青光眼", url: "breeds.html?focus=柴犬" },
        { title: "法國鬥牛犬", category: "品種百科", keywords: "法鬥 中型犬 短吻 怕熱 中暑 皮膚皺褶", summary: "中型犬｜短吻犬呼吸道較弱、極怕熱，夏天需嚴防中暑", url: "breeds.html?focus=法國鬥牛犬" },
        { title: "柯基犬", category: "品種百科", keywords: "短腿 大屁股 中型犬 牧羊犬 脊椎 椎間盤 肥胖", summary: "中型犬｜活潑聰明，身形長需控制體重以保護脊椎", url: "breeds.html?focus=柯基犬" },
        { title: "邊境牧羊犬", category: "品種百科", keywords: "邊牧 中型犬 最聰明 飛盤 精力旺盛 運動", summary: "中型犬｜犬界智商第一、精力極旺盛，需大量動腦與運動", url: "breeds.html?focus=邊境牧羊犬" },
        { title: "博美犬", category: "品種百科", keywords: "小型犬 長毛 氣管塌陷 胸背帶 牙結石", summary: "小型犬｜氣管較脆弱建議使用胸背帶，日常留意牙結石", url: "breeds.html?focus=博美" },
        { title: "吉娃娃", category: "品種百科", keywords: "小型犬 長壽 代謝快 怕冷 保暖", summary: "小型犬｜壽命可達 12-20 年，代謝快且冬天需穿衣保暖", url: "breeds.html?focus=吉娃娃" },
        { title: "貴賓犬", category: "品種百科", keywords: "紅貴賓 玩具貴賓 小型犬 捲毛 不掉毛 視網膜", summary: "小型犬｜聰明易訓練、不易掉毛，留意視網膜退化", url: "breeds.html?focus=貴賓犬" },
        { title: "比熊犬", category: "品種百科", keywords: "棉花糖 小型犬 捲毛 親人 過敏 刷牙 淚痕", summary: "小型犬｜毛捲親人適合過敏者，腸胃敏感且務必天天刷牙", url: "breeds.html?focus=比熊犬" },

        // --- 醫療與飲食禁忌 (medical.html) ---
        { title: "核心疫苗接種", category: "醫療飲食", keywords: "預防針 狂犬病 犬瘟熱 幼犬 補強 傳染病", summary: "預防保健｜幼犬核心疫苗與每年定期補強一次基礎疫苗", url: "medical.html?focus=疫苗接種" },
        { title: "內外寄生蟲預防", category: "醫療飲食", keywords: "心絲蟲 跳蚤 壁蝨 驅蟲 預防藥", summary: "預防保健｜全年皆需定期進行體內、外寄生蟲預防", url: "medical.html?focus=寄生蟲預防" },
        { title: "血液與生化健康檢查", category: "醫療飲食", keywords: "血檢 尿檢 貧血 肝腎 診斷 健檢", summary: "實驗室檢查｜透過全血球計數、生化與尿檢評估內臟健康", url: "medical.html?focus=血液學檢查" },
        { title: "劇毒禁忌：巧克力與咖啡因", category: "醫療飲食", keywords: "中毒 不能吃 可可鹼 咖啡 茶 神經 心臟", summary: "致命誤食警告｜含有可可鹼與咖啡因，嚴重影響中樞神經與心臟", url: "medical.html?focus=巧克力" },
        { title: "劇毒禁忌：葡萄與葡萄乾", category: "醫療飲食", keywords: "中毒 不能吃 水果 急性腎衰竭 嘔吐", summary: "致命誤食警告｜極少量即可導致狗狗急性腎衰竭，絕對禁食", url: "medical.html?focus=葡萄與葡萄乾" },
        { title: "劇毒禁忌：木糖醇與蔥類植物", category: "醫療飲食", keywords: "中毒 不能吃 洋蔥 大蒜 韭菜 花生醬 口香糖 溶血性貧血 肝損傷", summary: "致命誤食警告｜洋蔥破壞紅血球致貧血；木糖醇導致肝衰竭", url: "medical.html?focus=木糖醇" },
        { title: "高風險食物：煮熟的骨頭", category: "醫療飲食", keywords: "雞骨頭 豬骨 刺穿 腸胃 消化道", summary: "高風險警告｜熟骨頭咬碎後極鋒利，易刺傷消化道", url: "medical.html?focus=熟骨頭" },
        { title: "日常照護：寵物晶片、社會化與保險", category: "醫療飲食", keywords: "登記 走失 醫療費 訓練 保障", summary: "日常照護｜植入寵物晶片保障身分安全，搭配寵物保險減輕負擔", url: "medical.html?focus=寵物晶片" },

        // --- 狗狗行為解讀 (behavior.html) ---
        { title: "吠叫語言解讀（興奮／警戒／焦慮）", category: "狗狗行為", keywords: "一直叫 亂叫 聲音 哭 溝通 頻率", summary: "聲音解讀｜透過吠叫頻率與節奏，聽懂愛犬的情緒需求", url: "behavior.html?focus=吠叫語言" },
        { title: "尾巴肢體訊號", category: "狗狗行為", keywords: "搖尾巴 夾尾巴 情緒 害怕 開心", summary: "肢體解讀｜從尾巴擺動方向與高低讀懂狗狗的真實心情", url: "behavior.html?focus=尾巴肢體" },
        { title: "耳朵與身體訊號", category: "狗狗行為", keywords: "飛機耳 趴下 露肚子 打哈欠 安定訊號", summary: "訊號解讀｜觀察耳朵位置與身體動作，判斷緊張或放鬆", url: "behavior.html?focus=耳朵訊號" },

        // --- 年紀狀況 (age.html) ---
        { title: "幼犬期照護（哺乳／斷奶／成長期）", category: "年紀狀況", keywords: "0-1歲 小狗 換牙 社會化 幼犬飼料", summary: "0-1歲幼犬｜包含免疫系統建立、換牙期與社會化訓練關鍵", url: "age.html?focus=幼犬期" },
        { title: "高齡老犬照護與老化界定", category: "年紀狀況", keywords: "老狗 7歲 退化 關節 白內障 失智 健檢", summary: "高齡犬照護｜飲食調整、無障礙生活環境與半年定期健檢", url: "age.html?focus=高齡犬照護重點" },

        // --- 飼料、用品、照顧、運動 ---
        { title: "飼料挑選與鮮食營養指南", category: "飼料食物", keywords: "乾糧 罐頭 主食 換食 營養 挑嘴 狗糧", summary: "飲食指南｜各年齡層飼料挑選原則與營養攝取重點", url: "food.html" },
        { title: "新手必備寵物用品清單", category: "寵物用品", keywords: "牽繩 胸背帶 項圈 睡床 尿布墊 玩具 水碗 準備", summary: "用品採購｜第一次養狗必備的生活、外出與訓練用品", url: "supplies.html" },
        { title: "日常美容與清潔照顧方法", category: "照顧方法", keywords: "洗澡 剪指甲 刷牙 清耳朵 梳毛 護理 清潔", summary: "居家護理｜洗澡頻率、清耳朵、刷牙與毛髮日常整理教學", url: "care.html" },
        { title: "狗狗每日運動與放電指南", category: "運動指南", keywords: "散步 跑步 飛盤 放電 嗅聞 時間 體力", summary: "運動計畫｜依體型規劃每日散步時間與室內外放電遊戲", url: "exercise.html" }
    ];

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag]));
    }

    // 智慧高亮函數：將使用者輸入的字詞標示為綠色粗體
    function highlightMatch(text, query) {
        const cleanQuery = query.trim();
        if (!cleanQuery) return escapeHTML(text);
        const safeText = escapeHTML(text);
        const safeQuery = escapeHTML(cleanQuery).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${safeQuery})`, 'gi');
        return safeText.replace(regex, '<mark style="background-color: #d8f3e5; color: #1b4332; padding: 0 3px; border-radius: 4px; font-weight: bold;">$1</mark>');
    }

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

    // 當使用者點擊搜尋框但還沒打字時，顯示「熱門搜尋標籤」
    function renderDefaultHotSearches() {
        const hotKeywords = ['柴犬', '葡萄', '疫苗', '拉布拉多', '幼犬', '吠叫'];
        searchSuggestions.innerHTML = `
            <div style="padding: 12px 14px;">
                <div style="font-size: 12px; color: #666; font-weight: bold; margin-bottom: 8px;">🔥 熱門快速搜尋：</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${hotKeywords.map(kw => `
                        <span class="hot-kw-chip" data-kw="${kw}" style="background: #f0f7f3; color: #2b4a3b; border: 1px solid #cfe8d9; padding: 4px 10px; border-radius: 15px; font-size: 12px; cursor: pointer; font-weight: bold;">#${kw}</span>
                    `).join('')}
                </div>
            </div>
        `;
        searchSuggestions.querySelectorAll('.hot-kw-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                const kw = chip.getAttribute('data-kw');
                searchInput.value = kw;
                renderSuggestions(getMatchedResults(kw), kw);
            });
        });
        searchSuggestions.style.display = 'block';
    }

    function renderSuggestions(results, query) {
        searchSuggestions.innerHTML = '';

        if (results.length === 0) {
            searchSuggestions.innerHTML = `
                <div style="padding: 14px 16px; color: #555; font-size: 13px; text-align: left; line-height: 1.5;">
                    🐶 找不到與「<strong>${escapeHTML(query)}</strong>」相符的內容。<br>
                    <span style="font-size: 12px; color: #888;">建議試試：柴犬、葡萄、疫苗、骨頭、老犬</span>
                </div>
            `;
            searchSuggestions.style.display = 'block';
            return;
        }

        results.slice(0, 6).forEach(item => {
            const option = document.createElement('a');
            option.href = item.url;
            option.style.cssText = `
                display: block;
                padding: 10px 14px;
                border-bottom: 1px solid #eef5f0;
                text-decoration: none;
                color: #333;
                text-align: left;
                transition: background-color 0.15s ease;
            `;

            option.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
                    <span style="font-weight: bold; color: #2b4a3b; font-size: 14px;">🔍 ${highlightMatch(item.title, query)}</span>
                    <span style="background: #e8f5ee; color: #387c59; font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: bold; white-space: nowrap;">${item.category}</span>
                </div>
                <div style="font-size: 12px; color: #666; line-height: 1.4;">${highlightMatch(item.summary, query)}</div>
            `;

            option.addEventListener('mouseenter', () => option.style.backgroundColor = '#f2faf5');
            option.addEventListener('mouseleave', () => option.style.backgroundColor = '#ffffff');

            searchSuggestions.appendChild(option);
        });

        searchSuggestions.style.display = 'block';
    }

    // 解決中文注音/拼音輸入時的閃爍問題 (Composition Event + Debounce)
    let isComposing = false;
    let debounceTimer = null;

    searchInput.addEventListener('compositionstart', () => { isComposing = true; });
    searchInput.addEventListener('compositionend', (e) => {
        isComposing = false;
        triggerSearchRender(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
        if (!searchInput.value.trim()) {
            renderDefaultHotSearches();
        } else {
            triggerSearchRender(searchInput.value);
        }
    });

    searchInput.addEventListener('input', (e) => {
        if (isComposing) return; // 注音尚未選字完成前不重複刷新，徹底消除閃爍！
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            triggerSearchRender(e.target.value);
        }, 120);
    });

    function triggerSearchRender(rawVal) {
        const query = rawVal.trim();
        if (!query) {
            renderDefaultHotSearches();
            return;
        }
        const results = getMatchedResults(query);
        renderSuggestions(results, query);
    }

    function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            renderDefaultHotSearches();
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
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            executeSearch();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.searchBar')) {
            searchSuggestions.style.display = 'none';
        }
    });
});
