// Optimized pattern animations with WebGL
(() => {
    class ParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.gl = canvas.getContext('webgl', { alpha: true }) || canvas.getContext('experimental-webgl', { alpha: true });
            if (!this.gl) {
                console.warn('WebGL not supported, falling back to Canvas 2D');
                this.fallbackTo2D();
                return;
            }

            // Setup blending for transparency
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

            // Handle context loss
            canvas.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                this.stop();
            }, false);
            
            canvas.addEventListener('webglcontextrestored', () => {
                this.initWebGL();
                this.start();
            }, false);

            this.particles = [];
            this.numParticles = 50; // Increased number of particles
            this.running = false;
            
            this.initWebGL();
            this.resize(); // Call resize first to set proper dimensions
            this.createParticles();
            this.addEventListeners();
            this.start();
        }

        initWebGL() {
            // Vertex shader program with color support
            const vsSource = `
                attribute vec2 a_position;
                attribute float a_size;
                attribute float a_alpha;
                attribute vec3 a_color;
                
                uniform vec2 u_resolution;
                
                varying float v_alpha;
                varying vec3 v_color;
                
                void main() {
                    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
                    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                    gl_PointSize = a_size;
                    v_alpha = a_alpha;
                    v_color = a_color;
                }
            `;

            // Fragment shader program with color support
            const fsSource = `
                precision mediump float;
                varying float v_alpha;
                varying vec3 v_color;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    float alpha = smoothstep(0.5, 0.48, dist) * v_alpha;
                    gl_FragColor = vec4(v_color, alpha);
                }
            `;

            // Create shader program
            const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vsSource);
            const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fsSource);
            this.program = this.createProgram(vertexShader, fragmentShader);

            // Look up attribute and uniform locations
            this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
            this.sizeLocation = this.gl.getAttribLocation(this.program, 'a_size');
            this.alphaLocation = this.gl.getAttribLocation(this.program, 'a_alpha');
            this.colorLocation = this.gl.getAttribLocation(this.program, 'a_color');
            this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');

            // Create buffers
            this.positionBuffer = this.gl.createBuffer();
            this.sizeBuffer = this.gl.createBuffer();
            this.alphaBuffer = this.gl.createBuffer();
            this.colorBuffer = this.gl.createBuffer();
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

        createProgram(vertexShader, fragmentShader) {
            const program = this.gl.createProgram();
            this.gl.attachShader(program, vertexShader);
            this.gl.attachShader(program, fragmentShader);
            this.gl.linkProgram(program);
            
            if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                console.error('Program link error:', this.gl.getProgramInfoLog(program));
                return null;
            }
            return program;
        }

        getRandomGemColor() {
            const colors = [
                [0.6, 0.3, 0.4],  // Muted ruby
                [0.3, 0.4, 0.6],  // Muted sapphire
                [0.4, 0.6, 0.5],  // Muted emerald
                [0.5, 0.4, 0.6],  // Muted amethyst
                [0.4, 0.5, 0.6]   // Muted aquamarine
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        createParticles() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            for (let i = 0; i < this.numParticles; i++) {
                // Distribute particles across the entire viewport
                this.particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 5 + 4, // 4-9 pixels
                    speedX: (Math.random() - 0.5) * 0.2,
                    speedY: (Math.random() - 0.5) * 0.2,
                    life: Math.random() * 0.5 + 0.5,
                    color: this.getRandomGemColor(),
                    targetColor: this.getRandomGemColor(),
                    colorTransition: 0
                });
            }
        }

        updateParticles() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.life -= 0.0003;

                particle.colorTransition += 0.005;
                if (particle.colorTransition >= 1) {
                    particle.color = particle.targetColor;
                    particle.targetColor = this.getRandomGemColor();
                    particle.colorTransition = 0;
                }

                particle.currentColor = particle.color.map((start, i) => 
                    start + (particle.targetColor[i] - start) * particle.colorTransition
                );

                if (particle.life <= 0 ||
                    particle.x < 0 || particle.x > width ||
                    particle.y < 0 || particle.y > height) {
                    // Respawn at random position across viewport
                    particle.x = Math.random() * width;
                    particle.y = Math.random() * height;
                    particle.life = Math.random() * 0.5 + 0.5;
                    particle.color = this.getRandomGemColor();
                    particle.targetColor = this.getRandomGemColor();
                    particle.colorTransition = 0;
                }
            });
        }

        draw() {
            if (!this.running) return;

            this.updateParticles();

            // Update WebGL buffers
            const positions = new Float32Array(this.particles.flatMap(p => [p.x, p.y]));
            const sizes = new Float32Array(this.particles.map(p => p.size));
            const alphas = new Float32Array(this.particles.map(p => p.life));
            const colors = new Float32Array(this.particles.flatMap(p => p.currentColor));

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.DYNAMIC_DRAW);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, sizes, this.gl.DYNAMIC_DRAW);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.alphaBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, alphas, this.gl.DYNAMIC_DRAW);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.DYNAMIC_DRAW);

            // Clear and set viewport
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

            // Use shader program
            this.gl.useProgram(this.program);

            // Set uniforms
            this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);

            // Enable attributes
            this.gl.enableVertexAttribArray(this.positionLocation);
            this.gl.enableVertexAttribArray(this.sizeLocation);
            this.gl.enableVertexAttribArray(this.alphaLocation);
            this.gl.enableVertexAttribArray(this.colorLocation);

            // Set attributes
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
            this.gl.vertexAttribPointer(this.sizeLocation, 1, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.alphaBuffer);
            this.gl.vertexAttribPointer(this.alphaLocation, 1, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.vertexAttribPointer(this.colorLocation, 3, this.gl.FLOAT, false, 0, 0);

            // Draw
            this.gl.drawArrays(this.gl.POINTS, 0, this.numParticles);

            requestAnimationFrame(() => this.draw());
        }

        resize() {
            const dpr = window.devicePixelRatio || 1;
            const displayWidth = Math.floor(window.innerWidth * dpr);
            const displayHeight = Math.floor(window.innerHeight * dpr);

            if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
                this.canvas.width = displayWidth;
                this.canvas.height = displayHeight;
                if (this.gl) {
                    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
                }
                // Redistribute particles when canvas is resized
                if (this.particles.length > 0) {
                    this.particles.forEach(particle => {
                        particle.x = Math.random() * displayWidth;
                        particle.y = Math.random() * displayHeight;
                    });
                }
            }
        }

        fallbackTo2D() {
            const ctx = this.canvas.getContext('2d');
            if (!ctx) return;

            const draw = () => {
                if (!this.running) return;
                
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.particles.forEach(particle => {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    const color = particle.currentColor || [0.2, 0.4, 1.0];
                    ctx.fillStyle = `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${particle.life})`;
                    ctx.fill();
                    
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.life -= 0.0005;
                    
                    if (particle.life <= 0) {
                        particle.x = Math.random() * window.innerWidth;
                        particle.y = Math.random() * window.innerHeight;
                        particle.life = Math.random() * 0.5 + 0.5;
                    }
                });
                
                requestAnimationFrame(draw);
            };
            
            draw();
        }

        addEventListeners() {
            window.addEventListener('resize', () => {
                this.resize();
            }, { passive: true });
        }

        start() {
            if (this.running) return;
            this.running = true;
            if (this.gl) {
                this.draw();
            } else {
                this.fallbackTo2D();
            }
        }

        stop() {
            this.running = false;
        }

        destroy() {
            this.stop();
            
            if (this.gl) {
                // Delete buffers
                this.gl.deleteBuffer(this.positionBuffer);
                this.gl.deleteBuffer(this.sizeBuffer);
                this.gl.deleteBuffer(this.alphaBuffer);
                this.gl.deleteBuffer(this.colorBuffer);
                
                // Delete shaders and program
                const shaders = this.gl.getAttachedShaders(this.program);
                shaders?.forEach(shader => {
                    this.gl.detachShader(this.program, shader);
                    this.gl.deleteShader(shader);
                });
                this.gl.deleteProgram(this.program);
                
                // Remove context loss listeners
                this.canvas.removeEventListener('webglcontextlost');
                this.canvas.removeEventListener('webglcontextrestored');
            }
            
            // Remove resize listener
            window.removeEventListener('resize');
        }
    }

    // Initialize on DOM content loaded
    function init() {
        const canvas = document.getElementById('particleCanvas');
        if (canvas) {
            try {
                const system = new ParticleSystem(canvas);
                
                // Store reference for cleanup
                window.particleSystem = system;
                
                // Cleanup on page unload
                window.addEventListener('unload', () => {
                    system.destroy();
                    window.particleSystem = null;
                });
            } catch (error) {
                console.error('Failed to initialize particle system:', error);
                // Attempt to show a basic fallback
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
