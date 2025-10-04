// Airbus A320 Avionics Simulator
class AirbusSimulator {
    constructor() {
        this.isRunning = false;
        this.isStarted = false;
        this.autopilot = false;
        this.gearDown = false;
        this.flapsPosition = 0; // 0 = up, 1-4 = flaps positions
        this.engine1Running = true;
        this.engine2Running = true;
        
        // Flight parameters
        this.altitude = 33000; // feet
        this.airspeed = 240; // knots
        this.heading = 270; // degrees
        this.verticalSpeed = 500; // feet per minute
        this.pitch = 0; // degrees
        this.roll = 0; // degrees
        this.yaw = 0; // degrees
        
        // Engine parameters
        this.n1_1 = 85; // Engine 1 N1 %
        this.n1_2 = 87; // Engine 2 N1 %
        this.n2_1 = 95; // Engine 1 N2 %
        this.n2_2 = 96; // Engine 2 N2 %
        this.egt_1 = 650; // Engine 1 EGT °C
        this.egt_2 = 655; // Engine 2 EGT °C
        
        // Autopilot targets
        this.targetAltitude = 33000;
        this.targetAirspeed = 240;
        this.targetHeading = 270;
        this.targetVerticalSpeed = 500;
        
        // Statistics
        this.takeoffCount = 0;
        this.landingCount = 0;
        this.totalFlightTime = 0;
        this.totalDistance = 0;
        this.startTime = 0;
        
        // Controls
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        
        // Audio
        this.engineSound = document.getElementById('engine-sound');
        this.apDisconnectSound = document.getElementById('ap-disconnect-sound');
        this.gearSound = document.getElementById('gear-sound');
        
        this.init();
    }
    
    init() {
        this.loadStats();
        this.bindEvents();
        this.updateDisplays();
        this.createClouds();
        this.startAudio();
    }
    
