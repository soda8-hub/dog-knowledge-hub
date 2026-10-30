window.addEventListener('pageshow', function () {
    // 🌟 返回首頁時，自動清空搜尋欄內容，保持乾淨
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
    let isComposing = false; // 追蹤注音輸入狀態，防止閃爍

    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
    }

    // ==========================================
    // 🌟 靜態豐富版資料庫 (純前端維護，免動後端)
    // 包含：分類 (category)、標題 (label)、說明 (desc)、隱藏關鍵字 (keywords)、精準跳轉 (url)
    // ==========================================
    const searchDatabase = [
        { category: "品種", label: "品種總覽", desc: "常見犬種特點與養護資訊", keywords: "犬種 大型犬 中型犬 小型犬", url: "breeds.html" },
        { category: "品種", label: "黃金獵犬", desc: "大型犬，溫順、聰明、愛游泳", keywords: "金毛 游泳 獵犬", url: "breeds.html?focus=黃金獵犬" },
        { category: "品種", label: "拉布拉多", desc: "大型犬，具 POMC 基因缺陷天生貪吃", keywords: "拉不拉多 導盲犬 貪吃 肥胖", url: "breeds.html?focus=拉布拉多" },
        { category: "品種", label: "哈士奇", desc: "大型犬，精力充沛需大量運動，愛嚎叫", keywords: "二哈 雪橇犬 拆家", url: "breeds.html?focus=哈士奇" },
        { category: "品種", label: "德國牧羊犬", desc: "大型犬，忠誠警覺性高，注意胃扭轉", keywords: "狼犬 警犬", url: "breeds.html?focus=德國牧羊犬" },
        { category: "品種", label: "台灣土狗", desc: "大型犬，適應力強，遺傳疾病極少", keywords: "台灣犬 土狗 米克斯", url: "breeds.html?focus=台灣土狗" },
        { category: "品種", label: "柴犬", desc: "中型犬，易患過敏、青光眼及膝蓋骨脫臼", keywords: "阿柴 固執 換毛", url: "breeds.html?focus=柴犬" },
        { category: "品種", label: "法國鬥牛犬", desc: "中型犬，呼吸系統脆弱，夏天需防中暑", keywords: "法鬥 呼吸 短吻", url: "breeds.html?focus=法國鬥牛犬" },
        { category: "品種", label: "柯基犬", desc: "中型犬，身軀長易患椎間盤疾病", keywords: "柯基 短腿 脊椎", url: "breeds.html?focus=柯基犬" },
        { category: "品種", label: "邊境牧羊犬", desc: "中型犬，世界最聰明，精力旺盛", keywords: "邊牧 飛盤", url: "breeds.html?focus=邊境牧羊犬" },
        { category: "品種", label: "吉娃娃", desc: "小型犬，代謝快，耐寒力差需保暖", keywords: "怕冷 抖", url: "breeds.html?focus=吉娃娃" },
        { category: "品種", label: "博美", desc: "小型犬，氣管脆弱，老犬易有牙結石", keywords: "氣管", url: "breeds.html?focus=博美" },
        { category: "品種", label: "貴賓犬", desc: "小型犬，聰明易訓練，注意視網膜萎縮", keywords: "紅貴賓 玩具貴賓 捲毛", url: "breeds.html?focus=貴賓犬" },
        { category: "品種", label: "比熊犬", desc: "小型犬，毛捲親人，務必天天刷牙", keywords: "比熊", url: "breeds.html?focus=比熊犬" },
        
        { category: "醫療", label: "疫苗與預防保健", desc: "核心疫苗、狂犬病、心絲蟲與跳蚤預防", keywords: "醫療 看醫生 醫院 打針 驅蟲", url: "medical.html?focus=預防保健" },
        { category: "禁忌", label: "巧克力與葡萄", desc: "劇毒食物，引發腎衰竭或神經心臟問題", keywords: "中毒 不能吃 葡萄乾 致命", url: "medical.html?focus=高風險食物" },
        { category: "禁忌", label: "蔥類與木糖醇", desc: "破壞紅血球造成貧血，或引發肝臟損傷", keywords: "洋蔥 大蒜 韭菜 花生醬 口香糖", url: "medical.html?focus=高風險食物" },
        { category: "禁忌", label: "熟骨頭", desc: "易碎裂造成窒息或腸胃道刺傷", keywords: "雞骨 骨頭 刺破", url: "medical.html?focus=高風險食物" },
        
        { category: "飲食", label: "飼料與食物", desc: "乾糧、罐頭與鮮食挑選指南", keywords: "飼料 食物 挑嘴", url: "food.html" },
        { category: "行為", label: "吠叫語言", desc: "興奮、需求、警戒或分離焦慮的叫聲解讀", keywords: "狗狗 行為 肢體 動作 一直叫 亂叫 哭 叫聲", url: "behavior.html?focus=吠叫語言" },
        { category: "行為", label: "尾巴與耳朵", desc: "搖尾巴的幅度、飛機耳代表的情緒意義", keywords: "搖尾巴 害怕 生氣 飛機耳", url: "behavior.html?focus=尾巴肢體語言" },
        { category: "日常", label: "年紀狀況", desc: "不同年齡階段的健康與照顧指南", keywords: "幼犬 老犬 壽命 年齡", url: "age.html" },
        { category: "日常", label: "幼犬照顧", desc: "幼犬期的社會化與基本訓練", keywords: "幼犬 小狗 斷奶 換牙", url: "age.html?focus=幼犬期" },
        { category: "日常", label: "寵物用品清單", desc: "牽繩、胸背帶、狗床、水碗等必備清單", keywords: "買什麼 準備 牽繩 胸背帶 玩具", url: "supplies.html" },
        { category: "日常", label: "照顧方法", desc: "洗澡、剪指甲、清耳朵等日常美容", keywords: "洗澡 刷牙 清潔 梳毛", url: "care.html" },
        { category: "日常", label: "運動指南", desc: "每天散步時間、消耗體力的放電教學", keywords: "散步 跑步 飛盤 放電 嗅聞", url: "exercise.html" }
    ];

    // 歷史紀錄處理 (LocalStorage)
    function saveHistory(title, url) {
        let history = JSON.parse(localStorage.getItem('dogSearchHistory') || '[]');
        history = history.filter(item => item.title !== title);
        history.unshift({ title, url });
        if (history.length > 5) history = history.slice(0, 5); // 最多存 5 筆
        localStorage.setItem('dogSearchHistory', JSON.stringify(history));
    }

    function getHistory() {
        return JSON.parse(localStorage.getItem('dogSearchHistory') || '[]');
    }

    if (searchBtn && searchInput && suggestionsBox) {

        // 監聽注音輸入，防止輸入一半時選單狂閃
        searchInput.addEventListener('compositionstart', () => { isComposing = true; });
        searchInput.addEventListener('compositionend', () => { isComposing = false; handleInput(); });
        searchInput.addEventListener('input', () => { if (!isComposing) handleInput(); });
        
        searchInput.addEventListener('focus', () => { handleInput(); });

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

                    // 渲染歷史紀錄
                    history.forEach((item, index) => {
                        createSuggestionItem({ category: "歷史", label: item.title, desc: "點擊返回上次查找的知識點", url: item.url }, index + 1);
                    });
                    suggestionsBox.style.display = 'block';
                } else {
                    suggestionsBox.style.display = 'none';
                }
                return;
            }

            // 多維度模糊比對：同時找 分類、標題、說明、隱藏關鍵字
            const matched = searchDatabase.filter(item => 
                item.label.toLowerCase().includes(query) || 
                item.desc.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.keywords.toLowerCase().includes(query)
            );

            if (matched.length > 0) {
                // 限制最多顯示 8 筆結果，防止選單過長
                matched.slice(0, 8).forEach((item, index) => createSuggestionItem(item, index));
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        }

        // 🌟 建立富文本下拉選單項目
        function createSuggestionItem(itemData, focusIndex) {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            
            // 根據分類給予不同顏色的膠囊標籤 (UX 視覺優化)
            let tagBg = '#24b657'; // 預設綠色
            if (itemData.category === '禁忌' || itemData.category === '醫療') tagBg = '#e74c3c';
            else if (itemData.category === '行為') tagBg = '#f39c12';
            else if (itemData.category === '歷史') tagBg = '#7f8c8d';
            else if (itemData.category === '品種') tagBg = '#2980b9';

            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <span style="background:${tagBg}; color:white; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold; white-space:nowrap;">${itemData.category}</span>
                    <strong style="color:#2b4a3b; font-size:15px;">${itemData.label}</strong>
                </div>
                <div style="font-size:12px; color:#666; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${itemData.desc}
                </div>
            `;
            
            div.addEventListener('mouseenter', () => {
                currentFocus = focusIndex;
                addActive(suggestionsBox.querySelectorAll('.suggestion-item'));
            });
            
            div.addEventListener('mousedown', (e) => {
                e.preventDefault(); // 防止 input 失去焦點導致視窗提早關閉
                saveHistory(itemData.label, itemData.url);
                searchInput.value = ''; // 點擊時提早清空
                window.location.href = itemData.url;
            });

            suggestionsBox.appendChild(div);
        }

        // ==========================================
        // 3. 鍵盤事件 (完美上下選擇與 Enter 跳轉)
        // ==========================================
        searchInput.addEventListener('keydown', function (e) {
            if (isComposing) return;
            let items = suggestionsBox.querySelectorAll('.suggestion-item');
            if (!items || items.length === 0) return;

            // 如果有歷史紀錄的 Header，第一筆選項的 index 會從 1 開始，這裡統一處理 DOM 抓取
            const startIndex = 0; 

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
                    if (items[currentFocus]) items[currentFocus].dispatchEvent(new Event('mousedown'));
                } else if (items.length > 0) {
                    items[startIndex].dispatchEvent(new Event('mousedown')); // 沒反白時，預設跳轉第一筆
                }
            } else if (e.key === 'Escape') {
                suggestionsBox.style.display = 'none';
            }
        });

        function addActive(items) {
            if (!items || items.length === 0) return;
            for (let i = 0; i < items.length; i++) {
                items[i].classList.remove('autocomplete-active');
            }
            if (currentFocus >= items.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = items.length - 1;
            
            items[currentFocus].classList.add('autocomplete-active');
            items[currentFocus].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.searchBar')) suggestionsBox.style.display = 'none';
        });

        searchBtn.addEventListener('click', function () {
            const query = searchInput.value.trim().toLowerCase();
            if (query === "") return alert("請輸入搜尋內容");
            
            // 點擊搜尋按鈕時，直接尋找最符合的第一筆資料
            const match = searchDatabase.find(item => 
                item.label.toLowerCase().includes(query) || 
                item.desc.toLowerCase().includes(query) ||
                item.keywords.toLowerCase().includes(query)
            );

            if (match) {
                saveHistory(match.label, match.url);
                searchInput.value = '';
                window.location.href = match.url;
            } else {
                alert("找不到相關網頁，請嘗試其他關鍵字（例如：品種、醫療、巧克力）");
            }
        });
    }
});
