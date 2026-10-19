// =========================================================
// 全站搜尋：穩定建議清單、滑鼠/鍵盤導覽、可讀取的相關關鍵字
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchInput || !searchBtn || !searchSuggestions) return;

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


    const MAX_RESULTS = 8;
    let isComposing = false;
    let debounceTimer = null;
    let activeIndex = -1;
    let visibleResults = [];

    function escapeHTML(str) {
        return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag]));
    }

    function highlightMatch(text, query) {
        const cleanQuery = query.trim();
        const safeText = escapeHTML(text);
        if (!cleanQuery) return safeText;
        const safeQuery = escapeHTML(cleanQuery).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return safeText.replace(new RegExp(`(${safeQuery})`, 'gi'), '<mark>$1</mark>');
    }

    function getMatchedResults(query) {
        const cleanQuery = query.trim().toLowerCase();
        if (!cleanQuery) return [];
        return knowledgeIndex.filter(item => [item.title, item.category, item.keywords, item.summary]
            .some(value => value.toLowerCase().includes(cleanQuery)));
    }

    function renderDefaultHotSearches() {
        const hotKeywords = ['柴犬', '葡萄', '疫苗', '拉布拉多', '幼犬', '吠叫'];
        searchSuggestions.innerHTML = `<div class="search-panel-inner">
            <div class="search-panel-label">🔥 熱門快速搜尋</div>
            <div class="hot-searches">${hotKeywords.map(kw => `<button type="button" class="hot-kw-chip" data-kw="${kw}">#${kw}</button>`).join('')}</div>
        </div>`;
        searchSuggestions.style.display = 'block';
        searchSuggestions.setAttribute('aria-hidden', 'false');
        searchSuggestions.querySelectorAll('.hot-kw-chip').forEach(chip => chip.addEventListener('click', () => {
            searchInput.value = chip.dataset.kw;
            renderSuggestions(getMatchedResults(searchInput.value), searchInput.value);
            searchInput.focus();
        }));
    }

    function renderSuggestions(results, query) {
        visibleResults = results.slice(0, MAX_RESULTS);
        activeIndex = -1;
        searchSuggestions.innerHTML = '';
        searchSuggestions.setAttribute('role', 'listbox');
        if (!results.length) {
            searchSuggestions.innerHTML = `<div class="search-empty">🐶 找不到與「<strong>${escapeHTML(query)}</strong>」相符的內容。<br><small>建議試試：柴犬、葡萄、疫苗、骨頭、老犬</small></div>`;
        } else {
            visibleResults.forEach((item, index) => {
                const option = document.createElement('a');
                option.href = item.url;
                option.className = 'search-option';
                option.id = `search-option-${index}`;
                option.setAttribute('role', 'option');
                option.dataset.index = index;
                option.innerHTML = `<div class="search-option-top"><strong>🔍 ${highlightMatch(item.title, query)}</strong><span class="search-category">${escapeHTML(item.category)}</span></div>
                    <div class="search-summary">${highlightMatch(item.summary, query)}</div>
                    <div class="search-keywords"><span>相關：</span>${item.keywords.split(' ').slice(0, 5).map(k => `<span class="keyword-chip">${highlightMatch(k, query)}</span>`).join('')}</div>`;
                option.addEventListener('mouseenter', () => setActiveIndex(index));
                option.addEventListener('click', () => clearSearchState());
                searchSuggestions.appendChild(option);
            });
        }
        searchSuggestions.style.display = 'block';
        searchSuggestions.setAttribute('aria-hidden', 'false');
    }

    function setActiveIndex(index) {
        const options = [...searchSuggestions.querySelectorAll('.search-option')];
        if (!options.length) return;
        activeIndex = (index + options.length) % options.length;
        options.forEach((option, i) => {
            const active = i === activeIndex;
            option.classList.toggle('is-active', active);
            option.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        searchInput.setAttribute('aria-activedescendant', options[activeIndex].id);
        options[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    function clearSearchState() {
        searchInput.value = '';
        searchSuggestions.innerHTML = '';
        searchSuggestions.style.display = 'none';
        searchSuggestions.setAttribute('aria-hidden', 'true');
        searchInput.removeAttribute('aria-activedescendant');
        activeIndex = -1;
    }

    function triggerSearchRender(value) {
        const query = value.trim();
        if (!query) renderDefaultHotSearches();
        else renderSuggestions(getMatchedResults(query), query);
    }

    function executeSearch() {
        const query = searchInput.value.trim();
        if (!query) return renderDefaultHotSearches();
        const result = visibleResults[activeIndex] || getMatchedResults(query)[0];
        if (result) {
            clearSearchState();
            window.location.assign(result.url);
        } else renderSuggestions([], query);
    }

    searchInput.setAttribute('role', 'combobox');
    searchInput.setAttribute('aria-autocomplete', 'list');
    searchInput.setAttribute('aria-controls', 'searchSuggestions');
    searchInput.addEventListener('compositionstart', () => { isComposing = true; });
    searchInput.addEventListener('compositionend', event => { isComposing = false; triggerSearchRender(event.target.value); });
    searchInput.addEventListener('focus', () => triggerSearchRender(searchInput.value));
    searchInput.addEventListener('input', event => {
        if (isComposing) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => triggerSearchRender(event.target.value), 180);
    });
    searchInput.addEventListener('keydown', event => {
        if (isComposing) return;
        const options = searchSuggestions.querySelectorAll('.search-option');
        if (event.key === 'ArrowDown' && options.length) { event.preventDefault(); setActiveIndex(activeIndex + 1); }
        else if (event.key === 'ArrowUp' && options.length) { event.preventDefault(); setActiveIndex(activeIndex - 1); }
        else if (event.key === 'Escape') { event.preventDefault(); clearSearchState(); }
        else if (event.key === 'Enter') { event.preventDefault(); executeSearch(); }
    });
    searchBtn.addEventListener('click', executeSearch);
    document.addEventListener('click', event => {
        if (!event.target.closest('.searchBar')) {
            searchSuggestions.style.display = 'none';
            searchSuggestions.setAttribute('aria-hidden', 'true');
        }
    });
    // 從結果頁返回首頁時，不恢復上一個搜尋字串，避免殘留在輸入框。
    window.addEventListener('pageshow', () => {
        clearSearchState();
    });
});
