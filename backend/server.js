const http = require('http');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, 'users.json');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    if (req.url === '/register' && req.method === 'POST') {
        collectData(req, (data) => {
            const { username, password } = JSON.parse(data);
            const users = JSON.parse(fs.readFileSync(usersFile));
            if (users.find(u => u.username === username)) {
                return sendJSON(res, 400, { message: 'User already exists' });
            }
            users.push({ username, password });
            fs.writeFileSync(usersFile, JSON.stringify(users));
            sendJSON(res, 201, { message: 'User registered successfully' });
        });
    } else if (req.url === '/login' && req.method === 'POST') {
        collectData(req, (data) => {
            const { username, password } = JSON.parse(data);
            const users = JSON.parse(fs.readFileSync(usersFile));
            const user = users.find(u => u.username === username);
            if (!user) return sendJSON(res, 404, { message: 'User not found' });
            if (user.password !== password) {
                return sendJSON(res, 401, { message: 'Incorrect password' });
            }
            sendJSON(res, 200, { message: 'Login successful', username });
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

function collectData(req, callback) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => callback(body));
}

function sendJSON(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
}

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
