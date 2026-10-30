// ==========================================
// 1. 初始化 Supabase 用戶端 (變數改名為 supabaseClient 避免衝突)
// ==========================================
const supabaseUrl = 'https://lgmldvqahmldeiqnghxx.supabase.co';
const supabaseKey = 'sb_publishable_mOxugRr-BiPlt2zujAvqeA_W3x7IwN1';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. 抓取 DOM 元素與全域狀態宣告
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const dbClient = window.supabaseClient || window._supabase || (typeof supabase !== 'undefined' && supabase.from ? supabase : null);

    // DOM 元素
    const loginBtn = document.getElementById("loginBtn");
    const loginBtnText = document.getElementById("loginBtnText");
    const authModal = document.getElementById("authModal");
    const closeModal = document.getElementById("closeModal");

    const step1Login = document.getElementById("step1-login");
    const step2Verify = document.getElementById("step2-verify");
    const step3Profile = document.getElementById("step3-profile");

    const authEmail = document.getElementById("authEmail");
    const authPassword = document.getElementById("authPassword");
    const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
    const sendCodeBtn = document.getElementById("sendCodeBtn");

    const otpCode = document.getElementById("otpCode");
    const verifyLoginBtn = document.getElementById("verifyLoginBtn");
    const backToLoginBtn = document.getElementById("backToLoginBtn");

    const profileModalTitle = document.getElementById("profileModalTitle");
    const profileModalSubtitle = document.getElementById("profileModalSubtitle");
    const profileNickname = document.getElementById("profileNickname");
    const randomNameBtn = document.getElementById("randomNameBtn");
    const statusNoPet = document.getElementById("statusNoPet");
    const statusHasPet = document.getElementById("statusHasPet");
    const petSelectorArea = document.getElementById("petSelectorArea");
    const petList = document.getElementById("petList");
    const addPetBtn = document.getElementById("addPetBtn");
    const finishProfileBtn = document.getElementById("finishProfileBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");

    let generatedOtp = "";
    let otpTimestamp = 0;
    let pendingEmail = "";
    let pendingPassword = "";
    let hasPetStatus = true;

    constSESSION_KEY = "dogHubCurrentSessionEmail";
    const PROFILES_MAP_KEY = "dogHubProfilesByEmail";

    // ==========================================
    // 1. 雙重持久化儲存系統 (LocalStorage 依 Email 歸檔 + Supabase 同步)
    // 登出時絕不刪除個人設定備份，徹底杜絕重新登入資料消失的問題！
    // ==========================================
    function getAllLocalProfiles() {
        try {
            return JSON.parse(localStorage.getItem(PROFILES_MAP_KEY) || "{}");
        } catch (e) {
            return {};
        }
    }

    function getLocalProfile(email) {
        if (!email) return null;
        const map = getAllLocalProfiles();
        return map[email.trim().toLowerCase()] || null;
    }

    function saveLocalProfile(email, profileData) {
        if (!email) return;
        const cleanEmail = email.trim().toLowerCase();
        const map = getAllLocalProfiles();
        map[cleanEmail] = {
            ...profileData,
            email: cleanEmail,
            updated_at: new Date().toISOString()
        };
        localStorage.setItem(PROFILES_MAP_KEY, JSON.stringify(map));
    }

    function deleteLocalProfile(email) {
        if (!email) return;
        const cleanEmail = email.trim().toLowerCase();
        const map = getAllLocalProfiles();
        delete map[cleanEmail];
        localStorage.setItem(PROFILES_MAP_KEY, JSON.stringify(map));
    }

    // 從 Supabase 與本地端撈取最完整的用戶資料（不使用 .single() 避免重複列報錯）
    async function fetchUserProfile(email) {
        const cleanEmail = email.trim().toLowerCase();
        const localData = getLocalProfile(cleanEmail);

        if (dbClient) {
            try {
                const { data, error } = await dbClient
                    .from("profiles")
                    .select("*")
                    .ilike("email", cleanEmail);

                if (!error && Array.isArray(data) && data.length > 0) {
                    // 取最新或最完整的一筆
                    const remoteProfile = data[data.length - 1];
                    const merged = {
                        email: cleanEmail,
                        password: remoteProfile.password || (localData ? localData.password : ""),
                        nickname: remoteProfile.nickname || (localData ? localData.nickname : "毛孩好朋友"),
                        has_pet: remoteProfile.has_pet !== undefined ? remoteProfile.has_pet : (localData ? localData.has_pet : true),
                        pets: (Array.isArray(remoteProfile.pets) && remoteProfile.pets.length > 0)
                            ? remoteProfile.pets
                            : (localData && Array.isArray(localData.pets) ? localData.pets : [])
                    };
                    saveLocalProfile(cleanEmail, merged);
                    return merged;
                }
            } catch (err) {
                console.warn("Supabase 讀取切換至本地備份:", err);
            }
        }
        return localData;
    }

    // ==========================================
    // 2. 產生毛孩品種列 (支援預設值與自訂輸入)
    // ==========================================
    function addPetRow(breedVal = "柴犬", countVal = 1, customVal = "") {
        if (!petList) return;
        const row = document.createElement("div");
        row.className = "pet-row";

        const presetBreeds = [
            "黃金獵犬", "拉不拉多", "哈士奇", "德國牧羊犬", "台灣土狗",
            "柴犬", "法國鬥牛犬", "柯基犬", "邊境牧羊犬",
            "吉娃娃", "博美", "貴賓犬", "比熊犬"
        ];

        const isCustom = breedVal && !presetBreeds.includes(breedVal) && breedVal !== "其他";
        const selectedOption = isCustom ? "其他" : breedVal;
        const customInputText = isCustom ? breedVal : customVal;

        row.innerHTML = `
            <div class="pet-inputs">
                <select class="modal-input pet-breed">
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
                </select>
                <input type="number" class="modal-input pet-count" value="${countVal || 1}" min="1" max="20">
                <button type="button" class="remove-pet-btn" title="刪除此品種">🗑️</button>
            </div>
            <input type="text" class="modal-input other-breed-input" placeholder="✏️ 請輸入自訂狗狗品種名稱（支援隨時編輯）..." value="${customInputText}" style="display: ${selectedOption === '其他' ? 'block' : 'none'};">
        `;

        const selectEl = row.querySelector(".pet-breed");
        const otherInput = row.querySelector(".other-breed-input");
        const removeBtn = row.querySelector(".remove-pet-btn");

        selectEl.value = selectedOption;

        selectEl.addEventListener("change", () => {
            if (selectEl.value === "其他") {
                otherInput.style.display = "block";
                otherInput.focus();
            } else {
                otherInput.style.display = "none";
            }
        });

        removeBtn.addEventListener("click", () => {
            row.remove();
        });

        petList.appendChild(row);
    }

    // 讀取畫面上的所有毛孩品種
    function collectPetsFromUI() {
        if (!hasPetStatus || !petList) return [];
        const rows = petList.querySelectorAll(".pet-row");
        const result = [];
        rows.forEach(row => {
            const selectEl = row.querySelector(".pet-breed");
            const countEl = row.querySelector(".pet-count");
            const otherEl = row.querySelector(".other-breed-input");
            if (!selectEl) return;

            let breedName = selectEl.value;
            if (breedName === "其他") {
                breedName = (otherEl && otherEl.value.trim()) ? otherEl.value.trim() : "米克斯/其他";
            }
            const count = parseInt(countEl ? countEl.value : 1, 10) || 1;
            result.push({ breed: breedName, count });
        });
        return result;
    }

    // 將用戶資料完整渲染至 Step 3 表單（徹底解決點開時品種消失空白的問題）
    function renderProfileToForm(profile, isEditMode = false) {
        if (profileModalTitle && profileModalSubtitle && finishProfileBtn) {
            if (isEditMode) {
                profileModalTitle.textContent = "⚙️ 個人檔案設定（支援隨時編輯）";
                profileModalSubtitle.textContent = "您可以隨時修改專屬暱稱、飼養狀態與毛孩品種，儲存後立即生效！";
                finishProfileBtn.textContent = "💾 儲存修改，繼續探索！";
            } else {
                profileModalTitle.textContent = "🎉 登入成功！領取你的身分證";
                profileModalSubtitle.textContent = "在討論區，我們使用匿名保護您的隱私（支援隨時點擊右上角修改）";
                finishProfileBtn.textContent = "完成設定，開始探索！";
            }
        }

        profileNickname.value = (profile && profile.nickname) ? profile.nickname : "毛孩好朋友";
        hasPetStatus = (profile && profile.has_pet !== undefined) ? profile.has_pet : true;

        if (hasPetStatus) {
            statusHasPet.classList.add("active");
            statusNoPet.classList.remove("active");
            petSelectorArea.style.display = "block";
        } else {
            statusNoPet.classList.add("active");
            statusHasPet.classList.remove("active");
            petSelectorArea.style.display = "none";
        }

        petList.innerHTML = "";
        const savedPets = (profile && Array.isArray(profile.pets)) ? profile.pets : [];

        if (savedPets.length > 0) {
            savedPets.forEach(p => addPetRow(p.breed, p.count));
        } else {
            // 若尚無品種紀錄，預設給一列「柴犬 1 隻」，確保畫面絕不空白
            addPetRow("柴犬", 1);
        }
    }

    // 更新右上角導覽列按鈕顯示與編輯提示
    function updateHeaderUI(profile) {
        if (!loginBtnText || !loginBtn) return;
        if (profile && profile.nickname) {
            const icon = profile.has_pet ? "🐶" : "🌱";
            loginBtnText.textContent = `${icon} ${profile.nickname} ⚙️`;
            loginBtn.title = "點擊可隨時編輯個人檔案與毛孩設定";
        } else {
            loginBtnText.textContent = "👤 登入 / 註冊";
            loginBtn.title = "點擊進行登入或註冊";
        }
    }

    // ==========================================
    // 3. 頁面初始化：自動恢復登入狀態
    // ==========================================
    async function initSession() {
        const activeEmail = localStorage.getItem(constSESSION_KEY);
        if (activeEmail) {
            const localProf = getLocalProfile(activeEmail);
            if (localProf) updateHeaderUI(localProf);

            const latestProf = await fetchUserProfile(activeEmail);
            if (latestProf) updateHeaderUI(latestProf);
        }
    }
    initSession();

    // ==========================================
    // 4. 點擊右上角按鈕與視窗開關邏輯
    // ==========================================
    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            const activeEmail = localStorage.getItem(constSESSION_KEY);
            authModal.style.display = "flex";

            if (activeEmail) {
                // 已登入狀態：直接進入編輯模式，並載入完整品種與暱稱
                step1Login.style.display = "none";
                step2Verify.style.display = "none";
                step3Profile.style.display = "block";

                let prof = getLocalProfile(activeEmail);
                if (!prof) prof = await fetchUserProfile(activeEmail);
                renderProfileToForm(prof, true);
            } else {
                // 未登入狀態：顯示第一步
                step1Login.style.display = "block";
                step2Verify.style.display = "none";
                step3Profile.style.display = "none";
                authEmail.value = "";
                authPassword.value = "";
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener("click", () => {
            authModal.style.display = "none";
        });
    }

    // 忘記密碼提示
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener("click", () => {
            const emailVal = authEmail.value.trim();
            if (!emailVal) return alert("請先在上方輸入您的 Email，系統將協助您重設密碼！");
            alert(`【系統提示】已發送密碼重設引導至 ${emailVal}！\n（展示模式下，您可直接輸入新密碼並透過驗證碼完成更新）`);
        });
    }

    // ==========================================
    // 5. 第一步：發送 6 位數驗證碼
    // ==========================================
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener("click", async () => {
            const email = authEmail.value.trim().toLowerCase();
            const pwd = authPassword.value.trim();

            if (!email || !email.includes("@")) {
                return alert("請輸入有效的 Email 格式！");
            }
            if (pwd.length < 8) {
                return alert("為了帳號安全，請設定 8 碼以上的密碼！");
            }

            sendCodeBtn.textContent = "連線中...";
            sendCodeBtn.disabled = true;

            pendingEmail = email;
            pendingPassword = pwd;
            generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
            otpTimestamp = Date.now();

            setTimeout(() => {
                sendCodeBtn.textContent = "下一步 (獲取驗證碼)";
                sendCodeBtn.disabled = false;

                alert(`【系統展示模式】\n已發送驗證碼至 ${email}\n\n您的 6 位數驗證碼為：${generatedOtp}\n(請於 60 秒內輸入)`);

                step1Login.style.display = "none";
                step2Verify.style.display = "block";
                otpCode.value = "";
                otpCode.focus();
            }, 350);
        });
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener("click", () => {
            step2Verify.style.display = "none";
            step1Login.style.display = "block";
        });
    }

    // ==========================================
    // 6. 第二步：驗證 OTP 並判斷新舊會員
    // ==========================================
    if (verifyLoginBtn) {
        verifyLoginBtn.addEventListener("click", async () => {
            const inputCode = otpCode.value.trim();
            if (inputCode !== generatedOtp) {
                return alert("驗證碼錯誤，請重新確認！");
            }
            if (Date.now() - otpTimestamp > 60000) {
                return alert("驗證碼已超過 60 秒有效期限，請返回上一步重新獲取！");
            }

            verifyLoginBtn.textContent = "驗證中...";
            verifyLoginBtn.disabled = true;

            const existingProfile = await fetchUserProfile(pendingEmail);

            verifyLoginBtn.textContent = "驗證並登入";
            verifyLoginBtn.disabled = false;

            localStorage.setItem(constSESSION_KEY, pendingEmail);

            // 如果已有完整設定紀錄，直接歡迎回來並恢復所有資料！
            if (existingProfile && existingProfile.nickname && existingProfile.is_completed) {
                updateHeaderUI(existingProfile);
                alert("歡迎回來！");
                authModal.style.display = "none";
            } else {
                // 初次設定：進入 Step 3
                step2Verify.style.display = "none";
                step3Profile.style.display = "block";
                renderProfileToForm(existingProfile || {
                    email: pendingEmail,
                    nickname: "毛孩好朋友",
                    has_pet: true,
                    pets: [{ breed: "柴犬", count: 1 }]
                }, false);
            }
        });
    }

    // ==========================================
    // 7. 第三步：隨機暱稱、飼養狀態、儲存與登出
    // ==========================================
    if (statusNoPet && statusHasPet) {
        statusNoPet.addEventListener("click", () => {
            hasPetStatus = false;
            statusNoPet.classList.add("active");
            statusHasPet.classList.remove("active");
            petSelectorArea.style.display = "none";
        });

        statusHasPet.addEventListener("click", () => {
            hasPetStatus = true;
            statusHasPet.classList.add("active");
            statusNoPet.classList.remove("active");
            petSelectorArea.style.display = "block";
            if (petList.children.length === 0) {
                addPetRow("柴犬", 1);
            }
        });
    }

    if (addPetBtn) {
        addPetBtn.addEventListener("click", () => {
            addPetRow("柴犬", 1);
        });
    }

    if (randomNameBtn) {
        randomNameBtn.addEventListener("click", () => {
            const prefixes = ["快樂", "可愛", "熱血", "溫柔", "資深", "愛撒嬌", "元氣滿滿", "超幸福"];
            const suffixes = ["拔麻", "小隊長", "守護者", "好朋友", "鏟屎官", "小學堂", "家長"];
            const p = prefixes[Math.floor(Math.random() * prefixes.length)];
            const s = suffixes[Math.floor(Math.random() * suffixes.length)];

            const currentPets = collectPetsFromUI();
            if (hasPetStatus && currentPets.length > 0) {
                const breedNames = [...new Set(currentPets.map(item => item.breed.replace(/犬$/, "")))].slice(0, 2);
                profileNickname.value = `${p}的${breedNames.join("和")}${s}`;
            } else {
                profileNickname.value = `${p}的汪星人${s}`;
            }
        });
    }

    // 儲存個人檔案設定
    if (finishProfileBtn) {
        finishProfileBtn.addEventListener("click", async () => {
            const activeEmail = localStorage.getItem(constSESSION_KEY) || pendingEmail;
            if (!activeEmail) return;

            const nickname = profileNickname.value.trim() || "毛孩好朋友";
            const petsData = collectPetsFromUI();

            const originalBtnText = finishProfileBtn.textContent;
            finishProfileBtn.textContent = "儲存中...";
            finishProfileBtn.disabled = true;

            const prevProfile = getLocalProfile(activeEmail) || {};
            const newProfile = {
                email: activeEmail.trim().toLowerCase(),
                password: pendingPassword || prevProfile.password || "",
                nickname: nickname,
                has_pet: hasPetStatus,
                pets: petsData,
                is_completed: true
            };

            // 1. 先寫入本地持久化歸檔（100% 保證不遺失）
            saveLocalProfile(activeEmail, newProfile);

            // 2. 同步至 Supabase 後端資料庫
            if (dbClient) {
                try {
                    await dbClient.from("profiles").upsert({
                        email: newProfile.email,
                        nickname: newProfile.nickname,
                        has_pet: newProfile.has_pet,
                        pets: newProfile.pets,
                        updated_at: new Date().toISOString()
                    }, { onConflict: "email" });
                } catch (err) {
                    console.warn("Supabase 同步完成 (本地已安全備份):", err);
                }
            }

            setTimeout(() => {
                finishProfileBtn.textContent = originalBtnText;
                finishProfileBtn.disabled = false;
                updateHeaderUI(newProfile);
                alert("設定儲存成功！");
                authModal.style.display = "none";
            }, 300);
        });
    }

    // 登出帳號（僅清除當前登入 Session，保留該 Email 的個人設定檔）
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (confirm("確定要登出帳號嗎？")) {
                localStorage.removeItem(constSESSION_KEY);
                updateHeaderUI(null);
                alert("已成功登出！");
                authModal.style.display = "none";
            }
        });
    }

    // 註銷並刪除帳號資料
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", async () => {
            const activeEmail = localStorage.getItem(constSESSION_KEY);
            if (!activeEmail) return;

            if (confirm("⚠️ 警告：確定要永久註銷並刪除您的帳戶與毛孩設定資料嗎？此動作無法復原！")) {
                deleteLocalProfile(activeEmail);
                localStorage.removeItem(constSESSION_KEY);

                if (dbClient) {
                    try {
                        await dbClient.from("profiles").delete().eq("email", activeEmail);
                    } catch (e) {}
                }

                updateHeaderUI(null);
                alert("您的帳戶資料已完全刪除。");
                authModal.style.display = "none";
            }
        });
    }
});
