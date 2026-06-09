
const registerForm = document.getElementById('registerForm');
const alertBox = document.getElementById('alertBox');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const reg_no = document.getElementById('reg_no').value;
    const room_no = document.getElementById('room_no').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    // Validate registration number
    if (!/^\d{10}$/.test(reg_no)) {
        showAlert('Registration number must be exactly 10 digits', 'error');
        return;
    }

    // Validate password
    if (password.length < 4) {
        showAlert('Password must be at least 4 characters long', 'error');
        return;
    }

    // Check if passwords match
    if (password !== confirm_password) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/student/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reg_no, name, room_no, password })
        });

        const data = await response.json();

        if (data.error) {
            showAlert(data.error, 'error');
        } else {
            showAlert('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
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
