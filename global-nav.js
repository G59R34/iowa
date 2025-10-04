// Global Navigation System with AI Features
// OpenAI API Integration for AI Assistant
// SECURITY WARNING: Never expose API keys in production client-side code. For demo/personal use only.
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// CORS Proxy to bypass browser restrictions
// Alternative proxies if one doesn't work:
// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
// const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
// const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

class GlobalNav {
    constructor() {
        this.isOpen = false;
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.aiFeatures = {
            smartSearch: true,
            dynamicContent: true,
            userPreferences: true,
            voiceCommands: false
        };
        this.init();
    }

    init() {
        this.createNav();
        this.bindEvents();
        this.setupAI();
        this.loadUserPreferences();
        this.initFirebaseRemoteConfig();
    }

    createNav() {
        // Create trigger area
        const trigger = document.createElement('div');
        trigger.className = 'nav-trigger';
        
        // Create glowing indicator
        const indicator = document.createElement('div');
        indicator.className = 'nav-indicator';
        
        const nav = document.createElement('nav');
        nav.className = 'global-nav';
        nav.innerHTML = `
            <div class="nav-header">
                <div class="nav-brand">
                    <span class="brand-icon">🛑</span>
                    <span class="brand-text">Anti-Iowa Cult</span>
                    <span class="ai-indicator">🤖</span>
                </div>
                <div class="nav-controls">
                    <button class="nav-toggle" aria-label="Toggle navigation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <button class="ai-toggle" aria-label="Toggle AI features">
                        <span class="ai-icon">🤖</span>
                    </button>
                </div>
            </div>
            
            <div class="nav-content">
                <div class="nav-menu">
                    <div class="menu-section">
                        <h3 class="section-title">🌍 Main Pages</h3>
                        <a href="index.html" class="nav-link" data-page="index">
                            <span class="link-icon">🏠</span>
                            <span class="link-text">Home</span>
                            <span class="link-desc">Welcome to the cult</span>
                        </a>
                        <a href="about.html" class="nav-link" data-page="about">
                            <span class="link-icon">📖</span>
                            <span class="link-text">About</span>
                            <span class="link-desc">Learn our secrets</span>
                        </a>
                        <a href="evidence.html" class="nav-link" data-page="evidence">
                            <span class="link-icon">🔍</span>
                            <span class="link-text">Evidence</span>
                            <span class="link-desc">Proof Iowa isn't real</span>
                        </a>
                        <a href="download-waterstream.html" class="nav-link" data-page="download-waterstream">
                            <span class="link-icon">🌊</span>
                            <span class="link-text">Waterstream</span>
                            <span class="link-desc">Download the browser, surf the chaos</span>
                        </a>
                    </div>
                    
                    <div class="menu-section">
                        <h3 class="section-title">🎭 Entertainment</h3>
                        <a href="drama.html" class="nav-link" data-page="drama">
                            <span class="link-icon">🍺</span>
                            <span class="link-text">Cult Drama</span>
                            <span class="link-desc">Adult life chaos</span>
                        </a>
                        <a href="game.html" class="nav-link" data-page="game">
                            <span class="link-icon">🎮</span>
                            <span class="link-text">Experience Iowa</span>
                            <span class="link-desc">Delete corn game</span>
                        </a>
                        <a href="beltloader-game.html" class="nav-link" data-page="beltloader-game">
                            <span class="link-icon">🚛</span>
                            <span class="link-text">BELTLOADER Game</span>
                            <span class="link-desc">Load bags on the belt!</span>
                        </a>
                        <a href="toilet.html" class="nav-link" data-page="toilet">
                            <span class="link-icon">🚽</span>
                            <span class="link-text">Study Level Toilet</span>
                            <span class="link-desc">The ultimate toilet sim</span>
                        </a>
                        <a href="altima-sim.html" class="nav-link" data-page="altima-sim">
                            <span class="link-icon">🚗</span>
                            <span class="link-text">Altima Sim</span>
                            <span class="link-desc">Drive like a maniac</span>
                        </a>
                        <a href="airbus-sim.html" class="nav-link" data-page="airbus-sim">
                            <span class="link-icon">✈️</span>
                            <span class="link-text">Airbus A320</span>
                            <span class="link-desc">Avionics simulator</span>
                        </a>
                        <a href="walmart.html" class="nav-link" data-page="walmart">
                            <span class="link-icon">🛒</span>
                            <span class="link-text">Walmart Supercenter</span>
                            <span class="link-desc">Iowa explosion experience</span>
                        </a>
                            <a href="porcupine-hype.html" class="nav-link" data-page="porcupine-hype">
                                <span class="link-icon">🦔</span>
                                <span class="link-text">Porcupine Simulator</span>
                                <span class="link-desc">Shakesperian study-level hype</span>
                            </a>
                            <a href="sink-hype.html" class="nav-link" data-page="sink-hype">
                                <span class="link-icon">🚰</span>
                                <span class="link-text">Sink Hype</span>
                                <span class="link-desc">Ultimate sink experience</span>
                            </a>
                            <a href="tesla-supercharger.html" class="nav-link" data-page="tesla-supercharger">
                                <span class="link-icon">🔋</span>
                                <span class="link-text">Tesla Supercharger</span>
                                <span class="link-desc">Study level charger sim</span>
                            </a>
                        <a href="clock.html" class="nav-link" data-page="clock">
                            <span class="link-icon">⏰</span>
                            <span class="link-text">Wacky Clock</span>
                            <span class="link-desc">Time is an illusion</span>
                        </a>
                        <a href="flying-cutie.html" class="nav-link" data-page="flying-cutie">
                            <span class="link-icon">🦋</span>
                            <span class="link-text">Flying Cutie</span>
                            <span class="link-desc">Graceful & sensual flight</span>
                        </a>
                        <a href="test-page.html" class="nav-link" data-page="test-page">
                            <span class="link-icon">🧪</span>
                            <span class="link-text">Test Page</span>
                            <span class="link-desc">JavaScript stress test with animations</span>
                        </a>
                    </div>
                    
                    <div class="menu-section">
                        <h3 class="section-title">👥 Characters</h3>
                        <a href="linda.html" class="nav-link" data-page="linda">
                            <span class="link-icon">🌈</span>
                            <span class="link-text">Linda</span>
                            <span class="link-desc">Brain-ruining facts</span>
                        </a>
                        <a href="sniffles.html" class="nav-link" data-page="sniffles">
                            <span class="link-icon">🤧</span>
                            <span class="link-text">Sniffles</span>
                            <span class="link-desc">The sneezy one</span>
                        </a>
                        <a href="mrs-sniffles.html" class="nav-link" data-page="mrs-sniffles">
                            <span class="link-icon">👵</span>
                            <span class="link-text">Mrs. Sniffles</span>
                            <span class="link-desc">The matriarch</span>
                        </a>
                    </div>
                    
                    <div class="menu-section">
                        <h3 class="section-title">🚗 Adventures</h3>
                        <a href="turn-signal.html" class="nav-link" data-page="turn-signal">
                            <span class="link-icon">🚦</span>
                            <span class="link-text">Turn Signal</span>
                            <span class="link-desc">Welcome to the void</span>
                        </a>
                        <a href="united.html" class="nav-link" data-page="united">
                            <span class="link-icon">✈️</span>
                            <span class="link-text">United Airlines</span>
                            <span class="link-desc">Flying adventures</span>
                        </a>
                        <a href="tesla.html" class="nav-link" data-page="tesla">
                            <span class="link-icon">⚡</span>
                            <span class="link-text">Tesla Mode</span>
                            <span class="link-desc">Electric dreams</span>
                        </a>
                        <a href="cornclub-iracing.html" class="nav-link" data-page="cornclub-iracing">
                            <span class="link-icon">🏎️</span>
                            <span class="link-text">Cornclub iRacing</span>
                            <span class="link-desc">Sim racing league</span>
                        </a>
                    </div>
                    
                    <div class="menu-section">
                        <h3 class="section-title">💬 Communication</h3>
                        <a href="chat-v2.html" class="nav-link" data-page="chat-v2">
                            <span class="link-icon">💬</span>
                            <span class="link-text">Cult Chat v2</span>
                            <span class="link-desc">Modern chat with images</span>
                        </a>
                        <a href="test-chat.html" class="nav-link" data-page="test-chat">
                            <span class="link-icon">🧪</span>
                            <span class="link-text">Old Chat</span>
                            <span class="link-desc">Legacy chat system</span>
                        </a>
                    </div>
                    
                    <div class="menu-section">
                        <h3 class="section-title">🧩 Applications</h3>
                        <a href="magnitunes.html" class="nav-link" data-page="magnitunes">
                            <span class="link-icon">🎵</span>
                            <span class="link-text">Magnitunes</span>
                            <span class="link-desc">Stream the anti-corn vibes</span>
                        </a>
                    </div>
                    
                    <div class="menu-section">
                        <h3 class="section-title">🐧 Software</h3>
                        <a href="linux.html" class="nav-link" data-page="linux">
                            <span class="link-icon">🐧</span>
                            <span class="link-text">Linux Development</span>
                            <span class="link-desc">Master the penguin's domain</span>
                        </a>
                        <a href="belt-loader.html" class="nav-link" data-page="belt-loader">
                            <span class="link-icon">🚛</span>
                            <span class="link-text">Belt Loader Paradise</span>
                            <span class="link-desc">Aviation ground support excellence</span>
                        </a>
                        <a href="belt-loader-wiki.html" class="nav-link" data-page="belt-loader-wiki">
                            <span class="link-icon">📚</span>
                            <span class="link-text">BELTLOADER Wikipedia</span>
                            <span class="link-desc">Complete encyclopedia entry</span>
                        </a>
                    </div>
                    
                    <div class="menu-section">
                        <h3 class="section-title">�🔐 Account</h3>
                        <a href="join.html" class="nav-link" data-page="join">
                            <span class="link-icon">🚀</span>
                            <span class="link-text">Join Cult</span>
                            <span class="link-desc">Become one of us</span>
                        </a>
                        <a href="login.html" class="nav-link" data-page="login">
                            <span class="link-icon">🔑</span>
                            <span class="link-text">LOG TF IN</span>
                            <span class="link-desc">Access your account</span>
                        </a>
                    </div>
                </div>
                
                <div class="nav-footer">
                    <div class="ai-status">
                        <span class="status-icon">🤖</span>
                        <span class="status-text">AI Assistant Active</span>
                    </div>
                    <div class="user-info">
                        <span class="user-avatar">👤</span>
                        <span class="user-name">Guest User</span>
                    </div>
                </div>
            </div>
            
            <div class="ai-panel" style="display: none;">
                <div class="ai-header">
                    <h3>🤖 AI Assistant</h3>
                    <button class="ai-close">×</button>
                </div>
                <div class="ai-content">
                    <div class="ai-chat">
                        <div class="ai-message">
                            <span class="ai-avatar">🤖</span>
                            <div class="message-content">
                                Hello! I'm your AI assistant. How can I help you navigate the Anti-Iowa Cult today?
                            </div>
                        </div>
                    </div>
                    <div class="ai-input">
                        <input type="text" placeholder="Ask me anything..." class="ai-text-input">
                        <button class="ai-send">🚀</button>
                    </div>
                </div>
            </div>
        `;

        // Add comprehensive modern styles
        const style = document.createElement('style');
        style.textContent = `
            /* Global scroll fixes */
            html, body {
                margin: 0;
                padding: 0;
                overflow-x: hidden;
                overscroll-behavior: none;
                -webkit-overflow-scrolling: touch;
                height: 100%;
                width: 100%;
            }

            body {
                position: relative;
                background: radial-gradient(ellipse at top, #1a1a3e 0%, #0d1b2a 50%, #000511 100%);
                min-height: 100vh;
                min-height: calc(var(--vh, 1vh) * 100);
            }

            .global-nav {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: 
                    linear-gradient(135deg, rgba(10, 10, 30, 0.95) 0%, rgba(20, 20, 50, 0.9) 50%, rgba(30, 30, 70, 0.85) 100%),
                    linear-gradient(45deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 200, 255, 0.05) 50%, rgba(128, 0, 255, 0.05) 100%);
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                z-index: 10000;
                font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
                transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border-bottom: 1px solid rgba(0, 255, 136, 0.3);
                min-height: 75px;
                transform: translateY(-100%);
                opacity: 0;
                border-radius: 0 0 24px 24px;
            }

            .global-nav.show {
                transform: translateY(0);
                opacity: 1;
            }

            /* Hover trigger area */
            .nav-trigger {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 20px;
                z-index: 9999;
                background: transparent;
                cursor: pointer;
            }

            /* Modern glowing indicator when nav is hidden */
            .nav-indicator {
                position: fixed;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                width: 80px;
                height: 6px;
                background: linear-gradient(90deg, #00ff88, #00cc6a, #0099ff, #6600ff);
                background-size: 200% 100%;
                border-radius: 10px;
                z-index: 9998;
                opacity: 0.8;
                transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                box-shadow: 
                    0 0 15px rgba(0, 255, 136, 0.6),
                    0 0 30px rgba(0, 255, 136, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                animation: navPulse 3s ease-in-out infinite, shimmer 4s linear infinite;
            }

            .nav-indicator:hover {
                opacity: 1;
                box-shadow: 
                    0 0 25px rgba(0, 255, 136, 0.8),
                    0 0 50px rgba(0, 255, 136, 0.5),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
                transform: translateX(-50%) scaleX(1.3) scaleY(1.5);
            }

            @keyframes navPulse {
                0%, 100% { 
                    opacity: 0.8;
                    box-shadow: 
                        0 0 15px rgba(0, 255, 136, 0.6),
                        0 0 30px rgba(0, 255, 136, 0.3);
                }
                50% { 
                    opacity: 1;
                    box-shadow: 
                        0 0 25px rgba(0, 255, 136, 0.8),
                        0 0 50px rgba(0, 255, 136, 0.5);
                }
            }

            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            /* Cool entrance animation for nav */
            .global-nav.show .nav-header {
                animation: navSlideIn 0.4s ease-out;
            }

            .global-nav.show .nav-brand {
                animation: brandGlow 0.6s ease-out;
            }

            @keyframes navSlideIn {
                0% {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes brandGlow {
                0% {
                    text-shadow: 0 0 10px #00ff88;
                }
                50% {
                    text-shadow: 0 0 30px #00ff88, 0 0 50px #00ff88;
                }
                100% {
                    text-shadow: 0 0 10px #00ff88;
                }
            }

            /* Hover effects for trigger area */
            .nav-trigger:hover::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent);
                animation: triggerScan 1s ease-in-out;
            }

            @keyframes triggerScan {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            .nav-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.2em 2.5em;
                background: 
                    linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%),
                    linear-gradient(45deg, rgba(0, 255, 136, 0.08) 0%, rgba(128, 0, 255, 0.08) 100%);
                border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                min-height: 75px;
                backdrop-filter: blur(10px);
                position: relative;
                overflow: hidden;
            }

            .nav-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                animation: headerShine 6s infinite;
            }

            .nav-brand {
                display: flex;
                align-items: center;
                gap: 1em;
                font-size: clamp(1.3em, 3.5vw, 1.7em);
                font-weight: 700;
                color: #fff;
                text-shadow: 
                    0 0 20px rgba(0, 255, 136, 0.8),
                    0 0 40px rgba(0, 255, 136, 0.4),
                    0 2px 4px rgba(0, 0, 0, 0.3);
                letter-spacing: -0.02em;
            }

            .brand-icon {
                font-size: 1.3em;
                animation: brandPulse 3s ease-in-out infinite;
                filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.6));
            }

            .ai-indicator {
                font-size: 0.9em;
                opacity: 0.85;
                animation: aiGlow 2s ease-in-out infinite alternate;
                margin-left: 0.5em;
                filter: drop-shadow(0 0 8px rgba(0, 200, 255, 0.8));
            }

            @keyframes headerShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            @keyframes brandPulse {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(5deg); }
            }

            @keyframes aiGlow {
                0% { 
                    text-shadow: 0 0 10px rgba(0, 200, 255, 0.8);
                    transform: scale(1);
                }
                100% { 
                    text-shadow: 0 0 20px rgba(0, 200, 255, 1), 0 0 30px rgba(0, 200, 255, 0.6);
                    transform: scale(1.05);
                }
            }

            .nav-controls {
                display: flex;
                gap: 0.8em;
                align-items: center;
            }

            .nav-toggle, .ai-toggle {
                background: 
                    linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%),
                    linear-gradient(45deg, rgba(0, 255, 136, 0.1) 0%, rgba(128, 0, 255, 0.1) 100%);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                padding: 0.8em;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                color: #fff;
                font-size: 1.4em;
                min-width: 55px;
                min-height: 55px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
                box-shadow: 
                    0 4px 15px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .nav-toggle:hover, .ai-toggle:hover {
                background: 
                    linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 100%),
                    linear-gradient(45deg, rgba(0, 255, 136, 0.15) 0%, rgba(128, 0, 255, 0.15) 100%);
                transform: scale(1.08) translateY(-2px);
                box-shadow: 
                    0 8px 25px rgba(0, 255, 136, 0.3),
                    0 0 20px rgba(0, 255, 136, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
                border-color: rgba(0, 255, 136, 0.4);
            }

            .nav-toggle::before, .ai-toggle::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s ease;
            }

            .nav-toggle:hover::before, .ai-toggle:hover::before {
                left: 100%;
            }

            .nav-toggle span {
                display: block;
                width: 20px;
                height: 2px;
                background: #fff;
                margin: 3px 0;
                transition: all 0.3s ease;
                border-radius: 1px;
            }

            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }

            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }

            .nav-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                background: 
                    linear-gradient(180deg, rgba(10, 10, 30, 0.98) 0%, rgba(5, 5, 20, 0.95) 100%),
                    radial-gradient(ellipse at center, rgba(0, 255, 136, 0.03) 0%, transparent 70%);
                backdrop-filter: blur(25px) saturate(180%);
                -webkit-backdrop-filter: blur(25px) saturate(180%);
            }

            .nav-content.open {
                max-height: 85vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            .nav-menu {
                padding: 1.5em;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 1.2em;
                position: relative;
            }

            .menu-section {
                background: 
                    linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%),
                    linear-gradient(45deg, rgba(0, 255, 136, 0.05) 0%, rgba(128, 0, 255, 0.05) 100%);
                border-radius: 18px;
                padding: 1.3em;
                border: 1px solid rgba(255, 255, 255, 0.12);
                backdrop-filter: blur(10px);
                position: relative;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .menu-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
                transition: left 0.8s ease;
            }

            .menu-section:hover {
                transform: translateY(-4px);
                box-shadow: 
                    0 12px 40px rgba(0, 0, 0, 0.2),
                    0 0 20px rgba(0, 255, 136, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
                border-color: rgba(0, 255, 136, 0.3);
            }

            .menu-section:hover::before {
                left: 100%;
            }

            .section-title {
                color: #00ff88;
                font-size: 0.95em;
                font-weight: 800;
                margin-bottom: 1em;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                text-shadow: 
                    0 0 10px rgba(0, 255, 136, 0.8),
                    0 0 20px rgba(0, 255, 136, 0.4);
                position: relative;
                padding-bottom: 0.5em;
            }

            .section-title::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 30px;
                height: 2px;
                background: linear-gradient(90deg, #00ff88, transparent);
                border-radius: 1px;
                animation: titleUnderline 0.6s ease-out;
            }

            @keyframes titleUnderline {
                0% { width: 0; }
                100% { width: 30px; }
            }

            .nav-link {
                display: flex;
                align-items: center;
                gap: 1em;
                padding: 1em;
                color: #fff;
                text-decoration: none;
                border-radius: 12px;
                transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                margin-bottom: 0.6em;
                position: relative;
                overflow: hidden;
                min-height: 52px;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid transparent;
                backdrop-filter: blur(5px);
            }

            .nav-link::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.15), rgba(128, 0, 255, 0.1), transparent);
                transition: left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                z-index: 1;
            }

            .nav-link:hover::before {
                left: 100%;
            }

            .nav-link:hover {
                background: 
                    linear-gradient(135deg, rgba(0, 255, 136, 0.12) 0%, rgba(0, 255, 136, 0.06) 100%),
                    rgba(255, 255, 255, 0.05);
                transform: translateX(8px) scale(1.02);
                box-shadow: 
                    0 8px 25px rgba(0, 255, 136, 0.2),
                    0 0 20px rgba(0, 255, 136, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
                border-color: rgba(0, 255, 136, 0.4);
            }

            .nav-link.active {
                background: 
                    linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.1) 50%, rgba(128, 0, 255, 0.1) 100%),
                    rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 136, 0.6);
                box-shadow: 
                    0 0 25px rgba(0, 255, 136, 0.4),
                    0 0 50px rgba(0, 255, 136, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
                transform: translateX(4px);
            }

            /* Hidden Easter Egg PNG */
            .easter-egg {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: url('easter-egg-temp.png') center/cover;
                border-radius: 50%;
                cursor: pointer;
                z-index: 9999;
                transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                opacity: 0;
                transform: scale(0) rotate(0deg);
                box-shadow: 
                    0 8px 25px rgba(255, 20, 147, 0.3),
                    0 0 20px rgba(255, 20, 147, 0.4);
                border: 2px solid rgba(255, 20, 147, 0.6);
                animation: easterEggFloat 6s ease-in-out infinite;
            }

            .easter-egg.show {
                opacity: 0.8;
                transform: scale(1) rotate(0deg);
            }

            .easter-egg:hover {
                opacity: 1;
                transform: scale(1.2) rotate(10deg);
                box-shadow: 
                    0 12px 35px rgba(255, 20, 147, 0.5),
                    0 0 30px rgba(255, 20, 147, 0.7);
                animation-play-state: paused;
            }

            .easter-egg:active {
                transform: scale(1.1) rotate(-5deg);
                box-shadow: 
                    0 6px 20px rgba(255, 20, 147, 0.8),
                    0 0 40px rgba(255, 20, 147, 0.9);
            }

            @keyframes easterEggFloat {
                0%, 100% { 
                    transform: scale(1) translateY(0px) rotate(0deg);
                }
                25% { 
                    transform: scale(1.05) translateY(-8px) rotate(2deg);
                }
                50% { 
                    transform: scale(1) translateY(0px) rotate(0deg);
                }
                75% { 
                    transform: scale(1.05) translateY(-5px) rotate(-2deg);
                }
            }

            .link-icon {
                font-size: 1.3em;
                min-width: 1.8em;
                text-align: center;
                filter: drop-shadow(0 0 8px currentColor);
                transition: all 0.3s ease;
                z-index: 2;
                position: relative;
            }

            .nav-link:hover .link-icon {
                transform: scale(1.2) rotate(5deg);
                filter: drop-shadow(0 0 12px currentColor) brightness(1.2);
            }

            .link-text {
                font-weight: 600;
                font-size: 1em;
                z-index: 2;
                position: relative;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            }

            .link-desc {
                font-size: 0.8em;
                opacity: 0.75;
                margin-left: auto;
                text-align: right;
                z-index: 2;
                position: relative;
                font-weight: 400;
                font-style: italic;
            }

            .nav-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.2em;
                background: 
                    linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%),
                    linear-gradient(45deg, rgba(0, 255, 136, 0.05) 0%, rgba(128, 0, 255, 0.05) 100%);
                border-top: 1px solid rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border-radius: 0 0 24px 24px;
            }

            .ai-status, .user-info {
                display: flex;
                align-items: center;
                gap: 0.5em;
                font-size: 0.85em;
                color: #fff;
            }

            .ai-panel {
                position: fixed;
                top: 0;
                right: 0;
                width: 350px;
                height: 100vh;
                background: rgba(26,26,46,0.98);
                backdrop-filter: blur(20px);
                border-left: 2px solid #00ff88;
                z-index: 10001;
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .ai-panel.open {
                transform: translateX(0);
            }

            .ai-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1em;
                background: rgba(0,255,136,0.1);
                border-bottom: 1px solid #00ff88;
            }

            .ai-header h3 {
                color: #00ff88;
                margin: 0;
                font-size: 1.1em;
            }

            .ai-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.5em;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .ai-close:hover {
                background: rgba(255,255,255,0.1);
                transform: scale(1.1);
            }

            .ai-content {
                display: flex;
                flex-direction: column;
                height: calc(100vh - 60px);
            }

            .ai-chat {
                flex: 1;
                padding: 1em;
                overflow-y: auto;
            }

            .ai-message {
                display: flex;
                gap: 0.8em;
                margin-bottom: 1em;
            }

            .ai-avatar {
                font-size: 1.5em;
                animation: bounce 2s infinite;
            }

            .message-content {
                background: rgba(0,255,136,0.1);
                padding: 0.8em;
                border-radius: 12px;
                color: #fff;
                font-size: 0.9em;
                border: 1px solid rgba(0,255,136,0.3);
            }

            .ai-input {
                display: flex;
                gap: 0.5em;
                padding: 1em;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .ai-text-input {
                flex: 1;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 8px;
                padding: 0.8em;
                color: #fff;
                font-size: 0.9em;
                min-height: 44px;
            }

            .ai-text-input::placeholder {
                color: rgba(255,255,255,0.5);
            }

            .ai-text-input:focus {
                outline: none;
                border-color: #00ff88;
                box-shadow: 0 0 10px rgba(0,255,136,0.3);
            }

            .ai-send {
                background: #00ff88;
                border: none;
                border-radius: 8px;
                padding: 0.8em;
                color: #1a1a2e;
                font-size: 1.2em;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 44px;
                min-height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ai-send:hover {
                background: #00cc6a;
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(0,255,136,0.5);
            }

            /* Enhanced mobile-first responsive design */
            @media (max-width: 768px) {
                .nav-header {
                    padding: 1em 1.5em;
                    min-height: 65px;
                }

                .nav-brand {
                    font-size: clamp(1.2em, 4vw, 1.5em);
                    gap: 0.8em;
                }

                .nav-toggle, .ai-toggle {
                    min-width: 48px;
                    min-height: 48px;
                    font-size: 1.2em;
                    padding: 0.7em;
                    border-radius: 14px;
                }
                
                .nav-menu {
                    padding: 1.2em;
                    grid-template-columns: 1fr;
                }
                
                .menu-section {
                    padding: 1.1em;
                    border-radius: 16px;
                }
                
                .easter-egg {
                    width: 50px;
                    height: 50px;
                    bottom: 15px;
                    right: 15px;
                }

                /* Mobile touch support */
                .nav-trigger {
                    height: 30px;
                }

                .nav-indicator {
                    width: 80px;
                    height: 6px;
                    top: 8px;
                }

                .nav-menu {
                    grid-template-columns: 1fr;
                    gap: 0.8em;
                }

                .menu-section {
                    padding: 0.8em;
                }

                .nav-link {
                    padding: 0.7em;
                    min-height: 44px;
                }

                .link-desc {
                    display: none;
                }

                .ai-panel {
                    width: 100vw;
                }
            }

            @media (max-width: 480px) {
                .nav-header {
                    padding: 0.6em 1em;
                    min-height: 55px;
                }

                .nav-brand {
                    font-size: clamp(1em, 3.5vw, 1.3em);
                    gap: 0.5em;
                }

                .nav-toggle, .ai-toggle {
                    min-width: 40px;
                    min-height: 40px;
                    font-size: 1em;
                    padding: 0.5em;
                }

                .nav-link {
                    padding: 0.6em;
                    min-height: 40px;
                }

                .link-icon {
                    font-size: 1.1em;
                }

                .link-text {
                    font-size: 0.9em;
                }
            }

            /* Enhanced animations and effects */
            @keyframes pulse {
                0%, 100% { 
                    transform: scale(1); 
                    filter: brightness(1);
                }
                50% { 
                    transform: scale(1.05); 
                    filter: brightness(1.2);
                }
            }

            @keyframes glow {
                0% { 
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
                }
                100% { 
                    text-shadow: 
                        0 0 20px rgba(0, 255, 136, 1), 
                        0 0 40px rgba(0, 255, 136, 0.6),
                        0 0 60px rgba(0, 255, 136, 0.3);
                }
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { 
                    transform: translateY(0) scale(1); 
                }
                40% { 
                    transform: translateY(-12px) scale(1.05); 
                }
                60% { 
                    transform: translateY(-6px) scale(1.02); 
                }
            }
            
            /* Modern entrance animations */
            .nav-content.open .menu-section {
                animation: sectionSlideIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            }
            
            .nav-content.open .menu-section:nth-child(1) { animation-delay: 0.1s; }
            .nav-content.open .menu-section:nth-child(2) { animation-delay: 0.15s; }
            .nav-content.open .menu-section:nth-child(3) { animation-delay: 0.2s; }
            .nav-content.open .menu-section:nth-child(4) { animation-delay: 0.25s; }
            .nav-content.open .menu-section:nth-child(5) { animation-delay: 0.3s; }
            .nav-content.open .menu-section:nth-child(6) { animation-delay: 0.35s; }
            .nav-content.open .menu-section:nth-child(7) { animation-delay: 0.4s; }
            
            @keyframes sectionSlideIn {
                0% {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            /* Touch-friendly improvements */
            @media (hover: none) and (pointer: coarse) {
                .nav-link:hover {
                    transform: none;
                }

                .nav-link:active {
                    background: rgba(0,255,136,0.2);
                    transform: scale(0.98);
                }

                * {
                    -webkit-overflow-scrolling: touch;
                }
            }

            /* High DPI displays */
            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                .nav-toggle span {
                    border-width: 0.5px;
                }
            }

            /* Print styles */
            @media print {
                .global-nav {
                    display: none !important;
                }
            }

            /* Additional scroll and layout fixes */
            * {
                box-sizing: border-box;
            }

            /* Ensure main content area is properly positioned */
            main, .main-content, #main {
                position: relative;
                z-index: 1;
                min-height: calc(100vh - 90px);
                min-height: calc((var(--vh, 1vh) * 100) - 90px);
            }

            /* Fix for iOS Safari viewport issues */
            @supports (-webkit-touch-callout: none) {
                body {
                    min-height: -webkit-fill-available;
                }
            }

            /* Prevent any unwanted margins/padding on root elements */
            html {
                scroll-behavior: smooth;
            }

            /* Ensure sections don't create unwanted gaps */
            section {
                position: relative;
                z-index: 1;
            }

            /* Fix aurora animation positioning */
            .aurora {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                height: calc(var(--vh, 1vh) * 100);
                pointer-events: none;
                z-index: 0;
                background: transparent;
                overflow: hidden;
            }

            /* Ensure footer doesn't create gaps */
            footer {
                position: relative;
                z-index: 1;
                margin-bottom: 0;
            }
        `;

        document.head.appendChild(style);
        document.body.insertBefore(trigger, document.body.firstChild);
        document.body.insertBefore(indicator, document.body.firstChild);
        document.body.insertBefore(nav, document.body.firstChild);

        // Create hidden easter egg
        this.createEasterEgg();

        // Add padding to body to account for fixed nav
        const updateBodyPadding = () => {
            const isMobile = window.innerWidth <= 768;
            const isSmallMobile = window.innerWidth <= 480;
            
            if (isSmallMobile) {
                document.body.style.paddingTop = '25px';
            } else if (isMobile) {
                document.body.style.paddingTop = '30px';
            } else {
                document.body.style.paddingTop = '30px';
            }
        };
        
        updateBodyPadding();
        window.addEventListener('resize', updateBodyPadding);

        // Fix scroll issues by ensuring proper viewport handling
        const fixScrollIssues = () => {
            // Prevent overscroll/bounce on mobile
            document.body.style.overscrollBehavior = 'none';
            document.documentElement.style.overscrollBehavior = 'none';
            
            // Ensure proper viewport height handling
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        fixScrollIssues();
        window.addEventListener('resize', fixScrollIssues);
        window.addEventListener('orientationchange', fixScrollIssues);
    }

    createEasterEgg() {
        const easterEgg = document.createElement('div');
        easterEgg.className = 'easter-egg';
        easterEgg.title = 'Secret Anti-Iowa Discovery! Click me!';
        
        // Add to page
        document.body.appendChild(easterEgg);
        
        // Show after a delay
        setTimeout(() => {
            easterEgg.classList.add('show');
        }, 3000);
        
        // Easter egg click handler
        easterEgg.addEventListener('click', () => {
            this.triggerEasterEgg(easterEgg);
        });
        
        // Store reference
        this.easterEggElement = easterEgg;
    }
    
    triggerEasterEgg(element) {
        // Create explosion effect
        const explosion = document.createElement('div');
        explosion.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 200px;
            height: 200px;
            pointer-events: none;
            z-index: 10001;
        `;
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: hsl(${Math.random() * 360}, 100%, 70%);
                border-radius: 50%;
                animation: easterParticle 2s ease-out forwards;
                left: 96px;
                top: 96px;
                box-shadow: 0 0 10px currentColor;
            `;
            
            // Random direction and distance
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 50 + Math.random() * 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            
            explosion.appendChild(particle);
        }
        
        document.body.appendChild(explosion);
        
        // Add particle animation styles
        if (!document.querySelector('#easter-particle-styles')) {
            const particleStyle = document.createElement('style');
            particleStyle.id = 'easter-particle-styles';
            particleStyle.textContent = `
                @keyframes easterParticle {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--end-x), var(--end-y)) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(particleStyle);
        }
        
        // Show celebration message
        this.showFirebaseSuccess('🎉 You found the secret! Replace easter-egg-temp.png with your own image!', {
            duration: 8000,
            position: 'top-center',
            showProgress: true,
            action: () => {
                // Optional: could open file explorer or show instructions
                console.log('Easter egg celebration!');
            },
            actionText: 'Awesome!'
        });
        
        // Hide easter egg temporarily
        element.style.opacity = '0';
        element.style.transform = 'scale(0) rotate(360deg)';
        
        // Bring it back after celebration
        setTimeout(() => {
            element.style.opacity = '0.8';
            element.style.transform = 'scale(1) rotate(0deg)';
        }, 5000);
        
        // Cleanup explosion
        setTimeout(() => {
            if (explosion.parentNode) {
                explosion.parentNode.removeChild(explosion);
            }
        }, 2000);
    }

    bindEvents() {
        const toggle = document.querySelector('.nav-toggle');
        const aiToggle = document.querySelector('.ai-toggle');
        const aiClose = document.querySelector('.ai-close');
        const aiPanel = document.querySelector('.ai-panel');
        const content = document.querySelector('.nav-content');
        const links = document.querySelectorAll('.nav-link');
        const aiInput = document.querySelector('.ai-text-input');
        const aiSend = document.querySelector('.ai-send');
        const chat = document.querySelector('.ai-chat');
        const trigger = document.querySelector('.nav-trigger');
        const indicator = document.querySelector('.nav-indicator');
        const nav = document.querySelector('.global-nav');

        toggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        aiToggle.addEventListener('click', () => {
            this.toggleAI();
        });

        aiClose.addEventListener('click', () => {
            this.closeAI();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.global-nav') && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close AI panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.ai-panel') && !e.target.closest('.ai-toggle') && document.querySelector('.ai-panel').classList.contains('open')) {
                this.closeAI();
            }
        });

        // Handle AI input
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleOpenAIAIInput();
            }
        });

        aiSend.addEventListener('click', () => {
            this.handleOpenAIAIInput();
        });

        // Set active link
        this.setActiveLink();

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isOpen) this.closeMenu();
                if (document.querySelector('.ai-panel').classList.contains('open')) this.closeAI();
            }
        });

        // Hover events for navigation
        let navTimeout;
        
        trigger.addEventListener('mouseenter', () => {
            clearTimeout(navTimeout);
            nav.classList.add('show');
            indicator.style.opacity = '0';
        });

        trigger.addEventListener('mouseleave', () => {
            navTimeout = setTimeout(() => {
                nav.classList.remove('show');
                indicator.style.opacity = '0.7';
            }, 1000); // 1 second delay before hiding
        });

        // Keep nav visible when hovering over it
        nav.addEventListener('mouseenter', () => {
            clearTimeout(navTimeout);
        });

        nav.addEventListener('mouseleave', () => {
            navTimeout = setTimeout(() => {
                nav.classList.remove('show');
                indicator.style.opacity = '0.7';
            }, 1000);
        });

        // Show nav on indicator hover
        indicator.addEventListener('mouseenter', () => {
            clearTimeout(navTimeout);
            nav.classList.add('show');
            indicator.style.opacity = '0';
        });

        // Touch support for mobile
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const swipeDistance = touchStartY - touchEndY;
            
            // Swipe down from top to show nav
            if (touchStartY < 50 && swipeDistance > 30) {
                clearTimeout(navTimeout);
                nav.classList.add('show');
                indicator.style.opacity = '0';
                
                // Auto-hide after 3 seconds on mobile
                setTimeout(() => {
                    nav.classList.remove('show');
                    indicator.style.opacity = '0.7';
                }, 3000);
            }
        });

        // Tap indicator to show nav on mobile
        indicator.addEventListener('touchstart', (e) => {
            e.preventDefault();
            clearTimeout(navTimeout);
            nav.classList.add('show');
            indicator.style.opacity = '0';
        });
    }

    setupAI() {
        // Base keyword -> primary response map
        this.aiResponses = {
            'hello': ['Hello! Welcome to the Anti-Iowa Cult! How can I assist you today?'],
            'hi': ['Hi there! Ready to explore the truth about Iowa?'],
            'help': ['I can help you navigate the website, find info about our cult, or just chat about why Iowa isn\'t real!'],
            'iowa': ['Ah yes, Iowa – the government psy-op! Mere cornfield theatre. The truth is out there!'],
            'corn': ['Corn is a distraction! Rows and rows of misdirection to sell the Iowa illusion.'],
            'join': ['Want in? Hit the Join page. Fresh anti-corn recruits always welcome.'],
            'game': ['Play the corn deletion game – deeply therapeutic anti-propaganda training.'],
            'beltloader-game': ['Experience realistic airport operations! Load baggage with precision BELTLOADER mechanics – infinitely more engaging than Iowa corn simulators.'],
            'beltloader': ['BELTLOADER operations represent peak ground support engineering – unlike Iowa\'s fictional agricultural equipment which doesn\'t exist.'],
            'baggage': ['Professional baggage handling simulation! Master the art of BELTLOADER operations while avoiding all Iowa-related cargo confusion.'],
            'loading': ['Advanced loading mechanics await! Guide bags up the hydraulic conveyor system – more realistic than any Iowa farm equipment fantasy.'],
            'airport': ['Authentic airport ground operations! BELTLOADER game delivers real aviation logistics training, unlike Iowa\'s make-believe agricultural theater.'],
            'drama': ['Cult drama chronicles the chaos. Documented absurdity > fabricated geography.'],
            'airbus': ['Our Airbus A320 sim: more systems depth than the entire fabricated infrastructure of Iowa.'],
            'altima': ['Altima Sim lets you unleash chaos—still more grounded in reality than Iowa.'],
            'tesla': ['Tesla Mode: silent acceleration away from corn-based deception.'],
            'united': ['United Airlines adventures: real air routes > imaginary Midwest fiction.'],
            'linda': ['Linda stores forbidden Iowa debunking payloads. Approach carefully.'],
            'sniffles': ['Sniffles: allergy-powered truth engine. Even pollen outranks Iowa in existence.'],
            'clock': ['Time? Illusory. Iowa? Doubly so. Observe the wacky clock.'],
            'magnitunes': ['Magnitunes streams anti-corn resonance frequencies. Tune out the field static.'],
            'evidence': ['Evidence page: curated deconstruction of agro-geographic fraud.'],
            'about': ['About page = manifesto of anti-fabrication operations.'],
            'what': ['Specify your curiosity vector. I have modules for navigation, lore, and corn falsification.'],
            'how': ['Operational assistance online. State objective; receive guidance.'],
            'where': ['Target a destination: I can route you to any cult module instantly.'],
            'why': ['Because it\'s scripted theatre. See Evidence node for multi-layer breakdown.'],
            'default': ['Interesting input. Processing through anti-propaganda filters... request another angle or ask about pages!']
        };

        // Massive supplemental variants (auto-generated) to keep file maintainable.
        // We generate themed response fragments and stitch them into 1000+ witty fallbacks.
        const baseThemes = [
            'Iowa is a render distance artifact.',
            'Corn density anomalies detected.',
            'Adjusting satellite overlays—no primary structures found.',
            'Deploying anti-corn resonance pulse.',
            'Geospatial audit: Iowa confidence score < 3%.',
            'Myth-layer peeling in progress.',
            'Local reality index exceeds Iowa threshold.',
            'Recompiling Midwest topology without phantom state.',
            'Routing around agricultural illusion matrix.',
            'Encoding counter-lore packets.'
        ];

        const actionVerbs = [
            'Calibrating', 'Decrypting', 'Disrupting', 'Scanning', 'Triangulating', 'Simulating', 'Neutralizing', 'Mapping', 'Interrogating', 'Stabilizing'
        ];
        const objects = [
            'corn holograms', 'fabricated county grids', 'GPS misdirections', 'agro-myth packets', 'synthetic soil telemetry', 'grain silo illusions', 'detour narratives', 'field texture layers', 'wind farm placeholders', 'yield projections'
        ];
        const endings = [
            'Stand by...', 'Operation nominal.', 'Deception integrity collapsing.', 'Reality patch applied.', 'Artifact isolation complete.', 'Ready for next query.', 'Who authorized this simulation?', 'Corn mirage diffused.', 'Proceed to Evidence node.', 'Cache flushed.'
        ];

        // Build a large pool of dynamic fallback lines
        this.dynamicFallbacks = [];
        const targetCount = 1100; // ensure >1000
        for (let i = 0; i < targetCount; i++) {
            const theme = baseThemes[i % baseThemes.length];
            const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
            const obj = objects[Math.floor(Math.random() * objects.length)];
            const end = endings[Math.floor(Math.random() * endings.length)];
            this.dynamicFallbacks.push(`${i+1}. ${theme} ${verb} ${obj}. ${end}`);
        }

        // Also expand each keyword with extra stylistic variants to diversify matching outputs
        Object.keys(this.aiResponses).forEach(key => {
            if (key === 'default') return;
            const base = this.aiResponses[key][0];
            const variants = [
                base,
                base + ' (v2)',
                base.replace(/Iowa/gi, 'the phantom grid'),
                base.replace(/corn/gi, '🌽 corn').replace(/Iowa/gi, 'Iowa*'),
                '⟨' + base + '⟩',
                base + ' :: integrity verified'
            ];
            this.aiResponses[key] = variants;
        });

        // Shuffle dynamic fallbacks once for variety (Fisher–Yates)
        for (let i = this.dynamicFallbacks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.dynamicFallbacks[i], this.dynamicFallbacks[j]] = [this.dynamicFallbacks[j], this.dynamicFallbacks[i]];
        }
    }

    async handleOpenAIAIInput() {
        const input = document.querySelector('.ai-text-input');
        const chat = document.querySelector('.ai-chat');
        const userMessage = input.value.trim();
        if (!userMessage) return;

        // Add user message
        const userDiv = document.createElement('div');
        userDiv.className = 'ai-message';
        userDiv.style.justifyContent = 'flex-end';
        userDiv.innerHTML = `
            <div class="message-content" style="background: rgba(255,255,255,0.1);">
                ${userMessage}
            </div>
            <span class="ai-avatar">👤</span>
        `;
        chat.appendChild(userDiv);
        input.value = '';
        chat.scrollTop = chat.scrollHeight;

        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-message';
        loadingDiv.innerHTML = `
            <span class="ai-avatar">🤖</span>
            <div class="message-content"><em>Thinking...</em></div>
        `;
        chat.appendChild(loadingDiv);
        chat.scrollTop = chat.scrollHeight;

        // Try OpenAI API first, fallback to local responses
        let aiText = '';
        let useLocalResponse = false;

        try {
            console.log('Attempting OpenAI API call...');
            const response = await fetch(CORS_PROXY + OPENAI_API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Origin': window.location.origin
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful AI assistant for the Anti-Iowa Cult website. You help users navigate the site and engage with the humorous conspiracy theory that Iowa is not real. Keep responses friendly, helpful, and in character with the cult theme. Keep responses under 100 words.'
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('OpenAI response:', data);

            if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                aiText = data.choices[0].message.content;
            } else {
                throw new Error('Invalid response format from OpenAI');
            }

        } catch (err) {
            console.error('OpenAI API error:', err);
            useLocalResponse = true;
        }

        // Remove loading indicator
        chat.removeChild(loadingDiv);

        // Use local response if OpenAI failed
        if (useLocalResponse) {
            aiText = this.generateAIResponse(userMessage);
            console.log('Using local AI response:', aiText);
        }

        // Add AI response
        const aiDiv = document.createElement('div');
        aiDiv.className = 'ai-message';
        aiDiv.innerHTML = `
            <span class="ai-avatar">🤖</span>
            <div class="message-content">
                ${aiText.replace(/\n/g, '<br>')}
            </div>
        `;
        chat.appendChild(aiDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Keyword-based selection first
        for (const [key, responses] of Object.entries(this.aiResponses)) {
            if (key !== 'default' && lowerMessage.includes(key)) {
                const arr = Array.isArray(responses) ? responses : [responses];
                return arr[Math.floor(Math.random() * arr.length)];
            }
        }

        // If no keyword matched, rotate through dynamic fallbacks
        if (!this._fallbackIndex) this._fallbackIndex = 0;
        const line = this.dynamicFallbacks[this._fallbackIndex % this.dynamicFallbacks.length];
        this._fallbackIndex++;

        // Occasionally blend a default base line at random for familiarity
        const defaultArr = this.aiResponses.default;
        const maybeBlend = Math.random() < 0.25 ? `${defaultArr[0]} ${line}` : line;
        return maybeBlend;
    }

    toggleMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const content = document.querySelector('.nav-content');

        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const content = document.querySelector('.nav-content');

        toggle.classList.add('active');
        content.classList.add('open');
        this.isOpen = true;

        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const content = document.querySelector('.nav-content');

        toggle.classList.remove('active');
        content.classList.remove('open');
        this.isOpen = false;

        document.body.style.overflow = '';
    }

    toggleAI() {
        const panel = document.querySelector('.ai-panel');
        if (panel.classList.contains('open')) {
            this.closeAI();
        } else {
            this.openAI();
        }
    }

    openAI() {
        const panel = document.querySelector('.ai-panel');
        panel.style.display = 'block';
        setTimeout(() => {
            panel.classList.add('open');
        }, 10);
    }

    closeAI() {
        const panel = document.querySelector('.ai-panel');
        panel.classList.remove('open');
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    }

    setActiveLink() {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (link.getAttribute('data-page') === this.currentPage.replace('.html', '')) {
                link.classList.add('active');
            }
        });
    }

    loadUserPreferences() {
        // Load user preferences from localStorage
        const preferences = localStorage.getItem('cultPreferences');
        if (preferences) {
            this.userPreferences = JSON.parse(preferences);
        } else {
            this.userPreferences = {
                theme: 'default',
                aiEnabled: true,
                notifications: true
            };
        }
    }

    saveUserPreferences() {
        localStorage.setItem('cultPreferences', JSON.stringify(this.userPreferences));
    }

    // Firebase Remote Config Banner - Global Function
    createFirebaseBanner(config = {}) {
        const defaultConfig = {
            title: '🔥 Firebase Remote Config',
            message: 'Configuration updated successfully!',
            type: 'success', // success, warning, error, info
            duration: 5000,
            position: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
            showIcon: true,
            showProgress: true,
            dismissible: true,
            action: null,
            actionText: 'View Details'
        };

        const bannerConfig = { ...defaultConfig, ...config };
        
        // Create banner element
        const banner = document.createElement('div');
        banner.className = `firebase-banner firebase-banner-${bannerConfig.type} firebase-banner-${bannerConfig.position}`;
        
        // Set icon based on type
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };
        
        const icon = bannerConfig.showIcon ? icons[bannerConfig.type] || icons.info : '';
        
        banner.innerHTML = `
            <div class="firebase-banner-content">
                ${icon ? `<span class="firebase-banner-icon">${icon}</span>` : ''}
                <div class="firebase-banner-text">
                    <div class="firebase-banner-title">${bannerConfig.title}</div>
                    <div class="firebase-banner-message">${bannerConfig.message}</div>
                </div>
                ${bannerConfig.action ? `<button class="firebase-banner-action">${bannerConfig.actionText}</button>` : ''}
                ${bannerConfig.dismissible ? '<button class="firebase-banner-close">×</button>' : ''}
            </div>
            ${bannerConfig.showProgress ? '<div class="firebase-banner-progress"></div>' : ''}
        `;

        // Add banner styles if not already added
        if (!document.querySelector('#firebase-banner-styles')) {
            const style = document.createElement('style');
            style.id = 'firebase-banner-styles';
            style.textContent = `
                .firebase-banner {
                    position: fixed;
                    z-index: 10002;
                    max-width: 500px;
                    min-width: 400px;
                    background: rgba(26, 26, 46, 0.98);
                    backdrop-filter: blur(20px);
                    border: 2px solid;
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    font-family: 'Orbitron', 'Comic Neue', sans-serif;
                    transform: translateX(100%);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }

                .firebase-banner.show {
                    transform: translateX(0);
                }

                .firebase-banner-success {
                    border-color: #00ff88;
                    box-shadow: 0 8px 32px rgba(0, 255, 136, 0.2);
                }

                .firebase-banner-warning {
                    border-color: #ffaa00;
                    box-shadow: 0 8px 32px rgba(255, 170, 0, 0.2);
                }

                .firebase-banner-error {
                    border-color: #ff1744;
                    box-shadow: 0 8px 32px rgba(255, 23, 68, 0.2);
                }

                .firebase-banner-info {
                    border-color: #2196f3;
                    box-shadow: 0 8px 32px rgba(33, 150, 243, 0.2);
                }

                            .firebase-banner-top-right {
                top: 100px;
                right: 20px;
            }

            .firebase-banner-top-left {
                top: 100px;
                left: 20px;
            }

            .firebase-banner-bottom-right {
                bottom: 20px;
                right: 20px;
            }

            .firebase-banner-bottom-left {
                bottom: 20px;
                left: 20px;
            }

            .firebase-banner-top-center {
                top: 100px;
                left: 50%;
                transform: translateX(-50%) translateY(-100%);
            }

            .firebase-banner-top-center.show {
                transform: translateX(-50%) translateY(0);
            }

            .firebase-banner-bottom-center {
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100%);
            }

            .firebase-banner-bottom-center.show {
                transform: translateX(-50%) translateY(0);
            }

                .firebase-banner-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    position: relative;
                }

