window.addEventListener('load', function () {

    const searchInput = document.getElementById('searchInput');

    const searchBtn = document.getElementById('searchBtn');

    const suggestionsBox = document.getElementById('searchSuggestions');



    // ✅ 新增：用來追蹤目前鍵盤選到哪一個選項 (-1 代表沒有選取)

    let currentFocus = -1; 



    // 加上 relative 定位

    if (searchInput) {

        searchInput.parentElement.style.position = 'relative';

    }



    // 關鍵字對應表

    const searchMap = [

        { keywords: ["品種", "黃金獵犬", "拉不拉多", "哈士奇", "德國牧羊犬", "台灣土狗", "柴犬", "法國鬥牛犬", "柯基犬", "邊境牧羊犬", "吉娃娃", "博美", "貴賓犬", "比熊犬"], url: "breeds.html" },

        { keywords: ["醫療", "飲食"], url: "medical.html" },

        { keywords: ["飼料", "食物"], url: "food.html" },

        { keywords: ["狗狗", "行為"], url: "behavior.html" },

        { keywords: ["年紀", "狀況"], url: "age.html" },

        { keywords: ["寵物", "用品"], url: "supplies.html" },

        { keywords: ["照顧", "方法"], url: "care.html" },

        { keywords: ["運動"], url: "exercise.html" }

    ];



    const allKeywords = searchMap.flatMap(item => item.keywords);



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

                // 往下按

                currentFocus++;

                addActive(items);

            } else if (e.key === 'ArrowUp') {

                // 往上按

                currentFocus--;

                addActive(items);

            } else if (e.key === 'Enter') {

                // 按下 Enter

                e.preventDefault(); // 避免送出表單的預設行為

                

                if (currentFocus > -1 && suggestionsBox.style.display === 'block') {

                    // 如果選單開著，且有反白選到某個選項，就模擬「點擊該選項」

                    if (items.length > 0) {

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

        // 4. 搜尋按鈕的跳轉邏輯

        // ==========================================

        searchBtn.addEventListener('click', function () {

            const query = searchInput.value.trim().toLowerCase();



            if (query === "") {

                alert("請輸入搜尋內容");

                return;

            }



            // 檢查關鍵字包含使用者輸入的字

            const match = searchMap.find(item =>

                item.keywords.some(keyword => keyword.toLowerCase().includes(query))

            );



            if (match) {

                // 匹配到了直接跳轉到該網頁

                window.location.href = match.url;

            } else {

                alert("找不到相關網頁，請嘗試其他關鍵字（例如：品種、醫療）");

            }

        });

    }

}); 
