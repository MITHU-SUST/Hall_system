
let currentStudent = null;

// Load student data on page load
window.addEventListener('load', () => {
    const student = localStorage.getItem('student');
    if (!student) {
        window.location.href = 'login.html';
        return;
    }

    currentStudent = JSON.parse(student);
    displayStudentInfo();
    loadDashboardData();
    loadComplaints();
});

function displayStudentInfo() {
    document.getElementById('studentName').textContent = `👋 ${currentStudent.name}`;
    document.getElementById('dashName').textContent = currentStudent.name;
    document.getElementById('dashRegNo').textContent = currentStudent.reg_no;
    document.getElementById('dashRoomNo').textContent = currentStudent.room_no;

    document.getElementById('profileName').textContent = currentStudent.name;
    document.getElementById('profileRegNo').textContent = currentStudent.reg_no;
    document.getElementById('profileRoomNo').textContent = currentStudent.room_no;
    document.getElementById('profileJoinDate').textContent = new Date().toLocaleDateString();
}

async function loadDashboardData() {
    try {
        const response = await fetch(`http://localhost:5000/complaint/student/${currentStudent.id}`);
        const complaints = await response.json();

        let pending = 0, solving = 0, solved = 0;
        complaints.forEach(c => {
            if (c.status === 'pending') pending++;
            else if (c.status === 'solving') solving++;
            else if (c.status === 'solved') solved++;
        });

        document.getElementById('countPending').textContent = pending;
        document.getElementById('countSolving').textContent = solving;
        document.getElementById('countSolved').textContent = solved;

        displayRecentComplaints(complaints.slice(0, 5));
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function displayRecentComplaints(complaints) {
    const container = document.getElementById('recentComplaints');
    container.innerHTML = '';

    if (complaints.length === 0) {
        container.innerHTML = '<p class="text-muted">No complaints filed yet.</p>';
        return;
    }

    complaints.forEach(complaint => {
        const badgeClass = `badge-${complaint.status}`;
        const item = `
    <div class="complaint-item">
        <div class="complaint-info">
            <h3>${complaint.title}</h3>
            <div class="complaint-meta">
                <span>${complaint.category_name}</span> •
                <span>${new Date(complaint.created_at).toLocaleDateString()}</span>
            </div>
        </div>
        <div class="complaint-status">
            <span class="badge ${badgeClass}">${complaint.status.toUpperCase()}</span>
            <button class="btn btn-sm btn-primary" onclick="viewComplaint(${complaint.id})">View</button>
        </div>
    </div>
    `;
        container.innerHTML += item;
    });
}

async function loadComplaints() {
    try {
        const response = await fetch(`http://localhost:5000/complaint/student/${currentStudent.id}`);
        const complaints = await response.json();
        displayComplaints(complaints);
    } catch (error) {
        console.error('Error loading complaints:', error);
    }
}

function displayComplaints(complaints) {
    const container = document.getElementById('complaintsList');
    container.innerHTML = '';

    if (complaints.length === 0) {
        container.innerHTML = '<p class="text-muted">You have not filed any complaints yet.</p>';
        return;
    }

    complaints.forEach(complaint => {
        const badgeClass = `badge-${complaint.status}`;
        const item = `
    <div class="complaint-item">
        <div class="complaint-info">
            <h3>${complaint.title}</h3>
            <div class="complaint-meta">
                <strong>${complaint.category_name}</strong> •
                ${new Date(complaint.created_at).toLocaleDateString()} •
                <span class="badge ${badgeClass}">${complaint.status.toUpperCase()}</span>
            </div>
            <p style="margin-top: 0.5rem; color: var(--text-light);">${complaint.description.substring(0, 100)}...</p>
        </div>
        <button class="btn btn-sm btn-primary" onclick="viewComplaint(${complaint.id})">View Details</button>
    </div>
    `;
        container.innerHTML += item;
    });
}

function viewComplaint(id) {
    window.location.href = `complaint-details.html?id=${id}`;
}

document.getElementById('complaintForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const category_id = document.getElementById('category').value;
    const title = document.getElementById('complaintTitle').value;
    const description = document.getElementById('complaintDesc').value;
    const priority = document.getElementById('priority').value;

    try {
        const response = await fetch('http://localhost:5000/complaint/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: currentStudent.id,
                category_id,
                title,
                description,
                priority
            })
        });

        const data = await response.json();

        if (data.error) {
            showAlert(data.error, 'error');
        } else {
            showAlert('Complaint submitted successfully!', 'success');
            document.getElementById('complaintForm').reset();
            setTimeout(() => {
                loadComplaints();
                loadDashboardData();
                showSection('my-complaints');
            }, 1500);
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
});

