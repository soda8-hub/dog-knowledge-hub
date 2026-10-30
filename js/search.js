// 當按「上一頁」返回首頁時，自動清空搜尋欄與選單
window.addEventListener('pageshow', function () {
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('searchSuggestions');
    if (searchInput) searchInput.value = '';
    if (suggestionsBox) suggestionsBox.style.display = 'none';
});

window.addEventListener('load', function () {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsBox = document.getElementById('searchSuggestions');

    // ✅ 用來追蹤目前鍵盤選到哪一個選項 (-1 代表沒有選取)
    let currentFocus = -1;

    // 加上 relative 定位
    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
    }

    // 🌟 關鍵字對應表 (豐富化八大分類內容，並支援 ?focus= 指定位置跳轉)
    const searchMap = [
        // 1. 品種 (breeds.html)
        { keywords: ["品種", "犬種", "常見犬種"], url: "breeds.html" },
        { keywords: ["大型犬"], url: "breeds.html?focus=大型犬" },
        { keywords: ["中型犬"], url: "breeds.html?focus=中型犬" },
        { keywords: ["小型犬"], url: "breeds.html?focus=小型犬" },
        { keywords: ["黃金獵犬", "愛游泳", "眼瞼內翻", "髖關節發育不良"], url: "breeds.html?focus=黃金獵犬" },
        { keywords: ["拉布拉多", "拉不拉多", "貪吃", "POMC基因", "控食避免肥胖"], url: "breeds.html?focus=拉布拉多" },
        { keywords: ["哈士奇", "愛嚎叫", "怕熱", "遺傳性白內障", "眼睛渾濁"], url: "breeds.html?focus=哈士奇" },
        { keywords: ["德國牧羊犬", "警犬", "警覺性", "退化性脊髓病", "胃扭轉"], url: "breeds.html?focus=德國牧羊犬" },
        { keywords: ["台灣土狗", "立耳", "適應力強", "台灣氣候"], url: "breeds.html?focus=台灣土狗" },
        { keywords: ["柴犬", "過敏", "膝蓋骨脫臼"], url: "breeds.html?focus=柴犬" },
        { keywords: ["法國鬥牛犬", "法鬥", "呼吸系統脆弱", "不耐冷熱", "預防中暑"], url: "breeds.html?focus=法國鬥牛犬" },
        { keywords: ["柯基犬", "柯基", "椎間盤疾病", "尿道結石"], url: "breeds.html?focus=柯基犬" },
        { keywords: ["邊境牧羊犬", "邊牧", "世界最聰明", "精力旺盛", "牧羊犬眼異常", "癲癇"], url: "breeds.html?focus=邊境牧羊犬" },
        { keywords: ["博美", "氣管脆弱", "牙結石與口臭"], url: "breeds.html?focus=博美" },
        { keywords: ["吉娃娃", "代謝快", "耐寒力差", "穿衣保暖"], url: "breeds.html?focus=吉娃娃" },
        { keywords: ["貴賓犬", "聰明易訓練", "漸進性視網膜萎縮"], url: "breeds.html?focus=貴賓犬" },
        { keywords: ["比熊犬", "毛捲親人", "腸胃敏感", "膀胱感染", "青光眼"], url: "breeds.html?focus=比熊犬" },

        // 2. 醫療與飲食 (medical.html)
        { keywords: ["醫療", "飲食", "醫療與飲食"], url: "medical.html" },
        { keywords: ["預防保健", "疫苗接種", "核心疫苗", "犬瘟熱", "狂犬病", "基礎疫苗"], url: "medical.html?focus=疫苗接種" },
        { keywords: ["寄生蟲預防", "體內外驅蟲", "心絲蟲", "跳蚤", "壁蝨"], url: "medical.html?focus=寄生蟲預防" },
        { keywords: ["牙齒保健", "牙周病", "洗牙"], url: "medical.html?focus=牙齒保健" },
        { keywords: ["定期健康檢查", "健康檢查", "血液檢查", "超音波", "X光"], url: "medical.html?focus=定期健康檢查" },
        { keywords: ["醫療警訊", "緊急症狀", "劇烈嘔吐", "腹瀉帶血", "呼吸困難", "抽搐"], url: "medical.html?focus=醫療警訊" },
        { keywords: ["絕對不能吃", "中毒食材", "飲食禁忌"], url: "medical.html?focus=絕對不能吃" },
        { keywords: ["巧克力", "可可鹼", "茶鹼"], url: "medical.html?focus=巧克力" },
        { keywords: ["葡萄", "葡萄乾", "急性腎衰竭"], url: "medical.html?focus=葡萄與葡萄乾" },
        { keywords: ["木糖醇", "花生醬", "口香糖", "損壞肝臟"], url: "medical.html?focus=木糖醇" },
        { keywords: ["蔥類植物", "洋蔥", "大蒜", "韭菜", "溶血性貧血"], url: "medical.html?focus=蔥類植物" },
        { keywords: ["高風險食物", "熟骨頭", "雞骨頭", "腸胃道刺傷"], url: "medical.html?focus=熟骨頭" },
        { keywords: ["生食", "生肉", "沙門氏菌"], url: "medical.html?focus=生食" },
        { keywords: ["咖啡因", "酒精", "辛辣物"], url: "medical.html?focus=咖啡因" },
        { keywords: ["寵物晶片", "晶片登記"], url: "medical.html?focus=寵物晶片" },
        { keywords: ["結紮", "絕育手術", "子宮蓄膿", "乳腺腫瘤", "睪丸癌"], url: "medical.html?focus=結紮" },
        { keywords: ["寵物保險", "醫療險"], url: "medical.html?focus=寵物保險" },

        // 3. 飼料食物 (food.html)
        { keywords: ["飼料", "食物", "飼料食物", "主食"], url: "food.html" },
        { keywords: ["乾飼料", "乾糧"], url: "food.html?focus=乾飼料" },
        { keywords: ["濕食", "罐頭", "主食罐", "副食罐", "鮮食包", "補充水分"], url: "food.html?focus=濕食" },
        { keywords: ["自製鮮食", "鮮食", "水煮肉"], url: "food.html?focus=自製鮮食" },
        { keywords: ["安全的人類食物", "狗狗能吃的水果", "狗狗能吃的蔬菜"], url: "food.html?focus=安全的人類食物" },
        { keywords: ["雞胸肉", "牛肉", "鮭魚", "熟蛋黃", "無糖優格"], url: "food.html?focus=雞胸肉" },
        { keywords: ["南瓜", "地瓜", "紅蘿蔔", "花椰菜", "小黃瓜"], url: "food.html?focus=南瓜" },
        { keywords: ["蘋果", "藍莓", "香蕉", "西瓜"], url: "food.html?focus=蘋果" },
        { keywords: ["挑選飼料", "AAFCO", "無穀飼料", "飼料保存"], url: "food.html?focus=挑選與保存" },

        // 4. 狗狗行為 (behavior.html)
        { keywords: ["狗狗", "行為", "狗狗行為", "肢體語言"], url: "behavior.html" },
        { keywords: ["吠叫語言", "吠叫", "叫聲"], url: "behavior.html?focus=吠叫語言" },
        { keywords: ["興奮吠叫", "高頻急促"], url: "behavior.html?focus=興奮吠叫" },
        { keywords: ["需求吠叫", "細小哀鳴"], url: "behavior.html?focus=需求吠叫" },
        { keywords: ["警戒吠叫", "低沉短促"], url: "behavior.html?focus=警戒吠叫" },
        { keywords: ["分離焦慮", "長嚎", "雷聲", "鞭炮"], url: "behavior.html?focus=分離焦慮" },
        { keywords: ["尾巴肢體語言", "搖尾巴", "大幅快速搖動", "螺旋狀快速旋轉"], url: "behavior.html?focus=大幅快速搖動" },
        { keywords: ["夾尾巴", "低垂夾在腿間", "恐懼與不安"], url: "behavior.html?focus=低垂夾在腿間" },
        { keywords: ["耳朵的訊號", "豎耳", "警覺偵測"], url: "behavior.html?focus=警覺偵測" },
        { keywords: ["飛機耳", "耳朵外展", "撒嬌示好", "打哈欠"], url: "behavior.html?focus=飛機耳" },
        { keywords: ["全身放鬆躺地", "露出肚皮", "翻肚皮"], url: "behavior.html?focus=全身放鬆躺地" },
        { keywords: ["身體向前傾", "邀玩"], url: "behavior.html?focus=身體向前傾" },
        { keywords: ["肌肉緊繃站立", "毛髮豎立", "威嚇"], url: "behavior.html?focus=肌肉緊繃站立" },
        { keywords: ["弓起身體靠地", "臣服"], url: "behavior.html?focus=弓起身體靠地" },
        { keywords: ["舔拭的意義", "表達愛意", "社交問候"], url: "behavior.html?focus=表達愛意" },
        { keywords: ["求饒示弱", "自我安撫", "過度舔拭"], url: "behavior.html?focus=自我安撫" },

        // 5. 年紀狀況 (age.html)
        { keywords: ["年紀", "狀況", "年紀狀況", "年齡換算", "壽命"], url: "age.html" },
        { keywords: ["幼犬", "幼犬期", "奶狗", "離乳期", "社會化黃金期", "換牙期"], url: "age.html?focus=幼犬期" },
        { keywords: ["成犬", "成犬期"], url: "age.html?focus=成犬期" },
        { keywords: ["熟齡犬", "老犬", "高齡犬", "老狗照護"], url: "age.html?focus=熟齡" },
        { keywords: ["高齡犬特別護理", "關節退化", "止滑墊", "認知障礙", "失智"], url: "age.html?focus=高齡犬特別護理" },

        // 6. 寵物用品 (supplies.html)
        { keywords: ["寵物", "用品", "寵物用品", "新手必備"], url: "supplies.html" },
        { keywords: ["外出散步", "胸背帶", "項圈", "牽繩"], url: "supplies.html?focus=外出散步" },
        { keywords: ["撿便袋", "隨身水壺", "外出籠", "運輸籠", "安全座椅"], url: "supplies.html?focus=外出籠" },
        { keywords: ["食碗", "水碗", "慢食碗", "流動飲水機", "飼料密封桶"], url: "supplies.html?focus=居家飲食" },
        { keywords: ["睡窩", "狗床", "睡墊", "圍欄", "尿布墊", "寵物濕紙巾"], url: "supplies.html?focus=睡窩與床墊" },
        { keywords: ["洗毛精", "針梳", "排梳", "寵物牙刷", "潔耳液", "指甲剪", "止血粉"], url: "supplies.html?focus=日常清潔與美容" },
        { keywords: ["玩具", "益智藏食玩具", "嗅聞墊", "磨牙玩具", "陪伴安撫娃娃"], url: "supplies.html?focus=娛樂與益智玩具" },

        // 7. 照顧方法 (care.html)
        { keywords: ["照顧", "方法", "照顧方法", "日常護理"], url: "care.html" },
        { keywords: ["洗澡", "吹毛", "洗澡頻率", "水溫控制"], url: "care.html?focus=洗澡" },
        { keywords: ["梳毛", "毛髮梳理", "換毛期"], url: "care.html?focus=毛髮梳理" },
        { keywords: ["清耳朵", "耳道清潔", "拔耳毛", "甩頭抓耳"], url: "care.html?focus=耳道清潔" },
        { keywords: ["剪指甲", "修剪指甲", "血線", "腳底毛", "肉球保養"], url: "care.html?focus=指甲" },
        { keywords: ["刷牙", "口腔清潔", "潔牙骨", "擠肛門腺", "磨屁股"], url: "care.html?focus=牙齒" },

        // 8. 運動 (exercise.html)
        { keywords: ["運動", "散步", "放電"], url: "exercise.html" },
        { keywords: ["運動量", "散步時間", "每日運動"], url: "exercise.html?focus=運動量" },
        { keywords: ["嗅聞散步", "慢跑", "你丟我撿", "接飛盤", "拔河遊戲"], url: "exercise.html?focus=嗅聞散步" },
        { keywords: ["游泳", "室內嗅聞", "雨天放電"], url: "exercise.html?focus=游泳" },
        { keywords: ["運動安全", "柏油路燙傷", "飯後運動禁忌"], url: "exercise.html?focus=安全須知" }
    ];

    // 展開並去除重複關鍵字
    const allKeywords = [...new Set(searchMap.flatMap(item => item.keywords))];

    if (searchBtn && searchInput && suggestionsBox) {

        // ==========================================
        // 1. 監聽打字事件 (動態產生選單)
        // ==========================================
        searchInput.addEventListener('input', function () {
            const query = searchInput.value.trim().toLowerCase();
            suggestionsBox.innerHTML = '';
            currentFocus = -1; // 每次重新打字，重置焦點

            if (query === '') {
                suggestionsBox.style.display = 'none';
                return;
            }

            const filtered = allKeywords.filter(keyword =>
                keyword.toLowerCase().includes(query)
            );

            if (filtered.length > 0) {
                filtered.forEach((keyword, index) => {
                    const item = document.createElement('div');
                    item.textContent = keyword;

                    // 基本樣式設定
                    item.style.padding = '8px 12px';
                    item.style.cursor = 'pointer';
                    item.style.color = '#333333';
                    item.style.fontSize = '14px';
                    item.style.textAlign = 'left';

                    // 滑鼠移入時，同步更新 currentFocus 讓鍵盤與滑鼠無縫接軌
                    item.addEventListener('mouseenter', () => {
                        currentFocus = index;
                        addActive(suggestionsBox.children);
                    });

                    // 點擊事件
                    item.addEventListener('click', function () {
                        searchInput.value = keyword;
                        suggestionsBox.style.display = 'none';
                        searchBtn.click();
                    });

                    suggestionsBox.appendChild(item);
                });
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        });

        // ==========================================
        // 2. 監聽鍵盤事件 (上下方向鍵反白、Enter送出)
        // ==========================================
        searchInput.addEventListener('keydown', function (e) {
            let items = suggestionsBox.getElementsByTagName('div');

            if (e.key === 'ArrowDown') {
                e.preventDefault(); // 防止游標亂跳
                // 往下按
                currentFocus++;
                addActive(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault(); // 防止游標亂跳
                // 往上按
                currentFocus--;
                addActive(items);
            } else if (e.key === 'Enter') {
                // 按下 Enter
                e.preventDefault(); // 避免送出表單的預設行為

                if (currentFocus > -1 && suggestionsBox.style.display === 'block') {
                    // 如果選單開著，且有反白選到某個選項，就模擬「點擊該選項」
                    if (items.length > 0 && items[currentFocus]) {
                        items[currentFocus].click();
                    }
                } else {
                    // 否則執行一般搜尋邏輯
                    suggestionsBox.style.display = 'none';
                    searchBtn.click();
                }
            }
        });

        // ==========================================
        // 3. 處理反白樣式的函數
        // ==========================================
        function addActive(items) {
            if (!items || items.length === 0) return false;

            // 先清除所有選項的反白
            removeActive(items);

            // 循環邏輯：到底部時回到最上面，在頂部往上按則到底部
            if (currentFocus >= items.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = items.length - 1;

            // 為當前焦點加上反白樣式 (你原本設定的淺綠色)
            items[currentFocus].style.backgroundColor = '#e0f0e8';

            // 🌟 貼心功能：當選項過多出現卷軸時，自動滾動讓反白的選項保持在視野內
            items[currentFocus].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function removeActive(items) {
            for (let i = 0; i < items.length; i++) {
                items[i].style.backgroundColor = 'white';
            }
        }

        // ==========================================
        // 4. 搜尋按鈕的跳轉邏輯 (優先精準比對，支援指定位置跳轉)
        // ==========================================
        searchBtn.addEventListener('click', function () {
            const query = searchInput.value.trim().toLowerCase();

            if (query === "") {
                alert("請輸入搜尋內容");
                return;
            }

            // 優先尋找完全相符的關鍵字，若無再尋找包含的關鍵字
            const exactMatch = searchMap.find(item =>
                item.keywords.some(keyword => keyword.toLowerCase() === query)
            );
            const partialMatch = searchMap.find(item =>
                item.keywords.some(keyword => keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase()))
            );
            const match = exactMatch || partialMatch;

            if (match) {
                // 匹配到了直接跳轉到該網頁與指定位置
                window.location.href = match.url;
            } else {
                alert("找不到相關網頁，請嘗試其他關鍵字（例如：品種、醫療、柯基、巧克力）");
            }
        });

        // 點擊搜尋欄以外區域時自動收起下拉選單
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.searchBar')) {
                suggestionsBox.style.display = 'none';
            }
        });
    }
});
