const resetPasswordForm = document.getElementById('resetPasswordForm');
const alertBox = document.getElementById('alertBox');
const reg_noField = document.getElementById('reg_no');

// Load data from sessionStorage
window.addEventListener('load', () => {
    const resetToken = sessionStorage.getItem('resetToken');
    const reg_no = sessionStorage.getItem('resetReg_no');

    if (!resetToken || !reg_no) {
        showAlert('⚠️ Invalid session. Please request a new password reset.', 'error');
        setTimeout(() => {
            window.location.href = 'forgot-password.html';
        }, 2000);
        return;
    }

    reg_noField.value = reg_no;
});

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const reg_no = document.getElementById('reg_no').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const resetToken = sessionStorage.getItem('resetToken');

    // Validate passwords
    if (newPassword.length < 4) {
        showAlert('Password must be at least 4 characters long', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/student/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reg_no,
                newPassword,
                token: resetToken
            })
        });

        const data = await response.json();

        if (data.error) {
            showAlert(data.error, 'error');
        } else {
            showAlert('✅ ' + data.message, 'success');
            // Clear sessionStorage
            sessionStorage.removeItem('resetToken');
            sessionStorage.removeItem('resetReg_no');

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
