// Study Level Toilet Simulator - JavaScript Core
// This is a playful, interactive simulation with lots of JS logic

const toiletState = {
  waterLevel: 70,
  pressure: 50,
  flushPower: 0,
  lidOpen: true,
  lidAngle: 0,
  lidTarget: 0,
  flushPressure: 50,
  waterVolume: 70,
  vortexIntensity: 180, // Increased vortex intensity
  flushing: false,
  splashParticles: [],
  status: [],
  tankLevel: 100,
  pipeFlow: 0,
  bowlFlow: 0,
  wasteLevel: 0
};

// Sound effects
const sounds = {
  flush: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b6b2b7e.mp3'), // Free toilet flush sound
  fill: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b6b2b7e.mp3'), // Use same for fill for demo
  lid: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b6b2b7e.mp3') // Use same for lid for demo
};

function updateGauges() {
  document.querySelector('#waterLevelGauge .gauge-fill').style.height = toiletState.waterLevel + '%';
  document.querySelector('#pressureGauge .gauge-fill').style.height = toiletState.pressure + '%';
  document.querySelector('#flushPowerGauge .gauge-fill').style.height = toiletState.flushPower + '%';
}

function addStatus(msg) {
  toiletState.status.push(msg);
  const statusDiv = document.getElementById('statusMessages');
  const html = toiletState.status.slice(-8).map(m => `<div class="status-message">${m}</div>`).join('');
  statusDiv.innerHTML = html;
}

function flushToilet() {
  if (toiletState.flushing) {
    addStatus('Already flushing!');
    return;
  }
  if (!toiletState.lidOpen) {
    addStatus('Open the lid first!');
    return;
  }
  if (toiletState.waterLevel < 20) {
    addStatus('Not enough water to flush!');
    return;
  }
  toiletState.flushing = true;
  toiletState.flushPower = toiletState.flushPressure;
  addStatus('Flush initiated! Power: ' + toiletState.flushPressure);
  updateGauges();
  // Play flush sound
  sounds.flush.currentTime = 0;
  sounds.flush.play();
  // Add splash particles
  for (let i = 0; i < 20; i++) {
    toiletState.splashParticles.push({
      x: 250 + Math.cos(i * Math.PI / 10) * 120,
      y: 300 + Math.sin(i * Math.PI / 10) * 120,
      vx: Math.cos(i * Math.PI / 10) * (Math.random() * 4 + 2),
      vy: Math.sin(i * Math.PI / 10) * (Math.random() * 4 + 2),
      life: 40 + Math.random() * 20
    });
  }
  animateFlush();
}

function fillToilet() {
  toiletState.waterLevel = toiletState.waterVolume;
  addStatus('Tank filled to ' + toiletState.waterVolume + '%');
  updateGauges();
  // Play fill sound
  sounds.fill.currentTime = 0;
  sounds.fill.play();
}

function toggleLid() {
  toiletState.lidOpen = !toiletState.lidOpen;
  toiletState.lidTarget = toiletState.lidOpen ? 0 : Math.PI / 2;
  addStatus(toiletState.lidOpen ? 'Lid opened.' : 'Lid closed.');
  // Play lid sound
  sounds.lid.currentTime = 0;
  sounds.lid.play();
}

function updateSliders() {
  toiletState.flushPressure = parseInt(document.getElementById('flushPressure').value);
  toiletState.waterVolume = parseInt(document.getElementById('waterVolume').value);
  toiletState.vortexIntensity = parseInt(document.getElementById('vortexIntensity').value);
  toiletState.pressure = toiletState.flushPressure;
  updateGauges();
}

