/**
 * Advanced Performance Profiler and Stress Testing System
 * Features: Real-time monitoring, memory tracking, GPU stats, stress tests
 */

class PerformanceProfiler {
    constructor() {
        this.isMonitoring = false;
        this.stats = {
            fps: 0,
            frameTime: 0,
            memory: { used: 0, total: 0, limit: 0 },
            cpu: { load: 0, cores: navigator.hardwareConcurrency || 4 },
            gpu: { vendor: '', renderer: '', memory: 0 },
            network: { downlink: 0, effectiveType: '', rtt: 0 },
            rendering: { drawCalls: 0, triangles: 0, textures: 0 },
            custom: {}
        };
        
        this.history = {
            fps: [],
            memory: [],
            frameTime: [],
            maxHistory: 60
        };
        
        this.benchmarks = new Map();
        this.stressTests = new Map();
        this.alerts = [];
        this.callbacks = [];
        
        this.init();
    }

    init() {
        this.detectGPU();
        this.detectNetwork();
        this.setupStressTests();
        
        // Performance observer for paint metrics
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.entryType === 'paint') {
                            this.stats.custom[entry.name] = entry.startTime;
                        }
                    });
                });
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('PerformanceObserver not fully supported');
            }
        }
    }

    detectGPU() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    this.stats.gpu.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    this.stats.gpu.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                }
                
                // Try to detect GPU memory (experimental)
                const memoryInfo = gl.getExtension('WEBGL_debug_shaders');
                if (memoryInfo) {
                    this.stats.gpu.memory = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                }
            }
        } catch (e) {
            console.warn('Could not detect GPU info');
        }
    }

    detectNetwork() {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            this.stats.network.downlink = connection.downlink || 0;
            this.stats.network.effectiveType = connection.effectiveType || 'unknown';
            this.stats.network.rtt = connection.rtt || 0;
        }
    }

    setupStressTests() {
        // CPU intensive test
        this.stressTests.set('cpu', {
            name: 'CPU Stress Test',
            description: 'Tests CPU performance with heavy calculations',
            run: (duration = 5000) => {
                return new Promise((resolve) => {
                    const startTime = performance.now();
                    const endTime = startTime + duration;
                    let operations = 0;
                    
                    const calculate = () => {
                        const current = performance.now();
                        if (current < endTime) {
                            // Heavy calculation
                            for (let i = 0; i < 10000; i++) {
                                Math.sqrt(Math.random() * 1000000);
                                operations++;
                            }
                            setTimeout(calculate, 1);
                        } else {
                            resolve({
                                operations,
                                duration: current - startTime,
                                opsPerSecond: operations / ((current - startTime) / 1000)
                            });
                        }
                    };
                    calculate();
                });
            }
        });

        // Memory stress test
        this.stressTests.set('memory', {
            name: 'Memory Stress Test',
            description: 'Tests memory allocation and garbage collection',
            run: (targetMB = 100) => {
                return new Promise((resolve) => {
                    const arrays = [];
                    const startMemory = this.getMemoryUsage();
                    const startTime = performance.now();
                    
                    const allocate = () => {
                        try {
                            // Allocate 1MB arrays
                            const array = new Array(1024 * 1024).fill(Math.random());
                            arrays.push(array);
                            
                            const currentMemory = this.getMemoryUsage();
                            const allocated = (currentMemory.used - startMemory.used) / 1024 / 1024;
                            
                            if (allocated < targetMB) {
                                setTimeout(allocate, 10);
                            } else {
                                // Cleanup
                                arrays.length = 0;
                                
                                // Force garbage collection if available
                                if (window.gc) {
                                    window.gc();
                                }
                                
                                resolve({
                                    allocatedMB: allocated,
                                    duration: performance.now() - startTime,
                                    peakMemory: currentMemory.used
                                });
                            }
                        } catch (e) {
                            resolve({
                                error: 'Memory allocation failed',
                                allocatedMB: arrays.length,
                                duration: performance.now() - startTime
                            });
                        }
                    };
                    allocate();
                });
            }
        });

        // GPU stress test
        this.stressTests.set('gpu', {
            name: 'GPU Stress Test',
            description: 'Tests GPU performance with shader computations',
            run: (duration = 5000) => {
                return new Promise((resolve) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1024;
                    canvas.height = 1024;
                    
                    try {
                        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
                        if (!gl) throw new Error('WebGL not supported');
                        
                        const startTime = performance.now();
                        const endTime = startTime + duration;
                        let frames = 0;
                        
                        const render = () => {
                            const current = performance.now();
                            if (current < endTime) {
                                // Expensive rendering operations
                                gl.clear(gl.COLOR_BUFFER_BIT);
                                
                                // Fill with complex shader operations (simulated)
                                for (let i = 0; i < 100; i++) {
                                    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
                                }
                                
                                frames++;
                                requestAnimationFrame(render);
                            } else {
                                resolve({
                                    frames,
                                    duration: current - startTime,
                                    fps: frames / ((current - startTime) / 1000)
                                });
                            }
                        };
                        render();
                    } catch (e) {
                        resolve({ error: e.message });
                    }
                });
            }
        });
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        
        const monitor = () => {
            if (!this.isMonitoring) return;
            
            const currentTime = performance.now();
            this.frameCount++;
            
            // Calculate FPS every second
            if (currentTime - this.lastFrameTime >= 1000) {
                this.stats.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFrameTime));
                this.stats.frameTime = (currentTime - this.lastFrameTime) / this.frameCount;
                
                // Update history
                this.history.fps.push(this.stats.fps);
                this.history.frameTime.push(this.stats.frameTime);
                
                if (this.history.fps.length > this.history.maxHistory) {
                    this.history.fps.shift();
                    this.history.frameTime.shift();
                }
                
                this.frameCount = 0;
                this.lastFrameTime = currentTime;
            }
            
            // Update memory stats
            this.stats.memory = this.getMemoryUsage();
            this.history.memory.push(this.stats.memory.used);
            if (this.history.memory.length > this.history.maxHistory) {
                this.history.memory.shift();
            }
            
            // Check for performance alerts
            this.checkAlerts();
            
            // Notify callbacks
            this.callbacks.forEach(callback => callback(this.stats));
            
            requestAnimationFrame(monitor);
        };
        
        monitor();
    }

    stopMonitoring() {
        this.isMonitoring = false;
    }

    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        } else {
            // Fallback estimation
            return {
                used: 0,
                total: 0,
                limit: 0
            };
        }
    }

    benchmark(name, fn) {
        const start = performance.now();
        let result;
        
        try {
            result = fn();
        } catch (e) {
            result = { error: e.message };
        }
        
        const duration = performance.now() - start;
        
        this.benchmarks.set(name, {
            duration,
            result,
            timestamp: Date.now()
        });
        
        return { duration, result };
    }

    async runStressTest(testName, ...args) {
        const test = this.stressTests.get(testName);
        if (!test) {
            throw new Error(`Stress test '${testName}' not found`);
        }
        
        console.log(`Running stress test: ${test.name}`);
        
        const startStats = { ...this.stats };
        const result = await test.run(...args);
        const endStats = { ...this.stats };
        
        return {
            test: test.name,
            result,
            before: startStats,
            after: endStats,
            impact: {
                fpsChange: endStats.fps - startStats.fps,
                memoryChange: endStats.memory.used - startStats.memory.used
            }
        };
    }

    addAlert(condition, message, callback) {
        this.alerts.push({ condition, message, callback, triggered: false });
    }

    checkAlerts() {
        this.alerts.forEach(alert => {
            const shouldTrigger = alert.condition(this.stats);
            
            if (shouldTrigger && !alert.triggered) {
                console.warn('Performance Alert:', alert.message);
                if (alert.callback) alert.callback(this.stats);
                alert.triggered = true;
            } else if (!shouldTrigger && alert.triggered) {
                alert.triggered = false;
            }
        });
    }

    onUpdate(callback) {
        this.callbacks.push(callback);
    }

    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    getStats() {
        return {
            current: { ...this.stats },
            history: { ...this.history },
            benchmarks: Object.fromEntries(this.benchmarks),
            alerts: this.alerts.filter(a => a.triggered).map(a => a.message)
        };
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            system: {
                userAgent: navigator.userAgent,
                cores: this.stats.cpu.cores,
                gpu: this.stats.gpu,
                network: this.stats.network
            },
            performance: {
                averageFPS: this.history.fps.reduce((a, b) => a + b, 0) / this.history.fps.length || 0,
                averageFrameTime: this.history.frameTime.reduce((a, b) => a + b, 0) / this.history.frameTime.length || 0,
                peakMemory: Math.max(...this.history.memory),
                memoryTrend: this.calculateTrend(this.history.memory)
            },
            benchmarks: Object.fromEntries(this.benchmarks),
            recommendations: this.generateRecommendations()
        };
        
        return report;
    }

    calculateTrend(data) {
        if (data.length < 2) return 'insufficient_data';
        
        const first = data.slice(0, Math.floor(data.length / 3));
        const last = data.slice(-Math.floor(data.length / 3));
        
        const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
        const lastAvg = last.reduce((a, b) => a + b, 0) / last.length;
        
        const change = ((lastAvg - firstAvg) / firstAvg) * 100;
        
        if (change > 10) return 'increasing';
        if (change < -10) return 'decreasing';
        return 'stable';
    }

    generateRecommendations() {
        const recommendations = [];
        const avgFPS = this.history.fps.reduce((a, b) => a + b, 0) / this.history.fps.length || 0;
        const memoryTrend = this.calculateTrend(this.history.memory);
        
        if (avgFPS < 30) {
            recommendations.push({
                type: 'performance',
                severity: 'high',
                message: 'Low FPS detected. Consider reducing visual effects or particle count.'
            });
        }
        
        if (avgFPS < 15) {
            recommendations.push({
                type: 'performance',
                severity: 'critical',
                message: 'Very low FPS. Performance is severely impacted.'
            });
        }
        
        if (memoryTrend === 'increasing') {
            recommendations.push({
                type: 'memory',
                severity: 'medium',
                message: 'Memory usage is increasing. Check for memory leaks.'
            });
        }
        
        if (this.stats.memory.used / this.stats.memory.limit > 0.8) {
            recommendations.push({
                type: 'memory',
                severity: 'high',
                message: 'High memory usage detected. Consider optimizing memory allocation.'
            });
        }
        
        return recommendations;
    }

    exportData(format = 'json') {
        const data = this.generateReport();
        
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data);
            default:
                return data;
        }
    }

    convertToCSV(data) {
        const fps = this.history.fps.map((fps, i) => ({
            time: i,
            fps,
            memory: this.history.memory[i] || 0,
            frameTime: this.history.frameTime[i] || 0
        }));
        
        if (fps.length === 0) return '';
        
        const headers = Object.keys(fps[0]).join(',');
        const rows = fps.map(row => Object.values(row).join(','));
        
        return [headers, ...rows].join('\n');
    }
}

