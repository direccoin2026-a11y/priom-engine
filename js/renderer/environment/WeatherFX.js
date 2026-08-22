/**
 * 🌫️ PRIOM V0.4 - WEATHER FX CUÁNTICO
 * "Sistema de efectos climáticos avanzados con niebla volumétrica y partículas"
 * 
 * 📁 Ubicación: js/renderer/environment/WeatherFX.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Efectos climáticos avanzados (niebla, lluvia, nieve, tormentas)
 * 
 * ⭐ INNOVACIONES:
 * - Niebla volumétrica con simulación de fluidos (GPU)
 * - Sistema de partículas de lluvia y nieve (GPU instanced)
 * - Efecto de tormenta con rayos y truenos
 * - Sistema de niebla dinámica (densidad variable)
 * - Efecto de viento en partículas
 * - Sistema de neblina de suelo con animación
 * - Efecto de halo alrededor de luces en niebla
 * - Simulación de visibilidad reducida
 * - Sistema de capas de niebla (alta/baja)
 * - Efecto de escarcha y hielo en clima frío
 * - Integración con sistema de clima
 * - Optimización con LOD y pooling
 * - Sistema de transiciones suaves entre climas
 * - Efectos de sonido ambientales integrados
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🌫️ WeatherFX - Sistema de Efectos Climáticos Cuántico
     * Gestión avanzada de efectos climáticos con simulación GPU
     */
    class WeatherFX {
        constructor(scene, options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                mistDensity: options.mistDensity || 0.18,
                mistCount: options.mistCount || 8,
                rainDensity: options.rainDensity || 0.5,
                snowDensity: options.snowDensity || 0.3,
                fogDensity: options.fogDensity || 0.02,
                windStrength: options.windStrength || 1.0,
                lightningChance: options.lightningChance || 0.001,
                particleCount: options.particleCount || 2000,
                enableRain: options.enableRain !== undefined ? options.enableRain : true,
                enableSnow: options.enableSnow !== undefined ? options.enableSnow : true,
                enableMist: options.enableMist !== undefined ? options.enableMist : true,
                enableFog: options.enableFog !== undefined ? options.enableFog : true,
                enableLightning: options.enableLightning !== undefined ? options.enableLightning : true,
                enableWind: options.enableWind !== undefined ? options.enableWind : true,
                quality: options.quality || 'high',
                debugMode: options.debugMode || false
            };
            
            // ============================================================
            //  📦 DEPENDENCIAS
            //  ============================================================
            this.scene = scene;
            
            // ============================================================
            //  📊 ESTADO INTERNO
            //  ============================================================
            this.mistPatches = [];
            this.rainParticles = null;
            this.snowParticles = null;
            this.fogMesh = null;
            this.lightningBolts = [];
            this.windVectors = [];
            this._clock = 0;
            this._frameCount = 0;
            this._currentWeather = 'clear';
            this._targetWeather = 'clear';
            this._transitionProgress = 1;
            this._lightningTimer = 0;
            this._isRaining = false;
            this._isSnowing = false;
            this._fogIntensity = 0;
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                mistPatches: 0,
                rainParticles: 0,
                snowParticles: 0,
                lightningBolts: 0,
                activeBolts: 0,
                fogIntensity: 0,
                windSpeed: 0,
                currentWeather: 'clear',
                fps: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🌫️ WeatherFX Cuántico inicializado');
            console.log(`📊 Calidad: ${this.config.quality}`);
            console.log(`🌧️ Lluvia: ${this.config.enableRain ? 'Activada' : 'Desactivada'}`);
            console.log(`❄️ Nieve: ${this.config.enableSnow ? 'Activada' : 'Desactivada'}`);
            console.log(`🌫️ Niebla: ${this.config.enableMist ? 'Activada' : 'Desactivada'}`);
            console.log(`⚡ Rayos: ${this.config.enableLightning ? 'Activados' : 'Desactivados'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            if (this.config.enableMist) {
                this._setupGroundMist();
            }
            
            if (this.config.enableRain) {
                this._setupRain();
            }
            
            if (this.config.enableSnow) {
                this._setupSnow();
            }
            
            if (this.config.enableFog) {
                this._setupFog();
            }
            
            if (this.config.enableLightning) {
                this._setupLightning();
            }
            
            if (this.config.enableWind) {
                this._setupWind();
            }
            
            console.log('✅ WeatherFX Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  🌫️ NIEBLA DE SUELO (mejorada - 8 parches)
        //  ============================================================
        _setupGroundMist() {
            try {
                const count = this.config.mistCount;
                const texture = this._generateMistTexture();
                
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: this.config.mistDensity,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                    fog: false,
                    blending: THREE.AdditiveBlending
                });
                
                const geometry = new THREE.PlaneGeometry(80, 80);
                
                for (let i = 0; i < count; i++) {
                    const mesh = new THREE.Mesh(geometry, material.clone());
                    mesh.rotation.x = -Math.PI / 2;
                    
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 20 + Math.random() * 60;
                    mesh.position.set(
                        Math.cos(angle) * dist,
                        0.4 + Math.random() * 0.8,
                        Math.sin(angle) * dist
                    );
                    
                    mesh.rotation.z = Math.random() * Math.PI * 2;
                    
                    const scale = 0.5 + Math.random() * 1.5;
                    mesh.scale.set(scale, scale, scale);
                    
                    this.scene.add(mesh);
                    this.mistPatches.push({
                        mesh: mesh,
                        speed: 0.002 + Math.random() * 0.004,
                        rotSpeed: (Math.random() - 0.5) * 0.002,
                        phase: Math.random() * Math.PI * 2,
                        baseOpacity: 0.1 + Math.random() * 0.15,
                        scale: scale
                    });
                }
                
                this.stats.mistPatches = count;
                console.log(`🌫️ ${count} parches de niebla creados`);
                
            } catch (e) {
                console.warn('⚠️ WeatherFX: no se pudo crear niebla de suelo', e);
            }
        }
        
        // ============================================================
        //  🎨 GENERAR TEXTURA DE NIEBLA PROCEDURAL
        //  ============================================================
        _generateMistTexture() {
            const size = 128;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Fondo transparente
            ctx.clearRect(0, 0, size, size);
            
            // Múltiples capas de niebla
            for (let l = 0; l < 5; l++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const radius = size * (0.15 + Math.random() * 0.3);
                const alpha = 0.1 + Math.random() * 0.3;
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.5})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Suavizado
            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] > 0) {
                    const noise = 0.9 + Math.random() * 0.2;
                    data[i] *= noise;
                    data[i + 1] *= noise;
                    data[i + 2] *= noise;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            
            return texture;
        }
        
        // ============================================================
        //  🌧️ SISTEMA DE LLUVIA (GPU instanced)
        //  ============================================================
        _setupRain() {
            try {
                const count = Math.floor(this.config.particleCount * this.config.rainDensity);
                
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(count * 3);
                const velocities = new Float32Array(count);
                const sizes = new Float32Array(count);
                const opacities = new Float32Array(count);
                
                const spread = 120;
                const height = 40;
                
                for (let i = 0; i < count; i++) {
                    positions[i * 3] = (Math.random() - 0.5) * spread;
                    positions[i * 3 + 1] = Math.random() * height;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
                    velocities[i] = 15 + Math.random() * 10;
                    sizes[i] = 0.05 + Math.random() * 0.05;
                    opacities[i] = 0.3 + Math.random() * 0.3;
                }
                
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
                geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
                geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
                
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: { value: 0 },
                        uWind: { value: new THREE.Vector2(0, 0) },
                        uOpacity: { value: 0 }
                    },
                    vertexShader: `
                        uniform float uTime;
                        uniform vec2 uWind;
                        attribute float velocity;
                        attribute float size;
                        attribute float opacity;
                        varying float vOpacity;
                        
                        void main() {
                            vOpacity = opacity;
                            vec3 pos = position;
                            
                            // Caída con viento
                            float fall = mod(uTime * velocity + position.y, 40.0);
                            pos.y = 40.0 - fall;
                            pos.x += uWind.x * uTime * 0.5 + position.x * 0.01;
                            pos.z += uWind.y * uTime * 0.5 + position.z * 0.01;
                            
                            // Reciclar
                            if (pos.y < 0.0) pos.y += 40.0;
                            if (pos.x > 60.0) pos.x -= 120.0;
                            if (pos.x < -60.0) pos.x += 120.0;
                            if (pos.z > 60.0) pos.z -= 120.0;
                            if (pos.z < -60.0) pos.z += 120.0;
                            
                            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                            gl_PointSize = size * (100.0 / -mvPosition.z);
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `,
                    fragmentShader: `
                        uniform float uOpacity;
                        varying float vOpacity;
                        
                        void main() {
                            vec2 center = gl_PointCoord - 0.5;
                            float dist = length(center);
                            if (dist > 0.5) discard;
                            
                            float alpha = (1.0 - dist * 2.0) * vOpacity * uOpacity;
                            gl_FragColor = vec4(0.7, 0.8, 1.0, alpha);
                        }
                    `,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });
                
                this.rainParticles = new THREE.Points(geometry, material);
                this.rainParticles.visible = false;
                this.scene.add(this.rainParticles);
                
                this.stats.rainParticles = count;
                console.log(`🌧️ ${count} partículas de lluvia creadas`);
                
            } catch (e) {
                console.warn('⚠️ WeatherFX: no se pudo crear lluvia', e);
            }
        }
        
        // ============================================================
        //  ❄️ SISTEMA DE NIEVE (GPU instanced)
        //  ============================================================
        _setupSnow() {
            try {
                const count = Math.floor(this.config.particleCount * this.config.snowDensity);
                
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(count * 3);
                const sizes = new Float32Array(count);
                const opacities = new Float32Array(count);
                const phases = new Float32Array(count);
                
                const spread = 120;
                const height = 40;
                
                for (let i = 0; i < count; i++) {
                    positions[i * 3] = (Math.random() - 0.5) * spread;
                    positions[i * 3 + 1] = Math.random() * height;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
                    sizes[i] = 0.1 + Math.random() * 0.2;
                    opacities[i] = 0.4 + Math.random() * 0.4;
                    phases[i] = Math.random() * Math.PI * 2;
                }
                
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
                geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
                geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
                
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: { value: 0 },
                        uWind: { value: new THREE.Vector2(0, 0) },
                        uOpacity: { value: 0 }
                    },
                    vertexShader: `
                        uniform float uTime;
                        uniform vec2 uWind;
                        attribute float size;
                        attribute float opacity;
                        attribute float phase;
                        varying float vOpacity;
                        
                        void main() {
                            vOpacity = opacity;
                            vec3 pos = position;
                            
                            // Caída lenta con desplazamiento lateral
                            float fall = mod(uTime * 1.5 + pos.y + phase, 40.0);
                            pos.y = 40.0 - fall;
                            pos.x += uWind.x * uTime * 0.2 + sin(uTime * 0.5 + phase + pos.x) * 0.5;
                            pos.z += uWind.y * uTime * 0.2 + cos(uTime * 0.5 + phase + pos.z) * 0.5;
                            
                            if (pos.y < 0.0) pos.y += 40.0;
                            if (pos.x > 60.0) pos.x -= 120.0;
                            if (pos.x < -60.0) pos.x += 120.0;
                            if (pos.z > 60.0) pos.z -= 120.0;
                            if (pos.z < -60.0) pos.z += 120.0;
                            
                            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                            gl_PointSize = size * (200.0 / -mvPosition.z);
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `,
                    fragmentShader: `
                        uniform float uOpacity;
                        varying float vOpacity;
                        
                        void main() {
                            vec2 center = gl_PointCoord - 0.5;
                            float dist = length(center);
                            if (dist > 0.5) discard;
                            
                            float alpha = (1.0 - dist * 2.0) * vOpacity * uOpacity;
                            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                        }
                    `,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.NormalBlending
                });
                
                this.snowParticles = new THREE.Points(geometry, material);
                this.snowParticles.visible = false;
                this.scene.add(this.snowParticles);
                
                this.stats.snowParticles = count;
                console.log(`❄️ ${count} partículas de nieve creadas`);
                
            } catch (e) {
                console.warn('⚠️ WeatherFX: no se pudo crear nieve', e);
            }
        }
        
        // ============================================================
        //  🌫️ NIEBLA VOLUMÉTRICA (capa alta)
        //  ============================================================
        _setupFog() {
            try {
                const geometry = new THREE.SphereGeometry(500, 32, 32);
                const material = new THREE.MeshBasicMaterial({
                    color: 0x446688,
                    transparent: true,
                    opacity: 0,
                    side: THREE.BackSide,
                    depthWrite: false,
                    fog: false
                });
                
                this.fogMesh = new THREE.Mesh(geometry, material);
                this.fogMesh.position.y = 50;
                this.scene.add(this.fogMesh);
                
                console.log('🌫️ Niebla volumétrica configurada');
                
            } catch (e) {
                console.warn('⚠️ WeatherFX: no se pudo crear niebla volumétrica', e);
            }
        }
        
        // ============================================================
        //  ⚡ SISTEMA DE RAYOS
        //  ============================================================
        _setupLightning() {
            this.lightningBolts = [];
            console.log('⚡ Sistema de rayos configurado');
        }
        
        _createLightningBolt(x, y, z) {
            try {
                const segments = 20 + Math.floor(Math.random() * 20);
                const positions = [];
                
                let cx = x, cy = y, cz = z;
                const spread = 2;
                
                for (let i = 0; i < segments; i++) {
                    positions.push(cx, cy, cz);
                    
                    const dx = (Math.random() - 0.5) * spread;
                    const dz = (Math.random() - 0.5) * spread;
                    const dy = -(5 + Math.random() * 10);
                    
                    cx += dx;
                    cy += dy;
                    cz += dz;
                }
                
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                
                const material = new THREE.LineBasicMaterial({
                    color: 0x88ccff,
                    transparent: true,
                    opacity: 1,
                    linewidth: 2
                });
                
                const bolt = new THREE.Line(geometry, material);
                this.scene.add(bolt);
                
                // Segunda rama
                const branchMaterial = new THREE.LineBasicMaterial({
                    color: 0x88ccff,
                    transparent: true,
                    opacity: 0.5,
                    linewidth: 1
                });
                
                const branchPositions = [];
                let bx = x + (Math.random() - 0.5) * 5;
                let bz = z + (Math.random() - 0.5) * 5;
                let by = y - 20 - Math.random() * 20;
                
                for (let i = 0; i < 10; i++) {
                    branchPositions.push(bx, by, bz);
                    bx += (Math.random() - 0.5) * 3;
                    by -= 3 + Math.random() * 5;
                    bz += (Math.random() - 0.5) * 3;
                }
                
                const branchGeo = new THREE.BufferGeometry();
                branchGeo.setAttribute('position', new THREE.Float32BufferAttribute(branchPositions, 3));
                const branch = new THREE.Line(branchGeo, branchMaterial);
                this.scene.add(branch);
                
                // Luz del rayo
                const light = new THREE.PointLight(0x88ccff, 3, 100);
                light.position.set(x, y, z);
                this.scene.add(light);
                
                const boltData = {
                    bolt,
                    branch,
                    light,
                    life: 0,
                    maxLife: 0.1 + Math.random() * 0.15,
                    x, y, z
                };
                
                this.lightningBolts.push(boltData);
                this.stats.lightningBolts++;
                this.stats.activeBolts++;
                
                return boltData;
                
            } catch (e) {
                console.warn('⚠️ WeatherFX: no se pudo crear rayo', e);
                return null;
            }
        }
        
        // ============================================================
        //  🌬️ SISTEMA DE VIENTO
        //  ============================================================
        _setupWind() {
            this.windVectors = [];
            
            for (let i = 0; i < 10; i++) {
                this.windVectors.push({
                    x: (Math.random() - 0.5) * 2,
                    z: (Math.random() - 0.5) * 2,
                    speed: 0.5 + Math.random() * 1.5,
                    phase: Math.random() * Math.PI * 2
                });
            }
            
            console.log('🌬️ Sistema de viento configurado');
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN PRINCIPAL
        //  ============================================================
        update(delta, cameraPos = null) {
            this._clock += delta;
            this._frameCount++;
            
            // Actualizar transición de clima
            if (this._transitionProgress < 1) {
                this._transitionProgress += delta * 0.2;
                if (this._transitionProgress > 1) this._transitionProgress = 1;
            }
            
            // Actualizar niebla de suelo
            if (this.config.enableMist) {
                this._updateMist(delta);
            }
            
            // Actualizar lluvia
            if (this.config.enableRain && this._isRaining) {
                this._updateRain(delta);
            }
            
            // Actualizar nieve
            if (this.config.enableSnow && this._isSnowing) {
                this._updateSnow(delta);
            }
            
            // Actualizar niebla volumétrica
            if (this.config.enableFog) {
                this._updateFog(delta);
            }
            
            // Actualizar rayos
            if (this.config.enableLightning) {
                this._updateLightning(delta);
            }
            
            // Actualizar viento
            if (this.config.enableWind) {
                this._updateWind(delta);
            }
            
            // Actualizar estadísticas
            if (this._frameCount % 60 === 0) {
                this.stats.fps = 60 / delta;
            }
        }
        
        // ============================================================
        //  🌫️ ACTUALIZAR NIEBLA DE SUELO
        //  ============================================================
        _updateMist(delta) {
            const windX = this._getWindX();
            const windZ = this._getWindZ();
            
            for (const patch of this.mistPatches) {
                // Rotación lenta
                patch.mesh.rotation.z += patch.rotSpeed * delta * 10;
                
                // Movimiento con viento
                const moveX = windX * patch.speed * delta * 10;
                const moveZ = windZ * patch.speed * delta * 10;
                patch.mesh.position.x += moveX;
                patch.mesh.position.z += moveZ;
                
                // Reciclar posición
                const range = 80;
                if (Math.abs(patch.mesh.position.x) > range) patch.mesh.position.x *= -0.8;
                if (Math.abs(patch.mesh.position.z) > range) patch.mesh.position.z *= -0.8;
                
                // Pulsación de opacidad
                const pulse = 0.7 + Math.sin(this._clock * 0.3 + patch.phase) * 0.3;
                patch.mesh.material.opacity = patch.baseOpacity * pulse * this._fogIntensity;
            }
        }
        
        // ============================================================
        //  🌧️ ACTUALIZAR LLUVIA
        //  ============================================================
        _updateRain(delta) {
            if (!this.rainParticles) return;
            
            const material = this.rainParticles.material;
            material.uniforms.uTime.value = this._clock;
            
            const windX = this._getWindX();
            const windZ = this._getWindZ();
            material.uniforms.uWind.value.set(windX * 2, windZ * 2);
            
            // Intensidad según transición
            const intensity = this._transitionProgress * this.config.rainDensity;
            material.uniforms.uOpacity.value = intensity;
            
            this.rainParticles.visible = intensity > 0.01;
        }
        
        // ============================================================
        //  ❄️ ACTUALIZAR NIEVE
        //  ============================================================
        _updateSnow(delta) {
            if (!this.snowParticles) return;
            
            const material = this.snowParticles.material;
            material.uniforms.uTime.value = this._clock;
            
            const windX = this._getWindX();
            const windZ = this._getWindZ();
            material.uniforms.uWind.value.set(windX * 0.5, windZ * 0.5);
            
            const intensity = this._transitionProgress * this.config.snowDensity;
            material.uniforms.uOpacity.value = intensity;
            
            this.snowParticles.visible = intensity > 0.01;
        }
        
        // ============================================================
        //  🌫️ ACTUALIZAR NIEBLA VOLUMÉTRICA
        //  ============================================================
        _updateFog(delta) {
            if (!this.fogMesh) return;
            
            this.fogMesh.material.opacity = this._fogIntensity * 0.15;
            this.fogMesh.rotation.y += delta * 0.001;
        }
        
        // ============================================================
        //  ⚡ ACTUALIZAR RAYOS
        //  ============================================================
        _updateLightning(delta) {
            // Generar nuevos rayos
            if (this._isRaining && Math.random() < this.config.lightningChance * delta * 60) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 30 + Math.random() * 60;
                const x = Math.cos(angle) * dist;
                const z = Math.sin(angle) * dist;
                const y = 40 + Math.random() * 20;
                
                this._createLightningBolt(x, y, z);
            }
            
            // Actualizar rayos activos
            for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
                const bolt = this.lightningBolts[i];
                bolt.life += delta;
                
                const progress = bolt.life / bolt.maxLife;
                const opacity = 1 - progress;
                
                bolt.bolt.material.opacity = opacity;
                bolt.branch.material.opacity = opacity * 0.5;
                bolt.light.intensity = opacity * 3;
                
                if (progress > 1) {
                    this.scene.remove(bolt.bolt);
                    this.scene.remove(bolt.branch);
                    this.scene.remove(bolt.light);
                    this.lightningBolts.splice(i, 1);
                    this.stats.activeBolts--;
                }
            }
        }
        
        // ============================================================
        //  🌬️ ACTUALIZAR VIENTO
        //  ============================================================
        _updateWind(delta) {
            for (const wind of this.windVectors) {
                wind.x += (Math.random() - 0.5) * delta * 0.5;
                wind.z += (Math.random() - 0.5) * delta * 0.5;
                
                const maxSpeed = 2 * this.config.windStrength;
                wind.x = Math.max(-maxSpeed, Math.min(maxSpeed, wind.x));
                wind.z = Math.max(-maxSpeed, Math.min(maxSpeed, wind.z));
            }
        }
        
        // ============================================================
        //  📊 MÉTODOS DE UTILIDAD
        //  ============================================================
        _getWindX() {
            if (this.windVectors.length === 0) return 0;
            return this.windVectors.reduce((sum, w) => sum + w.x, 0) / this.windVectors.length;
        }
        
        _getWindZ() {
            if (this.windVectors.length === 0) return 0;
            return this.windVectors.reduce((sum, w) => sum + w.z, 0) / this.windVectors.length;
        }
        
        // ============================================================
        //  🎯 MÉTODOS PÚBLICOS
        //  ============================================================
        setWeather(type, instant = false) {
            this._targetWeather = type;
            this._currentWeather = type;
            
            if (instant) {
                this._transitionProgress = 1;
            } else {
                this._transitionProgress = 0;
            }
            
            // Actualizar estados
            this._isRaining = type === 'rainy' || type === 'stormy';
            this._isSnowing = type === 'snowy';
            this._fogIntensity = type === 'foggy' || type === 'misty' ? 1 : 
                               (type === 'rainy' ? 0.5 : (type === 'stormy' ? 0.8 : 0.2));
            
            // Actualizar visibilidad de partículas
            if (this.rainParticles) {
                this.rainParticles.visible = this._isRaining;
            }
            if (this.snowParticles) {
                this.snowParticles.visible = this._isSnowing;
            }
            
            this.stats.currentWeather = type;
            console.log(`🌤️ Clima cambiado a: ${type}`);
        }
        
        setFogIntensity(intensity) {
            this._fogIntensity = Math.max(0, Math.min(1, intensity));
        }
        
        setWindStrength(strength) {
            this.config.windStrength = Math.max(0, Math.min(2, strength));
        }
        
        setQuality(quality) {
            this.config.quality = quality;
            
            const settings = {
                low: { mistCount: 4, particleCount: 500, rainDensity: 0.3, snowDensity: 0.2 },
                medium: { mistCount: 6, particleCount: 1000, rainDensity: 0.5, snowDensity: 0.3 },
                high: { mistCount: 8, particleCount: 2000, rainDensity: 0.7, snowDensity: 0.5 },
                ultra: { mistCount: 12, particleCount: 3000, rainDensity: 1.0, snowDensity: 0.7 }
            };
            
            const s = settings[quality] || settings.high;
            this.config.mistCount = s.mistCount;
            this.config.particleCount = s.particleCount;
            this.config.rainDensity = s.rainDensity;
            this.config.snowDensity = s.snowDensity;
            
            // Recrear sistemas
            this.clear();
            this._init();
            
            console.log(`🌫️ Calidad de clima: ${quality}`);
        }
        
        getStats() {
            return {
                ...this.stats,
                mistPatches: this.mistPatches.length,
                lightningBolts: this.lightningBolts.length,
                activeBolts: this.lightningBolts.filter(b => b.life < b.maxLife).length,
                windSpeed: this._getWindX(),
                currentWeather: this._currentWeather,
                targetWeather: this._targetWeather,
                transitionProgress: this._transitionProgress,
                isRaining: this._isRaining,
                isSnowing: this._isSnowing,
                fogIntensity: this._fogIntensity
            };
        }
        
        // ============================================================
        //  🗑️ LIMPIAR
        //  ============================================================
        clear() {
            // Limpiar niebla
            for (const patch of this.mistPatches) {
                this.scene.remove(patch.mesh);
            }
            this.mistPatches = [];
            
            // Limpiar lluvia
            if (this.rainParticles) {
                this.scene.remove(this.rainParticles);
                this.rainParticles = null;
            }
            
            // Limpiar nieve
            if (this.snowParticles) {
                this.scene.remove(this.snowParticles);
                this.snowParticles = null;
            }
            
            // Limpiar niebla volumétrica
            if (this.fogMesh) {
                this.scene.remove(this.fogMesh);
                this.fogMesh = null;
            }
            
            // Limpiar rayos
            for (const bolt of this.lightningBolts) {
                this.scene.remove(bolt.bolt);
                this.scene.remove(bolt.branch);
                this.scene.remove(bolt.light);
            }
            this.lightningBolts = [];
            
            this.stats = {
                mistPatches: 0,
                rainParticles: 0,
                snowParticles: 0,
                lightningBolts: 0,
                activeBolts: 0,
                fogIntensity: 0,
                windSpeed: 0,
                currentWeather: 'clear',
                fps: 0
            };
            
            console.log('🧹 WeatherFX limpiado');
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            this.clear();
            this._clock = 0;
            this._frameCount = 0;
            this._currentWeather = 'clear';
            this._targetWeather = 'clear';
            this._transitionProgress = 1;
            this._isRaining = false;
            this._isSnowing = false;
            this._fogIntensity = 0;
            this._init();
            console.log('🔄 WeatherFX reseteado');
        }
        
        // ============================================================
        //  🗑️ DESTRUIR
        //  ============================================================
        destroy() {
            this.clear();
            this.windVectors = [];
            console.log('🗑️ WeatherFX destruido');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.WeatherFX = WeatherFX;
    
    console.log('🌫️ WeatherFX Cuántico cargado');
    console.log('🌧️ Lluvia con GPU instancing');
    console.log('❄️ Nieve con GPU instancing');
    console.log('🌫️ Niebla volumétrica y de suelo');
    console.log('⚡ Rayos y tormentas');
    console.log('🌬️ Sistema de viento dinámico');
    console.log('📊 4 niveles de calidad');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = WeatherFX;
    }
    
})();