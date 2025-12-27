// =====================================================
// 🌟 STUDENT PORTAL - COMPLETE JAVASCRIPT v2.0
// Login: admin / jsg@1155
// =====================================================

console.log("✅ Student Portal Script Loaded!");

// ========== CREDENTIALS ==========
const CREDENTIALS = {
    username: "admin",
    password: "jsg@1155"
};

// ========== STORAGE MANAGEMENT ==========
const storage = {
    // Save achievement to localStorage
    saveAchievement(data) {
        const key = "ach_" + Date.now();
        localStorage.setItem(key, JSON.stringify(data));
        console.log("✅ Achievement saved:", data);
    },

    // Get all achievements from localStorage
    getAchievements() {
        const items = [];
        for (let key in localStorage) {
            if (key.startsWith("ach_")) {
                items.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        return items.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // Delete specific achievement
    deleteAchievement(date) {
        for (let key in localStorage) {
            if (key.startsWith("ach_")) {
                const item = JSON.parse(localStorage.getItem(key));
                if (item.date === date) {
                    localStorage.removeItem(key);
                    console.log("✅ Achievement deleted");
                    return true;
                }
            }
        }
        return false;
    },

    // Clear all achievements
    clearAllAchievements() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith("ach_"));
        keys.forEach(k => localStorage.removeItem(k));
        console.log("✅ All achievements cleared");
    },

    // Save profile information
    saveProfile(data) {
        localStorage.setItem("profile", JSON.stringify(data));
        console.log("✅ Profile saved:", data);
    },

    // Get profile information
    getProfile() {
        const data = localStorage.getItem("profile");
        return data ? JSON.parse(data) : null;
    },

    // Set login session
    setLogin(username) {
        localStorage.setItem("logged_in", JSON.stringify({ 
            user: username, 
            time: Date.now() 
        }));
        console.log("✅ User logged in:", username);
    },

    // Check if user is logged in
    isLoggedIn() {
        const data = localStorage.getItem("logged_in");
        if (!data) return false;
        
        const session = JSON.parse(data);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (Date.now() - session.time > maxAge) {
            localStorage.removeItem("logged_in");
            return false;
        }
        return true;
    },

    // Get logged-in username
    getUsername() {
        const data = localStorage.getItem("logged_in");
        return data ? JSON.parse(data).user : null;
    },

    // Logout user
    logout() {
        localStorage.removeItem("logged_in");
        console.log("✅ User logged out");
    }
};

// ========== PAGE INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", function() {
    console.log("📄 Page loaded");
    
    // Check login status
    checkLogin();
    
    // Handle login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Show user greeting on all pages
    showUserGreeting();
    
    // Setup logout button
    setupLogout();
    
    // Update statistics
    updateStats();
    
    // ========== ACHIEVEMENTS/RECORD PAGE ==========
    const achForm = document.getElementById("achievementForm");
    if (achForm) {
        renderAchievements();
        achForm.addEventListener("submit", function(e) {
            e.preventDefault();
            addAchievement();
        });
    }
    
    // ========== PROGRESS PAGE ==========
    const progressFill = document.getElementById("progressFill");
    if (progressFill) {
        updateProgress();
    }
    
    // ========== SHOWCASE PAGE ==========
    const gallery = document.getElementById("gallery");
    if (gallery) {
        renderGallery();
    }
    
    // ========== PROFILE PAGE ==========
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
        loadProfile();
        profileForm.addEventListener("submit", function(e) {
            e.preventDefault();
            saveProfile();
        });
        
        const resetBtn = document.getElementById("resetBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", function() {
                profileForm.reset();
                document.getElementById("profilePreview").innerHTML = "";
                document.getElementById("profilePreview").classList.remove("show");
            });
        }
    }
});

// ========== LOGIN HANDLING ==========
function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        storage.setLogin(username);
        alert(`👋 Hello ${username}! Login successful!`);
        window.location.href = "project.html";
    } else {
        alert("❌ Invalid username or password!\n\nUse:\nUsername: admin\nPassword: jsg@1155");
        document.getElementById("username").focus();
    }
}

// ========== LOGIN CHECK ==========
function checkLogin() {
    const currentPage = document.title;
    const isLoginPage = currentPage.includes("Login");
    
    if (!isLoginPage && !storage.isLoggedIn()) {
        alert("⚠️ You need to login first!");
        window.location.href = "login.html";
    }
}

