/**
 * Advanced Audio Visualizer System
 * Features: Real-time FFT analysis, multiple visualizations, microphone input
 */

class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.source = null;
        this.microphone = null;
        this.isInitialized = false;
        this.isRecording = false;
        
        // Analysis settings
        this.fftSize = 2048;
        this.smoothingTimeConstant = 0.8;
        
        // Frequency bands
        this.bands = {
            bass: { min: 0, max: 4 },
            lowMid: { min: 4, max: 16 },
            mid: { min: 16, max: 64 },
            highMid: { min: 64, max: 256 },
            treble: { min: 256, max: 1024 }
        };
        
        // Beat detection
        this.beatDetection = {
            enabled: false,
            threshold: 0.3,
            decay: 0.98,
            history: [],
            maxHistory: 20
        };
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;
            
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            this.isInitialized = true;
            console.log('Audio analyzer initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize audio analyzer:', error);
            return false;
        }
    }

    async connectMicrophone() {
        if (!this.isInitialized) {
            await this.init();
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            this.microphone = stream;
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.source.connect(this.analyser);
            
            this.isRecording = true;
            console.log('Microphone connected');
            return true;
        } catch (error) {
            console.error('Failed to access microphone:', error);
            return false;
        }
    }

    connectAudioElement(audioElement) {
        if (!this.isInitialized) {
            this.init();
        }

        this.source = this.audioContext.createMediaElementSource(audioElement);
        this.source.connect(this.analyser);
        this.source.connect(this.audioContext.destination);
        
        console.log('Audio element connected');
    }

    disconnectMicrophone() {
        if (this.microphone) {
            this.microphone.getTracks().forEach(track => track.stop());
            this.microphone = null;
            this.isRecording = false;
        }
    }

    getFrequencyData() {
        if (!this.analyser) return null;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    getWaveformData() {
        if (!this.analyser) return null;
        
        const waveformArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(waveformArray);
        return waveformArray;
    }

    getBandAmplitude(bandName) {
        const band = this.bands[bandName];
        if (!band || !this.dataArray) return 0;
        
        let sum = 0;
        for (let i = band.min; i < Math.min(band.max, this.dataArray.length); i++) {
            sum += this.dataArray[i];
        }
        return sum / (band.max - band.min) / 255;
    }

    getAllBands() {
        return Object.keys(this.bands).reduce((result, bandName) => {
            result[bandName] = this.getBandAmplitude(bandName);
            return result;
        }, {});
    }

    detectBeat() {
        if (!this.beatDetection.enabled || !this.dataArray) return false;
        
        // Get bass energy
        const bassEnergy = this.getBandAmplitude('bass');
        
        // Update history
        this.beatDetection.history.push(bassEnergy);
        if (this.beatDetection.history.length > this.beatDetection.maxHistory) {
            this.beatDetection.history.shift();
        }
        
        // Calculate average
        const average = this.beatDetection.history.reduce((a, b) => a + b, 0) / this.beatDetection.history.length;
        
        // Beat detection
        const isBeat = bassEnergy > average * (1 + this.beatDetection.threshold);
        
        // Apply decay to threshold
        this.beatDetection.threshold *= this.beatDetection.decay;
        if (this.beatDetection.threshold < 0.1) {
            this.beatDetection.threshold = 0.1;
        }
        
        return isBeat;
    }

    getSpectrum(bands = 64) {
        if (!this.dataArray) return [];
        
        const spectrum = [];
        const step = Math.floor(this.dataArray.length / bands);
        
        for (let i = 0; i < bands; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
                const index = i * step + j;
                if (index < this.dataArray.length) {
                    sum += this.dataArray[index];
                }
            }
            spectrum.push(sum / step / 255);
        }
        
        return spectrum;
    }

    getVolume() {
        if (!this.dataArray) return 0;
        
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        return sum / this.dataArray.length / 255;
    }
}

class AudioVisualizer {
    constructor(canvas, analyzer) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.analyzer = analyzer;
        
        this.visualizations = new Map();
        this.activeVisualization = 'spectrum';
        this.colors = {
            primary: '#00ff88',
            secondary: '#ff6b6b',
            accent: '#4ecdc4',
            background: '#1a1a2e'
        };
        
