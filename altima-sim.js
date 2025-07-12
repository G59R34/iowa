// Altima Sim - Drive Like a Maniac
class AltimaSim {
    constructor() {
        this.gameState = 'menu'; // menu, playing, gameOver
        this.map = null;
        this.altima = {
            x: 0,
            y: 0,
            speed: 0,
            maxSpeed: 120,
            acceleration: 2,
            deceleration: 1,
            turnSpeed: 3,
            direction: 0, // degrees
            aggression: 0,
            nearMisses: 0,
            carsCutOff: 0,
            topSpeed: 0
        };
        this.aiTraffic = [];
        this.keys = {};
        this.gameLoop = null;
        this.aggressiveMessages = [
            "🚗 CUT OFF! +10 AGGRESSION",
            "😱 NEAR MISS! +15 AGGRESSION", 
            "🚨 HORN BLAST! +5 AGGRESSION",
            "💨 SPEED DEMON! +20 AGGRESSION",
            "🌪️ CHAOS MODE! +25 AGGRESSION",
            "🔥 ROAD RAGE! +30 AGGRESSION",
            "⚡ BOOST ACTIVATED! +40 AGGRESSION",
            "💥 TRAFFIC VIOLATION! +50 AGGRESSION"
        ];
        this.init();
    }

    init() {
        this.loadStats();
        this.bindEvents();
        this.showMessage("🌽 Welcome to Altima Sim - Drive Like a Maniac!");
    }

