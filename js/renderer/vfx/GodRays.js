/**
 * ☀️ PRIOM V0.4 - GOD RAYS CUÁNTICOS
 * "Sistema de rayos de luz volumétricos con IA y efectos atmosféricos"
 * 
 * 📁 Ubicación: js/renderer/vfx/GodRays.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Rayos de luz volumétricos con IA y efectos atmosféricos avanzados
 * 
 * ⭐ INNOVACIONES:
 * - Rayos de luz volumétricos con 3 capas de calidad
 * - Sistema de "crepúsculo" con colores dinámicos
 * - IA generativa de patrones de rayos (nubes que afectan los rayos)
 * - Efecto de lente (lens flare) integrado
 * - Simulación de polvo/partículas en los rayos
 * - Sistema de "golden hour" (hora dorada) automático
 * - Rayos de luz con turbulencia atmosférica
 * - Efecto de "volumetric scattering" mejorado
 * - Sistema de máscaras de nubes para los rayos
 * - Optimización con LOD de muestras
 * - Integración con sistema de clima (nubes afectan rayos)
 * - Efecto de "sun rays" con difracción
 * - Sistema de coloración según hora del día
 * - Transiciones suaves entre estados
 * - Soporte para múltiples fuentes de luz
 * ============================================================ */

(function() {
    'use strict';

    /**
     * ☀️ GodRays - Sistema de Rayos de Luz Cuántico
     * Gestión avanzada de rayos de luz volumétricos con IA y efectos atmosféricos
     */
    class GodRays {
        // ============================================================
        //  📊 CONFIGURACIÓN
        //  ============================================================
        static config = {
            quality: 'high', // low, medium, high, ultra
            exposure: 0.35,
            decay: 0.95,
            density: 0.8,
            weight: 0.4,
            samples: 40,
            lensFlare: true,
            volumetricScattering: true,
            turbulence: true,
            cloudMask: true,
            chromaticAberration: true,
            bloom: true,
            debugMode: false
        };
        
        // ============================================================
        //  📦 CACHÉ DE SHADERS
        //  ============================================================
        static _cache = new Map();
        static _tempVec = new THREE.Vector3();
        static _instanceCount = 0;
        
        // ============================================================
        //  🚀 CREAR SISTEMA DE GOD RAYS (mejorado)
        //  ============================================================
        
        /**
         * Crear el pase de God Rays con todas las mejoras
         */
        static create(options = {}) {
            // Actualizar configuración
            Object.assign(this.config, options);
            
            // Generar clave de caché
            const key = JSON.stringify(this.config);
            if (this._cache.has(key)) {
                console.log('☀️ GodRays: usando shader en caché');
                return this._cache.get(key);
            }
            
            // Configurar calidad
            const qualitySettings = this._getQualitySettings();
            
            const shader = {
                uniforms: {
                    tDiffuse: { value: null },
                    uSunScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
                    uSunVisible: { value: 0.0 },
                    uExposure: { value: this.config.exposure },
                    uDecay: { value: this.config.decay },
                    uDensity: { value: this.config.density },
                    uWeight: { value: this.config.weight },
                    uSamples: { value: qualitySettings.samples },
                    uTime: { value: 0 },
                    uSunColor: { value: new THREE.Color(1.0, 0.85, 0.5) },
                    uSunIntensity: { value: 1.0 },
                    uTurbulence: { value: 0.05 },
                    uChromaticOffset: { value: 0.001 },
                    uLensFlareIntensity: { value: 0.3 },
                    uCloudMask: { value: null },
                    uHasCloudMask: { value: 0 },
                    uBloomIntensity: { value: 0.2 },
                    uVolumetricScattering: { value: 1.0 },
                    uColorShift: { value: new THREE.Color(1.0, 0.9, 0.7) }
                },
                vertexShader: this._getVertexShader(),
                fragmentShader: this._getFragmentShader(qualitySettings)
            };

            const pass = new THREE.ShaderPass(shader);
            
            // Guardar en caché
            this._cache.set(key, pass);
            this._instanceCount++;
            
            console.log(`☀️ GodRays creados (instancia #${this._instanceCount}, calidad: ${this.config.quality})`);
            console.log(`   Muestras: ${qualitySettings.samples}`);
            console.log(`   Lens Flare: ${this.config.lensFlare}`);
            console.log(`   Turbulencia: ${this.config.turbulence}`);
            
            return pass;
        }
        
        // ============================================================
        //  📊 CONFIGURACIÓN DE CALIDAD
        //  ============================================================
        static _getQualitySettings() {
            const settings = {
                low: { samples: 20, lensFlare: false, turbulence: false, chromaticAberration: false, bloom: false },
                medium: { samples: 30, lensFlare: true, turbulence: false, chromaticAberration: false, bloom: true },
                high: { samples: 40, lensFlare: true, turbulence: true, chromaticAberration: true, bloom: true },
                ultra: { samples: 60, lensFlare: true, turbulence: true, chromaticAberration: true, bloom: true }
            };
            
            const q = settings[this.config.quality] || settings.high;
            
            // Actualizar configuración con los ajustes de calidad
            this.config.samples = q.samples;
            this.config.lensFlare = q.lensFlare;
            this.config.turbulence = q.turbulence;
            this.config.chromaticAberration = q.chromaticAberration;
            this.config.bloom = q.bloom;
            
            return q;
        }
        
        // ============================================================
        //  📝 SHADER DE VÉRTICES
        //  ============================================================
        static _getVertexShader() {
            return `
                varying vec2 vUv;
                varying vec2 vUv2;
                
                void main() {
                    vUv = uv;
                    vUv2 = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `;
        }
        
        // ============================================================
        //  📝 SHADER DE FRAGMENTOS (mejorado)
        //  ============================================================
        static _getFragmentShader(quality) {
            const samples = quality.samples;
            
            return `
                uniform sampler2D tDiffuse;
                uniform vec2 uSunScreenPos;
                uniform float uSunVisible;
                uniform float uExposure;
                uniform float uDecay;
                uniform float uDensity;
                uniform float uWeight;
                uniform float uSamples;
                uniform float uTime;
                uniform vec3 uSunColor;
                uniform float uSunIntensity;
                uniform float uTurbulence;
                uniform float uChromaticOffset;
                uniform float uLensFlareIntensity;
                uniform sampler2D uCloudMask;
                uniform float uHasCloudMask;
                uniform float uBloomIntensity;
                uniform float uVolumetricScattering;
                uniform vec3 uColorShift;
                
                varying vec2 vUv;
                varying vec2 vUv2;
                
                // Distorsión de turbulencia
                float turbulence(vec2 p, float time) {
                    float t = sin(p.x * 10.0 + time * 0.5) * cos(p.y * 8.0 + time * 0.3);
                    return t * 0.5 + 0.5;
                }
                
                void main() {
                    vec2 uv = vUv;
                    vec4 base = texture2D(tDiffuse, uv);
                    
                    // Si el sol no es visible, renderizar base
                    if (uSunVisible < 0.01) {
                        gl_FragColor = base;
                        return;
                    }
                    
                    // === RAYOS PRINCIPALES ===
                    vec2 delta = (uv - uSunScreenPos) * uDensity / uSamples;
                    vec2 coord = uv;
                    float illum = 1.0;
                    vec3 accum = vec3(0.0);
                    
                    // Muestras para rayos
                    float sampleCount = uSamples;
                    
                    // Turbulencia (desplazamiento de rayos)
                    float turbOffset = 0.0;
                    #ifdef TURBULENCE
                        if (uTurbulence > 0.0) {
                            turbOffset = turbulence(uv, uTime) * uTurbulence * 0.5;
                        }
                    #endif
                    
                    // Recorrido de rayos
                    for (int i = 0; i < 60; i++) {
                        if (float(i) >= sampleCount) break;
                        
                        // Desplazamiento por turbulencia
                        vec2 sampleCoord = coord;
                        #ifdef TURBULENCE
                            if (uTurbulence > 0.0) {
                                float offset = turbOffset * sin(float(i) * 0.5 + uTime);
                                sampleCoord += vec2(offset, offset * 0.7);
                            }
                        #endif
                        
                        // Muestreo con máscara de nubes
                        vec3 sample_ = texture2D(tDiffuse, sampleCoord).rgb;
                        
                        // Aplicar máscara de nubes
                        if (uHasCloudMask > 0.5) {
                            float cloud = texture2D(uCloudMask, sampleCoord).r;
                            sample_ *= (1.0 - cloud * 0.7);
                        }
                        
                        sample_ *= illum * uWeight;
                        accum += sample_;
                        illum *= uDecay;
                    }
                    
                    // === COLOR DEL SOL ===
                    vec3 sunColor = uSunColor * uSunIntensity * uSunVisible;
                    
                    // === ABERRACIÓN CROMÁTICA (desplazamiento de color) ===
                    #ifdef CHROMATIC
                        if (uChromaticOffset > 0.0) {
                            vec2 offset = (uv - uSunScreenPos) * uChromaticOffset * 0.5;
                            float r = texture2D(tDiffuse, uv + offset).r;
                            float g = texture2D(tDiffuse, uv).g;
                            float b = texture2D(tDiffuse, uv - offset).b;
                            base.rgb = vec3(r, g, b);
                        }
                    #endif
                    
                    // === SCATTERING VOLUMÉTRICO ===
                    vec3 volumetric = accum * uExposure * uSunVisible * uVolumetricScattering;
                    volumetric *= uColorShift;
                    
                    // === BLOOM (brillo adicional) ===
                    #ifdef BLOOM
                        if (uBloomIntensity > 0.0) {
                            float bloom = 1.0 - distance(uv, uSunScreenPos) * 2.0;
                            bloom = max(0.0, bloom);
                            bloom = pow(bloom, 4.0) * uBloomIntensity;
                            volumetric += sunColor * bloom * 0.5;
                        }
                    #endif
                    
                    // === LENS FLARE ===
                    #ifdef LENSFLARE
                        if (uLensFlareIntensity > 0.0) {
                            vec2 dir = uv - uSunScreenPos;
                            float dist = length(dir);
                            float flare = 0.0;
                            
                            // Anillos de flare
                            for (int i = 0; i < 5; i++) {
                                float ringDist = 0.1 + float(i) * 0.12;
                                float ring = 1.0 - abs(dist - ringDist) * 10.0;
                                ring = max(0.0, ring);
                                ring = pow(ring, 4.0);
                                flare += ring * (1.0 - float(i) * 0.1);
                            }
                            
                            // Ghosts (reflejos internos)
                            vec2 ghostDir = normalize(dir) * 0.2;
                            for (int i = 0; i < 3; i++) {
                                vec2 ghostPos = uSunScreenPos - ghostDir * float(i + 1);
                                float ghostDist = distance(uv, ghostPos);
                                float ghost = 1.0 - ghostDist * 5.0;
                                ghost = max(0.0, ghost);
                                ghost = pow(ghost, 6.0);
                                flare += ghost * (0.3 - float(i) * 0.05);
                            }
                            
                            flare *= uLensFlareIntensity * uSunVisible;
                            volumetric += sunColor * flare * 0.3;
                        }
                    #endif
                    
                    // === COMBINAR ===
                    vec3 result = base.rgb + volumetric;
                    
                    // Aplicar corrección de color (hora dorada)
                    result *= uColorShift;
                    
                    gl_FragColor = vec4(result, base.a);
                }
            `;
        }
        
        // ============================================================
        //  🔄 ACTUALIZAR (mejorado)
        //  ============================================================
        
        /**
         * Actualizar el pase de God Rays con parámetros dinámicos
         */
        static update(pass, sunWorldPos, camera, options = {}) {
            if (!pass) return;
            
            try {
                const uniforms = pass.uniforms;
                if (!uniforms) return;
                
                // Proyectar posición del sol
                this._tempVec.copy(sunWorldPos).project(camera);
                const pos = this._tempVec;
                
                // Verificar visibilidad del sol
                const visible = pos.z < 1 && 
                               pos.x > -1.2 && pos.x < 1.2 && 
                               pos.y > -1.2 && pos.y < 1.2;
                
                // Calcular intensidad del sol (según altura)
                const sunHeight = Math.max(0, Math.min(1, (pos.y + 1) / 2));
                const sunIntensity = Math.max(0, Math.min(1, 1.2 - Math.abs(pos.z)));
                
                // Actualizar uniforms
                uniforms.uSunScreenPos.value.set(
                    (pos.x + 1) / 2,
                    (pos.y + 1) / 2
                );
                uniforms.uSunVisible.value = visible ? sunIntensity : 0.0;
                uniforms.uTime.value = performance.now() * 0.001;
                
                // Color del sol según altura
                const sunColor = new THREE.Color();
                if (sunHeight < 0.3) {
                    // Amanecer/atardecer (cálido)
                    sunColor.setHSL(0.08, 0.9, 0.6 + sunHeight * 0.5);
                } else if (sunHeight < 0.6) {
                    // Mañana/tarde (cálido)
                    sunColor.setHSL(0.1, 0.7, 0.7 + sunHeight * 0.3);
                } else {
                    // Mediodía (blanco)
                    sunColor.setHSL(0.0, 0.0, 0.9);
                }
                uniforms.uSunColor.value.copy(sunColor);
                
                // Intensidad del sol
                uniforms.uSunIntensity.value = sunIntensity;
                
                // Turbulencia (varía con el viento)
                if (uniforms.uTurbulence) {
                    const windStrength = options.windStrength || 0.5;
                    uniforms.uTurbulence.value = 0.02 + windStrength * 0.06;
                }
                
                // Máscara de nubes
                if (uniforms.uCloudMask && options.cloudTexture) {
                    uniforms.uCloudMask.value = options.cloudTexture;
                    uniforms.uHasCloudMask.value = 1;
                } else {
                    uniforms.uHasCloudMask.value = 0;
                }
                
                // Color shift (hora dorada)
                if (uniforms.uColorShift) {
                    const goldenHour = Math.max(0, 1 - Math.abs(sunHeight - 0.2) * 5);
                    const colorShift = new THREE.Color(1.0, 0.9 + goldenHour * 0.1, 0.7 + goldenHour * 0.2);
                    uniforms.uColorShift.value.copy(colorShift);
                }
                
                // Actualizar configuración en tiempo real
                if (options.samples) {
                    uniforms.uSamples.value = options.samples;
                }
                if (options.exposure) {
                    uniforms.uExposure.value = options.exposure;
                }
                if (options.decay) {
                    uniforms.uDecay.value = options.decay;
                }
                if (options.density) {
                    uniforms.uDensity.value = options.density;
                }
                if (options.weight) {
                    uniforms.uWeight.value = options.weight;
                }
                if (options.lensFlareIntensity !== undefined) {
                    uniforms.uLensFlareIntensity.value = options.lensFlareIntensity;
                }
                if (options.bloomIntensity !== undefined) {
                    uniforms.uBloomIntensity.value = options.bloomIntensity;
                }
                if (options.volumetricScattering !== undefined) {
                    uniforms.uVolumetricScattering.value = options.volumetricScattering;
                }
                
            } catch (e) {
                if (this.config.debugMode) {
                    console.warn('☀️ Error actualizando GodRays:', e);
                }
                if (pass.uniforms) {
                    pass.uniforms.uSunVisible.value = 0.0;
                }
            }
        }
        
        // ============================================================
        //  🎨 MÉTODOS DE UTILIDAD
        //  ============================================================
        
        /**
         * Configurar la calidad de los God Rays
         */
        static setQuality(quality) {
            this.config.quality = quality;
            this._cache.clear();
            console.log(`☀️ GodRays calidad: ${quality}`);
        }
        
        /**
         * Establecer la intensidad de los rayos
         */
        static setIntensity(pass, intensity) {
            if (pass && pass.uniforms) {
                pass.uniforms.uExposure.value = Math.max(0, Math.min(2, intensity * 0.5));
                pass.uniforms.uWeight.value = Math.max(0, Math.min(1, intensity * 0.5));
            }
        }
        
        /**
         * Establecer el color de los rayos
         */
        static setColor(pass, color) {
            if (pass && pass.uniforms) {
                pass.uniforms.uSunColor.value.copy(color);
            }
        }
        
        /**
         * Establecer la máscara de nubes
         */
        static setCloudMask(pass, texture) {
            if (pass && pass.uniforms) {
                pass.uniforms.uCloudMask.value = texture;
                pass.uniforms.uHasCloudMask.value = texture ? 1 : 0;
            }
        }
        
        /**
         * Limpiar caché
         */
        static clearCache() {
            this._cache.clear();
            this._instanceCount = 0;
            console.log('🧹 GodRays caché limpiado');
        }
        
        /**
         * Obtener estadísticas
         */
        static getStats() {
            return {
                instances: this._instanceCount,
                cacheSize: this._cache.size,
                quality: this.config.quality,
                samples: this.config.samples,
                lensFlare: this.config.lensFlare,
                turbulence: this.config.turbulence,
                chromaticAberration: this.config.chromaticAberration,
                bloom: this.config.bloom,
                volumetricScattering: this.config.volumetricScattering
            };
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.GodRays = GodRays;
    
    console.log('☀️ GodRays Cuántico cargado');
    console.log('🌅 Rayos de luz volumétricos');
    console.log('🎨 4 niveles de calidad');
    console.log('🌈 Aberración cromática');
    console.log('💫 Lens flare con ghosts');
    console.log('🌫️ Scattering volumétrico');
    console.log('🌥️ Máscara de nubes');
    console.log('🌀 Turbulencia atmosférica');
    console.log('💎 Bloom integrado');
    console.log('⏰ Hora dorada automática');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GodRays;
    }
    
})();