        this.setupVisualizations();
    }

    setupVisualizations() {
        // Spectrum analyzer
        this.visualizations.set('spectrum', (ctx, data) => {
            const { width, height } = this.canvas;
            const barWidth = width / data.length;
            
            ctx.clearRect(0, 0, width, height);
            
            data.forEach((amplitude, i) => {
                const barHeight = amplitude * height * 0.8;
                const x = i * barWidth;
                const y = height - barHeight;
                
                // Gradient based on frequency
                const hue = (i / data.length) * 360;
                const saturation = 80 + amplitude * 20;
                const lightness = 50 + amplitude * 30;
                
                ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                ctx.fillRect(x, y, barWidth - 1, barHeight);
                
                // Glow effect
                ctx.shadowColor = ctx.fillStyle;
                ctx.shadowBlur = amplitude * 20;
                ctx.fillRect(x, y, barWidth - 1, barHeight);
                ctx.shadowBlur = 0;
            });
        });

        // Waveform visualization
        this.visualizations.set('waveform', (ctx, data) => {
            const { width, height } = this.canvas;
            
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.colors.primary;
            ctx.beginPath();
            
            const sliceWidth = width / data.length;
            let x = 0;
            
            for (let i = 0; i < data.length; i++) {
                const v = data[i] / 128.0;
                const y = v * height / 2;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                x += sliceWidth;
            }
            
            ctx.stroke();
        });

        // Circular spectrum
        this.visualizations.set('circular', (ctx, data) => {
            const { width, height } = this.canvas;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.3;
            
            ctx.clearRect(0, 0, width, height);
            
            data.forEach((amplitude, i) => {
                const angle = (i / data.length) * Math.PI * 2;
                const barLength = amplitude * radius;
                
                const x1 = centerX + Math.cos(angle) * radius;
                const y1 = centerY + Math.sin(angle) * radius;
                const x2 = centerX + Math.cos(angle) * (radius + barLength);
                const y2 = centerY + Math.sin(angle) * (radius + barLength);
                
                const hue = (i / data.length) * 360;
                ctx.strokeStyle = `hsl(${hue}, 80%, ${50 + amplitude * 30}%)`;
                ctx.lineWidth = 3;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            });
        });

        // Particle visualization
        this.visualizations.set('particles', (ctx, data) => {
            const { width, height } = this.canvas;
            
            // Fade previous frame
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);
            
            const bands = this.analyzer.getAllBands();
            const volume = this.analyzer.getVolume();
            
            // Draw particles based on frequency bands
            Object.entries(bands).forEach(([band, amplitude], i) => {
                const particleCount = Math.floor(amplitude * 20);
                
                for (let j = 0; j < particleCount; j++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    const size = amplitude * 10 + 2;
                    
                    const hue = i * 60;
                    ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${amplitude})`;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        });

        // 3D Bars
        this.visualizations.set('bars3d', (ctx, data) => {
            const { width, height } = this.canvas;
            
            ctx.clearRect(0, 0, width, height);
            
            const barWidth = width / data.length;
            const perspective = 0.7;
            
            data.forEach((amplitude, i) => {
                const barHeight = amplitude * height * 0.6;
                const x = i * barWidth;
                const y = height - barHeight;
                
                // 3D effect
                const offsetX = amplitude * 10 * perspective;
                const offsetY = amplitude * 5 * perspective;
                
                // Shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(x + offsetX, y + offsetY, barWidth - 1, barHeight);
                
                // Main bar
                const hue = (i / data.length) * 360;
                ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
                ctx.fillRect(x, y, barWidth - 1, barHeight);
                
                // Highlight
                ctx.fillStyle = `hsl(${hue}, 60%, 80%)`;
                ctx.fillRect(x, y, barWidth * 0.3, barHeight);
            });
        });
    }

    render() {
        if (!this.analyzer.isInitialized) return;
        
        const frequencyData = this.analyzer.getFrequencyData();
        if (!frequencyData) return;
        
        let data;
        if (this.activeVisualization === 'waveform') {
            data = this.analyzer.getWaveformData();
        } else {
            data = this.analyzer.getSpectrum(64);
        }
        
        const visualization = this.visualizations.get(this.activeVisualization);
        if (visualization) {
            visualization(this.ctx, data);
        }
    }

    setVisualization(name) {
        if (this.visualizations.has(name)) {
            this.activeVisualization = name;
        }
    }

    getVisualizationNames() {
        return Array.from(this.visualizations.keys());
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

class AudioReactiveEffects {
    constructor(analyzer) {
        this.analyzer = analyzer;
        this.effects = [];
        this.beatCallbacks = [];
    }

    addEffect(name, callback) {
        this.effects.push({ name, callback });
    }

    onBeat(callback) {
        this.beatCallbacks.push(callback);
    }

    update() {
        if (!this.analyzer.isInitialized) return;
        
        const bands = this.analyzer.getAllBands();
        const volume = this.analyzer.getVolume();
        const isBeat = this.analyzer.detectBeat();
        
        // Update effects
        this.effects.forEach(effect => {
            effect.callback({ bands, volume, isBeat });
        });
        
        // Beat callbacks
        if (isBeat) {
            this.beatCallbacks.forEach(callback => callback(bands, volume));
        }
    }

    createScreenShake(intensity = 1.0) {
        this.addEffect('screenShake', ({ bands, volume, isBeat }) => {
            if (isBeat) {
                const shake = bands.bass * intensity * 10;
                document.body.style.transform = `translate(${Math.random() * shake - shake/2}px, ${Math.random() * shake - shake/2}px)`;
                
                setTimeout(() => {
                    document.body.style.transform = 'translate(0, 0)';
                }, 100);
            }
        });
    }

    createColorFlash(element, color = '#ffffff') {
        this.addEffect('colorFlash', ({ bands, volume, isBeat }) => {
            if (isBeat) {
                const originalColor = element.style.backgroundColor;
                element.style.backgroundColor = color;
                element.style.opacity = bands.bass;
                
                setTimeout(() => {
                    element.style.backgroundColor = originalColor;
                    element.style.opacity = '1';
                }, 200);
            }
        });
    }

    createParticleSpawn(particleSystem) {
        this.addEffect('particleSpawn', ({ bands, volume, isBeat }) => {
            if (isBeat && bands.bass > 0.3) {
                // Spawn particles on beat
                const emitter = particleSystem.addEmitter(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    {
                        particleCount: Math.floor(bands.bass * 50),
                        emissionRate: 10,
                        particleTypes: ['fire', 'electric']
                    }
                );
                
                // Remove emitter after a short time
                setTimeout(() => {
                    emitter.active = false;
                }, 2000);
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioAnalyzer, AudioVisualizer, AudioReactiveEffects };
} else {
    window.AudioAnalyzer = AudioAnalyzer;
    window.AudioVisualizer = AudioVisualizer;
    window.AudioReactiveEffects = AudioReactiveEffects;
}