    bindEvents() {
        // Start game button
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        // Restart game button
        document.getElementById('restart-game').addEventListener('click', () => {
            this.startGame();
        });

        // Back to menu button
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showMenu();
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (this.gameState === 'playing') {
                if (e.key === ' ') {
                    e.preventDefault();
                    this.horn();
                }
                if (e.key === 'r') {
                    this.resetPosition();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    startGame() {
        this.gameState = 'playing';
        this.hideMenu();
        this.initMap();
        this.spawnAltima();
        this.spawnAITraffic();
        this.startGameLoop();
        this.showMessage("🚗 Let the chaos begin!");
    }

    initMap() {
        // Initialize Google Maps (you'll need to add your API key)
        const mapOptions = {
            center: { lat: 40.7128, lng: -74.0060 }, // New York City
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: "all",
                    elementType: "geometry",
                    stylers: [{ color: "#2d2d2d" }]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#444444" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#1a1a1a" }]
                }
            ]
        };

        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        // Set initial position
        this.altima.x = window.innerWidth / 2;
        this.altima.y = window.innerHeight / 2;
    }

    spawnAltima() {
        const altimaElement = document.getElementById('altima-car');
        altimaElement.style.left = this.altima.x + 'px';
        altimaElement.style.top = this.altima.y + 'px';
        altimaElement.style.transform = `rotate(${this.altima.direction}deg)`;
    }

    spawnAITraffic() {
        const trafficContainer = document.getElementById('ai-traffic');
        trafficContainer.innerHTML = '';

        // Spawn 10-15 AI cars
        const numCars = Math.floor(Math.random() * 6) + 10;
        
        for (let i = 0; i < numCars; i++) {
            const aiCar = this.createAICar();
            this.aiTraffic.push(aiCar);
            trafficContainer.appendChild(aiCar.element);
        }
    }

    createAICar() {
        const car = document.createElement('div');
        car.className = 'ai-car';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const speed = Math.random() * 3 + 1;
        const direction = Math.random() * 360;
        
        car.style.left = x + 'px';
        car.style.top = y + 'px';
        car.style.transform = `rotate(${direction}deg)`;

        return {
            element: car,
            x: x,
            y: y,
            speed: speed,
            direction: direction,
            width: 50,
            height: 25,
            cutOff: false
        };
    }

    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, 16); // ~60 FPS
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.handleInput();
        this.updateAltima();
        this.updateAITraffic();
        this.checkCollisions();
        this.updateUI();
        this.createSpeedLines();
    }

    handleInput() {
        // Acceleration
        if (this.keys['w'] || this.keys['arrowup']) {
            this.altima.speed = Math.min(this.altima.speed + this.altima.acceleration, this.altima.maxSpeed);
        }

        // Braking
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.altima.speed = Math.max(this.altima.speed - this.altima.deceleration * 2, 0);
        }

        // Turning
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.altima.direction -= this.altima.turnSpeed;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.altima.direction += this.altima.turnSpeed;
        }

        // Boost
        if (this.keys['shift']) {
            this.altima.speed = Math.min(this.altima.speed + this.altima.acceleration * 2, this.altima.maxSpeed * 1.5);
            this.addAggression(5);
            this.showMessage("⚡ BOOST ACTIVATED!");
        }

        // Natural deceleration
        if (!this.keys['w'] && !this.keys['arrowup']) {
            this.altima.speed = Math.max(this.altima.speed - this.altima.deceleration * 0.5, 0);
        }
    }

    updateAltima() {
        // Update position based on speed and direction
        const radians = (this.altima.direction * Math.PI) / 180;
        this.altima.x += Math.cos(radians) * this.altima.speed;
        this.altima.y += Math.sin(radians) * this.altima.speed;

        // Keep car on screen
        this.altima.x = Math.max(0, Math.min(window.innerWidth - 60, this.altima.x));
        this.altima.y = Math.max(0, Math.min(window.innerHeight - 30, this.altima.y));

        // Update visual position
        const altimaElement = document.getElementById('altima-car');
        altimaElement.style.left = this.altima.x + 'px';
        altimaElement.style.top = this.altima.y + 'px';
        altimaElement.style.transform = `rotate(${this.altima.direction}deg)`;

        // Update top speed
        if (this.altima.speed > this.altima.topSpeed) {
            this.altima.topSpeed = this.altima.speed;
        }

        // Add aggression for high speeds
        if (this.altima.speed > 80) {
            this.addAggression(1);
        }
    }

    updateAITraffic() {
        this.aiTraffic.forEach(car => {
            // Simple AI movement
            const radians = (car.direction * Math.PI) / 180;
            car.x += Math.cos(radians) * car.speed;
            car.y += Math.sin(radians) * car.speed;

            // Bounce off screen edges
            if (car.x <= 0 || car.x >= window.innerWidth - 50) {
                car.direction = 180 - car.direction;
            }
            if (car.y <= 0 || car.y >= window.innerHeight - 25) {
                car.direction = -car.direction;
            }

            // Update visual position
            car.element.style.left = car.x + 'px';
            car.element.style.top = car.y + 'px';
            car.element.style.transform = `rotate(${car.direction}deg)`;
        });
    }

    checkCollisions() {
        this.aiTraffic.forEach(car => {
            const distance = Math.sqrt(
                Math.pow(this.altima.x - car.x, 2) + 
                Math.pow(this.altima.y - car.y, 2)
            );

            // Near miss detection
            if (distance < 80 && distance > 40 && !car.cutOff) {
                this.nearMiss(car);
            }

            // Cut off detection
            if (distance < 40 && !car.cutOff) {
                this.cutOffCar(car);
            }

            // Collision detection
            if (distance < 30) {
                this.collision(car);
            }
        });
    }

    nearMiss(car) {
        this.altima.nearMisses++;
        this.addAggression(15);
        this.showMessage("😱 NEAR MISS! +15 AGGRESSION");
        this.createParticles(car.x, car.y, '#ffcc00');
        this.playSound('crash-sound');
    }

    cutOffCar(car) {
        car.cutOff = true;
        car.element.classList.add('cut-off');
        this.altima.carsCutOff++;
        this.addAggression(10);
        this.showMessage("🚗 CUT OFF! +10 AGGRESSION");
        this.createParticles(car.x, car.y, '#ff0000');
        this.playSound('crash-sound');
        
        // Remove cut-off effect after animation
        setTimeout(() => {
            car.element.classList.remove('cut-off');
        }, 500);
    }

    collision(car) {
        this.gameOver();
    }

    horn() {
        this.addAggression(5);
        this.showMessage("🚨 HORN BLAST! +5 AGGRESSION");
        this.playSound('horn-sound');
        this.createParticles(this.altima.x, this.altima.y, '#ffcc00');
    }

    resetPosition() {
        this.altima.x = window.innerWidth / 2;
        this.altima.y = window.innerHeight / 2;
        this.altima.speed = 0;
        this.showMessage("🔄 Position reset!");
    }

    addAggression(points) {
        this.altima.aggression += points;
        
        // Chaos mode at high aggression
        if (this.altima.aggression > 500) {
            document.body.classList.add('chaos-mode');
        } else {
            document.body.classList.remove('chaos-mode');
        }

        // Aggressive driving effects
        if (this.altima.speed > 60) {
            document.getElementById('altima-car').classList.add('aggressive-driving');
        } else {
            document.getElementById('altima-car').classList.remove('aggressive-driving');
        }
    }

    createParticles(x, y, color) {
        const particleContainer = document.getElementById('particle-effects');
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            particle.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)`;
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    createSpeedLines() {
        if (this.altima.speed > 40) {
            const speedLinesContainer = document.querySelector('.speed-lines') || this.createSpeedLinesContainer();
            
            const line = document.createElement('div');
            line.className = 'speed-line';
            line.style.top = Math.random() * window.innerHeight + 'px';
            
            speedLinesContainer.appendChild(line);
            
            setTimeout(() => {
                line.remove();
            }, 500);
        }
    }

    createSpeedLinesContainer() {
        const container = document.createElement('div');
        container.className = 'speed-lines';
        document.body.appendChild(container);
        return container;
    }

    showMessage(message) {
        const messageDisplay = document.getElementById('message-display');
        messageDisplay.textContent = message;
        messageDisplay.classList.add('show');
        
        setTimeout(() => {
            messageDisplay.classList.remove('show');
        }, 2000);
    }

    updateUI() {
        document.getElementById('aggression-score').textContent = this.altima.aggression;
        document.getElementById('near-misses').textContent = this.altima.nearMisses;
        document.getElementById('cars-cut-off').textContent = this.altima.carsCutOff;
        document.getElementById('current-speed').textContent = Math.round(this.altima.speed);
    }

    gameOver() {
        this.gameState = 'gameOver';
        clearInterval(this.gameLoop);
        
        // Update final stats
        document.getElementById('final-score').textContent = this.altima.aggression;
        document.getElementById('final-cars-cut').textContent = this.altima.carsCutOff;
        document.getElementById('final-near-misses').textContent = this.altima.nearMisses;
        document.getElementById('final-speed').textContent = Math.round(this.altima.topSpeed);
        
        // Save stats
        this.saveStats();
        
        // Show game over screen
        document.getElementById('game-over-screen').style.display = 'flex';
        
        this.playSound('crash-sound');
        this.showMessage("💥 GAME OVER! You've been caught!");
    }

    hideMenu() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'none';
    }

    showMenu() {
        this.gameState = 'menu';
        this.loadStats();
        document.getElementById('start-screen').style.display = 'flex';
        document.getElementById('game-over-screen').style.display = 'none';
        
        // Reset game state
        this.altima = {
            x: 0,
            y: 0,
            speed: 0,
            maxSpeed: 120,
            acceleration: 2,
            deceleration: 1,
            turnSpeed: 3,
            direction: 0,
            aggression: 0,
            nearMisses: 0,
            carsCutOff: 0,
            topSpeed: 0
        };
        
        // Clear effects
        document.body.classList.remove('chaos-mode');
        document.getElementById('altima-car').classList.remove('aggressive-driving');
    }

    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    saveStats() {
        const stats = {
            highScore: Math.max(this.altima.aggression, this.getHighScore()),
            totalCarsCut: this.getTotalCarsCut() + this.altima.carsCutOff,
            totalNearMisses: this.getTotalNearMisses() + this.altima.nearMisses
        };
        localStorage.setItem('altima-sim-stats', JSON.stringify(stats));
    }

    loadStats() {
        const stats = JSON.parse(localStorage.getItem('altima-sim-stats')) || {
            highScore: 0,
            totalCarsCut: 0,
            totalNearMisses: 0
        };
        
        document.getElementById('high-score').textContent = stats.highScore;
        document.getElementById('total-cars-cut').textContent = stats.totalCarsCut;
        document.getElementById('total-near-misses').textContent = stats.totalNearMisses;
    }

    getHighScore() {
        const stats = JSON.parse(localStorage.getItem('altima-sim-stats')) || { highScore: 0 };
        return stats.highScore;
    }

    getTotalCarsCut() {
        const stats = JSON.parse(localStorage.getItem('altima-sim-stats')) || { totalCarsCut: 0 };
        return stats.totalCarsCut;
    }

    getTotalNearMisses() {
        const stats = JSON.parse(localStorage.getItem('altima-sim-stats')) || { totalNearMisses: 0 };
        return stats.totalNearMisses;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.altimaSim = new AltimaSim();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.altimaSim && window.altimaSim.gameState === 'playing') {
        // Keep car on screen after resize
        window.altimaSim.altima.x = Math.max(0, Math.min(window.innerWidth - 60, window.altimaSim.altima.x));
        window.altimaSim.altima.y = Math.max(0, Math.min(window.innerHeight - 30, window.altimaSim.altima.y));
    }
}); 