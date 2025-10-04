// Walmart Supercenter - Iowa Explosion Experience
class WalmartExperience {
    constructor() {
        this.explosionCount = 0;
        this.frankCount = 0;
        this.lizzoCount = 0;
        this.isExploding = false;
        this.isMusicPlaying = false;
        
        // Audio elements
        this.lizzoSong = document.getElementById('lizzo-song');
        this.explosionSound = document.getElementById('explosion-sound');
        
        this.init();
    }
    
    init() {
        this.loadStats();
        this.createIowaMap();
        this.bindEvents();
        this.startFloatingElements();
    }
    
    createIowaMap() {
        const mapContainer = document.getElementById('iowa-map');
        
        // Create Iowa SVG map
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        
        // Iowa shape (simplified but recognizable)
        const iowaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iowaPath.setAttribute('d', 'M20,30 L25,25 L30,20 L35,18 L40,20 L45,25 L50,30 L55,35 L60,40 L65,45 L70,50 L75,55 L80,60 L85,65 L90,70 L85,75 L80,80 L75,85 L70,90 L65,85 L60,80 L55,75 L50,70 L45,65 L40,60 L35,55 L30,50 L25,45 L20,40 Z');
        iowaPath.setAttribute('id', 'iowa-state');
        iowaPath.setAttribute('class', 'iowa-clickable');
        
        svg.appendChild(iowaPath);
        mapContainer.appendChild(svg);
        
        // Add click event to Iowa
        iowaPath.addEventListener('click', (e) => {
            e.stopPropagation();
            this.triggerExplosion(e);
        });
    }
    
