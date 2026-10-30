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
    let isComposing = false; // 用來精準追蹤是否正在「注音組字」中
    let inputTimeout = null; // 用來設定防抖動，避免注音切換時閃爍

    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
    }

    // 🌟 知識庫：結合單純版呈現與極豐富的底層關鍵字（涵蓋八大分頁細節）
    const searchDatabase = [
        { label: "品種百科", keywords: "品種 狗種 犬種 大型犬 中型犬 小型犬 尋找命定狗狗", url: "breeds.html" },
        { label: "黃金獵犬", keywords: "黃金獵犬 金毛 大型犬 溫順 聰明 愛游泳 眼瞼內翻 髖關節發育不良", url: "breeds.html?focus=黃金獵犬" },
        { label: "拉布拉多", keywords: "拉布拉多 拉不拉多 大型犬 短毛 活潑 貪吃 POMC 基因缺陷 導盲犬", url: "breeds.html?focus=拉布拉多" },
        { label: "哈士奇", keywords: "哈士奇 大型犬 像狼 愛嚎叫 怕熱 二哈 雪橇犬 白內障", url: "breeds.html?focus=哈士奇" },
        { label: "德國牧羊犬", keywords: "德國牧羊犬 大型犬 忠誠 警犬 警覺性 狼犬 胃扭轉 脊髓病", url: "breeds.html?focus=德國牧羊犬" },
        { label: "台灣土狗", keywords: "台灣土狗 大型犬 立耳 忠誠 適應力強 台灣犬 米克斯", url: "breeds.html?focus=台灣土狗" },
        { label: "柴犬", keywords: "柴犬 中型犬 固執 過敏 青光眼 膝蓋骨脫臼 阿柴", url: "breeds.html?focus=柴犬" },
        { label: "法國鬥牛犬", keywords: "法國鬥牛犬 中型犬 呼吸系統脆弱 不耐冷熱 中暑 法鬥", url: "breeds.html?focus=法國鬥牛犬" },
        { label: "柯基犬", keywords: "柯基犬 中型犬 椎間盤疾病 尿道結石 柯基 短腿", url: "breeds.html?focus=柯基犬" },
        { label: "邊境牧羊犬", keywords: "邊境牧羊犬 中型犬 長毛 最聰明 精力旺盛 癲癇 飛盤 邊牧", url: "breeds.html?focus=邊境牧羊犬" },
        { label: "吉娃娃", keywords: "吉娃娃 小型犬 短毛 活潑 怕冷 代謝快 穿衣保暖", url: "breeds.html?focus=吉娃娃" },
        { label: "博美", keywords: "博美 小型犬 氣管脆弱 牙結石 口臭", url: "breeds.html?focus=博美" },
        { label: "貴賓犬", keywords: "貴賓犬 小型犬 溫順 聰明 視網膜萎縮 紅貴賓 玩具貴賓 捲毛", url: "breeds.html?focus=貴賓犬" },
        { label: "比熊犬", keywords: "比熊犬 小型犬 毛捲 親人 腸胃敏感 膀胱感染 刷牙", url: "breeds.html?focus=比熊犬" },

        { label: "醫療與飲食", keywords: "醫療 飲食 看醫生 醫院", url: "medical.html" },
        { label: "疫苗與驅蟲", keywords: "疫苗 預防保健 核心疫苗 犬瘟熱 狂犬病 寄生蟲 心絲蟲 跳蚤", url: "medical.html?focus=預防保健" },
        { label: "定期健康檢查", keywords: "健康檢查 血液檢查 超音波 X光 尿液", url: "medical.html?focus=定期健康檢查" },
        { label: "飲食禁忌 (巧克力/葡萄)", keywords: "高風險食物 巧克力 葡萄 蔥 韭菜 大蒜 木糖醇 骨頭 生肉 咖啡因 酒精 致命 毒", url: "medical.html?focus=巧克力" },
        { label: "日常照護與保險", keywords: "寵物晶片 保險 絕育 結紮 發燒 嘔吐 醫療警訊", url: "medical.html?focus=日常照護" },

        { label: "飼料與食物", keywords: "飼料 食物 挑選 乾糧 罐頭 鮮食", url: "food.html" },
        { label: "乾飼料挑選", keywords: "乾飼料 無穀 幼犬飼料 老犬飼料", url: "food.html?focus=乾飼料" },
        { label: "濕食與罐頭", keywords: "濕食 罐頭 主食罐 副食罐 水分", url: "food.html?focus=濕食" },
        { label: "人類食物 (可吃/禁忌)", keywords: "鮮食 水煮肉 雞胸肉 牛肉 鮭魚 南瓜 地瓜 蘋果 香蕉 人類食物", url: "food.html?focus=人類食物" },

        { label: "行為解讀", label: "狗狗行為", keywords: "狗狗 行為 肢體 動作 心理", url: "behavior.html" },
        { label: "吠叫原因", keywords: "吠叫 興奮吠叫 需求吠叫 警戒吠叫 分離焦慮 亂叫 哭", url: "behavior.html?focus=吠叫語言" },
        { label: "尾巴語言", keywords: "尾巴 搖尾巴 夾尾巴 開心 害怕 警戒", url: "behavior.html?focus=尾巴肢體" },
        { label: "飛機耳與眼神", keywords: "耳朵 飛機耳 豎耳 眼神", url: "behavior.html?focus=耳朵的訊號" },
        { label: "舔拭與翻肚子", keywords: "身體姿態 翻肚子 臣服 舔人 舔拭", url: "behavior.html?focus=舔拭的意義" },

        { label: "年紀與狀況", keywords: "年紀 狀況 年齡 換算 壽命", url: "age.html" },
        { label: "幼犬照顧", keywords: "幼犬 幼犬期 離乳 換牙 社會化 小狗", url: "age.html?focus=幼犬期" },
        { label: "成犬照顧", keywords: "成犬 成犬期 結紮 體態", url: "age.html?focus=成犬期" },
        { label: "老犬與失智照護", keywords: "熟齡犬 老犬 高齡犬 退化 失智 止滑墊", url: "age.html?focus=高齡犬特別護理" },

        { label: "寵物用品", keywords: "寵物 用品 新手準備 買什麼", url: "supplies.html" },
        { label: "散步外出用品", keywords: "牽繩 胸背帶 項圈 外出籠 推車 撿便袋", url: "supplies.html?focus=外出散步" },
        { label: "居家飲食用品", keywords: "食碗 水碗 慢食碗 狗床 尿布墊 圍欄", url: "supplies.html?focus=居家飲食" },
        { label: "清潔美容玩具", keywords: "洗毛精 梳子 牙刷 指甲剪 玩具 藏食玩具 嗅聞", url: "supplies.html?focus=日常清潔" },

        { label: "日常照顧方法", keywords: "照顧 方法 美容 清潔", url: "care.html" },
        { label: "洗澡與吹毛", keywords: "洗澡 吹毛 水溫 頻率", url: "care.html?focus=洗澡" },
        { label: "梳毛與換毛", keywords: "梳毛 廢毛 換毛期 梳子", url: "care.html?focus=毛髮梳理" },
        { label: "清耳朵與剪指甲", keywords: "剪指甲 血線 清耳朵 拔耳毛", url: "care.html?focus=指甲" },
        { label: "刷牙與擠肛門腺", keywords: "刷牙 牙結石 擠肛門腺 磨屁股", url: "care.html?focus=牙齒" },

        { label: "運動與放電", keywords: "運動 散步 跑步 放電 體力", url: "exercise.html" },
        { label: "每日運動量", keywords: "運動量 散步時間 幾分鐘", url: "exercise.html?focus=運動量" },
        { label: "嗅聞與室內遊戲", keywords: "嗅聞散步 嗅聞 飛盤 拔河 室內運動", url: "exercise.html?focus=嗅聞" },
        { label: "運動安全", keywords: "安全 燙傷 關節 中暑 飯後", url: "exercise.html?focus=安全須知" }
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

        // 🌟 徹底解決注音輸入與中英切換的衝突
        searchInput.addEventListener('compositionstart', () => { 
            isComposing = true; 
        });
        
        searchInput.addEventListener('compositionend', () => { 
            isComposing = false; 
            triggerSearchDelay(); 
        });

        searchInput.addEventListener('input', () => {
            if (!isComposing) {
                triggerSearchDelay();
            }
        });

        searchInput.addEventListener('focus', () => {
            triggerSearchDelay();
        });

        // 加入一點點防抖動 (debounce)，防止打字太快或切換輸入法時選單閃爍
        function triggerSearchDelay() {
            clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => {
                handleInput();
            }, 50); 
        }

        function handleInput() {
            // 如果還在打注音，絕對不要更新選單，防止閃爍與消失
            if (isComposing) return;

            const rawValue = searchInput.value.trim().toLowerCase();
            
            suggestionsBox.innerHTML = '';
            currentFocus = -1;

            if (rawValue === '') {
                const history = getHistory();
                if (history.length > 0) {
                    const header = document.createElement('div');
                    header.style.cssText = 'padding: 8px 14px; font-size: 12px; color: #888; background: #f8fbf9; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; user-select: none;';
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
                            label: item.label,
                            url: item.url
                        }, index, true);
                    });
                    suggestionsBox.style.display = 'block';
                } else {
                    suggestionsBox.style.display = 'none';
                }
                return;
            }

            // 搜尋邏輯：比對標題與隱藏的 keywords
            const matched = searchDatabase.filter(item =>
                item.label.toLowerCase().includes(rawValue) ||
                item.keywords.toLowerCase().includes(rawValue)
            );

            if (matched.length > 0) {
                // 限制最多顯示 8 筆
                matched.slice(0, 8).forEach((item, index) => createSuggestionItem(item, index, false));
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        }

        // 🌟 恢復簡單純粹的清單設計
        function createSuggestionItem(itemData, itemIndex, isHistoryLine) {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.dataset.url = itemData.url;
            div.dataset.label = itemData.label;
            
            // 簡單文字設計
            div.style.cssText = 'padding: 10px 14px; cursor: pointer; color: #333333; font-size: 15px; text-align: left; border-bottom: 1px solid #f0f4f1; background-color: #ffffff;';
            div.textContent = itemData.label;

            div.addEventListener('mouseenter', () => {
                if (isKeyboardNav) return; 
                currentFocus = itemIndex;
                addActive(suggestionsBox.querySelectorAll('.suggestion-item'));
            });

            div.addEventListener('mousedown', (e) => {
                e.preventDefault(); 
                saveHistory(itemData.label, itemData.url);
                searchInput.value = ''; // 點擊時清空
                suggestionsBox.style.display = 'none';
                window.location.href = itemData.url;
            });

            suggestionsBox.appendChild(div);
        }

        // 🌟 修正鍵盤控制，過濾 Shift/Ctrl/Alt 等功能鍵的干擾
        searchInput.addEventListener('keydown', function (e) {
            
            // 如果按下的是 Shift, Ctrl, Alt 等，直接略過，不干擾選單
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
                // 如果是在注音組字中，絕對不要觸發搜尋跳轉
                if (isComposing) return;
                
                e.preventDefault(); // 防止表單亂送

                if (isMenuOpen && currentFocus > -1 && items[currentFocus]) {
                    items[currentFocus].dispatchEvent(new Event('mousedown'));
                } else if (isMenuOpen && items.length > 0) {
                    items[0].dispatchEvent(new Event('mousedown'));
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
            activeItem.style.backgroundColor = '#e0f0e8'; // 恢復原本的淺綠色反白
            activeItem.style.fontWeight = 'bold';
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // 阻擋幽靈點擊
        document.addEventListener('click', (e) => {
            if (!e.isTrusted) return; 

            if (!e.target.closest('.searchBar')) {
                suggestionsBox.style.display = 'none';
            }
        });

        searchBtn.addEventListener('click', function () {
            const rawValue = searchInput.value.trim().toLowerCase();
            if (rawValue === "") return alert("請輸入搜尋內容");

            const match = searchDatabase.find(item =>
                item.label.toLowerCase().includes(rawValue) ||
                item.keywords.toLowerCase().includes(rawValue)
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