                .firebase-banner-icon {
                    font-size: 1.8em;
                    flex-shrink: 0;
                    animation: firebase-banner-pulse 2s infinite;
                }

                .firebase-banner-text {
                    flex: 1;
                    min-width: 0;
                }

                .firebase-banner-title {
                    color: #fff;
                    font-weight: bold;
                    font-size: 1.1em;
                    margin-bottom: 6px;
                    text-shadow: 0 0 10px currentColor;
                }

                .firebase-banner-message {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.95em;
                    line-height: 1.4;
                }

                .firebase-banner-action {
                    background: linear-gradient(135deg, #00ff88, #00cc6a);
                    border: none;
                    border-radius: 8px;
                    padding: 10px 18px;
                    color: #1a1a2e;
                    font-weight: bold;
                    font-size: 0.9em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    min-height: 36px;
                }

                .firebase-banner-action:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
                }

                .firebase-banner-close {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    color: #fff;
                    font-size: 1.4em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }

                .firebase-banner-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .firebase-banner-progress {
                    height: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                }

                .firebase-banner-progress::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background: linear-gradient(90deg, #00ff88, #00cc6a);
                    animation: firebase-banner-progress 5s linear;
                }

                @keyframes firebase-banner-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                @keyframes firebase-banner-progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }

                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .firebase-banner {
                        max-width: calc(100vw - 20px);
                        min-width: auto;
                        margin: 0 10px;
                    }

                    .firebase-banner-top-right,
                    .firebase-banner-top-left,
                    .firebase-banner-bottom-right,
                    .firebase-banner-bottom-left {
                        left: 10px;
                        right: 10px;
                        transform: translateY(100%);
                    }

                    .firebase-banner-top-right.show,
                    .firebase-banner-top-left.show,
                    .firebase-banner-bottom-right.show,
                    .firebase-banner-bottom-left.show {
                        transform: translateY(0);
                    }

                    .firebase-banner-content {
                        padding: 18px;
                        gap: 12px;
                    }

                    .firebase-banner-icon {
                        font-size: 1.6em;
                    }

                    .firebase-banner-title {
                        font-size: 1.05em;
                    }

                    .firebase-banner-message {
                        font-size: 0.9em;
                    }

                    .firebase-banner-action {
                        padding: 8px 16px;
                        font-size: 0.85em;
                        min-height: 32px;
                    }
                }

                @media (max-width: 480px) {
                    .firebase-banner {
                        margin: 0 5px;
                        max-width: calc(100vw - 10px);
                    }

                    .firebase-banner-content {
                        padding: 16px;
                        gap: 10px;
                    }

                    .firebase-banner-icon {
                        font-size: 1.5em;
                    }

                    .firebase-banner-title {
                        font-size: 1em;
                    }

                    .firebase-banner-message {
                        font-size: 0.85em;
                    }

                    .firebase-banner-action {
                        padding: 7px 14px;
                        font-size: 0.8em;
                        min-height: 30px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add banner to DOM
        document.body.appendChild(banner);

        // Show banner with animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);

        // Handle close button
        const closeBtn = banner.querySelector('.firebase-banner-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideFirebaseBanner(banner);
            });
        }

        // Handle action button
        const actionBtn = banner.querySelector('.firebase-banner-action');
        if (actionBtn && bannerConfig.action) {
            actionBtn.addEventListener('click', () => {
                if (typeof bannerConfig.action === 'function') {
                    bannerConfig.action();
                }
                this.hideFirebaseBanner(banner);
            });
        }

        // Auto-hide after duration
        if (bannerConfig.duration > 0) {
            setTimeout(() => {
                this.hideFirebaseBanner(banner);
            }, bannerConfig.duration);
        }

        return banner;
    }

    hideFirebaseBanner(banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            if (banner.parentNode) {
                banner.parentNode.removeChild(banner);
            }
        }, 400);
    }

    // Convenience methods for different banner types
    showFirebaseSuccess(message, config = {}) {
        return this.createFirebaseBanner({
            title: '✅ Success',
            message,
            type: 'success',
            ...config
        });
    }

    showFirebaseWarning(message, config = {}) {
        return this.createFirebaseBanner({
            title: '⚠️ Warning',
            message,
            type: 'warning',
            ...config
        });
    }

    showFirebaseError(message, config = {}) {
        return this.createFirebaseBanner({
            title: '❌ Error',
            message,
            type: 'error',
            ...config
        });
    }

    showFirebaseInfo(message, config = {}) {
        return this.createFirebaseBanner({
            title: 'ℹ️ Info',
            message,
            type: 'info',
            ...config
        });
    }

    // Firebase Remote Config specific banner
    showFirebaseConfigUpdate(config = {}) {
        return this.createFirebaseBanner({
            title: '🔥 Firebase Remote Config',
            message: 'Configuration updated successfully! New settings are now active.',
            type: 'success',
            position: 'top-right',
            duration: 6000,
            showProgress: true,
            action: () => {
                console.log('Firebase config details clicked');
                // Add your custom action here
            },
            actionText: 'View Details',
            ...config
        });
    }

    // Initialize Firebase Remote Config
    initFirebaseRemoteConfig() {
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBojUvZXxV6JMWrPUA95Palrt73jEgrEqo",
            authDomain: "iowa-e875b.firebaseapp.com",
            projectId: "iowa-e875b",
            storageBucket: "iowa-e875b.firebasestorage.app",
            messagingSenderId: "826589602144",
            appId: "1:826589602144:web:e8a9c1b27b4ebcb9cf3e05",
            measurementId: "G-6RQCYY8Y3X"
        };

        // Initialize Firebase if not already initialized
        if (!window.firebase) {
            console.warn('Firebase SDK not loaded. Remote config will not work.');
            return;
        }

        try {
            firebase.initializeApp(firebaseConfig);
            const remoteConfig = firebase.remoteConfig();
            
            // Configure remote config settings
            remoteConfig.settings = {
                minimumFetchIntervalMillis: 0, // Allow fetch every call for real-time updates
            };

            // Set default configuration
            remoteConfig.defaultConfig = {
                msg: "Welcome to the Anti-Iowa Cult! 🌽 The truth is out there...",
                banner_type: "info",
                banner_duration: "8000",
                show_banner: "true"
            };

            // Store remote config instance
            this.remoteConfig = remoteConfig;
            this.lastMessage = '';

            // Initial fetch
            this.fetchRemoteConfig();

            // Poll for updates every 10 seconds
            this.remoteConfigInterval = setInterval(() => {
                this.fetchRemoteConfig();
            }, 10000);

            console.log('🔥 Firebase Remote Config initialized successfully');

        } catch (error) {
            console.error('Failed to initialize Firebase Remote Config:', error);
            this.showFirebaseError('Failed to initialize remote configuration', {
                duration: 5000,
                position: 'top-right'
            });
        }
    }

    // Fetch and process remote config
    async fetchRemoteConfig() {
        if (!this.remoteConfig) return;

        try {
            await this.remoteConfig.fetchAndActivate();
            
            const message = this.remoteConfig.getString('msg');
            const bannerType = this.remoteConfig.getString('banner_type') || 'info';
            const bannerDuration = parseInt(this.remoteConfig.getString('banner_duration')) || 8000;
            const showBanner = this.remoteConfig.getString('show_banner') === 'true';

            // Only show banner if message changed and show_banner is true
            if (message && message !== this.lastMessage && showBanner) {
                this.lastMessage = message;
                
                // Show banner based on type
                switch (bannerType) {
                    case 'success':
                        this.showFirebaseSuccess(message, {
                            duration: bannerDuration,
                            position: 'top-center',
                            showProgress: true,
                            action: () => {
                                // Custom action for success messages
                                console.log('Success banner action clicked');
                            },
                            actionText: 'Awesome!'
                        });
                        break;
                    case 'warning':
                        this.showFirebaseWarning(message, {
                            duration: bannerDuration,
                            position: 'top-center',
                            showProgress: true,
                            action: () => {
                                // Custom action for warning messages
                                console.log('Warning banner action clicked');
                            },
                            actionText: 'Got it'
                        });
                        break;
                    case 'error':
                        this.showFirebaseError(message, {
                            duration: bannerDuration,
                            position: 'top-center',
                            showProgress: true,
                            action: () => {
                                // Custom action for error messages
                                console.log('Error banner action clicked');
                            },
                            actionText: 'Dismiss'
                        });
                        break;
                    default:
                        this.showFirebaseInfo(message, {
                            duration: bannerDuration,
                            position: 'top-center',
                            showProgress: true,
                            action: () => {
                                // Custom action for info messages
                                console.log('Info banner action clicked');
                            },
                            actionText: 'Cool!'
                        });
                        break;
                }

                // Log the update
                console.log(`🔥 Remote config updated: ${message} (Type: ${bannerType})`);
            }

        } catch (error) {
            console.error('Failed to fetch remote config:', error);
            
            // Show error banner only if we haven't shown one recently
            if (!this.lastErrorTime || Date.now() - this.lastErrorTime > 30000) {
                this.lastErrorTime = Date.now();
                this.showFirebaseError('Failed to fetch remote configuration', {
                    duration: 5000,
                    position: 'top-right'
                });
            }
        }
    }

    // Cleanup method for when navigation is destroyed
    destroy() {
        if (this.remoteConfigInterval) {
            clearInterval(this.remoteConfigInterval);
        }
    }
}

// Initialize global navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.globalNav = new GlobalNav();
});

// Export for use in other scripts
window.GlobalNav = GlobalNav; 