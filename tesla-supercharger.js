
const batteryLevel = document.getElementById('battery-level');
const batteryProgress = document.getElementById('battery-progress');
const startBtn = document.getElementById('start-charge');
const stopBtn = document.getElementById('stop-charge');
const status = document.querySelector('.status');
const cable = document.getElementById('cable');
const car = document.getElementById('car');
const explosion = document.getElementById('explosion');

let charging = false;
let chargeInterval = null;
let currentLevel = 20;
let pluggedIn = false;

function updateBattery(level) {
    batteryLevel.textContent = level;
    batteryProgress.value = level;
}

function startCharging() {
    if (charging || !pluggedIn) return;
    charging = true;
    status.textContent = 'Charging...';
    startBtn.disabled = true;
    stopBtn.disabled = false;
    chargeInterval = setInterval(() => {
        // Random explosion chance
        if (Math.random() < 0.02) {
            triggerExplosion();
            stopCharging();
            return;
        }
        // Non-linear random charge
        let change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        if (Math.random() < 0.2) change = -Math.abs(change); // 20% chance to go backwards
        if (Math.random() < 0.2) change = Math.abs(change); // 20% chance to go forwards
        currentLevel += change;
        if (currentLevel > 100) currentLevel = 100;
        if (currentLevel < 0) currentLevel = 0;
        updateBattery(currentLevel);
        if (currentLevel === 100) {
            stopCharging();
            status.textContent = 'Fully Charged!';
        }
    }, 400);
}

function stopCharging() {
    charging = false;
    status.textContent = pluggedIn ? 'Plugged In' : 'Idle';
    startBtn.disabled = !pluggedIn;
    stopBtn.disabled = true;
    clearInterval(chargeInterval);
}

function triggerExplosion() {
    explosion.style.display = 'block';
    document.body.classList.add('screen-shake');
    status.textContent = '💥 Battery Exploded!';
    
    // Play explosion sound effect
    const explosionSound = document.getElementById('explosion-sound');
    if (explosionSound) {
        explosionSound.currentTime = 0; // Reset to start
        explosionSound.play().catch(e => console.log('Audio play failed:', e));
    }
    setTimeout(() => {
        explosion.style.display = 'none';
        document.body.classList.remove('screen-shake');
        currentLevel = 0;
        updateBattery(currentLevel);
    }, 1200);
}

// Drag and drop logic
cable.addEventListener('dragstart', (e) => {
    cable.classList.add('dragging');
});

cable.addEventListener('dragend', (e) => {
    cable.classList.remove('dragging');
});

car.addEventListener('dragover', (e) => {
    e.preventDefault();
    car.classList.add('drag-over');
});

car.addEventListener('dragleave', (e) => {
    car.classList.remove('drag-over');
});

car.addEventListener('drop', (e) => {
    e.preventDefault();
    car.classList.remove('drag-over');
    pluggedIn = true;
    cable.style.background = '#00ff88';
    status.textContent = 'Plugged In';
    startBtn.disabled = false;
});

startBtn.addEventListener('click', startCharging);
stopBtn.addEventListener('click', stopCharging);

updateBattery(currentLevel);
