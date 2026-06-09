
const loginForm = document.getElementById('adminLoginForm');
const alertBox = document.getElementById('alertBox');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log("INPUT ELEMENT:", document.getElementById('admin_id'));
    console.log("VALUE:", document.getElementById('admin_id')?.value);

    const admin_id = document.getElementById('admin_id').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_id, password })
        });

        const data = await response.json();

        if (data.error) {
            showAlert(data.error, 'error');
        } else {
            // Store admin data in localStorage
            localStorage.setItem('admin', JSON.stringify(data.admin));
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
