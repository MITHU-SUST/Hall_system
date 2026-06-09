let currentAdmin = null;
let allComplaints = [];

window.addEventListener('load', () => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
        window.location.href = 'login.html';
        return;
    }

    currentAdmin = JSON.parse(admin);
    document.getElementById('adminName').textContent = `👋 ${currentAdmin.name}`;
    loadAllComplaints();
});

async function loadAllComplaints() {
    try {
        const response = await fetch('http://localhost:5000/complaint/all');
        allComplaints = await response.json();

        updateDashboard();
        displayAllComplaints(allComplaints);
        displayByStatus('pending', 'pendingComplaints');
        displayByStatus('solving', 'solvingComplaints');
        displayByStatus('solved', 'solvedComplaints');
    } catch (error) {
        console.error('Error loading complaints:', error);
    }
}

function updateDashboard() {
    const total = allComplaints.length;
    const pending = allComplaints.filter(c => c.status === 'pending').length;
    const solved = allComplaints.filter(c => c.status === 'solved').length;

    document.getElementById('countTotal').textContent = total;
    document.getElementById('countTotalPending').textContent = pending;
    document.getElementById('countTotalSolved').textContent = solved;

    displayDashboardComplaints(allComplaints.slice(0, 5));
}

function displayDashboardComplaints(complaints) {
    const container = document.getElementById('dashboardComplaints');
    container.innerHTML = '';

    if (complaints.length === 0) {
        container.innerHTML = '<p class="text-muted">No complaints yet.</p>';
        return;
    }

    complaints.forEach(complaint => {
        const badgeClass = `badge-${complaint.status}`;
        const item = `
                    <div class="complaint-item" style="cursor: pointer;" onclick="openComplaintModal(${complaint.id})">
                        <div class="complaint-info">
                            <h3>${complaint.title}</h3>
                            <div class="complaint-meta">
                                <strong>${complaint.name}</strong> (${complaint.reg_no}) • Room ${complaint.room_no}
                                <br><span>${complaint.category_name}</span> • ${new Date(complaint.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="complaint-status">
                            <span class="badge ${badgeClass}">${complaint.status.toUpperCase()}</span>
                        </div>
                    </div>
                `;
        container.innerHTML += item;
    });
}

function displayAllComplaints(complaints) {
    const container = document.getElementById('allComplaintsList');
    container.innerHTML = '';

    if (complaints.length === 0) {
        container.innerHTML = '<p class="text-muted">No complaints found.</p>';
        return;
    }

    complaints.forEach(complaint => {
        const badgeClass = `badge-${complaint.status}`;
        const item = `
                    <div class="complaint-item" style="cursor: pointer;" onclick="openComplaintModal(${complaint.id})">
                        <div class="complaint-info">
                            <h3>${complaint.title}</h3>
                            <div class="complaint-meta">
                                <strong>${complaint.name}</strong> (${complaint.reg_no}) • Room ${complaint.room_no}
                                <br><span>${complaint.category_name}</span> • ${new Date(complaint.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="complaint-status">
                            <span class="badge ${badgeClass}">${complaint.status.toUpperCase()}</span>
                        </div>
                    </div>
                `;
        container.innerHTML += item;
    });
}

function displayByStatus(status, containerId) {
    const filtered = allComplaints.filter(c => c.status === status);
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-muted">No ${status} complaints.</p>`;
        return;
    }

    filtered.forEach(complaint => {
        const badgeClass = `badge-${complaint.status}`;
        const item = `
                    <div class="complaint-item" style="cursor: pointer;" onclick="openComplaintModal(${complaint.id})">
                        <div class="complaint-info">
                            <h3>${complaint.title}</h3>
                            <div class="complaint-meta">
                                <strong>${complaint.name}</strong> (${complaint.reg_no}) • Room ${complaint.room_no}
                                <br><span>${complaint.category_name}</span> • ${new Date(complaint.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="complaint-status">
                            <span class="badge ${badgeClass}">${complaint.status.toUpperCase()}</span>
                        </div>
                    </div>
                `;
        container.innerHTML += item;
    });
}

