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
const pageBase = getPageBase();

/* ========================================================
   DEMO ACCOUNT
======================================================== */
const DEMO_USER = "student01";
const DEMO_PASS = "password01";

/* ========================================================
   ACCOUNT STORAGE
======================================================== */
function loadAccounts() {
  try {
    const raw = localStorage.getItem("accounts");
    if (!raw) {
      const initial = [{ user: DEMO_USER, pass: DEMO_PASS }];
      saveAccounts(initial);
      return initial;
    }
    const accounts = JSON.parse(raw);
    const hasDemo = accounts.some(
      (a) => a.user === DEMO_USER && a.pass === DEMO_PASS,
    );
    if (!hasDemo) {
      accounts.unshift({ user: DEMO_USER, pass: DEMO_PASS });
      saveAccounts(accounts);
    }
    return accounts;
  } catch {
    const fallback = [{ user: DEMO_USER, pass: DEMO_PASS }];
    saveAccounts(fallback);
    return fallback;
  }
}

function saveAccounts(accounts) {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

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
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const accounts = loadAccounts();
    const enteredUser = usernameField.value.trim();
    const enteredPass = passwordField.value;

    const valid = accounts.some(
      (acc) => acc.user === enteredUser && acc.pass === enteredPass,
    );

    if (valid) {
      errorMsg.textContent = "";
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", enteredUser);
      window.location.href = pageBase + "home.html";
    } else {
      errorMsg.textContent = "Invalid Student ID or Password";
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
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = newUserField.value.trim();
    const pass = newPassField.value;
    const confirm = confirmPassField.value;

    if (!user || !pass) {
      signupError.textContent = "Please provide a Student ID and Password.";
      signupSuccess.textContent = "";
      return;
    }
    if (pass !== confirm) {
      signupError.textContent = "Passwords do not match.";
      signupSuccess.textContent = "";
      return;
    }

    const accounts = loadAccounts();
    if (accounts.some((acc) => acc.user === user)) {
      signupError.textContent =
        "Student ID already exists. Please choose another.";
      signupSuccess.textContent = "";
      return;
    }

    accounts.push({ user, pass });
    saveAccounts(accounts);

    signupError.textContent = "";
    signupSuccess.textContent = "Account created successfully! Redirecting...";

    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1200);
  });
}

/* ========================================================
   PAGE PROTECTION
======================================================== */
const protectedPages = [
  "home.html",
  "registrar.html",
  "request-documents.html",
  "permits.html",
  "appointments.html",
];
if (protectedPages.some((p) => window.location.pathname.includes(p))) {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/index.html";
  }
}

/* ========================================================
   LOGIN REDIRECT IF ALREADY LOGGED IN
======================================================== */
const isLoginPage =
  window.location.pathname.includes("index.html") ||
  window.location.pathname.endsWith("/");
if (isLoginPage && localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = pageBase + "home.html";
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
      localStorage.removeItem("currentUser");
      window.location.href = "/index.html";
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
    if (text === "Appointments") {
      card.parentElement.addEventListener("click", () => {
        window.location.href = pageBase + "appointments.html";
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
    eventPermitForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const requestForm = document.getElementById("requestForm").files.length;
      const studentId = document.getElementById("studentId").files.length;
      const endorsement = document.getElementById("endorsement").files.length;
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

      alert("Event/Activity Permit submitted successfully! ✅");
      eventPermitForm.reset();
      permitType.value = "";
      eventPermitForm.classList.add("hidden");
    });
  }
});

/* ========================================================
   APPOINTMENT FORM HANDLING (appointments.html)
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const guidanceForm = document.getElementById("guidanceForm");

  if (guidanceForm) {
    guidanceForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const requestForm = document.getElementById("requestForm").value.trim();
      const studentId = document.getElementById("studentId").value.trim();
      const contact = document.getElementById("contact").value.trim();
      const reason = document.getElementById("reason").value;
      const preferredDate = document.getElementById("preferredDate").value;
      const preferredTime = document.getElementById("preferredTime").value;

      if (
        !requestForm ||
        !studentId ||
        !contact ||
        !reason ||
        !preferredDate ||
        !preferredTime
      ) {
        alert("Please complete all required fields before submitting.");
        return;
      }

      alert("Guidance Office Appointment request submitted successfully! ✅");
      guidanceForm.reset();
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
