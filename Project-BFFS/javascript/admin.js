/**********************************************************
 * NU PROJECT PAWS - ADMIN JAVASCRIPT
 **********************************************************/

document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.getElementById("userTableBody");
  const userSearch = document.getElementById("userSearch");
  const gradeFilter = document.getElementById("gradeFilter");

  let allUsers = [];

  async function loadUsers() {
    try {
      const response = await fetch("../backend/api/get_users.php");
      const result = await response.json();

      if (result.success) {
        allUsers = result.users;
        renderTable(allUsers);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  }

  function renderTable(users) {
    userTableBody.innerHTML = "";

    users.forEach((acc) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${acc.student_id}</td>
        <td>${acc.grade_level || "N/A"}</td>
        <td>${acc.role.charAt(0).toUpperCase() + acc.role.slice(1)}</td>
        <td class="action-btns">
          ${acc.role !== "admin" ? `<button class="delete-btn" data-id="${acc.id}">Delete</button>` : '<span style="color: #999; font-size: 12px;">Protected</span>'}
        </td>
      `;
      userTableBody.appendChild(tr);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this account?")) {
          await deleteUser(id);
        }
      });
    });
  }

  async function deleteUser(id) {
    try {
      const response = await fetch("../backend/api/delete_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        loadUsers();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  }

  function filterUsers() {
    const term = userSearch.value.toLowerCase().trim();
    const grade = gradeFilter.value;

    const filtered = allUsers.filter((u) => {
      const matchesSearch = u.student_id.toLowerCase().includes(term);
      const matchesGrade = grade === "" || u.grade_level === grade;
      return matchesSearch && matchesGrade;
    });

    renderTable(filtered);
  }

  if (userSearch) userSearch.addEventListener("input", filterUsers);
  if (gradeFilter) gradeFilter.addEventListener("change", filterUsers);

  // Initial load
  loadUsers();
});