async function openComplaintModal(complaintId) {
    try {
        const response = await fetch(`http://localhost:5000/complaint/details/${complaintId}`);
        const data = await response.json();

        if (data.error) {
            alert('Error loading complaint');
            return;
        }

        const complaint = data.complaint;
        const messages = data.messages || [];

        const statusBadgeClass = `badge-${complaint.status}`;
        const priorityEmoji = complaint.priority === 'high' ? '🔴' : complaint.priority === 'urgent' ? '⚠️' : '🔵';

        let html = `
                    <h2>${complaint.title}</h2>
                    <div style="margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border);">
                        <p><strong>Category:</strong> ${complaint.category_name}</p>
                        <p><strong>Status:</strong> <span class="badge ${statusBadgeClass}">${complaint.status.toUpperCase()}</span></p>
                        <p><strong>Priority:</strong> ${priorityEmoji} ${complaint.priority.toUpperCase()}</p>
                        <p><strong>Student:</strong> ${complaint.name} (${complaint.reg_no}) - Room ${complaint.room_no}</p>
                        <p><strong>Filed on:</strong> ${new Date(complaint.created_at).toLocaleString()}</p>
                    </div>

                    <div style="margin: 1.5rem 0;">
                        <h3>Description</h3>
                        <p>${complaint.description}</p>
                    </div>

                    <div style="margin: 1.5rem 0; padding: 1rem; background: var(--bg-light); border-radius: 0.5rem;">
                        <h3>Messages (${messages.length})</h3>
                        <div style="max-height: 200px; overflow-y: auto;">
                `;

        if (messages.length === 0) {
            html += '<p class="text-muted">No messages yet.</p>';
        } else {
            messages.forEach(msg => {
                html += `
                            <div style="margin-bottom: 1rem; padding: 0.75rem; background: white; border-radius: 0.25rem;">
                                <strong>👨‍💼 ${msg.admin_name || 'System'}</strong>
                                <p style="margin: 0.5rem 0 0 0; color: var(--text-light);">${msg.message}</p>
                                <small>${new Date(msg.created_at).toLocaleString()}</small>
                            </div>
                        `;
            });
        }

        html += `
                        </div>
                    </div>

                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                        <select id="newStatus" style="padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.5rem; flex: 1;">
                            <option value="">Change Status...</option>
                            <option value="pending">🔵 Pending</option>
                            <option value="solving">🔧 Solving</option>
                            <option value="solved">✅ Solved</option>
                        </select>
                        <button class="btn btn-primary" onclick="updateComplaintStatus(${complaintId})">Update Status</button>
                    </div>

                    <div style="margin-top: 1rem;">
                        <textarea id="newMessage" placeholder="Add a message or update..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.5rem; min-height: 80px;"></textarea>
                        <button class="btn btn-success" style="margin-top: 0.5rem;" onclick="addMessage(${complaintId})">Send Message</button>
                    </div>
                `;

        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('complaintModal').style.display = 'block';
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function updateComplaintStatus(complaintId) {
    const status = document.getElementById('newStatus').value;
    if (!status) {
        alert('Please select a status');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/complaint/status/${complaintId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();
        if (data.error) {
            alert('Error updating status');
        } else {
            alert('Status updated successfully!');
            loadAllComplaints();
            closeModal();
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function addMessage(complaintId) {
    const message = document.getElementById('newMessage').value;
    if (!message.trim()) {
        alert('Please enter a message');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/complaint/message/${complaintId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                admin_id: currentAdmin.id,
                message
            })
        });

        const data = await response.json();
        if (data.error) {
            alert('Error sending message');
        } else {
            alert('Message sent successfully!');
            document.getElementById('newMessage').value = '';
            loadAllComplaints();
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

document.getElementById('searchBox').addEventListener('keyup', () => {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    let filtered = allComplaints.filter(c =>
        c.title.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm) ||
        c.name.toLowerCase().includes(searchTerm) ||
        c.reg_no.includes(searchTerm)
    );

    if (statusFilter) {
        filtered = filtered.filter(c => c.status === statusFilter);
    }

    displayAllComplaints(filtered);
});

document.getElementById('statusFilter').addEventListener('change', () => {
    const searchBox = document.getElementById('searchBox');
    searchBox.dispatchEvent(new Event('keyup'));
});

function closeModal() {
    document.getElementById('complaintModal').style.display = 'none';
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin');
        window.location.href = 'login.html';
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('complaintModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