// ========== SHOW USER GREETING ==========
function showUserGreeting() {
    const greetingEl = document.getElementById("userGreeting");
    if (greetingEl) {
        const username = storage.getUsername();
        if (username) {
            greetingEl.textContent = `👋 Hello, ${username}!`;
            console.log("✅ Greeting displayed:", username);
        }
    }
}

// ========== LOGOUT SETUP ==========
function setupLogout() {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            if (confirm("🔐 Are you sure you want to logout?")) {
                storage.logout();
                alert("👋 You have been logged out. Goodbye!");
                window.location.href = "login.html";
            }
        });
    }
}

// ========== UPDATE STATISTICS ==========
function updateStats() {
    const achievements = storage.getAchievements();
    
    // Update achievement count
    const achCount = document.getElementById("stat-ach");
    if (achCount) {
        achCount.textContent = achievements.length;
    }
    
    // Update progress percentage
    const categories = ["Academic", "Sports", "Technical", "Leadership"];
    let totalPossible = categories.length;
    let completed = achievements.length > 0 ? Math.min(achievements.length, totalPossible) : 0;
    let percentage = totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
    
    const progPercent = document.getElementById("stat-progress");
    if (progPercent) {
        progPercent.textContent = percentage + "%";
    }
}

// ========== ADD ACHIEVEMENT ==========
function addAchievement() {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value.trim();
    
    if (!title || !category || !date) {
        alert("⚠️ Please fill all required fields");
        return;
    }
    
    storage.saveAchievement({ title, category, date, description });
    alert("✅ Achievement saved successfully!");
    
    document.getElementById("achievementForm").reset();
    renderAchievements();
    updateStats();
    updateProgress();
}

// ========== RENDER ACHIEVEMENTS LIST ==========
function renderAchievements() {
    const achievements = storage.getAchievements();
    const list = document.getElementById("achievementList");
    
    if (!list) return;
    
    list.innerHTML = "";
    
    if (achievements.length === 0) {
        list.innerHTML = `<li style="text-align: center; color: #999; padding: 2rem;">
            📝 No achievements yet. Add one to get started!
        </li>`;
        return;
    }
    
    achievements.forEach((ach, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${ach.title}</strong>
                <p style="color: #999; font-size: 0.9rem; margin-top: 0.3rem;">
                    📅 ${new Date(ach.date).toLocaleDateString()} | 
                    🏷️ ${ach.category}
                </p>
                <p style="color: #666; margin-top: 0.5rem;">${ach.description || "No description"}</p>
            </div>
            <button onclick="deleteAch('${ach.date}')" class="btn-delete" style="
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            ">🗑️ Delete</button>
        `;
        list.appendChild(li);
    });
}

// ========== DELETE ACHIEVEMENT ==========
function deleteAch(date) {
    if (confirm("⚠️ Are you sure you want to delete this achievement?")) {
        storage.deleteAchievement(date);
        alert("✅ Achievement deleted!");
        renderAchievements();
        updateStats();
        updateProgress();
    }
}

// ========== UPDATE PROGRESS ==========
function updateProgress() {
    const achievements = storage.getAchievements();
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");
    const categoryList = document.getElementById("categoryList");
    
    // Calculate overall progress
    const categories = ["Academic", "Sports", "Technical", "Leadership"];
    let totalPossible = categories.length * 3; // 3 achievements per category target
    let completed = achievements.length;
    let percentage = totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
    percentage = Math.min(percentage, 100); // Cap at 100%
    
    if (progressFill) {
        progressFill.style.width = percentage + "%";
    }
    
    if (progressPercent) {
        progressPercent.textContent = percentage + "% completed";
    }
    
    // Calculate category breakdown
    if (categoryList) {
        const categoryCount = {};
        categories.forEach(cat => categoryCount[cat] = 0);
        
        achievements.forEach(ach => {
            if (categoryCount.hasOwnProperty(ach.category)) {
                categoryCount[ach.category]++;
            }
        });
        
        categoryList.innerHTML = "";
        categories.forEach(cat => {
            const count = categoryCount[cat];
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${cat}</strong>
                <span>${count} achievement${count !== 1 ? 's' : ''}</span>
            `;
            categoryList.appendChild(li);
        });
    }
}

