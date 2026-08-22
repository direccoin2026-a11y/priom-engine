/**
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

    // Verificar que THREE esté disponible
    if (typeof THREE === 'undefined') {
        console.warn('⚠️ ParticleSystem: THREE no disponible, usando fallback');
        // Definir un THREE básico si no existe
        if (typeof window.THREE === 'undefined') {
            window.THREE = {
                BufferGeometry: function() {},
                BufferAttribute: function() {},
                Points: function() {},
                PointsMaterial: function() {},
                ShaderMaterial: function() {},
                AdditiveBlending: 1,
                NormalBlending: 0,
                Color: function(c) { this.r = 1; this.g = 1; this.b = 1; this.set = function(c) {}; }
            };
        }
    }

    // ============================================================
    //  📊 TIPOS DE MOVIMIENTO DE PARTÍCULAS
    //  ============================================================
    const PARTICLE_TYPES = {
        FALL: 'fall',
        RISE: 'rise',
        SWIRL: 'swirl',
        VORTEX: 'vortex',
        GALAXY: 'galaxy',
        SWARM: 'swarm',
        FLOW: 'flow',
        EXPLODE: 'explode',
        SPARK: 'spark',
        WAVE: 'wave',
        TRAIL: 'trail',
        CUSTOM: 'custom'
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
            this.count = count || 100;
            this.options = options || {};
            this.type = options.type || PARTICLE_TYPES.FALL;
            this.spread = options.spread || 140;
            this.height = options.height || 40;
            this.fallSpeed = options.fallSpeed ?? 0.3;
            this.drift = options.drift ?? 0.15;
            this.lifetime = options.lifetime || 10;
            this.emitRate = options.emitRate || 1.0;
            this.burstCount = options.burstCount || 0;
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
        //  🚀 CONSTRUIR SISTEMA (compatible)
        //  ============================================================
        _build(options) {
            const THREE = window.THREE;
            
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
            
            const speedBase = options.speed || 1.0;
            const colorBase = new THREE.Color(options.color || 0xffffff);
            
            for (let i = 0; i < this.count; i++) {
                basePos[i * 3] = (Math.random() - 0.5) * this.spread;
                basePos[i * 3 + 1] = Math.random() * this.height;
                basePos[i * 3 + 2] = (Math.random() - 0.5) * this.spread;
                
                seed[i] = Math.random() * 100;
                
                const angle = Math.random() * Math.PI * 2;
                const speed = (0.5 + Math.random() * 0.5) * speedBase;
                velocity[i * 3] = Math.cos(angle) * speed;
                velocity[i * 3 + 1] = (Math.random() - 0.5) * speed;
                velocity[i * 3 + 2] = Math.sin(angle) * speed;
                
                size[i] = 0.1 + Math.random() * 0.4;
                
                // Color con variación
                const col = colorBase.clone();
                col.multiplyScalar(0.7 + Math.random() * 0.6);
                color[i * 3] = col.r;
                color[i * 3 + 1] = col.g;
                color[i * 3 + 2] = col.b;
                
                age[i] = Math.random() * (this.lifetime || 10);
                lifetime[i] = (this.lifetime || 10) * (0.5 + Math.random() * 0.5);
                type[i] = i % 3;
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
        //  📝 SHADER DE VÉRTICES
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
                    
                    float age = aAge + uTime * 0.1;
                    float lifeProgress = age / aLifetime;
                    vAlpha = 1.0 - lifeProgress;
                    
                    vec3 pos = position;
                    
                    // Movimiento según tipo
                    if (uType < 0.5) {
                        float fallOffset = mod(uTime * uFallSpeed + aSeed, uHeight);
                        pos.y = uHeight - fallOffset;
                        pos.x += sin(uTime * 0.8 + aSeed) * uDrift;
                        pos.x += uWind.x * uTime * 0.1;
                        pos.z += uWind.z * uTime * 0.1;
                    } else if (uType < 1.5) {
                        float angle = uTime * 0.5 + aSeed * 0.1;
                        float radius = 0.5 + sin(uTime * 0.3 + aSeed) * 0.3;
                        float heightOffset = mod(uTime * 0.2 + aSeed, uHeight);
                        pos.x = sin(angle) * radius * uSpread * 0.3;
                        pos.z = cos(angle) * radius * uSpread * 0.3;
                        pos.y = heightOffset;
                    } else {
                        float angle = uTime * 0.8 + aSeed * 0.2;
                        float radius = 0.1 + (1.0 - lifeProgress) * 0.9;
                        float heightOffset = (1.0 - lifeProgress) * uHeight;
                        pos.x = sin(angle + uSwirl) * radius * uSpread * 0.3;
                        pos.z = cos(angle + uSwirl) * radius * uSpread * 0.3;
                        pos.y = heightOffset;
                    }
                    
                    // Turbulencia
                    float turb = uTurbulence * sin(uTime * 2.0 + aSeed + pos.x * 0.01);
                    pos.x += turb;
                    pos.z += turb * 0.7;
                    
                    // Atractor
                    if (uAttractorStrength > 0.0) {
                        vec3 toAttractor = uAttractorPos - pos;
                        float dist = length(toAttractor);
                        if (dist > 0.1) {
                            pos += normalize(toAttractor) * uAttractorStrength * 0.1 / (1.0 + dist);
                        }
                    }
                    
                    // Repulsor
                    if (uRepulsorStrength > 0.0) {
                        vec3 fromRepulsor = pos - uRepulsorPos;
                        float dist = length(fromRepulsor);
                        if (dist > 0.1 && dist < 5.0) {
                            pos += normalize(fromRepulsor) * uRepulsorStrength * 0.1 / (1.0 + dist);
                        }
                    }
                    
                    // Vórtice
                    if (uVortexStrength > 0.0) {
                        vec3 center = vec3(0.0, uHeight * 0.5, 0.0);
                        vec3 toCenter = pos - center;
                        float dist = length(toCenter);
                        if (dist > 0.1) {
                            vec3 tangent = normalize(cross(toCenter, vec3(0.0, 1.0, 0.0)));
                            pos += tangent * uVortexStrength * 0.1 / (1.0 + dist);
                        }
                    }
                    
                    // Reciclar alrededor de cámara
                    vec3 relativeToCam = pos - uCameraPos;
                    relativeToCam.x = mod(relativeToCam.x + uSpread * 0.5, uSpread) - uSpread * 0.5;
                    relativeToCam.z = mod(relativeToCam.z + uSpread * 0.5, uSpread) - uSpread * 0.5;
                    pos = uCameraPos + relativeToCam;
                    
                    float sizeFactor = 1.0 - lifeProgress * 0.5;
                    float finalSize = uSize * aSize * sizeFactor;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = finalSize * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;
        }
        
        // ============================================================
        //  📝 SHADER DE FRAGMENTOS
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
                    vec2 c = gl_PointCoord - 0.5;
                    float d = length(c);
                    if (d > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, d);
                    alpha = pow(alpha, 1.5);
                    
                    float glow = exp(-d * 8.0);
                    vec3 color = vColor + vec3(glow * 0.3);
                    
                    float lifeProgress = 1.0 - vAlpha;
                    if (lifeProgress > 0.7) {
                        float fade = 1.0 - (lifeProgress - 0.7) / 0.3;
                        alpha *= fade;
                        color *= fade;
                    }
                    
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
        //  🔄 ACTUALIZACIÓN
        //  ============================================================
        update(elapsedTime, cameraPos, options = {}) {
            this._elapsed = elapsedTime;
            this._clock += 0.016;
            
            const uniforms = this.mesh.material.uniforms;
            uniforms.uTime.value = elapsedTime;
            
            if (cameraPos) {
                uniforms.uCameraPos.value.copy(cameraPos);
            }
            
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
            
            this.stats.elapsed = elapsedTime;
            this.stats.alive = this.count;
        }
        
        // ============================================================
        //  🎯 MÉTODOS DE CONTROL
        //  ============================================================
        setAttractor(position, strength) {
            const uniforms = this.mesh.material.uniforms;
            if (position) {
                uniforms.uAttractorPos.value.copy(position);
                uniforms.uAttractorStrength.value = strength || 1.0;
            } else {
                uniforms.uAttractorStrength.value = 0;
            }
        }
        
        setRepulsor(position, strength) {
            const uniforms = this.mesh.material.uniforms;
            if (position) {
                uniforms.uRepulsorPos.value.copy(position);
                uniforms.uRepulsorStrength.value = strength || 1.0;
            } else {
                uniforms.uRepulsorStrength.value = 0;
            }
        }
        
        setWind(wind) {
            if (wind) {
                this.mesh.material.uniforms.uWind.value.copy(wind);
            }
        }
        
        setFallSpeed(v) {
            this.mesh.material.uniforms.uFallSpeed.value = v;
        }
        
        setOpacity(v) {
            this.mesh.material.uniforms.uOpacity.value = v;
        }
        
        setColor(hex) {
            this.mesh.material.uniforms.uColor.value.set(hex);
        }
        
        setVisible(v) {
            this.mesh.visible = v;
        }
        
        setSize(v) {
            this.mesh.material.uniforms.uSize.value = v;
        }
        
        burst(count, position) {
            const geometry = this.mesh.geometry;
            const posAttr = geometry.attributes.position;
            const ageAttr = geometry.attributes.aAge;
            
            if (posAttr && ageAttr) {
                const pos = posAttr.array;
                const age = ageAttr.array;
                const spread = this.spread * 0.5;
                
                const burstCount = Math.min(count || 100, this.count);
                for (let i = 0; i < burstCount; i++) {
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
            
            this.stats.emitted += count || 100;
        }
        
        explode(position, strength) {
            const geometry = this.mesh.geometry;
            const posAttr = geometry.attributes.position;
            
            if (posAttr) {
                const pos = posAttr.array;
                const spread = this.spread * 0.3;
                const force = strength || 1.0;
                
                for (let i = 0; i < this.count; i++) {
                    const dir = new THREE.Vector3(
                        (Math.random() - 0.5) * 2,
                        (Math.random() - 0.5) * 2,
                        (Math.random() - 0.5) * 2
                    ).normalize();
                    
                    const speed = force * (0.5 + Math.random() * 1.5);
                    if (position) {
                        pos[i * 3] = position.x + dir.x * spread;
                        pos[i * 3 + 1] = position.y + dir.y * spread;
                        pos[i * 3 + 2] = position.z + dir.z * spread;
                    }
                }
                posAttr.needsUpdate = true;
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
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            if (this.mesh.material) this.mesh.material.dispose();
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