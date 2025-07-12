// Live Chat System for The Anti-Iowa Cult - GitHub Pages Version
class LiveChat {
    constructor() {
        this.username = null;
        this.socket = null;
        this.isConnected = false;
        this.messages = [];
        this.isMinimized = false;
        this.backendUrl = 'https://iowa.onrender.com'; // Your Render URL
        this.init();
    }

    init() {
        this.createChatWidget();
        this.loadUsername();
        this.connectWebSocket();
        this.bindEvents();
    }

    createChatWidget() {
        const chatHTML = `
            <div id="chat-widget" class="chat-widget">
                <div class="chat-header">
                    <span class="chat-title">🌽 Live Chat</span>
                    <div class="connection-status" id="connection-status"></div>
                    <div class="chat-controls">
                        <button class="chat-minimize" id="chat-minimize">−</button>
                        <button class="chat-close" id="chat-close">×</button>
                    </div>
                </div>
                
                <div class="chat-body" id="chat-body">
                    <div class="chat-messages" id="chat-messages">
                        <div class="system-message">Welcome to The Anti-Iowa Cult live chat! 🌽</div>
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="username-section" id="username-section">
                            <input type="text" id="username-input" placeholder="Enter your username..." maxlength="20">
                            <button id="set-username">Join Chat</button>
                        </div>
                        
                        <div class="message-section" id="message-section" style="display: none;">
                            <div class="message-input-container">
                                <input type="text" id="message-input" placeholder="Type your message..." maxlength="500">
                                <button id="send-message">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    loadUsername() {
        this.username = localStorage.getItem('chat-username');
        if (this.username) {
            this.showMessageSection();
            // If WebSocket is already connected, send join message
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.sendJoinMessage();
            }
        }
    }

    connectWebSocket() {
        // Connect to deployed backend server
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${this.backendUrl.replace(/^https?:\/\//, '')}`;
        
        try {
            this.socket = new WebSocket(wsUrl);
            
            this.socket.onopen = () => {
                this.isConnected = true;
                this.updateConnectionStatus('connected');
                this.addSystemMessage('Connected to chat server');
                console.log('WebSocket connected');
                
                // If username is already set, send join message
                if (this.username) {
                    this.sendJoinMessage();
                }
            };
            
            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.socket.onclose = () => {
                this.isConnected = false;
                this.updateConnectionStatus('disconnected');
                this.addSystemMessage('Disconnected from chat server');
                console.log('WebSocket disconnected');
                
                // Try to reconnect after 5 seconds
                setTimeout(() => {
                    if (!this.isConnected) {
                        this.connectWebSocket();
                    }
                }, 5000);
            };
            
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus('error');
                this.addSystemMessage('Connection error - trying to reconnect...');
            };
            
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            this.addSystemMessage('Failed to connect to chat server');
        }
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'history':
                // Load recent messages
                data.messages.forEach(msg => {
                    this.addMessage(msg.username, msg.message, false);
                });
                break;
                
            case 'message':
                if (data.username !== this.username) {
                    this.addMessage(data.username, data.message, false);
                }
                break;
                
            case 'userJoined':
                this.addSystemMessage(`${data.username} joined the chat`);
                break;
                
            case 'userLeft':
                this.addSystemMessage(`${data.username} left the chat`);
                break;
                
            case 'users':
                // Update online users count (could be displayed in UI)
                console.log('Online users:', data.users);
                break;
                
            case 'typing':
                // Handle typing indicators
                break;
                
            case 'error':
                this.addSystemMessage(`Error: ${data.message}`);
                break;
        }
    }

    bindEvents() {
        // Username setting
        document.getElementById('set-username').addEventListener('click', () => {
            this.setUsername();
        });

        document.getElementById('username-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setUsername();
            }
        });

        // Message sending
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Chat controls
        document.getElementById('chat-minimize').addEventListener('click', () => {
            this.toggleMinimize();
        });

        document.getElementById('chat-close').addEventListener('click', () => {
            this.closeChat();
        });
    }

    setUsername() {
        const usernameInput = document.getElementById('username-input');
        const username = usernameInput.value.trim();
        
        if (username.length < 2) {
            alert('Username must be at least 2 characters long!');
            return;
        }
        
        if (username.length > 20) {
            alert('Username must be 20 characters or less!');
            return;
        }
        
        this.username = username;
        localStorage.setItem('chat-username', username);
        this.showMessageSection();
        
        // Send join message to WebSocket server
        this.sendJoinMessage();
        
        this.addSystemMessage(`Welcome, ${username}! You're now chatting.`);
    }

    showMessageSection() {
        document.getElementById('username-section').style.display = 'none';
        document.getElementById('message-section').style.display = 'block';
        document.getElementById('message-input').focus();
    }

    sendJoinMessage() {
        if (this.username && this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('Sending join message for username:', this.username);
            this.socket.send(JSON.stringify({
                type: 'join',
                username: this.username
            }));
        } else {
            console.log('Cannot send join message:', {
                hasUsername: !!this.username,
                hasSocket: !!this.socket,
                socketState: this.socket ? this.socket.readyState : 'no socket'
            });
        }
    }

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        if (!statusElement) return;
        
        statusElement.className = `connection-status ${status}`;
        
        switch (status) {
            case 'connected':
                statusElement.title = 'Connected';
                break;
            case 'disconnected':
                statusElement.title = 'Disconnected';
                break;
            case 'error':
                statusElement.title = 'Connection Error';
                break;
            default:
                statusElement.title = 'Connecting...';
        }
    }

    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (!message) return;
        
        if (!this.username) {
            this.addSystemMessage('Please set a username first!');
            // Show username section again
            document.getElementById('username-section').style.display = 'flex';
            document.getElementById('message-section').style.display = 'none';
            document.getElementById('username-input').focus();
            return;
        }
        
        // Send message to WebSocket server
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'message',
                message: message
            }));
            
            // Add message to local display immediately
            this.addMessage(this.username, message, true);
            messageInput.value = '';
        } else {
            this.addSystemMessage('Not connected to chat server - trying to reconnect...');
            // Try to reconnect
            setTimeout(() => {
                this.connectWebSocket();
            }, 2000);
        }
    }

    addMessage(username, message, isOwn) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isOwn ? 'own-message' : 'other-message'}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-username">${username}</span>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-content">${this.escapeHtml(message)}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Store message
        this.messages.push({
            username,
            message,
            timestamp: new Date(),
            isOwn
        });
        
        // Keep only last 100 messages
        if (this.messages.length > 100) {
            this.messages.shift();
        }
    }

    addSystemMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        messageDiv.textContent = message;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    toggleMinimize() {
        const chatBody = document.getElementById('chat-body');
        const minimizeBtn = document.getElementById('chat-minimize');
        
        if (this.isMinimized) {
            chatBody.style.display = 'block';
            minimizeBtn.textContent = '−';
            this.isMinimized = false;
        } else {
            chatBody.style.display = 'none';
            minimizeBtn.textContent = '+';
            this.isMinimized = true;
        }
    }

    closeChat() {
        const chatWidget = document.getElementById('chat-widget');
        chatWidget.style.display = 'none';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.liveChat = new LiveChat();
}); 