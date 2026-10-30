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
    const togglePassword = document.getElementById('togglePassword'); // 🌟 新增：密碼眼睛圖示
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn'); 
    
    const otpCode = document.getElementById('otpCode');
    const verifyLoginBtn = document.getElementById('verifyLoginBtn');
    const backToLoginBtn = document.getElementById('backToLoginBtn'); // 🌟 新增補上：返回按鈕
    const otpTimerDisplay = document.getElementById('otpTimerDisplay'); // 🌟 新增：倒數計時顯示
    
    const profileNickname = document.getElementById('profileNickname');
    const randomNameBtn = document.getElementById('randomNameBtn');
    const statusNoPet = document.getElementById('statusNoPet');
    const statusHasPet = document.getElementById('statusHasPet');
    const petSelectorArea = document.getElementById('petSelectorArea');
    const petList = document.getElementById('petList');
    const addPetBtn = document.getElementById('addPetBtn');
    const finishProfileBtn = document.getElementById('finishProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn'); 

    // 狀態變數
    let currentUser = null;
    let isNewUser = false;
    let hasPet = true; 
    let currentOtp = ''; 
    let countdownInterval = null; // 🌟 新增：倒數計時器變數

// ==========================================
    // 🌟 密碼顯示/隱藏切換功能 (Font Awesome 版本)
    // ==========================================
    if (togglePassword && authPassword) {
        togglePassword.addEventListener('click', () => {
            const isMasked = authPassword.style.webkitTextSecurity === 'disc';
            if (isMasked) {
                // 顯示密碼
                authPassword.style.webkitTextSecurity = 'none';
                authPassword.style.textSecurity = 'none';
                // 替換為張眼圖示
                togglePassword.className = 'fas fa-eye';
                togglePassword.title = "隱藏密碼";
            } else {
                // 隱藏密碼
                authPassword.style.webkitTextSecurity = 'disc';
                authPassword.style.textSecurity = 'disc';
                // 替換為閉眼圖示
                togglePassword.className = 'fas fa-eye-slash';
                togglePassword.title = "顯示密碼";
            }
        });
    }

    // ==========================================
    // 🌟 倒數計時器邏輯
    // ==========================================
    function startOtpTimer(seconds) {
        clearInterval(countdownInterval); // 清除舊計時器
        let timeLeft = seconds;
        
        // 恢復驗證按鈕的可用狀態
        if (verifyLoginBtn) {
            verifyLoginBtn.disabled = false;
            verifyLoginBtn.textContent = "驗證並登入";
            verifyLoginBtn.style.opacity = "1";
            verifyLoginBtn.style.cursor = "pointer";
        }

        if (otpTimerDisplay) {
            otpTimerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;
            otpTimerDisplay.style.color = "#d9534f";
        }

        countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                if (otpTimerDisplay) otpTimerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;
            } else {
                clearInterval(countdownInterval);
                if (otpTimerDisplay) {
                    otpTimerDisplay.textContent = "驗證碼已失效，請返回上一步重新獲取";
                    otpTimerDisplay.style.color = "#999999";
                }
                // 停用驗證按鈕
                if (verifyLoginBtn) {
                    verifyLoginBtn.disabled = true;
                    verifyLoginBtn.textContent = "驗證碼已過期";
                    verifyLoginBtn.style.opacity = "0.5";
                    verifyLoginBtn.style.cursor = "not-allowed";
                }
            }
        }, 1000);
    }

    // ==========================================
    // 3. 建置下拉選單 HTML 模板與生成列函數
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
            <option value="柴犬">柴犬</option>
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
            <option value="其他">其他 (自行輸入)</option>
        </optgroup>
    `;

    function createPetRow(defaultBreed = '柴犬', defaultCount = 1) {
        const row = document.createElement('div');
        row.className = 'pet-row';
        row.style.display = 'flex';
        row.style.gap = '10px';
        row.style.marginBottom = '10px';
        
        row.innerHTML = `
            <select class="pet-breed modal-input" style="flex: 2; margin-bottom: 0;">${breedOptionsHTML}</select>
            <input type="text" class="other-breed-input modal-input" style="display:none; flex: 1.5; margin-bottom: 0;" placeholder="請輸入品種">
            <input type="number" class="pet-count modal-input" value="${defaultCount}" min="1" max="10" title="數量" style="flex: 1; margin-bottom: 0;">
            <button class="remove-pet-btn" title="移除" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #d9534f;">🗑️</button>
        `;

        const select = row.querySelector('.pet-breed');
        const otherInput = row.querySelector('.other-breed-input');

        const optionExists = Array.from(select.options).some(opt => opt.value === defaultBreed);
        if (optionExists) {
            select.value = defaultBreed; 
        } else {
            select.value = "其他"; 
            otherInput.style.display = 'block';
            otherInput.value = defaultBreed; 
        }

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

    // ==========================================
    // 4. 監聽登入狀態改變 (Header 連動)
    // ==========================================
    if (supabaseClient) {
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
                    if(loginBtnText) loginBtnText.textContent = `${badge} ${data.nickname} ▾`;
                    isNewUser = (data.nickname === '毛孩好朋友'); 
                }
            } else {
                currentUser = null;
                if(loginBtnText) loginBtnText.textContent = '👤 登入 / 註冊';
            }
        });
    }

    // ==========================================
    // 5. Enter 鍵觸發送出功能
    // ==========================================
    const triggerClickOnEnter = (inputElement, buttonElement) => {
        if (!inputElement || !buttonElement) return;
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
    // 6. 彈窗開啟與關閉邏輯
    // ==========================================
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            authModal.style.display = 'flex';
            
            if (currentUser) {
                step1.style.display = 'none';
                step2.style.display = 'none';
                step3.style.display = 'block';

                const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', currentUser.id).single();
                if(profile) {
                    profileNickname.value = profile.nickname;
                    hasPet = profile.has_pet;
                    if(hasPet) {
                        statusHasPet.classList.add('active');
                        statusNoPet.classList.remove('active');
                        petSelectorArea.style.display = 'block';
                    } else {
                        statusNoPet.classList.add('active');
                        statusHasPet.classList.remove('active');
                        petSelectorArea.style.display = 'none';
                    }
                }

                petList.innerHTML = ''; 
                const { data: pets } = await supabaseClient.from('user_pets').select('*').eq('user_id', currentUser.id);
                if (pets && pets.length > 0) {
                    pets.forEach(pet => petList.appendChild(createPetRow(pet.breed, pet.count)));
                } else if (hasPet) {
                    petList.appendChild(createPetRow()); 
                }
            } else {
                step1.style.display = 'block';
                step2.style.display = 'none';
                step3.style.display = 'none';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            authModal.style.display = 'none';
            clearInterval(countdownInterval); // 🌟 關閉彈窗時停止計時
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            clearInterval(countdownInterval); // 🌟 點擊空白處關閉彈窗時停止計時
        }
    });

    // ==========================================
    // 7. 步驟一：送出帳密 (嚴謹 Email 驗證與貼心防呆)
    // ==========================================
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', async () => {
            // 🌟 將 const 改為 let，允許我們在防呆機制中自動替換修正後的信箱
            let email = authEmail.value.trim().toLowerCase(); 
            const password = authPassword.value;

            // 嚴謹的 Email 格式正則表達式
            const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

            if (!email) {
                alert("信箱欄位不能是空的喔！請輸入您的 Email。");
                return;
            }
            
            if (!strictEmailRegex.test(email)) {
                alert("信箱格式錯誤！請輸入完整且正確的電子郵件地址（例如：yourname@gmail.com）。\n請注意不要有空格或特殊字元。");
                return;
            }

            // ==========================================
            // 🌟 UX 升級版：各大常見信箱錯別字溫和提示與自動校正
            // ==========================================
            const emailParts = email.split('@');
            if (emailParts.length === 2) {
                const domain = emailParts[1];
                let suggestedDomain = "";

                // 🌟 定義台灣使用者常見的四大信箱易錯拼法 (新增 Outlook 支援)
                const typoMap = {
                    "gmail.com": ["gamil.com", "gmal.com", "gemal.com", "gmai.com", "gamil.con"],
                    "yahoo.com.tw": ["yaho.com.tw", "yahoo.com.t", "yahoo.tw", "yaho.tw"],
                    "hotmail.com": ["hotmal.com", "hotmai.com", "hormail.com"],
                    "outlook.com": ["outlok.com", "outloo.com", "outlool.com", "outllok.com", "outkook.com"]
                };

                // 比對是否有命中錯別字
                for (const [correct, typos] of Object.entries(typoMap)) {
                    if (typos.includes(domain)) {
                        suggestedDomain = correct;
                        break;
                    }
                }

                if (suggestedDomain) {
                    // 採用溫和詢問，並明確告知按鈕行為
                    const confirmFix = confirm(`【信箱拼字檢查】\n您輸入的信箱網域是 @${domain}，請問是否為 @${suggestedDomain} 的筆誤？\n\n• 點擊「確定」：系統將為您自動更正並繼續登入。\n• 點擊「取消」：確認無誤，維持使用您原本輸入的信箱。`);
                    
                    if (confirmFix) {
                        // 自動更正 input 畫面上的值
                        authEmail.value = emailParts[0] + '@' + suggestedDomain;
                        // 同步更新 email 變數，不使用 return，讓程式「直接往下執行」連線！
                        email = authEmail.value.trim().toLowerCase(); 
                    }
                }
            }

            if (password.length < 8) {
                alert("為了您的帳號安全，請輸入至少 8 碼的密碼！");
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
                if (error.message.includes("User already registered")) {
                    alert("此 Email 已被註冊，但您輸入的密碼錯誤！請重新確認。");
                } else if (error.message.includes("invalid format") || error.message.includes("Unable to validate email address")) {
                    alert("系統無法辨識此信箱格式，請再次檢查是否有打錯字！");
                } else {
                    alert(`連線發生錯誤：${error.message}`);
                }
            } else {
                currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
                alert(`[系統展示模式]\n已發送驗證碼至 ${email}\n\n您的動態驗證碼為：${currentOtp}\n(請於 60 秒內輸入)`);
                
                step1.style.display = 'none';
                step2.style.display = 'block';
                
                // 啟動 60 秒倒數計時
                startOtpTimer(60);

                setTimeout(() => otpCode.focus(), 100); 
            }
        });
    }

    // 忘記密碼
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', () => {
            alert("[系統提示] 忘記密碼功能需串接真實 SMTP 發信伺服器。\n若遺失密碼，請聯繫系統管理員進行後台重置。");
        });
    }

    // ==========================================
    // 8. 步驟二：驗證碼核對與返回按鈕
    // ==========================================
    if (verifyLoginBtn) {
        verifyLoginBtn.addEventListener('click', () => {
            if (otpCode.value === currentOtp) {
                clearInterval(countdownInterval); // 驗證成功，停止計時
                if (isNewUser) {
                    step2.style.display = 'none';
                    step3.style.display = 'block';
                    petList.innerHTML = ''; 
                    petList.appendChild(createPetRow()); 
                } else {
                    alert("歡迎回來！");
                    authModal.style.display = 'none';
                    window.location.reload(); 
                }
            } else {
                alert("驗證碼錯誤，請重新確認！");
            }
        });
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => {
            step2.style.display = 'none';
            step1.style.display = 'block';
            clearInterval(countdownInterval); // 🌟 退回上一頁時停止計時
        });
    }

    // ==========================================
    // 9. 步驟三：多寵物暱稱產生器與狀態切換
    // ==========================================
    if (randomNameBtn) {
        randomNameBtn.addEventListener('click', () => {
            let baseName = "毛孩"; 
            if (hasPet) {
                const petRows = document.querySelectorAll('.pet-row');
                const selectedBreeds = [];
                petRows.forEach(row => {
                    let val = row.querySelector('.pet-breed').value;
                    if(val === '其他') {
                        val = row.querySelector('.other-breed-input').value.trim() || '神秘狗狗';
                    }
                    if(val && !selectedBreeds.includes(val)) selectedBreeds.push(val);
                });

                if (selectedBreeds.length === 1) baseName = selectedBreeds[0];
                else if (selectedBreeds.length === 2) baseName = `${selectedBreeds[0]}與${selectedBreeds[1]}`;
                else if (selectedBreeds.length >= 3) baseName = `${selectedBreeds[0]}等毛孩`;
                else baseName = "汪星人";
            } else {
                baseName = "新手";
            }

            const prefixes = ['奔跑的', '可愛的', '調皮的', '霸氣', '資深的', '熱愛', '迷茫的', '開心的'];
            const suffixes = ['小隊長', '拔拔', '麻麻', '奴才', '守護者', '探險家', '好朋友', '鏟屎官'];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            profileNickname.value = `${prefix}${baseName}${suffix}`;
        });
    }

    if (statusNoPet) {
        statusNoPet.addEventListener('click', () => {
            statusNoPet.classList.add('active');
            statusHasPet.classList.remove('active');
            petSelectorArea.style.display = 'none';
            hasPet = false;
        });
    }

    if (statusHasPet) {
        statusHasPet.addEventListener('click', () => {
            statusHasPet.classList.add('active');
            statusNoPet.classList.remove('active');
            petSelectorArea.style.display = 'block';
            hasPet = true;
        });
    }

    if (addPetBtn) {
        addPetBtn.addEventListener('click', () => {
            petList.appendChild(createPetRow());
        });
    }

    // ==========================================
    // 10. 最終寫入資料庫與登出功能
    // ==========================================
    if (finishProfileBtn) {
        finishProfileBtn.addEventListener('click', async () => {
            finishProfileBtn.textContent = '儲存中...';
            finishProfileBtn.disabled = true;

            const nickname = profileNickname.value;

            await supabaseClient
                .from('profiles')
                .update({ nickname: nickname, has_pet: hasPet })
                .eq('id', currentUser.id);

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
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if(confirm("確定要登出帳號嗎？")) {
                await supabaseClient.auth.signOut();
                alert("已成功登出！");
                window.location.reload();
            }
        });
    }

    // ==========================================
    // 11. 危險操作：註銷帳號 (Delete Account)
    // ==========================================
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', async () => {
            const confirm1 = confirm("⚠️ 警告：您確定要註銷帳號嗎？\n這將會刪除您的個人檔案與寵物資料。");
            if (confirm1) {
                const confirm2 = confirm("資料刪除後將無法復原，請再次確認是否繼續？");
                if (confirm2) {
                    deleteAccountBtn.textContent = "刪除中...";
                    deleteAccountBtn.disabled = true;

                    const { error } = await supabaseClient.rpc('delete_my_account');
                    
                    if (error) {
                        alert("註銷失敗：" + error.message);
                        deleteAccountBtn.textContent = "危險操作：註銷並刪除我的帳戶資料";
                        deleteAccountBtn.disabled = false;
                    } else {
                        await supabaseClient.auth.signOut();
                        alert("您的帳戶與相關資料已徹底刪除。期待您未來再次加入！");
                        window.location.reload();
                    }
                }
            }
        });
    }
});
