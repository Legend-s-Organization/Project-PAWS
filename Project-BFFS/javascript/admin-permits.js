/**********************************************************
 * NU PROJECT PAWS - ADMIN PERMIT MANAGEMENT JAVASCRIPT
 **********************************************************/

document.addEventListener("DOMContentLoaded", () => {
  const permitTableBody = document.getElementById("permitTableBody");
  const viewModal = document.getElementById("viewModal");
  const permitDetails = document.getElementById("permitDetails");
  const approveBtn = document.getElementById("approveBtn");
  const rejectBtn = document.getElementById("rejectBtn");
  const closeViewBtn = document.getElementById("closeViewBtn");

  let currentPermitId = null;

  async function renderTable() {
    try {
      const response = await fetch("../backend/api/get_permits.php");
      const result = await response.json();

      if (!result.success) {
        permitTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${result.message}</td></tr>`;
        return;
      }

      const permits = result.permits;
      permitTableBody.innerHTML = "";

      if (permits.length === 0) {
        permitTableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center;">No permit requests found.</td>
          </tr>
        `;
        return;
      }

      permits.forEach((permit) => {
        const tr = document.createElement("tr");
        const statusClass = `status-${permit.status.toLowerCase()}`;

        tr.innerHTML = `
          <td>${permit.student_id}</td>
          <td>${permit.permit_type}</td>
          <td>${permit.event_date}</td>
          <td class="${statusClass}">${permit.status}</td>
          <td class="action-btns">
            <button class="view-btn" data-id="${permit.id}">View Details</button>
            <button class="delete-btn" data-id="${permit.id}">Delete</button>
          </td>
        `;
        permitTableBody.appendChild(tr);
      });

      // Add event listeners
      document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(e.target.getAttribute("data-id"));
          openViewModal(id, permits);
        });
      });

      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          if (
            confirm(
              "Are you sure you want to delete this permit and all associated files?",
            )
          ) {
            await deletePermit(id);
          }
        });
      });
    } catch (err) {
      permitTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Error connecting to server.</td></tr>`;
    }
  }

  async function deletePermit(id) {
    try {
      const response = await fetch("../backend/api/delete_permit.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        renderTable();
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  }

  function openViewModal(id, permits) {
    const permit = permits.find((p) => parseInt(p.id) === id);
    if (!permit) return;

    currentPermitId = id;
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
      <div>Student ID:</div> <div>${permit.student_id}</div>
      <div>Permit Type:</div> <div>${permit.permit_type}</div>
      <div>Submitted On:</div> <div>${permit.submitted_at}</div>
      <div>Event Date:</div> <div>${permit.event_date}</div>
      <div>Purpose:</div> <div>${permit.purpose}</div>
      <div>Status:</div> <div class="${statusClass}">${permit.status}</div>
      <hr style="grid-column: span 2; width: 100%;" />
      <div style="grid-column: span 2; font-weight: bold;">Submissions:</div>
      ${filesHtml}
    `;

    // Only show approve/reject if status is Pending
    if (permit.status === "Pending") {
      approveBtn.style.display = "block";
      rejectBtn.style.display = "block";
    } else {
      approveBtn.style.display = "none";
      rejectBtn.style.display = "none";
    }

    viewModal.style.display = "block";
  }

  async function updatePermitStatus(status) {
    if (!currentPermitId) return;

    try {
      const response = await fetch("../backend/api/update_permit_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentPermitId, status: status }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Permit has been ${status}.`);
        renderTable();
        closeViewModal();
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  }

  approveBtn.addEventListener("click", () => updatePermitStatus("Approved"));
  rejectBtn.addEventListener("click", () => updatePermitStatus("Rejected"));
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