document.getElementById('searchBox').addEventListener('keyup', async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const response = await fetch(`http://localhost:5000/complaint/student/${currentStudent.id}`);
    const complaints = await response.json();

    const filtered = complaints.filter(c =>
        c.title.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm) ||
        c.category_name.toLowerCase().includes(searchTerm)
    );

    displayComplaints(filtered);
});

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

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.getElementById('complaintAlert').innerHTML = '';
    document.getElementById('complaintAlert').appendChild(alertDiv);
}

// 🟢 CHANGE PASSWORD HANDLER
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword.length < 4) {
        showAlertChangePassword('Password must be at least 4 characters', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showAlertChangePassword('New passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/student/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: currentStudent.id,
                currentPassword,
                newPassword
            })
        });

        const data = await response.json();

        if (data.error) {
            showAlertChangePassword(data.error, 'error');
        } else {
            showAlertChangePassword('✅ ' + data.message, 'success');
            document.getElementById('changePasswordForm').reset();
            setTimeout(() => {
                logout();
            }, 2000);
        }
    } catch (error) {
        showAlertChangePassword('Error: ' + error.message, 'error');
    }
});

function showAlertChangePassword(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.getElementById('changePasswordAlert').innerHTML = '';
    document.getElementById('changePasswordAlert').appendChild(alertDiv);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('student');
        window.location.href = 'login.html';
    }
}

// 📥 DOWNLOAD PROFILE DATA
async function downloadProfile() {
    try {
        showAlertProfile('⏳ Preparing your data for download...', 'info');

        // Fetch all complaints
        const complaintsResponse = await fetch(`http://localhost:5000/complaint/student/${currentStudent.id}`);
        const complaints = await complaintsResponse.json();

        const profileData = {
            personal_information: {
                name: currentStudent.name,
                registration_number: currentStudent.reg_no,
                room_number: currentStudent.room_no,
                email: currentStudent.email,
                phone: currentStudent.phone,
                student_id: currentStudent.id
            },
            account_summary: {
                total_complaints: complaints.length,
                pending_complaints: complaints.filter(c => c.status === 'pending').length,
                solving_complaints: complaints.filter(c => c.status === 'solving').length,
                solved_complaints: complaints.filter(c => c.status === 'solved').length
            },
            complaints: complaints.map(complaint => ({
                complaint_id: complaint.id,
                title: complaint.title,
                category: complaint.category_name,
                description: complaint.description,
                priority: complaint.priority,
                status: complaint.status,
                created_date: new Date(complaint.created_at).toLocaleString(),
                updated_date: complaint.updated_at ? new Date(complaint.updated_at).toLocaleString() : 'N/A'
            })),
            download_info: {
                downloaded_at: new Date().toLocaleString(),
                file_version: '1.0'
            }
        };

        const dataStr = JSON.stringify(profileData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user_data_${currentStudent.reg_no}_${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showAlertProfile('✅ All your data has been downloaded successfully!', 'success');
    } catch (error) {
        showAlertProfile('❌ Error downloading data: ' + error.message, 'error');
        console.error('Download error:', error);
    }
}

// 🗑️ DELETE ACCOUNT
function deleteAccount() {
    const confirmDelete = confirm(
        '⚠️ WARNING: This action cannot be undone!\n\n' +
        'Deleting your account will:\n' +
        '• Remove all your personal data\n' +
        '• Delete all your complaints\n' +
        '• Permanently close your account\n\n' +
        'Are you sure you want to delete your account?'
    );

    if (!confirmDelete) return;

    const finalConfirm = confirm('Are you absolutely certain? This action is IRREVERSIBLE!');
    if (!finalConfirm) return;

    deleteAccountConfirmed();
}

async function deleteAccountConfirmed() {
    try {
        const response = await fetch(`http://localhost:5000/student/delete-account`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: currentStudent.id
            })
        });

        const data = await response.json();

        if (data.error) {
            showAlertProfile(data.error, 'error');
        } else {
            showAlertProfile('✅ ' + data.message, 'success');
            setTimeout(() => {
                localStorage.removeItem('student');
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        showAlertProfile('Error: ' + error.message, 'error');
    }
}

function showAlertProfile(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.getElementById('profileAlert').innerHTML = '';
    document.getElementById('profileAlert').appendChild(alertDiv);
}
