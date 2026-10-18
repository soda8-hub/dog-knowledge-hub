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
    // 按鈕與彈窗 DOM
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    
    const step1 = document.getElementById('step1-login');
    const step2 = document.getElementById('step2-verify');
    const step3 = document.getElementById('step3-profile');
    
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    
    const otpCode = document.getElementById('otpCode');
    const verifyLoginBtn = document.getElementById('verifyLoginBtn');
    
    const profileNickname = document.getElementById('profileNickname');
    const randomNameBtn = document.getElementById('randomNameBtn');
    const statusNoPet = document.getElementById('statusNoPet');
    const statusHasPet = document.getElementById('statusHasPet');
    const petSelectorArea = document.getElementById('petSelectorArea');
    const petList = document.getElementById('petList');
    const addPetBtn = document.getElementById('addPetBtn');
    const finishProfileBtn = document.getElementById('finishProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // 狀態變數
    let currentUser = null;
    let isNewUser = false;
    let hasPet = true; 
    let currentOtp = ''; // 儲存動態生成的 6 碼驗證碼

    // ==========================================
    // 3. 建置 15 種狗狗的下拉選單 HTML 模板 (含 optgroup)
    // ==========================================
    const breedOptionsHTML = `
        <optgroup label="大型犬">
            <option value="黃金獵犬">黃金獵犬</option>
            <option value="拉不拉多">拉不拉多</option>
            <option value="哈士奇">哈士奇</option>
            <option value="德國牧羊犬">德國牧羊犬</option>
            <option value="台灣土狗">台灣土狗</option>
        </optgroup>
        <optgroup label="中型犬">
            <option value="柴犬" selected>柴犬</option>
            <option value="法國鬥牛犬">法國鬥牛犬</option>
            <option value="柯基犬">柯基犬</option>
            <option value="邊境牧羊犬">邊境牧羊犬</option>
        </optgroup>
        <optgroup label="小型犬">
            <option value="吉娃娃">吉娃娃</option>
            <option value="博美">博美</option>
            <option value="貴賓犬">貴賓犬</option>
            <option value="比熊犬">比熊犬</option>
        </optgroup>
        <optgroup label="其他">
            <option value="米克斯">米克斯</option>
            <option value="其他">其他 (自行輸入)</option>
        </optgroup>
    `;

    // 生成單一寵物設定列的函數
    function createPetRow() {
        const row = document.createElement('div');
        row.className = 'pet-row';
        row.innerHTML = `
            <div class="pet-inputs">
                <select class="pet-breed modal-input">${breedOptionsHTML}</select>
                <input type="number" class="pet-count modal-input" value="1" min="1" max="10" title="數量">
            </div>
            <button class="remove-pet-btn" title="移除">🗑️</button>
            <input type="text" class="other-breed-input modal-input" style="display:none;" placeholder="請輸入狗狗品種 (如: 臘腸犬)">
        `;

        const select = row.querySelector('.pet-breed');
        const otherInput = row.querySelector('.other-breed-input');

        // 監聽下拉選單，如果選「其他」就顯示自訂輸入框
        select.addEventListener('change', (e) => {
            if(e.target.value === '其他') {
                otherInput.style.display = 'block';
                otherInput.focus();
            } else {
                otherInput.style.display = 'none';
                otherInput.value = '';
            }
        });

        row.querySelector('.remove-pet-btn').addEventListener('click', () => row.remove());
        return row;
    }

    // 當從資料庫撈取寵物資料 (data) 後，動態生成寵物列表的迴圈內：
data.forEach(pet => {
    const row = document.createElement('div');
    row.className = 'pet-row';
    row.innerHTML = `
        <select class="pet-breed modal-input">
            <!-- ... 你的 15 個品種選項 ... -->
            <option value="其他">其他 (自行輸入)</option>
        </select>
        <input type="text" class="custom-breed-input modal-input" placeholder="請輸入品種" style="display: none;">
        <input type="number" class="pet-count modal-input" value="1" min="1" max="10">
        <button class="remove-pet-btn" title="移除">🗑️</button>
    `;
    petList.appendChild(row);

    const selectEl = row.querySelector('.pet-breed');
    const customInputEl = row.querySelector('.custom-breed-input');
    const countEl = row.querySelector('.pet-count');

    // 🌟 智慧判斷：檢查該品種是否在預設的 select 選項中
    const optionExists = Array.from(selectEl.options).some(opt => opt.value === pet.breed);
    
    if (optionExists) {
        selectEl.value = pet.breed; // 是標準品種，直接選取
    } else {
        selectEl.value = "其他"; // 不在清單內，選取「其他」
        customInputEl.style.display = "block"; // 顯示自填框
        customInputEl.value = pet.breed; // 填入自填的品種 (例如: 臘腸狗)
    }
    countEl.value = pet.count;
    
    // ... 綁定移除按鈕與切換監聽器 ...
});

    // 初始化：清空列表並加入第一列
    petList.innerHTML = '';
    petList.appendChild(createPetRow());

    // ==========================================
    // 4. 監聽登入狀態改變 (Header 連動)
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
                profileNickname.value = data.nickname; // 將現有暱稱填入修改框
            }
        } else {
            currentUser = null;
            loginBtnText.textContent = '👤 登入 / 註冊';
        }
    });

    // ==========================================
    // 5. Enter 鍵觸發送出功能
    // ==========================================
    const triggerClickOnEnter = (inputElement, buttonElement) => {
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                buttonElement.click();
            }
        });
    };
    triggerClickOnEnter(authEmail, sendCodeBtn);
    triggerClickOnEnter(authPassword, sendCodeBtn);
    triggerClickOnEnter(otpCode, verifyLoginBtn);

    // ==========================================
    // 6. 彈窗開啟與關閉邏輯 (包含修改檔案)
    // ==========================================
    loginBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
        if (currentUser) {
            // 已登入：直接打開步驟三（修改檔案模式）
            step1.style.display = 'none';
            step2.style.display = 'none';
            step3.style.display = 'block';
        } else {
            // 未登入：打開步驟一
            step1.style.display = 'block';
            step2.style.display = 'none';
            step3.style.display = 'none';
        }
    });

    closeModal.addEventListener('click', () => authModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.style.display = 'none';
    });

    // ==========================================
    // 7. 步驟一：送出帳密
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
            // 隨機產生 6 位數
            currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
            alert(`[系統展示模式]\n已發送驗證碼至 ${email}\n\n您的動態驗證碼為：${currentOtp}\n(請於 60 秒內輸入)`);
            step1.style.display = 'none';
            step2.style.display = 'block';
            setTimeout(() => otpCode.focus(), 100); // 自動聚焦
        }
    });

    // ==========================================
    // 8. 步驟二：模擬驗證碼核對
    // ==========================================
    verifyLoginBtn.addEventListener('click', () => {
        if (otpCode.value === currentOtp) {
            if (isNewUser) {
                step2.style.display = 'none';
                step3.style.display = 'block';
            } else {
                alert("歡迎回來！");
                authModal.style.display = 'none';
                window.location.reload(); 
            }
        } else {
            alert("驗證碼錯誤，請重新確認！");
        }
    });

    // ==========================================
    // 9. 步驟三：多寵物暱稱產生器與狀態切換
    // ==========================================
    randomNameBtn.addEventListener('click', () => {
        let baseName = "毛孩"; 
        
        if (hasPet) {
            const petRows = document.querySelectorAll('.pet-row');
            const selectedBreeds = [];
            
            // 收集所有填寫的品種
            petRows.forEach(row => {
                let val = row.querySelector('.pet-breed').value;
                if(val === '其他') {
                    val = row.querySelector('.other-breed-input').value.trim() || '神秘狗狗';
                }
                if(val && !selectedBreeds.includes(val)) {
                    selectedBreeds.push(val);
                }
            });

            // 判斷品種數量決定名稱結構
            if (selectedBreeds.length === 1) {
                baseName = selectedBreeds[0];
            } else if (selectedBreeds.length === 2) {
                baseName = `${selectedBreeds[0]}與${selectedBreeds[1]}`;
            } else if (selectedBreeds.length >= 3) {
                baseName = `${selectedBreeds[0]}等毛孩`;
            } else {
                baseName = "汪星人";
            }
        } else {
            baseName = "新手";
        }

        const prefixes = ['奔跑的', '可愛的', '調皮的', '霸氣', '資深的', '熱愛', '迷茫的', '開心的'];
        const suffixes = ['小隊長', '拔拔', '麻麻', '奴才', '守護者', '探險家', '好朋友', '鏟屎官'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        profileNickname.value = `${prefix}${baseName}${suffix}`;
    });

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

    addPetBtn.addEventListener('click', () => {
        petList.appendChild(createPetRow());
    });

    // ==========================================
    // 10. 最終寫入資料庫與登出功能
    // ==========================================
    finishProfileBtn.addEventListener('click', async () => {
        finishProfileBtn.textContent = '儲存中...';
        finishProfileBtn.disabled = true;

        const nickname = profileNickname.value;

        // 更新個人檔案
        await supabaseClient
            .from('profiles')
            .update({ nickname: nickname, has_pet: hasPet })
            .eq('id', currentUser.id);

        // 先刪除舊寵物資料 (支援事後修改功能)
        await supabaseClient.from('user_pets').delete().eq('user_id', currentUser.id);

        if (hasPet) {
            const petRows = document.querySelectorAll('.pet-row');
            const petData = [];
            petRows.forEach(row => {
                let breed = row.querySelector('.pet-breed').value;
                if (breed === '其他') {
                    breed = row.querySelector('.other-breed-input').value.trim() || '未命名品種';
                }
                const count = row.querySelector('.pet-count').value;
                petData.push({
                    user_id: currentUser.id,
                    breed: breed,
                    count: parseInt(count)
                });
            });
            if(petData.length > 0) {
                await supabaseClient.from('user_pets').insert(petData);
            }
        }

        alert("設定儲存成功！");
        authModal.style.display = 'none';
        window.location.reload(); 
    });

    logoutBtn.addEventListener('click', async () => {
        if(confirm("確定要登出帳號嗎？")) {
            await supabaseClient.auth.signOut();
            alert("已成功登出！");
            window.location.reload();
        }
    });
});

// ==========================================
    // 11. 危險操作：註銷帳號 (Delete Account)
    // ==========================================
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', async () => {
            // 雙重確認機制，防止誤觸
            const confirm1 = confirm("⚠️ 警告：您確定要註銷帳號嗎？\n這將會刪除您的個人檔案與寵物資料。");
            if (confirm1) {
                const confirm2 = confirm("資料刪除後將無法復原，請再次確認是否繼續？");
                if (confirm2) {
                    deleteAccountBtn.textContent = "刪除中...";
                    deleteAccountBtn.disabled = true;

                    // 呼叫我們剛才在 Supabase 建立的 SQL 函數
                    const { error } = await supabaseClient.rpc('delete_my_account');
                    
                    if (error) {
                        alert("註銷失敗：" + error.message);
                        deleteAccountBtn.textContent = "危險操作：註銷並刪除我的帳戶資料";
                        deleteAccountBtn.disabled = false;
                    } else {
                        // 刪除成功後，清除前端登入狀態並重整
                        await supabaseClient.auth.signOut();
                        alert("您的帳戶與相關資料已徹底刪除。期待您未來再次加入！");
                        window.location.reload();
                    }
                }
            }
        });
    }
