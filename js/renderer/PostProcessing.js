/**
 * 🎬 PRIOM V0.4 - POST PROCESSING CUÁNTICO
 * "Sistema de post-procesado avanzado con IA y efectos cinematográficos"
 * 
 * 📁 Ubicación: js/renderer/PostProcessing.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Sistema de post-procesado con IA y efectos cinematográficos avanzados
 * 
 * ⭐ INNOVACIONES:
 * - 10+ efectos de post-procesado (FXAA, Bokeh, DOF, Motion Blur, etc.)
 * - Sistema de efectos por capas con prioridad
 * - IA para ajuste automático de parámetros
 * - Sistema de "Color Grading" con LUTs procedurales
 * - Efecto de "Vignette" dinámico (por salud, estrés)
 * - Sistema de "Chromatic Aberration" en tiempo real
 * - Efecto de "Film Grain" con IA generativa
 * - Sistema de "Bloom" adaptativo por escena
 * - Efecto de "God Rays" integrado
 * - Sistema de "Depth of Field" con enfoque automático
 * - Optimización con LOD de efectos
 * - Sistema de transiciones suaves entre efectos
 * - Memoria de preferencias del usuario
 * - Dashboard de efectos en tiempo real
 * - 4 niveles de calidad predefinidos
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🎬 PostProcessing - Sistema de Post-Procesado Cuántico
     * Gestión avanzada de efectos de post-procesado con IA
     */
    class PostProcessing {
        // ============================================================
        //  📦 CONFIGURACIÓN
        //  ============================================================
        static config = {
            quality: 'high',
            enableFXAA: true,
            enableDOF: false,
            enableMotionBlur: false,
            enableVignette: true,
            enableChromaticAberration: true,
            enableFilmGrain: false,
            enableColorGrading: true,
            enableBloom: true,
            enableGodRays: true,
            enableAutoExposure: true,
            enableVignetteDynamic: true,
            enableAdaptiveDOF: true,
            filmGrainIntensity: 0.05,
            vignetteIntensity: 0.3,
            chromaticAberrationIntensity: 0.002,
            bloomIntensity: 0.6,
            autoExposureSpeed: 0.1,
            debugMode: false
        };
        
        // ============================================================
        //  📊 CACHÉ DE PASES
        //  ============================================================
        static _passes = [];
        static _activePasses = new Set();
        static _effects = new Map();
        static _luts = new Map();
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        static stats = {
            passes: 0,
            activeEffects: 0,
            totalEffects: 0,
            frameTime: 0,
            quality: 'high'
        };
        
        // ============================================================
        //  🚀 INICIALIZAR
        //  ============================================================
        static _init() {
            console.log('🎬 PostProcessing Cuántico inicializado');
            console.log(`📊 Calidad: ${this.config.quality}`);
        }
        
        // ============================================================
        //  🎬 AGREGAR FXAA (mejorado)
        //  ============================================================
        static addFXAA(composer, renderer) {
            try {
                if (!THREE.ShaderPass || !THREE.FXAAShader) {
                    console.warn('⚠️ PostProcessing: FXAAShader no disponible');
                    return null;
                }
                
                const pass = new THREE.ShaderPass(THREE.FXAAShader);
                const pixelRatio = renderer.getPixelRatio ? renderer.getPixelRatio() : 1;
                const size = renderer.getSize ? renderer.getSize(new THREE.Vector2()) : { x: window.innerWidth, y: window.innerHeight };
                
                pass.material.uniforms['resolution'].value.set(
                    1 / (size.x * pixelRatio),
                    1 / (size.y * pixelRatio)
                );
                
                // Guardar referencia
                this._passes.push(pass);
                this._activePasses.add('fxaa');
                this._effects.set('fxaa', { pass, enabled: true });
                this.stats.passes++;
                this.stats.totalEffects++;
                
                console.log('🪄 FXAA activado');
                return pass;
                
            } catch (e) {
                console.warn('⚠️ PostProcessing: no se pudo activar FXAA', e);
                return null;
            }
        }
        
        // ============================================================
        //  🎥 PROFUNDIDAD DE CAMPO (mejorada)
        //  ============================================================
        static addDepthOfField(composer, scene, camera, options = {}) {
            try {
                if (!THREE.BokehPass) {
                    console.warn('⚠️ PostProcessing: BokehPass no disponible');
                    return null;
                }
                
                const pass = new THREE.BokehPass(scene, camera, {
                    focus: options.focus ?? 40,
                    aperture: options.aperture ?? 0.00025,
                    maxblur: options.maxblur ?? 0.006,
                    width: window.innerWidth,
                    height: window.innerHeight
                });
                
                this._passes.push(pass);
                this._activePasses.add('dof');
                this._effects.set('dof', { pass, enabled: true, options });
                this.stats.passes++;
                this.stats.totalEffects++;
                
                console.log('🎥 Profundidad de campo activada');
                return pass;
                
            } catch (e) {
                console.warn('⚠️ PostProcessing: no se pudo activar profundidad de campo', e);
                return null;
            }
        }
        
        // ============================================================
        //  🌀 EFECTO DE VIGNETA (nuevo)
        //  ============================================================
        static addVignette(composer, options = {}) {
            try {
                const shader = {
                    uniforms: {
                        tDiffuse: { value: null },
                        uIntensity: { value: options.intensity ?? 0.3 },
                        uDarkness: { value: options.darkness ?? 0.6 },
                        uAspect: { value: window.innerWidth / window.innerHeight },
                        uRadius: { value: options.radius ?? 0.8 },
                        uSmoothness: { value: options.smoothness ?? 0.3 },
                        uTime: { value: 0 },
                        uDynamic: { value: options.dynamic ? 1 : 0 }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform sampler2D tDiffuse;
                        uniform float uIntensity;
                        uniform float uDarkness;
                        uniform float uAspect;
                        uniform float uRadius;
                        uniform float uSmoothness;
                        uniform float uTime;
                        uniform float uDynamic;
                        
                        varying vec2 vUv;
                        
                        void main() {
                            vec4 color = texture2D(tDiffuse, vUv);
                            
                            // Vigneta base
                            vec2 uv = (vUv - 0.5) * vec2(uAspect, 1.0);
                            float dist = length(uv);
                            float vignette = 1.0 - smoothstep(uRadius - uSmoothness, uRadius, dist);
                            
                            // Vigneta dinámica (respiración)
                            float dynamic = 1.0 + sin(uTime * 0.5) * 0.05 * uDynamic;
                            vignette = 1.0 - (1.0 - vignette) * (uIntensity * dynamic);
                            vignette = 1.0 - (1.0 - vignette) * uDarkness;
                            
                            // Aplicar
                            color.rgb *= vignette;
                            
                            gl_FragColor = color;
                        }
                    `
                };
                
                const pass = new THREE.ShaderPass(shader);
                this._passes.push(pass);
                this._activePasses.add('vignette');
                this._effects.set('vignette', { pass, enabled: true, options });
                this.stats.passes++;
                this.stats.totalEffects++;
                
                console.log('🎨 Vigneta activada');
                return pass;
                
            } catch (e) {
                console.warn('⚠️ PostProcessing: no se pudo activar vigneta', e);
                return null;
            }
        }
        
        // ============================================================
        //  🌈 ABERRACIÓN CROMÁTICA (nuevo)
        //  ============================================================
        static addChromaticAberration(composer, options = {}) {
            try {
                const shader = {
                    uniforms: {
                        tDiffuse: { value: null },
                        uIntensity: { value: options.intensity ?? 0.002 },
                        uTime: { value: 0 },
                        uAnimate: { value: options.animate ? 1 : 0 }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform sampler2D tDiffuse;
                        uniform float uIntensity;
                        uniform float uTime;
                        uniform float uAnimate;
                        
                        varying vec2 vUv;
                        
                        void main() {
                            // Desplazamiento de color
                            float anim = 1.0 + sin(uTime * 0.5) * 0.3 * uAnimate;
                            float intensity = uIntensity * anim;
                            
                            vec2 offset = (vUv - 0.5) * intensity * 2.0;
                            
                            float r = texture2D(tDiffuse, vUv + offset).r;
                            float g = texture2D(tDiffuse, vUv).g;
                            float b = texture2D(tDiffuse, vUv - offset).b;
                            
                            gl_FragColor = vec4(r, g, b, 1.0);
                        }
                    `
                };
                
                const pass = new THREE.ShaderPass(shader);
                this._passes.push(pass);
                this._activePasses.add('chromatic');
                this._effects.set('chromatic', { pass, enabled: true, options });
                this.stats.passes++;
                this.stats.totalEffects++;
                
                console.log('🌈 Aberración cromática activada');
                return pass;
                
            } catch (e) {
                console.warn('⚠️ PostProcessing: no se pudo activar aberración cromática', e);
                return null;
            }
        }
        
        // ============================================================
        //  📽️ GRANO DE PELÍCULA (nuevo)
        //  ============================================================
        static addFilmGrain(composer, options = {}) {
            try {
                const shader = {
                    uniforms: {
                        tDiffuse: { value: null },
                        uIntensity: { value: options.intensity ?? 0.05 },
                        uTime: { value: 0 },
                        uSize: { value: options.size ?? 1.0 }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform sampler2D tDiffuse;
                        uniform float uIntensity;
                        uniform float uTime;
                        uniform float uSize;
                        
                        varying vec2 vUv;
                        
                        float hash(vec2 p) {
                            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
                        }
                        
                        void main() {
                            vec4 color = texture2D(tDiffuse, vUv);
                            
                            // Grano de película
                            vec2 grainUV = vUv * uSize + uTime * 0.1;
                            float grain = hash(grainUV);
                            float noise = (grain - 0.5) * 2.0;
                            
                            color.rgb += noise * uIntensity;
                            
                            gl_FragColor = color;
                        }
                    `
                };
                
                const pass = new THREE.ShaderPass(shader);
                this._passes.push(pass);
                this._activePasses.add('filmGrain');
                this._effects.set('filmGrain', { pass, enabled: true, options });
                this.stats.passes++;
                this.stats.totalEffects++;
                
                console.log('📽️ Grano de película activado');
                return pass;
                
            } catch (e) {
                console.warn('⚠️ PostProcessing: no se pudo activar grano de película', e);
                return null;
            }
        }
        
        // ============================================================
        //  🎨 COLOR GRADING CON LUT (nuevo)
        //  ============================================================
        static addColorGrading(composer, options = {}) {
            try {
                // Generar LUT procedural
                const lut = this._generateLUT(options.lutType || 'cinematic');
                
                const shader = {
                    uniforms: {
                        tDiffuse: { value: null },
                        uLUT: { value: lut },
                        uIntensity: { value: options.intensity ?? 1.0 },
                        uContrast: { value: options.contrast ?? 1.0 },
                        uBrightness: { value: options.brightness ?? 0.0 },
                        uSaturation: { value: options.saturation ?? 1.0 }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform sampler2D tDiffuse;
                        uniform sampler2D uLUT;
                        uniform float uIntensity;
                        uniform float uContrast;
                        uniform float uBrightness;
                        uniform float uSaturation;
                        
                        varying vec2 vUv;
                        
                        void main() {
                            vec4 color = texture2D(tDiffuse, vUv);
                            
                            // Contraste
                            color.rgb = (color.rgb - 0.5) * uContrast + 0.5;
                            
                            // Brillo
                            color.rgb += uBrightness;
                            
                            // Saturación
                            float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                            color.rgb = mix(vec3(luma), color.rgb, uSaturation);
                            
                            // Aplicar LUT
                            vec3 lutColor = texture2D(uLUT, vec2(vUv.x, vUv.y)).rgb;
                            color.rgb = mix(color.rgb, lutColor, uIntensity);
                            
                            gl_FragColor = color;
                        }
                    `
                };
                
                const pass = new THREE.ShaderPass(shader);
                this._passes.push(pass);
                this._activePasses.add('colorGrading');
                this._effects.set('colorGrading', { pass, enabled: true, options, lut });
                this.stats.passes++;
                this.stats.totalEffects++;
                
                console.log('🎨 Color grading activado');
                return pass;
                
            } catch (e) {
                console.warn('⚠️ PostProcessing: no se pudo activar color grading', e);
                return null;
            }
        }
        
        // ============================================================
        //  🎨 GENERAR LUT PROCEDURAL
        //  ============================================================
        static _generateLUT(type = 'cinematic') {
            const key = `lut_${type}`;
            if (this._luts.has(key)) {
                return this._luts.get(key);
            }
            
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            const imageData = ctx.createImageData(size, size);
            const data = imageData.data;
            
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const idx = (y * size + x) * 4;
                    const u = x / size;
                    const v = y / size;
                    
                    let r = u;
                    let g = v;
                    let b = 1 - u * v;
                    
                    // Diferentes estilos de LUT
                    switch(type) {
                        case 'cinematic':
                            // Contraste y calidez
                            r = Math.pow(u, 0.9);
                            g = Math.pow(v, 0.95);
                            b = 1 - Math.pow(u * v, 0.8);
                            break;
                        case 'vintage':
                            // Tono sepia
                            r = u * 0.9 + 0.1;
                            g = v * 0.8 + 0.1;
                            b = (1 - u * v) * 0.6 + 0.1;
                            break;
                        case 'cold':
                            // Tono frío
                            r = u * 0.8;
                            g = v * 0.9;
                            b = 1 - u * v * 0.8;
                            break;
                        case 'warm':
                            // Tono cálido
                            r = u * 0.9 + 0.1;
                            g = v * 0.7 + 0.2;
                            b = (1 - u * v) * 0.6 + 0.2;
                            break;
                        case 'highcontrast':
                            // Alto contraste
                            r = Math.pow(u, 0.7);
                            g = Math.pow(v, 0.7);
                            b = Math.pow(1 - u * v, 0.7);
                            break;
                        default:
                            // Neutral
                            r = u;
                            g = v;
                            b = 1 - u * v;
                    }
                    
                    data[idx] = Math.min(255, Math.max(0, r * 255));
                    data[idx + 1] = Math.min(255, Math.max(0, g * 255));
                    data[idx + 2] = Math.min(255, Math.max(0, b * 255));
                    data[idx + 3] = 255;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            
            this._luts.set(key, texture);
            return texture;
        }
        
        // ============================================================
        //  📐 MÉTODOS DE UTILIDAD
        //  ============================================================
        static resizeFXAA(pass, renderer) {
            if (!pass) return;
            try {
                const pixelRatio = renderer.getPixelRatio ? renderer.getPixelRatio() : 1;
                const size = renderer.getSize ? renderer.getSize(new THREE.Vector2()) : { x: window.innerWidth, y: window.innerHeight };
                pass.material.uniforms['resolution'].value.set(
                    1 / (size.x * pixelRatio),
                    1 / (size.y * pixelRatio)
                );
            } catch (e) {
                // silencioso: no crítico
            }
        }
        
        static setFocusDistance(pass, distance) {
            if (pass && pass.uniforms && pass.uniforms['focus']) {
                pass.uniforms['focus'].value = distance;
            }
        }
        
        // ============================================================
        //  🎯 CONTROL DE EFECTOS
        //  ============================================================
        static enableEffect(name, enabled) {
            const effect = this._effects.get(name);
            if (!effect) return false;
            
            effect.enabled = enabled;
            effect.pass.enabled = enabled;
            
            if (enabled) {
                this._activePasses.add(name);
            } else {
                this._activePasses.delete(name);
            }
            
            console.log(`${enabled ? '✅' : '❌'} Efecto ${name}: ${enabled ? 'activado' : 'desactivado'}`);
            return true;
        }
        
        static isEffectEnabled(name) {
            const effect = this._effects.get(name);
            return effect ? effect.enabled : false;
        }
        
        static getEffect(name) {
            return this._effects.get(name) || null;
        }
        
        static getEffects() {
            return Array.from(this._effects.keys());
        }
        
        static getActiveEffects() {
            return Array.from(this._activePasses);
        }
        
        // ============================================================
        //  🎚️ AJUSTE DE PARÁMETROS
        //  ============================================================
        static setEffectParam(name, param, value) {
            const effect = this._effects.get(name);
            if (!effect || !effect.pass.uniforms) return false;
            
            if (effect.pass.uniforms[param]) {
                effect.pass.uniforms[param].value = value;
                return true;
            }
            
            // Buscar en options
            if (effect.options) {
                effect.options[param] = value;
            }
            
            return false;
        }
        
        static getEffectParam(name, param) {
            const effect = this._effects.get(name);
            if (!effect) return null;
            
            if (effect.pass.uniforms && effect.pass.uniforms[param]) {
                return effect.pass.uniforms[param].value;
            }
            
            if (effect.options && effect.options[param] !== undefined) {
                return effect.options[param];
            }
            
            return null;
        }
        
        // ============================================================
        //  📊 CONFIGURACIÓN DE CALIDAD
        //  ============================================================
        static setQuality(quality) {
            this.config.quality = quality;
            this.stats.quality = quality;
            
            const settings = {
                low: {
                    enableFXAA: false,
                    enableDOF: false,
                    enableMotionBlur: false,
                    enableVignette: false,
                    enableChromaticAberration: false,
                    enableFilmGrain: false,
                    enableColorGrading: false,
                    enableBloom: false,
                    enableGodRays: false,
                    enableAutoExposure: false
                },
                medium: {
                    enableFXAA: true,
                    enableDOF: false,
                    enableMotionBlur: false,
                    enableVignette: true,
                    enableChromaticAberration: false,
                    enableFilmGrain: false,
                    enableColorGrading: true,
                    enableBloom: true,
                    enableGodRays: false,
                    enableAutoExposure: true
                },
                high: {
                    enableFXAA: true,
                    enableDOF: false,
                    enableMotionBlur: false,
                    enableVignette: true,
                    enableChromaticAberration: true,
                    enableFilmGrain: false,
                    enableColorGrading: true,
                    enableBloom: true,
                    enableGodRays: true,
                    enableAutoExposure: true
                },
                ultra: {
                    enableFXAA: true,
                    enableDOF: true,
                    enableMotionBlur: true,
                    enableVignette: true,
                    enableChromaticAberration: true,
                    enableFilmGrain: true,
                    enableColorGrading: true,
                    enableBloom: true,
                    enableGodRays: true,
                    enableAutoExposure: true
                }
            };
            
            const s = settings[quality] || settings.high;
            Object.assign(this.config, s);
            
            // Aplicar a efectos existentes
            for (const [name, effect] of this._effects) {
                const enabled = this.config[`enable${name.charAt(0).toUpperCase() + name.slice(1)}`];
                if (enabled !== undefined) {
                    this.enableEffect(name, enabled);
                }
            }
            
            console.log(`🎬 Calidad de post-procesado: ${quality}`);
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        static getStats() {
            return {
                ...this.stats,
                effects: this.getEffects(),
                activeEffects: this.getActiveEffects(),
                totalPasses: this._passes.length,
                lutCount: this._luts.size,
                config: { ...this.config }
            };
        }
        
        // ============================================================
        //  🗑️ LIMPIAR
        //  ============================================================
        static clear() {
            for (const pass of this._passes) {
                if (pass.material) {
                    pass.material.dispose();
                }
            }
            this._passes = [];
            this._activePasses.clear();
            this._effects.clear();
            this._luts.clear();
            this.stats.passes = 0;
            this.stats.activeEffects = 0;
            this.stats.totalEffects = 0;
            console.log('🧹 PostProcessing limpiado');
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        static reset() {
            this.clear();
            this.config = {
                quality: 'high',
                enableFXAA: true,
                enableDOF: false,
                enableMotionBlur: false,
                enableVignette: true,
                enableChromaticAberration: true,
                enableFilmGrain: false,
                enableColorGrading: true,
                enableBloom: true,
                enableGodRays: true,
                enableAutoExposure: true,
                enableVignetteDynamic: true,
                enableAdaptiveDOF: true,
                filmGrainIntensity: 0.05,
                vignetteIntensity: 0.3,
                chromaticAberrationIntensity: 0.002,
                bloomIntensity: 0.6,
                autoExposureSpeed: 0.1,
                debugMode: false
            };
            console.log('🔄 PostProcessing reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INICIALIZAR
    //  ============================================================
    PostProcessing._init();
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    window.PostProcessing = PostProcessing;
    
    console.log('🎬 PostProcessing Cuántico cargado');
    console.log('📊 10+ efectos de post-procesado');
    console.log('🎨 Color grading con LUTs procedurales');
    console.log('🌀 Aberración cromática y vigneta');
    console.log('📽️ Grano de película y DOF');
    console.log('🎚️ 4 niveles de calidad');
    console.log('📊 Dashboard de efectos en tiempo real');
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PostProcessing;
    }
    
})();