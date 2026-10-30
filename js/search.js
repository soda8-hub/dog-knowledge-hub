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

    // 靜態知識庫
    const searchDatabase = [
        { category: "品種", label: "品種總覽", desc: "常見犬種特點與養護資訊", keywords: "犬種 狗種 大型犬 中型犬 小型犬", url: "breeds.html" },
        { category: "品種", label: "黃金獵犬", desc: "大型犬，溫順、聰明、愛游泳", keywords: "金毛 游泳 獵犬 大型犬", url: "breeds.html?focus=黃金獵犬" },
        { category: "品種", label: "拉布拉多", desc: "大型犬，具 POMC 基因缺陷天生貪吃", keywords: "拉不拉多 導盲犬 貪吃 肥胖 大型犬", url: "breeds.html?focus=拉布拉多" },
        { category: "品種", label: "哈士奇", desc: "大型犬，精力充沛需大量運動，愛嚎叫", keywords: "二哈 雪橇犬 拆家 狼 大型犬", url: "breeds.html?focus=哈士奇" },
        { category: "品種", label: "德國牧羊犬", desc: "大型犬，忠誠警覺性高，注意胃扭轉", keywords: "狼犬 警犬 牧羊犬 大型犬", url: "breeds.html?focus=德國牧羊犬" },
        { category: "品種", label: "台灣土狗", desc: "大型犬，適應力強，遺傳疾病極少", keywords: "台灣犬 土狗 米克斯 大型犬", url: "breeds.html?focus=台灣土狗" },
        { category: "品種", label: "柴犬", desc: "中型犬，易患過敏、青光眼及膝蓋骨脫臼", keywords: "阿柴 柴柴 固執 換毛 中型犬", url: "breeds.html?focus=柴犬" },
        { category: "品種", label: "法國鬥牛犬", desc: "中型犬，呼吸系統脆弱，夏天需防中暑", keywords: "法鬥 鬥牛犬 呼吸 短吻 中型犬", url: "breeds.html?focus=法國鬥牛犬" },
        { category: "品種", label: "柯基犬", desc: "中型犬，身軀長易患椎間盤疾病", keywords: "柯基 科基 科技 短腿 脊椎 中型犬", url: "breeds.html?focus=柯基犬" },
        { category: "品種", label: "邊境牧羊犬", desc: "中型犬，世界最聰明，精力旺盛", keywords: "邊牧 牧羊犬 飛盤 中型犬", url: "breeds.html?focus=邊境牧羊犬" },
        { category: "品種", label: "吉娃娃", desc: "小型犬，代謝快，耐寒力差需保暖", keywords: "吉娃 怕冷 抖 小型犬", url: "breeds.html?focus=吉娃娃" },
        { category: "品種", label: "博美", desc: "小型犬，氣管脆弱，老犬易有牙結石", keywords: "薄美 博美犬 氣管 小型犬", url: "breeds.html?focus=博美" },
        { category: "品種", label: "貴賓犬", desc: "小型犬，聰明易訓練，注意視網膜萎縮", keywords: "紅貴賓 玩具貴賓 貴兵 捲毛 小型犬", url: "breeds.html?focus=貴賓犬" },
        { category: "品種", label: "比熊犬", desc: "小型犬，毛捲親人，務必天天刷牙", keywords: "比熊 棉花糖 小型犬", url: "breeds.html?focus=比熊犬" },
        
        { category: "醫療", label: "疫苗與預防保健", desc: "核心疫苗、狂犬病、心絲蟲與跳蚤預防", keywords: "醫療 看醫生 醫院 打針 預防針 驅蟲 寄生蟲", url: "medical.html?focus=預防保健" },
        { category: "醫療", label: "寵物晶片與日常照護", desc: "法定晶片登記與日常健康觀察", keywords: "晶片 鼻紋 登記 保險 發燒", url: "medical.html?focus=寵物晶片" },
        { category: "禁忌", label: "巧克力與葡萄", desc: "劇毒食物，引發腎衰竭或神經心臟問題", keywords: "中毒 不能吃 葡萄乾 致命 危險 禁忌", url: "medical.html?focus=葡萄與葡萄乾" },
        { category: "禁忌", label: "蔥類與木糖醇", desc: "破壞紅血球造成貧血，或引發肝臟損傷", keywords: "洋蔥 大蒜 韭菜 花生醬 口香糖 貧血", url: "medical.html?focus=木糖醇" },
        { category: "禁忌", label: "熟骨頭与生食", desc: "易碎裂造成窒息或腸胃道刺傷", keywords: "雞骨 骨頭 刺破 高風險 生肉", url: "medical.html?focus=熟骨頭" },
        
        { category: "飲食", label: "飼料與食物指南", desc: "乾糧、罐頭與鮮食挑選指南", keywords: "飼料 食物 乾糧 罐頭 挑嘴 吃什麼", url: "food.html" },
        { category: "行為", label: "吠叫語言解讀", desc: "興奮、需求、警戒或分離焦慮的叫聲解讀", keywords: "狗狗 行為 一直叫 亂叫 哭 叫聲 聲音 興奮吠叫", url: "behavior.html?focus=興奮吠叫" },
        { category: "行為", label: "尾巴與耳朵訊號", desc: "搖尾巴的幅度、飛機耳代表的情緒意義", keywords: "肢體 動作 搖尾巴 害怕 生氣 飛機耳 耳朵", url: "behavior.html?focus=尾巴" },
        { category: "日常", label: "年紀與壽命狀況", desc: "不同年齡階段的健康與照顧指南", keywords: "老犬 壽命 年齡 幾歲 年紀", url: "age.html" },
        { category: "日常", label: "幼犬期照顧", desc: "幼犬期的社會化、換牙與基本訓練", keywords: "幼犬 小狗 斷奶 換牙 剛出生", url: "age.html?focus=幼犬" },
        { category: "日常", label: "寵物用品清單", desc: "牽繩、胸背帶、狗床、水碗等必備清單", keywords: "寵物用品 買什麼 準備 牽繩 胸背帶 玩具 狗窩", url: "supplies.html" },
        { category: "日常", label: "日常照顧方法", desc: "洗澡、剪指甲、清耳朵等日常美容", keywords: "照顧 洗澡 刷牙 清潔 梳毛 剪指甲 清耳朵", url: "care.html" },
        { category: "日常", label: "運動與放電指南", desc: "每天散步時間、消耗體力的放電教學", keywords: "運動 散步 跑步 飛盤 放電 嗅聞 體力", url: "exercise.html" }
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
                    header.style.cssText = 'padding: 8px 14px; font-size: 12px; color: #888; background: #f8fbf9; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; user-select: none;';
                    header.innerHTML = `<span>🕒 最近搜尋紀錄</span><span id="clearHistory" style="cursor:pointer; color:#d9534f; font-weight:bold;">清除</span>`;
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
                            desc: "點擊再次前往該知識區塊",
                            url: item.url
                        }, index);
                    });
                    suggestionsBox.style.display = 'block';
                } else {
                    suggestionsBox.style.display = 'none';
                }
                return;
            }

            const matched = searchDatabase.filter(item =>
                item.label.toLowerCase().includes(cleanQuery) ||
                item.desc.toLowerCase().includes(cleanQuery) ||
                item.category.toLowerCase().includes(cleanQuery) ||
                item.keywords.toLowerCase().includes(cleanQuery)
            );

            if (matched.length > 0) {
                matched.slice(0, 8).forEach((item, index) => createSuggestionItem(item, index));
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        }

        function createSuggestionItem(itemData, itemIndex) {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.dataset.url = itemData.url;
            div.dataset.label = itemData.label;
            div.style.cssText = 'padding: 10px 14px; cursor: pointer; border-bottom: 1px solid #f0f4f1; background-color: #ffffff; border-left: 4px solid transparent; transition: all 0.12s ease; text-align: left;';

            let tagBg = '#24b657';
            if (itemData.category === '禁忌' || itemData.category === '醫療') tagBg = '#e74c3c';
            else if (itemData.category === '行為') tagBg = '#f39c12';
            else if (itemData.category === '歷史') tagBg = '#7f8c8d';
            else if (itemData.category === '品種') tagBg = '#2980b9';

            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <span style="background:${tagBg}; color:white; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:bold; white-space:nowrap;">${itemData.category}</span>
                    <strong class="item-title-text" style="color:#2b4a3b; font-size:15px;">${itemData.label}</strong>
                </div>
                <div style="font-size:12px; color:#666; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${itemData.desc}
                </div>
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
                item.desc.toLowerCase().includes(cleanQuery) ||
                item.keywords.toLowerCase().includes(cleanQuery)
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
