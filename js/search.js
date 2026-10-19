// =========================================================
// 🔍 完美搜尋引擎 (舊版直覺選單 + 鍵盤導覽 + 歷史紀錄 + 區塊直達)
// =========================================================

window.addEventListener('pageshow', function () {
    // 當使用者按「上一頁」返回時，強制清空搜尋欄，保持畫面乾淨
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
    if (!searchInput || !searchBtn || !suggestionsBox) return;

    let currentFocus = -1;
    let isComposing = false; // 追蹤注音輸入狀態

    // 1. 全站知識點與分類關鍵字對應表 (加上 ?focus= 實現精準區塊跳轉)
    const searchDatabase = [
        { label: "品種百科總覽", keywords: "breeds 品種 犬種 大型犬 中型犬 小型犬", url: "breeds.html" },
        { label: "黃金獵犬 (大型犬)", keywords: "黃金獵犬 金毛 大型犬 游泳", url: "breeds.html?focus=黃金獵犬" },
        { label: "拉布拉多 (大型犬)", keywords: "拉布拉多 拉不拉多 導盲犬 貪吃 POMC", url: "breeds.html?focus=拉布拉多" },
        { label: "哈士奇 (大型犬)", keywords: "哈士奇 二哈 雪橇犬 嚎叫 拆家", url: "breeds.html?focus=哈士奇" },
        { label: "台灣土狗 (大型犬)", keywords: "台灣土狗 台灣犬 土狗", url: "breeds.html?focus=台灣土狗" },
        { label: "柴犬 (中型犬)", keywords: "柴犬 阿柴 固執 換毛 青光眼", url: "breeds.html?focus=柴犬" },
        { label: "柯基犬 (中型犬)", keywords: "柯基犬 柯基 短腿 脊椎 椎間盤", url: "breeds.html?focus=柯基犬" },
        { label: "吉娃娃 (小型犬)", keywords: "吉娃娃 代謝快 怕冷 保暖", url: "breeds.html?focus=吉娃娃" },
        { label: "貴賓犬 (小型犬)", keywords: "貴賓犬 紅貴賓 玩具貴賓 捲毛", url: "breeds.html?focus=貴賓犬" },
        { label: "寵物用品清單指南", keywords: "supplies 寵物用品 牽繩 胸背帶 狗床 水碗 玩具", url: "supplies.html" },
        { label: "醫療與飲食總覽", keywords: "medical 醫療 飲食 醫院 看醫生", url: "medical.html" },
        { label: "疫苗與寄生蟲預防", keywords: "疫苗 預防針 狂犬病 犬瘟熱 寄生蟲 心絲蟲 跳蚤", url: "medical.html?focus=預防保健" },
        { label: "致命禁忌：巧克力、葡萄", keywords: "巧克力 葡萄 葡萄乾 中毒 腎衰竭 不能吃", url: "medical.html?focus=高風險" },
        { label: "危險食物：蔥類、木糖醇、骨頭", keywords: "洋蔥 韭菜 大蒜 骨頭 雞骨 木糖醇 貧血", url: "medical.html?focus=高風險" },
        { label: "狗狗行為解讀", keywords: "behavior 行為 肢體 動作 叫聲 心理 吠叫 搖尾巴 飛機耳", url: "behavior.html" },
        { label: "年紀狀況 (幼犬至老犬)", keywords: "age 年紀 狀況 年齡 壽命 幼犬 老犬", url: "age.html" },
        { label: "照顧方法 (洗澡、美容)", keywords: "care 照顧 方法 美容 洗澡 剪指甲 清耳朵 梳毛", url: "care.html" },
        { label: "運動與放電指南", keywords: "exercise 運動 散步 跑步 飛盤 嗅聞", url: "exercise.html" }
    ];

    // 2. 歷史紀錄系統 (LocalStorage)
    function getHistory() {
        return JSON.parse(localStorage.getItem('dogSearchHistory') || '[]');
    }
    function saveHistory(label, url) {
        let history = getHistory().filter(item => item.label !== label);
        history.unshift({ label, url });
        if (history.length > 5) history = history.slice(0, 5); // 最多存 5 筆
        localStorage.setItem('dogSearchHistory', JSON.stringify(history));
    }

    // 3. 渲染選單函數 (套用你舊版的乾淨樣式)
    function renderList(items, isHistory = false) {
        suggestionsBox.innerHTML = '';
        currentFocus = -1;

        if (items.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }

        if (isHistory) {
            const header = document.createElement('div');
            header.style.cssText = 'padding: 8px 12px; font-size: 12px; color: #888; background: #f9f9f9; display: flex; justify-content: space-between;';
            header.innerHTML = `<span>🕒 最近搜尋</span><span id="clearHistory" style="cursor:pointer; color:#d9534f;">清除</span>`;
            suggestionsBox.appendChild(header);
            setTimeout(() => {
                document.getElementById('clearHistory').addEventListener('click', (e) => {
                    e.stopPropagation();
                    localStorage.removeItem('dogSearchHistory');
                    suggestionsBox.style.display = 'none';
                });
            }, 0);
        }

        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.textContent = item.label;
            div.className = 'suggestion-item'; // 給予 class 方便方向鍵選取
            div.style.cssText = 'padding: 10px 12px; cursor: pointer; color: #333; font-size: 14px; text-align: left; border-bottom: 1px solid #eee; background: #fff; transition: background 0.1s;';

            div.addEventListener('mouseenter', () => {
                currentFocus = isHistory ? index + 1 : index; // 考慮 header 的位移
                addActive(suggestionsBox.children);
            });

            div.addEventListener('mousedown', (e) => {
                e.preventDefault();
                saveHistory(item.label, item.url);
                window.location.href = item.url; // 點擊直接跳轉
            });

            suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = 'block';
    }

    // 4. 輸入與焦點監聽 (防注音閃爍)
    searchInput.addEventListener('compositionstart', () => { isComposing = true; });
    searchInput.addEventListener('compositionend', () => { 
        isComposing = false; 
        handleInput(); 
    });

    searchInput.addEventListener('input', () => {
        if (!isComposing) handleInput();
    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() === '') {
            const history = getHistory();
            if (history.length > 0) renderList(history, true);
        } else {
            handleInput();
        }
    });

    function handleInput() {
        const query = searchInput.value.trim().toLowerCase();
        if (query === '') {
            const history = getHistory();
            if (history.length > 0) renderList(history, true);
            else suggestionsBox.style.display = 'none';
            return;
        }

        const filtered = searchDatabase.filter(item => 
            item.label.toLowerCase().includes(query) || 
            item.keywords.toLowerCase().includes(query)
        );
        renderList(filtered, false);
    }

    // 5. 恢復你最棒的鍵盤上下鍵與 Enter 邏輯
    searchInput.addEventListener('keydown', function (e) {
        if (isComposing) return;
        let items = suggestionsBox.children;
        if (!items || items.length === 0) return;

        // 如果是歷史紀錄，第一個 children 是 header，需要跳過
        const isHistory = items[0].querySelector('#clearHistory') !== null;
        const startIndex = isHistory ? 1 : 0;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentFocus++;
            addActive(items, startIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentFocus--;
            addActive(items, startIndex);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus >= startIndex && currentFocus < items.length && suggestionsBox.style.display === 'block') {
                items[currentFocus].dispatchEvent(new Event('mousedown')); // 觸發跳轉
            } else {
                searchBtn.click(); // 沒選中則執行預設搜尋
            }
        }
    });

    function addActive(items, startIndex = 0) {
        removeActive(items, startIndex);
        if (currentFocus >= items.length) currentFocus = startIndex;
        if (currentFocus < startIndex) currentFocus = items.length - 1;
        items[currentFocus].style.backgroundColor = '#e0f0e8'; // 你原本的淺綠色
        items[currentFocus].style.fontWeight = 'bold';
    }

    function removeActive(items, startIndex = 0) {
        for (let i = startIndex; i < items.length; i++) {
            items[i].style.backgroundColor = '#fff';
            items[i].style.fontWeight = 'normal';
        }
    }

    // 6. 搜尋按鈕點擊
    searchBtn.addEventListener('click', function () {
        const query = searchInput.value.trim().toLowerCase();
        if (query === "") return alert("請輸入搜尋內容");

        const match = searchDatabase.find(item => item.keywords.toLowerCase().includes(query) || item.label.toLowerCase().includes(query));
        if (match) {
            saveHistory(match.label, match.url);
            window.location.href = match.url;
        } else {
            alert("找不到相關知識，請嘗試關鍵字（如：品種、疫苗、葡萄）");
        }
    });

    // 7. 點擊空白處關閉選單
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.searchBar')) {
            suggestionsBox.style.display = 'none';
        }
    });
});
