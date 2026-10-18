// ==========================================
// 1. 初始化 Supabase 用戶端 (變數改名為 supabaseClient 避免衝突)
// ==========================================
const supabaseUrl = 'https://lgmldvqahmldeiqnghxx.supabase.co';
const supabaseKey = 'sb_publishable_mOxugRr-BiPlt2zujAvqeA_W3x7IwN1';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. 抓取 DOM 元素
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 按鈕與彈窗
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    
    // 步驟區塊
    const step1 = document.getElementById('step1-login');
    const step2 = document.getElementById('step2-verify');
    const step3 = document.getElementById('step3-profile');
    
    // 步驟一：登入/註冊
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    
    // 步驟二：驗證碼
    const otpCode = document.getElementById('otpCode');
    const verifyLoginBtn = document.getElementById('verifyLoginBtn');
    
    // 步驟三：個人檔案
    const profileNickname = document.getElementById('profileNickname');
    const randomNameBtn = document.getElementById('randomNameBtn');
    const statusNoPet = document.getElementById('statusNoPet');
    const statusHasPet = document.getElementById('statusHasPet');
    const petSelectorArea = document.getElementById('petSelectorArea');
    const petList = document.getElementById('petList');
    const addPetBtn = document.getElementById('addPetBtn');
    const finishProfileBtn = document.getElementById('finishProfileBtn');

    // 狀態變數
    let currentUser = null;
    let isNewUser = false;

    // ==========================================
    // 3. 監聽登入狀態改變 (Header 連動)
    // ==========================================
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            currentUser = session.user;
            // 去資料庫抓取使用者的暱稱
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('nickname, has_pet')
                .eq('id', currentUser.id)
                .single();
            
            if (data) {
                const badge = data.has_pet ? '🐾' : '🌱';
                loginBtnText.textContent = `${badge} ${data.nickname} ▾`;
                isNewUser = (data.nickname === '毛孩好朋友'); // 判斷是否為剛註冊的預設狀態
            }
        } else {
            currentUser = null;
            loginBtnText.textContent = '👤 登入 / 註冊';
        }
    });

    // ==========================================
    // 4. 彈窗控制邏輯
    // ==========================================
    loginBtn.addEventListener('click', () => {
        if (currentUser) {
            if(confirm("您已經登入，是否要登出？")) {
                supabaseClient.auth.signOut();
                alert("已成功登出！");
            }
            return;
        }
        authModal.style.display = 'flex';
        step1.style.display = 'block';
        step2.style.display = 'none';
        step3.style.display = 'none';
    });

    closeModal.addEventListener('click', () => authModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.style.display = 'none';
    });

    // ==========================================
    // 5. 步驟一：送出帳密 (真實連接 Supabase)
    // ==========================================
    sendCodeBtn.addEventListener('click', async () => {
        const email = authEmail.value;
        const password = authPassword.value;
        if (!email || password.length < 6) {
            alert("請輸入有效的 Email 與至少 6 碼密碼！");
            return;
        }

        sendCodeBtn.textContent = '連線中...';
        sendCodeBtn.disabled = true;

        // 嘗試登入
        let { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        
        // 如果登入失敗(找不到帳號)，則自動嘗試註冊
        if (error && error.message.includes("Invalid login")) {
            const signupRes = await supabaseClient.auth.signUp({ email, password });
            error = signupRes.error;
            data = signupRes.data;
        }

        sendCodeBtn.textContent = '下一步 (獲取驗證碼)';
        sendCodeBtn.disabled = false;

        if (error) {
            alert(`發生錯誤：${error.message}`);
        } else {
            // 登入/註冊成功，進入模擬驗證碼流程
            alert(`[系統展示模式]\n已發送驗證碼至 ${email}\n\n您的驗證碼為：882520\n(請於 60 秒內輸入)`);
            step1.style.display = 'none';
            step2.style.display = 'block';
        }
    });

    // ==========================================
    // 6. 步驟二：模擬驗證碼核對
    // ==========================================
    verifyLoginBtn.addEventListener('click', () => {
        if (otpCode.value === '882520') {
            if (isNewUser) {
                step2.style.display = 'none';
                step3.style.display = 'block';
            } else {
                alert("歡迎回來！");
                authModal.style.display = 'none';
            }
        } else {
            alert("驗證碼錯誤，請輸入 882520");
        }
    });

    // ==========================================
    // 7. 步驟三：新手個人檔案設定 UX (智慧情境版)
    // ==========================================
    randomNameBtn.addEventListener('click', () => {
        let baseName = "毛孩"; // 預設核心詞

        if (hasPet) {
            // 如果有養寵物，去抓第一隻選擇的品種
            const firstBreedSelect = document.querySelector('.pet-breed');
            if (firstBreedSelect && firstBreedSelect.value !== "其他") {
                baseName = firstBreedSelect.value; // 例如變成 "柴犬" 或 "柯基犬"
            }
        } else {
            // 如果選擇還沒養，給予專屬核心詞
            baseName = "汪星人"; 
        }

        // 隨機前綴與後綴詞庫
        const prefixes = ['奔跑的', '可愛的', '調皮的', '霸氣', '新手', '熱愛', '迷茫的'];
        const suffixes = ['小隊長', '拔拔', '麻麻', '奴才', '守護者', '探險家', '好朋友'];
        
        // 隨機抽取
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        // 組合字串，例如：「奔跑的柴犬小隊長」或「新手汪星人拔拔」
        profileNickname.value = `${prefix}${baseName}${suffix}`;
    });

    // ==========================================
    // 8. 最終寫入資料庫
    // ==========================================
    finishProfileBtn.addEventListener('click', async () => {
        finishProfileBtn.textContent = '儲存中...';
        finishProfileBtn.disabled = true;

        const nickname = profileNickname.value;

        await supabaseClient
            .from('profiles')
            .update({ nickname: nickname, has_pet: hasPet })
            .eq('id', currentUser.id);

        if (hasPet) {
            const petRows = document.querySelectorAll('.pet-row');
            const petData = [];
            petRows.forEach(row => {
                const breed = row.querySelector('.pet-breed').value;
                const count = row.querySelector('.pet-count').value;
                petData.push({
                    user_id: currentUser.id,
                    breed: breed,
                    count: parseInt(count)
                });
            });
            await supabaseClient.from('user_pets').insert(petData);
        }

        alert("設定完成！您的身分證已生效，馬上前往討論區吧！");
        authModal.style.display = 'none';
        window.location.reload(); 
    });
});
