/**********************************************************
 * NU PROJECT PAWS - MY ACTIVITY JAVASCRIPT
 **********************************************************/

document.addEventListener("DOMContentLoaded", () => {
  const activityTableBody = document.getElementById("activityTableBody");
  const viewModal = document.getElementById("viewModal");
  const permitDetails = document.getElementById("permitDetails");
  const closeViewBtn = document.getElementById("closeViewBtn");

  const studentId = localStorage.getItem("currentUser");

  if (!studentId) {
    window.location.href = "../index.html";
    return;
  }

  async function renderTable() {
    try {
      const response = await fetch(
        `../backend/api/get_student_activity.php?student_id=${studentId}`,
      );
      const result = await response.json();

      if (!result.success) {
        activityTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${result.message}</td></tr>`;
        return;
      }

      const permits = result.permits;
      activityTableBody.innerHTML = "";

      if (permits.length === 0) {
        activityTableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center;">You have not submitted any permit requests yet.</td>
          </tr>
        `;
        return;
      }

      permits.forEach((permit) => {
        const tr = document.createElement("tr");
        const statusClass = `status-${permit.status.toLowerCase()}`;

        tr.innerHTML = `
          <td>${permit.permit_type}</td>
          <td>${permit.event_date}</td>
          <td>${permit.submitted_at}</td>
          <td class="${statusClass}">${permit.status}</td>
          <td>
            <button class="view-btn" data-id="${permit.id}">View Details</button>
          </td>
        `;
        activityTableBody.appendChild(tr);
      });

      // Add event listeners
      document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(e.target.getAttribute("data-id"));
          openViewModal(id, permits);
        });
      });
    } catch (err) {
      activityTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Error connecting to server.</td></tr>`;
    }
  }

  function openViewModal(id, permits) {
    const permit = permits.find((p) => parseInt(p.id) === id);
    if (!permit) return;

    const statusClass = `status-${permit.status.toLowerCase()}`;

    let filesHtml = "";
    if (permit.files && permit.files.length > 0) {
      permit.files.forEach((file) => {
        filesHtml += `<div>${file.name}:</div> <div><a href="../../uploads/${file.path}" target="_blank">View File</a></div>`;
      });
    } else {
      filesHtml = "<div>Files:</div> <div>No files uploaded.</div>";
    }

    permitDetails.innerHTML = `
      <div>Permit Type:</div> <div>${permit.permit_type}</div>
      <div>Submitted On:</div> <div>${permit.submitted_at}</div>
      <div>Event Date:</div> <div>${permit.event_date}</div>
      <div>Purpose:</div> <div>${permit.purpose}</div>
      <div>Status:</div> <div class="${statusClass}">${permit.status}</div>
      <hr style="grid-column: span 2; width: 100%;" />
      <div style="grid-column: span 2; font-weight: bold;">Submissions:</div>
      ${filesHtml}
    `;

    viewModal.style.display = "block";
  }

  function closeViewModal() {
    viewModal.style.display = "none";
  }

  closeViewBtn.addEventListener("click", closeViewModal);

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === viewModal) {
      closeViewModal();
    }
  });

  // Initial render
  renderTable();
});