// ========== RENDER GALLERY ==========
function renderGallery() {
    const achievements = storage.getAchievements();
    const gallery = document.getElementById("gallery");
    
    if (!gallery) return;
    
    gallery.innerHTML = "";
    
    if (achievements.length === 0) {
        gallery.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h2>🎨 No Achievements Yet</h2>
                <p style="color: #999; margin: 1rem 0;">Add some achievements to showcase them here!</p>
                <a href="record.html" class="btn primary">Add Achievement</a>
            </div>
        `;
        return;
    }
    
    achievements.forEach(ach => {
        const card = document.createElement("div");
        card.className = "gallery-card";
        card.innerHTML = `
            <div class="card-header">
                <span class="card-category">${ach.category}</span>
                <h3>${ach.title}</h3>
            </div>
            <div class="card-body">
                <div class="card-date">📅 ${new Date(ach.date).toLocaleDateString()}</div>
                <p class="card-description">${ach.description || "No description provided"}</p>
                <div class="card-actions">
                    <button onclick="deleteAch('${ach.date}')" class="card-btn delete">🗑️ Delete</button>
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });
}

// ========== PROFILE MANAGEMENT ==========
function loadProfile() {
    const profile = storage.getProfile();
    if (profile) {
        document.getElementById("fullName").value = profile.fullName || "";
        document.getElementById("rollNumber").value = profile.rollNumber || "";
        document.getElementById("email").value = profile.email || "";
        document.getElementById("bio").value = profile.bio || "";
        showProfilePreview(profile);
    }
}

function saveProfile() {
    const profile = {
        fullName: document.getElementById("fullName").value.trim(),
        rollNumber: document.getElementById("rollNumber").value.trim(),
        email: document.getElementById("email").value.trim(),
        bio: document.getElementById("bio").value.trim()
    };
    
    if (!profile.fullName) {
        alert("⚠️ Please enter your full name");
        return;
    }
    
    storage.saveProfile(profile);
    alert("✅ Profile saved successfully!");
    showProfilePreview(profile);
}

function showProfilePreview(profile) {
    const preview = document.getElementById("profilePreview");
    if (preview) {
        preview.innerHTML = `
            <h3>📋 Profile Preview</h3>
            <div style="margin-top: 1rem;">
                <p><strong>Full Name:</strong> ${profile.fullName}</p>
                <p><strong>Roll Number:</strong> ${profile.rollNumber || "Not provided"}</p>
                <p><strong>Email:</strong> ${profile.email || "Not provided"}</p>
                <p><strong>Bio:</strong> ${profile.bio || "Not provided"}</p>
            </div>
        `;
        preview.classList.add("show");
    }
}

console.log("✅ All functions loaded successfully!");

// ========== AUTO FILL TEAM ==========
function autoFillTeam() {
    const teamData = [
        {
            name: "Gireeshvardhanj",
            rollNo: "22XYZ001",
            email: "gireesh@example.com"
        },
        {
            name: "Team Member 2",
            rollNo: "22XYZ002",
            email: "member2@example.com"
        },
        {
            name: "Team Member 3",
            rollNo: "22XYZ003",
            email: "member3@example.com"
        },
        {
            name: "Team Member 4",
            rollNo: "22XYZ004",
            email: "member4@example.com"
        }
    ];

    localStorage.setItem('teamData', JSON.stringify(teamData));
    
    teamData.forEach((member, index) => {
        const memberNum = index + 1;
        const nameField = document.getElementById(`member${memberNum}Name`) || document.querySelector(`input[name="member${memberNum}Name"]`);
        const rollField = document.getElementById(`member${memberNum}Roll`) || document.querySelector(`input[name="member${memberNum}Roll"]`);
        const emailField = document.getElementById(`member${memberNum}Email`) || document.querySelector(`input[name="member${memberNum}Email"]`);

        if (nameField) nameField.value = member.name;
        if (rollField) rollField.value = member.rollNo;
        if (emailField) emailField.value = member.email;
    });
    
    console.log('Team auto-filled!', teamData);
    alert('Team members auto-filled successfully!');
}

// Auto-load team data on page load
window.addEventListener('load', () => {
    const savedTeam = localStorage.getItem('teamData');
    if (savedTeam) {
        const teamData = JSON.parse(savedTeam);
        teamData.forEach((member, index) => {
            const memberNum = index + 1;
            const nameField = document.getElementById(`member${memberNum}Name`) || document.querySelector(`input[name="member${memberNum}Name"]`);
            const rollField = document.getElementById(`member${memberNum}Roll`) || document.querySelector(`input[name="member${memberNum}Roll"]`);
            const emailField = document.getElementById(`member${memberNum}Email`) || document.querySelector(`input[name="member${memberNum}Email"]`);

            if (nameField) nameField.value = member.name;
            if (rollField) rollField.value = member.rollNo;
            if (emailField) emailField.value = member.email;
        });
    }
});

