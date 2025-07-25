const API_URL = 'http://localhost:3000';

async function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    document.getElementById('registerMessage').textContent = data.message;
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    const msg = document.getElementById('loginMessage');

    if (response.ok) {
        msg.textContent = data.message;
        document.getElementById('welcomeUser').textContent = data.username;
        document.getElementById('welcome').style.display = 'block';
    } else {
        msg.textContent = data.message;
    }
}
