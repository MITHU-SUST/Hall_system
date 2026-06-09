const complaintId = new URLSearchParams(window.location.search).get('id');
let currentStudent = null;

window.addEventListener('load', async () => {
    const student = localStorage.getItem('student');
    if (!student) {
        window.location.href = 'login.html';
        return;
    }

    currentStudent = JSON.parse(student);
    await loadComplaintDetails();
});

async function loadComplaintDetails() {
    try {
        const response = await fetch(`http://localhost:5000/complaint/details/${complaintId}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById('complaintContainer').innerHTML = `
                        <div class="alert alert-error">${data.error}</div>
                    `;
            return;
        }

        const complaint = data.complaint;
        const messages = data.messages || [];

        const statusBadgeClass = `badge-${complaint.status}`;
        const priorityEmoji = complaint.priority === 'high' ? '🔴' : complaint.priority === 'urgent' ? '⚠️' : '🔵';

        let html = `
    <div class="card mb-3">
        <div class="card-header">
            <h2>${complaint.title}</h2>
        </div>
        <div class="card-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <p><strong>Category:</strong> ${complaint.category_name}</p>
                    <p><strong>Status:</strong> <span class="badge ${statusBadgeClass}">${complaint.status.toUpperCase()}</span></p>
                    <p><strong>Priority:</strong> ${priorityEmoji} ${complaint.priority.toUpperCase()}</p>
                    <p><strong>Filed on:</strong> ${new Date(complaint.created_at).toLocaleString()}</p>
                </div>
                <div>
                    <p><strong>Student Name:</strong> ${complaint.name}</p>
                    <p><strong>Registration No:</strong> ${complaint.reg_no}</p>
                    <p><strong>Room No:</strong> ${complaint.room_no}</p>
                </div>
            </div>

            <div style="border: 1px solid var(--border); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem;">
                <h3>Description</h3>
                <p>${complaint.description}</p>
            </div>
        </div>
    </div>
    `;

        // Display messages
        html += `
    <div class="card">
        <div class="card-header">
            <h3>Messages & Updates (${messages.length})</h3>
        </div>
        <div class="card-body">
            <div id="messagesContainer" style="max-height: 400px; overflow-y: auto;">
                `;

        if (messages.length === 0) {
            html += '<p class="text-muted">No messages yet. The admin will update you soon.</p>';
        } else {
            messages.forEach(msg => {
                const isAdmin = msg.admin_name !== null;
                const bgColor = isAdmin ? 'var(--bg-light)' : 'var(--primary)';
                const textColor = isAdmin ? 'var(--text-dark)' : 'white';
                const alignment = isAdmin ? 'flex-start' : 'flex-end';

                html += `
                            <div style="display: flex; justify-content: ${alignment}; margin-bottom: 1rem;">
                                <div style="background: ${bgColor}; color: ${textColor}; padding: 1rem; border-radius: 0.5rem; max-width: 70%;">
                                    <p style="margin: 0; font-weight: 600;">${isAdmin ? '👨‍💼 ' + msg.admin_name : '🎓 You'}</p>
                                    <p style="margin: 0.5rem 0 0 0;">${msg.message}</p>
                                    <small style="opacity: 0.8;">${new Date(msg.created_at).toLocaleString()}</small>
                                </div>
                            </div>
                        `;
            });
        }

        html += `
            </div>
        </div>
        <div class="card-footer">
            <p style="margin: 0; color: var(--text-light); font-size: 0.875rem;">Check this page regularly for updates from the hall authority.</p>
        </div>
    </div>
    `;

        document.getElementById('complaintContainer').innerHTML = html;
    } catch (error) {
        document.getElementById('complaintContainer').innerHTML = `
                    <div class="alert alert-error">Error loading complaint: ${error.message}</div>
                `;
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('student');
        window.location.href = 'login.html';
    }
}
