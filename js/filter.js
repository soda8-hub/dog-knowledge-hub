document.addEventListener("DOMContentLoaded", () => {
    const filterBtns = document.querySelectorAll(".filter-pill");
    const items = document.querySelectorAll("#list li");

    // 🌟 新增：為每一個篩選出來的狗狗項目加上點擊跳轉事件
    items.forEach(item => {
        // 加入 pointer 樣式讓使用者知道可以點擊
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', function() {
            // 取得該 <li> 的文字內容 (例如 "黃金獵犬")
            const dogName = this.textContent.trim();
            // 組合跳轉網址，帶入 focus 參數觸發目標頁面的動畫
            window.location.href = `breeds.html?focus=${dogName}`;
        });
    });

    filterBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            //取得這顆按鈕屬於哪一個群組 (size, hair, 或 personality)
            const group = this.dataset.group;

            //把同群組裡面的其他按鈕反白(移除 active)
            document.querySelectorAll(`.filter-pill[data-group="${group}"]`)
                .forEach(b => b.classList.remove("active"));

            //把現在點擊的這顆按鈕變色 (加上 active)
            this.classList.add("active");

            //執行交叉篩選
            applyFilters();
        });
    });

    function applyFilters() {
        //抓出目前三個層級被選中的值
        const activeSize = document.querySelector('.filter-pill[data-group="size"].active').dataset.value;
        const activeHair = document.querySelector('.filter-pill[data-group="hair"].active').dataset.value;
        const activePersonality = document.querySelector('.filter-pill[data-group="personality"].active').dataset.value;

        let visibleCount = 0;

        items.forEach(item => {
            //檢查卡片是否符合條件（如果是 'all' 就等於無條件通過）
            const sizeMatch = (activeSize === 'all' || item.dataset.size === activeSize);
            const hairMatch = (activeHair === 'all' || item.dataset.hair === activeHair);
            const personalityMatch = (activePersonality === 'all' || item.dataset.personality === activePersonality);

            //必須同時符合三個層級的條件才會顯示 (AND 邏輯)
            if (sizeMatch && hairMatch && personalityMatch) {
                item.style.display = "list-item";
                visibleCount++;
            } else {
                item.style.display = "none";
            }
        });

    }
});
