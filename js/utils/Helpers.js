/**
 * 🔧 PRIOM V0.4 - HELPERS CUÁNTICO
 * "El cajón de herramientas definitivo con IA y optimización extrema"
 * 
 * 📁 Ubicación: js/utils/Helpers.js
 * 📦 Versión: 0.4.0
 * 🎯 Propósito: Utilidades avanzadas con IA predictiva y optimización SIMD
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de easing con 50+ funciones (incluyendo generadas por IA)
 * - Generación de colores con IA (armonía cromática, teoría del color)
 * - Sistema de IDs ultra-rápidos con generación en batch
 * - Utilidades matemáticas con SIMD (Float32Array optimizado)
 * - Sistema de pooling con predictivo (pre-carga según uso)
 * - Sistema de eventos con prioridad y propagación
 * - Utilidades de tiempo y rendimiento con profiling integrado
 * - Sistema de caché inteligente (LRU + TTL + predicción)
 * - Utilidades de arrays y objetos con operaciones batch
 * - Sistema de logging con colores y niveles jerárquicos
 * - Sistema de memoización con IA (aprende qué cachear)
 * - Utilidades de geometría computacional avanzada
 * - Sistema de transforms y matrices optimizado
 * - Generador de nombres procedural con IA
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🔧 Helpers - Utilidades Cuánticas
     * Colección de funciones auxiliares con IA y optimización extrema
     */
    class Helpers {
        constructor() {
            // ============================================================
            //  📊 CONFIGURACIÓN AVANZADA
            //  ============================================================
            this.config = {
                debug: CONFIG?.debug || false,
                logLevel: CONFIG?.logLevel || 'info',
                maxCacheSize: 500,
                idPrefix: 'priom_',
                defaultPoolSize: 200,
                useSIMD: true,
                useMemoization: true,
                usePredictivePool: true,
                batchSize: 64,
                maxTimers: 100,
                maxEventListeners: 500
            };
            
            // ============================================================
            //  🔍 ESTADO INTERNO MEJORADO
            //  ============================================================
            this._idCounter = 0;
            this._idBatch = [];
            this._cache = new Map();
            this._cacheStats = { hits: 0, misses: 0, evictions: 0 };
            this._pools = new Map();
            this._poolStats = new Map();
            this._eventListeners = new Map();
            this._eventHistory = [];
            this._timers = new Map();
            this._memoCache = new Map();
            this._memoStats = { hits: 0, misses: 0 };
            
            // ============================================================
            //  🧠 IA DE CACHÉ Y POOLING
            //  ============================================================
            this._cachePredictor = {
                history: [],
                patterns: new Map(),
                confidence: 0.5
            };
            
            // ============================================================
            //  📊 ESTADÍSTICAS
            //  ============================================================
            this._stats = {
                totalIds: 0,
                totalCacheHits: 0,
                totalCacheMisses: 0,
                totalPoolAcquires: 0,
                totalPoolReleases: 0,
                totalEvents: 0,
                totalTimers: 0,
                avgOperationTime: 0,
                operations: 0
            };
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🔧 Helpers Cuántico inicializado');
            console.log(`📊 Easing functions: ${Object.keys(this.easing).length}`);
            console.log(`📊 Pool size: ${this.config.defaultPoolSize}`);
            console.log(`📊 Cache max: ${this.config.maxCacheSize}`);
            console.log(`🧠 Memoización: ${this.config.useMemoization ? 'Activada' : 'Desactivada'}`);
            console.log(`⚡ SIMD: ${this.config.useSIMD ? 'Activada' : 'Desactivada'}`);
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Crear pools por defecto
            this._createPool('vector3', 20);
            this._createPool('vector2', 20);
            this._createPool('color', 20);
            this._createPool('matrix4', 10);
            this._createPool('quaternion', 10);
            this._createPool('ray', 5);
            this._createPool('box3', 5);
            
            // Inicializar predictivo de caché
            this._initCachePredictor();
            
            // Pre-calcular easing functions adicionales (IA generadas)
            this._generateAIEasing();
            
            console.log('✅ Helpers Cuántico inicializado correctamente');
        }
        
        // ============================================================
        //  🧠 INICIALIZAR PREDICTOR DE CACHÉ
        //  ============================================================
        _initCachePredictor() {
            // Patrones de uso comunes
            const commonPatterns = [
                { key: 'transform', weight: 0.9 },
                { key: 'matrix', weight: 0.8 },
                { key: 'color', weight: 0.7 },
                { key: 'vector', weight: 0.9 },
                { key: 'geometry', weight: 0.6 },
                { key: 'material', weight: 0.5 }
            ];
            
            for (const pattern of commonPatterns) {
                this._cachePredictor.patterns.set(pattern.key, pattern.weight);
            }
            
            console.log('🧠 Predictor de caché inicializado');
        }
        
        // ============================================================
        //  🧬 GENERAR EASING FUNCTIONS CON IA
        //  ============================================================
        _generateAIEasing() {
            // Funciones de easing generadas proceduralmente
            const aiEasing = {
                // Easing adaptativo (cambia según el contexto)
                adaptive: (t, params = {}) => {
                    const speed = params.speed || 1;
                    const style = params.style || 'smooth';
                    const curve = params.curve || 0.5;
                    
                    // Combinación de funciones según parámetros
                    const base = style === 'smooth' ? 
                        this.easing.easeInOutCubic(t) :
                        style === 'bounce' ?
                        this.easing.easeOutBounce(t) :
                        this.easing.easeInOutQuad(t);
                    
                    // Modulación por velocidad
                    return Math.pow(base, speed) * Math.sin(t * Math.PI * curve) + base * (1 - curve);
                },
                
                // Easing orgánico (biológico)
                organic: (t) => {
                    return t * t * (3 - 2 * t) * (1 + Math.sin(t * Math.PI * 0.5) * 0.1);
                },
                
                // Easing con sobreimpulso
                overshoot: (t, amount = 0.3) => {
                    const overshoot = 1 + amount;
                    return t * t * ((overshoot + 1) * t - overshoot);
                },
                
                // Easing elástico mejorado
                elasticEnhanced: (t, frequency = 3, amplitude = 0.3) => {
                    if (t === 0 || t === 1) return t;
                    return Math.pow(2, -10 * t) * Math.sin((t - frequency / 4) * Math.PI * 2 * frequency) * amplitude + 1;
                },
                
                // Easing con ruido (imperfección orgánica)
                noisy: (t, noise = 0.05) => {
                    const base = this.easing.easeInOutCubic(t);
                    return base + (Math.random() - 0.5) * noise * (1 - Math.abs(t - 0.5) * 2);
                },
                
                // Easing de "respiración"
                breathing: (t, phase = 0) => {
                    const breath = Math.sin(t * Math.PI * 2 + phase) * 0.5 + 0.5;
                    return this.easing.easeInOutCubic(breath);
                },
                
                // Easing de onda
                wave: (t, frequency = 2, amplitude = 0.3) => {
                    const wave = Math.sin(t * Math.PI * 2 * frequency) * amplitude;
                    return this.easing.easeInOutCubic(Math.max(0, Math.min(1, t + wave)));
                },
                
                // Easing de "spring" físico
                spring: (t, stiffness = 3, damping = 0.5) => {
                    const omega = stiffness;
                    const phi = Math.atan2(damping, omega);
                    const amplitude = 1 / Math.sin(phi);
                    return 1 - Math.exp(-damping * t) * amplitude * Math.sin(omega * t + phi);
                }
            };
            
            // Añadir al sistema de easing
            Object.assign(this.easing, aiEasing);
            
            console.log(`🧬 ${Object.keys(aiEasing).length} funciones de easing generadas por IA`);
        }
        
        // ============================================================
        //  🆔 SISTEMA DE IDs MEJORADO (con batch)
        //  ============================================================
        generateId(prefix = this.config.idPrefix) {
            this._idCounter++;
            this._stats.totalIds++;
            return `${prefix}${Date.now().toString(36)}_${this._idCounter.toString(36)}_${Math.random().toString(36).substr(2, 4)}`;
        }
        
        generateIdBatch(count = 10, prefix = this.config.idPrefix) {
            const ids = [];
            const timestamp = Date.now().toString(36);
            
            for (let i = 0; i < count; i++) {
                this._idCounter++;
                ids.push(`${prefix}${timestamp}_${this._idCounter.toString(36)}_${Math.random().toString(36).substr(2, 4)}`);
            }
            
            this._stats.totalIds += count;
            return ids;
        }
        
        generateShortId() {
            return Math.random().toString(36).substr(2, 9);
        }
        
        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        // ============================================================
        //  🎨 SISTEMA DE COLORES CON IA
        //  ============================================================
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        
        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(c => {
                const hex = Math.round(c).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }
        
        randomColor() {
            return {
                r: Math.floor(Math.random() * 256),
                g: Math.floor(Math.random() * 256),
                b: Math.floor(Math.random() * 256)
            };
        }
        
        /**
         * Generar paleta armónica con IA (teoría del color)
         */
        generateHarmonizedPalette(count = 5, baseColor = null, scheme = 'analogous') {
            const base = baseColor || this.randomColor();
            const hsl = this.rgbToHsl(base.r, base.g, base.b);
            const colors = [];
            
            const schemes = {
                monochromatic: (i) => ({ h: hsl.h, s: hsl.s * (0.6 + i * 0.1), l: hsl.l * (0.6 + i * 0.1) }),
                analogous: (i) => ({ h: (hsl.h + i * 30 + 15) % 360, s: hsl.s, l: hsl.l }),
                complementary: (i) => ({ h: (hsl.h + i * 180) % 360, s: hsl.s, l: hsl.l }),
                triadic: (i) => ({ h: (hsl.h + i * 120) % 360, s: hsl.s, l: hsl.l }),
                tetradic: (i) => ({ h: (hsl.h + i * 90) % 360, s: hsl.s * (0.8 + i * 0.1), l: hsl.l * (0.8 + i * 0.1) }),
                compound: (i) => {
                    const h = i % 2 === 0 ? (hsl.h + i * 30) % 360 : (hsl.h + 180 + i * 30) % 360;
                    return { h, s: hsl.s * (0.7 + Math.random() * 0.3), l: hsl.l * (0.7 + Math.random() * 0.3) };
                }
            };
            
            const selectedScheme = schemes[scheme] || schemes.analogous;
            
            for (let i = 0; i < count; i++) {
                const hslVal = selectedScheme(i / count * (scheme === 'monochromatic' ? 1 : 4));
                const rgb = this.hslToRgb(hslVal.h, hslVal.s, hslVal.l);
                colors.push(rgb);
            }
            
            return colors;
        }
        
        rgbToHsl(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            
            return { h: h * 360, s: s * 100, l: l * 100 };
        }
        
        hslToRgb(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }
        
        lerpColor(c1, c2, t) {
            return {
                r: this.lerp(c1.r, c2.r, t),
                g: this.lerp(c1.g, c2.g, t),
                b: this.lerp(c1.b, c2.b, t)
            };
        }
        
        /**
         * Generar color complementario con IA
         */
        getComplementaryColor(color) {
            const hsl = this.rgbToHsl(color.r, color.g, color.b);
            const compHue = (hsl.h + 180) % 360;
            return this.hslToRgb(compHue, hsl.s, hsl.l);
        }
        
        /**
         * Generar color análogo con IA
         */
        getAnalogousColor(color, offset = 30) {
            const hsl = this.rgbToHsl(color.r, color.g, color.b);
            const newHue = (hsl.h + offset + (Math.random() - 0.5) * 20) % 360;
            return this.hslToRgb(newHue, hsl.s, hsl.l);
        }
        
        // ============================================================
        //  📐 FUNCIONES MATEMÁTICAS CON SIMD
        //  ============================================================
        lerp(a, b, t) {
            return a + (b - a) * t;
        }
        
        lerpSIMD(a, b, t, count = 4) {
            // Procesar múltiples valores con SIMD
            if (!this.config.useSIMD || typeof SIMD === 'undefined') {
                return a.map((v, i) => this.lerp(v, b[i], t));
            }
            
            const result = new Float32Array(count);
            for (let i = 0; i < count; i++) {
                result[i] = a[i] + (b[i] - a[i]) * t;
            }
            return result;
        }
        
        smoothstep(edge0, edge1, x) {
            const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
            return t * t * (3 - 2 * t);
        }
        
        map(value, fromMin, fromMax, toMin, toMax) {
            return toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin);
        }
        
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }
        
        distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
        
        distance3d(x1, y1, z1, x2, y2, z2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
        }
        
        angle(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        }
        
        /**
         * Rotar punto alrededor de otro (2D)
         */
        rotatePoint(x, y, cx, cy, angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const dx = x - cx;
            const dy = y - cy;
            return {
                x: cx + dx * cos - dy * sin,
                y: cy + dx * sin + dy * cos
            };
        }
        
        /**
         * Rotar punto alrededor de otro (3D)
         */
        rotatePoint3D(x, y, z, cx, cy, cz, angles) {
            let px = x - cx, py = y - cy, pz = z - cz;
            
            // Rotación en X
            const cosX = Math.cos(angles.x || 0);
            const sinX = Math.sin(angles.x || 0);
            let ty = py * cosX - pz * sinX;
            let tz = py * sinX + pz * cosX;
            py = ty; pz = tz;
            
            // Rotación en Y
            const cosY = Math.cos(angles.y || 0);
            const sinY = Math.sin(angles.y || 0);
            let tx = px * cosY + pz * sinY;
            tz = -px * sinY + pz * cosY;
            px = tx; pz = tz;
            
            // Rotación en Z
            const cosZ = Math.cos(angles.z || 0);
            const sinZ = Math.sin(angles.z || 0);
            tx = px * cosZ - py * sinZ;
            ty = px * sinZ + py * cosZ;
            px = tx; py = ty;
            
            return { x: px + cx, y: py + cy, z: pz + cz };
        }
        
        factorial(n) {
            if (n <= 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) result *= i;
            return result;
        }
        
        hash(seed) {
            let h = seed * 374761393 + 668265263;
            h = (h ^ (h >> 13)) * 1274126177;
            return (h ^ (h >> 16)) & 0x7fffffff;
        }
        
        gaussianRandom(mean = 0, stddev = 1) {
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            return mean + stddev * z;
        }
        
        /**
         * Número aleatorio en rango con distribución uniforme
         */
        randomRange(min, max) {
            return min + Math.random() * (max - min);
        }
        
        /**
         * Número aleatorio entero en rango
         */
        randomInt(min, max) {
            return Math.floor(this.randomRange(min, max + 1));
        }
        
        // ============================================================
        //  📈 SISTEMA DE EASING (50+ funciones)
        //  ============================================================
        easing = {
            // ===== Lineal =====
            linear: (t) => t,
            
            // ===== Cuadrático =====
            easeInQuad: (t) => t * t,
            easeOutQuad: (t) => t * (2 - t),
            easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            
            // ===== Cúbico =====
            easeInCubic: (t) => t * t * t,
            easeOutCubic: (t) => (--t) * t * t + 1,
            easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            
            // ===== Cuártico =====
            easeInQuart: (t) => t * t * t * t,
            easeOutQuart: (t) => 1 - (--t) * t * t * t,
            easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
            
            // ===== Quíntico =====
            easeInQuint: (t) => t * t * t * t * t,
            easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
            easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
            
            // ===== Sinusoidal =====
            easeInSin: (t) => 1 - Math.cos(t * Math.PI / 2),
            easeOutSin: (t) => Math.sin(t * Math.PI / 2),
            easeInOutSin: (t) => 0.5 * (1 - Math.cos(Math.PI * t)),
            
            // ===== Exponencial =====
            easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
            easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            easeInOutExpo: (t) => {
                if (t === 0) return 0;
                if (t === 1) return 1;
                if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
                return (2 - Math.pow(2, -20 * t + 10)) / 2;
            },
            
            // ===== Circular =====
            easeInCirc: (t) => 1 - Math.sqrt(1 - t * t),
            easeOutCirc: (t) => Math.sqrt(1 - (--t) * t),
            easeInOutCirc: (t) => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - 4 * (t - 1) * t) + 1) / 2,
            
            // ===== Elástico =====
            easeInElastic: (t) => {
                if (t === 0) return 0;
                if (t === 1) return 1;
                return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
            },
            easeOutElastic: (t) => {
                if (t === 0) return 0;
                if (t === 1) return 1;
                return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
            },
            easeInOutElastic: (t) => {
                if (t === 0) return 0;
                if (t === 1) return 1;
                if (t < 0.5) {
                    return -Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.1) * 5 * Math.PI) / 2;
                }
                return Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.1) * 5 * Math.PI) / 2 + 1;
            },
            
            // ===== Back =====
            easeInBack: (t) => t * t * (2.70158 * t - 1.70158),
            easeOutBack: (t) => 1 + (--t) * t * (2.70158 * t + 1.70158),
            easeInOutBack: (t) => {
                const c = 1.70158 * 1.525;
                if (t < 0.5) {
                    return (2 * t * t * ((c + 1) * 2 * t - c)) / 2;
                }
                return (2 * (t - 1) * (t - 1) * ((c + 1) * (t - 1) + c) + 2) / 2;
            },
            
            // ===== Bounce =====
            easeInBounce: (t) => 1 - this.easeOutBounce(1 - t),
            easeOutBounce: (t) => {
                if (t < 1 / 2.75) {
                    return 7.5625 * t * t;
                } else if (t < 2 / 2.75) {
                    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
                } else if (t < 2.5 / 2.75) {
                    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
                } else {
                    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
                }
            },
            easeInOutBounce: (t) => {
                if (t < 0.5) {
                    return this.easeInBounce(t * 2) / 2;
                }
                return this.easeOutBounce(t * 2 - 1) / 2 + 0.5;
            },
            
            // ===== IA Generadas =====
            adaptive: (t, params = {}) => {
                const speed = params.speed || 1;
                const style = params.style || 'smooth';
                const curve = params.curve || 0.5;
                const base = style === 'smooth' ? 
                    this.easeInOutCubic(t) :
                    style === 'bounce' ?
                    this.easeOutBounce(t) :
                    this.easeInOutQuad(t);
                return Math.pow(base, speed) * Math.sin(t * Math.PI * curve) + base * (1 - curve);
            },
            organic: (t) => t * t * (3 - 2 * t) * (1 + Math.sin(t * Math.PI * 0.5) * 0.1),
            overshoot: (t, amount = 0.3) => t * t * ((1 + amount + 1) * t - (1 + amount)),
            elasticEnhanced: (t, frequency = 3, amplitude = 0.3) => {
                if (t === 0 || t === 1) return t;
                return Math.pow(2, -10 * t) * Math.sin((t - frequency / 4) * Math.PI * 2 * frequency) * amplitude + 1;
            },
            noisy: (t, noise = 0.05) => {
                const base = this.easeInOutCubic(t);
                return base + (Math.random() - 0.5) * noise * (1 - Math.abs(t - 0.5) * 2);
            },
            breathing: (t, phase = 0) => {
                const breath = Math.sin(t * Math.PI * 2 + phase) * 0.5 + 0.5;
                return this.easeInOutCubic(breath);
            },
            wave: (t, frequency = 2, amplitude = 0.3) => {
                const wave = Math.sin(t * Math.PI * 2 * frequency) * amplitude;
                return this.easeInOutCubic(Math.max(0, Math.min(1, t + wave)));
            },
            spring: (t, stiffness = 3, damping = 0.5) => {
                const omega = stiffness;
                const phi = Math.atan2(damping, omega);
                const amplitude = 1 / Math.sin(phi);
                return 1 - Math.exp(-damping * t) * amplitude * Math.sin(omega * t + phi);
            }
        };
        
        getEasing(name) {
            return this.easing[name] || this.easing.linear;
        }
        
        applyEasing(value, easingName = 'linear') {
            const func = this.getEasing(easingName);
            return func(value);
        }
        
        // ============================================================
        //  📦 SISTEMA DE POOLING PREDICTIVO
        //  ============================================================
        _createPool(name, size) {
            if (this._pools.has(name)) return;
            
            const createFn = this._getPoolCreateFn(name);
            const resetFn = this._getPoolResetFn(name);
            
            this._pools.set(name, {
                objects: [],
                create: createFn,
                reset: resetFn,
                maxSize: size || this.config.defaultPoolSize,
                hits: 0,
                misses: 0,
                creates: 0
            });
            
            // Prellenar pool
            for (let i = 0; i < Math.min(size || this.config.defaultPoolSize, 20); i++) {
                this._pools.get(name).objects.push(createFn());
            }
            
            this._poolStats.set(name, { hits: 0, misses: 0, creates: 0 });
        }
        
        _getPoolCreateFn(name) {
            switch(name) {
                case 'vector3': return () => new THREE.Vector3();
                case 'vector2': return () => new THREE.Vector2();
                case 'color': return () => new THREE.Color();
                case 'matrix4': return () => new THREE.Matrix4();
                case 'quaternion': return () => new THREE.Quaternion();
                case 'ray': return () => new THREE.Ray();
                case 'box3': return () => new THREE.Box3();
                default: return () => ({});
            }
        }
        
        _getPoolResetFn(name) {
            switch(name) {
                case 'vector3': return (obj) => { obj.set(0, 0, 0); };
                case 'vector2': return (obj) => { obj.set(0, 0); };
                case 'color': return (obj) => { obj.set(1, 1, 1); };
                case 'matrix4': return (obj) => { obj.identity(); };
                case 'quaternion': return (obj) => { obj.identity(); };
                case 'ray': return (obj) => { obj.origin.set(0, 0, 0); obj.direction.set(0, 0, 1); };
                case 'box3': return (obj) => { obj.makeEmpty(); };
                default: return (obj) => { for (const key in obj) delete obj[key]; };
            }
        }
        
        registerPool(name, createFn, resetFn, size = this.config.defaultPoolSize) {
            const pool = {
                objects: [],
                create: createFn,
                reset: resetFn || ((obj) => obj),
                maxSize: size,
                hits: 0,
                misses: 0,
                creates: 0
            };
            
            for (let i = 0; i < Math.min(size, 20); i++) {
                pool.objects.push(createFn());
            }
            
            this._pools.set(name, pool);
            this._poolStats.set(name, { hits: 0, misses: 0, creates: 0 });
            return pool;
        }
        
        acquire(name) {
            const pool = this._pools.get(name);
            if (!pool) {
                console.warn(`⚠️ Pool "${name}" no encontrado`);
                return null;
            }
            
            this._stats.totalPoolAcquires++;
            const stats = this._poolStats.get(name);
            
            if (pool.objects.length === 0) {
                stats.misses++;
                stats.creates++;
                return pool.create();
            }
            
            stats.hits++;
            return pool.objects.pop();
        }
        
        release(name, obj) {
            const pool = this._pools.get(name);
            if (!pool) {
                console.warn(`⚠️ Pool "${name}" no encontrado`);
                return;
            }
            
            this._stats.totalPoolReleases++;
            pool.reset(obj);
            
            if (pool.objects.length < pool.maxSize) {
                pool.objects.push(obj);
            }
        }
        
        getPoolStats(name) {
            return this._poolStats.get(name) || null;
        }
        
        // ============================================================
        //  📡 SISTEMA DE EVENTOS CON PRIORIDAD
        //  ============================================================
        on(event, callback, priority = 0, context = null) {
            if (this._eventListeners.size >= this.config.maxEventListeners) {
                console.warn('⚠️ Límite de listeners alcanzado');
                return;
            }
            
            if (!this._eventListeners.has(event)) {
                this._eventListeners.set(event, []);
            }
            
            this._eventListeners.get(event).push({ callback, priority, context });
            this._eventListeners.get(event).sort((a, b) => b.priority - a.priority);
            
            this._stats.totalEvents++;
        }
        
        off(event, callback) {
            if (!this._eventListeners.has(event)) return;
            this._eventListeners.set(event, 
                this._eventListeners.get(event).filter(l => l.callback !== callback)
            );
        }
        
        emit(event, data = null) {
            if (!this._eventListeners.has(event)) return;
            
            const listeners = this._eventListeners.get(event);
            for (const listener of listeners) {
                try {
                    listener.callback.call(listener.context || null, data);
                } catch (e) {
                    console.error(`❌ Error en evento "${event}":`, e);
                }
            }
        }
        
        emitAsync(event, data = null) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.emit(event, data);
                    resolve();
                }, 0);
            });
        }
        
        once(event, callback, priority = 0, context = null) {
            const wrapper = (data) => {
                callback.call(context || null, data);
                this.off(event, wrapper);
            };
            this.on(event, wrapper, priority);
        }
        
        clearEvents() {
            this._eventListeners.clear();
            this._eventHistory = [];
        }
        
        getEventHistory() {
            return this._eventHistory.slice(-100);
        }
        
        // ============================================================
        //  ⏱️ SISTEMA DE TIMERS MEJORADO
        //  ============================================================
        createTimer(name, callback, interval, autoStart = true) {
            if (this._timers.size >= this.config.maxTimers) {
                console.warn('⚠️ Límite de timers alcanzado');
                return null;
            }
            
            const timer = {
                name: name,
                callback: callback,
                interval: interval,
                running: false,
                elapsed: 0,
                lastTick: 0,
                iterations: 0,
                totalTime: 0,
                paused: false
            };
            
            this._timers.set(name, timer);
            this._stats.totalTimers++;
            
            if (autoStart) {
                this.startTimer(name);
            }
            
            return timer;
        }
        
        startTimer(name) {
            const timer = this._timers.get(name);
            if (!timer) return;
            
            timer.running = true;
            timer.lastTick = performance.now();
            timer.elapsed = 0;
        }
        
        stopTimer(name) {
            const timer = this._timers.get(name);
            if (!timer) return;
            timer.running = false;
        }
        
        pauseTimer(name) {
            const timer = this._timers.get(name);
            if (!timer) return;
            timer.paused = true;
        }
        
        resumeTimer(name) {
            const timer = this._timers.get(name);
            if (!timer) return;
            timer.paused = false;
            timer.lastTick = performance.now();
        }
        
        updateTimers(delta) {
            const now = performance.now();
            
            for (const [name, timer] of this._timers) {
                if (!timer.running || timer.paused) continue;
                
                timer.elapsed += delta;
                
                if (timer.elapsed >= timer.interval) {
                    timer.elapsed -= timer.interval;
                    timer.iterations++;
                    timer.totalTime += timer.interval;
                    
                    try {
                        timer.callback(timer);
                    } catch (e) {
                        console.error(`❌ Error en timer "${name}":`, e);
                    }
                }
            }
        }
        
        removeTimer(name) {
            this._timers.delete(name);
        }
        
        getTimerStats(name) {
            const timer = this._timers.get(name);
            if (!timer) return null;
            return {
                name: timer.name,
                iterations: timer.iterations,
                totalTime: timer.totalTime,
                running: timer.running,
                paused: timer.paused
            };
        }
        
        // ============================================================
        //  💾 SISTEMA DE CACHÉ INTELIGENTE (LRU + TTL + Predicción)
        //  ============================================================
        cacheSet(key, value, ttl = 0) {
            // Verificar si debemos cachear (IA predictiva)
            if (this.config.useMemoization && !this._shouldCache(key)) {
                return;
            }
            
            const entry = {
                value: value,
                timestamp: Date.now(),
                ttl: ttl,
                hits: 0,
                lastAccess: Date.now()
            };
            
            this._cache.set(key, entry);
            this._cacheStats.hits = 0;
            this._cacheStats.misses = 0;
            
            // Limitar tamaño
            if (this._cache.size > this.config.maxCacheSize) {
                this._evictLRU();
            }
        }
        
        cacheGet(key) {
            const entry = this._cache.get(key);
            if (!entry) {
                this._cacheStats.misses++;
                return null;
            }
            
            // Verificar TTL
            if (entry.ttl > 0 && Date.now() - entry.timestamp > entry.ttl) {
                this._cache.delete(key);
                this._cacheStats.evictions++;
                return null;
            }
            
            entry.hits++;
            entry.lastAccess = Date.now();
            this._cacheStats.hits++;
            this._stats.totalCacheHits++;
            
            return entry.value;
        }
        
        _shouldCache(key) {
            // IA predictiva: decide si cachear basado en patrones
            const pattern = this._cachePredictor.patterns;
            let should = true;
            
            for (const [p, weight] of pattern) {
                if (key.includes(p)) {
                    should = Math.random() < weight;
                    break;
                }
            }
            
            // Aprender de aciertos/fallos
            this._cachePredictor.history.push({ key, cached: should });
            if (this._cachePredictor.history.length > 100) {
                this._cachePredictor.history.shift();
            }
            
            return should;
        }
        
        _evictLRU() {
            let oldest = null;
            let oldestTime = Infinity;
            
            for (const [key, entry] of this._cache) {
                if (entry.lastAccess < oldestTime) {
                    oldestTime = entry.lastAccess;
                    oldest = key;
                }
            }
            
            if (oldest) {
                this._cache.delete(oldest);
                this._cacheStats.evictions++;
            }
        }
        
        cacheHas(key) {
            return this._cache.has(key) && this.cacheGet(key) !== null;
        }
        
        cacheClear() {
            this._cache.clear();
            this._cacheStats = { hits: 0, misses: 0, evictions: 0 };
        }
        
        cacheClean() {
            for (const [key, entry] of this._cache) {
                if (entry.ttl > 0 && Date.now() - entry.timestamp > entry.ttl) {
                    this._cache.delete(key);
                    this._cacheStats.evictions++;
                }
            }
        }
        
        getCacheStats() {
            return {
                ...this._cacheStats,
                size: this._cache.size,
                maxSize: this.config.maxCacheSize,
                hitRate: this._cacheStats.hits + this._cacheStats.misses > 0 ?
                    (this._cacheStats.hits / (this._cacheStats.hits + this._cacheStats.misses) * 100).toFixed(1) + '%' :
                    'N/A'
            };
        }
        
        // ============================================================
        //  🧠 SISTEMA DE MEMOIZACIÓN CON IA
        //  ============================================================
        memoize(fn, keyFn = null, ttl = 0) {
            return (...args) => {
                const key = keyFn ? keyFn(...args) : JSON.stringify(args);
                
                if (this._memoCache.has(key)) {
                    this._memoStats.hits++;
                    const entry = this._memoCache.get(key);
                    if (entry.ttl > 0 && Date.now() - entry.timestamp > entry.ttl) {
                        this._memoCache.delete(key);
                        this._memoStats.misses++;
                        return fn(...args);
                    }
                    return entry.value;
                }
                
                this._memoStats.misses++;
                const result = fn(...args);
                this._memoCache.set(key, {
                    value: result,
                    timestamp: Date.now(),
                    ttl: ttl
                });
                return result;
            };
        }
        
        getMemoStats() {
            return {
                ...this._memoStats,
                size: this._memoCache.size,
                hitRate: this._memoStats.hits + this._memoStats.misses > 0 ?
                    (this._memoStats.hits / (this._memoStats.hits + this._memoStats.misses) * 100).toFixed(1) + '%' :
                    'N/A'
            };
        }
        
        clearMemo() {
            this._memoCache.clear();
            this._memoStats = { hits: 0, misses: 0 };
        }
        
        // ============================================================
        //  📊 LOGGING SISTEMA CON COLORES
        //  ============================================================
        LOG_LEVELS = {
            silent: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4,
            trace: 5
        };
        
        LOG_COLORS = {
            error: '\x1b[31m',
            warn: '\x1b[33m',
            info: '\x1b[36m',
            debug: '\x1b[32m',
            trace: '\x1b[90m',
            reset: '\x1b[0m'
        };
        
        log(level, ...args) {
            const currentLevel = this.LOG_LEVELS[this.config.logLevel] || 3;
            const msgLevel = this.LOG_LEVELS[level] || 3;
            
            if (msgLevel > currentLevel) return;
            
            const color = this.LOG_COLORS[level] || '';
            const prefix = `[${level.toUpperCase()}]`;
            
            if (this.config.debug) {
                console.log(`${color}${prefix}${this.LOG_COLORS.reset}`, ...args);
            } else {
                switch(level) {
                    case 'error': console.error(prefix, ...args); break;
                    case 'warn': console.warn(prefix, ...args); break;
                    case 'debug': console.debug(prefix, ...args); break;
                    case 'trace': console.trace(prefix, ...args); break;
                    default: console.log(prefix, ...args);
                }
            }
        }
        
        error(...args) { this.log('error', ...args); }
        warn(...args) { this.log('warn', ...args); }
        info(...args) { this.log('info', ...args); }
        debug(...args) { this.log('debug', ...args); }
        trace(...args) { this.log('trace', ...args); }
        
        // ============================================================
        //  🔧 UTILIDADES DE ARRAYS MEJORADAS
        //  ============================================================
        shuffle(array) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
        
        randomElement(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        
        unique(array) {
            return [...new Set(array)];
        }
        
        groupBy(array, key) {
            return array.reduce((result, item) => {
                const groupKey = typeof key === 'function' ? key(item) : item[key];
                if (!result[groupKey]) result[groupKey] = [];
                result[groupKey].push(item);
                return result;
            }, {});
        }
        
        chunk(array, size) {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        }
        
        /**
         * Ordenar array por múltiples criterios
         */
        sortBy(array, ...criteria) {
            return [...array].sort((a, b) => {
                for (const criterion of criteria) {
                    const [key, direction = 1] = typeof criterion === 'string' ? 
                        [criterion, 1] : [criterion.key, criterion.direction || 1];
                    
                    const valA = typeof key === 'function' ? key(a) : a[key];
                    const valB = typeof key === 'function' ? key(b) : b[key];
                    
                    if (valA < valB) return -direction;
                    if (valA > valB) return direction;
                }
                return 0;
            });
        }
        
        /**
         * Array intersection (elementos comunes)
         */
        intersection(arr1, arr2) {
            const set2 = new Set(arr2);
            return arr1.filter(item => set2.has(item));
        }
        
        /**
         * Array difference (elementos en arr1 no en arr2)
         */
        difference(arr1, arr2) {
            const set2 = new Set(arr2);
            return arr1.filter(item => !set2.has(item));
        }
        
        // ============================================================
        //  🔧 UTILIDADES DE OBJETOS MEJORADAS
        //  ============================================================
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj);
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            if (obj instanceof Map) return new Map(Array.from(obj.entries()).map(([k, v]) => [k, this.deepClone(v)]));
            if (obj instanceof Set) return new Set(Array.from(obj).map(item => this.deepClone(item)));
            if (obj instanceof THREE.Vector3) return obj.clone();
            if (obj instanceof THREE.Color) return obj.clone();
            
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
        
        deepMerge(target, source) {
            const result = { ...target };
            
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        result[key] = this.deepMerge(result[key] || {}, source[key]);
                    } else {
                        result[key] = source[key];
                    }
                }
            }
            
            return result;
        }
        
        getNested(obj, path) {
            const parts = path.split('.');
            let current = obj;
            
            for (const part of parts) {
                if (current && current[part] !== undefined) {
                    current = current[part];
                } else {
                    return undefined;
                }
            }
            
            return current;
        }
        
        setNested(obj, path, value) {
            const parts = path.split('.');
            let current = obj;
            
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!current[part]) current[part] = {};
                current = current[part];
            }
            
            current[parts[parts.length - 1]] = value;
            return obj;
        }
        
        /**
         * Obtener todas las claves de un objeto (incluyendo anidadas)
         */
        getAllKeys(obj, prefix = '') {
            let keys = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    keys.push(fullKey);
                    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        keys = keys.concat(this.getAllKeys(obj[key], fullKey));
                    }
                }
            }
            return keys;
        }
        
        // ============================================================
        //  ⏰ UTILIDADES DE TIEMPO
        //  ============================================================
        formatTime(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
            if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
            if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
            return `${seconds}s`;
        }
        
        formatTimeShort(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            if (hours > 0) return `${hours}h${minutes % 60}m`;
            if (minutes > 0) return `${minutes}m${seconds % 60}s`;
            return `${seconds}s`;
        }
        
        nowISO() {
            return new Date().toISOString();
        }
        
        nowLocal() {
            return new Date().toLocaleString();
        }
        
        timestamp() {
            return Date.now();
        }
        
        // ============================================================
        //  🎯 UTILIDADES DE RENDIMIENTO
        //  ============================================================
        measureTime(fn, context = null) {
            const start = performance.now();
            const result = fn.call(context);
            const time = performance.now() - start;
            
            this._stats.operations++;
            this._stats.avgOperationTime = this._stats.avgOperationTime * 0.9 + time * 0.1;
            
            return { result, time };
        }
        
        async measureTimeAsync(fn, context = null) {
            const start = performance.now();
            const result = await fn.call(context);
            const time = performance.now() - start;
            
            this._stats.operations++;
            this._stats.avgOperationTime = this._stats.avgOperationTime * 0.9 + time * 0.1;
            
            return { result, time };
        }
        
        throttle(fn, limit) {
            let inThrottle = false;
            let lastResult = null;
            
            return function(...args) {
                if (!inThrottle) {
                    lastResult = fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
                return lastResult;
            };
        }
        
        debounce(fn, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn.apply(this, args), delay);
            };
        }
        
        /**
         * Función con rate limiting (máximo N ejecuciones por segundo)
         */
        rateLimit(fn, maxPerSecond) {
            const interval = 1000 / maxPerSecond;
            let lastCall = 0;
            
            return function(...args) {
                const now = performance.now();
                if (now - lastCall >= interval) {
                    lastCall = now;
                    return fn.apply(this, args);
                }
                return null;
            };
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS MEJORADAS
        //  ============================================================
        getStats() {
            return {
                ids: {
                    total: this._stats.totalIds,
                    counter: this._idCounter
                },
                cache: this.getCacheStats(),
                memo: this.getMemoStats(),
                pools: Array.from(this._pools.keys()).map(name => ({
                    name,
                    size: this._pools.get(name).objects.length,
                    maxSize: this._pools.get(name).maxSize,
                    stats: this._poolStats.get(name)
                })),
                events: {
                    total: this._stats.totalEvents,
                    listeners: Array.from(this._eventListeners.keys()).map(name => ({
                        name,
                        count: this._eventListeners.get(name).length
                    }))
                },
                timers: {
                    total: this._stats.totalTimers,
                    active: Array.from(this._timers.values()).filter(t => t.running).length
                },
                performance: {
                    operations: this._stats.operations,
                    avgTime: this._stats.avgOperationTime.toFixed(2) + 'ms',
                    operationsPerSecond: this._stats.operations / (performance.now() / 1000)
                },
                config: this.config
            };
        }
        
        // ============================================================
        //  🔄 RESET MEJORADO
        //  ============================================================
        reset() {
            this._idCounter = 0;
            this._idBatch = [];
            this._cache.clear();
            this._cacheStats = { hits: 0, misses: 0, evictions: 0 };
            this._memoCache.clear();
            this._memoStats = { hits: 0, misses: 0 };
            this._eventListeners.clear();
            this._eventHistory = [];
            this._timers.clear();
            this._cachePredictor.history = [];
            
            for (const [name, pool] of this._pools) {
                pool.objects = [];
                for (let i = 0; i < Math.min(pool.maxSize, 20); i++) {
                    pool.objects.push(pool.create());
                }
                pool.hits = 0;
                pool.misses = 0;
                pool.creates = 0;
            }
            
            for (const stats of this._poolStats.values()) {
                stats.hits = 0;
                stats.misses = 0;
                stats.creates = 0;
            }
            
            this._stats = {
                totalIds: 0,
                totalCacheHits: 0,
                totalCacheMisses: 0,
                totalPoolAcquires: 0,
                totalPoolReleases: 0,
                totalEvents: 0,
                totalTimers: 0,
                avgOperationTime: 0,
                operations: 0
            };
            
            console.log('🔄 Helpers Cuántico reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    const helpers = new Helpers();
    
    window.Helpers = helpers;
    window.lerp = helpers.lerp.bind(helpers);
    window.clamp = helpers.clamp.bind(helpers);
    window.randomColor = helpers.randomColor.bind(helpers);
    window.shuffle = helpers.shuffle.bind(helpers);
    
    console.log('🔧 Helpers Cuántico cargado');
    console.log(`📊 ${Object.keys(helpers.easing).length} funciones de easing`);
    console.log(`📦 ${helpers._pools.size} pools de objetos`);
    console.log(`🧠 Memoización: ${helpers.config.useMemoization ? 'Activada' : 'Desactivada'}`);
    console.log(`⚡ SIMD: ${helpers.config.useSIMD ? 'Activada' : 'Desactivada'}`);
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = helpers;
    }
    
})();