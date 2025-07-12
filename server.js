const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.static('.')); // Serve static files from current directory
app.use(express.json());

// Store connected users and messages
const connectedUsers = new Map();
const messages = [];
const MAX_MESSAGES = 100;

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New client connected');
    
    let username = null;
    
    // Send recent messages to new user
    const recentMessages = messages.slice(-20);
    ws.send(JSON.stringify({
        type: 'history',
        messages: recentMessages
    }));
    
    // Send current online users
    const onlineUsers = Array.from(connectedUsers.keys());
    ws.send(JSON.stringify({
        type: 'users',
        users: onlineUsers
    }));
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'join':
                    username = message.username;
                    connectedUsers.set(username, ws);
                    
                    // Broadcast user joined
                    broadcast({
                        type: 'userJoined',
                        username: username,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Update online users list
                    broadcast({
                        type: 'users',
                        users: Array.from(connectedUsers.keys())
                    });
                    
                    console.log(`${username} joined the chat`);
                    break;
                    
                case 'message':
                    if (!username) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Please set a username first'
                        }));
                        return;
                    }
                    
                    const chatMessage = {
                        type: 'message',
                        username: username,
                        message: message.message,
                        timestamp: new Date().toISOString()
                    };
                    
                    // Store message
                    messages.push(chatMessage);
                    if (messages.length > MAX_MESSAGES) {
                        messages.shift();
                    }
                    
                    // Broadcast to all clients
                    broadcast(chatMessage);
                    console.log(`${username}: ${message.message}`);
                    break;
                    
                case 'typing':
                    broadcast({
                        type: 'typing',
                        username: username,
                        isTyping: message.isTyping
                    });
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        if (username) {
            connectedUsers.delete(username);
            
            // Broadcast user left
            broadcast({
                type: 'userLeft',
                username: username,
                timestamp: new Date().toISOString()
            });
            
            // Update online users list
            broadcast({
                type: 'users',
                users: Array.from(connectedUsers.keys())
            });
            
            console.log(`${username} left the chat`);
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Broadcast message to all connected clients
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        connectedUsers: connectedUsers.size,
        totalMessages: messages.length,
        uptime: process.uptime()
    });
});

app.get('/api/messages', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const recentMessages = messages.slice(-limit);
    res.json(recentMessages);
});

app.get('/api/users', (req, res) => {
    res.json(Array.from(connectedUsers.keys()));
});

// Health check endpoint for cloud platforms
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🌽 Anti-Iowa Chat Server running on port ${PORT}`);
    console.log(`🌽 WebSocket server ready for connections`);
    console.log(`🌽 Visit http://localhost:${PORT} to join the cult chat!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🌽 Shutting down chat server...');
    server.close(() => {
        console.log('🌽 Chat server closed');
        process.exit(0);
    });
}); 