// =========================================================
// 🔍 全站搜尋與動態互動引擎 (相容舊版簡潔選單 + 鍵盤上下鍵 + Enter 跳轉 + 注音防閃爍)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const legacyItemList = document.getElementById('itemList');

    if (legacyItemList) {
        legacyItemList.style.display = 'none';
    }

    // ---------------------------------------------------------
    // 功能 A：當從分頁按「上一頁」返回首頁時，自動清空搜尋欄文字
    // ---------------------------------------------------------
    window.addEventListener('pageshow', () => {
        if (searchInput) {
            searchInput.value = '';
        }
        if (searchSuggestions) {
            searchSuggestions.style.display = 'none';
        }
    });

    // ---------------------------------------------------------
    // 功能 B：完整知識點與分類關鍵字資料庫 (涵蓋舊版大分類 + 細部知識點)
    // ---------------------------------------------------------
    const searchDatabase = [
        // 1. 八大主分類 (保留舊版輸入「品」跳出「品種、用品」的直覺體驗)
        { label: "品種 - 常見犬種特點與養護資訊", keywords: "breeds 品種 犬種 大型犬 中型犬 小型犬", url: "breeds.html" },
        { label: "用品 - 寵物用品清單指南", keywords: "supplies 寵物用品 牽繩 胸背帶 狗床 睡窩 水碗 玩具 尿布墊", url: "supplies.html" },
        { label: "醫療與飲食 - 預防保健與誤食禁忌", keywords: "medical 醫療 飲食 醫院 生病 看醫生", url: "medical.html" },
        { label: "飼料食物 - 狗狗營養與換食指南", keywords: "food 飼料 食物 乾糧 罐頭 鮮食 狗糧", url: "food.html" },
        { label: "狗狗行為 - 吠叫與肢體語言解讀", keywords: "behavior 行為 肢體 動作 叫聲 心理", url: "behavior.html" },
        { label: "年紀狀況 - 幼犬、成犬與老犬照護", keywords: "age 年紀 狀況 年齡 壽命 幼犬 老犬", url: "age.html" },
        { label: "照顧方法 - 日常洗澡、刷牙與美容", keywords: "care 照顧 方法 美容 洗澡 剪指甲 清耳朵 梳毛", url: "care.html" },
        { label: "運動 - 每日散步與放電指南", keywords: "exercise 運動 散步 跑步 飛盤 放電 體力", url: "exercise.html" },

        // 2. 十五大狗狗品種精準定位
        { label: "黃金獵犬 (大型犬 - 溫順愛游泳)", keywords: "黃金獵犬 金毛 大型犬 游泳 耳朵", url: "breeds.html?focus=黃金獵犬" },
        { label: "拉布拉多 (大型犬 - 貪吃需控食)", keywords: "拉布拉多 拉不拉多 大型犬 導盲犬 貪吃 POMC", url: "breeds.html?focus=拉布拉多" },
        { label: "哈士奇 (大型犬 - 愛嚎叫怕熱)", keywords: "哈士奇 二哈 雪橇犬 大型犬 嚎叫", url: "breeds.html?focus=哈士奇" },
        { label: "德國牧羊犬 (大型犬 - 忠誠警犬)", keywords: "德國牧羊犬 狼犬 大型犬 胃扭轉", url: "breeds.html?focus=德國牧羊犬" },
        { label: "台灣土狗 (大型犬 - 適應力強)", keywords: "台灣土狗 台灣犬 土狗 大型犬 忠誠", url: "breeds.html?focus=台灣土狗" },
        { label: "柴犬 (中型犬 - 獨立固執)", keywords: "柴犬 阿柴 中型犬 換毛 青光眼", url: "breeds.html?focus=柴犬" },
        { label: "法國鬥牛犬 (中型犬 - 短吻怕熱)", keywords: "法國鬥牛犬 法鬥 中型犬 中暑 皮膚", url: "breeds.html?focus=法國鬥牛犬" },
        { label: "柯基犬 (中型犬 - 注意脊椎保護)", keywords: "柯基犬 柯基 短腿 中型犬 脊椎 椎間盤", url: "breeds.html?focus=柯基犬" },
        { label: "邊境牧羊犬 (中型犬 - 聰明精力旺盛)", keywords: "邊境牧羊犬 邊牧 中型犬 智商 飛盤", url: "breeds.html?focus=邊境牧羊犬" },
        { label: "博美 (小型犬 - 氣管脆弱注意)", keywords: "博美 博美犬 小型犬 氣管 胸背帶", url: "breeds.html?focus=博美" },
        { label: "吉娃娃 (小型犬 - 代謝快需保暖)", keywords: "吉娃娃 小型犬 怕冷 保暖 長壽", url: "breeds.html?focus=吉娃娃" },
        { label: "貴賓犬 (小型犬 - 聰明不掉毛)", keywords: "貴賓犬 紅貴賓 小型犬 捲毛 視網膜", url: "breeds.html?focus=貴賓犬" },
        { label: "比熊犬 (小型犬 - 親人需天天刷牙)", keywords: "比熊犬 比熊 小型犬 刷牙 淚痕", url: "breeds.html?focus=比熊犬" },

        // 3. 醫療、禁忌食物、行為與日常關鍵字精準定位
        { label: "疫苗接種 (醫療飲食 - 核心疫苗與補強)", keywords: "疫苗 預防針 狂犬病 犬瘟熱 打針", url: "medical.html?focus=疫苗接種" },
        { label: "寄生蟲預防 (醫療飲食 - 心絲蟲與跳蚤)", keywords: "寄生蟲 心絲蟲 跳蚤 壁蝨 驅蟲", url: "medical.html?focus=寄生蟲預防" },
        { label: "牙齒保健與洗牙 (醫療飲食 - 預防牙結石)", keywords: "牙齒 刷牙 洗牙 牙結石 口臭 牙周病", url: "medical.html?focus=牙齒保健" },
        { label: "健康檢查與血檢 (醫療飲食 - 定期健檢)", keywords: "健康檢查 健檢 抽血 血液 尿檢 X光 超音波", url: "medical.html?focus=定期健康檢查" },
        { label: "巧克力中毒警告 (醫療飲食 - 致命禁忌)", keywords: "巧克力 可可 咖啡因 中毒 不能吃", url: "medical.html?focus=巧克力" },
        { label: "葡萄與葡萄乾中毒 (醫療飲食 - 急性腎衰竭)", keywords: "葡萄 葡萄乾 水果 腎衰竭 中毒 不能吃", url: "medical.html?focus=葡萄與葡萄乾" },
        { label: "木糖醇與洋蔥蔥類禁忌 (醫療飲食 - 貧血肝損)", keywords: "木糖醇 洋蔥 大蒜 韭菜 蔥 花生醬 中毒 不能吃", url: "medical.html?focus=木糖醇" },
        { label: "熟骨頭與高風險食物 (醫療飲食 - 刺傷腸胃)", keywords: "骨頭 雞骨頭 熟骨頭 生肉 堅果 酪梨", url: "medical.html?focus=熟骨頭" },
        { label: "寵物晶片與寵物保險 (醫療飲食 - 日常照護)", keywords: "寵物晶片 晶片 登記 寵物保險 保險 社會化訓練", url: "medical.html?focus=寵物晶片" },
        { label: "吠叫語言解讀 (狗狗行為 - 興奮/警戒/焦慮叫聲)", keywords: "吠叫 亂叫 一直叫 哭 聲音 興奮吠叫", url: "behavior.html?focus=吠叫語言" },
        { label: "尾巴肢體與耳朵訊號 (狗狗行為 - 情緒解讀)", keywords: "尾巴 搖尾巴 耳朵 飛機耳 肢體 動作", url: "behavior.html?focus=尾巴肢體" },
        { label: "幼犬期與高齡老犬照護 (年紀狀況)", keywords: "幼犬 斷奶 成長期 老犬 高齡犬 退化", url: "age.html?focus=幼犬期" }
    ];

    if (!searchInput || !searchBtn || !searchSuggestions) return;

    let currentMatches = [];
    let selectedIndex = -1;
    let isComposing = false; // 偵測是否正在打注音符號

    // 儲存與讀取最近搜尋紀錄 (最多保留 5 筆)
    function saveRecentSearch(label, url) {
        try {
            let history = JSON.parse(localStorage.getItem('dogHubSearchHistory') || '[]');
            history = history.filter(item => item.label !== label);
            history.unshift({ label, url });
            if (history.length > 5) history = history.slice(0, 5);
            localStorage.setItem('dogHubSearchHistory', JSON.stringify(history));
        } catch (e) {}
    }

    function getRecentSearches() {
        try {
            return JSON.parse(localStorage.getItem('dogHubSearchHistory') || '[]');
        } catch (e) {
            return [];
        }
    }

    // 跳轉執行函數 (跳轉前先清空輸入框，確保返回時乾淨清爽)
    function navigateToResult(item) {
        if (!item || !item.url) return;
        saveRecentSearch(item.label, item.url);
        searchInput.value = '';
        searchSuggestions.style.display = 'none';
        window.location.href = item.url;
    }

    // 渲染簡潔下拉選單 (舊版乾淨風格 + 鍵盤上下鍵高亮支援)
    function renderDropdown(items, queryText = '', isHistory = false) {
        searchSuggestions.innerHTML = '';
        currentMatches = items;
        selectedIndex = -1;

        if (isHistory && items.length > 0) {
            const header = document.createElement('div');
            header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: #f4faf6; color: #666; font-size: 12px; border-bottom: 1px solid #e2ece6;';
            header.innerHTML = `
                <span>🕒 最近搜尋紀錄</span>
                <span id="clearSearchHistory" style="cursor: pointer; color: #387c59; font-weight: bold;">清除</span>
            `;
            searchSuggestions.appendChild(header);
            header.querySelector('#clearSearchHistory').addEventListener('click', (e) => {
                e.stopPropagation();
                localStorage.removeItem('dogHubSearchHistory');
                searchSuggestions.style.display = 'none';
            });
        }

        if (items.length === 0) {
            // 若使用者還在打未完成的注音符號 (ㄅ~ㄩ)，直接隱藏不閃爍、不報錯
            if (/[\u3105-\u3129\u02CA\u02C7\u02CB\u02D9]/.test(queryText)) {
                searchSuggestions.style.display = 'none';
                return;
            }
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'padding: 10px 14px; color: #777; font-size: 14px; text-align: left;';
            emptyDiv.textContent = `找不到「${queryText}」，可試試搜尋：品種、用品、柯基、疫苗、葡萄`;
            searchSuggestions.appendChild(emptyDiv);
            searchSuggestions.style.display = 'block';
            return;
        }

        items.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'suggestion-item';
            row.style.cssText = `
                padding: 10px 14px;
                font-size: 14px;
                color: #2b4a3b;
                background-color: #ffffff;
                border-bottom: 1px solid #f0f4f1;
                cursor: pointer;
                text-align: left;
                transition: background-color 0.12s ease;
            `;
            row.textContent = item.label;

            row.addEventListener('mouseenter', () => {
                selectedIndex = index;
                updateActiveHighlight();
            });

            row.addEventListener('mousedown', (e) => {
                // 使用 mousedown 確保比 input blur 更早觸發，點擊 100% 靈敏跳轉
                e.preventDefault();
                navigateToResult(item);
            });

            searchSuggestions.appendChild(row);
        });

        searchSuggestions.style.display = 'block';
    }

    function updateActiveHighlight() {
        const rows = searchSuggestions.querySelectorAll('.suggestion-item');
        rows.forEach((row, idx) => {
            if (idx === selectedIndex) {
                row.style.backgroundColor = '#e2f3ea';
                row.style.fontWeight = 'bold';
                row.scrollIntoView({ block: 'nearest' });
            } else {
                row.style.backgroundColor = '#ffffff';
                row.style.fontWeight = 'normal';
            }
        });
    }

    function updateSearchList() {
        const rawQuery = searchInput.value.trim();

        // 如果輸入框是空的，顯示最近搜尋紀錄
        if (!rawQuery) {
            const recent = getRecentSearches();
            if (recent.length > 0) {
                renderDropdown(recent, '', true);
            } else {
                searchSuggestions.style.display = 'none';
            }
            return;
        }

        // 如果包含注音符號且還在拼字中，暫不刷新，徹底解決文字跳太快消失的問題！
        if (isComposing || /[\u3105-\u3129]/.test(rawQuery)) {
            return;
        }

        const q = rawQuery.toLowerCase();
        const matched = searchDatabase.filter(item =>
            item.label.toLowerCase().includes(q) ||
            item.keywords.toLowerCase().includes(q)
        );

        renderDropdown(matched.slice(0, 8), rawQuery, false);
    }

    // 監聽中文輸入法組字狀態
    searchInput.addEventListener('compositionstart', () => {
        isComposing = true;
    });

    searchInput.addEventListener('compositionend', () => {
        isComposing = false;
        updateSearchList();
    });

    searchInput.addEventListener('input', () => {
        if (!isComposing) {
            updateSearchList();
        }
    });

    searchInput.addEventListener('focus', () => {
        updateSearchList();
    });

    // 支援鍵盤「上下鍵選擇」與「Enter 鍵直接跳入頁面」
    searchInput.addEventListener('keydown', (e) => {
        if (isComposing) return;

        const rows = searchSuggestions.querySelectorAll('.suggestion-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (rows.length === 0) {
                updateSearchList();
                return;
            }
            selectedIndex = (selectedIndex + 1) % rows.length;
            updateActiveHighlight();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (rows.length === 0) return;
            selectedIndex = (selectedIndex - 1 + rows.length) % rows.length;
            updateActiveHighlight();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && currentMatches[selectedIndex]) {
                navigateToResult(currentMatches[selectedIndex]);
            } else if (currentMatches.length > 0) {
                navigateToResult(currentMatches[0]);
            } else {
                // 若還沒觸發比對但直接按 Enter，立即比對第一筆並跳轉
                const q = searchInput.value.trim().toLowerCase();
                if (!q) return;
                const matched = searchDatabase.filter(item =>
                    item.label.toLowerCase().includes(q) ||
                    item.keywords.toLowerCase().includes(q)
                );
                if (matched.length > 0) {
                    navigateToResult(matched[0]);
                } else {
                    renderDropdown([], searchInput.value.trim(), false);
                }
            }
        } else if (e.key === 'Escape') {
            searchSuggestions.style.display = 'none';
        }
    });

    searchBtn.addEventListener('click', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
            searchInput.focus();
            return;
        }
        const matched = searchDatabase.filter(item =>
            item.label.toLowerCase().includes(q) ||
            item.keywords.toLowerCase().includes(q)
        );
        if (matched.length > 0) {
            navigateToResult(matched[0]);
        } else {
            renderDropdown([], searchInput.value.trim(), false);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.searchBar')) {
            searchSuggestions.style.display = 'none';
        }
    });
});
