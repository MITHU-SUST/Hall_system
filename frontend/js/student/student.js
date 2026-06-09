const API = "http://localhost:5000";

let currentStudent = null;

// Load student data on page load
window.addEventListener('load', () => {
    const student = localStorage.getItem('student');
    if (student) {
        currentStudent = JSON.parse(student);
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('student');
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
function submitComplaint() {
    fetch(`${API}/complaint/add`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            student_id: studentId,
            title: document.getElementById("title").value,
            description: document.getElementById("desc").value,
            category: document.getElementById("category").value
        })
    }).then(() => loadComplaints());
}
function logout(){
    studentId = null;
    window.location.href = "login.html";
}
function showProfile(){
    document.getElementById("profile").innerHTML =
    "Logged in Student ID: " + studentId;
}
function searchComplaint(){
    let value = document.getElementById("search").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.style.display =
        card.innerText.toLowerCase().includes(value)
        ? "block" : "none";
    });
}

// 🟢 LOAD COMPLAINTS
function loadComplaints() {
    fetch(`${API}/complaint/student/${studentId}`)
    .then(res => res.json())
    .then(data => {
        const box = document.getElementById("list");
        box.innerHTML = "";

        data.forEach(c => {
            box.innerHTML += `
                <div class="card">
                    <h4>${c.title}</h4>
                    <p>${c.description}</p>
                    <p>Status: ${c.status}</p>
                    <p>Reply: ${c.reply || "No reply yet"}</p>
                </div>
            `;
        });
    });
}