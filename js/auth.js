// ==========================================
// 1. 初始化 Supabase 用戶端 (變數改名為 supabaseClient 避免衝突)
// ==========================================
const supabaseUrl = 'https://lgmldvqahmldeiqnghxx.supabase.co';
const supabaseKey = 'sb_publishable_mOxugRr-BiPlt2zujAvqeA_W3x7IwN1';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. 抓取 DOM 元素與全域狀態宣告
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
    let hasPet = true;    // 預設為有養寵物
    let currentOtp = '';    // 用來儲存每次隨機產生的 6 位數

    // ==========================================
    // 3. 監聽登入狀態改變 (Header 連動)
    // ==========================================
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            currentUser = session.user;
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('nickname, has_pet')
                .eq('id', currentUser.id)
                .single();
            
            if (data) {
                const badge = data.has_pet ? '🐾' : '🌱';
                loginBtnText.textContent = `${badge} ${data.nickname} ▾`;
                isNewUser = (data.nickname === '毛孩好朋友'); 
            }
        } else {
            currentUser = null;
            loginBtnText.textContent = '👤 登入 / 註冊';
        }
    });

    // ==========================================
    // 4. 彈窗開啟與關閉邏輯
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

        let { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        
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
            // 🌟 產生一組 100000 到 999999 的隨機整數
            currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // 將動態產生的密碼放入提示框中
            alert(`[系統展示模式]\n已發送驗證碼至 ${email}\n\n您的驗證碼為：${currentOtp}\n(請於 60 秒內輸入)`);
            step1.style.display = 'none';
            step2.style.display = 'block';
        }
    });

    // ==========================================
    // 6. 步驟二：模擬驗證碼核對
    // ==========================================
    verifyLoginBtn.addEventListener('click', () => {
        if (otpCode.value === currentOtp) {
            if (isNewUser) {
                step2.style.display = 'none';
                step3.style.display = 'block';
            } else {
                alert("歡迎回來！");
                authModal.style.display = 'none';
                window.location.reload(); // 老手登入後直接重整畫面更新 Header
            }
        } else {
            alert("驗證碼錯誤，請重新輸入！");
        }
    });

    // ==========================================
    // 7. 步驟三：新手個人檔案設定 UX (智慧情境版)
    // ==========================================
    randomNameBtn.addEventListener('click', () => {
        let baseName = "毛孩"; 
        
        // 判斷是否有養寵物，並抓取第一個選擇的品種作為名字基底
        if (hasPet) {
            const firstBreedSelect = document.querySelector('.pet-breed');
            if (firstBreedSelect && firstBreedSelect.value !== "其他") {
                baseName = firstBreedSelect.value;
            }
        } else {
            baseName = "汪星人";
        }

        const prefixes = ['奔跑的', '可愛的', '調皮的', '霸氣', '新手', '熱愛', '迷茫的'];
        const suffixes = ['小隊長', '拔拔', '麻麻', '奴才', '守護者', '探險家', '好朋友'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        profileNickname.value = `${prefix}${baseName}${suffix}`;
    });

    // 飼養狀態按鈕切換
    statusNoPet.addEventListener('click', () => {
        statusNoPet.classList.add('active');
        statusHasPet.classList.remove('active');
        petSelectorArea.style.display = 'none';
        hasPet = false;
    });

    statusHasPet.addEventListener('click', () => {
        statusHasPet.classList.add('active');
        statusNoPet.classList.remove('active');
        petSelectorArea.style.display = 'block';
        hasPet = true;
    });

    // 新增其他品種按鈕
    addPetBtn.addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'pet-row';
        row.innerHTML = `
            <select class="pet-breed modal-input">
                <option value="柴犬">柴犬</option>
                <option value="黃金獵犬">黃金獵犬</option>
                <option value="柯基犬">柯基犬</option>
                <option value="台灣土狗">台灣土狗</option>
                <option value="貴賓犬">貴賓犬</option>
                <option value="米克斯">米克斯</option>
                <option value="其他">其他</option>
            </select>
            <input type="number" class="pet-count modal-input" value="1" min="1" max="10">
            <button class="remove-pet-btn" title="移除">🗑️</button>
        `;
        petList.appendChild(row);
        // 綁定動態產生的垃圾桶按鈕
        row.querySelector('.remove-pet-btn').addEventListener('click', () => row.remove());
    });

    // ==========================================
    // 8. 最終寫入資料庫
    // ==========================================
    finishProfileBtn.addEventListener('click', async () => {
        finishProfileBtn.textContent = '儲存中...';
        finishProfileBtn.disabled = true;

        const nickname = profileNickname.value;

        // 寫入 profiles
        await supabaseClient
            .from('profiles')
            .update({ nickname: nickname, has_pet: hasPet })
            .eq('id', currentUser.id);

        // 如果有養，寫入 user_pets
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
