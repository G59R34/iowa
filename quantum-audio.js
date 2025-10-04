class QuantumAudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.isEnabled = localStorage.getItem('quantumAudioEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('quantumAudioVolume')) || 0.5;
        this.ambientEnabled = localStorage.getItem('quantumAmbientEnabled') !== 'false';
        this.currentAmbient = null;
        
        this.init();
    }

    async init() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Load all sounds
            await this.loadSounds();
            
            // Setup global audio controls
            this.setupAudioControls();
            
            // Bind global events
            this.bindGlobalEvents();
            
            // Start ambient audio if enabled
            if (this.ambientEnabled) {
                this.startAmbientAudio();
            }
            
            console.log('🔊 QuantumAudio System Initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    async loadSounds() {
        const soundFiles = {
            // UI Sounds
            'hover': this.generateHoverSound(),
            'click': this.generateClickSound(),
            'success': this.generateSuccessSound(),
            'error': this.generateErrorSound(),
            'notification': this.generateNotificationSound(),
            'whoosh': this.generateWhooshSound(),
            'beep': this.generateBeepSound(),
            'chime': this.generateChimeSound(),
            
            // Quantum-specific sounds
            'quantum_activate': this.generateQuantumActivate(),
            'quantum_process': this.generateQuantumProcess(),
            'quantum_complete': this.generateQuantumComplete(),
            'energy_charge': this.generateEnergyCharge(),
            'field_activate': this.generateFieldActivate(),
            
            // E-commerce sounds
            'cart_add': this.generateCartAdd(),
            'cart_remove': this.generateCartRemove(),
            'checkout': this.generateCheckoutSound(),
            'payment_success': this.generatePaymentSuccess(),
            'order_complete': this.generateOrderComplete(),
            
            // Navigation sounds
            'page_transition': this.generatePageTransition(),
            'modal_open': this.generateModalOpen(),
            'modal_close': this.generateModalClose(),
            
            // Ambient sounds
            'ambient_hum': this.generateAmbientHum(),
            'ambient_space': this.generateAmbientSpace(),
            'ambient_lab': this.generateAmbientLab()
        };

        for (const [name, generator] of Object.entries(soundFiles)) {
            try {
                this.sounds.set(name, generator);
            } catch (error) {
                console.warn(`Failed to load sound: ${name}`, error);
            }
        }
    }

    // Sound Generation Methods
    generateHoverSound() {
        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'sine';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    generateClickSound() {
        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'square';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    generateSuccessSound() {
        return () => {
            // Multi-tone success chord
            const frequencies = [523.25, 659.25, 783.99]; // C, E, G
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, this.audioContext.currentTime + 0.05 + index * 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                
                oscillator.type = 'sine';
                oscillator.start(this.audioContext.currentTime + index * 0.05);
                oscillator.stop(this.audioContext.currentTime + 0.5);
            });
        };
    }

    generateErrorSound() {
        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.type = 'sawtooth';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
    }

    generateNotificationSound() {
        return () => {
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator2.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            oscillator1.start(this.audioContext.currentTime);
            oscillator2.start(this.audioContext.currentTime + 0.1);
            oscillator1.stop(this.audioContext.currentTime + 0.15);
            oscillator2.stop(this.audioContext.currentTime + 0.3);
        };
    }

    generateQuantumActivate() {
        return () => {
            // Create a complex quantum-like sound with frequency modulation
            const carrier = this.audioContext.createOscillator();
            const modulator = this.audioContext.createOscillator();
            const modulatorGain = this.audioContext.createGain();
            const gainNode = this.audioContext.createGain();
            
            modulator.connect(modulatorGain);
            modulatorGain.connect(carrier.frequency);
            carrier.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            carrier.frequency.setValueAtTime(440, this.audioContext.currentTime);
            modulator.frequency.setValueAtTime(20, this.audioContext.currentTime);
            modulatorGain.gain.setValueAtTime(100, this.audioContext.currentTime);
            
            // Sweep effect
            carrier.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
            
            carrier.type = 'sine';
            modulator.type = 'sine';
            
            carrier.start(this.audioContext.currentTime);
            modulator.start(this.audioContext.currentTime);
            carrier.stop(this.audioContext.currentTime + 0.8);
            modulator.stop(this.audioContext.currentTime + 0.8);
        };
    }

    generateQuantumProcess() {
        return () => {
            // Continuous processing sound with subtle variations
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(1600, this.audioContext.currentTime + 1.0);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);
            
            oscillator.type = 'sawtooth';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 1.2);
        };
    }

    generateAmbientHum() {
        return () => {
            // Create a subtle ambient hum
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(60, this.audioContext.currentTime);
            oscillator2.frequency.setValueAtTime(80, this.audioContext.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.02, this.audioContext.currentTime + 2.0);
            
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            oscillator1.start(this.audioContext.currentTime);
            oscillator2.start(this.audioContext.currentTime);
            
            // Store reference for ambient control
            return { oscillator1, oscillator2, gainNode };
        };
    }

    generateCartAdd() {
        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.type = 'triangle';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }

    generateWhooshSound() {
        return () => {
            const bufferSize = this.audioContext.sampleRate * 0.3;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
            }
            
            const noise = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            noise.buffer = buffer;
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            noise.start(this.audioContext.currentTime);
            noise.stop(this.audioContext.currentTime + 0.3);
        };
    }

    // Additional sound generators for other effects
    generateBeepSound() { return this.generateHoverSound; }
    generateChimeSound() { return this.generateNotificationSound; }
    generateQuantumComplete() { return this.generateSuccessSound; }
    generateEnergyCharge() { return this.generateQuantumActivate; }
    generateFieldActivate() { return this.generateQuantumProcess; }
    generateCartRemove() { return this.generateClickSound; }
    generateCheckoutSound() { return this.generateQuantumActivate; }
    generatePaymentSuccess() { return this.generateSuccessSound; }
    generateOrderComplete() { return this.generateSuccessSound; }
    generatePageTransition() { return this.generateWhooshSound; }
    generateModalOpen() { return this.generateHoverSound; }
    generateModalClose() { return this.generateClickSound; }
    generateAmbientSpace() { return this.generateAmbientHum; }
    generateAmbientLab() { return this.generateAmbientHum; }

    // Public Methods
    play(soundName, options = {}) {
        if (!this.isEnabled || !this.sounds.has(soundName)) return;

        try {
            const generator = this.sounds.get(soundName);
            const volume = options.volume || this.volume;
            
            // Temporarily adjust volume if specified
            const originalVolume = this.volume;
            if (options.volume) this.volume = volume;
            
            generator();
            
            // Restore original volume
            this.volume = originalVolume;
        } catch (error) {
            console.warn(`Failed to play sound: ${soundName}`, error);
        }
    }

    hover() { this.play('hover'); }
    click() { this.play('click'); }
    success() { this.play('success'); }
    error() { this.play('error'); }
    notify() { this.play('notification'); }
    whoosh() { this.play('whoosh'); }
    
    // Quantum-specific methods
    quantumActivate() { this.play('quantum_activate'); }
    quantumProcess() { this.play('quantum_process'); }
    quantumComplete() { this.play('quantum_complete'); }
    
    // E-commerce methods
    addToCart() { this.play('cart_add'); }
    removeFromCart() { this.play('cart_remove'); }
    checkout() { this.play('checkout'); }
    paymentSuccess() { this.play('payment_success'); }
    
    // Control methods
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('quantumAudioVolume', this.volume.toString());
        
        if (this.currentAmbient && this.currentAmbient.gainNode) {
            this.currentAmbient.gainNode.gain.setValueAtTime(
                this.volume * 0.02,
                this.audioContext.currentTime
            );
        }
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        localStorage.setItem('quantumAudioEnabled', this.isEnabled.toString());
        
        if (!this.isEnabled) {
            this.stopAmbientAudio();
        } else if (this.ambientEnabled) {
            this.startAmbientAudio();
        }
        
        return this.isEnabled;
    }

    toggleAmbient() {
        this.ambientEnabled = !this.ambientEnabled;
        localStorage.setItem('quantumAmbientEnabled', this.ambientEnabled.toString());
        
        if (this.ambientEnabled) {
            this.startAmbientAudio();
        } else {
            this.stopAmbientAudio();
        }
        
        return this.ambientEnabled;
    }

    startAmbientAudio() {
        if (!this.isEnabled || !this.ambientEnabled || this.currentAmbient) return;
        
        try {
            this.currentAmbient = this.generateAmbientHum()();
        } catch (error) {
            console.warn('Failed to start ambient audio:', error);
        }
    }

    stopAmbientAudio() {
        if (this.currentAmbient) {
            try {
                if (this.currentAmbient.oscillator1) {
                    this.currentAmbient.oscillator1.stop();
                    this.currentAmbient.oscillator2.stop();
                }
                this.currentAmbient = null;
            } catch (error) {
                console.warn('Error stopping ambient audio:', error);
            }
        }
    }

    setupAudioControls() {
        // Create audio control panel if it doesn't exist
        if (document.getElementById('quantum-audio-controls')) return;

        const controls = document.createElement('div');
        controls.id = 'quantum-audio-controls';
        controls.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 10px;
                padding: 15px;
                z-index: 10000;
                display: none;
                min-width: 200px;
                backdrop-filter: blur(10px);
            ">
                <h4 style="color: #00d4ff; margin: 0 0 10px 0; font-size: 0.9rem;">🔊 Audio Controls</h4>
                <div style="margin-bottom: 10px;">
                    <label style="color: white; font-size: 0.8rem; display: block; margin-bottom: 5px;">
                        Volume: <span id="volume-value">${Math.round(this.volume * 100)}%</span>
                    </label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.1" 
                           value="${this.volume}" 
                           style="width: 100%; accent-color: #00d4ff;">
                </div>
                <div style="display: flex; gap: 10px; font-size: 0.8rem;">
                    <button id="toggle-audio" style="
                        background: ${this.isEnabled ? '#00d4ff' : 'rgba(0, 212, 255, 0.3)'};
                        color: ${this.isEnabled ? '#000' : '#00d4ff'};
                        border: 1px solid #00d4ff;
                        padding: 5px 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        flex: 1;
                    ">
                        ${this.isEnabled ? 'ON' : 'OFF'}
                    </button>
                    <button id="toggle-ambient" style="
                        background: ${this.ambientEnabled ? '#00d4ff' : 'rgba(0, 212, 255, 0.3)'};
                        color: ${this.ambientEnabled ? '#000' : '#00d4ff'};
                        border: 1px solid #00d4ff;
                        padding: 5px 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        flex: 1;
                    ">
                        Ambient
                    </button>
                </div>
                <div style="margin-top: 10px; font-size: 0.7rem; color: #888;">
                    Press 'S' key to toggle this panel
                </div>
            </div>
            
            <!-- Control Toggle Button -->
            <button id="audio-toggle-btn" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(0, 212, 255, 0.8);
                border: 2px solid #00d4ff;
                color: #000;
                font-size: 1.2rem;
                cursor: pointer;
                z-index: 10001;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            " title="Audio Controls (S)">
                🔊
            </button>
        `;
        
        document.body.appendChild(controls);
        
        // Bind control events
        this.bindAudioControlEvents();
    }

    bindAudioControlEvents() {
        const toggleBtn = document.getElementById('audio-toggle-btn');
        const controlsPanel = document.getElementById('quantum-audio-controls').children[0];
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        const audioToggle = document.getElementById('toggle-audio');
        const ambientToggle = document.getElementById('toggle-ambient');
        
        // Toggle controls panel
        toggleBtn.addEventListener('click', () => {
            const isHidden = controlsPanel.style.display === 'none';
            controlsPanel.style.display = isHidden ? 'block' : 'none';
            this.hover();
        });
        
        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            this.setVolume(parseFloat(e.target.value));
            volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
        });
        
        // Audio toggle
        audioToggle.addEventListener('click', () => {
            const enabled = this.toggle();
            audioToggle.style.background = enabled ? '#00d4ff' : 'rgba(0, 212, 255, 0.3)';
            audioToggle.style.color = enabled ? '#000' : '#00d4ff';
            audioToggle.textContent = enabled ? 'ON' : 'OFF';
            this.click();
        });
        
        // Ambient toggle
        ambientToggle.addEventListener('click', () => {
            const enabled = this.toggleAmbient();
            ambientToggle.style.background = enabled ? '#00d4ff' : 'rgba(0, 212, 255, 0.3)';
            ambientToggle.style.color = enabled ? '#000' : '#00d4ff';
            this.click();
        });
        
        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.altKey) {
                const isHidden = controlsPanel.style.display === 'none';
                controlsPanel.style.display = isHidden ? 'block' : 'none';
                this.hover();
            }
        });
    }

    bindGlobalEvents() {
        // Auto-bind hover and click events to common elements
        document.addEventListener('mouseover', (e) => {
            if (this.shouldPlayHoverSound(e.target)) {
                this.hover();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (this.shouldPlayClickSound(e.target)) {
                this.click();
            }
        });
        
        // Page transition sounds
        window.addEventListener('beforeunload', () => {
            this.whoosh();
        });
    }

    shouldPlayHoverSound(element) {
        const hoverSelectors = [
            'button', 'a', '.nav-item', '.product-card', '.btn',
            '.cart-item', '.filter-btn', '.team-card', '.value-card',
            '.device-card', '.job-card', '.stat-card'
        ];
        
        return hoverSelectors.some(selector => 
            element.matches && element.matches(selector)
        );
    }

    shouldPlayClickSound(element) {
        const clickSelectors = [
            'button', 'a[href]', '.btn', '.nav-item',
            'input[type="submit"]', 'input[type="button"]',
            '.cart-btn', '.apply-btn'
        ];
        
        return clickSelectors.some(selector => 
            element.matches && element.matches(selector)
        );
    }

    // Special effect methods for specific interactions
    playCartSequence() {
        this.addToCart();
        setTimeout(() => this.notify(), 300);
        setTimeout(() => this.success(), 600);
    }

    playCheckoutSequence() {
        this.checkout();
        setTimeout(() => this.quantumProcess(), 500);
        setTimeout(() => this.paymentSuccess(), 2000);
        setTimeout(() => this.quantumComplete(), 2500);
    }

    playQuantumSequence() {
        this.quantumActivate();
        setTimeout(() => this.quantumProcess(), 800);
        setTimeout(() => this.quantumComplete(), 2000);
    }
}

// Initialize global audio system
let quantumAudio;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with user interaction (required for Web Audio API)
    const initAudio = () => {
        quantumAudio = new QuantumAudioSystem();
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
    };
    
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumAudioSystem;
}

// Global audio functions for easy access
window.playQuantumSound = (soundName, options) => {
    if (quantumAudio) {
        quantumAudio.play(soundName, options);
    }
};

window.playQuantumSequence = (sequenceName) => {
    if (quantumAudio) {
        switch (sequenceName) {
            case 'cart':
                quantumAudio.playCartSequence();
                break;
            case 'checkout':
                quantumAudio.playCheckoutSequence();
                break;
            case 'quantum':
                quantumAudio.playQuantumSequence();
                break;
        }
    }
};