    bindEvents() {
        // Start button
        document.getElementById('start-simulator').addEventListener('click', () => {
            this.startSimulator();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyPress(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse controls
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        document.addEventListener('mousedown', () => {
            this.mouseDown = true;
        });
        
        document.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        
        // Control panel buttons
        document.getElementById('ap-engage').addEventListener('click', () => {
            this.toggleAutopilot();
        });
        
        document.getElementById('ap-disconnect').addEventListener('click', () => {
            this.disconnectAutopilot();
        });
        
        document.getElementById('gear-up').addEventListener('click', () => {
            this.retractGear();
        });
        
        document.getElementById('gear-down').addEventListener('click', () => {
            this.extendGear();
        });
        
        // Flaps controls
        document.getElementById('flaps-up').addEventListener('click', () => {
            this.setFlaps(0);
        });
        
        document.getElementById('flaps-1').addEventListener('click', () => {
            this.setFlaps(1);
        });
        
        document.getElementById('flaps-2').addEventListener('click', () => {
            this.setFlaps(2);
        });
        
        document.getElementById('flaps-3').addEventListener('click', () => {
            this.setFlaps(3);
        });
        
        document.getElementById('flaps-full').addEventListener('click', () => {
            this.setFlaps(4);
        });
    }
    
    startSimulator() {
        this.isStarted = true;
        this.isRunning = true;
        this.startTime = Date.now();
        
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('instructions-panel').style.display = 'block';
        
        this.gameLoop();
        this.startEngineSound();
    }
    
    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.toggleAutopilot();
                break;
            case 'KeyG':
                e.preventDefault();
                this.toggleGear();
                break;
            case 'KeyF':
                e.preventDefault();
                this.cycleFlaps();
                break;
            case 'KeyR':
                e.preventDefault();
                this.resetSimulator();
                break;
        }
    }
    
    toggleAutopilot() {
        if (this.autopilot) {
            this.disconnectAutopilot();
        } else {
            this.engageAutopilot();
        }
    }
    
    engageAutopilot() {
        this.autopilot = true;
        this.targetAltitude = this.altitude;
        this.targetAirspeed = this.airspeed;
        this.targetHeading = this.heading;
        this.targetVerticalSpeed = this.verticalSpeed;
        
        document.body.classList.add('autopilot-active');
        this.showMessage('AUTOPILOT ENGAGED');
    }
    
    disconnectAutopilot() {
        this.autopilot = false;
        document.body.classList.remove('autopilot-active');
        
        if (this.apDisconnectSound) {
            this.apDisconnectSound.play();
        }
        
        this.showMessage('AUTOPILOT DISCONNECTED');
    }
    
    toggleGear() {
        if (this.gearDown) {
            this.retractGear();
        } else {
            this.extendGear();
        }
    }
    
    extendGear() {
        this.gearDown = true;
        document.body.classList.add('gear-down');
        
        if (this.gearSound) {
            this.gearSound.play();
        }
        
        this.showMessage('GEAR DOWN');
    }
    
    retractGear() {
        this.gearDown = false;
        document.body.classList.remove('gear-down');
        
        if (this.gearSound) {
            this.gearSound.play();
        }
        
        this.showMessage('GEAR UP');
    }
    
    cycleFlaps() {
        this.flapsPosition = (this.flapsPosition + 1) % 5;
        this.setFlaps(this.flapsPosition);
    }
    
    setFlaps(position) {
        this.flapsPosition = position;
        const flapNames = ['UP', '1', '2', '3', 'FULL'];
        this.showMessage(`FLAPS ${flapNames[position]}`);
        
        // Update visual indicators
        document.querySelectorAll('[data-flaps]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (position > 0) {
            document.body.classList.add('flaps-extended');
        } else {
            document.body.classList.remove('flaps-extended');
        }
    }
    
    resetSimulator() {
        this.altitude = 33000;
        this.airspeed = 240;
        this.heading = 270;
        this.verticalSpeed = 500;
        this.pitch = 0;
        this.roll = 0;
        this.yaw = 0;
        this.autopilot = false;
        this.gearDown = false;
        this.flapsPosition = 0;
        
        document.body.classList.remove('autopilot-active', 'gear-down', 'flaps-extended');
        this.showMessage('SIMULATOR RESET');
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        this.updateFlightDynamics();
        this.updateDisplays();
        this.updateScene();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateFlightDynamics() {
        const deltaTime = 1/60; // 60 FPS
        
        // Handle manual controls
        if (!this.autopilot) {
            // Pitch control (W/S keys)
            if (this.keys['KeyW']) {
                this.pitch += 1 * deltaTime;
            }
            if (this.keys['KeyS']) {
                this.pitch -= 1 * deltaTime;
            }
            
            // Roll control (A/D keys)
            if (this.keys['KeyA']) {
                this.roll -= 2 * deltaTime;
            }
            if (this.keys['KeyD']) {
                this.roll += 2 * deltaTime;
            }
            
            // Yaw control (Q/E keys)
            if (this.keys['KeyQ']) {
                this.yaw -= 1 * deltaTime;
            }
            if (this.keys['KeyE']) {
                this.yaw += 1 * deltaTime;
            }
            
            // Mouse control for pitch and roll
            if (this.mouseDown) {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const deltaX = (this.mouseX - centerX) / centerX;
                const deltaY = (this.mouseY - centerY) / centerY;
                
                this.roll += deltaX * 2 * deltaTime;
                this.pitch -= deltaY * 2 * deltaTime;
            }
        }
        
        // Autopilot logic
        if (this.autopilot) {
            this.autopilotControl(deltaTime);
        }
        
        // Apply flight physics
        this.applyFlightPhysics(deltaTime);
        
        // Update statistics
        this.updateStatistics(deltaTime);
    }
    
    autopilotControl(deltaTime) {
        // Altitude hold
        const altitudeError = this.targetAltitude - this.altitude;
        if (Math.abs(altitudeError) > 100) {
            this.pitch += (altitudeError > 0 ? 0.5 : -0.5) * deltaTime;
        }
        
        // Heading hold
        const headingError = this.targetHeading - this.heading;
        if (Math.abs(headingError) > 5) {
            this.roll += (headingError > 0 ? 0.5 : -0.5) * deltaTime;
        }
        
        // Airspeed hold
        const airspeedError = this.targetAirspeed - this.airspeed;
        if (Math.abs(airspeedError) > 5) {
            // Adjust engine power
            this.n1_1 += (airspeedError > 0 ? 0.5 : -0.5) * deltaTime;
            this.n1_2 += (airspeedError > 0 ? 0.5 : -0.5) * deltaTime;
        }
        
        // Vertical speed hold
        const vsError = this.targetVerticalSpeed - this.verticalSpeed;
        if (Math.abs(vsError) > 50) {
            this.pitch += (vsError > 0 ? 0.3 : -0.3) * deltaTime;
        }
    }
    
    applyFlightPhysics(deltaTime) {
        // Clamp values
        this.pitch = Math.max(-30, Math.min(30, this.pitch));
        this.roll = Math.max(-60, Math.min(60, this.roll));
        this.yaw = Math.max(-30, Math.min(30, this.yaw));
        
        // Update heading based on roll (coordinated turn)
        this.heading += this.roll * 0.5 * deltaTime;
        if (this.heading >= 360) this.heading -= 360;
        if (this.heading < 0) this.heading += 360;
        
        // Update altitude based on pitch and vertical speed
        this.verticalSpeed = this.pitch * 100; // Simplified relationship
        this.altitude += this.verticalSpeed * deltaTime / 60;
        
        // Update airspeed based on pitch and engine power
        const avgN1 = (this.n1_1 + this.n1_2) / 2;
        const speedChange = (avgN1 - 85) * 0.5 - this.pitch * 2;
        this.airspeed += speedChange * deltaTime;
        
        // Clamp airspeed
        this.airspeed = Math.max(100, Math.min(350, this.airspeed));
        
        // Update engine parameters
        this.updateEngineParameters(deltaTime);
        
        // Check for takeoff/landing
        this.checkFlightPhases();
    }
    
    updateEngineParameters(deltaTime) {
        // N2 follows N1 with some lag
        this.n2_1 += (this.n1_1 - this.n2_1) * 0.1 * deltaTime;
        this.n2_2 += (this.n1_2 - this.n2_2) * 0.1 * deltaTime;
        
        // EGT based on N1
        this.egt_1 = 600 + this.n1_1 * 0.6;
        this.egt_2 = 600 + this.n1_2 * 0.6;
        
        // Clamp values
        this.n1_1 = Math.max(0, Math.min(100, this.n1_1));
        this.n1_2 = Math.max(0, Math.min(100, this.n1_2));
        this.n2_1 = Math.max(0, Math.min(100, this.n2_1));
        this.n2_2 = Math.max(0, Math.min(100, this.n2_2));
    }
    
    checkFlightPhases() {
        // Check for takeoff
        if (this.altitude > 1000 && this.verticalSpeed > 0 && !this.takeoffDetected) {
            this.takeoffCount++;
            this.takeoffDetected = true;
            this.showMessage('TAKEOFF DETECTED');
        }
        
        // Check for landing
        if (this.altitude < 100 && this.verticalSpeed < 0 && !this.landingDetected) {
            this.landingCount++;
            this.landingDetected = true;
            this.showMessage('LANDING DETECTED');
        }
        
        // Reset detection flags
        if (this.altitude > 2000) {
            this.takeoffDetected = false;
            this.landingDetected = false;
        }
    }
    
    updateDisplays() {
        // Update PFD
        this.updatePFD();
        
        // Update ND
        this.updateND();
        
        // Update engine display
        this.updateEngineDisplay();
        
        // Update system display
        this.updateSystemDisplay();
        
        // Update status bar
        this.updateStatusBar();
    }
    
    updatePFD() {
        // Update artificial horizon
        const horizon = document.querySelector('.artificial-horizon');
        if (horizon) {
            horizon.style.transform = `translate(-50%, -50%) rotate(${this.roll}deg)`;
        }
        
        // Update pitch ladder
        const pitchLadder = document.querySelector('.pitch-ladder');
        if (pitchLadder) {
            pitchLadder.style.transform = `translateY(${this.pitch * 2}px)`;
        }
        
        // Update altitude
        const currentAlt = document.querySelector('.current-altitude');
        if (currentAlt) {
            currentAlt.textContent = `FL${Math.floor(this.altitude / 100)}`;
        }
        
        // Update airspeed
        const currentSpeed = document.querySelector('.current-airspeed');
        if (currentSpeed) {
            currentSpeed.textContent = Math.round(this.airspeed);
        }
        
        // Update vertical speed
        const vsValue = document.querySelector('.vs-value');
        if (vsValue) {
            vsValue.textContent = `${this.verticalSpeed > 0 ? '+' : ''}${Math.round(this.verticalSpeed)}`;
        }
        
        // Update VS arrow
        const vsArrow = document.querySelector('.vs-arrow');
        if (vsArrow) {
            const vsAngle = Math.min(30, Math.max(-30, this.verticalSpeed / 20));
            vsArrow.style.transform = `translate(-50%, -50%) rotate(${vsAngle}deg)`;
        }
    }
    
    updateND() {
        // Update heading bug
        const headingBug = document.querySelector('.heading-bug');
        if (headingBug) {
            headingBug.style.transform = `translate(-50%, -50%) rotate(${this.heading}deg)`;
        }
        
        // Update course indicator
        const courseValue = document.querySelector('.course-value');
        if (courseValue) {
            courseValue.textContent = `${Math.round(this.heading)}°`;
        }
    }
    
    updateEngineDisplay() {
        // Update N1 gauges
        const n1_1_fill = document.querySelector('.engine-1 .n1-gauge .gauge-fill');
        const n1_2_fill = document.querySelector('.engine-2 .n1-gauge .gauge-fill');
        const n1_1_value = document.querySelector('.engine-1 .n1-gauge .gauge-value');
        const n1_2_value = document.querySelector('.engine-2 .n1-gauge .gauge-value');
        
        if (n1_1_fill) n1_1_fill.style.width = `${this.n1_1}%`;
        if (n1_2_fill) n1_2_fill.style.width = `${this.n1_2}%`;
        if (n1_1_value) n1_1_value.textContent = `${Math.round(this.n1_1)}%`;
        if (n1_2_value) n1_2_value.textContent = `${Math.round(this.n1_2)}%`;
        
        // Update N2 gauges
        const n2_1_fill = document.querySelector('.engine-1 .n2-gauge .gauge-fill');
        const n2_2_fill = document.querySelector('.engine-2 .n2-gauge .gauge-fill');
        const n2_1_value = document.querySelector('.engine-1 .n2-gauge .gauge-value');
        const n2_2_value = document.querySelector('.engine-2 .n2-gauge .gauge-value');
        
        if (n2_1_fill) n2_1_fill.style.width = `${this.n2_1}%`;
        if (n2_2_fill) n2_2_fill.style.width = `${this.n2_2}%`;
        if (n2_1_value) n2_1_value.textContent = `${Math.round(this.n2_1)}%`;
        if (n2_2_value) n2_2_value.textContent = `${Math.round(this.n2_2)}%`;
        
        // Update EGT gauges
        const egt_1_fill = document.querySelector('.engine-1 .egt-gauge .gauge-fill');
        const egt_2_fill = document.querySelector('.engine-2 .egt-gauge .gauge-fill');
        const egt_1_value = document.querySelector('.engine-1 .egt-gauge .gauge-value');
        const egt_2_value = document.querySelector('.engine-2 .egt-gauge .gauge-value');
        
        const egt_1_percent = (this.egt_1 - 600) / 200 * 100;
        const egt_2_percent = (this.egt_2 - 600) / 200 * 100;
        
        if (egt_1_fill) egt_1_fill.style.width = `${egt_1_percent}%`;
        if (egt_2_fill) egt_2_fill.style.width = `${egt_2_percent}%`;
        if (egt_1_value) egt_1_value.textContent = `${Math.round(this.egt_1)}°C`;
        if (egt_2_value) egt_2_value.textContent = `${Math.round(this.egt_2)}°C`;
    }
    
    updateSystemDisplay() {
        // Update APU status based on altitude
        const apuStatus = document.querySelector('.system-item:last-child .system-status');
        if (apuStatus) {
            if (this.altitude > 10000) {
                apuStatus.textContent = 'OFF';
                apuStatus.className = 'system-status warning';
            } else {
                apuStatus.textContent = 'ON';
                apuStatus.className = 'system-status normal';
            }
        }
    }
    
    updateStatusBar() {
        const statusValues = document.querySelectorAll('.status-value');
        if (statusValues.length >= 5) {
            statusValues[0].textContent = this.autopilot ? 'AP' : 'MAN';
            statusValues[1].textContent = `${Math.round(this.altitude)} FT`;
            statusValues[2].textContent = `${Math.round(this.airspeed)} KTS`;
            statusValues[3].textContent = `${Math.round(this.heading)}°`;
            statusValues[4].textContent = `${this.verticalSpeed > 0 ? '+' : ''}${Math.round(this.verticalSpeed)} FPM`;
        }
    }
    
    updateScene() {
        // Update sky gradient based on altitude
        const skyGradient = document.getElementById('sky-gradient');
        if (skyGradient) {
            const altitudePercent = Math.min(1, this.altitude / 40000);
            const skyColor = `hsl(${200 + altitudePercent * 40}, 70%, ${60 + altitudePercent * 20}%)`;
            skyGradient.style.background = `linear-gradient(to bottom, ${skyColor} 0%, #E0F6FF 100%)`;
        }
        
        // Update clouds movement
        this.updateClouds();
    }
    
    createClouds() {
        const cloudsContainer = document.getElementById('clouds');
        if (!cloudsContainer) return;
        
        for (let i = 0; i < 20; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.cssText = `
                position: absolute;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 50 + 25}px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50px;
                top: ${Math.random() * 70}%;
                left: ${Math.random() * 100}%;
                animation: cloud-float ${Math.random() * 20 + 10}s linear infinite;
            `;
            cloudsContainer.appendChild(cloud);
        }
        
        // Add cloud animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cloud-float {
                from { transform: translateX(100vw); }
                to { transform: translateX(-100px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    updateClouds() {
        // Clouds are animated via CSS, but we can add some dynamic effects
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach(cloud => {
            const speed = this.airspeed / 100;
            cloud.style.animationDuration = `${20 / speed}s`;
        });
    }
    
    updateStatistics(deltaTime) {
        this.totalFlightTime += deltaTime;
        
        // Update distance (simplified)
        const distanceIncrement = this.airspeed * deltaTime / 3600; // nautical miles per second
        this.totalDistance += distanceIncrement;
        
        // Update display
        const totalFlightTimeDisplay = document.getElementById('total-flight-time');
        const totalDistanceDisplay = document.getElementById('total-distance');
        
        if (totalFlightTimeDisplay) {
            const hours = Math.floor(this.totalFlightTime / 3600);
            const minutes = Math.floor((this.totalFlightTime % 3600) / 60);
            totalFlightTimeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
        
        if (totalDistanceDisplay) {
            totalDistanceDisplay.textContent = Math.round(this.totalDistance);
        }
    }
    
    showMessage(message) {
        const messageDisplay = document.createElement('div');
        messageDisplay.className = 'simulator-message';
        messageDisplay.textContent = message;
        messageDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 20, 0, 0.9);
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 3000;
            animation: message-fade 3s ease-in-out;
        `;
        
        document.body.appendChild(messageDisplay);
        
        // Add animation CSS if not already present
        if (!document.querySelector('#message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes message-fade {
                    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove message after animation
        setTimeout(() => {
            if (messageDisplay.parentNode) {
                messageDisplay.parentNode.removeChild(messageDisplay);
            }
        }, 3000);
    }
    
    startEngineSound() {
        if (this.engineSound) {
            this.engineSound.volume = 0.3;
            this.engineSound.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    startAudio() {
        // Preload audio files
        if (this.engineSound) {
            this.engineSound.load();
        }
        if (this.apDisconnectSound) {
            this.apDisconnectSound.load();
        }
        if (this.gearSound) {
            this.gearSound.load();
        }
    }
    
    loadStats() {
        const stats = JSON.parse(localStorage.getItem('airbus-sim-stats') || '{}');
        this.takeoffCount = stats.takeoffCount || 0;
        this.landingCount = stats.landingCount || 0;
        this.totalFlightTime = stats.totalFlightTime || 0;
        this.totalDistance = stats.totalDistance || 0;
        
        // Update display
        document.getElementById('takeoff-count').textContent = this.takeoffCount;
        document.getElementById('landing-count').textContent = this.landingCount;
        
        const hours = Math.floor(this.totalFlightTime / 3600);
        const minutes = Math.floor((this.totalFlightTime % 3600) / 60);
        document.getElementById('total-flight-time').textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        document.getElementById('total-distance').textContent = Math.round(this.totalDistance);
    }
    
    saveStats() {
        const stats = {
            takeoffCount: this.takeoffCount,
            landingCount: this.landingCount,
            totalFlightTime: this.totalFlightTime,
            totalDistance: this.totalDistance
        };
        localStorage.setItem('airbus-sim-stats', JSON.stringify(stats));
    }
}

// Initialize simulator when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.airbusSimulator = new AirbusSimulator();
    
    // Save stats when page unloads
    window.addEventListener('beforeunload', () => {
        if (window.airbusSimulator) {
            window.airbusSimulator.saveStats();
        }
    });
}); 