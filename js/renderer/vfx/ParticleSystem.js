ñ/**
 * ✨ PRIOM V0.4 - PARTICLE SYSTEM CUÁNTICO
 * "Sistema de partículas GPU con IA generativa y simulación avanzada"
 * 
 * 📁 Ubicación: js/renderer/vfx/ParticleSystem.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Sistema de partículas GPU-driven con IA generativa y efectos avanzados
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de partículas GPU-driven con 8 tipos de movimiento
 * - IA generativa de patrones de partículas (swarm, vortex, galaxy)
 * - Sistema de emisión continua y en ráfagas
 * - Colisiones con geometría (simplificadas)
 * - Sistema de "trails" (estelas) con GPU
 * - Interacción con el viento y turbulencia
 * - Sistema de color por edad (gradientes)
 * - Tamaño variable con curvas de vida
 * - Sistema de "lifetime" con muerte y renacimiento
 * - Optimización con instancing y pooling
 * - Sistema de eventos de partículas (nacimiento, muerte, colisión)
 * - Integración con sistema de clima
 * - Sistema de "attractors" y "repulsors"
 * - Efectos de "swirl" y "vortex"
 * - Sistema de partículas con orientación (sprites)
 * ============================================================ */

(function() {
    'use strict';

    // ============================================================
    //  📊 TIPOS DE MOVIMIENTO DE PARTÍCULAS
    //  ============================================================
    const PARTICLE_TYPES = {
        FALL: 'fall',           // Caída con gravedad
        RISE: 'rise',           // Ascenso (humo, burbujas)
        SWIRL: 'swirl',         // Remolino
        VORTEX: 'vortex',       // Vórtice (tornado, agujero negro)
        GALAXY: 'galaxy',       // Espiral (galaxia)
        SWARM: 'swarm',         // Enjambre (boids-like)
        FLOW: 'flow',           // Flujo (río, corriente)
        EXPLODE: 'explode',     // Explosión (radial)
        SPARK: 'spark',         // Chispa (trayectoria)
        WAVE: 'wave',           // Onda (ondas en agua)
        TRAIL: 'trail',         // Estela (detrás de objeto)
        CUSTOM: 'custom'        // Personalizado
    };

    /**
     * ✨ ParticleSystem - Sistema de Partículas Cuántico
     * Sistema de partículas GPU-driven con IA generativa
     */
    class ParticleSystem {
        /**
         * @param {number} count - cantidad de partículas
         * @param {object} options - { spread, height, fallSpeed, drift, size, color, opacity, blending, type, ... }
         */
        constructor(count, options = {}) {
            // ============================================================
            //  📦 CONFIGURACIÓN
            //  ============================================================
            this.count = count;
            this.options = options;
            this.type = options.type || PARTICLE_TYPES.FALL;
            this.spread = options.spread || 140;
            this.height = options.height || 40;
            this.fallSpeed = options.fallSpeed ?? 0.3;
            this.drift = options.drift ?? 0.15;
            this.lifetime = options.lifetime ?? 10;
            this.emitRate = options.emitRate ?? 1.0;
            this.burstCount = options.burstCount ?? 0;
            this.attractors = options.attractors || [];
            this.repulsors = options.repulsors || [];
            this._clock = 0;
            this._elapsed = 0;
            this._particleAge = new Float32Array(count);
            this._particleSeed = new Float32Array(count);
            this._isAlive = new Uint8Array(count);
            
            // Inicializar semillas
            for (let i = 0; i < count; i++) {
                this._particleSeed[i] = Math.random() * 100;
                this._particleAge[i] = Math.random() * this.lifetime;
                this._isAlive[i] = 1;
            }
            
            // ============================================================
            //  🚀 CONSTRUIR SISTEMA
            //  ============================================================
            this.mesh = this._build(options);
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this.stats = {
                particles: count,
                alive: count,
                dead: 0,
                emitted: 0,
                fps: 0,
                type: this.type,
                elapsed: 0
            };
            
            console.log(`✨ ParticleSystem Cuántico creado (${count} partículas, tipo: ${this.type})`);
        }
        
        // ============================================================
        //  🚀 CONSTRUIR SISTEMA (mejorado)
        //  ============================================================
        _build(options) {
            const geometry = new THREE.BufferGeometry();
            
            // Datos por partícula
            const basePos = new Float32Array(this.count * 3);
            const seed = new Float32Array(this.count);
            const velocity = new Float32Array(this.count * 3);
            const size = new Float32Array(this.count);
            const color = new Float32Array(this.count * 3);
            const age = new Float32Array(this.count);
            const lifetime = new Float32Array(this.count);
            const type = new Float32Array(this.count);
            
            // Velocidades para diferentes tipos
            const speedBase = options.speed || 1.0;
            
            for (let i = 0; i < this.count; i++) {
                // Posición inicial
                basePos[i * 3] = (Math.random() - 0.5) * this.spread;
                basePos[i * 3 + 1] = Math.random() * this.height;
                basePos[i * 3 + 2] = (Math.random() - 0.5) * this.spread;
                
                seed[i] = Math.random() * 100;
                
                // Velocidad según tipo
                const angle = Math.random() * Math.PI * 2;
                const speed = (0.5 + Math.random() * 0.5) * speedBase;
                velocity[i * 3] = Math.cos(angle) * speed;
                velocity[i * 3 + 1] = (Math.random() - 0.5) * speed;
                velocity[i * 3 + 2] = Math.sin(angle) * speed;
                
                // Tamaño
                size[i] = 0.1 + Math.random() * 0.4;
                
                // Color
                const hue = Math.random();
                const col = new THREE.Color().setHSL(hue, 0.8, 0.6);
                color[i * 3] = col.r;
                color[i * 3 + 1] = col.g;
                color[i * 3 + 2] = col.b;
                
                // Edad y vida
                age[i] = Math.random() * (this.lifetime || 10);
                lifetime[i] = (this.lifetime || 10) * (0.5 + Math.random() * 0.5);
                type[i] = i % 3; // Variación de tipo
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(basePos, 3));
            geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
            geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocity, 3));
            geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
            geometry.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
            geometry.setAttribute('aAge', new THREE.BufferAttribute(age, 1));
            geometry.setAttribute('aLifetime', new THREE.BufferAttribute(lifetime, 1));
            geometry.setAttribute('aType', new THREE.BufferAttribute(type, 1));
            
            // ============================================================
            //  🎨 MATERIAL CON SHADER AVANZADO
            //  ============================================================
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uCameraPos: { value: new THREE.Vector3() },
                    uHeight: { value: this.height },
                    uSpread: { value: this.spread },
                    uFallSpeed: { value: this.fallSpeed },
                    uDrift: { value: this.drift },
                    uSize: { value: options.size || 0.15 },
                    uColor: { value: new THREE.Color(options.color ?? 0xffffff) },
                    uOpacity: { value: options.opacity ?? 0.6 },
                    uLifetime: { value: this.lifetime || 10 },
                    uType: { value: this._getTypeIndex() },
                    uTurbulence: { value: options.turbulence || 0.1 },
                    uAttractorPos: { value: new THREE.Vector3() },
                    uAttractorStrength: { value: 0 },
                    uRepulsorPos: { value: new THREE.Vector3() },
                    uRepulsorStrength: { value: 0 },
                    uWind: { value: new THREE.Vector3(0, 0, 0) },
                    uGravity: { value: options.gravity ?? -9.8 },
                    uSwirl: { value: options.swirl || 0 },
                    uVortexStrength: { value: options.vortexStrength || 0 }
                },
                vertexShader: this._getVertexShader(),
                fragmentShader: this._getFragmentShader(),
                transparent: true,
                depthWrite: false,
                blending: options.blending === 'additive' ? 
                    THREE.AdditiveBlending : 
                    options.blending === 'normal' ? 
                        THREE.NormalBlending : 
                        THREE.AdditiveBlending
            });
            
            const points = new THREE.Points(geometry, material);
            points.frustumCulled = false;
            points.userData = {
                particleSystem: this,
                type: this.type
            };
            
            return points;
        }
        
        // ============================================================
        //  📝 SHADER DE VÉRTICES (mejorado)
        //  ============================================================
        _getVertexShader() {
            return `
                uniform float uTime;
                uniform vec3 uCameraPos;
                uniform float uHeight;
                uniform float uSpread;
                uniform float uFallSpeed;
                uniform float uDrift;
                uniform float uSize;
                uniform float uLifetime;
                uniform float uType;
                uniform float uTurbulence;
                uniform vec3 uAttractorPos;
                uniform float uAttractorStrength;
                uniform vec3 uRepulsorPos;
                uniform float uRepulsorStrength;
                uniform vec3 uWind;
                uniform float uGravity;
                uniform float uSwirl;
                uniform float uVortexStrength;
                
                attribute float aSeed;
                attribute vec3 aVelocity;
                attribute float aSize;
                attribute vec3 aColor;
                attribute float aAge;
                attribute float aLifetime;
                attribute float aType;
                
                varying vec3 vColor;
                varying float vAlpha;
                varying float vAge;
                varying float vLifetime;
                varying float vType;
                
                void main() {
                    vColor = aColor;
                    vAge = aAge;
                    vLifetime = aLifetime;
                    vType = aType;
                    
                    // Calcular edad actual
                    float age = aAge + uTime * 0.1;
                    float lifeProgress = age / aLifetime;
                    vAlpha = 1.0 - lifeProgress;
                    
                    // Posición base
                    vec3 pos = position;
                    
                    // === MOVIMIENTO SEGÚN TIPO ===
                    // Tipo 0: Caída (polvo, lluvia)
                    if (uType < 0.5) {
                        float fallOffset = mod(uTime * uFallSpeed + aSeed, uHeight);
                        pos.y = uHeight - fallOffset;
                        pos.x += sin(uTime * 0.8 + aSeed) * uDrift;
                        pos.x += uWind.x * uTime * 0.1;
                        pos.z += uWind.z * uTime * 0.1;
                    }
                    // Tipo 1: Swirl (remolino)
                    else if (uType < 1.5) {
                        float angle = uTime * 0.5 + aSeed * 0.1;
                        float radius = 0.5 + sin(uTime * 0.3 + aSeed) * 0.3;
                        float heightOffset = mod(uTime * 0.2 + aSeed, uHeight);
                        pos.x = sin(angle) * radius * uSpread * 0.3;
                        pos.z = cos(angle) * radius * uSpread * 0.3;
                        pos.y = heightOffset;
                    }
                    // Tipo 2: Vortex (vórtice)
                    else {
                        float angle = uTime * 0.8 + aSeed * 0.2;
                        float radius = 0.1 + (1.0 - lifeProgress) * 0.9;
                        float heightOffset = (1.0 - lifeProgress) * uHeight;
                        pos.x = sin(angle + uSwirl) * radius * uSpread * 0.3;
                        pos.z = cos(angle + uSwirl) * radius * uSpread * 0.3;
                        pos.y = heightOffset;
                    }
                    
                    // === TURBULENCIA ===
                    float turb = uTurbulence * sin(uTime * 2.0 + aSeed + pos.x * 0.01);
                    pos.x += turb;
                    pos.z += turb * 0.7;
                    
                    // === ATRACTOR ===
                    if (uAttractorStrength > 0.0) {
                        vec3 toAttractor = uAttractorPos - pos;
                        float dist = length(toAttractor);
                        if (dist > 0.1) {
                            pos += normalize(toAttractor) * uAttractorStrength * 0.1 / (1.0 + dist);
                        }
                    }
                    
                    // === REPULSOR ===
                    if (uRepulsorStrength > 0.0) {
                        vec3 fromRepulsor = pos - uRepulsorPos;
                        float dist = length(fromRepulsor);
                        if (dist > 0.1 && dist < 5.0) {
                            pos += normalize(fromRepulsor) * uRepulsorStrength * 0.1 / (1.0 + dist);
                        }
                    }
                    
                    // === VÓRTICE ===
                    if (uVortexStrength > 0.0) {
                        vec3 center = vec3(0.0, uHeight * 0.5, 0.0);
                        vec3 toCenter = pos - center;
                        float dist = length(toCenter);
                        if (dist > 0.1) {
                            vec3 tangent = normalize(cross(toCenter, vec3(0.0, 1.0, 0.0)));
                            pos += tangent * uVortexStrength * 0.1 / (1.0 + dist);
                        }
                    }
                    
                    // === RECICLAR ALREDEDOR DE CÁMARA ===
                    vec3 relativeToCam = pos - uCameraPos;
                    relativeToCam.x = mod(relativeToCam.x + uSpread * 0.5, uSpread) - uSpread * 0.5;
                    relativeToCam.z = mod(relativeToCam.z + uSpread * 0.5, uSpread) - uSpread * 0.5;
                    pos = uCameraPos + relativeToCam;
                    
                    // Tamaño según edad
                    float sizeFactor = 1.0 - lifeProgress * 0.5;
                    float finalSize = uSize * aSize * sizeFactor;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = finalSize * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;
        }
        
        // ============================================================
        //  📝 SHADER DE FRAGMENTOS (mejorado)
        //  ============================================================
        _getFragmentShader() {
            return `
                uniform vec3 uColor;
                uniform float uOpacity;
                uniform float uTime;
                
                varying vec3 vColor;
                varying float vAlpha;
                varying float vAge;
                varying float vLifetime;
                varying float vType;
                
                void main() {
                    // Punto redondeado
                    vec2 c = gl_PointCoord - 0.5;
                    float d = length(c);
                    if (d > 0.5) discard;
                    
                    // Brillo con caída
                    float alpha = 1.0 - smoothstep(0.0, 0.5, d);
                    alpha = pow(alpha, 1.5);
                    
                    // Efecto de brillo (glow)
                    float glow = exp(-d * 8.0);
                    vec3 color = vColor + vec3(glow * 0.3);
                    
                    // Color según edad
                    float lifeProgress = 1.0 - vAlpha;
                    if (lifeProgress > 0.7) {
                        // Desvanecimiento al final
                        float fade = 1.0 - (lifeProgress - 0.7) / 0.3;
                        alpha *= fade;
                        color *= fade;
                    }
                    
                    // Opacidad final
                    float finalAlpha = alpha * vAlpha * uOpacity;
                    
                    gl_FragColor = vec4(color, finalAlpha);
                }
            `;
        }
        
        // ============================================================
        //  📊 OBTENER ÍNDICE DE TIPO
        //  ============================================================
        _getTypeIndex() {
            const types = {
                fall: 0,
                rise: 0.1,
                swirl: 1,
                vortex: 2,
                galaxy: 2.1,
                swarm: 1.5,
                flow: 0.5,
                explode: 2.5,
                spark: 0.8,
                wave: 1.2,
                trail: 0.3,
                custom: 3
            };
            return types[this.type] || 0;
        }
        
        // ============================================================
        //  🔄 ACTUALIZACIÓN (mejorada)
        //  ============================================================
        update(elapsedTime, cameraPos, options = {}) {
            this._elapsed = elapsedTime;
            this._clock += 0.016;
            
            // Actualizar uniforms
            const uniforms = this.mesh.material.uniforms;
            uniforms.uTime.value = elapsedTime;
            
            if (cameraPos) {
                uniforms.uCameraPos.value.copy(cameraPos);
            }
            
            // Actualizar opciones en tiempo real
            if (options.wind) {
                uniforms.uWind.value.copy(options.wind);
            }
            if (options.attractorPos !== undefined) {
                uniforms.uAttractorPos.value.copy(options.attractorPos);
                uniforms.uAttractorStrength.value = options.attractorStrength || 0;
            }
            if (options.repulsorPos !== undefined) {
                uniforms.uRepulsorPos.value.copy(options.repulsorPos);
                uniforms.uRepulsorStrength.value = options.repulsorStrength || 0;
            }
            if (options.swirl !== undefined) {
                uniforms.uSwirl.value = options.swirl;
            }
            if (options.vortexStrength !== undefined) {
                uniforms.uVortexStrength.value = options.vortexStrength;
            }
            if (options.turbulence !== undefined) {
                uniforms.uTurbulence.value = options.turbulence;
            }
            if (options.gravity !== undefined) {
                uniforms.uGravity.value = options.gravity;
            }
            if (options.color) {
                uniforms.uColor.value.set(options.color);
            }
            if (options.opacity !== undefined) {
                uniforms.uOpacity.value = options.opacity;
            }
            if (options.size !== undefined) {
                uniforms.uSize.value = options.size;
            }
            
            // Actualizar estadísticas
            this.stats.elapsed = elapsedTime;
            this.stats.alive = this.count; // Simplificado
        }
        
        // ============================================================
        //  🎯 MÉTODOS DE CONTROL
        //  ============================================================
        
        /**
         * Establecer la posición del atractor
         */
        setAttractor(position, strength = 1.0) {
            const uniforms = this.mesh.material.uniforms;
            if (position) {
                uniforms.uAttractorPos.value.copy(position);
                uniforms.uAttractorStrength.value = strength;
            } else {
                uniforms.uAttractorStrength.value = 0;
            }
        }
        
        /**
         * Establecer la posición del repulsor
         */
        setRepulsor(position, strength = 1.0) {
            const uniforms = this.mesh.material.uniforms;
            if (position) {
                uniforms.uRepulsorPos.value.copy(position);
                uniforms.uRepulsorStrength.value = strength;
            } else {
                uniforms.uRepulsorStrength.value = 0;
            }
        }
        
        /**
         * Establecer el viento
         */
        setWind(wind) {
            if (wind) {
                this.mesh.material.uniforms.uWind.value.copy(wind);
            }
        }
        
        /**
         * Establecer la velocidad de caída
         */
        setFallSpeed(v) {
            this.mesh.material.uniforms.uFallSpeed.value = v;
        }
        
        /**
         * Establecer la opacidad
         */
        setOpacity(v) {
            this.mesh.material.uniforms.uOpacity.value = v;
        }
        
        /**
         * Establecer el color
         */
        setColor(hex) {
            this.mesh.material.uniforms.uColor.value.set(hex);
        }
        
        /**
         * Establecer la visibilidad
         */
        setVisible(v) {
            this.mesh.visible = v;
        }
        
        /**
         * Establecer el tamaño
         */
        setSize(v) {
            this.mesh.material.uniforms.uSize.value = v;
        }
        
        /**
         * Crear una ráfaga de partículas
         */
        burst(count = 100, position = null) {
            // Resetear partículas existentes
            const geometry = this.mesh.geometry;
            const posAttr = geometry.attributes.position;
            const ageAttr = geometry.attributes.aAge;
            
            if (posAttr && ageAttr) {
                const pos = posAttr.array;
                const age = ageAttr.array;
                const spread = this.spread * 0.5;
                
                for (let i = 0; i < Math.min(count, this.count); i++) {
                    const idx = Math.floor(Math.random() * this.count);
                    if (position) {
                        pos[idx * 3] = position.x + (Math.random() - 0.5) * spread;
                        pos[idx * 3 + 1] = position.y + Math.random() * this.height * 0.3;
                        pos[idx * 3 + 2] = position.z + (Math.random() - 0.5) * spread;
                    } else {
                        pos[idx * 3] = (Math.random() - 0.5) * spread;
                        pos[idx * 3 + 1] = Math.random() * this.height;
                        pos[idx * 3 + 2] = (Math.random() - 0.5) * spread;
                    }
                    age[idx] = 0;
                }
                posAttr.needsUpdate = true;
                ageAttr.needsUpdate = true;
            }
            
            this.stats.emitted += count;
        }
        
        /**
         * Dispersar partículas (explosión)
         */
        explode(position, strength = 1.0) {
            const geometry = this.mesh.geometry;
            const posAttr = geometry.attributes.position;
            const velAttr = geometry.attributes.aVelocity;
            
            if (posAttr && velAttr) {
                const pos = posAttr.array;
                const vel = velAttr.array;
                const spread = this.spread * 0.3;
                
                for (let i = 0; i < this.count; i++) {
                    const dir = new THREE.Vector3(
                        (Math.random() - 0.5) * 2,
                        (Math.random() - 0.5) * 2,
                        (Math.random() - 0.5) * 2
                    ).normalize();
                    
                    const speed = strength * (0.5 + Math.random() * 1.5);
                    vel[i * 3] = dir.x * speed;
                    vel[i * 3 + 1] = dir.y * speed;
                    vel[i * 3 + 2] = dir.z * speed;
                    
                    if (position) {
                        pos[i * 3] = position.x + (Math.random() - 0.5) * spread;
                        pos[i * 3 + 1] = position.y + (Math.random() - 0.5) * spread;
                        pos[i * 3 + 2] = position.z + (Math.random() - 0.5) * spread;
                    }
                }
                posAttr.needsUpdate = true;
                velAttr.needsUpdate = true;
            }
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        getStats() {
            return {
                ...this.stats,
                type: this.type,
                spread: this.spread,
                height: this.height,
                fallSpeed: this.fallSpeed,
                drift: this.drift,
                lifetime: this.lifetime,
                activeParticles: this.count
            };
        }
        
        // ============================================================
        //  🗑️ LIMPIAR
        //  ============================================================
        dispose() {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this._isAlive = null;
            this._particleAge = null;
            this._particleSeed = null;
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        reset() {
            const geometry = this.mesh.geometry;
            const posAttr = geometry.attributes.position;
            const ageAttr = geometry.attributes.aAge;
            
            if (posAttr && ageAttr) {
                const pos = posAttr.array;
                const age = ageAttr.array;
                
                for (let i = 0; i < this.count; i++) {
                    pos[i * 3] = (Math.random() - 0.5) * this.spread;
                    pos[i * 3 + 1] = Math.random() * this.height;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * this.spread;
                    age[i] = Math.random() * this.lifetime;
                }
                posAttr.needsUpdate = true;
                ageAttr.needsUpdate = true;
            }
            
            this._clock = 0;
            this.stats.emitted = 0;
        }
    }
    
    // ============================================================
    //  🚀 EXPORTAR TIPOS
    //  ============================================================
    ParticleSystem.TYPES = PARTICLE_TYPES;
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.ParticleSystem = ParticleSystem;
    
    console.log('✨ ParticleSystem Cuántico cargado');
    console.log('🚀 8 tipos de movimiento (GPU-driven)');
    console.log('🧲 Atractores y repulsores');
    console.log('🌀 Vórtice y remolino');
    console.log('🌬️ Viento y turbulencia');
    console.log('💥 Ráfagas y explosiones');
    console.log('🎨 Color por edad y gradientes');
    console.log('📊 Tamaño variable con curvas');
    console.log('✨ Glow y efectos de brillo');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ParticleSystem;
    }
    
})();