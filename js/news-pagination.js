document.addEventListener("DOMContentLoaded", () => {
    //準備新聞資料 (共 16 則)
    const newsData = [
        { title: "國家地理雜誌：狗是怎麼成為人類最好的朋友的？", url: "https://www.natgeomedia.com/history/article/content-19025.html" },
        { title: "找到最佳玩伴！內向博美犬每日跟割草機散步畫面逗趣", url: "https://www.bastillepost.com/hongkong/article/16035336-%E6%89%BE%E5%88%B0%E6%9C%80%E4%BD%B3%E7%8E%A9%E4%BC%B4-%E5%85%A7%E5%90%91%E5%8D%9A%E7%BE%8E%E7%8A%AC%E6%AF%8F%E6%97%A5%E8%B7%9F%E5%89%B2%E8%8D%89%E6%A9%9F%E5%BE%8C%E6%96%B9%E6%95%A3%E6%AD%A5%E7%95%AB" },
        { title: "寵物高齡化浪潮來襲！獸醫師提醒日常保健不可少", url: "https://n.yam.com/Article/20260519757537" },
        { title: "狗狗濕食需求升溫 尾巴丘推高含肉餐盒搶攻精緻市場", url: "https://www.yesmedia.com.tw/%E7%8B%97%E7%8B%97%E6%BF%95%E9%A3%9F%E9%9C%80%E6%B1%82%E5%8D%87%E6%BA%AB%E3%80%80%E5%B0%BE%E5%B7%B4%E4%B8%98%E6%8E%A8%E9%AB%98%E5%90%AB%E8%82%89%E9%A4%90%E7%9B%92%E6%90%B6%E6%94%BB%E7%B2%BE%E7%B7%BB/" },
        { title: "寵物魚油怎麼挑？獸醫揭秘狗狗關節與皮毛保養關鍵", url: "https://www.womenshealthmag.com/tw/pethealth/g60851901/pet-fish-oil/" },
        { title: "出門散步總是被毛孩暴衝拉著走？專家教你三招防暴衝訓練", url: "https://www.storm.mg/lifestyle/11118100" },
        { title: "別讓狗狗吃這些！10大常見致命食物清單大公開", url: "https://news.pchome.com.tw/pet/firenews/20260526/index-77976892625689341023.html" },
        { title: "狗狗一直舔腳掌怎麼辦？醫指可能與過敏或焦慮有關", url: "https://pets.udn.com/pets/story/124349/9499417" },
        { title: "大型犬壽命真的比較短？最新研究點出體型與老化的關係", url: "https://pets.udn.com/pets/story/124351/9519592" },
        { title: "幼犬社會化黃金期只有三個月！錯過恐造成分離焦慮", url: "https://pets.udn.com/pets/story/124350/9490623" },
        { title: "梅雨季來臨！毛孩居家防霉與皮膚護理大作戰", url: "https://pets.udn.com/pets/story/124350/9516565" },
        { title: "新北市推動寵物友善空間標章，百間餐廳與旅宿響應", url: "https://news.pchome.com.tw/pet/firenews/20260508/index-77822681444521341023.html" },
        { title: "狂犬病疫苗注射月起跑！動保處呼籲飼主按時帶愛犬施打", url: "https://news.ltn.com.tw/news/life/breakingnews/5436339" },
        { title: "科學家發現狗狗能聽懂特定詞彙，大腦反應類似人類", url: "https://news.pchome.com.tw/science/sunmedia/20260527/index-77984505720212329003.html" },
        { title: "臺北市動保處辦理狗狗行為訓練免費講座，歡迎報名", url: "https://www.gov.taipei/News_Content.aspx?n=D0042A87C2F0270A&s=16192F4C2E1E4B67" },
        { title: "帶狗搭車不再難！台鐵放寬寵物推車尺寸限制", url: "https://more-news.tw/618144/" }
    ];

    //設定分頁變數
    const itemsPerPage = 5; //一頁顯示 5 筆
    let currentPage = 1;    //預設在第一頁
    const totalPages = Math.ceil(newsData.length / itemsPerPage); //計算總頁數 (16/5 = 4頁)

    const newsListElement = document.getElementById("newsList");
    const paginationElement = document.getElementById("pagination");

    //渲染新聞列表的函數
    function renderNews(page) {
        newsListElement.innerHTML = ""; // 清空目前列表

        //計算這頁要顯示的資料範圍 (第一頁是 0~4，第二頁是 5~9)
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = newsData.slice(startIndex, endIndex);

        //產生列表的 HTML
        currentItems.forEach(item => {
            const li = document.createElement("li");
            // 使用 target="_blank" 確保點擊後會另開新分頁
            li.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>`;
            newsListElement.appendChild(li);
        });
    }

    //渲染分頁按鈕的函數
    function renderPagination() {
        paginationElement.innerHTML = ""; //清空按鈕

        //最前頁按鈕 (<<)
        const firstBtn = document.createElement("button");
        firstBtn.classList.add("page-btn");
        firstBtn.innerText = "最前頁";
        firstBtn.disabled = (currentPage === 1); // 如果在第一頁就反白不能點
        firstBtn.addEventListener("click", () => changePage(1));
        paginationElement.appendChild(firstBtn);

        //數字頁碼按鈕
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.classList.add("page-btn");
            pageBtn.innerText = i;

            if (i === currentPage) {
                pageBtn.classList.add("active"); // 目前頁碼套用深色樣式
            }

            pageBtn.addEventListener("click", () => changePage(i));
            paginationElement.appendChild(pageBtn);
        }

        //最末頁按鈕 (>>)
        const lastBtn = document.createElement("button");
        lastBtn.classList.add("page-btn");
        lastBtn.innerText = "最末頁";
        lastBtn.disabled = (currentPage === totalPages); // 如果在最後一頁就反白
        lastBtn.addEventListener("click", () => changePage(totalPages));
        paginationElement.appendChild(lastBtn);
    }

    //處理換頁動作的函數
    function changePage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderNews(currentPage);
        renderPagination();
    }

    //初始化執行 (網頁載入時立刻渲染第一頁)
    renderNews(currentPage);
    renderPagination();
});