class PerformanceWidget {
    constructor(profiler, container) {
        this.profiler = profiler;
        this.container = container;
        this.isVisible = true;
        this.charts = new Map();
        
        this.createElement();
        this.bindEvents();
        this.startUpdating();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'performance-widget';
        this.element.innerHTML = `
            <div class="widget-header">
                <h3>🔧 Performance Monitor</h3>
                <div class="widget-controls">
                    <button class="btn-stress">Stress Test</button>
                    <button class="btn-export">Export</button>
                    <button class="btn-toggle">−</button>
                </div>
            </div>
            <div class="widget-content">
                <div class="stats-grid">
                    <div class="stat-item">
                        <label>FPS</label>
                        <span class="stat-value" id="fps-value">--</span>
                    </div>
                    <div class="stat-item">
                        <label>Frame Time</label>
                        <span class="stat-value" id="frametime-value">--</span>
                    </div>
                    <div class="stat-item">
                        <label>Memory</label>
                        <span class="stat-value" id="memory-value">--</span>
                    </div>
                    <div class="stat-item">
                        <label>GPU</label>
                        <span class="stat-value" id="gpu-value">--</span>
                    </div>
                </div>
                <div class="charts-container">
                    <canvas class="fps-chart" width="300" height="100"></canvas>
                </div>
                <div class="alerts-container"></div>
            </div>
        `;
        
        this.addStyles();
        this.container.appendChild(this.element);
    }

