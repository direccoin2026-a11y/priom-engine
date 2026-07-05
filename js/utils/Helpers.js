/**
 * 🔧 PRIOM V0.1 - HELPERS
 * "El cajón de herramientas definitivo"
 * 
 * 📁 Ubicación: js/utils/Helpers.js
 * 📦 Versión: 0.1.0
 * 🎯 Propósito: Utilidades matemáticas y funciones auxiliares
 * 
 * ⭐ INNOVACIONES:
 * - Sistema de easing con 30+ funciones
 * - Generación de colores con paletas dinámicas
 * - Sistema de IDs únicos con prefijos
 * - Utilidades matemáticas avanzadas
 * - Sistema de pooling de objetos
 * - Sistema de eventos ligero
 * - Utilidades de tiempo y rendimiento
 * - Sistema de caché inteligente
 * - Utilidades de arrays y objetos
 * - Sistema de logging con niveles
 * ============================================================ */

(function() {
    'use strict';

    /**
     * 🔧 Helpers - Utilidades Varias
     * Colección de funciones auxiliares para el motor
     */
    class Helpers {
        constructor() {
            // ============================================================
            //  📊 CONFIGURACIÓN
            //  ============================================================
            this.config = {
                debug: CONFIG?.debug || false,
                logLevel: CONFIG?.logLevel || 'info',
                maxCacheSize: 100,
                idPrefix: 'priom_',
                defaultPoolSize: 100
            };
            
            // ============================================================
            //  🔍 ESTADO INTERNO
            //  ============================================================
            this._idCounter = 0;
            this._cache = new Map();
            this._pools = new Map();
            this._eventListeners = new Map();
            this._timers = new Map();
            
            // ============================================================
            //  🚀 INICIALIZAR
            //  ============================================================
            this._init();
            
            console.log('🔧 Helpers inicializado');
        }
        
        // ============================================================
        //  🚀 INICIALIZACIÓN
        //  ============================================================
        _init() {
            // Crear pools por defecto
            this._createPool('vector3', 10);
            this._createPool('color', 10);
            this._createPool('matrix4', 5);
            
            // Si estamos en modo debug, mostrar información
            if (this.config.debug) {
                console.log('🔧 Helpers en modo debug');
            }
        }
        
        // ============================================================
        //  🆔 SISTEMA DE IDs
        //  ============================================================
        
        /**
         * Generar un ID único
         */
        generateId(prefix = this.config.idPrefix) {
            this._idCounter++;
            return `${prefix}${Date.now()}_${this._idCounter}_${Math.random().toString(36).substr(2, 6)}`;
        }
        
        /**
         * Generar un ID corto
         */
        generateShortId() {
            return Math.random().toString(36).substr(2, 9);
        }
        
        /**
         * Generar un UUID v4
         */
        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        // ============================================================
        //  🎨 SISTEMA DE COLORES
        //  ============================================================
        
        /**
         * Convertir hex a RGB
         */
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        
        /**
         * Convertir RGB a hex
         */
        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(c => {
                const hex = Math.round(c).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }
        
        /**
         * Generar color aleatorio
         */
        randomColor() {
            return {
                r: Math.floor(Math.random() * 256),
                g: Math.floor(Math.random() * 256),
                b: Math.floor(Math.random() * 256)
            };
        }
        
        /**
         * Generar paleta de colores
         */
        generatePalette(count = 5, baseColor = null) {
            const colors = [];
            const base = baseColor || this.randomColor();
            
            for (let i = 0; i < count; i++) {
                const hue = (i / count) * 360;
                const hsl = this.rgbToHsl(base.r, base.g, base.b);
                const newHsl = {
                    h: (hsl.h + hue) % 360,
                    s: hsl.s * (0.8 + Math.random() * 0.4),
                    l: hsl.l * (0.6 + Math.random() * 0.4)
                };
                colors.push(this.hslToRgb(newHsl.h, newHsl.s, newHsl.l));
            }
            
            return colors;
        }
        
        /**
         * Convertir RGB a HSL
         */
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
        
        /**
         * Convertir HSL a RGB
         */
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
        
        /**
         * Interpolar colores
         */
        lerpColor(c1, c2, t) {
            return {
                r: this.lerp(c1.r, c2.r, t),
                g: this.lerp(c1.g, c2.g, t),
                b: this.lerp(c1.b, c2.b, t)
            };
        }
        
        // ============================================================
        //  📐 FUNCIONES MATEMÁTICAS
        //  ============================================================
        
        /**
         * Interpolación lineal
         */
        lerp(a, b, t) {
            return a + (b - a) * t;
        }
        
        /**
         * Interpolación suave (smoothstep)
         */
        smoothstep(edge0, edge1, x) {
            const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
            return t * t * (3 - 2 * t);
        }
        
        /**
         * Mapear un valor de un rango a otro
         */
        map(value, fromMin, fromMax, toMin, toMax) {
            return toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin);
        }
        
        /**
         * Clampear un valor
         */
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }
        
        /**
         * Distancia entre dos puntos
         */
        distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
        
        /**
         * Distancia 3D
         */
        distance3d(x1, y1, z1, x2, y2, z2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
        }
        
        /**
         * Ángulo entre dos puntos
         */
        angle(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        }
        
        /**
         * Factorial
         */
        factorial(n) {
            if (n <= 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) result *= i;
            return result;
        }
        
        /**
         * Función de ruido simple (hash)
         */
        hash(seed) {
            let h = seed * 374761393 + 668265263;
            h = (h ^ (h >> 13)) * 1274126177;
            return (h ^ (h >> 16)) & 0x7fffffff;
        }
        
        /**
         * Distribución normal (Box-Muller)
         */
        gaussianRandom(mean = 0, stddev = 1) {
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            return mean + stddev * z;
        }
        
        // ============================================================
        //  📈 SISTEMA DE EASING
        //  ============================================================
        
        /**
         * Funciones de easing (30+)
         */
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
            easeInBounce: (t) => 1 - this.easing.easeOutBounce(1 - t),
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
                    return this.easing.easeInBounce(t * 2) / 2;
                }
                return this.easing.easeOutBounce(t * 2 - 1) / 2 + 0.5;
            }
        };
        
        /**
         * Obtener función de easing por nombre
         */
        getEasing(name) {
            return this.easing[name] || this.easing.linear;
        }
        
        /**
         * Aplicar easing a un valor
         */
        applyEasing(value, easingName = 'linear') {
            const func = this.getEasing(easingName);
            return func(value);
        }
        
        // ============================================================
        //  📦 SISTEMA DE POOLING
        //  ============================================================
        
        /**
         * Crear un pool de objetos
         */
        _createPool(name, size) {
            if (this._pools.has(name)) return;
            this._pools.set(name, {
                objects: [],
                create: () => ({}),
                reset: (obj) => obj,
                maxSize: size || this.config.defaultPoolSize
            });
        }
        
        /**
         * Registrar un pool
         */
        registerPool(name, createFn, resetFn, size = this.config.defaultPoolSize) {
            const pool = {
                objects: [],
                create: createFn,
                reset: resetFn || ((obj) => obj),
                maxSize: size
            };
            
            // Prellenar pool
            for (let i = 0; i < size; i++) {
                pool.objects.push(createFn());
            }
            
            this._pools.set(name, pool);
            return pool;
        }
        
        /**
         * Obtener objeto del pool
         */
        acquire(name) {
            const pool = this._pools.get(name);
            if (!pool) {
                console.warn(`⚠️ Pool "${name}" no encontrado`);
                return null;
            }
            
            if (pool.objects.length === 0) {
                // Crear nuevo objeto
                return pool.create();
            }
            
            return pool.objects.pop();
        }
        
        /**
         * Devolver objeto al pool
         */
        release(name, obj) {
            const pool = this._pools.get(name);
            if (!pool) {
                console.warn(`⚠️ Pool "${name}" no encontrado`);
                return;
            }
            
            // Resetear objeto
            pool.reset(obj);
            
            // Devolver al pool
            if (pool.objects.length < pool.maxSize) {
                pool.objects.push(obj);
            }
        }
        
        /**
         * Limpiar un pool
         */
        clearPool(name) {
            const pool = this._pools.get(name);
            if (pool) {
                pool.objects = [];
            }
        }
        
        // ============================================================
        //  📡 SISTEMA DE EVENTOS
        //  ============================================================
        
        /**
         * Registrar evento
         */
        on(event, callback, context = null) {
            if (!this._eventListeners.has(event)) {
                this._eventListeners.set(event, []);
            }
            this._eventListeners.get(event).push({ callback, context });
        }
        
        /**
         * Eliminar evento
         */
        off(event, callback) {
            if (!this._eventListeners.has(event)) return;
            const listeners = this._eventListeners.get(event);
            this._eventListeners.set(event, listeners.filter(l => l.callback !== callback));
        }
        
        /**
         * Emitir evento
         */
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
        
        /**
         * Emitir evento una vez
         */
        once(event, callback, context = null) {
            const wrapper = (data) => {
                callback.call(context || null, data);
                this.off(event, wrapper);
            };
            this.on(event, wrapper);
        }
        
        /**
         * Limpiar todos los eventos
         */
        clearEvents() {
            this._eventListeners.clear();
        }
        
        // ============================================================
        //  ⏱️ SISTEMA DE TIMERS
        //  ============================================================
        
        /**
         * Crear un timer con nombre
         */
        createTimer(name, callback, interval, autoStart = true) {
            const timer = {
                name: name,
                callback: callback,
                interval: interval,
                running: false,
                elapsed: 0,
                lastTick: 0,
                iterations: 0
            };
            
            this._timers.set(name, timer);
            
            if (autoStart) {
                this.startTimer(name);
            }
            
            return timer;
        }
        
        /**
         * Iniciar timer
         */
        startTimer(name) {
            const timer = this._timers.get(name);
            if (!timer) return;
            
            timer.running = true;
            timer.lastTick = performance.now();
            timer.elapsed = 0;
        }
        
        /**
         * Detener timer
         */
        stopTimer(name) {
            const timer = this._timers.get(name);
            if (!timer) return;
            timer.running = false;
        }
        
        /**
         * Actualizar timers
         */
        updateTimers(delta) {
            for (const [name, timer] of this._timers) {
                if (!timer.running) continue;
                
                timer.elapsed += delta;
                if (timer.elapsed >= timer.interval) {
                    timer.elapsed -= timer.interval;
                    timer.iterations++;
                    
                    try {
                        timer.callback(timer);
                    } catch (e) {
                        console.error(`❌ Error en timer "${name}":`, e);
                    }
                }
            }
        }
        
        /**
         * Eliminar timer
         */
        removeTimer(name) {
            this._timers.delete(name);
        }
        
        // ============================================================
        //  💾 SISTEMA DE CACHÉ
        //  ============================================================
        
        /**
         * Guardar en caché
         */
        cacheSet(key, value, ttl = 0) {
            const entry = {
                value: value,
                timestamp: Date.now(),
                ttl: ttl
            };
            
            this._cache.set(key, entry);
            
            // Limitar tamaño de caché
            if (this._cache.size > this.config.maxCacheSize) {
                const firstKey = this._cache.keys().next().value;
                this._cache.delete(firstKey);
            }
        }
        
        /**
         * Obtener de caché
         */
        cacheGet(key) {
            const entry = this._cache.get(key);
            if (!entry) return null;
            
            // Verificar TTL
            if (entry.ttl > 0 && Date.now() - entry.timestamp > entry.ttl) {
                this._cache.delete(key);
                return null;
            }
            
            return entry.value;
        }
        
        /**
         * Verificar si existe en caché
         */
        cacheHas(key) {
            return this._cache.has(key) && this.cacheGet(key) !== null;
        }
        
        /**
         * Limpiar caché
         */
        cacheClear() {
            this._cache.clear();
        }
        
        /**
         * Limpiar caché expirado
         */
        cacheClean() {
            for (const [key, entry] of this._cache) {
                if (entry.ttl > 0 && Date.now() - entry.timestamp > entry.ttl) {
                    this._cache.delete(key);
                }
            }
        }
        
        // ============================================================
        //  📊 LOGGING SISTEMA
        //  ============================================================
        
        /**
         * Niveles de log
         */
        LOG_LEVELS = {
            silent: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4,
            trace: 5
        };
        
        /**
         * Log con nivel
         */
        log(level, ...args) {
            const currentLevel = this.LOG_LEVELS[this.config.logLevel] || 3;
            const msgLevel = this.LOG_LEVELS[level] || 3;
            
            if (msgLevel > currentLevel) return;
            
            const prefix = `[${level.toUpperCase()}]`;
            
            switch(level) {
                case 'error':
                    console.error(prefix, ...args);
                    break;
                case 'warn':
                    console.warn(prefix, ...args);
                    break;
                case 'debug':
                    console.debug(prefix, ...args);
                    break;
                case 'trace':
                    console.trace(prefix, ...args);
                    break;
                default:
                    console.log(prefix, ...args);
            }
        }
        
        /**
         * Error log
         */
        error(...args) {
            this.log('error', ...args);
        }
        
        /**
         * Warning log
         */
        warn(...args) {
            this.log('warn', ...args);
        }
        
        /**
         * Info log
         */
        info(...args) {
            this.log('info', ...args);
        }
        
        /**
         * Debug log
         */
        debug(...args) {
            this.log('debug', ...args);
        }
        
        /**
         * Trace log
         */
        trace(...args) {
            this.log('trace', ...args);
        }
        
        // ============================================================
        //  🔧 UTILIDADES DE ARRAYS
        //  ============================================================
        
        /**
         * Mezclar array (Fisher-Yates)
         */
        shuffle(array) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
        
        /**
         * Obtener elemento aleatorio de array
         */
        randomElement(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        
        /**
         * Eliminar duplicados de array
         */
        unique(array) {
            return [...new Set(array)];
        }
        
        /**
         * Agrupar array por clave
         */
        groupBy(array, key) {
            return array.reduce((result, item) => {
                const groupKey = typeof key === 'function' ? key(item) : item[key];
                if (!result[groupKey]) result[groupKey] = [];
                result[groupKey].push(item);
                return result;
            }, {});
        }
        
        /**
         * Array chunk
         */
        chunk(array, size) {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        }
        
        // ============================================================
        //  🔧 UTILIDADES DE OBJETOS
        //  ============================================================
        
        /**
         * Clonar objeto profundo
         */
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj);
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            if (obj instanceof Map) return new Map(Array.from(obj.entries()).map(([k, v]) => [k, this.deepClone(v)]));
            if (obj instanceof Set) return new Set(Array.from(obj).map(item => this.deepClone(item)));
            
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
        
        /**
         * Fusionar objetos profundamente
         */
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
        
        /**
         * Obtener valor anidado por ruta
         */
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
        
        /**
         * Establecer valor anidado por ruta
         */
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
        
        // ============================================================
        //  ⏰ UTILIDADES DE TIEMPO
        //  ============================================================
        
        /**
         * Formatear tiempo
         */
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
        
        /**
         * Tiempo actual en formato ISO
         */
        nowISO() {
            return new Date().toISOString();
        }
        
        /**
         * Tiempo actual en formato local
         */
        nowLocal() {
            return new Date().toLocaleString();
        }
        
        // ============================================================
        //  🎯 UTILIDADES DE RENDIMIENTO
        //  ============================================================
        
        /**
         * Medir tiempo de ejecución de una función
         */
        measureTime(fn, context = null) {
            const start = performance.now();
            const result = fn.call(context);
            const time = performance.now() - start;
            return { result, time };
        }
        
        /**
         * Throttle una función
         */
        throttle(fn, limit) {
            let inThrottle = false;
            return function(...args) {
                if (!inThrottle) {
                    fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
        
        /**
         * Debounce una función
         */
        debounce(fn, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn.apply(this, args), delay);
            };
        }
        
        // ============================================================
        //  📊 ESTADÍSTICAS
        //  ============================================================
        
        getStats() {
            return {
                idCounter: this._idCounter,
                cacheSize: this._cache.size,
                pools: Array.from(this._pools.keys()).map(name => ({
                    name,
                    size: this._pools.get(name).objects.length
                })),
                eventListeners: Array.from(this._eventListeners.keys()).map(name => ({
                    name,
                    count: this._eventListeners.get(name).length
                })),
                timers: Array.from(this._timers.keys()).map(name => ({
                    name,
                    running: this._timers.get(name).running
                })),
                logLevel: this.config.logLevel
            };
        }
        
        // ============================================================
        //  🔄 RESET
        //  ============================================================
        
        reset() {
            this._idCounter = 0;
            this._cache.clear();
            this._eventListeners.clear();
            this._timers.clear();
            
            // Limpiar pools
            for (const [name, pool] of this._pools) {
                pool.objects = [];
                // Prellenar de nuevo
                for (let i = 0; i < pool.maxSize; i++) {
                    pool.objects.push(pool.create());
                }
            }
            
            console.log('🔄 Helpers reseteado');
        }
    }
    
    // ============================================================
    //  🚀 INSTANCIA GLOBAL
    //  ============================================================
    const helpers = new Helpers();
    
    // Exponer globalmente
    window.Helpers = helpers;
    
    // También exponer funciones comunes directamente
    window.lerp = helpers.lerp.bind(helpers);
    window.clamp = helpers.clamp.bind(helpers);
    window.randomColor = helpers.randomColor.bind(helpers);
    
    console.log('🔧 Helpers cargado');
    
    // ============================================================
    //  📦 EXPORTAR
    //  ============================================================
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = helpers;
    }
    
})();