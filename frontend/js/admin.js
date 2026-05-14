const API = "http://localhost:5000";

let currentAdmin = null;

// Load admin data on page load
window.addEventListener('load', () => {
    const admin = localStorage.getItem('admin');
    if (admin) {
        currentAdmin = JSON.parse(admin);
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin');
        window.location.href = 'login.html';
    }
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.innerHTML = '';
        alertBox.appendChild(alertDiv);
    }
}

// Fetch with error handling
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return { error: error.message };
    }
}

// Load all complaints
async function loadAllComplaints() {
    const data = await fetchAPI(`${API}/complaint/all`);
    return data;
}

// Update complaint status
async function updateComplaintStatus(id, status) {
    const data = await fetchAPI(`${API}/complaint/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    return data;
}

// Add message to complaint
async function addMessageToComplaint(id, adminId, message) {
    const data = await fetchAPI(`${API}/complaint/message/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId, message })
    });
    return data;
}