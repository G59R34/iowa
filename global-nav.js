// Global Navigation System for Iowa Website
class GlobalNavigation {
    constructor() {
        this.geminiApiKey = 'AIzaSyAgdS69lT4FGH_tPwQ1n5EcBMs80fkOmxc';
        this.corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        this.currentProxyIndex = 0;
        this.chatVisible = false;
        this.navVisible = false;
        this.hideTimeout = null;
        this.apiTested = false;
        this.init();
    }

    // Test API connectivity when chat is first opened
    async testGeminiConnection() {
        if (this.apiTested) return;
        this.apiTested = true;
        
        console.log('Testing Gemini API connection...');
        try {
            const testResponse = await this.tryGeminiAPI('Hello');
            console.log('✅ Gemini API working! Response:', testResponse);
        } catch (error) {
            console.log('❌ Gemini API test failed:', error);
        }
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createNav());
        } else {
            this.createNav();
        }
    }

    createNav() {
        // Create hover trigger area
        const trigger = document.createElement('div');
        trigger.className = 'nav-trigger';
        trigger.id = 'nav-trigger';
        
        // Create navigation container
        const nav = document.createElement('nav');
        nav.className = 'global-nav';
        nav.id = 'global-nav';

        // Create navigation content
        nav.innerHTML = `
            <div class="nav-content">
                <div class="nav-brand">
                    <h1>🌽 Iowa</h1>
                    <span class="brand-subtitle">Premium Experience</span>
                </div>
                
                <div class="nav-menu">
                    <div class="nav-item dropdown">
                        <span class="nav-link">🎮 Games</span>
                        <div class="dropdown-content">
                            <a href="airbus-sim.html">✈️ Airbus Simulator</a>
                            <a href="altima-sim.html">🚗 Altima Simulator</a>
                            <a href="belt-loader.html">📦 Belt Loader</a>
                            <a href="beltloader-game.html">🎯 Belt Loader Game</a>
                            <a href="game.html">🎮 Game Hub</a>
                            <a href="toilet.html">🚽 Toilet Game</a>
                            <a href="turn-signal.html">🚦 Turn Signal</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <span class="nav-link">⚡ Tesla</span>
                        <div class="dropdown-content">
                            <a href="tesla.html">🚗 Tesla Main</a>
                            <a href="tesla-supercharger.html">🔌 Supercharger</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <span class="nav-link">🎵 Entertainment</span>
                        <div class="dropdown-content">
                            <a href="magnitunes.html">🎧 Magnitunes</a>
                            <a href="flying-cutie.html">🐱 Flying Cutie</a>
                            <a href="mrs-sniffles.html">🐾 Mrs. Sniffles</a>
                            <a href="sniffles.html">👃 Sniffles</a>
                            <a href="porcupine-hype.html">🦔 Porcupine Hype</a>
                            <a href="sink-hype.html">🚿 Sink Hype</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <span class="nav-link">🔧 Tools & Utilities</span>
                        <div class="dropdown-content">
                            <a href="magnitcode.html">🧲 Magnitcode Team</a>
                            <a href="clock.html">🕐 Clock</a>
                            <a href="linux.html">🐧 Linux</a>
                            <a href="walmart.html">🛒 Walmart</a>
                            <a href="download-waterstream.html">💧 Waterstream</a>
                            <a href="belt-loader-wiki.html">📚 Belt Loader Wiki</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <span class="nav-link">👥 Community</span>
                        <div class="dropdown-content">
                            <a href="join.html">🤝 Join</a>
                            <a href="cornclub-iracing.html">🏎️ Corn Club iRacing</a>
                            <a href="about.html">ℹ️ About</a>
                            <a href="drama.html">🎭 Drama</a>
                            <a href="evidence.html">📋 Evidence</a>
                            <a href="linda.html">👩 Linda</a>
                            <a href="united.html">🤝 United</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown special-item">
                        <span class="nav-link">🤖 Chat & AI</span>
                        <div class="dropdown-content">
                            <a href="#" class="ai-chat-link">🧠 AI Chat</a>
                            <a href="chat-v2.html">💬 Chat V2</a>
                            <a href="test-chat.html">🧪 Test Chat</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="ai-chat-panel" id="ai-chat-panel">
                <div class="chat-header">
                    <h3>🤖 AI Assistant</h3>
                    <button class="close-chat">&times;</button>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Ask me anything...">
                    <button id="send-message">Send</button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            /* Navigation trigger area */
            .nav-trigger {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 30px;
                z-index: 9999;
                background: transparent;
                cursor: pointer;
            }

            .global-nav {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: 
                    linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(25, 25, 55, 0.95) 50%, rgba(35, 35, 75, 0.92) 100%),
                    linear-gradient(45deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 200, 255, 0.06) 50%, rgba(128, 0, 255, 0.04) 100%);
                box-shadow: 
                    0 12px 48px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(0, 255, 136, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05),
                    0 1px 3px rgba(0, 255, 136, 0.3);
                z-index: 10000;
                font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
                backdrop-filter: blur(25px) saturate(200%);
                -webkit-backdrop-filter: blur(25px) saturate(200%);
                border-bottom: 2px solid rgba(0, 255, 136, 0.4);
                min-height: 80px;
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
                border-radius: 0 0 32px 32px;
                overflow: visible;
            }

            .global-nav::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(0, 255, 136, 0.03) 25%, 
                    rgba(0, 200, 255, 0.02) 50%, 
                    rgba(128, 0, 255, 0.03) 75%, 
                    transparent 100%);
                animation: shimmer 8s ease-in-out infinite;
                pointer-events: none;
            }

            @keyframes shimmer {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }

            .global-nav.show {
                transform: translateY(0);
                opacity: 1;
            }

            .nav-content {
                display: flex;
                align-items: center;
                max-width: 1500px;
                margin: 0 auto;
                padding: 0 2.5rem;
                height: 80px;
                position: relative;
                overflow: visible;
            }

            .nav-brand {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .nav-brand h1 {
                color: #00ff88;
                font-size: 2.2rem;
                font-weight: 800;
                margin: 0;
                text-shadow: 
                    0 0 20px rgba(0, 255, 136, 0.6),
                    0 0 40px rgba(0, 255, 136, 0.3),
                    0 2px 4px rgba(0, 0, 0, 0.5);
                letter-spacing: -0.5px;
            }

            .brand-subtitle {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-top: -2px;
            }

            .nav-menu {
                display: flex;
                align-items: center;
                margin-left: auto;
                gap: 0.5rem;
            }

            .nav-item {
                position: relative;
            }

            .nav-item.dropdown {
                position: relative;
            }

            .nav-item.dropdown:hover .dropdown-content,
            .dropdown:hover .dropdown-content {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) scale(1) !important;
                pointer-events: auto !important;
            }

            .special-item .nav-link {
                background: linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 200, 255, 0.1));
                border: 1px solid rgba(0, 255, 136, 0.3);
                border-radius: 12px;
                padding: 1rem 1.8rem !important;
            }

            .nav-link {
                display: block;
                padding: 1.2rem 1.8rem;
                color: rgba(255, 255, 255, 0.9);
                text-decoration: none;
                font-weight: 600;
                transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                cursor: pointer;
                font-size: 1rem;
                letter-spacing: 0.3px;
                border-radius: 12px;
                position: relative;
                overflow: hidden;
            }

            .nav-link::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent);
                transition: left 0.6s ease;
            }

            .nav-link:hover::before {
                left: 100%;
            }

            .nav-link:hover {
                color: #00ff88;
                text-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
                background: rgba(0, 255, 136, 0.12);
                transform: translateY(-2px);
                box-shadow: 
                    0 8px 25px rgba(0, 255, 136, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .dropdown-content {
                position: absolute;
                top: 100%;
                left: 0;
                min-width: 280px;
                background: 
                    linear-gradient(135deg, rgba(20, 20, 40, 0.98) 0%, rgba(30, 30, 60, 0.96) 100%);
                backdrop-filter: blur(25px) saturate(180%);
                border: 1px solid rgba(0, 255, 136, 0.25);
                border-radius: 20px;
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.8),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-15px) scale(0.95);
                transition: all 0.2s ease-out;
                z-index: 100000;
                padding: 1rem 0;
                margin-top: 8px;
                pointer-events: none;
            }

            .dropdown:hover .dropdown-content {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
                pointer-events: auto;
                transition: all 0.15s ease-out;
            }

            .dropdown-content::before {
                content: '';
                position: absolute;
                top: -16px;
                left: 0;
                right: 0;
                height: 16px;
                background: transparent;
            }

            .dropdown-content::after {
                content: '';
                position: absolute;
                top: -8px;
                left: 2rem;
                width: 16px;
                height: 16px;
                background: linear-gradient(135deg, rgba(20, 20, 40, 0.98), rgba(30, 30, 60, 0.96));
                border: 1px solid rgba(0, 255, 136, 0.25);
                border-bottom: none;
                border-right: none;
                transform: rotate(45deg);
                border-radius: 3px 0 0 0;
            }

            .dropdown-content a {
                display: flex;
                align-items: center;
                padding: 1rem 1.5rem;
                color: rgba(255, 255, 255, 0.85);
                text-decoration: none;
                transition: all 0.15s ease-out;
                font-size: 0.95rem;
                font-weight: 500;
                border-left: 3px solid transparent;
                position: relative;
                overflow: hidden;
            }

            .dropdown-content a::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.08), transparent);
                transition: left 0.3s ease;
            }

            .dropdown-content a:hover::before {
                left: 100%;
            }

            .dropdown-content a:hover {
                color: #00ff88;
                background: 
                    linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 200, 255, 0.1));
                border-left-color: #00ff88;
                text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
                transform: translateX(8px);
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .ai-chat-panel {
                position: fixed;
                top: 80px;
                right: -450px;
                width: 420px;
                height: calc(100vh - 80px);
                background: 
                    linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(25, 25, 55, 0.96) 100%);
                backdrop-filter: blur(25px) saturate(180%);
                border-left: 2px solid rgba(0, 255, 136, 0.3);
                transition: right 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                box-shadow: -10px 0 50px rgba(0, 0, 0, 0.8);
            }

            .ai-chat-panel.open {
                right: 0;
            }

            .chat-header {
                padding: 2rem;
                border-bottom: 1px solid rgba(0, 255, 136, 0.25);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, rgba(0, 255, 136, 0.05), rgba(0, 200, 255, 0.03));
            }

            .chat-header h3 {
                color: #00ff88;
                margin: 0;
                font-size: 1.3rem;
                font-weight: 700;
                text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
            }

            .close-chat {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .close-chat:hover {
                color: #ff4757;
                background: rgba(255, 71, 87, 0.1);
                transform: rotate(90deg);
            }

            .chat-messages {
                flex: 1;
                padding: 1.5rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .chat-input-container {
                padding: 1.5rem;
                border-top: 1px solid rgba(0, 255, 136, 0.25);
                display: flex;
                gap: 1rem;
                background: linear-gradient(135deg, rgba(0, 255, 136, 0.05), rgba(0, 200, 255, 0.03));
            }

            #chat-input {
                flex: 1;
                padding: 1rem 1.25rem;
                background: rgba(255, 255, 255, 0.08);
                border: 2px solid rgba(0, 255, 136, 0.25);
                border-radius: 12px;
                color: white;
                font-size: 1rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            #chat-input:focus {
                outline: none;
                border-color: #00ff88;
                box-shadow: 
                    0 0 0 3px rgba(0, 255, 136, 0.2),
                    0 0 20px rgba(0, 255, 136, 0.1);
                background: rgba(255, 255, 255, 0.12);
            }

            #send-message {
                padding: 1rem 2rem;
                background: linear-gradient(135deg, #00ff88, #00cc6a);
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                font-size: 1rem;
                box-shadow: 0 6px 20px rgba(0, 255, 136, 0.3);
            }

            #send-message:hover {
                background: linear-gradient(135deg, #00cc6a, #00ff88);
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
            }

            .message {
                padding: 1rem 1.5rem;
                border-radius: 18px;
                max-width: 85%;
                word-wrap: break-word;
                font-size: 0.95rem;
                line-height: 1.5;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }

            .user-message {
                align-self: flex-end;
                background: linear-gradient(135deg, #00ff88, #00cc6a);
                color: white;
                font-weight: 500;
            }

            .ai-message {
                align-self: flex-start;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
                color: rgba(255, 255, 255, 0.95);
                border: 1px solid rgba(0, 255, 136, 0.2);
            }

            /* Responsive design */
            @media (max-width: 1200px) {
                .nav-content {
                    padding: 0 1.5rem;
                }
                
                .nav-menu {
                    gap: 0.25rem;
                }
                
                .nav-link {
                    padding: 1rem 1.2rem;
                    font-size: 0.9rem;
                }
                
                .dropdown-content {
                    min-width: 240px;
                }
            }

            @media (max-width: 768px) {
                .nav-content {
                    padding: 0 1rem;
                    height: 70px;
                }
                
                .global-nav {
                    min-height: 70px;
                }
                
                .nav-brand h1 {
                    font-size: 1.8rem;
                }
                
                .nav-menu {
                    gap: 0;
                }
                
                .nav-link {
                    padding: 0.8rem 1rem;
                    font-size: 0.85rem;
                }
                
                .dropdown-content {
                    min-width: 200px;
                    right: 0;
                    left: auto;
                }
                
                .ai-chat-panel {
                    width: 100%;
                    right: -100%;
                    top: 70px;
                    height: calc(100vh - 70px);
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(trigger);
        document.body.appendChild(nav);

        // Bind events
        this.bindEvents();

        console.log('Global navigation initialized successfully');
    }

    bindEvents() {
        const nav = document.getElementById('global-nav');
        const trigger = document.getElementById('nav-trigger');
        
        // Auto-hide functionality
        const showNav = () => {
            clearTimeout(this.hideTimeout);
            if (!this.navVisible) {
                nav.classList.add('show');
                this.navVisible = true;
            }
        };

        const hideNav = () => {
            this.hideTimeout = setTimeout(() => {
                if (this.navVisible && !this.chatVisible) {
                    nav.classList.remove('show');
                    this.navVisible = false;
                }
            }, 1500); // Hide after 1.5 seconds
        };

        // Mouse events for auto-hide
        trigger.addEventListener('mouseenter', showNav);
        nav.addEventListener('mouseenter', () => {
            clearTimeout(this.hideTimeout);
        });
        nav.addEventListener('mouseleave', hideNav);
        
        // Keep nav visible when dropdowns are open
        const dropdowns = nav.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            let dropdownTimeout = null;
            
            const showDropdown = () => {
                clearTimeout(dropdownTimeout);
                clearTimeout(this.hideTimeout);
                if (dropdownContent) {
                    dropdownContent.style.opacity = '1';
                    dropdownContent.style.visibility = 'visible';
                    dropdownContent.style.transform = 'translateY(0) scale(1)';
                    dropdownContent.style.pointerEvents = 'auto';
                }
            };
            
            const hideDropdown = () => {
                dropdownTimeout = setTimeout(() => {
                    if (dropdownContent) {
                        dropdownContent.style.opacity = '0';
                        dropdownContent.style.visibility = 'hidden';
                        dropdownContent.style.transform = 'translateY(-15px) scale(0.95)';
                        dropdownContent.style.pointerEvents = 'none';
                    }
                }, 150); // 150ms delay before hiding
            };
            
            dropdown.addEventListener('mouseenter', showDropdown);
            dropdown.addEventListener('mouseleave', () => {
                hideDropdown();
                if (!nav.matches(':hover')) {
                    hideNav();
                }
            });
            
            // Keep dropdown open when hovering over the dropdown content itself
            if (dropdownContent) {
                dropdownContent.addEventListener('mouseenter', () => {
                    clearTimeout(dropdownTimeout);
                    clearTimeout(this.hideTimeout);
                });
                
                dropdownContent.addEventListener('mouseleave', () => {
                    hideDropdown();
                    if (!nav.matches(':hover')) {
                        hideNav();
                    }
                });
            }
        });

        // Show nav immediately on page load for 3 seconds
        setTimeout(() => {
            showNav();
            setTimeout(hideNav, 3000);
        }, 500);
        // AI Chat functionality
        const aiChatLink = document.querySelector('.ai-chat-link');
        const chatPanel = document.getElementById('ai-chat-panel');
        const closeChat = document.querySelector('.close-chat');
        const sendButton = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');

        if (aiChatLink) {
            aiChatLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleChat();
            });
        }

        if (closeChat) {
            closeChat.addEventListener('click', () => {
                this.toggleChat();
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    toggleChat() {
        const chatPanel = document.getElementById('ai-chat-panel');
        const nav = document.getElementById('global-nav');
        
        if (chatPanel) {
            this.chatVisible = !this.chatVisible;
            chatPanel.classList.toggle('open', this.chatVisible);
            
            // Test API connection when chat is first opened
            if (this.chatVisible && !this.apiTested) {
                this.testGeminiConnection();
            }
            
            // Keep nav visible when chat is open
            if (this.chatVisible) {
                clearTimeout(this.hideTimeout);
                nav.classList.add('show');
                this.navVisible = true;
            } else {
                // Allow nav to hide when chat is closed
                setTimeout(() => {
                    if (!nav.matches(':hover')) {
                        nav.classList.remove('show');
                        this.navVisible = false;
                    }
                }, 2000);
            }
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');
        
        if (!chatInput || !chatMessages) return;

        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';

        // Add thinking indicator
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'message ai-message thinking';
        thinkingDiv.innerHTML = '🤔 AI is thinking...';
        chatMessages.appendChild(thinkingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await this.getAIResponse(message);
            chatMessages.removeChild(thinkingDiv);
            this.addMessage(response, 'ai');
        } catch (error) {
            console.error('Error getting AI response:', error);
            chatMessages.removeChild(thinkingDiv);
            this.addMessage('I\'m having trouble connecting right now, but I\'m still here to help! 🤖', 'ai');
        }
    }

    addMessage(content, sender) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = content;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async getAIResponse(message) {
        // Method 1: Try Gemini API with different approaches
        try {
            return await this.tryGeminiAPI(message);
        } catch (error) {
            console.log('Gemini API failed, trying alternatives...', error);
        }

        // Method 2: Try a free AI API service
        try {
            return await this.tryFreeAI(message);
        } catch (error) {
            console.log('Free AI service failed, using smart responses...', error);
        }

        // Method 3: Intelligent pattern-based responses
        return this.getSmartResponse(message);
    }

    async tryGeminiAPI(message) {
        const payload = {
            contents: [{
                parts: [{ text: `You are a helpful AI assistant for the Iowa website. Be concise and friendly. User: ${message}` }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
                topP: 0.8,
                topK: 10
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        // Try direct call first with better headers
        try {
            console.log('Trying direct Gemini API call...');
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log('Direct API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Direct API response data:', data);
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }
            } else {
                const errorText = await response.text();
                console.log('Direct API error:', errorText);
            }
        } catch (error) {
            console.log('Direct Gemini call failed:', error);
        }

        // Try alternative Gemini model
        try {
            console.log('Trying Gemini Flash model...');
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Flash model response:', data);
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }
            }
        } catch (error) {
            console.log('Gemini Flash failed:', error);
        }

        // Try with the most reliable CORS proxy
        try {
            console.log('Trying CORS proxy...');
            const corsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`)}`;
            
            const response = await fetch(corsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            });

            if (response.ok) {
                const proxyData = await response.json();
                const data = JSON.parse(proxyData.contents);
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }
            }
        } catch (error) {
            console.log('CORS proxy failed:', error);
        }

        throw new Error('Gemini API unavailable - all methods failed');
    }

    async tryFreeAI(message) {
        // Try a free AI service as backup
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer demo-key'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: message }],
                    max_tokens: 150
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.choices?.[0]?.message?.content) {
                    return data.choices[0].message.content;
                } else {
                    throw new Error('Invalid response');
                }
            }
        } catch (e) {
            console.log('Free AI service failed:', e);
        }

        // Try HuggingFace Inference API (free)
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: message })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.generated_text || data[0]?.generated_text) {
                    return data.generated_text || data[0].generated_text;
                } else {
                    throw new Error('No response');
                }
            }
        } catch (e) {
            console.log('HuggingFace failed:', e);
        }

        throw new Error('All free AI services unavailable');
    }

    getSmartResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Website-specific responses
        if (lowerMsg.includes('iowa') || lowerMsg.includes('website')) {
            return "Welcome to the Iowa website! 🌽 We have games, Tesla content, entertainment, and more. What interests you most?";
        }
        
        if (lowerMsg.includes('game') || lowerMsg.includes('play')) {
            return "🎮 We have some awesome games! Try the Airbus Simulator, Tesla games, Belt Loader, or check out the Toilet Game for some fun!";
        }
        
        if (lowerMsg.includes('tesla')) {
            return "⚡ Our Tesla section is amazing! Check out the Tesla Mode and Supercharger simulator for electric vehicle experiences.";
        }
        
        if (lowerMsg.includes('music') || lowerMsg.includes('entertainment')) {
            return "🎵 For entertainment, we have Magnitunes, Flying Cutie, Mrs. Sniffles, and more fun content!";
        }

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            return "Hello! 👋 I'm your Iowa website assistant. I can help you navigate our games, Tesla content, entertainment, and community features!";
        }

        if (lowerMsg.includes('help') || lowerMsg.includes('what')) {
            return "I'm here to help you explore the Iowa website! 🤖 We have:\n• 🎮 Games (Airbus Sim, Tesla games, etc.)\n• ⚡ Tesla content\n• 🎵 Entertainment\n• 🔧 Tools & utilities\n• 👥 Community features\n\nWhat would you like to know about?";
        }

        if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
            return "You're welcome! 😊 Happy to help you explore the Iowa website. Is there anything else you'd like to know about?";
        }

        // General conversational responses
        const responses = [
            "That's interesting! The Iowa website has lots of cool features. Have you tried our games section? 🎮",
            "I'm here to help you explore everything Iowa has to offer! What catches your interest? 🌽",
            "Great question! The Iowa website is packed with entertainment. Check out our Tesla section or games! ⚡",
            "I love chatting about the Iowa website! There's so much to discover here. What's your favorite type of content? 🎯",
            "Thanks for using Iowa! I'm always here to help you find the best content on our site. 🤖"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize the global navigation
new GlobalNavigation();