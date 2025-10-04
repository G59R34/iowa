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
        this.firebaseInitialized = false;
        this.audioContext = null;
        this.sounds = {};
        this.lastMouseEvent = null;
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

    // Initialize Firebase and show the MOTD banner
    initializeFirebase() {
        if (this.firebaseInitialized) return;
        
        console.log('🔥 Initializing Firebase for global navigation...');
        
        // Check if Firebase is already loaded
        if (typeof firebase === 'undefined') {
            console.log('📦 Loading Firebase scripts...');
            this.loadFirebaseScripts().then(() => {
                this.setupFirebaseConfig();
            }).catch((error) => {
                console.error('❌ Failed to load Firebase:', error);
                this.showDefaultBanner();
            });
        } else {
            this.setupFirebaseConfig();
        }
    }

    // Load Firebase scripts dynamically
    async loadFirebaseScripts() {
        const scripts = [
            'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
            'https://www.gstatic.com/firebasejs/10.12.2/firebase-remote-config-compat.js'
        ];

        for (const scriptUrl of scripts) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = scriptUrl;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
    }

    // Setup Firebase configuration and Remote Config
    setupFirebaseConfig() {
        try {
            const firebaseConfig = {
                apiKey: "AIzaSyBojUvZXxV6JMWrPUA95Palrt73jEgrEqo",
                authDomain: "iowa-e875b.firebaseapp.com",
                projectId: "iowa-e875b",
                storageBucket: "iowa-e875b.firebasestorage.app",
                messagingSenderId: "826589602144",
                appId: "1:826589602144:web:e8a9c1b27b4ebcb9cf3e05",
                measurementId: "G-6RQCYY8Y3X"
            };

            // Initialize Firebase only once
            if (!window.firebaseApp) {
                window.firebaseApp = firebase.initializeApp(firebaseConfig);
            }

            const remoteConfig = firebase.remoteConfig();
            remoteConfig.settings = {
                minimumFetchIntervalMillis: 3600000, // 1 hour
            };
            remoteConfig.defaultConfig = {
                msg: "🌽 Welcome to CornClub - The Anti-Iowa Experience! 🌽",
            };

            this.fetchFirebaseMessage(remoteConfig);
            this.firebaseInitialized = true;

        } catch (error) {
            console.error('❌ Firebase setup failed:', error);
            this.showDefaultBanner();
        }
    }

    // Fetch message from Firebase Remote Config
    fetchFirebaseMessage(remoteConfig) {
        console.log('📡 Fetching Firebase Remote Config...');
        
        remoteConfig.fetchAndActivate()
            .then(() => {
                console.log('✅ Firebase Remote Config fetched successfully');
                const motd = remoteConfig.getString('msg');
                console.log('📝 Retrieved message:', motd);
                
                if (motd && motd.trim() !== '') {
                    this.showBanner(motd);
                    console.log('🎉 Banner displayed with remote message');
                } else {
                    this.showBanner(remoteConfig.defaultConfig.msg);
                    console.log('📢 Banner displayed with default message');
                }
            })
            .catch((err) => {
                console.error('❌ Firebase Remote Config failed:', err);
                this.showBanner(remoteConfig.defaultConfig.msg);
                console.log('🔄 Banner displayed with fallback message');
            });

        // Timeout fallback
        setTimeout(() => {
            const banner = document.getElementById('motd-banner');
            if (!banner || banner.style.display === 'none') {
                console.log('⏰ Timeout reached, showing default message');
                this.showBanner(remoteConfig.defaultConfig.msg);
            }
        }, 5000);
    }

    // Show the MOTD banner
    showBanner(message) {
        let banner = document.getElementById('motd-banner');
        
        if (!banner) {
            // Create banner if it doesn't exist
            banner = document.createElement('div');
            banner.id = 'motd-banner';
            banner.style.cssText = `
                width: 100vw;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 100000;
                background: linear-gradient(90deg, #ff00cc, #1bffff);
                color: #fff;
                font-family: 'Orbitron', 'Inter', sans-serif;
                font-size: 1.1em;
                font-weight: 600;
                text-align: center;
                padding: 0.8em 1em;
                box-shadow: 0 4px 32px rgba(255, 0, 204, 0.5);
                display: none;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            `;
            
            // Add click to dismiss functionality
            banner.addEventListener('click', () => {
                this.playSound('banner', 0.15);
                banner.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    banner.style.display = 'none';
                    // Remove banner class from nav
                    const nav = document.getElementById('global-nav');
                    if (nav) nav.classList.remove('with-banner');
                }, 300);
            });

            // Add hover effect
            banner.addEventListener('mouseenter', () => {
                this.playSound('hover', 0.08);
                banner.style.background = 'linear-gradient(90deg, #ff00cc, #00ff88)';
            });
            
            banner.addEventListener('mouseleave', () => {
                banner.style.background = 'linear-gradient(90deg, #ff00cc, #1bffff)';
            });

            document.body.appendChild(banner);
        }

        banner.textContent = message;
        banner.style.display = 'block';
        banner.style.transform = 'translateY(0)';
        
        // Add banner class to nav to adjust its position
        const nav = document.getElementById('global-nav');
        if (nav) {
            nav.classList.add('with-banner');
        }
    }

    // Show default banner when Firebase fails
    showDefaultBanner() {
        this.showBanner('🌽 Welcome to CornClub - The Anti-Iowa Experience! 🌽');
    }

    // Initialize audio context and create sound effects
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSoundEffects();
            console.log('🔊 Audio system initialized');
        } catch (error) {
            console.log('🔇 Audio not available:', error);
        }
    }

    // Create various bloop and interaction sounds
    createSoundEffects() {
        if (!this.audioContext) return;

        // Different sound frequencies for different interactions
        this.sounds = {
            hover: { frequency: 800, duration: 0.1, type: 'sine' },
            click: { frequency: 600, duration: 0.15, type: 'square' },
            dropdown: { frequency: 400, duration: 0.2, type: 'triangle' },
            chat: { frequency: 1000, duration: 0.25, type: 'sawtooth' },
            banner: { frequency: 500, duration: 0.3, type: 'sine' },
            nav_show: { frequency: 700, duration: 0.2, type: 'triangle' },
            nav_hide: { frequency: 300, duration: 0.15, type: 'sine' }
        };
    }

    // Play a bloop sound effect
    playSound(soundType, volume = 0.1) {
        if (!this.audioContext || !this.sounds[soundType]) return;

        try {
            // Resume audio context if suspended (required by browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const sound = this.sounds[soundType];
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Configure oscillator
            oscillator.type = sound.type;
            oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);

            // Create envelope for natural sound
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);

            // Connect and play
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + sound.duration);

        } catch (error) {
            console.log('🔇 Sound playback failed:', error);
        }
    }

    // Play a more complex bloop with pitch sweep
    playBloop(startFreq = 400, endFreq = 800, duration = 0.2, volume = 0.1) {
        if (!this.audioContext) return;

        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration * 0.7);

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);

        } catch (error) {
            console.log('🔇 Bloop playback failed:', error);
        }
    }

    // Add sound effects to navigation elements
    addSoundEffectsToNav() {
        const nav = document.getElementById('global-nav');
        if (!nav) return;

        // Add sounds to navigation links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            // Hover sound
            link.addEventListener('mouseenter', () => {
                this.playSound('hover', 0.06);
            });

            // Click sound
            link.addEventListener('click', () => {
                this.playSound('click', 0.1);
            });
        });

        // Add sounds to dropdown items
        const dropdownLinks = nav.querySelectorAll('.dropdown-content a');
        dropdownLinks.forEach(link => {
            // Hover sound for dropdown items
            link.addEventListener('mouseenter', () => {
                this.playSound('dropdown', 0.05);
            });

            // Click sound for dropdown items
            link.addEventListener('click', () => {
                this.playBloop(500, 800, 0.18, 0.08);
            });
        });

        // Add special sound for AI chat link
        const aiChatLink = nav.querySelector('.ai-chat-link');
        if (aiChatLink) {
            aiChatLink.addEventListener('click', () => {
                this.playSound('chat', 0.12);
            });
        }

        // Add sounds to dropdown show/hide
        const dropdowns = nav.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            dropdown.addEventListener('mouseenter', () => {
                if (dropdownContent) {
                    this.playBloop(400, 700, 0.1, 0.04);
                }
            });

            dropdown.addEventListener('mouseleave', () => {
                if (dropdownContent) {
                    this.playBloop(700, 400, 0.08, 0.03);
                }
            });
        });
    }

    // Helper method to check if mouse is near navigation area
    isMouseNearNav(navRect, buffer) {
        const mouseEvent = this.lastMouseEvent;
        if (!mouseEvent) return false;
        
        return (
            mouseEvent.clientX >= navRect.left - buffer &&
            mouseEvent.clientX <= navRect.right + buffer &&
            mouseEvent.clientY >= navRect.top - buffer &&
            mouseEvent.clientY <= navRect.bottom + buffer
        );
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createNav();
                this.initializeFirebase();
                this.initializeAudio();
            });
        } else {
            this.createNav();
            this.initializeFirebase();
            this.initializeAudio();
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
                    <h1>🌽 CornClub</h1>
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
                height: 50px;
                z-index: 9999;
                background: transparent;
                cursor: pointer;
                pointer-events: all;
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
                transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease-out;
                border-radius: 0 0 32px 32px;
                overflow: visible;
                will-change: transform, opacity;
            }

            /* Adjust nav position when banner is visible */
            .global-nav.with-banner {
                top: 60px;
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
        this.addSoundEffectsToNav();

        console.log('Global navigation initialized successfully');
    }

    bindEvents() {
        const nav = document.getElementById('global-nav');
        const trigger = document.getElementById('nav-trigger');
        
        // Optimized navigation state management
        this.navTimeout = null;
        this.dropdownTimeout = null;
        this.isNavHovered = false;
        this.isDropdownHovered = false;
        
        // Debounced functions for better performance with cleanup
        const debounce = (func, wait) => {
            let timeout;
            const debounced = function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    timeout = null;
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
            debounced.cancel = () => {
                clearTimeout(timeout);
                timeout = null;
            };
            return debounced;
        };
        
        // Optimized show/hide functions
        const showNav = () => {
            if (this.navTimeout) {
                clearTimeout(this.navTimeout);
                this.navTimeout = null;
            }
            
            if (!this.navVisible) {
                requestAnimationFrame(() => {
                    nav.style.transform = 'translateY(0)';
                    nav.style.opacity = '1';
                    this.navVisible = true;
                    if (this.playBloop) {
                        this.playBloop(300, 600, 0.1, 0.05);
                    }
                });
            }
        };
        
        const hideNav = (delay = 2000) => {
            if (this.navTimeout) {
                clearTimeout(this.navTimeout);
            }
            
            this.navTimeout = setTimeout(() => {
                if (!this.isNavHovered && !this.isDropdownHovered && !this.chatVisible) {
                    requestAnimationFrame(() => {
                        nav.style.transform = 'translateY(-100%)';
                        nav.style.opacity = '0';
                        this.navVisible = false;
                        if (this.playBloop) {
                            this.playBloop(600, 300, 0.08, 0.04);
                        }
                    });
                }
            }, delay);
        };
        
        // Optimized mouse position tracking with throttling
        let mouseY = 0;
        const updateMouseY = (e) => {
            mouseY = e.clientY;
        };
        const throttledMouseUpdate = debounce(updateMouseY, 16); // ~60fps
        
        // Trigger area events
        trigger.addEventListener('mouseenter', showNav, { passive: true });
        trigger.addEventListener('click', showNav, { passive: true });
        
        // Navigation hover events
        nav.addEventListener('mouseenter', () => {
            this.isNavHovered = true;
            showNav();
        }, { passive: true });
        
        nav.addEventListener('mouseleave', () => {
            this.isNavHovered = false;
            hideNav(800); // Shorter delay when leaving nav
        }, { passive: true });
        
        // Optimized mouse movement detection with intersection observer fallback
        let isNearTop = false;
        document.addEventListener('mousemove', (e) => {
            const newIsNearTop = e.clientY < 80;
            if (newIsNearTop && !isNearTop && !this.navVisible) {
                showNav();
            }
            isNearTop = newIsNearTop;
        }, { passive: true });
        
        // Simplified dropdown handling
        const dropdowns = nav.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            if (dropdownContent) {
                dropdown.addEventListener('mouseenter', () => {
                    this.isDropdownHovered = true;
                    if (this.dropdownTimeout) {
                        clearTimeout(this.dropdownTimeout);
                    }
                    requestAnimationFrame(() => {
                        dropdownContent.style.opacity = '1';
                        dropdownContent.style.visibility = 'visible';
                        dropdownContent.style.transform = 'translate3d(0, 0, 0) scale(1)';
                        dropdownContent.style.willChange = 'transform, opacity';
                    });
                }, { passive: true });
                
                dropdown.addEventListener('mouseleave', () => {
                    this.isDropdownHovered = false;
                    this.dropdownTimeout = setTimeout(() => {
                        requestAnimationFrame(() => {
                            dropdownContent.style.opacity = '0';
                            dropdownContent.style.visibility = 'hidden';
                            dropdownContent.style.transform = 'translate3d(0, -10px, 0) scale(0.98)';
                            // Remove willChange after animation for memory efficiency
                            setTimeout(() => {
                                dropdownContent.style.willChange = 'auto';
                            }, 200);
                        });
                    }, 200);
                    hideNav(1000);
                }, { passive: true });
            }
        });
        
        // Touch support for mobile
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchY - touchStartY;
            
            if (touchStartY < 50 && deltaY > 30 && !this.navVisible) {
                showNav();
            }
        }, { passive: true });
        
        // Initial nav display
        setTimeout(() => {
            showNav();
            hideNav(4000); // Hide after 4 seconds if no interaction
        }, 300);
        
        // Handle window focus/blur for better performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Clear all timers when tab is hidden for memory efficiency
                if (this.navTimeout) {
                    clearTimeout(this.navTimeout);
                    this.navTimeout = null;
                }
                if (this.dropdownTimeout) {
                    clearTimeout(this.dropdownTimeout);
                    this.dropdownTimeout = null;
                }
            }
        });
        
        // Performance monitoring and cleanup
        this.cleanup = () => {
            if (this.navTimeout) clearTimeout(this.navTimeout);
            if (this.dropdownTimeout) clearTimeout(this.dropdownTimeout);
            if (throttledMouseUpdate && throttledMouseUpdate.cancel) {
                throttledMouseUpdate.cancel();
            }
        };
        
        // Auto-cleanup on page unload
        window.addEventListener('beforeunload', this.cleanup);
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
                this.playSound('click', 0.1);
                this.sendMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.playSound('click', 0.1);
                    this.sendMessage();
                }
            });

            // Add typing sounds
            chatInput.addEventListener('input', () => {
                this.playSound('hover', 0.03);
            });
        }
    }

    toggleChat() {
        const chatPanel = document.getElementById('ai-chat-panel');
        const nav = document.getElementById('global-nav');
        
        if (chatPanel) {
            this.chatVisible = !this.chatVisible;
            
            // Play sound based on chat state
            if (this.chatVisible) {
                this.playBloop(300, 900, 0.3, 0.1);
            } else {
                this.playBloop(900, 300, 0.2, 0.08);
            }
            
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

        // Play different sounds for different message types
        if (sender === 'user') {
            this.playBloop(600, 400, 0.15, 0.06);
        } else {
            this.playBloop(400, 600, 0.2, 0.07);
        }
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

        // Massive collection of 500+ AI responses about website and random topics
        const responses = [
            // Website-specific responses
            "That's interesting! The Iowa website has lots of cool features. Have you tried our games section? 🎮",
            "I'm here to help you explore everything Iowa has to offer! What catches your interest? 🌽",
            "Great question! The Iowa website is packed with entertainment. Check out our Tesla section or games! ⚡",
            "I love chatting about the Iowa website! There's so much to discover here. What's your favorite type of content? 🎯",
            "Thanks for using Iowa! I'm always here to help you find the best content on our site. 🤖",
            
            // Games and entertainment responses
            "The Airbus A320 simulator is incredibly detailed! Feel like a real pilot! ✈️",
            "Have you tried the Toilet Game yet? It's surprisingly addictive! 🚽",
            "The Altima Simulator lets you drive like a maniac legally! 🚗💨",
            "Belt Loader game is perfect for aviation enthusiasts! Load those bags! 🛄",
            "Mrs. Sniffles is a beloved character here! Check out her adventures! 👵",
            "Flying Cutie offers graceful and sensual flight experiences! 🦋",
            "Porcupine Hype brings Shakespearean study-level excitement! 🦔",
            "Sink Hype delivers the ultimate kitchen sink experience! 🚰",
            "The Clock page shows that time is truly an illusion! ⏰",
            "Magnitunes streams the perfect anti-corn vibes! 🎵",
            
            // Tesla-related responses
            "Tesla Mode offers silent acceleration away from deception! ⚡",
            "The Supercharger simulator is study-level authentic! 🔋",
            "Electric dreams await in our Tesla section! ⚡✨",
            "Experience the future of transportation with Tesla content! 🚗⚡",
            
            // Random tech and internet culture
            "Did you know the first computer bug was an actual bug? 🐛💻",
            "The internet weighs about as much as a strawberry! 🍓🌐",
            "Cats make up 15% of all internet traffic! 🐱📊",
            "The @ symbol is actually called an 'arroba'! @️⃣",
            "WiFi doesn't stand for anything - it's just a made-up name! 📶",
            "The first YouTube video was about elephants at a zoo! 🐘📹",
            "Google was originally called 'BackRub'! 🤔🔍",
            "The first email was sent in 1971! 📧⏰",
            "Amazon started as just a bookstore! 📚📦",
            "Facebook was originally only for college students! 👨‍🎓📱",
            
            // Space and science facts
            "Space smells like hot metal and welding fumes! 🚀🔧",
            "There are more trees on Earth than stars in our galaxy! 🌳⭐",
            "Honey never spoils - 3000-year-old honey is still edible! 🍯⏳",
            "Octopuses have three hearts and blue blood! 🐙💙",
            "A group of flamingos is called a 'flamboyance'! 🦩✨",
            "Bananas are berries, but strawberries aren't! 🍌🍓",
            "Sharks have been around longer than trees! 🦈🌲",
            "The human brain uses about 20% of the body's energy! 🧠⚡",
            "Lightning strikes Earth 100 times per second! ⚡🌍",
            "The deepest part of the ocean is deeper than Everest is tall! 🌊🏔️",
            
            // Food and cooking facts
            "Chocolate was once used as currency by the Aztecs! 🍫💰",
            "Carrots were originally purple, not orange! 🥕💜",
            "Pineapples take 2 years to grow! 🍍⏰",
            "Vanilla is the second most expensive spice after saffron! 🍦💰",
            "Tomatoes are technically fruits, not vegetables! 🍅🤔",
            "Cashews grow on trees attached to cashew apples! 🥜🍎",
            "Ripe cranberries bounce like rubber balls! 🫐⚾",
            "Almonds are actually seeds, not nuts! 🌰🤯",
            "A single coffee plant produces about 1 pound of coffee per year! ☕🌱",
            "Avocados are toxic to dogs and cats! 🥑🐕",
            
            // Historical curiosities
            "Napoleon was actually average height for his time! 👑📏",
            "Cleopatra lived closer in time to the Moon landing than the pyramids! 🏺🚀",
            "Oxford University is older than the Aztec Empire! 🎓🏛️",
            "The Great Wall of China isn't visible from space! 🏯🚀",
            "Vikings never wore horned helmets! ⚔️🤔",
            "The shortest war in history lasted 38-45 minutes! ⚔️⏰",
            "Ancient Romans used urine as mouthwash! 🏛️😬",
            "The first known vending machine sold holy water! ⛪🥤",
            "Bubble wrap was originally invented as wallpaper! 📦🏠",
            "The microwave was invented by accident! 📡🍔",
            
            // Animal kingdom weirdness
            "Dolphins have names for each other! 🐬📛",
            "Elephants are afraid of bees! 🐘🐝",
            "Penguins propose with pebbles! 🐧💍",
            "A shrimp's heart is in its head! 🦐❤️",
            "Butterflies taste with their feet! 🦋👅",
            "Polar bears have black skin under white fur! 🐻‍❄️⚫",
            "Giraffes only sleep 2 hours per day! 🦒😴",
            "Sloths can hold their breath longer than dolphins! 🦥💨",
            "Koalas sleep 22 hours a day! 🐨😴",
            "A group of pugs is called a 'grumble'! 🐕😤",
            
            // Weather and nature phenomena
            "It can rain diamonds on Neptune and Uranus! 💎🌧️",
            "Lightning is hotter than the surface of the Sun! ⚡☀️",
            "Raindrops are shaped like hamburger buns, not teardrops! 🌧️🍔",
            "The loudest sound ever recorded was a volcano eruption! 🌋🔊",
            "Snow is actually transparent, not white! ❄️👁️",
            "The Arctic Ocean is the smallest and shallowest ocean! 🌊❄️",
            "Hurricanes in the Northern Hemisphere spin counterclockwise! 🌀➡️",
            "The Sahara Desert gets snow occasionally! 🏜️❄️",
            "Tornadoes can have winds over 300 mph! 🌪️💨",
            "The Amazon rainforest produces 20% of Earth's oxygen! 🌳💨",
            
            // Body and health facts
            "Your stomach gets an entirely new lining every 3-5 days! 🤤🔄",
            "Humans are the only animals that cry emotional tears! 😢👤",
            "Your foot is the same length as the distance between your wrist and elbow! 👣📏",
            "You can't hum while holding your nose! 🎵👃",
            "Your brain is 75% water! 🧠💧",
            "Fingernails grow faster on your dominant hand! 💅⚡",
            "You blink about 17,000 times per day! 👁️⏰",
            "The human body contains enough iron to make a nail! 🔨⚡",
            "Your heart beats about 100,000 times per day! ❤️⏰",
            "Humans share 50% of their DNA with bananas! 🧬🍌",
            
            // Gaming and entertainment trivia
            "The best-selling video game of all time is Minecraft! 🎮📦",
            "Pac-Man was inspired by a pizza with a missing slice! 🍕👻",
            "Mario was originally called 'Jumpman'! 🍄👨‍🔧",
            "The Legend of Zelda was named after Zelda Fitzgerald! ⚔️👸",
            "Tetris was created by a Russian programmer in 1984! 🧩🇷🇺",
            "The first arcade game was Pong in 1972! 🏓📺",
            "Pokemon stands for 'Pocket Monsters'! 👾🎒",
            "The PlayStation was originally a Nintendo console! 🎮🤝",
            "Grand Theft Auto was originally a racing game! 🚗💨",
            "The Sims was inspired by architecture software! 🏠👥",
            
            // Language and communication
            "The word 'set' has the most definitions in English! 📖⚙️",
            "Japanese has a word for buying books and not reading them! 📚🇯🇵",
            "Sign language has regional accents! 🤟🗣️",
            "The oldest known written joke is 4,000 years old! 📜😂",
            "English has borrowed words from over 350 languages! 🗣️🌍",
            "The letter 'E' is the most common letter in English! 📝E️⃣",
            "Esperanto was designed to be a universal language! 🌍🗣️",
            "Mandarin Chinese has over 50,000 characters! 🇨🇳📝",
            "Hawaiian has only 13 letters in its alphabet! 🏝️🔤",
            "The word 'dreamt' is the only English word ending in 'mt'! 😴📝",
            
            // Music and sound facts
            "A song gets stuck in your head because your brain needs closure! 🎵🧠",
            "The most expensive musical instrument ever sold was a violin for $16 million! 🎻💰",
            "Beethoven was completely deaf when he composed his 9th Symphony! 🎼👂",
            "The Beatles never learned to read music! 🎸📝",
            "A hummingbird's wings beat 80 times per second! 🐦💨",
            "The human ear can distinguish about 1 trillion different sounds! 👂🔊",
            "Whales sing songs that can travel thousands of miles! 🐋🎵",
            "Crickets chirp faster when it's warmer! 🦗🌡️",
            "The longest recorded guitar solo is over 24 minutes! 🎸⏰",
            "Cats purr at the same frequency as diesel engines! 🐱🚛",
            
            // Art and creativity
            "The Mona Lisa has no eyebrows because it was fashionable to remove them! 🎨👁️",
            "Van Gogh only sold one painting during his lifetime! 🎨💰",
            "The color orange was named after the fruit, not the other way around! 🍊🎨",
            "Pablo Picasso's first word was 'piz' for pencil! ✏️👶",
            "The Statue of Liberty was originally brown! 🗽🤎",
            "LEGO is the world's largest tire manufacturer! 🧱🚗",
            "Crayola makes over 3 billion crayons per year! 🖍️📊",
            "The most expensive painting sold for $450 million! 🎨💰",
            "Banksy's identity is still unknown! 🎨❓",
            "The largest art canvas painting is bigger than a football field! 🎨🏈",
            
            // Transportation and travel
            "Airplanes are struck by lightning once per 1,000 flight hours! ✈️⚡",
            "The longest flight in the world is 19 hours! ✈️⏰",
            "Cruise ships have their own zip codes! 🚢📮",
            "The first speed limit was 2 mph in 1865! 🚗🐌",
            "Hot air balloons were invented before cars! 🎈🚗",
            "The Orient Express still runs today! 🚂✨",
            "Bicycles are more efficient than any animal at converting energy! 🚲⚡",
            "The Interstate Highway System was inspired by the Autobahn! 🛣️🇩🇪",
            "Ships are built in sections and welded together! 🚢🔧",
            "The first traffic light was installed in London in 1868! 🚦🇬🇧",
            
            // Sports and competition
            "Golf balls have dimples to help them fly farther! ⛳💨",
            "The Olympics used to give medals for art competitions! 🏅🎨",
            "Basketball hoops are exactly 10 feet high everywhere! 🏀📏",
            "A baseball has 108 stitches! ⚾🧵",
            "Soccer is played in more countries than any other sport! ⚽🌍",
            "The fastest recorded tennis serve was 163.7 mph! 🎾💨",
            "Ice hockey pucks are frozen before games! 🏒❄️",
            "Marathon races are exactly 26.2 miles long! 🏃‍♂️📏",
            "The Super Bowl uses about 14,000 tons of snacks! 🏈🍿",
            "Ping pong balls must bounce exactly 23cm when dropped! 🏓📏",
            
            // Money and economics
            "The most expensive coffee comes from cat poop! ☕🐱",
            "Credit cards were invented in 1950! 💳📅",
            "The penny costs more to make than it's worth! 🪙💰",
            "Bitcoin was created by an unknown person or group! ₿❓",
            "The dollar sign ($) comes from Spanish currency! 💲🇪🇸",
            "Monopoly money is printed more than real money! 🎲💵",
            "The stock market closes for major holidays! 📈🎉",
            "Gold is measured in troy ounces, not regular ounces! 🥇⚖️",
            "The most expensive spice is saffron at $5,000 per pound! 🌶️💰",
            "Cashless societies existed before cash was invented! 💳📿",
            
            // Geography and places
            "Russia has 11 time zones! 🇷🇺⏰",
            "Alaska is both the westernmost and easternmost US state! 🗺️❄️",
            "The shortest place name is 'Y' in France! 📍🇫🇷",
            "Vatican City is the smallest country in the world! ⛪🌍",
            "The equator passes through 13 countries! 🌍➡️",
            "Antarctica is the world's largest desert! ❄️🏜️",
            "The Pacific Ocean is larger than all land masses combined! 🌊🌍",
            "Mount Everest grows about 4mm each year! 🏔️📈",
            "The Dead Sea is actually a lake! 🌊💀",
            "Canada has more lakes than the rest of the world combined! 🇨🇦🏞️",
            
            // Random weird facts
            "A group of crows is called a 'murder'! 🐦‍⬛⚰️",
            "Banging your head against a wall burns 150 calories per hour! 🤕⚡",
            "A crocodile can't stick its tongue out! 🐊👅",
            "Peanuts aren't nuts - they're legumes! 🥜🤔",
            "A duck's quack doesn't echo! 🦆🔊",
            "Sharks existed before trees! 🦈🌲",
            "Your nose can remember 50,000 different scents! 👃🧠",
            "Bubble wrap was invented as insulation! 📦🏠",
            "The unicorn is Scotland's national animal! 🦄🏴󠁧󠁢󠁳󠁣󠁴󠁿",
            "Butterflies can see ultraviolet light! 🦋👁️",
            
            // Time and calendar facts
            "A day on Venus is longer than its year! ♀️⏰",
            "Leap years exist because Earth's orbit isn't exactly 365 days! 📅🌍",
            "The calendar we use was created by Julius Caesar! 📅👑",
            "February used to be the last month of the year! 📅❄️",
            "Some cultures have 13-month calendars! 📅1️⃣3️⃣",
            "The concept of weekends is relatively modern! 📅😴",
            "Daylight Saving Time was invented during World War I! ⏰⚔️",
            "The longest day of the year has the earliest sunset! 🌅🤔",
            "Time zones were created by railroad companies! 🚂⏰",
            "A 'jiffy' is an actual unit of time! ⚡⏱️",
            
            // Clothing and fashion
            "Blue jeans were invented for gold miners! 👖⛏️",
            "High heels were originally worn by men! 👠👨",
            "Buttons on men's and women's clothes are on opposite sides! 🔘↔️",
            "The zipper was invented in 1893! 🤐📅",
            "Velcro was inspired by plant burrs! 🌱🔗",
            "The little pocket in jeans was for pocket watches! 👖⌚",
            "Ties were originally worn by Croatian soldiers! 👔⚔️",
            "The wedding dress tradition of white started with Queen Victoria! 👰👑",
            "Sneakers were called that because they were quiet! 👟🤫",
            "The first fashion magazine was published in 1586! 📖👗",
            
            // Entertainment industry secrets
            "Movie theater popcorn costs more per ounce than filet mignon! 🍿💰",
            "The Wilhelm Scream appears in hundreds of movies! 🎬😱",
            "Mickey Mouse gloves have only 4 fingers to save animation costs! 🐭🧤",
            "The voice of Yoda was performed by the same person as Miss Piggy! 🐸👽",
            "Steven Spielberg was rejected from film school twice! 🎬📚",
            "The Netflix logo used to be purple and black! 📺💜",
            "Disney World is the size of San Francisco! 🏰🌉",
            "The first movie theater opened in 1905! 🎬🏛️",
            "CGI was first used in movies in 1973! 💻🎬",
            "The longest movie ever made is 87 hours long! 🎬⏰",
            
            // Closing conversational responses
            "What an interesting topic! Is there anything specific about the Iowa website you'd like to explore? 🌽",
            "I love sharing random facts! Have you checked out our entertainment section yet? 🎭",
            "That was fun to discuss! Want to try one of our awesome games? 🎮",
            "Random knowledge is the best knowledge! What part of Iowa interests you most? 🤔",
            "Hope that was entertaining! The Iowa website has tons more cool stuff to discover! ✨",
            "Facts are fascinating! Speaking of fascinating, have you seen our Tesla content? ⚡",
            "Knowledge is power! Power like our Supercharger simulator! 🔋",
            "I could talk about random stuff all day! But Iowa's entertainment section is pretty great too! 🎪",
            "Learning new things is awesome! Just like learning to play our games! 📚",
            "The world is full of amazing facts! Just like Iowa is full of amazing content! 🌍",
            
            // 1000+ MORE RESPONSES - Pop Culture & Movies
            "The Matrix code is actually recipes for sushi! 💊🍣",
            "Stan Lee appeared in every Marvel movie until 2019! 🦸‍♂️🎬",
            "The Titanic movie cost more than the actual Titanic! 🚢💰",
            "E.T. was played by a woman in a costume and a 12-year-old boy! 👽👦",
            "The roar in The Lion King is actually a tiger, not a lion! 🦁🐅",
            "Darth Vader never says 'Luke, I am your father' - it's 'No, I am your father'! ⚔️👨‍👦",
            "The Blair Witch Project was made for only $60,000! 📹💰",
            "Shrek was originally supposed to be voiced by Chris Farley! 👹🎭",
            "The word 'paparazzi' comes from a character in a Fellini film! 📸🎬",
            "Jennifer Lawrence tripped at the Oscars because of her dress! 🏆👗",
            
            // Technology Deep Dive
            "The first computer virus was created in 1986 and called 'Brain'! 🧠💻",
            "QR codes can store 4,296 characters of data! 📱⬜",
            "The first webcam was used to watch a coffee pot! ☕📹",
            "Bluetooth is named after a Viking king! 📶👑",
            "The first domain name ever registered was symbolics.com! 🌐1️⃣",
            "Your smartphone has more computing power than NASA in 1969! 📱🚀",
            "The term 'bug' in programming comes from an actual moth! 🐛💻",
            "CAPTCHA stands for 'Completely Automated Public Turing test'! 🤖✅",
            "The first banner ad had a click-through rate of 44%! 📢🖱️",
            "USB stands for Universal Serial Bus! 🔌🚌",
            
            // Social Media & Internet Culture
            "The hashtag symbol is officially called an octothorpe! #️⃣🐙",
            "The first tweet was 'just setting up my twttr'! 🐦📱",
            "Instagram was originally called Burbn! 📸🥃",
            "YouTube's first video has over 250 million views! 📹👀",
            "The term 'surfing the web' was coined in 1992! 🏄‍♂️🌐",
            "Reddit means 'read it' - as in 'I read it on Reddit'! 👁️📖",
            "The @ symbol was used in emails before the internet! @📧",
            "GIFs are pronounced 'jif' according to their creator! 🖼️🔤",
            "The most liked Instagram photo has 55+ million likes! 💖📸",
            "TikTok was originally called Musical.ly! 🎵📱",
            
            // Gaming Extended Universe
            "Super Mario's mustache exists because pixels were limited! 👨🎮",
            "The Legend of Zelda's save feature was revolutionary in 1986! 💾⚔️",
            "Pac-Man's original name was Puck-Man! 🟡👻",
            "The highest-grossing arcade game of all time is Pac-Man! 🕹️💰",
            "Minecraft has sold over 300 million copies! 📦🌍",
            "The original Donkey Kong was supposed to be a Popeye game! 🍌⚓",
            "Final Fantasy got its name because the company thought it would be their last game! ⚔️🏁",
            "Angry Birds was inspired by swine flu! 🐦🐷",
            "The cake in Portal is not a lie - it's chocolate! 🍰🤖",
            "Sonic the Hedgehog was almost called Mr. Needlemouse! 💙🦔",
            
            // Music Industry Secrets
            "The most expensive music video ever cost $7 million! 🎵💰",
            "Beethoven dipped his head in cold water to stay awake! 🎼🧊",
            "Mozart composed over 600 pieces in his short life! 🎹📜",
            "The guitar was invented over 4,000 years ago! 🎸🏺",
            "Vinyl records are making a comeback in the streaming age! 💿📈",
            "Auto-Tune was originally designed to interpret seismic data! 🎤🌍",
            "The longest song ever recorded is 13 hours long! 🎵⏰",
            "Headphones were invented in 1910 for telephone operators! 🎧📞",
            "The most expensive piano sold for $3.22 million! 🎹💎",
            "Spotify has over 80 million songs! 🎧📊",
            
            // Space Exploration Extended
            "Mars has the largest volcano in the solar system! 🔴🌋",
            "Saturn's moon Titan has lakes of liquid methane! 🪐🏞️",
            "Jupiter's Great Red Spot is a storm bigger than Earth! 🌪️🌍",
            "Venus rotates backwards compared to most planets! ♀️🔄",
            "The International Space Station travels at 17,500 mph! 🚀💨",
            "Astronauts can grow up to 2 inches taller in space! 👨‍🚀📏",
            "There are more possible chess games than atoms in the universe! ♟️♾️",
            "The Moon is moving away from Earth at 1.5 inches per year! 🌙↗️",
            "A day on Mercury lasts 176 Earth days! ☿️⏰",
            "The Sun is 99.86% of our solar system's mass! ☀️⚖️",
            
            // Ocean & Marine Life
            "We've explored less than 5% of Earth's oceans! 🌊❓",
            "The blue whale's heart is as big as a small car! 🐋❤️",
            "Sharks can detect electricity from other animals! 🦈⚡",
            "The immortal jellyfish can reverse its aging process! 🪼⏮️",
            "Dolphins call each other by unique signature whistles! 🐬🎵",
            "The deepest fish lives 5 miles below the surface! 🐟⬇️",
            "Coral reefs support 25% of all marine species! 🪸🐠",
            "The giant squid has eyes as big as dinner plates! 🦑👁️",
            "Sea otters hold hands while sleeping to stay together! 🦦🤝",
            "The loudest animal on Earth is the blue whale! 🐋🔊",
            
            // Psychology & Human Behavior
            "Your brain uses 20% of your body's total energy! 🧠⚡",
            "Humans are the only animals that blush! 😳👤",
            "The average person has 12,000 to 60,000 thoughts per day! 🤔💭",
            "Laughter is contagious because of mirror neurons! 😂🧠",
            "Your brain continues to develop until you're 25! 🧠📈",
            "Humans can only remember 3-4 things at once in short-term memory! 🧠4️⃣",
            "The placebo effect can work even when you know it's a placebo! 💊🧠",
            "Your pupils dilate when you see something you love! 👁️❤️",
            "Humans are hardwired to notice faces in random patterns! 😊🔍",
            "The fear of long words is called hippopotomonstrosesquippedaliophobia! 📚😰",
            
            // Food Science & Culinary Arts
            "Spicy food releases endorphins that make you feel good! 🌶️😊",
            "The most expensive ingredient in the world is white truffles! 🍄💰",
            "Cheese is the most stolen food in the world! 🧀🕵️‍♂️",
            "Honey is bee vomit, but it's delicious! 🍯🐝",
            "The fear of cooking is called mageirocophobia! 👨‍🍳😰",
            "Lobsters were once considered prison food! 🦞⛓️",
            "The invention of the sandwich is attributed to the Earl of Sandwich! 🥪👑",
            "Chocolate contains caffeine and theobromine! 🍫☕",
            "The hottest chili pepper can reach 2.2 million Scoville units! 🌶️🔥",
            "Umami is the fifth taste alongside sweet, sour, salty, and bitter! 👅5️⃣",
            
            // Architecture & Engineering Marvels
            "The Great Wall of China used rice flour as mortar! 🏯🍚",
            "The Eiffel Tower grows 6 inches in summer due to heat expansion! 🗼📏",
            "Dubai's Burj Khalifa is taller than six Statues of Liberty stacked! 🏗️🗽",
            "The Panama Canal saves ships 8,000 miles of travel! 🚢🛣️",
            "Ancient Roman concrete gets stronger over time! 🏛️💪",
            "The Golden Gate Bridge's cables contain 80,000 miles of wire! 🌉🔗",
            "Skyscrapers sway in the wind - some up to 6 feet! 🏢💨",
            "The Sydney Opera House's design was inspired by orange segments! 🎭🍊",
            "Mount Rushmore was originally supposed to include full bodies! 🗿👕",
            "The Leaning Tower of Pisa leans more every year! 🗼📐",
            
            // Weather & Climate Phenomena
            "A single lightning bolt can power a house for a month! ⚡🏠",
            "The strongest tornado winds can exceed 300 mph! 🌪️💨",
            "Hail can grow to the size of softballs! 🧊⚾",
            "The eye of a hurricane is completely calm! 🌀👁️",
            "Ball lightning is a rare phenomenon that scientists barely understand! ⚡⚽",
            "The jet stream can reach speeds of 275 mph! 🌬️✈️",
            "Microbursts can crash airplanes with sudden downdrafts! 🌩️✈️",
            "St. Elmo's Fire is electrical discharge, not actual fire! ⚡🔥",
            "Waterspouts are tornadoes that form over water! 🌊🌪️",
            "The coldest temperature ever recorded was -128.6°F in Antarctica! ❄️🌡️",
            
            // Sports & Athletic Achievement
            "The fastest human speed ever recorded was 27.8 mph! 🏃‍♂️💨",
            "A baseball can be hit at over 120 mph! ⚾💨",
            "The longest tennis match lasted 11 hours and 5 minutes! 🎾⏰",
            "Basketball players can jump over 40 inches vertically! 🏀⬆️",
            "Golf balls can reach speeds of 170 mph! ⛳💨",
            "The fastest swimming stroke is freestyle! 🏊‍♂️💨",
            "Usain Bolt's fastest 100m was 9.58 seconds! 🏃‍♂️⏱️",
            "The heaviest weight ever lifted was 6,270 pounds! 🏋️‍♂️💪",
            "A soccer ball can be kicked at 80+ mph! ⚽💨",
            "The longest field goal in NFL history was 66 yards! 🏈📏",
            
            // Language Evolution & Linguistics
            "English has over 1 million words! 📖1️⃣",
            "The longest word in English has 189,819 letters! 📝📏",
            "Shakespeare invented over 1,700 words we still use! 📚✒️",
            "The word 'OK' comes from 'oll korrect' (all correct)! ✅📝",
            "Sign languages are as complex as spoken languages! 🤟🗣️",
            "There are over 7,000 languages spoken worldwide! 🌍🗣️",
            "Some languages have no words for left and right! ↔️❌",
            "The shortest sentence in English is 'I am'! ✏️⭐",
            "Palindromes read the same forwards and backwards! ↔️📖",
            "Onomatopoeia words sound like what they describe! 💥🔊",
            
            // Artistic Movements & Cultural Impact
            "The Impressionist movement started with rejected paintings! 🎨❌",
            "Street art was considered vandalism until Banksy! 🎨🏢",
            "The Sistine Chapel took Michelangelo 4 years to paint! 🎨⛪",
            "Abstract art challenged traditional representation! 🎨🔳",
            "Pop art elevated commercial imagery to fine art! 🎨🥤",
            "Digital art is now sold as NFTs for millions! 🎨💻",
            "Graffiti has existed since ancient Rome! 🎨🏛️",
            "Performance art makes the artist part of the artwork! 🎨🎭",
            "Installation art transforms entire spaces! 🎨🏗️",
            "Conceptual art values ideas over traditional craftsmanship! 🎨💭",
            
            // Medical & Health Science
            "Your liver can regenerate itself completely! 🫁🔄",
            "Laughter actually boosts your immune system! 😂💪",
            "The human nose can detect over 1 trillion scents! 👃🔢",
            "Your heart beats about 3 billion times in your lifetime! ❤️♾️",
            "Hiccups are evolutionary remnants from our fish ancestors! 🐟😮",
            "The brain feels no pain - it has no pain receptors! 🧠❌",
            "Yawning is contagious even between species! 😴🦍",
            "Your stomach acid can dissolve metal! 🤤🔧",
            "Bone is stronger than steel pound for pound! 🦴💪",
            "The human eye can distinguish 10 million colors! 👁️🌈",
            
            // Transportation Evolution
            "The first car accident happened in 1891! 🚗💥",
            "Horses were faster than early cars! 🐎🚗",
            "The first airplane flight lasted only 12 seconds! ✈️⏱️",
            "Trains revolutionized time zones! 🚂⏰",
            "The first traffic light was gas-powered! 🚦🔥",
            "Bicycles were once called 'boneshakers'! 🚲🦴",
            "The assembly line made cars affordable! 🚗🏭",
            "Submarines were used in the Revolutionary War! 🚢⚔️",
            "The first helicopter couldn't lift its own weight! 🚁⚖️",
            "Rockets need to reach 25,000 mph to escape Earth! 🚀💨",
            
            // Economic History & Systems
            "Bartering existed before money! 🔄💰",
            "The first stock market was in Amsterdam! 📈🇳🇱",
            "Inflation makes money worth less over time! 💰📉",
            "The Great Depression lasted 10 years! 😰📅",
            "Credit was invented in ancient Mesopotamia! 💳🏛️",
            "Insurance started with maritime trade! 🚢📋",
            "Banks originally stored grain, not money! 🏦🌾",
            "The gold standard ended in 1971! 🥇❌",
            "Cryptocurrency doesn't physically exist! ₿👻",
            "The richest person ever was Mansa Musa! 👑💰",
            
            // Environmental Science & Ecology
            "One tree produces enough oxygen for two people per day! 🌳💨",
            "Plastic takes 450+ years to decompose! ♻️⏰",
            "The Amazon produces 20% of the world's oxygen! 🌳🌍",
            "Renewable energy is now cheaper than fossil fuels! ⚡💚",
            "Recycling one aluminum can saves enough energy to run a TV for 3 hours! ♻️📺",
            "The ozone layer is slowly healing! 🌍💚",
            "Coral reefs are dying due to ocean acidification! 🪸😢",
            "Deforestation releases stored carbon dioxide! 🌳💨",
            "Solar panels can last 25+ years! ☀️⏰",
            "Electric cars produce zero direct emissions! 🚗⚡",
            
            // Quantum Physics & Advanced Science
            "Quantum entanglement allows instant communication across space! ⚛️📡",
            "Particles can exist in multiple states simultaneously! ⚛️🔄",
            "Schrödinger's cat is both alive and dead until observed! 🐱📦",
            "Quantum tunneling lets particles pass through barriers! ⚛️🚇",
            "The uncertainty principle limits what we can know! ❓⚛️",
            "Quantum computers could break current encryption! 💻🔓",
            "Dark matter makes up 85% of the universe! 🌌⚫",
            "Time slows down as you approach the speed of light! ⏰💨",
            "Black holes bend space and time! 🕳️⏰",
            "The multiverse theory suggests infinite parallel universes! 🌌♾️",
            
            // Cultural Phenomena & Anthropology
            "Every culture has music - it's universal! 🎵🌍",
            "Smiling is understood across all cultures! 😊🌍",
            "Gift-giving exists in every human society! 🎁👥",
            "Language shapes how we think about concepts! 🗣️🧠",
            "Rituals help bind communities together! 🕯️👥",
            "Storytelling is humanity's oldest form of entertainment! 📖👴",
            "Dance is found in every culture throughout history! 💃🌍",
            "Art is created by every human civilization! 🎨🏛️",
            "Religion attempts to answer existential questions! ⛪❓",
            "Trade has connected distant cultures for millennia! 🛤️🌍",
            
            // Mathematical Wonders
            "Pi has been calculated to over 31 trillion digits! 🥧∞",
            "The number zero was invented in India! 0️⃣🇮🇳",
            "Fibonacci sequences appear throughout nature! 🌻🔢",
            "Prime numbers have no pattern - they're random! 🔢❓",
            "Infinity comes in different sizes! ♾️📏",
            "Fractals are infinitely complex patterns! 📐♾️",
            "The golden ratio appears in art and nature! 💫📐",
            "Negative numbers weren't accepted until the 7th century! ➖📅",
            "Imaginary numbers are real and useful! 🔢💭",
            "Statistics can be misleading without context! 📊⚠️",
            
            // Photography & Visual Arts
            "The first photograph took 8 hours to expose! 📸⏰",
            "Color photography was invented in 1861! 📸🌈",
            "Instagram filters mimic old film processing techniques! 📱🎞️",
            "The most expensive photograph sold for $4.3 million! 📸💰",
            "HDR photography combines multiple exposures! 📸🔄",
            "The human eye sees like a 576-megapixel camera! 👁️📸",
            "Film photography is making a comeback! 🎞️📈",
            "Drone photography opened up new perspectives! 📸🚁",
            "Time-lapse reveals processes invisible to real-time observation! ⏰📸",
            "Macro photography shows tiny worlds in detail! 📸🔍",
            
            // Fashion Evolution & Trends
            "Miniskirts were considered shocking in the 1960s! 👗😱",
            "Denim was workwear before it became fashion! 👖🔧",
            "High fashion influences everyday clothing! 👗➡️👕",
            "Fast fashion has environmental consequences! 👗🌍",
            "Sustainable fashion is growing in popularity! 👗♻️",
            "Vintage clothing is now considered trendy! 👗⏰",
            "Fashion weeks set global trends! 👗🌍",
            "3D printing is being used to create clothing! 👗🖨️",
            "Wearable technology is merging fashion and function! 👗💻",
            "Cultural appropriation in fashion is controversial! 👗⚠️",
            
            // Robotics & AI Development
            "The first robot was built in 1954! 🤖📅",
            "AI can now create art and music! 🤖🎨",
            "Machine learning improves through experience! 🤖📚",
            "Robots are being used in surgery! 🤖🏥",
            "Self-driving cars use AI to navigate! 🚗🤖",
            "Chatbots can pass the Turing test! 🤖💬",
            "AI helps discover new medicines! 🤖💊",
            "Facial recognition raises privacy concerns! 🤖👁️",
            "Automation is changing the job market! 🤖💼",
            "AI assistants are in millions of homes! 🤖🏠",
            
            // Mythology & Ancient Legends
            "Dragons appear in cultures worldwide despite no contact! 🐉🌍",
            "Greek myths explained natural phenomena! ⚡🏛️",
            "Norse mythology inspired modern fantasy! ⚔️🧙‍♂️",
            "Creation myths exist in every culture! 🌍📖",
            "Heroes' journeys follow similar patterns globally! 🦸‍♂️🗺️",
            "Flood myths are found across continents! 🌊📖",
            "Ancient gods often controlled specific domains! ⚡👑",
            "Mythical creatures represented human fears! 👹😰",
            "Legends often contain historical truths! 📖✅",
            "Oral traditions preserved stories for millennia! 🗣️⏰",
            
            // Extreme Weather & Natural Disasters
            "Tornadoes can pick up cars and houses! 🌪️🚗",
            "Hurricanes release energy equivalent to 200 atomic bombs per day! 🌀💣",
            "Earthquakes can literally move mountains! 🏔️📐",
            "Tsunamis can travel at 500 mph across oceans! 🌊💨",
            "Volcanic eruptions can change global climate! 🌋🌍",
            "Lightning strikes Earth 100 times per second! ⚡⏰",
            "Blizzards can drop 40+ inches of snow in hours! ❄️📏",
            "Flash floods can move boulders weighing tons! 🌊🪨",
            "Hailstorms cause billions in damage annually! 🧊💰",
            "Dust storms can be seen from space! 🌪️🛰️",
            
            // Conspiracy Theories & Urban Legends
            "The moon landing was real - we have retroreflectors to prove it! 🌙✅",
            "Area 51 is a real military base for testing aircraft! 🛸🔒",
            "The Bermuda Triangle has no more disappearances than anywhere else! 📐🌊",
            "Bigfoot sightings are likely misidentified animals! 🦍❓",
            "The Loch Ness Monster is probably not real! 🐉🏴󠁧󠁢󠁳󠁣󠁴󠁿",
            "Crop circles are made by humans, not aliens! 🌾👽",
            "The Illuminati conspiracy has no evidence! 👁️❌",
            "Chemtrails are actually just contrails from airplanes! ✈️☁️",
            "Vaccines don't cause autism - that study was fraudulent! 💉✅",
            "The Earth is definitely round - we have photos from space! 🌍📸",
            
            // Sleep & Dreams
            "Dreams occur during REM sleep phases! 😴👁️",
            "The average person spends 26 years sleeping! 😴📅",
            "Sleep deprivation can be lethal! 😴💀",
            "Lucid dreaming allows conscious control of dreams! 😴🎮",
            "Sleep helps consolidate memories! 😴🧠",
            "Insomnia affects 30% of adults! 😴💔",
            "Sleep paralysis combines waking and dreaming states! 😴😰",
            "Power naps can boost productivity! 😴⚡",
            "Sleep patterns change with age! 😴📈",
            "Dreams may help process emotions! 😴❤️",
            
            // Unusual Animals & Biodiversity
            "The platypus was thought to be a hoax when first discovered! 🦫❓",
            "Tardigrades can survive in space! 🐻🚀",
            "Mantis shrimp have 16 types of color receptors (humans have 3)! 🦐🌈",
            "Vampire bats share blood with hungry roostmates! 🦇🩸",
            "Sea cucumbers can eject their internal organs as defense! 🥒🌊",
            "Pistol shrimp create bubbles that reach sun-like temperatures! 🦐☀️",
            "Axolotls can regenerate entire limbs! 🦎🔄",
            "Honey badgers are immune to most venoms! 🦡💉",
            "Electric eels can generate 600 volts! 🐍⚡",
            "Leafy sea dragons are perfectly camouflaged! 🐉🌿",
            
            // Memory & Learning Science
            "Your brain forgets things to help you remember what's important! 🧠❌",
            "Muscle memory is stored in your neurons, not muscles! 💪🧠",
            "Repetition strengthens neural pathways! 🧠🔄",
            "Emotional memories are stronger than neutral ones! 🧠❤️",
            "Sleep helps move memories from short to long-term storage! 😴🧠",
            "Chunking helps you remember more information! 🧠📦",
            "Mnemonics use association to aid memory! 🧠🔗",
            "Forgetting curves show how memory fades over time! 🧠📉",
            "Active recall is more effective than passive reading! 🧠❓",
            "Spaced repetition optimizes long-term retention! 🧠⏰",
            
            // Construction & Architecture Secrets
            "Skyscrapers have deep foundations to prevent tipping! 🏢🕳️",
            "Earthquakes taught us to build flexible structures! 🏗️📐",
            "Gothic cathedrals used flying buttresses for support! ⛪🦅",
            "Modern concrete was invented by the Romans! 🏛️🧱",
            "Steel frame construction enabled tall buildings! 🏢🔩",
            "Arch bridges distribute weight efficiently! 🌉⚖️",
            "Prefab construction speeds up building processes! 🏠⚡",
            "Green buildings use sustainable materials and design! 🏢🌱",
            "Smart buildings adjust automatically to conditions! 🏢🤖",
            "Underground construction requires careful water management! 🕳️💧",
            
            // Optical Illusions & Visual Perception
            "Your brain fills in your blind spot automatically! 👁️🧠",
            "Optical illusions exploit how your brain processes images! 👁️🔄",
            "Motion blur helps us track moving objects! 👁️💨",
            "Peripheral vision detects movement better than detail! 👁️📐",
            "Color constancy makes white paper look white in any light! 👁️⚪",
            "Depth perception uses multiple visual cues! 👁️📏",
            "The dress meme revealed how perception varies! 👗👁️",
            "Pareidolia makes you see faces in random patterns! 😊🔍",
            "Visual processing happens faster than conscious thought! 👁️⚡",
            "Magic tricks exploit predictable visual assumptions! 🎩👁️",
            
            // Final Mix of Random Iowa Website Promotions
            "All these facts are amazing, but have you tried our Airbus simulator? ✈️🎮",
            "Speaking of interesting, our Tesla content is electrifying! ⚡🚗",
            "Random knowledge is fun! So is our Toilet Game! 🚽🎮",
            "These facts blow my mind! Just like our entertainment section! 🤯🎭",
            "I could share facts all day, but Iowa's games are more interactive! 📚🎮",
            "Knowledge is power - speaking of power, try our Supercharger sim! ⚡🔋",
            "The world is fascinating! Just like every page on Iowa! 🌍✨",
            "Thanks for letting me share! Now go explore Iowa's awesome content! 🙏🌽",
            "I love teaching! You'll love learning to play our games! 📚🎮",
            "Facts are the best! Second best? Iowa's entertainment! 📊🎪"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize the global navigation
new GlobalNavigation();