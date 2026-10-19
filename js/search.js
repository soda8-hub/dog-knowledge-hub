window.addEventListener('pageshow', function () {
    // 從分頁按「上一頁」返回首頁時，強制清空搜尋欄，保持乾淨
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');
    if (searchInput) searchInput.value = '';
    if (suggestionsBox) suggestionsBox.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsBox = document.getElementById('searchSuggestions');
    const legacyItemList = document.getElementById('itemList');

    if (legacyItemList) legacyItemList.style.display = 'none';

    // 追蹤目前鍵盤選到哪一個選項 (-1 代表沒有選取)
    let currentFocus = -1;
    let isComposing = false; // 追蹤注音輸入狀態，防止閃爍

    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
    }

    // 關鍵字對應表 (擴充了 ?focus= 以支援指定區塊跳轉)
    const searchMap = [
        { label: "品種總覽", keywords: ["品種", "犬種"], url: "breeds.html" },
        { label: "黃金獵犬", keywords: ["黃金獵犬", "金毛"], url: "breeds.html?focus=黃金獵犬" },
        { label: "拉布拉多", keywords: ["拉布拉多", "拉不拉多"], url: "breeds.html?focus=拉布拉多" },
        { label: "哈士奇", keywords: ["哈士奇", "二哈", "雪橇犬"], url: "breeds.html?focus=哈士奇" },
        { label: "德國牧羊犬", keywords: ["德國牧羊犬", "狼犬"], url: "breeds.html?focus=德國牧羊犬" },
        { label: "台灣土狗", keywords: ["台灣土狗", "台灣犬", "土狗"], url: "breeds.html?focus=台灣土狗" },
        { label: "柴犬", keywords: ["柴犬", "阿柴"], url: "breeds.html?focus=柴犬" },
        { label: "法國鬥牛犬", keywords: ["法國鬥牛犬", "法鬥"], url: "breeds.html?focus=法國鬥牛犬" },
        { label: "柯基犬", keywords: ["柯基犬", "柯基", "短腿"], url: "breeds.html?focus=柯基犬" },
        { label: "邊境牧羊犬", keywords: ["邊境牧羊犬", "邊牧", "飛盤"], url: "breeds.html?focus=邊境牧羊犬" },
        { label: "吉娃娃", keywords: ["吉娃娃", "怕冷"], url: "breeds.html?focus=吉娃娃" },
        { label: "博美", keywords: ["博美", "氣管"], url: "breeds.html?focus=博美" },
        { label: "貴賓犬", keywords: ["貴賓犬", "紅貴賓", "玩具貴賓"], url: "breeds.html?focus=貴賓犬" },
        { label: "比熊犬", keywords: ["比熊犬", "比熊"], url: "breeds.html?focus=比熊犬" },
        
        { label: "醫療與飲食總覽", keywords: ["醫療", "飲食", "看醫生", "醫院"], url: "medical.html" },
        { label: "疫苗與寄生蟲預防", keywords: ["疫苗", "預防針", "狂犬病", "寄生蟲", "心絲蟲"], url: "medical.html?focus=預防保健" },
        { label: "致命禁忌：巧克力、葡萄", keywords: ["巧克力", "葡萄", "中毒", "不能吃"], url: "medical.html?focus=高風險" },
        { label: "危險食物：蔥類、木糖醇、骨頭", keywords: ["洋蔥", "大蒜", "骨頭", "木糖醇"], url: "medical.html?focus=高風險" },
        { label: "寵物晶片與保險", keywords: ["晶片", "保險", "登記"], url: "medical.html?focus=日常照護" },

        { label: "飼料與食物", keywords: ["飼料", "食物", "乾糧", "罐頭"], url: "food.html" },
        { label: "狗狗行為解讀", keywords: ["狗狗", "行為", "肢體", "動作", "叫聲"], url: "behavior.html" },
        { label: "吠叫原因與解讀", keywords: ["吠叫", "一直叫", "亂叫", "哭"], url: "behavior.html?focus=吠叫語言" },
        { label: "年紀狀況", keywords: ["年紀", "狀況", "年齡", "壽命", "幼犬", "老犬"], url: "age.html" },
        { label: "幼犬照顧", keywords: ["幼犬", "小狗", "斷奶", "換牙"], url: "age.html?focus=幼犬期" },
        { label: "寵物用品", keywords: ["寵物", "用品", "牽繩", "胸背帶", "狗床", "玩具"], url: "supplies.html" },
        { label: "照顧方法", keywords: ["照顧", "方法", "美容", "洗澡", "剪指甲", "清耳朵"], url: "care.html" },
        { label: "運動指南", keywords: ["運動", "散步", "跑步", "放電"], url: "exercise.html" }
    ];

    // 歷史紀錄處理
    function saveHistory(label, url) {
        let history = JSON.parse(localStorage.getItem('dogSearchHistory') || '[]');
        history = history.filter(item => item.label !== label);
        history.unshift({ label, url });
        if (history.length > 5) history = history.slice(0, 5);
        localStorage.setItem('dogSearchHistory', JSON.stringify(history));
    }

    function getHistory() {
        return JSON.parse(localStorage.getItem('dogSearchHistory') || '[]');
    }

    if (searchBtn && searchInput && suggestionsBox) {
        // ==========================================
        // 1. 監聽打字與輸入法狀態 (防閃爍)
        // ==========================================
        searchInput.addEventListener('compositionstart', () => { isComposing = true; });
        searchInput.addEventListener('compositionend', () => { 
            isComposing = false; 
            handleInput(); 
        });

        searchInput.addEventListener('input', function () {
            if (!isComposing) handleInput();
        });

        searchInput.addEventListener('focus', function () {
            handleInput();
        });

        function handleInput() {
            const query = searchInput.value.trim().toLowerCase();
            suggestionsBox.innerHTML = '';
            currentFocus = -1;

            if (query === '') {
                const history = getHistory();
                if (history.length > 0) {
                    const header = document.createElement('div');
                    header.style.cssText = 'padding: 8px 12px; font-size: 12px; color: #888; background: #f9f9f9; display: flex; justify-content: space-between; border-bottom: 1px solid #eee;';
                    header.innerHTML = `<span>🕒 最近搜尋</span><span id="clearHistory" style="cursor:pointer; color:#d9534f; font-weight:bold;">清除</span>`;
                    suggestionsBox.appendChild(header);

                    setTimeout(() => {
                        document.getElementById('clearHistory').addEventListener('click', (e) => {
                            e.stopPropagation();
                            localStorage.removeItem('dogSearchHistory');
                            suggestionsBox.style.display = 'none';
                        });
                    }, 0);

                    history.forEach((item, index) => createSuggestionItem(item.label, item.url, index + 1, true));
                    suggestionsBox.style.display = 'block';
                } else {
                    suggestionsBox.style.display = 'none';
                }
                return;
            }

            const filtered = searchMap.filter(item =>
                item.keywords.some(k => k.toLowerCase().includes(query)) ||
                item.label.toLowerCase().includes(query)
            );

            if (filtered.length > 0) {
                filtered.slice(0, 6).forEach((item, index) => createSuggestionItem(item.label, item.url, index, false));
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        }

        function createSuggestionItem(text, url, focusIndex, isHistory) {
            const item = document.createElement('div');
            item.textContent = text;
            item.className = 'suggestion-item'; // 綁定 class
            item.dataset.url = url;

            item.style.padding = '10px 14px';
            item.style.cursor = 'pointer';
            item.style.color = '#333333'; 
            item.style.fontSize = '14px';
            item.style.textAlign = 'left';
            item.style.borderBottom = '1px solid #eee';
            item.style.background = '#fff';

            item.addEventListener('mouseenter', () => {
                currentFocus = focusIndex;
                addActive(suggestionsBox.querySelectorAll('.suggestion-item'));
            });
            
            item.addEventListener('mousedown', function (e) {
                e.preventDefault(); // 確保不會觸發 input 的 blur
                saveHistory(text, url);
                searchInput.value = ''; // 點擊時提早清空
                window.location.href = url;
            });

            suggestionsBox.appendChild(item);
        }

        // ==========================================
        // 2. 監聽鍵盤事件 (上下方向鍵反白、Enter送出)
        // ==========================================
        searchInput.addEventListener('keydown', function (e) {
            if (isComposing) return;
            let items = suggestionsBox.querySelectorAll('.suggestion-item');
            
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
                if (currentFocus > -1 && suggestionsBox.style.display === 'block') {
                    if (items.length > 0) {
                        items[currentFocus].dispatchEvent(new Event('mousedown'));
                    }
                } else {
                    suggestionsBox.style.display = 'none';
                    searchBtn.click();
                }
            } else if (e.key === 'Escape') {
                suggestionsBox.style.display = 'none';
            }
        });

        // ==========================================
        // 3. 處理反白樣式的函數
        // ==========================================
        function addActive(items) {
            if (!items || items.length === 0) return false;
            removeActive(items);
            if (currentFocus >= items.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = items.length - 1;
            
            items[currentFocus].style.backgroundColor = '#e0f0e8';
            items[currentFocus].style.fontWeight = 'bold';
            items[currentFocus].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function removeActive(items) {
            for (let i = 0; i < items.length; i++) {
                items[i].style.backgroundColor = '#fff';
                items[i].style.fontWeight = 'normal';
            }
        }

        // ==========================================
        // 4. 搜尋按鈕跳轉
        // ==========================================
        searchBtn.addEventListener('click', function () {
            const query = searchInput.value.trim().toLowerCase();
            if (query === "") return alert("請輸入搜尋內容");

            const match = searchMap.find(item =>
                item.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
                item.label.toLowerCase().includes(query)
            );

            if (match) {
                saveHistory(match.label, match.url);
                searchInput.value = '';
                window.location.href = match.url;
            } else {
                alert("找不到相關網頁，請嘗試其他關鍵字（例如：品種、醫療）");
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.searchBar')) {
                suggestionsBox.style.display = 'none';
            }
        });
    }
});