    bindEvents() {
        // Modal close button
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeFrankModal();
        });
        
        // Replay explosion button
        document.getElementById('replay-explosion').addEventListener('click', () => {
            this.closeFrankModal();
            setTimeout(() => {
                this.triggerExplosion({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
            }, 500);
        });
        
        // Stop music button
        document.getElementById('stop-music').addEventListener('click', () => {
            this.stopLizzoMusic();
        });
        
        // Close modal on background click
        document.getElementById('frank-azar-modal').addEventListener('click', (e) => {
            if (e.target.id === 'frank-azar-modal') {
                this.closeFrankModal();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFrankModal();
            }
        });
    }
    
    triggerExplosion(event) {
        if (this.isExploding) return;
        
        this.isExploding = true;
        this.explosionCount++;
        this.updateStats();
        
        const x = event.clientX;
        const y = event.clientY;
        
        // Add explosion class to Iowa
        const iowa = document.getElementById('iowa-state');
        iowa.classList.add('iowa-exploding');
        
        // Create explosion effects
        this.createExplosionParticles(x, y);
        this.createExplosionFlash();
        this.createExplosionShockwave(x, y);
        
        // Play explosion sound
        if (this.explosionSound) {
            this.explosionSound.currentTime = 0;
            this.explosionSound.play().catch(e => console.log('Explosion sound failed:', e));
        }
        
        // Hide Iowa after explosion
        setTimeout(() => {
            iowa.style.display = 'none';
        }, 500);
        
        // Show Frank Azar modal after explosion
        setTimeout(() => {
            this.showFrankModal();
            this.playLizzoMusic();
        }, 1000);
        
        // Reset explosion state
        setTimeout(() => {
            this.isExploding = false;
            iowa.classList.remove('iowa-exploding');
            iowa.style.display = 'block';
        }, 2000);
    }
    
    createExplosionParticles(x, y) {
        const particlesContainer = document.getElementById('explosion-particles');
        particlesContainer.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random direction and distance
            const angle = (Math.PI * 2 * i) / 50;
            const distance = 100 + Math.random() * 200;
            const particleX = Math.cos(angle) * distance;
            const particleY = Math.sin(angle) * distance;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--x', particleX + 'px');
            particle.style.setProperty('--y', particleY + 'px');
            
            // Random color variations
            const colors = ['#ff6b35', '#ff8c42', '#ffcc00', '#ff1744'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    createExplosionFlash() {
        const flash = document.getElementById('explosion-flash');
        flash.style.animation = 'none';
        flash.offsetHeight; // Trigger reflow
        flash.style.animation = 'flash 0.5s ease-out';
    }
    
    createExplosionShockwave(x, y) {
        const shockwave = document.getElementById('explosion-shockwave');
        shockwave.style.left = x + 'px';
        shockwave.style.top = y + 'px';
        shockwave.style.animation = 'none';
        shockwave.offsetHeight; // Trigger reflow
        shockwave.style.animation = 'shockwave 1s ease-out';
    }
    
    showFrankModal() {
        this.frankCount++;
        this.updateStats();
        
        const modal = document.getElementById('frank-azar-modal');
        modal.style.display = 'block';
        
        // Add music playing effect to body
        document.body.classList.add('music-playing');
        
        // Add some random Frank Azar quotes
        this.updateFrankQuotes();
    }
    
    closeFrankModal() {
        const modal = document.getElementById('frank-azar-modal');
        modal.style.display = 'none';
        
        // Remove music playing effect
        document.body.classList.remove('music-playing');
        
        // Stop music
        this.stopLizzoMusic();
    }
    
    playLizzoMusic() {
        if (this.isMusicPlaying) return;
        
        this.isMusicPlaying = true;
        this.lizzoCount++;
        this.updateStats();
        
        if (this.lizzoSong) {
            // Set volume to maximum and ensure it's loud
            this.lizzoSong.volume = 1.0;
            this.lizzoSong.muted = false;
            
            // Try to play at full volume
            const playPromise = this.lizzoSong.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('🎵 LIZZO IS PLAYING AT FULL VOLUME! 🎵');
                    // Force volume again after play starts
                    this.lizzoSong.volume = 1.0;
                    
                    // Add visual feedback that music is playing
                    document.body.classList.add('music-playing');
                    
                    // Create a notification that Lizzo is playing
                    this.showLizzoNotification();
                }).catch(e => {
                    console.log('Lizzo music failed to play:', e);
                    this.isMusicPlaying = false;
                    // Try to play with user interaction fallback
                    this.requestUserInteractionForAudio();
                });
            }
            
            // Handle music end
            this.lizzoSong.addEventListener('ended', () => {
                this.isMusicPlaying = false;
                document.body.classList.remove('music-playing');
            });
        }
    }
    
    stopLizzoMusic() {
        if (this.lizzoSong && this.isMusicPlaying) {
            this.lizzoSong.pause();
            this.lizzoSong.currentTime = 0;
            this.isMusicPlaying = false;
            document.body.classList.remove('music-playing');
            console.log('🔇 LIZZO STOPPED! 🔇');
        }
    }
    
    showLizzoNotification() {
        const notification = document.createElement('div');
        notification.className = 'lizzo-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🎵</span>
                <span class="notification-text">LIZZO IS PLAYING AT FULL VOLUME!</span>
                <span class="notification-icon">🎵</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #ff6b35, #ff8c42);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            z-index: 3000;
            animation: lizzo-notification 2s ease-in-out;
            box-shadow: 0 0 30px rgba(255, 107, 53, 0.8);
        `;
        
        document.body.appendChild(notification);
        
        // Add notification animation CSS if not already present
        if (!document.querySelector('#lizzo-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'lizzo-notification-styles';
            style.textContent = `
                @keyframes lizzo-notification {
                    0% { transform: translateX(-50%) scale(0.8); opacity: 0; }
                    20% { transform: translateX(-50%) scale(1.1); opacity: 1; }
                    80% { transform: translateX(-50%) scale(1); opacity: 1; }
                    100% { transform: translateX(-50%) scale(0.8); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
    
    requestUserInteractionForAudio() {
        const audioPrompt = document.createElement('div');
        audioPrompt.className = 'audio-prompt';
        audioPrompt.innerHTML = `
            <div class="prompt-content">
                <h3>🎵 LIZZO NEEDS YOUR HELP! 🎵</h3>
                <p>Click anywhere to enable Lizzo at full volume!</p>
                <button class="enable-audio-btn">🎵 ENABLE LIZZO 🎵</button>
            </div>
        `;
        audioPrompt.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 4000;
        `;
        
        const promptContent = audioPrompt.querySelector('.prompt-content');
        promptContent.style.cssText = `
            background: linear-gradient(135deg, #ff6b35, #ff8c42);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            border: 3px solid #ffcc00;
            box-shadow: 0 0 50px rgba(255, 107, 53, 0.8);
        `;
        
        const enableBtn = audioPrompt.querySelector('.enable-audio-btn');
        enableBtn.style.cssText = `
            background: #ffcc00;
            border: none;
            color: #000;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
        `;
        
        enableBtn.addEventListener('click', () => {
            document.body.removeChild(audioPrompt);
            this.playLizzoMusic();
        });
        
        document.body.appendChild(audioPrompt);
    }
    
    updateFrankQuotes() {
        const quotes = [
            "I'm Frank Azar, the Strong Arm!",
            "Need a personal injury lawyer? Call me!",
            "Iowa may be fake, but my legal skills are real!",
            "The Strong Arm gets results!",
            "Don't let Iowa fool you - I'm the real deal!",
            "Personal injury? I'm your guy!",
            "The Strong Arm never sleeps!",
            "Justice is my middle name!",
            "Iowa conspiracy? I'll represent you!",
            "The Strong Arm strikes again!"
        ];
        
        const quoteElements = document.querySelectorAll('.frank-quotes p');
        const randomQuotes = this.shuffleArray(quotes).slice(0, 3);
        
        quoteElements.forEach((element, index) => {
            if (randomQuotes[index]) {
                element.textContent = randomQuotes[index];
            }
        });
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    startFloatingElements() {
        // Add some interactive floating elements
        const elements = document.querySelectorAll('.floating-item');
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.5) rotate(15deg)';
                element.style.filter = 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.8))';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
                element.style.filter = '';
            });
        });
    }
    
    updateStats() {
        document.getElementById('explosion-count').textContent = this.explosionCount;
        document.getElementById('frank-count').textContent = this.frankCount;
        document.getElementById('lizzo-count').textContent = this.lizzoCount;
        this.saveStats();
    }
    
    loadStats() {
        const stats = JSON.parse(localStorage.getItem('walmart-stats') || '{}');
        this.explosionCount = stats.explosionCount || 0;
        this.frankCount = stats.frankCount || 0;
        this.lizzoCount = stats.lizzoCount || 0;
        
        document.getElementById('explosion-count').textContent = this.explosionCount;
        document.getElementById('frank-count').textContent = this.frankCount;
        document.getElementById('lizzo-count').textContent = this.lizzoCount;
    }
    
    saveStats() {
        const stats = {
            explosionCount: this.explosionCount,
            frankCount: this.frankCount,
            lizzoCount: this.lizzoCount
        };
        localStorage.setItem('walmart-stats', JSON.stringify(stats));
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.walmartExperience = new WalmartExperience();
    
    // Save stats when page unloads
    window.addEventListener('beforeunload', () => {
        if (window.walmartExperience) {
            window.walmartExperience.saveStats();
        }
    });
}); 