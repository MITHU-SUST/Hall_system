
const loginForm = document.getElementById('loginForm');
const alertBox = document.getElementById('alertBox');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const reg_no = document.getElementById('reg_no').value;

    // Validate registration number
    if (!/^\d{10}$/.test(reg_no)) {
        showAlert('Registration number must be exactly 10 digits', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/student/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reg_no })
        });

        const data = await response.json();

        if (data.error) {
            showAlert(data.error, 'error');
        } else {
            // Store student data in localStorage
            localStorage.setItem('student', JSON.stringify(data));
            showAlert('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
});

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertBox.innerHTML = '';
    alertBox.appendChild(alertDiv);
}
