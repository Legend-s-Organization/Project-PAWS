/**********************************************************
 * NU PROJECT PAWS - MAIN JAVASCRIPT (FINAL VERSION)
 **********************************************************/

/* ========================================================
   PATH HANDLING
======================================================== */
function inHtmlFolder() {
  return window.location.pathname.includes("/html/");
}
function getPageBase() {
  return inHtmlFolder() ? "" : "html/";
}
function getIndexPath() {
  return inHtmlFolder() ? "../index.html" : "index.html";
}
const pageBase = getPageBase();
const indexPath = getIndexPath();

/* ========================================================
   DEMO ACCOUNT
======================================================== */
const DEMO_USER = "student01";
const DEMO_PASS = "password01";
const ADMIN_USER = "admin01";
const ADMIN_PASS = "adminpass01";

/* ========================================================
   ACCOUNT STORAGE
======================================================== */
function loadAccounts() {
  try {
    const raw = localStorage.getItem("accounts");
    if (!raw) {
      const initial = [
        { user: DEMO_USER, pass: DEMO_PASS },
        { user: ADMIN_USER, pass: ADMIN_PASS, isAdmin: true },
      ];
      saveAccounts(initial);
      return initial;
    }
    const accounts = JSON.parse(raw);
    const hasDemo = accounts.some(
      (a) => a.user === DEMO_USER && a.pass === DEMO_PASS,
    );
    const hasAdmin = accounts.some(
      (a) => a.user === ADMIN_USER && a.pass === ADMIN_PASS,
    );
    if (!hasDemo) {
      accounts.unshift({ user: DEMO_USER, pass: DEMO_PASS });
    }
    if (!hasAdmin) {
      accounts.push({ user: ADMIN_USER, pass: ADMIN_PASS, isAdmin: true });
    }
    saveAccounts(accounts);
    return accounts;
  } catch {
    const fallback = [
      { user: DEMO_USER, pass: DEMO_PASS },
      { user: ADMIN_USER, pass: ADMIN_PASS, isAdmin: true },
    ];
    saveAccounts(fallback);
    return fallback;
  }
}

function saveAccounts(accounts) {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

function getApiPath() {
  return inHtmlFolder() ? "../backend/api/" : "backend/api/";
}
const apiPath = getApiPath();

/* ========================================================
   LOGIN PAGE
======================================================== */
const loginForm = document.getElementById("loginForm");
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const errorMsg = document.getElementById("errorMsg");

if (togglePassword && passwordField) {
  togglePassword.addEventListener("click", () => {
    const isHidden = passwordField.type === "password";
    passwordField.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "🙈" : "👁";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enteredUser = usernameField.value.trim();
    const enteredPass = passwordField.value;

    try {
      const response = await fetch(apiPath + "login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: enteredUser, password: enteredPass }),
      });

      const result = await response.json();

      if (result.success) {
        errorMsg.textContent = "";
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", result.user.username);
        localStorage.setItem("isAdmin", result.user.isAdmin ? "true" : "false");

        if (result.user.isAdmin) {
          window.location.href = pageBase + "admin-home.html";
        } else {
          window.location.href = pageBase + "home.html";
        }
      } else {
        errorMsg.textContent = result.message;
      }
    } catch (err) {
      errorMsg.textContent = "Error connecting to server.";
      console.error(err);
    }
  });
}

/* ========================================================
   ADMIN LOGIN PAGE
======================================================== */
const adminLoginForm = document.getElementById("adminLoginForm");
const adminUserField = document.getElementById("adminUser");
const adminPassField = document.getElementById("adminPass");
const adminErrorMsg = document.getElementById("adminErrorMsg");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = adminUserField.value.trim();
    const pass = adminPassField.value;

    try {
      const response = await fetch(apiPath + "login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });

      const result = await response.json();

      if (result.success && result.user.isAdmin) {
        adminErrorMsg.textContent = "";
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("currentUser", result.user.username);
        window.location.href = "admin-home.html";
      } else if (result.success && !result.user.isAdmin) {
        adminErrorMsg.textContent = "This account does not have Admin access.";
      } else {
        adminErrorMsg.textContent = result.message;
      }
    } catch (err) {
      adminErrorMsg.textContent = "Error connecting to server.";
    }
  });
}

