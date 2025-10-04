/**
 * Advanced WebGL Shader System
 * Features: GPU-accelerated effects, real-time rendering, multiple shader programs
 */

class ShaderProgram {
    constructor(gl, vertexSource, fragmentSource) {
        this.gl = gl;
        this.program = this.createProgram(vertexSource, fragmentSource);
        this.uniforms = {};
        this.attributes = {};
        this.textures = [];
        
        if (this.program) {
            this.getUniforms();
            this.getAttributes();
        }
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        if (!vertexShader || !fragmentShader) return null;
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
        return program;
    }

    getUniforms() {
        const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; i++) {
            const uniformInfo = this.gl.getActiveUniform(this.program, i);
            const location = this.gl.getUniformLocation(this.program, uniformInfo.name);
            this.uniforms[uniformInfo.name] = location;
        }
    }

    getAttributes() {
        const numAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttributes; i++) {
            const attributeInfo = this.gl.getActiveAttrib(this.program, i);
            const location = this.gl.getAttribLocation(this.program, attributeInfo.name);
            this.attributes[attributeInfo.name] = location;
        }
    }

    use() {
        this.gl.useProgram(this.program);
    }

    setUniform1f(name, value) {
        if (this.uniforms[name] !== undefined) {
            this.gl.uniform1f(this.uniforms[name], value);
        }
    }

    setUniform2f(name, x, y) {
        if (this.uniforms[name] !== undefined) {
            this.gl.uniform2f(this.uniforms[name], x, y);
        }
    }

    setUniform3f(name, x, y, z) {
        if (this.uniforms[name] !== undefined) {
            this.gl.uniform3f(this.uniforms[name], x, y, z);
        }
    }

    setUniform4f(name, x, y, z, w) {
        if (this.uniforms[name] !== undefined) {
            this.gl.uniform4f(this.uniforms[name], x, y, z, w);
        }
    }

    setUniformMatrix4fv(name, matrix) {
        if (this.uniforms[name] !== undefined) {
            this.gl.uniformMatrix4fv(this.uniforms[name], false, matrix);
        }
    }

    bindTexture(name, texture, unit = 0) {
        if (this.uniforms[name] !== undefined) {
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.uniform1i(this.uniforms[name], unit);
        }
    }
}

class WebGLRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (!this.gl) {
            throw new Error('WebGL not supported');
        }
        
        this.programs = new Map();
        this.buffers = new Map();
        this.textures = new Map();
        this.frameBuffers = new Map();
        
        this.time = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
        
        this.init();
        this.createDefaultShaders();
        this.setupGeometry();
    }

    init() {
        const gl = this.gl;
        
        // Enable blending for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // Set viewport
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }

    createDefaultShaders() {
        // Basic vertex shader
        const basicVertexShader = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            
            varying vec2 v_texCoord;
            varying vec2 v_position;
            
            void main() {
                v_texCoord = a_texCoord;
                v_position = a_position;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        // Plasma shader
        const plasmaFragmentShader = `
            precision mediump float;
            
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform float u_intensity;
            
            varying vec2 v_texCoord;
            
            void main() {
                vec2 uv = v_texCoord;
                vec2 center = vec2(0.5, 0.5);
                
                float time = u_time * 0.001;
                
                // Multiple sine waves for plasma effect
                float plasma = 0.0;
                plasma += sin((uv.x * 10.0 + time) * 2.0);
                plasma += sin((uv.y * 10.0 + time) * 1.5);
                plasma += sin(((uv.x + uv.y) * 10.0 + time) * 1.0);
                plasma += sin((sqrt(uv.x * uv.x + uv.y * uv.y) * 10.0 + time) * 2.5);
                
                plasma *= 0.25;
                
                // Color mapping
                vec3 color = vec3(
                    sin(plasma + time) * 0.5 + 0.5,
                    sin(plasma + time + 2.0) * 0.5 + 0.5,
                    sin(plasma + time + 4.0) * 0.5 + 0.5
                );
                
                gl_FragColor = vec4(color * u_intensity, 0.8);
            }
        `;

        // Fire shader
        const fireFragmentShader = `
            precision mediump float;
            
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform float u_intensity;
            
            varying vec2 v_texCoord;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 0.0;
                
                for (int i = 0; i < 5; i++) {
                    value += amplitude * noise(p);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }
            
            void main() {
                vec2 uv = v_texCoord;
                float time = u_time * 0.001;
                
                // Fire shape
                float fire = fbm(vec2(uv.x * 3.0, uv.y * 6.0 - time * 2.0));
                fire += fbm(vec2(uv.x * 6.0, uv.y * 12.0 - time * 4.0)) * 0.5;
                
                // Fire gradient from bottom to top
                fire *= 1.0 - uv.y;
                fire = pow(fire, 2.0);
                
                // Color gradient (red to yellow to white)
                vec3 color = vec3(1.0, fire * 0.8, fire * 0.3);
                color = mix(vec3(1.0, 0.2, 0.0), color, fire);
                
                gl_FragColor = vec4(color * u_intensity, fire);
            }
        `;

        // Water shader
        const waterFragmentShader = `
            precision mediump float;
            
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform float u_intensity;
            
            varying vec2 v_texCoord;
            
            void main() {
                vec2 uv = v_texCoord;
                float time = u_time * 0.001;
                
                // Water waves
                float wave1 = sin(uv.x * 20.0 + time * 3.0) * 0.1;
                float wave2 = sin(uv.y * 15.0 + time * 2.0) * 0.1;
                float wave3 = sin((uv.x + uv.y) * 10.0 + time * 4.0) * 0.05;
                
                vec2 distortion = vec2(wave1 + wave3, wave2 + wave3);
                vec2 distortedUV = uv + distortion;
                
                // Water color with depth
                float depth = length(distortedUV - vec2(0.5)) * 2.0;
                vec3 shallowColor = vec3(0.0, 0.8, 1.0);
                vec3 deepColor = vec3(0.0, 0.3, 0.8);
                vec3 color = mix(shallowColor, deepColor, depth);
                
                // Foam/highlights
                float foam = smoothstep(0.7, 1.0, sin(distortedUV.x * 30.0) * sin(distortedUV.y * 30.0));
                color = mix(color, vec3(1.0), foam * 0.5);
                
                gl_FragColor = vec4(color * u_intensity, 0.7);
            }
        `;

        // Electric shader
        const electricFragmentShader = `
            precision mediump float;
            
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform float u_intensity;
            
            varying vec2 v_texCoord;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main() {
                vec2 uv = v_texCoord;
                float time = u_time * 0.001;
                
                // Lightning bolts
                float electric = 0.0;
                
                for (int i = 0; i < 5; i++) {
                    float offset = float(i) * 0.2;
                    vec2 p = vec2(uv.x + sin(time + offset) * 0.1, uv.y);
                    
                    float bolt = 1.0 / abs(p.y - 0.5 + sin(p.x * 10.0 + time * 5.0) * 0.2);
                    bolt *= random(vec2(floor(time * 10.0), float(i)));
                    
                    electric += bolt * 0.01;
                }
                
                // Electric field
                float field = sin(uv.x * 30.0 + time * 10.0) * sin(uv.y * 30.0 + time * 8.0);
                field = abs(field) * 0.1;
                
                electric += field;
                
                // Electric blue/white color
                vec3 color = vec3(0.5, 0.8, 1.0) * electric + vec3(1.0) * electric * 0.5;
                
                gl_FragColor = vec4(color * u_intensity, electric);
            }
        `;

        // Create shader programs
        this.programs.set('plasma', new ShaderProgram(this.gl, basicVertexShader, plasmaFragmentShader));
        this.programs.set('fire', new ShaderProgram(this.gl, basicVertexShader, fireFragmentShader));
        this.programs.set('water', new ShaderProgram(this.gl, basicVertexShader, waterFragmentShader));
        this.programs.set('electric', new ShaderProgram(this.gl, basicVertexShader, electricFragmentShader));
    }

    setupGeometry() {
        const gl = this.gl;
        
        // Full-screen quad
        const vertices = new Float32Array([
            -1.0, -1.0, 0.0, 0.0,
             1.0, -1.0, 1.0, 0.0,
            -1.0,  1.0, 0.0, 1.0,
             1.0,  1.0, 1.0, 1.0
        ]);
        
        const indices = new Uint16Array([
            0, 1, 2,
            1, 3, 2
        ]);
        
        // Vertex buffer
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        this.buffers.set('vertices', vertexBuffer);
        
        // Index buffer
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        this.buffers.set('indices', indexBuffer);
    }

    render(shaderName, uniforms = {}) {
        const gl = this.gl;
        const program = this.programs.get(shaderName);
        
        if (!program || !program.program) return;
        
        // Use shader program
        program.use();
        
        // Bind geometry
        const vertexBuffer = this.buffers.get('vertices');
        const indexBuffer = this.buffers.get('indices');
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        // Setup attributes
        if (program.attributes['a_position'] !== undefined) {
            gl.enableVertexAttribArray(program.attributes['a_position']);
            gl.vertexAttribPointer(program.attributes['a_position'], 2, gl.FLOAT, false, 16, 0);
        }
        
        if (program.attributes['a_texCoord'] !== undefined) {
            gl.enableVertexAttribArray(program.attributes['a_texCoord']);
            gl.vertexAttribPointer(program.attributes['a_texCoord'], 2, gl.FLOAT, false, 16, 8);
        }
        
        // Set default uniforms
        program.setUniform1f('u_time', this.time);
        program.setUniform2f('u_resolution', this.canvas.width, this.canvas.height);
        program.setUniform1f('u_intensity', 1.0);
        
        // Set custom uniforms
        Object.entries(uniforms).forEach(([name, value]) => {
            if (Array.isArray(value)) {
                switch (value.length) {
                    case 2: program.setUniform2f(name, value[0], value[1]); break;
                    case 3: program.setUniform3f(name, value[0], value[1], value[2]); break;
                    case 4: program.setUniform4f(name, value[0], value[1], value[2], value[3]); break;
                }
            } else {
                program.setUniform1f(name, value);
            }
        });
        
        // Draw
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    clear(r = 0, g = 0, b = 0, a = 1) {
        const gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    update(currentTime) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.time = currentTime;
    }

    getStats() {
        return {
            programs: this.programs.size,
            buffers: this.buffers.size,
            textures: this.textures.size,
            time: this.time,
            deltaTime: this.deltaTime
        };
    }
}

class ShaderEffect {
    constructor(renderer) {
        this.renderer = renderer;
        this.effects = new Map();
        this.activeEffects = [];
        this.blendModes = {
            normal: [renderer.gl.SRC_ALPHA, renderer.gl.ONE_MINUS_SRC_ALPHA],
            additive: [renderer.gl.SRC_ALPHA, renderer.gl.ONE],
            multiply: [renderer.gl.DST_COLOR, renderer.gl.ZERO],
            screen: [renderer.gl.ONE_MINUS_DST_COLOR, renderer.gl.ONE]
        };
    }

    addEffect(name, shaderName, config = {}) {
        this.effects.set(name, {
            shader: shaderName,
            uniforms: config.uniforms || {},
            blendMode: config.blendMode || 'normal',
            intensity: config.intensity || 1.0,
            active: config.active !== false
        });
    }

    setEffectIntensity(name, intensity) {
        const effect = this.effects.get(name);
        if (effect) {
            effect.intensity = intensity;
        }
    }

    toggleEffect(name) {
        const effect = this.effects.get(name);
        if (effect) {
            effect.active = !effect.active;
        }
    }

    render() {
        const gl = this.renderer.gl;
        
        this.renderer.clear(0, 0, 0, 0);
        
        this.effects.forEach((effect, name) => {
            if (!effect.active) return;
            
            // Set blend mode
            const blendMode = this.blendModes[effect.blendMode] || this.blendModes.normal;
            gl.blendFunc(blendMode[0], blendMode[1]);
            
            // Render effect with intensity
            const uniforms = {
                ...effect.uniforms,
                u_intensity: effect.intensity
            };
            
            this.renderer.render(effect.shader, uniforms);
        });
        
        // Reset to default blend mode
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    getActiveEffects() {
        const active = [];
        this.effects.forEach((effect, name) => {
            if (effect.active) active.push(name);
        });
        return active;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WebGLRenderer, ShaderProgram, ShaderEffect };
} else {
    window.WebGLRenderer = WebGLRenderer;
    window.ShaderProgram = ShaderProgram;
    window.ShaderEffect = ShaderEffect;
}