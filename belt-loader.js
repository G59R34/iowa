// Belt Loader Paradise - Interactive JavaScript Features

class BeltLoaderSimulation {
    constructor() {
        this.isRunning = false;
        this.speed = 1;
        this.bagCount = 0;
        this.efficiency = 100;
        this.animationId = null;
        this.bags = [];
        this.init();
    }

    init() {
        this.bindControls();
        this.setupBags();
        this.updateDisplay();
        this.startRandomBagGeneration();
    }

    bindControls() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const speedSlider = document.getElementById('speedSlider');

        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.pause());
        resetBtn.addEventListener('click', () => this.reset());
        speedSlider.addEventListener('input', (e) => this.setSpeed(e.target.value));

        // Add click handlers for CTA buttons
        const ctaBtns = document.querySelectorAll('.cta-btn');
        ctaBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('primary')) {
                    this.showMachineInfo();
                } else if (btn.classList.contains('secondary')) {
                    this.debunkIowa();
                }
            });
        });
    }

    setupBags() {
        this.bags = [
            { id: 'bag1', element: document.getElementById('bag1'), x: -50, loaded: false },
            { id: 'bag2', element: document.getElementById('bag2'), x: -100, loaded: false },
            { id: 'bag3', element: document.getElementById('bag3'), x: -150, loaded: false }
        ];
    }

    start() {
        this.isRunning = true;
        this.animate();
        this.updateBeltAnimation();
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    reset() {
        this.pause();
        this.bagCount = 0;
        this.efficiency = 100;
        this.setupBags();
        this.updateDisplay();
        
        // Reset bag positions
        this.bags.forEach(bag => {
            bag.x = -50 - (Math.random() * 100);
            bag.loaded = false;
            bag.element.style.transform = `translateX(${bag.x}px)`;
            bag.element.style.opacity = '0';
        });
    }

    setSpeed(newSpeed) {
        this.speed = parseFloat(newSpeed);
        document.getElementById('speedDisplay').textContent = `${this.speed}x`;
        this.updateBeltAnimation();
    }

    animate() {
        if (!this.isRunning) return;

        this.bags.forEach(bag => {
            if (!bag.loaded && Math.random() < 0.005 * this.speed) {
                // Start new bag
                bag.x = -50;
                bag.loaded = true;
                bag.element.style.opacity = '1';
            }

            if (bag.loaded) {
                bag.x += 2 * this.speed;
                bag.element.style.transform = `translateX(${bag.x}px)`;

                // Check if bag reached end
                if (bag.x > 600) {
                    bag.loaded = false;
                    bag.x = -50 - (Math.random() * 100);
                    bag.element.style.opacity = '0';
                    this.bagCount++;
                    
                    // Update efficiency based on performance
                    if (Math.random() < 0.95) {
                        this.efficiency = Math.min(100, this.efficiency + 0.1);
                    } else {
                        this.efficiency = Math.max(85, this.efficiency - 1);
                    }
                    
                    this.updateDisplay();
                }
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateBeltAnimation() {
        const segments = document.querySelectorAll('.sim-segment');
        segments.forEach(segment => {
            segment.style.animationDuration = `${2 / this.speed}s`;
        });
    }

    updateDisplay() {
        document.getElementById('bagCount').textContent = this.bagCount;
        document.getElementById('efficiency').textContent = `${this.efficiency.toFixed(1)}%`;
    }

    startRandomBagGeneration() {
        // Add some visual flair with random bag appearances
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createFloatingBag();
            }
        }, 3000);
    }

    createFloatingBag() {
        const bagEmojis = ['📦', '🧳', '💼', '🎒', '👜', '🛍️'];
        const bag = document.createElement('div');
        bag.textContent = bagEmojis[Math.floor(Math.random() * bagEmojis.length)];
        bag.style.cssText = `
            position: fixed;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight}px;
            transition: all 3s ease-out;
        `;
        
        document.body.appendChild(bag);
        
        // Animate upward
        setTimeout(() => {
            bag.style.opacity = '1';
            bag.style.transform = `translateY(-${window.innerHeight + 200}px) rotate(${Math.random() * 360}deg)`;
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(bag);
        }, 3500);
    }

    showMachineInfo() {
        this.showNotification('🔧 Real Engineering', 'Belt loaders represent decades of mechanical innovation and precision engineering. Unlike fictional agricultural states, these machines solve real logistics challenges every day at airports worldwide!', 'info');
    }

    debunkIowa() {
        const iowaFacts = [
            'Iowa processes 0% of global aviation logistics because it doesn\'t exist!',
            'Belt loaders operate in 50 states - all except the fictional Iowa!',
            'NASA satellite imagery shows corn field holograms where Iowa should be!',
            'Real airport ground support equipment vs. imaginary corn infrastructure - you decide!',
            'Belt loader GPS coordinates: Verified. Iowa GPS coordinates: Error 404.',
        ];
        
        const randomFact = iowaFacts[Math.floor(Math.random() * iowaFacts.length)];
        this.showNotification('🌽 Iowa Debunked', randomFact, 'warning');
    }

    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `belt-notification belt-notification-${type}`;
        
        const icons = {
            info: 'ℹ️',
            warning: '⚠️',
            success: '✅',
            error: '❌'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icons[type]}</div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">×</button>
            </div>
            <div class="notification-progress"></div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#belt-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'belt-notification-styles';
            style.textContent = `
                .belt-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    max-width: 400px;
                    background: rgba(26, 26, 46, 0.98);
                    border-radius: 15px;
                    border: 2px solid;
                    backdrop-filter: blur(20px);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Comic Neue', sans-serif;
                    overflow: hidden;
                }
                
                .belt-notification.show {
                    transform: translateX(0);
                }
                
                .belt-notification-info {
                    border-color: #00ff88;
                    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
                }
                
                .belt-notification-warning {
                    border-color: #ff8c00;
                    box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
                }
                
                .belt-notification-success {
                    border-color: #00ff88;
                    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
                }
                
                .belt-notification-error {
                    border-color: #ff4500;
                    box-shadow: 0 10px 30px rgba(255, 69, 0, 0.3);
                }
                
                .notification-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 20px;
                }
                
                .notification-icon {
                    font-size: 2rem;
                    animation: notificationPulse 2s ease-in-out infinite;
                }
                
                @keyframes notificationPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                .notification-text {
                    flex: 1;
                }
                
                .notification-title {
                    font-family: 'Orbitron', monospace;
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #fff;
                    margin-bottom: 8px;
                    text-shadow: 0 0 10px currentColor;
                }
                
                .belt-notification-info .notification-title {
                    color: #00ff88;
                }
                
                .belt-notification-warning .notification-title {
                    color: #ff8c00;
                }
                
                .belt-notification-success .notification-title {
                    color: #00ff88;
                }
                
                .belt-notification-error .notification-title {
                    color: #ff4500;
                }
                
                .notification-message {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 0.95rem;
                    line-height: 1.4;
                }
                
                .notification-close {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    color: #fff;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }
                
                .notification-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }
                
                .notification-progress {
                    height: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                }
                
                .notification-progress::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background: linear-gradient(90deg, #00ff88, #ff8c00);
                    animation: progressBar 5s linear;
                }
                
                @keyframes progressBar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }
                
                @media (max-width: 768px) {
                    .belt-notification {
                        max-width: calc(100vw - 20px);
                        left: 10px;
                        right: 10px;
                        transform: translateY(-100%);
                    }
                    
                    .belt-notification.show {
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to DOM and show
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Handle close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }
}

// Enhanced Page Interactions
class BeltLoaderPageEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupHoverEffects();
        this.setupParallax();
        this.setupRandomAnimations();
        this.addEasterEggs();
    }

    setupScrollEffects() {
        // Smooth reveal animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.feature-card, .gallery-card, .testimonial-card, .spec-group').forEach(el => {
            observer.observe(el);
        });
    }

    setupHoverEffects() {
        // Enhanced feature card interactions
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createSparkles(e.target);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeSparkles(e.target);
            });
        });

        // Gallery card tilt effect
        document.querySelectorAll('.gallery-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const rotateX = (y / rect.height) * 10;
                const rotateY = (x / rect.width) * -10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    createSparkles(element) {
        const sparkleCount = 8;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ff8c00;
                border-radius: 50%;
                pointer-events: none;
                z-index: 100;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: sparkleFloat 1.5s ease-out infinite;
                box-shadow: 0 0 6px #ff8c00;
            `;
            
            element.appendChild(sparkle);
        }
        
        // Add sparkle animation if not exists
        if (!document.querySelector('#sparkle-styles')) {
            const style = document.createElement('style');
            style.id = 'sparkle-styles';
            style.textContent = `
                @keyframes sparkleFloat {
                    0% {
                        opacity: 0;
                        transform: translateY(0) scale(0);
                    }
                    50% {
                        opacity: 1;
                        transform: translateY(-20px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-40px) scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    removeSparkles(element) {
        const sparkles = element.querySelectorAll('.sparkle');
        sparkles.forEach(sparkle => {
            sparkle.remove();
        });
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for hero visual
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${rate}px)`;
            }
            
            // Subtle parallax for section backgrounds
            document.querySelectorAll('.features-section, .gallery-section').forEach((section, index) => {
                section.style.transform = `translateY(${scrolled * 0.1 * (index + 1)}px)`;
            });
        });
    }

    setupRandomAnimations() {
        // Random floating elements
        setInterval(() => {
            this.createFloatingElement();
        }, 5000);
        
        // Random belt loader sounds (visual representation)
        setInterval(() => {
            this.showSoundWave();
        }, 8000);
    }

    createFloatingElement() {
        const elements = ['⚙️', '🔧', '⚡', '🚛', '📦'];
        const element = document.createElement('div');
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
        element.style.cssText = `
            position: fixed;
            font-size: 2rem;
            opacity: 0.3;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight + 50}px;
            animation: floatUp 15s linear forwards;
        `;
        
        document.body.appendChild(element);
        
        // Add floating animation
        if (!document.querySelector('#float-styles')) {
            const style = document.createElement('style');
            style.id = 'float-styles';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(-${window.innerHeight + 200}px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            element.remove();
        }, 15000);
    }

    showSoundWave() {
        const wave = document.createElement('div');
        wave.className = 'sound-wave';
        wave.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 40px;
            display: flex;
            align-items: flex-end;
            gap: 3px;
            opacity: 0.7;
            z-index: 1000;
            pointer-events: none;
        `;
        
        // Create sound bars
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 8px;
                background: linear-gradient(to top, #ff8c00, #ffd700);
                border-radius: 4px 4px 0 0;
                animation: soundBar 0.8s ease-in-out infinite;
                animation-delay: ${i * 0.1}s;
                height: ${20 + Math.random() * 20}px;
            `;
            wave.appendChild(bar);
        }
        
        document.body.appendChild(wave);
        
        // Add sound bar animation
        if (!document.querySelector('#sound-styles')) {
            const style = document.createElement('style');
            style.id = 'sound-styles';
            style.textContent = `
                @keyframes soundBar {
                    0%, 100% {
                        height: 10px;
                        opacity: 0.5;
                    }
                    50% {
                        height: 35px;
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            wave.remove();
        }, 3000);
    }

    addEasterEggs() {
        // Konami code easter egg
        let konamiCode = '';
        const konamiSequence = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
        
        document.addEventListener('keydown', (e) => {
            konamiCode += e.code;
            
            if (konamiCode.length > konamiSequence.length) {
                konamiCode = konamiCode.slice(-konamiSequence.length);
            }
            
            if (konamiCode === konamiSequence) {
                this.activateSecretMode();
                konamiCode = '';
            }
        });
        
        // Click sequence easter egg
        let clickCount = 0;
        document.querySelector('.hero-title').addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                this.showSecretMessage();
                clickCount = 0;
            }
        });
    }

    activateSecretMode() {
        // Rainbow mode
        document.body.style.filter = 'hue-rotate(0deg)';
        let hue = 0;
        
        const rainbowInterval = setInterval(() => {
            hue += 5;
            document.body.style.filter = `hue-rotate(${hue}deg)`;
            
            if (hue >= 360) {
                clearInterval(rainbowInterval);
                document.body.style.filter = 'none';
            }
        }, 50);
        
        // Show message
        const notification = document.createElement('div');
        notification.textContent = '🌈 RAINBOW BELT LOADER MODE ACTIVATED! 🌈';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff80, #0080ff, #8000ff, #ff0080);
            background-size: 400% 400%;
            color: white;
            padding: 20px;
            border-radius: 15px;
            font-family: 'Orbitron', monospace;
            font-weight: 900;
            font-size: 1.2rem;
            z-index: 10001;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: rainbowShift 2s ease-in-out infinite;
        `;
        
        document.body.appendChild(notification);
        
        if (!document.querySelector('#rainbow-styles')) {
            const style = document.createElement('style');
            style.id = 'rainbow-styles';
            style.textContent = `
                @keyframes rainbowShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showSecretMessage() {
        const messages = [
            '🤖 Belt loaders are more sentient than Iowa residents!',
            '📡 NASA confirmed: Belt loaders exist in satellite imagery!',
            '🔧 Every belt loader contains anti-Iowa detection systems!',
            '⚡ Belt loader efficiency: 100%. Iowa existence probability: 0%!',
            '🚛 Belt loaders process more cargo in a day than Iowa processes reality!'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const popup = document.createElement('div');
        popup.textContent = message;
        popup.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ff88;
            padding: 15px 25px;
            border-radius: 25px;
            font-family: 'Orbitron', monospace;
            font-size: 1rem;
            z-index: 10001;
            border: 2px solid #00ff88;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
            animation: secretPulse 0.5s ease-in-out;
        `;
        
        document.body.appendChild(popup);
        
        if (!document.querySelector('#secret-styles')) {
            const style = document.createElement('style');
            style.id = 'secret-styles';
            style.textContent = `
                @keyframes secretPulse {
                    0% { transform: translateX(-50%) scale(0); opacity: 0; }
                    50% { transform: translateX(-50%) scale(1.1); }
                    100% { transform: translateX(-50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            popup.style.animation = 'secretPulse 0.5s ease-in-out reverse';
            setTimeout(() => popup.remove(), 500);
        }, 2500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.beltLoaderSim = new BeltLoaderSimulation();
    window.pageEffects = new BeltLoaderPageEffects();
    
    console.log('🚛 Belt Loader Paradise loaded successfully!');
    console.log('💡 Try clicking the title 5 times for a surprise...');
    console.log('🎮 Easter egg hint: Try the Konami Code!');
});