/* ========================================================
   SIGN-UP PAGE
======================================================== */
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    window.location.href = pageBase + "sign-up.html";
  });
}

const signupForm = document.getElementById("signupForm");
const newUserField = document.getElementById("newUsername");
const newPassField = document.getElementById("newPassword");
const confirmPassField = document.getElementById("confirmPassword");
const signupError = document.getElementById("signupError");
const signupSuccess = document.getElementById("signupSuccess");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = newUserField.value.trim();
    const grade = document.getElementById("gradeLevel").value;
    const pass = newPassField.value;
    const confirm = confirmPassField.value;

    if (!user || !pass || !grade) {
      signupError.textContent = "Please provide all details.";
      signupSuccess.textContent = "";
      return;
    }
    if (pass !== confirm) {
      signupError.textContent = "Passwords do not match.";
      signupSuccess.textContent = "";
      return;
    }

    try {
      const response = await fetch(apiPath + "signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          password: pass,
          grade_level: grade,
        }),
      });

      const result = await response.json();

      if (result.success) {
        signupError.textContent = "";
        signupSuccess.textContent = result.message;
        setTimeout(() => {
          window.location.href = indexPath;
        }, 1200);
      } else {
        signupError.textContent = result.message;
        signupSuccess.textContent = "";
      }
    } catch (err) {
      signupError.textContent = "Error connecting to server.";
    }
  });
}

/* ========================================================
   PAGE PROTECTION
======================================================== */
const protectedPages = ["home.html", "permits.html", "profile.html"];
const adminOnlyPages = [
  "admin-home.html",
  "admin-users.html",
  "admin-permits.html",
];

if (protectedPages.some((p) => window.location.pathname.includes(p))) {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = indexPath;
  }
}

if (adminOnlyPages.some((p) => window.location.pathname.includes(p))) {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("isAdmin") !== "true"
  ) {
    window.location.href = indexPath;
  }
}

/* ========================================================
   PROFILE PAGE LOGIC
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    const profileUser = document.getElementById("profileUser");
    const profileRole = document.getElementById("profileRole");
    const headerHomeLink = document.getElementById("headerHomeLink");

    const currentUser = localStorage.getItem("currentUser") || "Unknown";
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (profileUser) profileUser.textContent = currentUser;
    if (profileRole)
      profileRole.textContent = isAdmin ? "Administrator" : "Student";

    // Correct the header link based on role
    if (headerHomeLink) {
      headerHomeLink.href = isAdmin ? "admin-home.html" : "home.html";
    }
  }
});

/* ========================================================
   LOGIN REDIRECT IF ALREADY LOGGED IN
======================================================== */
const isLoginPage =
  window.location.pathname.includes("index.html") ||
  window.location.pathname.endsWith("/");

if (isLoginPage && localStorage.getItem("isLoggedIn") === "true") {
  if (localStorage.getItem("isAdmin") === "true") {
    window.location.href = pageBase + "admin-home.html";
  } else {
    window.location.href = pageBase + "home.html";
  }
}