function animateFlush() {
  const canvas = document.getElementById('toiletCanvas');
  const ctx = canvas.getContext('2d');
  let frame = 0;
  let vortex = toiletState.vortexIntensity;
  let flushPower = toiletState.flushPower;
  let waterLevel = toiletState.waterLevel;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw tank (side view, with fill valve, float, flush valve)
    ctx.save();
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(60, 60, 120, 80);
    ctx.strokeStyle = '#888';
    ctx.strokeRect(60, 60, 120, 80);
    // Fill valve
    ctx.fillStyle = '#888';
    ctx.fillRect(70, 70, 10, 60);
    // Float
    ctx.beginPath();
    ctx.arc(75, 70 + 60 * (1 - toiletState.tankLevel / 100), 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffff00';
    ctx.fill();
    // Flush valve
    ctx.fillStyle = '#ff00cc';
    ctx.fillRect(160, 110, 10, 30);
    // Water in tank
    ctx.fillStyle = '#1bffff';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(62, 62 + 76 * (1 - toiletState.tankLevel / 100), 116, 76 * (toiletState.tankLevel / 100));
    ctx.globalAlpha = 1;
    ctx.restore();
    // Draw flush lever
    ctx.save();
    ctx.strokeStyle = '#ff00cc';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(170, 60);
    ctx.lineTo(200, 40);
    ctx.stroke();
    ctx.restore();
    // Draw bowl (side view, with rim, siphon jet, trapway)
    ctx.save();
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(220, 220);
    ctx.quadraticCurveTo(350, 180, 350, 350);
    ctx.lineTo(220, 350);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.stroke();
    // Rim
    ctx.beginPath();
    ctx.moveTo(220, 220);
    ctx.lineTo(350, 180);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Siphon jet
    ctx.beginPath();
    ctx.arc(320, 320, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#1bffff';
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
    // Trapway (U-shaped pipe)
    ctx.beginPath();
    ctx.moveTo(350, 350);
    ctx.bezierCurveTo(370, 370, 370, 410, 400, 400);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#888';
    ctx.stroke();
    ctx.restore();
    // Water in bowl
    ctx.save();
    ctx.fillStyle = '#1bffff';
    ctx.globalAlpha = 0.7;
    let bowlWaterHeight = 220 + (130 * (1 - waterLevel / 100));
    ctx.beginPath();
    ctx.moveTo(220, bowlWaterHeight);
    ctx.quadraticCurveTo(350, bowlWaterHeight - 40, 350, bowlWaterHeight + 130);
    ctx.lineTo(220, bowlWaterHeight + 130);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    // Draw vortex (side view, dramatic)
    if (toiletState.flushing) {
      for (let i = 0; i < 24; i++) {
        ctx.save();
        ctx.translate(285, bowlWaterHeight + 60);
        ctx.rotate(frame * 0.2 + i * Math.PI / 12);
        ctx.beginPath();
        ctx.ellipse(0, 0, 60 - i * 2, 18 - i, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,0,204,${0.2 + 0.03 * i})`;
        ctx.lineWidth = 2 + Math.sin(frame * 0.3 + i) * 2;
        ctx.stroke();
        ctx.restore();
      }
    }
    // Splash particles physics
    for (let p of toiletState.splashParticles) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#1bffff';
      ctx.globalAlpha = Math.max(0.2, p.life / 60);
      ctx.fill();
      ctx.restore();
    }
    // Draw lid with physics (side view)
    ctx.save();
    ctx.translate(350, 180);
    ctx.rotate(toiletState.lidAngle);
    ctx.fillStyle = '#bdbdbd';
    ctx.globalAlpha = 0.95;
    ctx.fillRect(-60, -20, 120, 20);
    ctx.restore();
    // Draw seat
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(285, 200, 70, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.restore();
    // Draw waste (brown blob)
    if (toiletState.wasteLevel > 0) {
      ctx.save();
      ctx.fillStyle = '#8B4513';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(285, bowlWaterHeight + 100, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Draw arrows for flow
    if (toiletState.pipeFlow > 0) {
      ctx.save();
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(200, 160);
      ctx.lineTo(220, 220);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(220, 340);
      ctx.lineTo(350, 350);
      ctx.stroke();
      ctx.restore();
    }
    // Labels for schematic
    ctx.save();
    ctx.font = '14px Comic Neue, sans-serif';
    ctx.fillStyle = '#222';
    ctx.fillText('Tank', 90, 75);
    ctx.fillText('Fill Valve', 70, 135);
    ctx.fillText('Float', 60, 70 + 60 * (1 - toiletState.tankLevel / 100) - 10);
    ctx.fillText('Flush Valve', 160, 110);
    ctx.fillText('Bowl', 285, 250);
    ctx.fillText('Siphon Jet', 320, 315);
    ctx.fillText('Trapway', 380, 390);
    ctx.fillText('Seat', 285, 195);
    ctx.fillText('Lid', 350, 170);
    ctx.restore();
  }
  function step() {
    frame++;
    // Splash particles physics
    toiletState.splashParticles = toiletState.splashParticles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // gravity
      p.life--;
      return p.life > 0 && p.y < 500;
    });
    // Lid physics
    toiletState.lidAngle += (toiletState.lidTarget - toiletState.lidAngle) * 0.2;
    if (Math.abs(toiletState.lidAngle - toiletState.lidTarget) < 0.01) {
      toiletState.lidAngle = toiletState.lidTarget;
    }
    // Internal workings simulation
    if (toiletState.flushing) {
      flushPower -= 2;
      waterLevel -= 2;
      vortex += 2; // More dramatic vortex
      toiletState.pipeFlow = Math.min(1, flushPower / 100);
      toiletState.tankLevel -= 2;
      toiletState.bowlFlow = Math.min(1, waterLevel / 100);
      if (flushPower <= 0 || waterLevel <= 10) {
        toiletState.flushing = false;
        toiletState.flushPower = 0;
        toiletState.waterLevel = Math.max(10, waterLevel);
        toiletState.pipeFlow = 0;
        toiletState.tankLevel = 100;
        toiletState.bowlFlow = 0;
        addStatus('Flush complete!');
        updateGauges();
      } else {
        toiletState.flushPower = flushPower;
        toiletState.waterLevel = waterLevel;
        toiletState.vortexIntensity = vortex;
        updateGauges();
      }
    }
    draw();
    requestAnimationFrame(step);
  }
  step();
}

function setupToiletSim() {
  document.getElementById('flushButton').onclick = flushToilet;
  document.getElementById('fillButton').onclick = fillToilet;
  document.getElementById('lidButton').onclick = toggleLid;
  document.getElementById('flushPressure').oninput = updateSliders;
  document.getElementById('waterVolume').oninput = updateSliders;
  document.getElementById('vortexIntensity').oninput = updateSliders;
  updateGauges();
  addStatus('Toilet simulator ready.');
  animateFlush();
}

document.addEventListener('DOMContentLoaded', setupToiletSim);