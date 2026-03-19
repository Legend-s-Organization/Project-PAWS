/**********************************************************
 * NU PROJECT PAWS - ADMIN JAVASCRIPT
 **********************************************************/

document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.getElementById("userTableBody");
  const editModal = document.getElementById("editModal");
  const editUsernameInput = document.getElementById("editUsername");
  const editPasswordInput = document.getElementById("editPassword");
  const saveUserBtn = document.getElementById("saveUserBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  let currentEditingUser = null;

  function loadUsers() {
    const raw = localStorage.getItem("accounts");
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function saveUsers(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }

  function renderTable() {
    const accounts = loadUsers();
    userTableBody.innerHTML = "";

    accounts.forEach((acc, index) => {
      // Don't show admin accounts for deletion or editing here for safety
      if (acc.isAdmin) return;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${acc.user}</td>
        <td>${acc.pass}</td>
        <td>Student</td>
        <td class="action-btns">
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      userTableBody.appendChild(tr);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        const account = accounts[index];
        openEditModal(account, index);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        if (confirm("Are you sure you want to delete this account?")) {
          deleteUser(index);
        }
      });
    });
  }

  function openEditModal(account, index) {
    currentEditingUser = { ...account, index };
    editUsernameInput.value = account.user;
    editPasswordInput.value = account.pass;
    editModal.style.display = "block";
  }

  function closeEditModal() {
    editModal.style.display = "none";
    currentEditingUser = null;
  }

  function deleteUser(index) {
    const accounts = loadUsers();
    accounts.splice(index, 1);
    saveUsers(accounts);
    renderTable();
  }

  saveUserBtn.addEventListener("click", () => {
    if (!currentEditingUser) return;

    const newUsername = editUsernameInput.value.trim();
    const newPassword = editPasswordInput.value.trim();

    if (!newUsername || !newPassword) {
      alert("Please fill in both fields.");
      return;
    }

    const accounts = loadUsers();
    accounts[currentEditingUser.index].user = newUsername;
    accounts[currentEditingUser.index].pass = newPassword;

    saveUsers(accounts);
    closeEditModal();
    renderTable();
  });

  cancelEditBtn.addEventListener("click", closeEditModal);

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === editModal) {
      closeEditModal();
    }
  });

  // Initial render
  renderTable();
});
