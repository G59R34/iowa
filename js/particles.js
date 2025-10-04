/**
 * Advanced Particle System Engine
 * Features: Physics simulation, collision detection, multiple particle types, forces
 */

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag > 0) {
            this.divide(mag);
        }
        return this;
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    limit(max) {
        if (this.magnitude() > max) {
            this.normalize();
            this.multiply(max);
        }
        return this;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    static distance(v1, v2) {
        return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
    }
}

class Particle {
    constructor(x, y, type = 'default') {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        );
        this.acceleration = new Vector2(0, 0);
        this.type = type;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.mass = Math.random() * 2 + 1;
        this.size = this.mass * 3;
        this.color = this.getTypeColor();
        this.trail = [];
        this.maxTrailLength = 20;
        
        // Physics properties
        this.friction = 0.98;
        this.bounce = 0.8;
        this.gravity = new Vector2(0, 0.1);
        
        // Visual properties
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.pulsate = false;
        this.glowing = false;
    }

    getTypeColor() {
        const colors = {
            fire: `hsl(${Math.random() * 60}, 100%, 60%)`,
            water: `hsl(${180 + Math.random() * 60}, 80%, 60%)`,
            electric: `hsl(${240 + Math.random() * 60}, 100%, 80%)`,
            plasma: `hsl(${300 + Math.random() * 60}, 100%, 70%)`,
            nuclear: `hsl(${60 + Math.random() * 60}, 100%, 50%)`,
            default: `hsl(${Math.random() * 360}, 70%, 60%)`
        };
        return colors[this.type] || colors.default;
    }

    applyForce(force) {
        const f = force.copy();
        f.divide(this.mass);
        this.acceleration.add(f);
    }

    update(deltaTime, bounds) {
        // Store trail position
        this.trail.unshift(this.position.copy());
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }

        // Apply forces
        this.velocity.add(this.acceleration);
        this.velocity.multiply(this.friction);
        this.position.add(this.velocity);

        // Reset acceleration
        this.acceleration.multiply(0);

        // Update rotation
        this.rotation += this.rotationSpeed;

        // Boundary collision with bounce
        if (this.position.x <= this.size || this.position.x >= bounds.width - this.size) {
            this.velocity.x *= -this.bounce;
            this.position.x = Math.max(this.size, Math.min(bounds.width - this.size, this.position.x));
        }
        if (this.position.y <= this.size || this.position.y >= bounds.height - this.size) {
            this.velocity.y *= -this.bounce;
            this.position.y = Math.max(this.size, Math.min(bounds.height - this.size, this.position.y));
        }

        // Update life
        this.life -= 0.005;
        return this.life > 0;
    }

    checkCollision(other) {
        const distance = Vector2.distance(this.position, other.position);
        return distance < (this.size + other.size) / 2;
    }

    resolveCollision(other) {
        const dx = other.position.x - this.position.x;
        const dy = other.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (this.size + other.size) / 2) {
            // Collision response
            const angle = Math.atan2(dy, dx);
            const targetX = this.position.x + Math.cos(angle) * (this.size + other.size) / 2;
            const targetY = this.position.y + Math.sin(angle) * (this.size + other.size) / 2;
            
            const ax = (targetX - other.position.x) * 0.1;
            const ay = (targetY - other.position.y) * 0.1;
            
            this.velocity.x -= ax;
            this.velocity.y -= ay;
            other.velocity.x += ax;
            other.velocity.y += ay;
            
            // Energy exchange
            const tempVx = this.velocity.x;
            const tempVy = this.velocity.y;
            this.velocity.x = other.velocity.x * 0.8;
            this.velocity.y = other.velocity.y * 0.8;
            other.velocity.x = tempVx * 0.8;
            other.velocity.y = tempVy * 0.8;
        }
    }

    render(ctx) {
        const alpha = this.life / this.maxLife;
        
        // Render trail
        if (this.trail.length > 1) {
            ctx.save();
            for (let i = 0; i < this.trail.length - 1; i++) {
                const trailAlpha = (this.trail.length - i) / this.trail.length * alpha * 0.3;
                const trailSize = this.size * (trailAlpha + 0.2);
                
                ctx.globalAlpha = trailAlpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.trail[i].x, this.trail[i].y, trailSize, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Main particle
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);

        // Glow effect
        if (this.glowing) {
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Particle body
        const currentSize = this.pulsate ? this.size * (1 + Math.sin(Date.now() * 0.01) * 0.3) : this.size;
        
        if (this.type === 'electric') {
            // Electric particle with spikes
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const innerR = currentSize * 0.5;
                const outerR = currentSize * (1 + Math.random() * 0.5);
                const x1 = Math.cos(angle) * innerR;
                const y1 = Math.sin(angle) * innerR;
                const x2 = Math.cos(angle) * outerR;
                const y2 = Math.sin(angle) * outerR;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
            ctx.stroke();
        } else if (this.type === 'plasma') {
            // Plasma particle with energy rings
            for (let i = 0; i < 3; i++) {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 3 - i;
                ctx.globalAlpha = alpha * (1 - i * 0.3);
                ctx.beginPath();
                ctx.arc(0, 0, currentSize + i * 5, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            // Standard particle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

class ParticleEmitter {
    constructor(x, y, config = {}) {
        this.position = new Vector2(x, y);
        this.config = {
            particleCount: config.particleCount || 100,
            emissionRate: config.emissionRate || 5,
            particleTypes: config.particleTypes || ['default'],
            forces: config.forces || [],
            ...config
        };
        this.particles = [];
        this.emissionTimer = 0;
        this.active = true;
    }

    emit() {
        if (!this.active) return;

        for (let i = 0; i < this.config.emissionRate; i++) {
            if (this.particles.length < this.config.particleCount) {
                const type = this.config.particleTypes[
                    Math.floor(Math.random() * this.config.particleTypes.length)
                ];
                const particle = new Particle(
                    this.position.x + (Math.random() - 0.5) * 20,
                    this.position.y + (Math.random() - 0.5) * 20,
                    type
                );
                
                // Apply special properties based on type
                switch (type) {
                    case 'fire':
                        particle.gravity.y = -0.05;
                        particle.pulsate = true;
                        particle.glowing = true;
                        break;
                    case 'electric':
                        particle.glowing = true;
                        particle.rotationSpeed *= 3;
                        break;
                    case 'plasma':
                        particle.pulsate = true;
                        particle.glowing = true;
                        particle.mass *= 0.5;
                        break;
                }
                
                this.particles.push(particle);
            }
        }
    }

    addForce(force) {
        this.config.forces.push(force);
    }

    update(deltaTime, bounds) {
        this.emit();
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Apply global forces
            this.config.forces.forEach(force => {
                if (typeof force === 'function') {
                    particle.applyForce(force(particle));
                } else {
                    particle.applyForce(force);
                }
            });

            // Apply gravity
            particle.applyForce(particle.gravity);
            
            const isAlive = particle.update(deltaTime, bounds);
            if (!isAlive) {
                this.particles.splice(i, 1);
            }
        }

        // Collision detection (expensive, so limit checks)
        if (this.particles.length < 200) {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    if (this.particles[i].checkCollision(this.particles[j])) {
                        this.particles[i].resolveCollision(this.particles[j]);
                    }
                }
            }
        }
    }

    render(ctx) {
        this.particles.forEach(particle => particle.render(ctx));
    }

    getParticleCount() {
        return this.particles.length;
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
}

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.emitters = [];
        this.globalForces = [];
        this.bounds = { width: canvas.width, height: canvas.height };
        this.lastTime = 0;
        this.running = false;
        
        // Performance tracking
        this.stats = {
            particleCount: 0,
            emitterCount: 0,
            fps: 0,
            frameTime: 0
        };
    }

    addEmitter(x, y, config) {
        const emitter = new ParticleEmitter(x, y, config);
        this.emitters.push(emitter);
        return emitter;
    }

    removeEmitter(emitter) {
        const index = this.emitters.indexOf(emitter);
        if (index > -1) {
            this.emitters.splice(index, 1);
        }
    }

    addGlobalForce(force) {
        this.globalForces.push(force);
    }

    removeGlobalForce(force) {
        const index = this.globalForces.indexOf(force);
        if (index > -1) {
            this.globalForces.splice(index, 1);
        }
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.bounds = { width, height };
    }

    update(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
        
        // Update emitters
        let totalParticles = 0;
        this.emitters.forEach(emitter => {
            // Apply global forces to emitter
            this.globalForces.forEach(force => {
                emitter.addForce(force);
            });
            
            emitter.update(deltaTime, this.bounds);
            emitter.render(this.ctx);
            totalParticles += emitter.getParticleCount();
        });
        
        // Update stats
        this.stats.particleCount = totalParticles;
        this.stats.emitterCount = this.emitters.length;
        this.stats.frameTime = deltaTime;
        
        if (this.running) {
            requestAnimationFrame((time) => this.update(time));
        }
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.update(time));
    }

    stop() {
        this.running = false;
    }

    clear() {
        this.emitters.forEach(emitter => {
            emitter.particles = [];
        });
        this.ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);
    }

    getStats() {
        return { ...this.stats };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, ParticleEmitter, Particle, Vector2 };
} else {
    window.ParticleSystem = ParticleSystem;
    window.ParticleEmitter = ParticleEmitter;
    window.Particle = Particle;
    window.Vector2 = Vector2;
}