/* ========================================================
   LOGOUT
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    if (isLoginPage) {
      logoutBtn.style.display = "none";
    }
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("currentUser");
      window.location.href = indexPath;
    });
  }
});

/* ========================================================
   SERVICE CARD REDIRECTIONS
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card .card-title");

  cards.forEach((card) => {
    const text = card.textContent.trim();
    if (text === "Permits") {
      card.parentElement.addEventListener("click", () => {
        window.location.href = pageBase + "permits.html";
      });
    }
    if (text === "My Activity") {
      card.parentElement.addEventListener("click", () => {
        window.location.href = pageBase + "my-activity.html";
      });
    }
    if (text === "Admin Control") {
      card.parentElement.addEventListener("click", () => {
        window.location.href = "admin-users.html";
      });
    }
    if (text === "Permit Management") {
      card.parentElement.addEventListener("click", () => {
        window.location.href = "admin-permits.html";
      });
    }
  });
});

/* ========================================================
   PERMIT FORM HANDLING (permits.html)
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const permitType = document.getElementById("permitType");
  const eventPermitForm = document.getElementById("eventPermitForm");

  if (permitType) {
    permitType.addEventListener("change", () => {
      if (permitType.value === "eventPermit") {
        eventPermitForm.classList.remove("hidden");
      } else {
        eventPermitForm.classList.add("hidden");
      }
    });
  }

  if (eventPermitForm) {
    eventPermitForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const requestForm = document.getElementById("requestForm").files[0];
      const studentId = document.getElementById("studentId").files[0];
      const endorsement = document.getElementById("endorsement").files[0];
      const eventDate = document.getElementById("eventDate").value;
      const purpose = document.getElementById("purpose").value.trim();

      if (
        !requestForm ||
        !studentId ||
        !endorsement ||
        !eventDate ||
        !purpose
      ) {
        alert("Please complete all required fields before submitting.");
        return;
      }

      // Use FormData for file uploads
      const formData = new FormData();
      formData.append("student_id", localStorage.getItem("currentUser"));
      formData.append("permit_type", "Event Permit");
      formData.append("event_date", eventDate);
      formData.append("purpose", purpose);
      formData.append("request_form", requestForm);
      formData.append("student_id_file", studentId);
      formData.append("endorsement", endorsement);

      try {
        const response = await fetch(apiPath + "submit_permit.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          alert("Event/Activity Permit submitted successfully! ✅");
          eventPermitForm.reset();
          permitType.value = "";
          eventPermitForm.classList.add("hidden");
        } else {
          alert("Error: " + result.message);
        }
      } catch (err) {
        alert("Error connecting to server.");
      }
    });
  }
});

/* ========================================================
   BACK BUTTON HANDLING
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      // Go back to the previous page in browser history
      history.back();
    });
  }
});

/* ========================================================
   HERO SLIDESHOW
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slide");
  const btns = document.querySelectorAll(".hero-btn");
  if (slides.length > 0 && btns.length > 0) {
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((s) => s.classList.remove("active"));
      btns.forEach((b) => b.classList.remove("active"));
      slides[index].classList.add("active");
      btns[index].classList.add("active");
      currentSlide = index;
    }

    btns.forEach((btn, idx) => {
      btn.addEventListener("click", () => showSlide(idx));
    });

    // Auto-advance
    setInterval(() => {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }, 5000);
  }
});

/* ========================================================
   HAMBURGER MENU
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  if (menuToggle && sideMenu && menuOverlay) {
    // Populate side menu
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const homeLink = isAdmin ? "admin-home.html" : "home.html";

    sideMenu.innerHTML = `
      <div class="side-menu-header">
        <h3>Menu</h3>
      </div>
      <ul class="side-menu-links">
        <li><a href="${homeLink}">Home</a></li>
        <li><a href="profile.html">Profile</a></li>
        ${!isAdmin ? '<li><a href="my-activity.html">My Activity</a></li>' : ""}
        ${isAdmin ? '<li><a href="admin-users.html">User Management</a></li>' : ""}
        ${isAdmin ? '<li><a href="admin-permits.html">Permit Management</a></li>' : ""}
        <li><a href="#" id="sideLogoutBtn">Logout</a></li>
      </ul>
    `;

    const sideLogoutBtn = document.getElementById("sideLogoutBtn");
    if (sideLogoutBtn) {
      sideLogoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("currentUser");
        window.location.href = indexPath;
      });
    }

    menuToggle.addEventListener("click", () => {
      sideMenu.classList.toggle("active");
      menuOverlay.classList.toggle("active");
    });

    menuOverlay.addEventListener("click", () => {
      sideMenu.classList.remove("active");
      menuOverlay.classList.remove("active");
    });
  }
});