    addStyles() {
        if (!document.querySelector('#performance-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'performance-widget-styles';
            style.textContent = `
                .performance-widget {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    width: 350px;
                    background: rgba(26, 26, 46, 0.95);
                    border: 2px solid #00ff88;
                    border-radius: 12px;
                    font-family: 'Courier New', monospace;
                    z-index: 10000;
                    backdrop-filter: blur(10px);
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: rgba(0, 255, 136, 0.1);
                    border-bottom: 1px solid #00ff88;
                }

                .widget-header h3 {
                    margin: 0;
                    color: #00ff88;
                    font-size: 14px;
                }

                .widget-controls {
                    display: flex;
                    gap: 8px;
                }

                .widget-controls button {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .widget-controls button:hover {
                    background: rgba(0, 255, 136, 0.2);
                }

                .widget-content {
                    padding: 16px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                }

                .stat-item label {
                    font-size: 10px;
                    color: #ccc;
                    margin-bottom: 4px;
                }

                .stat-value {
                    font-size: 14px;
                    font-weight: bold;
                    color: #00ff88;
                }

                .charts-container {
                    margin: 16px 0;
                }

                .fps-chart {
                    width: 100%;
                    height: 60px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 4px;
                }

                .alerts-container {
                    max-height: 100px;
                    overflow-y: auto;
                }

                .alert-item {
                    padding: 6px;
                    margin-bottom: 4px;
                    background: rgba(255, 0, 0, 0.2);
                    border-left: 3px solid #ff0000;
                    font-size: 10px;
                    color: #fff;
                    border-radius: 2px;
                }

                .performance-widget.collapsed .widget-content {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        }
    }

    bindEvents() {
        const toggleBtn = this.element.querySelector('.btn-toggle');
        const stressBtn = this.element.querySelector('.btn-stress');
        const exportBtn = this.element.querySelector('.btn-export');
        
        toggleBtn.addEventListener('click', () => {
            this.element.classList.toggle('collapsed');
            toggleBtn.textContent = this.element.classList.contains('collapsed') ? '+' : '−';
        });
        
        stressBtn.addEventListener('click', () => {
            this.runStressTestSuite();
        });
        
        exportBtn.addEventListener('click', () => {
            this.exportData();
        });
    }

    startUpdating() {
        this.profiler.onUpdate((stats) => {
            this.updateDisplay(stats);
            this.updateChart(stats);
        });
    }

    updateDisplay(stats) {
        document.getElementById('fps-value').textContent = stats.fps;
        document.getElementById('frametime-value').textContent = `${stats.frameTime.toFixed(1)}ms`;
        
        const memoryMB = (stats.memory.used / 1024 / 1024).toFixed(1);
        document.getElementById('memory-value').textContent = `${memoryMB}MB`;
        
        const gpu = stats.gpu.renderer ? stats.gpu.renderer.split(' ')[0] : 'Unknown';
        document.getElementById('gpu-value').textContent = gpu;
    }

    updateChart(stats) {
        const canvas = this.element.querySelector('.fps-chart');
        const ctx = canvas.getContext('2d');
        const history = this.profiler.history.fps;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (history.length < 2) return;
        
        const max = Math.max(...history, 60);
        const min = Math.min(...history, 0);
        const range = max - min || 1;
        
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        history.forEach((fps, i) => {
            const x = (i / (history.length - 1)) * canvas.width;
            const y = canvas.height - ((fps - min) / range) * canvas.height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    async runStressTestSuite() {
        const tests = ['cpu', 'memory', 'gpu'];
        const results = [];
        
        for (const test of tests) {
            try {
                console.log(`Running ${test} stress test...`);
                const result = await this.profiler.runStressTest(test);
                results.push(result);
            } catch (e) {
                console.error(`Stress test ${test} failed:`, e);
            }
        }
        
        console.log('Stress test results:', results);
        alert('Stress tests completed! Check console for results.');
    }

    exportData() {
        const data = this.profiler.exportData('json');
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceProfiler, PerformanceWidget };
} else {
    window.PerformanceProfiler = PerformanceProfiler;
    window.PerformanceWidget = PerformanceWidget;
}