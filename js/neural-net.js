/**
 * Neural Network Visualization System
 * Features: Interactive neural network, real-time training visualization, TensorFlow.js integration
 */

class NeuralNetworkVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.network = null;
        this.isTraining = false;
        
        // Network structure
        this.layers = [
            { nodes: 4, type: 'input', name: 'Input Layer' },
            { nodes: 8, type: 'hidden', name: 'Hidden Layer 1' },
            { nodes: 6, type: 'hidden', name: 'Hidden Layer 2' },
            { nodes: 2, type: 'output', name: 'Output Layer' }
        ];
        
        // Visual properties
        this.nodeRadius = 20;
        this.layerSpacing = 150;
        this.nodeSpacing = 60;
        this.connectionOpacity = 0.3;
        
        // Animation
        this.activations = [];
        this.pulses = [];
        this.trainingData = [];
        
        // Colors
        this.colors = {
            input: '#4ecdc4',
            hidden: '#45b7d1',
            output: '#96ceb4',
            connection: '#ffffff',
            activation: '#ff6b6b',
            pulse: '#ffd93d'
        };
        
        this.init();
    }

    init() {
        this.calculatePositions();
        this.createSimpleNetwork();
        this.generateTrainingData();
        this.startAnimation();
    }

    calculatePositions() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const totalWidth = (this.layers.length - 1) * this.layerSpacing;
        const startX = centerX - totalWidth / 2;
        
        this.layers.forEach((layer, layerIndex) => {
            layer.x = startX + layerIndex * this.layerSpacing;
            layer.nodes = [];
            
            const totalHeight = (layer.nodes - 1) * this.nodeSpacing;
            const startY = centerY - totalHeight / 2;
            
            for (let nodeIndex = 0; nodeIndex < layer.nodes; nodeIndex++) {
                layer.nodes.push({
                    x: layer.x,
                    y: startY + nodeIndex * this.nodeSpacing,
                    activation: 0,
                    bias: Math.random() - 0.5,
                    pulse: 0,
                    id: `${layerIndex}-${nodeIndex}`
                });
            }
        });
    }

    createSimpleNetwork() {
        // Create a simple neural network for demonstration
        this.weights = [];
        
        for (let i = 0; i < this.layers.length - 1; i++) {
            const currentLayer = this.layers[i];
            const nextLayer = this.layers[i + 1];
            const layerWeights = [];
            
            for (let j = 0; j < currentLayer.nodes.length; j++) {
                const nodeWeights = [];
                for (let k = 0; k < nextLayer.nodes.length; k++) {
                    nodeWeights.push(Math.random() * 2 - 1); // Random weights between -1 and 1
                }
                layerWeights.push(nodeWeights);
            }
            this.weights.push(layerWeights);
        }
    }

    generateTrainingData() {
        // Generate XOR-like training data
        this.trainingData = [
            { input: [0, 0, 1, 0], output: [1, 0] },
            { input: [0, 1, 0, 1], output: [0, 1] },
            { input: [1, 0, 0, 1], output: [0, 1] },
            { input: [1, 1, 1, 0], output: [1, 0] },
            { input: [0.5, 0.8, 0.2, 0.9], output: [0.2, 0.8] },
            { input: [0.3, 0.1, 0.9, 0.4], output: [0.7, 0.3] }
        ];
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    relu(x) {
        return Math.max(0, x);
    }

    forwardPass(input) {
        // Set input layer activations
        for (let i = 0; i < this.layers[0].nodes.length; i++) {
            this.layers[0].nodes[i].activation = input[i] || 0;
        }
        
        // Forward propagation
        for (let layerIndex = 1; layerIndex < this.layers.length; layerIndex++) {
            const currentLayer = this.layers[layerIndex];
            const previousLayer = this.layers[layerIndex - 1];
            const weights = this.weights[layerIndex - 1];
            
            for (let nodeIndex = 0; nodeIndex < currentLayer.nodes.length; nodeIndex++) {
                let sum = 0;
                
                for (let prevNodeIndex = 0; prevNodeIndex < previousLayer.nodes.length; prevNodeIndex++) {
                    const weight = weights[prevNodeIndex][nodeIndex];
                    const activation = previousLayer.nodes[prevNodeIndex].activation;
                    sum += weight * activation;
                }
                
                sum += currentLayer.nodes[nodeIndex].bias;
                currentLayer.nodes[nodeIndex].activation = this.sigmoid(sum);
            }
        }
        
        // Get output
        const outputLayer = this.layers[this.layers.length - 1];
        return outputLayer.nodes.map(node => node.activation);
    }

    addPulse(fromLayer, fromNode, toLayer, toNode, strength = 1.0) {
        const from = this.layers[fromLayer].nodes[fromNode];
        const to = this.layers[toLayer].nodes[toNode];
        
        this.pulses.push({
            fromX: from.x,
            fromY: from.y,
            toX: to.x,
            toY: to.y,
            progress: 0,
            strength,
            speed: 0.05,
            life: 1.0
        });
    }

    simulateTraining() {
        if (this.trainingData.length === 0) return;
        
        const sample = this.trainingData[Math.floor(Math.random() * this.trainingData.length)];
        
        // Forward pass
        const output = this.forwardPass(sample.input);
        
        // Add visual effects for data flow
        for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
            for (let nodeIndex = 0; nodeIndex < this.layers[layerIndex].nodes.length; nodeIndex++) {
                const activation = this.layers[layerIndex].nodes[nodeIndex].activation;
                if (activation > 0.1) {
                    // Add pulses to next layer
                    for (let nextNodeIndex = 0; nextNodeIndex < this.layers[layerIndex + 1].nodes.length; nextNodeIndex++) {
                        if (Math.random() < activation) {
                            this.addPulse(layerIndex, nodeIndex, layerIndex + 1, nextNodeIndex, activation);
                        }
                    }
                }
            }
        }
        
        // Simulate weight updates (simple gradient descent visualization)
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    this.weights[i][j][k] += (Math.random() - 0.5) * 0.01;
                    this.weights[i][j][k] = Math.max(-2, Math.min(2, this.weights[i][j][k]));
                }
            }
        }
        
        return { input: sample.input, expected: sample.output, actual: output };
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();
        
        // Draw pulses
        this.drawPulses();
        
        // Draw nodes
        this.drawNodes();
        
        // Draw labels
        this.drawLabels();
    }

    drawConnections() {
        this.ctx.globalAlpha = this.connectionOpacity;
        
        for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
            const currentLayer = this.layers[layerIndex];
            const nextLayer = this.layers[layerIndex + 1];
            const weights = this.weights[layerIndex];
            
            for (let nodeIndex = 0; nodeIndex < currentLayer.nodes.length; nodeIndex++) {
                const node = currentLayer.nodes[nodeIndex];
                
                for (let nextNodeIndex = 0; nextNodeIndex < nextLayer.nodes.length; nextNodeIndex++) {
                    const nextNode = nextLayer.nodes[nextNodeIndex];
                    const weight = weights[nodeIndex][nextNodeIndex];
                    
                    // Color based on weight strength and sign
                    const intensity = Math.abs(weight) / 2;
                    const color = weight > 0 ? `rgba(0, 255, 136, ${intensity})` : `rgba(255, 107, 107, ${intensity})`;
                    
                    this.ctx.strokeStyle = color;
                    this.ctx.lineWidth = Math.abs(weight) * 2 + 0.5;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(nextNode.x, nextNode.y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.globalAlpha = 1.0;
    }

    drawPulses() {
        this.pulses = this.pulses.filter(pulse => {
            pulse.progress += pulse.speed;
            pulse.life -= 0.02;
            
            if (pulse.life <= 0 || pulse.progress >= 1) return false;
            
            const currentX = pulse.fromX + (pulse.toX - pulse.fromX) * pulse.progress;
            const currentY = pulse.fromY + (pulse.toY - pulse.fromY) * pulse.progress;
            
            this.ctx.save();
            this.ctx.globalAlpha = pulse.life * pulse.strength;
            this.ctx.fillStyle = this.colors.pulse;
            this.ctx.shadowColor = this.colors.pulse;
            this.ctx.shadowBlur = 10;
            
            this.ctx.beginPath();
            this.ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            return true;
        });
    }

    drawNodes() {
        this.layers.forEach((layer, layerIndex) => {
            layer.nodes.forEach((node, nodeIndex) => {
                // Node background
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, this.nodeRadius + 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Node color based on activation
                const activation = node.activation;
                const baseColor = this.colors[layer.type];
                const intensity = activation;
                
                this.ctx.fillStyle = baseColor;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Activation glow
                if (activation > 0.1) {
                    this.ctx.save();
                    this.ctx.globalAlpha = activation * 0.5;
                    this.ctx.shadowColor = this.colors.activation;
                    this.ctx.shadowBlur = this.nodeRadius * activation;
                    this.ctx.fillStyle = this.colors.activation;
                    this.ctx.beginPath();
                    this.ctx.arc(node.x, node.y, this.nodeRadius * 0.8, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                }
                
                // Activation value text
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '10px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(activation.toFixed(2), node.x, node.y);
                
                // Node border
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
                this.ctx.stroke();
            });
        });
    }

    drawLabels() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        
        this.layers.forEach(layer => {
            const minY = Math.min(...layer.nodes.map(n => n.y));
            this.ctx.fillText(layer.name, layer.x, minY - 40);
        });
    }

    startAnimation() {
        let lastTraining = 0;
        
        const animate = (currentTime) => {
            // Simulate training every 2 seconds
            if (currentTime - lastTraining > 2000) {
                this.simulateTraining();
                lastTraining = currentTime;
            }
            
            this.render();
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.calculatePositions();
    }

    setInput(inputArray) {
        if (inputArray.length === this.layers[0].nodes.length) {
            return this.forwardPass(inputArray);
        }
    }

    startTraining() {
        this.isTraining = true;
        this.trainingInterval = setInterval(() => {
            this.simulateTraining();
        }, 500);
    }

    stopTraining() {
        this.isTraining = false;
        if (this.trainingInterval) {
            clearInterval(this.trainingInterval);
        }
    }

    getNetworkInfo() {
        return {
            layers: this.layers.map(layer => ({
                type: layer.type,
                nodeCount: layer.nodes.length,
                averageActivation: layer.nodes.reduce((sum, node) => sum + node.activation, 0) / layer.nodes.length
            })),
            totalWeights: this.weights.reduce((total, layer) => 
                total + layer.reduce((layerTotal, node) => layerTotal + node.length, 0), 0),
            isTraining: this.isTraining
        };
    }
}

class TensorFlowDemo {
    constructor() {
        this.model = null;
        this.isTraining = false;
        this.trainingHistory = [];
        
        this.init();
    }

    async init() {
        // Check if TensorFlow.js is available
        if (typeof tf === 'undefined') {
            console.warn('TensorFlow.js not loaded. Creating mock implementation.');
            this.createMockModel();
            return;
        }
        
        try {
            await this.createModel();
            console.log('TensorFlow.js model created successfully');
        } catch (error) {
            console.error('Failed to create TensorFlow model:', error);
            this.createMockModel();
        }
    }

    async createModel() {
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }),
                tf.layers.dense({ units: 6, activation: 'relu' }),
                tf.layers.dense({ units: 2, activation: 'sigmoid' })
            ]
        });

        this.model.compile({
            optimizer: 'adam',
            loss: 'meanSquaredError',
            metrics: ['accuracy']
        });
    }

    createMockModel() {
        // Mock model for when TensorFlow.js isn't available
        this.model = {
            predict: (input) => {
                // Simple mock prediction
                return {
                    dataSync: () => [Math.random(), Math.random()]
                };
            },
            fit: async (xs, ys, config) => {
                return {
                    history: {
                        loss: [Math.random() * 0.5],
                        accuracy: [0.5 + Math.random() * 0.5]
                    }
                };
            }
        };
    }

    async trainModel(epochs = 10) {
        if (!this.model) return null;

        this.isTraining = true;
        
        // Generate training data
        const trainingData = this.generateTrainingData(100);
        
        try {
            let xs, ys;
            
            if (typeof tf !== 'undefined') {
                xs = tf.tensor2d(trainingData.inputs);
                ys = tf.tensor2d(trainingData.outputs);
            } else {
                xs = trainingData.inputs;
                ys = trainingData.outputs;
            }

            const history = await this.model.fit(xs, ys, {
                epochs: epochs,
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        this.trainingHistory.push({
                            epoch,
                            loss: logs.loss,
                            accuracy: logs.accuracy || logs.acc
                        });
                        
                        console.log(`Epoch ${epoch + 1}/${epochs} - Loss: ${logs.loss.toFixed(4)}`);
                    }
                }
            });

            // Cleanup tensors
            if (typeof tf !== 'undefined') {
                xs.dispose();
                ys.dispose();
            }

            this.isTraining = false;
            return history;
        } catch (error) {
            console.error('Training failed:', error);
            this.isTraining = false;
            return null;
        }
    }

    generateTrainingData(samples) {
        const inputs = [];
        const outputs = [];

        for (let i = 0; i < samples; i++) {
            const input = [
                Math.random(),
                Math.random(),
                Math.random(),
                Math.random()
            ];

            // Simple logic: if sum > 2, output [1,0], else [0,1]
            const sum = input.reduce((a, b) => a + b, 0);
            const output = sum > 2 ? [1, 0] : [0, 1];

            inputs.push(input);
            outputs.push(output);
        }

        return { inputs, outputs };
    }

    predict(input) {
        if (!this.model || input.length !== 4) return null;

        try {
            let prediction;
            
            if (typeof tf !== 'undefined') {
                const inputTensor = tf.tensor2d([input]);
                prediction = this.model.predict(inputTensor);
                const result = prediction.dataSync();
                inputTensor.dispose();
                prediction.dispose();
                return Array.from(result);
            } else {
                prediction = this.model.predict(input);
                return prediction.dataSync();
            }
        } catch (error) {
            console.error('Prediction failed:', error);
            return null;
        }
    }

    getTrainingHistory() {
        return this.trainingHistory;
    }

    isModelTraining() {
        return this.isTraining;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NeuralNetworkVisualizer, TensorFlowDemo };
} else {
    window.NeuralNetworkVisualizer = NeuralNetworkVisualizer;
    window.TensorFlowDemo = TensorFlowDemo;
}